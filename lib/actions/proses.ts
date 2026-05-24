"use server";

import { createClient } from '../supabase/server';
import { revalidatePath } from 'next/cache';
import { getMasterRekening } from './master-rekening';

export interface TrialBalanceRow {
  REK: string;
  NAMA_PERK: string;
  AWAL_DEBET: number;
  AWAL_KREDIT: number;
  MUTASI_DEBET: number;
  MUTASI_KREDIT: number;
  AKHIR_DEBET: number;
  AKHIR_KREDIT: number;
}

// 1. Calculate Trial Balance (Neraca Percobaan)
export async function calculateTrialBalance(koke: string, bulan: string, tahun: string): Promise<TrialBalanceRow[]> {
  const supabase = await createClient();
  try {
    // Fetch master rekening
    const coaList = await getMasterRekening();
    
    // Fetch saldo awal
    const { data: saldoAwal, error: saError } = await supabase
      .from('saldo_awal')
      .select('REK, DEBET, KREDIT')
      .eq('KOKE', koke)
      .eq('BULAN', bulan)
      .eq('TAHUN', tahun);

    if (saError) throw saError;

    // Fetch jurnal transaksi for mutasi
    const { data: mutasi, error: mutError } = await supabase
      .from('jurnal_transaksi')
      .select('REK, DEBET, KREDIT')
      .eq('KOKE', koke)
      .eq('KOBU', bulan)
      .like('TANGGAL', `${tahun}-%`);

    if (mutError) throw mutError;

    // Map to memory
    const saMap = new Map<string, { debet: number; kredit: number }>();
    saldoAwal?.forEach(row => {
      saMap.set(row.REK, { debet: Number(row.DEBET || 0), kredit: Number(row.KREDIT || 0) });
    });

    const mutMap = new Map<string, { debet: number; kredit: number }>();
    mutasi?.forEach(row => {
      const existing = mutMap.get(row.REK) || { debet: 0, kredit: 0 };
      mutMap.set(row.REK, {
        debet: existing.debet + Number(row.DEBET || 0),
        kredit: existing.kredit + Number(row.KREDIT || 0)
      });
    });

    // Build rows
    const result: TrialBalanceRow[] = coaList.map(coa => {
      const sa = saMap.get(coa.REKSUB) || { debet: 0, kredit: 0 };
      const mut = mutMap.get(coa.REKSUB) || { debet: 0, kredit: 0 };

      // Calculate Akhir
      const netAwal = sa.debet - sa.kredit;
      const netMutasi = mut.debet - mut.kredit;
      const netAkhir = netAwal + netMutasi;

      let akhirDebet = 0;
      let akhirKredit = 0;
      if (netAkhir > 0) {
        akhirDebet = netAkhir;
      } else if (netAkhir < 0) {
        akhirKredit = Math.abs(netAkhir);
      }

      return {
        REK: coa.REKSUB,
        NAMA_PERK: coa.NAMA_PERK,
        AWAL_DEBET: sa.debet,
        AWAL_KREDIT: sa.kredit,
        MUTASI_DEBET: mut.debet,
        MUTASI_KREDIT: mut.kredit,
        AKHIR_DEBET: akhirDebet,
        AKHIR_KREDIT: akhirKredit
      };
    });

    return result.filter(r => r.AWAL_DEBET > 0 || r.AWAL_KREDIT > 0 || r.MUTASI_DEBET > 0 || r.MUTASI_KREDIT > 0);
  } catch (error) {
    console.error("Error calculating trial balance:", error);
    return [];
  }
}

// 2. LNET Laporan Manajemen Calculation and Caching
export async function prosesLNET(koke: string, bulan: string, tahun: string) {
  const supabase = await createClient();
  try {
    const coaList = await getMasterRekening();

    // 1. Fetch Saldo Awal Bulan Ini (untuk saldo awal biaya s/d bulan lalu)
    const { data: saldoAwal, error: saError } = await supabase
      .from('saldo_awal')
      .select('REK, DEBET, KREDIT')
      .eq('KOKE', koke)
      .eq('BULAN', bulan)
      .eq('TAHUN', tahun);

    if (saError) throw saError;

    // 2. Fetch Mutasi Bulan Ini (BI)
    const { data: mutasiBI, error: mutBiError } = await supabase
      .from('jurnal_transaksi')
      .select('REK, DEBET, KREDIT')
      .eq('KOKE', koke)
      .eq('KOBU', bulan)
      .like('TANGGAL', `${tahun}-%`);

    if (mutBiError) throw mutBiError;

    // 3. Fetch Mutasi S/D Bulan Ini (SD)
    // Bulan-bulan s/d bulan ini (misal: jika bulan = "03", maka "01", "02", "03")
    const bulanInt = parseInt(bulan);
    const targetBulanCodes: string[] = [];
    for (let i = 1; i <= bulanInt; i++) {
      targetBulanCodes.push(i.toString().padStart(2, '0'));
    }

    const { data: mutasiSD, error: mutSdError } = await supabase
      .from('jurnal_transaksi')
      .select('REK, DEBET, KREDIT')
      .eq('KOKE', koke)
      .in('KOBU', targetBulanCodes)
      .like('TANGGAL', `${tahun}-%`);

    if (mutSdError) throw mutSdError;

    // 4. Fetch Anggaran (RAB)
    const { data: anggaran, error: angError } = await supabase
      .from('anggaran_rabi')
      .select('*')
      .eq('KOKE', koke)
      .eq('TAHUN', tahun);

    if (angError) throw angError;

    // Maps
    const saMap = new Map<string, number>();
    saldoAwal?.forEach(row => {
      // Net debet - kredit
      saMap.set(row.REK, Number(row.DEBET || 0) - Number(row.KREDIT || 0));
    });

    const biMap = new Map<string, number>();
    mutasiBI?.forEach(row => {
      const existing = biMap.get(row.REK) || 0;
      biMap.set(row.REK, existing + (Number(row.DEBET || 0) - Number(row.KREDIT || 0)));
    });

    const sdMap = new Map<string, number>();
    mutasiSD?.forEach(row => {
      const existing = sdMap.get(row.REK) || 0;
      sdMap.set(row.REK, existing + (Number(row.DEBET || 0) - Number(row.KREDIT || 0)));
    });

    const angMap = new Map<string, any>();
    anggaran?.forEach(row => {
      angMap.set(row.REK, row);
    });

    // Prepare rows for upsert
    const upsertRows = coaList.map(coa => {
      const rek = coa.REKSUB;
      const actualBI = biMap.get(rek) || 0;
      const actualSD = sdMap.get(rek) || 0;
      
      // Saldo s/d Bulan Lalu
      const salBlnLal = actualSD - actualBI;

      // Anggaran/RAB
      const angRow = angMap.get(rek);
      let angBI = 0;
      let angSD = 0;
      let salRabLal = 0;

      if (angRow) {
        // Anggaran Bulan Ini
        const colBI = `BULAN_${bulan}`;
        angBI = Number(angRow[colBI] || 0);

        // Anggaran S/D Bulan Ini
        for (let i = 1; i <= bulanInt; i++) {
          const colName = `BULAN_${i.toString().padStart(2, '0')}`;
          angSD += Number(angRow[colName] || 0);
        }

        // Anggaran s/d Bulan Lalu
        salRabLal = angSD - angBI;
      }

      return {
        KOKE: koke,
        BULAN: bulan,
        TAHUN: tahun,
        REK: rek,
        SALBULNLAL: salBlnLal,
        SALRABLAL: salRabLal,
        BIAYABI: actualBI,
        BIAYASD: actualSD,
        ANGGARANBI: angBI,
        ANGGARANSD: angSD
      };
    });

    // Filter rows that have any transactional or budget values to avoid clogging database
    const activeRows = upsertRows.filter(r => 
      r.SALBULNLAL !== 0 || r.SALRABLAL !== 0 || 
      r.BIAYABI !== 0 || r.BIAYASD !== 0 || 
      r.ANGGARANBI !== 0 || r.ANGGARANSD !== 0
    );

    if (activeRows.length > 0) {
      // Delete old entries for this session before saving to avoid duplicate constraint issues
      await supabase
        .from('laporan_manajemen_netral')
        .delete()
        .eq('KOKE', koke)
        .eq('BULAN', bulan)
        .eq('TAHUN', tahun);

      const { error: upsertError } = await supabase
        .from('laporan_manajemen_netral')
        .insert(activeRows);

      if (upsertError) throw upsertError;
    }

    revalidatePath('/laporan-manajemen');
    return { success: true, count: activeRows.length };
  } catch (error: any) {
    console.error("Error executing LNET calculation:", error);
    throw new Error(error.message);
  }
}

// 3. Import / Append Kas & Gudang Excel/CSV Data
export async function appendKasGudangData(rows: any[]) {
  const supabase = await createClient();
  try {
    if (rows.length === 0) return { success: true, count: 0 };

    // Fetch master accounts for validation
    const coaList = await getMasterRekening();
    const coaSet = new Set(coaList.map(c => c.REKSUB));

    // Validate accounts
    const validatedRows = rows.map((row, index) => {
      const rek = String(row.REK || '').trim();
      const rekla = String(row.REKLA || '').trim();

      if (!coaSet.has(rek)) {
        throw new Error(`Baris ${index + 1}: Kode Akun '${rek}' tidak ditemukan di COA.`);
      }
      if (rekla && !coaSet.has(rekla)) {
        throw new Error(`Baris ${index + 1}: Kode Akun Lawan '${rekla}' tidak ditemukan di COA.`);
      }

      return {
        KOKE: String(row.KOKE).trim(),
        KOBU: String(row.KOBU).trim(),
        NO_BUKJUR: String(row.NO_BUKJUR).trim(),
        TANGGAL: String(row.TANGGAL).trim(),
        REK: rek,
        REKLA: rekla,
        NAREK: String(row.NAREK || '').trim(),
        URAIAN1: String(row.URAIAN1 || '').trim(),
        DEBET: Number(row.DEBET || 0),
        KREDIT: Number(row.KREDIT || 0)
      };
    });

    // Check sum balancing
    let totalDebet = 0;
    let totalKredit = 0;
    validatedRows.forEach(r => {
      totalDebet += r.DEBET;
      totalKredit += r.KREDIT;
    });

    if (Math.abs(totalDebet - totalKredit) > 0.01) {
      throw new Error(`Ketidakseimbangan Saldo: Total Debet (${totalDebet}) tidak sama dengan Total Kredit (${totalKredit}). Selisih: ${Math.abs(totalDebet - totalKredit)}`);
    }

    // Insert
    const { error } = await supabase
      .from('jurnal_transaksi')
      .insert(validatedRows);

    if (error) throw error;

    revalidatePath('/laporan-jurnal');
    return { success: true, count: validatedRows.length };
  } catch (error: any) {
    console.error("Error appending transactions:", error);
    throw new Error(error.message);
  }
}
