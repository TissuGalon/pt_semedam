'use client';

import * as React from 'react';
import { 
  Layers, 
  Printer, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { useAccounting } from '@/hooks/use-accounting-context';
import { getNeracaKompilasi, KompilasiRow } from '@/lib/actions/laporan';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NeracaKompilasiPage() {
  const { koke, bulan, tahun, isSessionActive } = useAccounting();
  const [data, setData] = React.useState<{ units: string[]; rows: KompilasiRow[] } | null>(null);
  const [loading, setLoading] = React.useState(false);

  const loadData = async () => {
    if (!isSessionActive) return;
    setLoading(true);
    try {
      const res = await getNeracaKompilasi(bulan, tahun);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [bulan, tahun, isSessionActive]);

  if (!isSessionActive) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/40 dark:bg-transparent h-full">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-zinc-150 tracking-tight uppercase">Sesi Belum Aktif</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-2 leading-relaxed">
            Pilih Unit Kebun, Bulan, dan Tahun di baris menu atas terlebih dahulu untuk menampilkan Neraca Kompilasi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 space-y-6 flex flex-col print:p-0 print:bg-white print:text-black">
      {/* Header (hidden in print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5 print:hidden">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            Neraca Kompilasi Multi-Unit
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">
            Laporan kompilasi saldo akhir akun membandingkan seluruh Unit Kebun secara berdampingan.
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
            <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", loading && "animate-spin")} /> Refresh
          </Button>
          <Button 
            onClick={() => window.print()} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 font-bold text-xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" /> Cetak Kompilasi
          </Button>
        </div>
      </div>

      {/* Guide notice (hidden in print) */}
      <div className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-850 rounded-xl p-4 text-xs font-semibold text-slate-600 dark:text-zinc-400 space-y-1 print:hidden">
        <h3 className="font-extrabold text-slate-800 dark:text-zinc-200 uppercase flex items-center gap-1.5 text-[10px]">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" /> Keterangan Neraca Kompilasi:
        </h3>
        <p>Laporan ini menyandingkan nominal saldo akhir (netto) dari masing-masing Unit Kebun berdasarkan bulan dan tahun terpilih di menu atas. Nilai total akhir mewakili penggabungan konsolidasi seluruh unit.</p>
      </div>

      {/* Compiled Sheet */}
      {data && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1 p-6 print:p-0 print:border-none print:shadow-none">
          
          {/* Corporate Header */}
          <div className="flex flex-col items-center text-center pb-5 border-b border-slate-200 dark:border-zinc-800">
            <h2 className="text-sm font-black text-slate-900 dark:text-zinc-100 uppercase tracking-widest">PT SEMEDAM</h2>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-200 uppercase mt-0.5">LAPORAN NERACA KOMPILASI GABUNGAN</h3>
            <div className="flex items-center gap-2 mt-1.5 text-[10px] font-bold text-slate-500">
              <span>PERIODE BULAN: {bulan} TAHUN {tahun}</span>
            </div>
          </div>

          {/* Table view */}
          <div className="flex-1 overflow-auto mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-400 font-bold text-xs gap-1.5">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" /> Mengompilasi data unit kebun...
              </div>
            ) : data.rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center gap-1.5 h-full">
                <FileText className="w-8 h-8 text-slate-300" />
                <div className="text-xs font-bold">Tidak ada aktivitas saldo di seluruh Unit.</div>
              </div>
            ) : (
              <table className="w-full text-left text-[10px] border-collapse min-w-[800px]">
                <thead className="bg-slate-50/50 dark:bg-zinc-900/60 text-[9px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-3 py-3 font-black">COA</th>
                    <th className="px-3 py-3 font-black">Nama Rekening</th>
                    
                    {/* Unit header columns */}
                    {data.units.map(unitCode => (
                      <th key={unitCode} className="px-3 py-3 font-black text-right border-l border-slate-200 dark:border-zinc-850">
                        Unit {unitCode}
                      </th>
                    ))}
                    
                    <th className="px-3 py-3 font-black text-right border-l border-slate-200 dark:border-zinc-800 bg-emerald-500/5 text-emerald-700 dark:text-emerald-450">
                      Total Konsolidasi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-850 font-mono">
                  {data.rows.map((row) => (
                    <tr key={row.REK} className="hover:bg-slate-50/40 dark:hover:bg-zinc-900/10 transition-colors">
                      <td className="px-3 py-2 font-bold text-slate-800 dark:text-zinc-200">{row.REK}</td>
                      <td className="px-3 py-2 font-sans font-bold text-slate-700 dark:text-zinc-300 truncate max-w-[220px]">
                        {row.NAMA_PERK}
                      </td>

                      {/* Unit values */}
                      {data.units.map(unitCode => {
                        const val = row.balances[unitCode] || 0;
                        return (
                          <td key={unitCode} className="px-3 py-2 text-right border-l border-slate-100 dark:border-zinc-900">
                            {val !== 0 ? val.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
                          </td>
                        );
                      })}

                      {/* Total column */}
                      <td className="px-3 py-2 text-right border-l border-slate-200 dark:border-zinc-800 font-black bg-emerald-500/5 text-slate-900 dark:text-zinc-100">
                        {row.total !== 0 ? row.total.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50/50 dark:bg-zinc-900/60 font-black text-slate-900 dark:text-zinc-100 border-t border-slate-200 dark:border-zinc-800 text-[10px]">
                  <tr>
                    <td className="px-3 py-3 text-right font-black uppercase" colSpan={2}>
                      Total Neraca Gabungan:
                    </td>
                    
                    {/* Sum of unit totals */}
                    {data.units.map(unitCode => {
                      const colSum = data.rows.reduce((sum, r) => sum + (r.balances[unitCode] || 0), 0);
                      return (
                        <td key={unitCode} className="px-3 py-3 text-right border-l border-slate-250 dark:border-zinc-800 font-black">
                          {colSum.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                        </td>
                      );
                    })}

                    <td className="px-3 py-3 text-right border-l border-slate-200 dark:border-zinc-800 font-black bg-emerald-500/5">
                      {data.rows.reduce((sum, r) => sum + r.total, 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* Signature Block for Printing */}
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
