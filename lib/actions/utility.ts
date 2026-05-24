"use server";

import { createClient } from '../supabase/server';

export interface AuditReport {
  orphanCOAs: string[];
  duplicateVouchers: string[];
  unbalancedJournals: { voucher: string; diff: number }[];
  healthy: boolean;
}

// 1. Audit Database Integrity
export async function auditDatabase(): Promise<AuditReport> {
  const supabase = await createClient();
  try {
    const orphanCOAs: string[] = [];
    const duplicateVouchers: string[] = [];
    const unbalancedJournals: { voucher: string; diff: number }[] = [];

    // 1. Check parent COA links
    const { data: coaList } = await supabase
      .from('master_rekening')
      .select('REK, REKSUB, NAMA_PERK');

    if (coaList) {
      const coaParents = new Set(coaList.map(c => c.REK));
      coaList.forEach(c => {
        // If parent code REK is not itself or empty, and not in list of parent codes
        if (c.REK && c.REK !== c.REKSUB && !coaParents.has(c.REK)) {
          orphanCOAs.push(`Rekening ${c.REKSUB} memiliki induk ${c.REK} yang tidak valid.`);
        }
      });
    }

    // 2. Check unbalanced journal sequences
    const { data: journals } = await supabase
      .from('jurnal_transaksi')
      .select('NO_BUKJUR, DEBET, KREDIT');

    if (journals) {
      // Group by voucher
      const voucherMap = new Map<string, { debet: number; kredit: number; count: number }>();
      journals.forEach(j => {
        const existing = voucherMap.get(j.NO_BUKJUR) || { debet: 0, kredit: 0, count: 0 };
        voucherMap.set(j.NO_BUKJUR, {
          debet: existing.debet + Number(j.DEBET || 0),
          kredit: existing.kredit + Number(j.KREDIT || 0),
          count: existing.count + 1
        });
      });

      voucherMap.forEach((val, key) => {
        const diff = Math.abs(val.debet - val.kredit);
        if (diff > 0.01) {
          unbalancedJournals.push({ voucher: key, diff });
        }
      });
    }

    const healthy = orphanCOAs.length === 0 && unbalancedJournals.length === 0;

    return {
      orphanCOAs,
      duplicateVouchers,
      unbalancedJournals,
      healthy
    };
  } catch (error) {
    console.error("Error running database audit:", error);
    return { orphanCOAs: [], duplicateVouchers: [], unbalancedJournals: [], healthy: false };
  }
}

// 2. Export Entire Database Backup
export async function exportBackup() {
  const supabase = await createClient();
  try {
    const { data: units } = await supabase.from('master_unit').select('*');
    const { data: coa } = await supabase.from('master_rekening').select('*');
    const { data: saldoAwal } = await supabase.from('saldo_awal').select('*');
    const { data: journals } = await supabase.from('jurnal_transaksi').select('*');

    return {
      backupDate: new Date().toISOString(),
      version: '1.0.0',
      data: {
        master_unit: units || [],
        master_rekening: coa || [],
        saldo_awal: saldoAwal || [],
        jurnal_transaksi: journals || []
      }
    };
  } catch (error: any) {
    console.error("Error creating export backup:", error);
    throw new Error(error.message);
  }
}

// 3. Import and Restore Backup
export async function importBackup(payload: any) {
  const supabase = await createClient();
  try {
    const { data } = payload;
    if (!data) throw new Error("Invalid backup payload data.");

    // Restore units
    if (Array.isArray(data.master_unit) && data.master_unit.length > 0) {
      await supabase.from('master_unit').delete().neq('id', 0); // truncate
      const { error: err } = await supabase.from('master_unit').insert(data.master_unit);
      if (err) throw err;
    }

    // Restore coa
    if (Array.isArray(data.master_rekening) && data.master_rekening.length > 0) {
      await supabase.from('master_rekening').delete().neq('id', 0); // truncate
      const { error: err } = await supabase.from('master_rekening').insert(data.master_rekening);
      if (err) throw err;
    }

    // Restore saldo_awal
    if (Array.isArray(data.saldo_awal) && data.saldo_awal.length > 0) {
      await supabase.from('saldo_awal').delete().neq('id', 0); // truncate
      const { error: err } = await supabase.from('saldo_awal').insert(data.saldo_awal);
      if (err) throw err;
    }

    // Restore jurnal_transaksi
    if (Array.isArray(data.jurnal_transaksi) && data.jurnal_transaksi.length > 0) {
      await supabase.from('jurnal_transaksi').delete().neq('id', 0); // truncate
      const { error: err } = await supabase.from('jurnal_transaksi').insert(data.jurnal_transaksi);
      if (err) throw err;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error restoring database import:", error);
    throw new Error(error.message);
  }
}
