'use client';

import * as React from 'react';
import { 
  Play, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  RefreshCw,
  TrendingUp,
  FileCheck,
  Award
} from 'lucide-react';
import { useAccounting } from '@/hooks/use-accounting-context';
import { calculateTrialBalance, prosesLNET, TrialBalanceRow } from '@/lib/actions/proses';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ProsesPage() {
  const { koke, bulan, tahun, isSessionActive } = useAccounting();
  const [tbData, setTbData] = React.useState<TrialBalanceRow[]>([]);
  const [loadingTB, setLoadingTB] = React.useState(false);
  const [loadingLNET, setLoadingLNET] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Totals for Trial Balance
  const [totals, setTotals] = React.useState({
    awalDeb: 0,
    awalKre: 0,
    mutDeb: 0,
    mutKre: 0,
    akhirDeb: 0,
    akhirKre: 0
  });

  const loadTrialBalance = async () => {
    if (!isSessionActive) return;
    setLoadingTB(true);
    setMessage(null);
    try {
      const data = await calculateTrialBalance(koke, bulan, tahun);
      setTbData(data);

      // Compute totals
      let ad = 0, ak = 0, md = 0, mk = 0, kd = 0, kk = 0;
      data.forEach(r => {
        ad += r.AWAL_DEBET;
        ak += r.AWAL_KREDIT;
        md += r.MUTASI_DEBET;
        mk += r.MUTASI_KREDIT;
        kd += r.AKHIR_DEBET;
        kk += r.AKHIR_KREDIT;
      });

      setTotals({
        awalDeb: ad,
        awalKre: ak,
        mutDeb: md,
        mutKre: mk,
        akhirDeb: kd,
        akhirKre: kk
      });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal memproses Neraca Percobaan: ' + err.message });
    } finally {
      setLoadingTB(false);
    }
  };

  const handleProsesLNET = async () => {
    if (!isSessionActive) return;
    setLoadingLNET(true);
    setMessage(null);
    try {
      const res = await prosesLNET(koke, bulan, tahun);
      setMessage({ 
        type: 'success', 
        text: `Sukses! Perhitungan LNET selesai. Sebanyak ${res.count} rekening biaya telah di-caching ke tabel laporan_manajemen_netral.` 
      });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal memproses LNET Laporan Manajemen: ' + err.message });
    } finally {
      setLoadingLNET(false);
    }
  };

  React.useEffect(() => {
    if (isSessionActive) {
      loadTrialBalance();
    }
  }, [isSessionActive, koke, bulan, tahun]);

  const isBalanced = Math.abs(totals.mutDeb - totals.mutKre) < 0.01;

  if (!isSessionActive) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/40 dark:bg-transparent h-full">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
          <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-zinc-150 tracking-tight uppercase">Sesi Belum Aktif</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-2 leading-relaxed">
            Pilih Unit Kebun, Bulan, dan Tahun di baris menu atas terlebih dahulu untuk memulai perhitungan akhir bulan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 space-y-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
            Kalkulasi & Proses Akhir Bulan
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">
            Eksekusi Neraca Percobaan real-time dan Caching LNET Laporan Manajemen untuk Unit <span className="text-emerald-600 font-bold">{koke}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={loadTrialBalance} 
            variant="outline" 
            size="sm" 
            className="border-slate-200 dark:border-zinc-800 h-9 font-bold text-xs"
            disabled={loadingTB}
          >
            <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", loadingTB && "animate-spin")} /> Refresh TB
          </Button>
          <Button 
            onClick={handleProsesLNET} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 font-bold text-xs"
            disabled={loadingLNET}
          >
            <Play className={cn("w-3.5 h-3.5 mr-1.5", loadingLNET && "animate-spin")} /> Jalankan LNET
          </Button>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className={cn(
          "p-4 rounded-xl border flex items-start gap-3 text-xs shadow-sm font-semibold animate-in fade-in slide-in-from-top-3 duration-250",
          message.type === 'success' 
            ? "bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-450" 
            : "bg-rose-500/10 dark:bg-rose-500/5 border-rose-500/20 text-rose-700 dark:text-rose-455"
        )}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />}
          <div>{message.text}</div>
        </div>
      )}

      {/* Grid status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4.5 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Status Keseimbangan Mutasi</div>
          <div className="flex items-center gap-2 mt-2">
            <span className={cn(
              "w-2.5 h-2.5 rounded-full animate-pulse",
              isBalanced ? "bg-emerald-500" : "bg-rose-500"
            )} />
            <span className="text-sm font-extrabold text-slate-800 dark:text-zinc-200">
              {isBalanced ? 'Balanced (Debet = Kredit)' : 'Unbalanced (Ada Selisih)'}
            </span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 mt-1">Selisih: {Number(Math.abs(totals.mutDeb - totals.mutKre)).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4.5 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Total Akun Aktif (TB)</div>
          <div className="text-xl font-black text-slate-900 dark:text-zinc-100 mt-2">{tbData.length} <span className="text-xs font-semibold text-slate-400">Rekening</span></div>
          <div className="text-[10px] font-bold text-slate-400 mt-1">Menampilkan akun dengan aktivitas saldo/mutasi</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4.5 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Periode Terbuka</div>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-450 mt-2">Unit {koke}</div>
          <div className="text-[10px] font-bold text-slate-400 mt-1">Bulan {bulan} Tahun {tahun}</div>
        </div>
      </div>

      {/* Trial Balance Table View */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-950/20">
          <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Tinjauan Neraca Percobaan (Trial Balance)
          </span>
        </div>

        <div className="flex-1 overflow-auto">
          {loadingTB ? (
            <div className="flex items-center justify-center p-12 text-slate-400 text-xs font-bold gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" /> Menghitung ulang saldo dan mutasi...
            </div>
          ) : tbData.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 text-center gap-1.5 h-full">
              <Award className="w-8 h-8 text-slate-300" />
              <div className="text-xs font-bold">Tidak ada aktivitas saldo atau transaksi.</div>
              <p className="text-[10px] font-semibold text-slate-400 max-w-xs">Silakan input saldo awal atau tambah jurnal transaksi untuk melihat neraca percobaan.</p>
            </div>
          ) : (
            <table className="w-full text-left text-[11px] border-collapse min-w-[700px]">
              <thead className="bg-slate-50/50 dark:bg-zinc-900/60 text-[9px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-2.5 font-black" rowSpan={2}>COA</th>
                  <th className="px-4 py-2.5 font-black" rowSpan={2}>Nama Rekening</th>
                  <th className="px-4 py-2.5 font-black text-center border-l border-slate-200 dark:border-zinc-850" colSpan={2}>Saldo Awal</th>
                  <th className="px-4 py-2.5 font-black text-center border-l border-slate-200 dark:border-zinc-850" colSpan={2}>Mutasi Bulanan</th>
                  <th className="px-4 py-2.5 font-black text-center border-l border-slate-200 dark:border-zinc-850" colSpan={2}>Saldo Akhir</th>
                </tr>
                <tr className="border-b border-slate-200 dark:border-zinc-800">
                  <th className="px-4 py-1.5 font-black text-right border-l border-slate-200 dark:border-zinc-850">Debet</th>
                  <th className="px-4 py-1.5 font-black text-right">Kredit</th>
                  <th className="px-4 py-1.5 font-black text-right border-l border-slate-200 dark:border-zinc-850">Debet</th>
                  <th className="px-4 py-1.5 font-black text-right">Kredit</th>
                  <th className="px-4 py-1.5 font-black text-right border-l border-slate-200 dark:border-zinc-850">Debet</th>
                  <th className="px-4 py-1.5 font-black text-right">Kredit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
                {tbData.map((row) => (
                  <tr key={row.REK} className="hover:bg-slate-50/40 dark:hover:bg-zinc-900/10 transition-colors font-mono">
                    <td className="px-4 py-2 font-bold text-slate-800 dark:text-zinc-200">{row.REK}</td>
                    <td className="px-4 py-2 font-sans font-bold text-slate-700 dark:text-zinc-300 truncate max-w-[200px]">{row.NAMA_PERK}</td>
                    
                    <td className="px-4 py-2 text-right border-l border-slate-200 dark:border-zinc-850 font-bold text-slate-600 dark:text-zinc-400">
                      {row.AWAL_DEBET > 0 ? row.AWAL_DEBET.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-slate-600 dark:text-zinc-400">
                      {row.AWAL_KREDIT > 0 ? row.AWAL_KREDIT.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
                    </td>

                    <td className={cn(
                      "px-4 py-2 text-right border-l border-slate-200 dark:border-zinc-850 font-extrabold",
                      row.MUTASI_DEBET > 0 ? "text-emerald-700 dark:text-emerald-450" : "text-slate-400"
                    )}>
                      {row.MUTASI_DEBET > 0 ? row.MUTASI_DEBET.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
                    </td>
                    <td className={cn(
                      "px-4 py-2 text-right font-extrabold",
                      row.MUTASI_KREDIT > 0 ? "text-emerald-700 dark:text-emerald-450" : "text-slate-400"
                    )}>
                      {row.MUTASI_KREDIT > 0 ? row.MUTASI_KREDIT.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
                    </td>

                    <td className="px-4 py-2 text-right border-l border-slate-200 dark:border-zinc-850 font-bold text-slate-900 dark:text-zinc-100">
                      {row.AKHIR_DEBET > 0 ? row.AKHIR_DEBET.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-slate-900 dark:text-zinc-100">
                      {row.AKHIR_KREDIT > 0 ? row.AKHIR_KREDIT.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/50 dark:bg-zinc-900/60 font-mono font-black text-slate-900 dark:text-zinc-100 border-t border-slate-200 dark:border-zinc-800 text-[10px]">
                <tr>
                  <td className="px-4 py-3 font-black text-right" colSpan={2}>TOTAL NERACA PERCOBAAN:</td>
                  
                  <td className="px-4 py-3 text-right border-l border-slate-200 dark:border-zinc-850 font-black">
                    {totals.awalDeb.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right font-black">
                    {totals.awalKre.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="px-4 py-3 text-right border-l border-slate-200 dark:border-zinc-850 font-black text-emerald-700 dark:text-emerald-450">
                    {totals.mutDeb.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right font-black text-emerald-700 dark:text-emerald-450">
                    {totals.mutKre.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="px-4 py-3 text-right border-l border-slate-200 dark:border-zinc-850 font-black">
                    {totals.akhirDeb.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right font-black">
                    {totals.akhirKre.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
