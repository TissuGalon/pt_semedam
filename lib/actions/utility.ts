"use server";

import { createClient } from '../supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

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

// 3. Import and Restore Backup (Legacy kept for compatibility, corrected to be FK safe)
export async function importBackup(payload: any) {
  const supabase = await createClient();
  try {
    const { data } = payload;
    if (!data) throw new Error("Invalid backup payload data.");

    // Delete in correct order (FK safe)
    await supabase.from('jurnal_transaksi').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('saldo_awal').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('master_rekening').delete().neq('REKSUB', '_dummy_');
    await supabase.from('master_unit').delete().neq('KOKE', '_dummy_');

    // Insert in correct order (FK safe)
    if (Array.isArray(data.master_unit) && data.master_unit.length > 0) {
      const { error } = await supabase.from('master_unit').insert(data.master_unit);
      if (error) throw error;
    }
    if (Array.isArray(data.master_rekening) && data.master_rekening.length > 0) {
      const { error } = await supabase.from('master_rekening').insert(data.master_rekening);
      if (error) throw error;
    }
    if (Array.isArray(data.saldo_awal) && data.saldo_awal.length > 0) {
      const { error } = await supabase.from('saldo_awal').insert(data.saldo_awal);
      if (error) throw error;
    }
    if (Array.isArray(data.jurnal_transaksi) && data.jurnal_transaksi.length > 0) {
      const { error } = await supabase.from('jurnal_transaksi').insert(data.jurnal_transaksi);
      if (error) throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error restoring database import:", error);
    throw new Error(error.message);
  }
}

// 4. Get Row Counts for Export
export async function getExportMetadata() {
  noStore();
  const supabase = await createClient();
  try {
    const { count: unitCount, error: err1 } = await supabase.from('master_unit').select('*', { count: 'exact', head: true });
    const { count: coaCount, error: err2 } = await supabase.from('master_rekening').select('*', { count: 'exact', head: true });
    const { count: saldoCount, error: err3 } = await supabase.from('saldo_awal').select('*', { count: 'exact', head: true });
    const { count: journalCount, error: err4 } = await supabase.from('jurnal_transaksi').select('*', { count: 'exact', head: true });

    if (err1 || err2 || err3 || err4) {
      throw new Error(err1?.message || err2?.message || err3?.message || err4?.message);
    }

    return {
      master_unit: unitCount || 0,
      master_rekening: coaCount || 0,
      saldo_awal: saldoCount || 0,
      jurnal_transaksi: journalCount || 0
    };
  } catch (error: any) {
    console.error("Error getting export metadata:", error);
    throw new Error(error.message);
  }
}

// 5. Fetch a specific chunk of a table for export
export async function getExportTableChunk(tableName: string, offset: number, limit: number) {
  noStore();
  const supabase = await createClient();
  try {
    let query = supabase.from(tableName).select('*').range(offset, offset + limit - 1);
    
    if (tableName === 'master_unit') {
      query = query.order('KOKE', { ascending: true });
    } else if (tableName === 'master_rekening') {
      query = query.order('REKSUB', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: true });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error(`Error fetching chunk for table ${tableName}:`, error);
    throw new Error(error.message);
  }
}

// 6. Delete all rows from a table (preparing for restore)
export async function clearTableForImport(tableName: string) {
  const supabase = await createClient();
  try {
    let result;
    if (tableName === 'jurnal_transaksi' || tableName === 'saldo_awal') {
      result = await supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } else if (tableName === 'master_unit') {
      result = await supabase.from(tableName).delete().neq('KOKE', '_dummy_');
    } else if (tableName === 'master_rekening') {
      result = await supabase.from(tableName).delete().neq('REKSUB', '_dummy_');
    } else {
      throw new Error(`Unknown table name: ${tableName}`);
    }

    if (result.error) throw result.error;
    return { success: true };
  } catch (error: any) {
    console.error(`Error clearing table ${tableName}:`, error);
    throw new Error(error.message);
  }
}

// 7. Insert a chunk of data (bulk insert)
export async function importTableChunk(tableName: string, chunk: any[]) {
  const supabase = await createClient();
  try {
    if (!Array.isArray(chunk) || chunk.length === 0) return { success: true };
    const { error } = await supabase.from(tableName).insert(chunk);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error(`Error importing chunk into ${tableName}:`, error);
    throw new Error(error.message);
  }
}

// 8. Get Available Years from Database (Distinct years from transactions & initial balances)
export async function getAvailableYears(): Promise<string[]> {
  noStore();
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.rpc('get_available_years');
    if (error) throw error;
    
    // Map array of results to string years
    const years = (data || []).map((item: any) => item.tahun) as string[];
    
    // If empty, fallback to current year
    if (years.length === 0) {
      return [new Date().getFullYear().toString()];
    }
    
    return years;
  } catch (error: any) {
    console.error("Error getting available years:", error);
    return [new Date().getFullYear().toString()];
  }
}
