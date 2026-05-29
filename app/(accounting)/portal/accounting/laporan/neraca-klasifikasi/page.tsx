'use client';

import * as React from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  RefreshCw, 
  Scale, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useAccounting } from '@/hooks/use-accounting-context';
import { getNeracaKlasifikasi, ClassifiedBalanceSheet } from '@/lib/actions/laporan';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NeracaKlasifikasiPage() {
  const { koke, bulan, tahun, isSessionActive } = useAccounting();
  const [data, setData] = React.useState<ClassifiedBalanceSheet | null>(null);
  const [loading, setLoading] = React.useState(false);

  const loadData = async () => {
    if (!isSessionActive) return;
    setLoading(true);
    try {
      const res = await getNeracaKlasifikasi(koke, bulan, tahun);
      setData(res);
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
          <Scale className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-zinc-150 tracking-tight uppercase">Sesi Belum Aktif</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-2 leading-relaxed">
            Pilih Unit Kebun, Bulan, dan Tahun di baris menu atas terlebih dahulu untuk menampilkan Neraca Klasifikasi.
          </p>
        </div>
      </div>
    );
  }

  const isBalanced = data ? Math.abs(data.totalAktiva - data.totalPasiva) < 0.01 : false;

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 space-y-6 flex flex-col print:p-0 print:bg-white print:text-black">
      {/* Header (hidden in print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5 print:hidden">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            Laporan Neraca Klasifikasi
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">
            Laporan neraca terklasifikasi Aktiva vs Pasiva untuk Unit <span className="text-emerald-600 font-bold">{koke}</span>.
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
            <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", loading && "animate-spin")} /> Refresh Laporan
          </Button>
          <Button 
            onClick={() => window.print()} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 font-bold text-xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" /> Cetak Neraca
          </Button>
        </div>
      </div>

      {/* Balance status bar (hidden in print) */}
      {data && (
        <div className={cn(
          "p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold print:hidden shadow-sm",
          isBalanced 
            ? "bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-450" 
            : "bg-rose-500/10 dark:bg-rose-500/5 border-rose-500/20 text-rose-700 dark:text-rose-455"
        )}>
          {isBalanced ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />}
          <div className="flex-1 flex justify-between items-center">
            <span>
              {isBalanced 
                ? 'Neraca Seimbang: Jumlah Aktiva tepat sama dengan Jumlah Pasiva.' 
                : 'Peringatan: Terjadi ketidakseimbangan saldo antara Aktiva dan Pasiva!'}
            </span>
            <span className="font-mono font-black text-right text-[10px]">
              Selisih: Rp {Math.abs(data.totalAktiva - data.totalPasiva).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}

      {/* Sheet view */}
      {data && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1 p-6 print:p-0 print:border-none print:shadow-none">
          
          {/* Corporate Header */}
          <div className="flex flex-col items-center text-center pb-5 border-b border-slate-200 dark:border-zinc-800">
            <h2 className="text-sm font-black text-slate-900 dark:text-zinc-100 uppercase tracking-widest">PT SEMEDAM</h2>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-200 uppercase mt-0.5">LAPORAN NERACA KLASIFIKASI</h3>
            <div className="flex items-center gap-2 mt-1.5 text-[10px] font-bold text-slate-500">
              <span>UNIT KEBUN: {koke}</span>
              <span>•</span>
              <span>BULAN: {bulan} TAHUN {tahun}</span>
            </div>
          </div>

          {/* Two-column layout on Desktop, Single-column on Mobile, and side-by-side on Print */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 print:grid-cols-2">
            
            {/* COLUMN 1: AKTIVA (DEBET NORMAL) */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800 pb-1 flex justify-between">
                  <span>I. AKTIVA LANCAR</span>
                  <span className="font-mono text-[10px] font-bold text-slate-400">Rp</span>
                </h3>
                <div className="mt-2 space-y-1.5 font-mono text-[10px]">
                  {data.aktivaLancar.map(r => (
                    <div key={r.REK} className="flex justify-between py-0.5 border-b border-dashed border-slate-100 dark:border-zinc-900">
                      <span className="text-slate-600 dark:text-zinc-400">
                        <span className="font-bold mr-1.5 text-slate-500">[{r.REK}]</span> {r.NAMA_PERK}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-zinc-200">
                        {Number(r.AKHIR_DEBET - r.AKHIR_KREDIT).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                  {data.aktivaLancar.length === 0 && (
                    <div className="text-slate-400 italic py-1 text-center font-sans font-semibold">Tidak ada akun Aktiva Lancar terdaftar.</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800 pb-1 flex justify-between">
                  <span>II. AKTIVA TETAP & LAINNYA</span>
                  <span className="font-mono text-[10px] font-bold text-slate-400">Rp</span>
                </h3>
                <div className="mt-2 space-y-1.5 font-mono text-[10px]">
                  {data.aktivaTetap.map(r => (
                    <div key={r.REK} className="flex justify-between py-0.5 border-b border-dashed border-slate-100 dark:border-zinc-900">
                      <span className="text-slate-600 dark:text-zinc-400">
                        <span className="font-bold mr-1.5 text-slate-500">[{r.REK}]</span> {r.NAMA_PERK}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-zinc-200">
                        {Number(r.AKHIR_DEBET - r.AKHIR_KREDIT).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                  {data.aktivaTetap.length === 0 && (
                    <div className="text-slate-400 italic py-1 text-center font-sans font-semibold">Tidak ada akun Aktiva Tetap terdaftar.</div>
                  )}
                </div>
              </div>

              {/* Total Aktiva */}
              <div className="bg-slate-50 dark:bg-zinc-950/20 border border-slate-200 dark:border-zinc-800 p-3 rounded-lg flex justify-between items-center text-xs font-black text-slate-900 dark:text-zinc-150">
                <span className="uppercase">JUMLAH AKTIVA (I + II)</span>
                <span className="font-mono">
                  Rp {data.totalAktiva.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* COLUMN 2: PASIVA (LIABILITIES & EQUITY - CREDIT NORMAL) */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800 pb-1 flex justify-between">
                  <span>III. KEWAJIBAN / UTANG</span>
                  <span className="font-mono text-[10px] font-bold text-slate-400">Rp</span>
                </h3>
                <div className="mt-2 space-y-1.5 font-mono text-[10px]">
                  {data.kewajiban.map(r => (
                    <div key={r.REK} className="flex justify-between py-0.5 border-b border-dashed border-slate-100 dark:border-zinc-900">
                      <span className="text-slate-600 dark:text-zinc-400">
                        <span className="font-bold mr-1.5 text-slate-500">[{r.REK}]</span> {r.NAMA_PERK}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-zinc-200">
                        {Number(r.AKHIR_KREDIT - r.AKHIR_DEBET).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                  {data.kewajiban.length === 0 && (
                    <div className="text-slate-400 italic py-1 text-center font-sans font-semibold">Tidak ada akun Kewajiban terdaftar.</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider border-b border-slate-200 dark:border-zinc-800 pb-1 flex justify-between">
                  <span>IV. EKUITAS / MODAL</span>
                  <span className="font-mono text-[10px] font-bold text-slate-400">Rp</span>
                </h3>
                <div className="mt-2 space-y-1.5 font-mono text-[10px]">
                  {data.ekuitas.map(r => (
                    <div key={r.REK} className="flex justify-between py-0.5 border-b border-dashed border-slate-100 dark:border-zinc-900">
                      <span className="text-slate-600 dark:text-zinc-400">
                        <span className="font-bold mr-1.5 text-slate-500">[{r.REK}]</span> {r.NAMA_PERK}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-zinc-200">
                        {Number(r.AKHIR_KREDIT - r.AKHIR_DEBET).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                  {data.ekuitas.length === 0 && (
                    <div className="text-slate-400 italic py-1 text-center font-sans font-semibold">Tidak ada akun Ekuitas terdaftar.</div>
                  )}
                </div>
              </div>

              {/* Total Pasiva */}
              <div className="bg-slate-50 dark:bg-zinc-950/20 border border-slate-200 dark:border-zinc-800 p-3 rounded-lg flex justify-between items-center text-xs font-black text-slate-900 dark:text-zinc-150">
                <span className="uppercase">JUMLAH PASIVA (III + IV)</span>
                <span className="font-mono">
                  Rp {data.totalPasiva.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

          </div>

          {/* Signature Block for Official Reports */}
          <div className="hidden print:grid print:grid-cols-3 gap-6 pt-12 text-center text-xs font-bold text-slate-850 mt-12">
            <div>
              <div>Dibuat Oleh,</div>
              <div className="h-16"></div>
              <div className="border-t border-slate-400 pt-1">Staf Administrasi</div>
            </div>
            <div>
              <div>Diperiksa Oleh,</div>
              <div className="h-16"></div>
              <div className="border-t border-slate-400 pt-1">Kepala Tata Usaha</div>
            </div>
            <div>
              <div>Disetujui Oleh,</div>
              <div className="h-16"></div>
              <div className="border-t border-slate-400 pt-1">Manager Kebun</div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
