'use client';

import * as React from 'react';
import { 
  TrendingUp, 
  RefreshCw, 
  FileCheck, 
  AlertTriangle, 
  ArrowRight,
  ChevronRight,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAccounting } from '@/hooks/use-accounting-context';
import { getLNETData } from '@/lib/actions/laporan';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function LaporanManajemenPage() {
  const { koke, bulan, tahun, isSessionActive } = useAccounting();
  const [lnetRows, setLnetRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const loadData = async () => {
    if (!isSessionActive) return;
    setLoading(true);
    try {
      const data = await getLNETData(koke, bulan, tahun);
      setLnetRows(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [koke, bulan, tahun, isSessionActive]);

  if (!isSessionActive) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/40 dark:bg-transparent h-full">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
          <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-zinc-150 tracking-tight uppercase">Sesi Belum Aktif</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-2 leading-relaxed">
            Pilih Unit Kebun, Bulan, dan Tahun di baris menu atas terlebih dahulu untuk menampilkan Laporan Manajemen.
          </p>
        </div>
      </div>
    );
  }

  // Calculate summary values
  let totalActualBI = 0;
  let totalBudgetBI = 0;
  let totalActualSD = 0;
  let totalBudgetSD = 0;

  lnetRows.forEach(r => {
    totalActualBI += Number(r.BIAYABI || 0);
    totalBudgetBI += Number(r.ANGGARANBI || 0);
    totalActualSD += Number(r.BIAYASD || 0);
    totalBudgetSD += Number(r.ANGGARANSD || 0);
  });

  const deltaBI = totalBudgetBI - totalActualBI;
  const percentBI = totalBudgetBI > 0 ? (totalActualBI / totalBudgetBI) * 100 : 0;
  const isOverBudgetBI = totalActualBI > totalBudgetBI;

  const deltaSD = totalBudgetSD - totalActualSD;
  const percentSD = totalBudgetSD > 0 ? (totalActualSD / totalBudgetSD) * 100 : 0;
  const isOverBudgetSD = totalActualSD > totalBudgetSD;

  // Filter top expense accounts for visualization
  const topExpenses = [...lnetRows]
    .filter(r => r.BIAYABI > 0 || r.ANGGARANBI > 0)
    .sort((a, b) => b.BIAYABI - a.BIAYABI)
    .slice(0, 5);

  const maxExpenseVal = Math.max(...topExpenses.map(e => Math.max(e.BIAYABI, e.ANGGARANBI)), 1);

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 space-y-6 flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Laporan Manajemen (LNET)
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">
            Analisis variance real-time Anggaran vs Realisasi Biaya untuk Unit <span className="text-emerald-600 font-bold">{koke}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={loadData} 
            variant="outline" 
            size="sm" 
            className="border-slate-200 dark:border-zinc-800 h-9 font-bold text-xs"
            disabled={loading}
          >
            <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", loading && "animate-spin")} /> Refresh Data
          </Button>
          <Link href="/proses">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 font-bold text-xs">
              <Activity className="w-3.5 h-3.5 mr-1.5" /> Hitung LNET Baru
            </Button>
          </Link>
        </div>
      </div>

      {lnetRows.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-8 text-center max-w-lg mx-auto space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 uppercase">Cache LNET Belum Terbuat</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed font-semibold">
            Data laporan manajemen LNET untuk Unit <strong>{koke}</strong> periode <strong>{bulan}/{tahun}</strong> belum dihitung atau tidak memiliki data aktivitas.
          </p>
          <div className="pt-2">
            <Link href="/proses">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
                Jalankan Kalkulasi LNET Sekarang <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Metrics summary grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Metric BI */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Anggaran vs Aktual (Bulan Ini)</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 font-mono">
                    Rp {totalActualBI.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">Aktual</span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-1">
                  Anggaran: <span className="font-mono">Rp {totalBudgetBI.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-zinc-850 pt-3 flex justify-between items-center text-xs">
                <div className="flex items-center gap-1">
                  {isOverBudgetBI ? (
                    <span className="p-1 rounded bg-rose-500/10 text-rose-600 flex items-center gap-0.5 font-bold">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Over Budget
                    </span>
                  ) : (
                    <span className="p-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 flex items-center gap-0.5 font-bold">
                      <ArrowDownRight className="w-3.5 h-3.5" /> Under Budget
                    </span>
                  )}
                  <span className="text-slate-500 dark:text-zinc-400 font-bold font-mono">({percentBI.toFixed(1)}%)</span>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-slate-400 font-bold">Selisih/Variance:</div>
                  <div className={cn("font-bold font-mono text-[11px]", isOverBudgetBI ? "text-rose-600" : "text-emerald-700 dark:text-emerald-450")}>
                    Rp {Math.abs(deltaBI).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            </div>

            {/* Metric SD */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Anggaran vs Aktual (S/D Bulan Ini YTD)</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 font-mono">
                    Rp {totalActualSD.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">Aktual</span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-1">
                  Anggaran YTD: <span className="font-mono">Rp {totalBudgetSD.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-zinc-850 pt-3 flex justify-between items-center text-xs">
                <div className="flex items-center gap-1">
                  {isOverBudgetSD ? (
                    <span className="p-1 rounded bg-rose-500/10 text-rose-600 flex items-center gap-0.5 font-bold">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Over Budget
                    </span>
                  ) : (
                    <span className="p-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 flex items-center gap-0.5 font-bold">
                      <ArrowDownRight className="w-3.5 h-3.5" /> Under Budget
                    </span>
                  )}
                  <span className="text-slate-500 dark:text-zinc-400 font-bold font-mono">({percentSD.toFixed(1)}%)</span>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-slate-400 font-bold">Selisih/Variance:</div>
                  <div className={cn("font-bold font-mono text-[11px]", isOverBudgetSD ? "text-rose-600" : "text-emerald-700 dark:text-emerald-450")}>
                    Rp {Math.abs(deltaSD).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">Visualisasi 5 Pengeluaran Bulanan Terbesar (BI)</span>
            <div className="space-y-4 font-sans text-xs">
              {topExpenses.map(item => {
                const actPct = (item.BIAYABI / maxExpenseVal) * 100;
                const budPct = (item.ANGGARANBI / maxExpenseVal) * 100;
                
                return (
                  <div key={item.REK} className="space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-zinc-300">
                      <span>[{item.REK}] {item.NAMA_PERK}</span>
                      <span className="font-mono text-[11px]">
                        Act: <strong className="text-slate-900 dark:text-zinc-100">Rp {item.BIAYABI.toLocaleString('id-ID')}</strong> | 
                        Bud: <span className="text-slate-500">Rp {item.ANGGARANBI.toLocaleString('id-ID')}</span>
                      </span>
                    </div>

                    <div className="h-5.5 flex flex-col gap-1 w-full bg-slate-50 dark:bg-zinc-950/20 rounded p-1 border border-slate-100 dark:border-zinc-850">
                      {/* Actual bar */}
                      <div className="flex items-center h-2">
                        <div 
                          className="h-full bg-emerald-600 rounded transition-all duration-500 shadow-sm" 
                          style={{ width: `${actPct}%` }}
                        />
                        <span className="text-[8px] font-black font-mono text-slate-400 ml-1.5">Realisasi</span>
                      </div>
                      
                      {/* Budget bar */}
                      <div className="flex items-center h-2">
                        <div 
                          className="h-full bg-slate-300 dark:bg-zinc-800 rounded transition-all duration-500" 
                          style={{ width: `${budPct}%` }}
                        />
                        <span className="text-[8px] font-black font-mono text-slate-400 ml-1.5">RAB</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Variance table grid */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-950/20">
              <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">Tabel Matriks Variance Seluruh Akun Biaya</span>
            </div>

            <div className="overflow-auto max-h-96">
              <table className="w-full text-left text-[10px] border-collapse min-w-[900px]">
                <thead className="bg-slate-50/50 dark:bg-zinc-900/60 text-[9px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-3 py-2.5 font-black" rowSpan={2}>COA</th>
                    <th className="px-3 py-2.5 font-black" rowSpan={2}>Nama Biaya</th>
                    <th className="px-3 py-2.5 font-black text-center border-l border-slate-200 dark:border-zinc-850" colSpan={3}>Realisasi Bulanan (BI)</th>
                    <th className="px-3 py-2.5 font-black text-center border-l border-slate-200 dark:border-zinc-850" colSpan={3}>Kumulatif YTD (SD)</th>
                    <th className="px-3 py-2.5 font-black text-center border-l border-slate-200 dark:border-zinc-850" rowSpan={2}>Status</th>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-zinc-800">
                    <th className="px-3 py-1.5 font-black text-right border-l border-slate-200 dark:border-zinc-850">Aktual</th>
                    <th className="px-3 py-1.5 font-black text-right">RAB</th>
                    <th className="px-3 py-1.5 font-black text-right">Varian</th>
                    <th className="px-3 py-1.5 font-black text-right border-l border-slate-200 dark:border-zinc-850">Aktual</th>
                    <th className="px-3 py-1.5 font-black text-right">RAB YTD</th>
                    <th className="px-3 py-1.5 font-black text-right">Varian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-850 font-mono">
                  {lnetRows.map(row => {
                    const rowDeltaBI = row.ANGGARANBI - row.BIAYABI;
                    const rowDeltaSD = row.ANGGARANSD - row.BIAYASD;
                    const isOverBI = row.BIAYABI > row.ANGGARANBI;

                    return (
                      <tr key={row.REK} className="hover:bg-slate-50/40 dark:hover:bg-zinc-900/10 transition-colors">
                        <td className="px-3 py-2 font-bold text-slate-800 dark:text-zinc-200">{row.REK}</td>
                        <td className="px-3 py-2 font-sans font-bold text-slate-700 dark:text-zinc-300 truncate max-w-[180px]">
                          {row.NAMA_PERK}
                        </td>
                        
                        <td className="px-3 py-2 text-right border-l border-slate-200 dark:border-zinc-850">
                          {row.BIAYABI > 0 ? row.BIAYABI.toLocaleString('id-ID') : '-'}
                        </td>
                        <td className="px-3 py-2 text-right text-slate-500">
                          {row.ANGGARANBI > 0 ? row.ANGGARANBI.toLocaleString('id-ID') : '-'}
                        </td>
                        <td className={cn("px-3 py-2 text-right font-bold", rowDeltaBI < 0 ? "text-rose-600" : "text-emerald-700 dark:text-emerald-450")}>
                          {rowDeltaBI !== 0 ? rowDeltaBI.toLocaleString('id-ID') : '-'}
                        </td>

                        <td className="px-3 py-2 text-right border-l border-slate-200 dark:border-zinc-850">
                          {row.BIAYASD > 0 ? row.BIAYASD.toLocaleString('id-ID') : '-'}
                        </td>
                        <td className="px-3 py-2 text-right text-slate-500">
                          {row.ANGGARANSD > 0 ? row.ANGGARANSD.toLocaleString('id-ID') : '-'}
                        </td>
                        <td className={cn("px-3 py-2 text-right font-bold", rowDeltaSD < 0 ? "text-rose-600" : "text-emerald-700 dark:text-emerald-450")}>
                          {rowDeltaSD !== 0 ? rowDeltaSD.toLocaleString('id-ID') : '-'}
                        </td>

                        <td className="px-3 py-2 text-center border-l border-slate-200 dark:border-zinc-850">
                          {isOverBI ? (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-455 font-bold text-[9px]">OVER</span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-450 font-bold text-[9px]">OK</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
