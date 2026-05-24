"use server";

import { createClient } from '../supabase/server';
import { calculateTrialBalance, TrialBalanceRow } from './proses';
import { getMasterUnit } from './master-unit';
import { getMasterRekening } from './master-rekening';

// 1. Fetch Buku Besar (General Ledger) details
export async function getBukuBesar(rek: string, koke: string, bulan: string, tahun: string) {
  const supabase = await createClient();
  try {
    // Get beginning balance
    const { data: saldoAwal, error: saError } = await supabase
      .from('saldo_awal')
      .select('DEBET, KREDIT')
      .eq('REK', rek)
      .eq('KOKE', koke)
      .eq('BULAN', bulan)
      .eq('TAHUN', tahun)
      .maybeSingle();

    if (saError) throw saError;

    let begDebet = 0;
    let begKredit = 0;
    if (saldoAwal) {
      begDebet = Number(saldoAwal.DEBET || 0);
      begKredit = Number(saldoAwal.KREDIT || 0);
    }

    // Get mutations
    const { data: mutations, error: mutError } = await supabase
      .from('jurnal_transaksi')
      .select('id, TANGGAL, NO_BUKJUR, URAIAN1, DEBET, KREDIT, REKLA')
      .eq('REK', rek)
      .eq('KOKE', koke)
      .eq('KOBU', bulan)
      .like('TANGGAL', `${tahun}-%`)
      .order('TANGGAL', { ascending: true })
      .order('NO_BUKJUR', { ascending: true });

    if (mutError) throw mutError;

    // Normal side classification
    const isDebitNormal = rek.startsWith('1') || rek.startsWith('5');
    let balance = isDebitNormal ? (begDebet - begKredit) : (begKredit - begDebet);

    const rows = mutations?.map(m => {
      const deb = Number(m.DEBET || 0);
      const kre = Number(m.KREDIT || 0);
      if (isDebitNormal) {
        balance += (deb - kre);
      } else {
        balance += (kre - deb);
      }

      return {
        id: m.id,
        TANGGAL: m.TANGGAL,
        NO_BUKJUR: m.NO_BUKJUR,
        URAIAN1: m.URAIAN1,
        DEBET: deb,
        KREDIT: kre,
        REKLA: m.REKLA,
        SALDO: balance
      };
    }) || [];

    return {
      beginning: { 
        debet: begDebet, 
        kredit: begKredit, 
        balance: isDebitNormal ? (begDebet - begKredit) : (begKredit - begDebet) 
      },
      rows,
      endingBalance: balance,
      isDebitNormal
    };
  } catch (error) {
    console.error("Error in getBukuBesar server action:", error);
    return { 
      beginning: { debet: 0, kredit: 0, balance: 0 }, 
      rows: [], 
      endingBalance: 0, 
      isDebitNormal: true 
    };
  }
}

// 2. Fetch Classified Balance Sheet (Neraca Klasifikasi)
export interface ClassifiedBalanceSheet {
  aktivaLancar: TrialBalanceRow[];
  aktivaTetap: TrialBalanceRow[];
  kewajiban: TrialBalanceRow[];
  ekuitas: TrialBalanceRow[];
  totalAktiva: number;
  totalKewajiban: number;
  totalEkuitas: number;
  totalPasiva: number;
}

export async function getNeracaKlasifikasi(koke: string, bulan: string, tahun: string): Promise<ClassifiedBalanceSheet> {
  try {
    const trialBalance = await calculateTrialBalance(koke, bulan, tahun);

    // Grouping
    const aktivaLancar = trialBalance.filter(r => r.REK.startsWith('11') || r.REK.startsWith('10'));
    const aktivaTetap = trialBalance.filter(r => r.REK.startsWith('12') || (r.REK.startsWith('1') && !r.REK.startsWith('11') && !r.REK.startsWith('10')));
    const kewajiban = trialBalance.filter(r => r.REK.startsWith('2'));
    const ekuitas = trialBalance.filter(r => r.REK.startsWith('3'));

    // Summing helper (net asset is debit normal, liability/equity is credit normal)
    const sumNetValue = (rows: TrialBalanceRow[], isDebitNormal: boolean) => {
      return rows.reduce((sum, r) => {
        const val = isDebitNormal 
          ? (r.AKHIR_DEBET - r.AKHIR_KREDIT) 
          : (r.AKHIR_KREDIT - r.AKHIR_DEBET);
        return sum + val;
      }, 0);
    };

    const totalAktivaLancar = sumNetValue(aktivaLancar, true);
    const totalAktivaTetap = sumNetValue(aktivaTetap, true);
    const totalAktiva = totalAktivaLancar + totalAktivaTetap;

    const totalKewajiban = sumNetValue(kewajiban, false);
    const totalEkuitas = sumNetValue(ekuitas, false);
    const totalPasiva = totalKewajiban + totalEkuitas;

    return {
      aktivaLancar,
      aktivaTetap,
      kewajiban,
      ekuitas,
      totalAktiva,
      totalKewajiban,
      totalEkuitas,
      totalPasiva
    };
  } catch (error) {
    console.error("Error generating classified balance sheet:", error);
    return {
      aktivaLancar: [],
      aktivaTetap: [],
      kewajiban: [],
      ekuitas: [],
      totalAktiva: 0,
      totalKewajiban: 0,
      totalEkuitas: 0,
      totalPasiva: 0
    };
  }
}

// 3. Fetch Consolidation / Side-by-side Balance Sheet (Neraca Kompilasi)
export interface KompilasiRow {
  REK: string;
  NAMA_PERK: string;
  balances: { [koke: string]: number }; // koke -> balance (net value)
  total: number;
}

export async function getNeracaKompilasi(bulan: string, tahun: string): Promise<{ units: string[]; rows: KompilasiRow[] }> {
  try {
    const activeUnits = await getMasterUnit();
    const unitCodes = activeUnits.map(u => u.KOKE);
    const coaList = await getMasterRekening();

    // Fetch trial balance for each unit
    const unitTrialBalances = await Promise.all(
      unitCodes.map(async koke => {
        const tb = await calculateTrialBalance(koke, bulan, tahun);
        const tbMap = new Map<string, number>();
        tb.forEach(r => {
          const isDebitNormal = r.REK.startsWith('1') || r.REK.startsWith('5');
          const netVal = isDebitNormal 
            ? (r.AKHIR_DEBET - r.AKHIR_KREDIT) 
            : (r.AKHIR_KREDIT - r.AKHIR_DEBET);
          tbMap.set(r.REK, netVal);
        });
        return { koke, tbMap };
      })
    );

    // Merge by COA
    const rows: KompilasiRow[] = coaList.map(coa => {
      const balances: { [koke: string]: number } = {};
      let total = 0;

      unitTrialBalances.forEach(utb => {
        const val = utb.tbMap.get(coa.REKSUB) || 0;
        balances[utb.koke] = val;
        total += val;
      });

      return {
        REK: coa.REKSUB,
        NAMA_PERK: coa.NAMA_PERK,
        balances,
        total
      };
    }).filter(r => r.total !== 0 || Object.values(r.balances).some(b => b !== 0));

    return {
      units: unitCodes,
      rows
    };
  } catch (error) {
    console.error("Error generating compiled balance sheet:", error);
    return { units: [], rows: [] };
  }
}

// 4. Fetch LNET Management Report Data (Laporan Manajemen)
export async function getLNETData(koke: string, bulan: string, tahun: string) {
  const supabase = await createClient();
  try {
    const { data: cachedRows, error } = await supabase
      .from('laporan_manajemen_netral')
      .select('*')
      .eq('KOKE', koke)
      .eq('BULAN', bulan)
      .eq('TAHUN', tahun);

    if (error) throw error;

    const coaList = await getMasterRekening();
    const coaMap = new Map<string, string>();
    coaList.forEach(c => coaMap.set(c.REKSUB, c.NAMA_PERK));

    const results = cachedRows?.map(row => ({
      ...row,
      NAMA_PERK: coaMap.get(row.REK) || 'Rekening Akun'
    })) || [];

    return results;
  } catch (error) {
    console.error("Error fetching LNET data:", error);
    return [];
  }
}
