'use client';

import * as React from 'react';
import { 
  Database, 
  Clipboard, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useAccounting } from '@/hooks/use-accounting-context';
import { appendKasGudangData } from '@/lib/actions/proses';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AppendPage() {
  const { koke, bulan, tahun, isSessionActive } = useAccounting();
  const [pasteData, setPasteData] = React.useState('');
  const [parsedRows, setParsedRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleParse = () => {
    if (!pasteData.trim()) return;
    try {
      const rows = pasteData.split('\n');
      const results: any[] = [];
      
      rows.forEach((rowStr) => {
        if (!rowStr.trim()) return;
        
        // Split by Tab (Excel paste) or Comma
        const cells = rowStr.split(/\t/);
        if (cells.length < 5) return; // ignore invalid rows

        // Format expected: TANGGAL, NO_BUKJUR, REK, REKLA, NAREK, URAIAN1, DEBET, KREDIT
        // If some columns are missing, we default them
        const tanggal = cells[0]?.trim() || '';
        const noBukjur = cells[1]?.trim() || '';
        const rek = cells[2]?.trim() || '';
        const rekla = cells[3]?.trim() || '';
        const narek = cells[4]?.trim() || '';
        const uraian = cells[5]?.trim() || '';
        const debet = parseFloat(cells[6]?.replace(/[^0-9.-]+/g, "") || '0') || 0;
        const kredit = parseFloat(cells[7]?.replace(/[^0-9.-]+/g, "") || '0') || 0;

        results.push({
          KOKE: koke,
          KOBU: bulan,
          TANGGAL: tanggal || `${tahun}-${bulan}-01`, // fallback
          NO_BUKJUR: noBukjur || `IMP.${koke}.${bulan}.${tahun}`,
          REK: rek,
          REKLA: rekla,
          NAREK: narek,
          URAIAN1: uraian,
          DEBET: debet,
          KREDIT: kredit
        });
      });

      setParsedRows(results);
      setMessage({ type: 'success', text: `Berhasil memproses ${results.length} baris. Tinjau baris di bawah sebelum menyimpan.` });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Format input salah: ' + err.message });
    }
  };

  const handleSave = async () => {
    if (parsedRows.length === 0) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await appendKasGudangData(parsedRows);
      setMessage({ 
        type: 'success', 
        text: `Sukses! Sebanyak ${res.count} baris jurnal transaksi Kas/Gudang telah berhasil dimasukkan ke database.` 
      });
      setParsedRows([]);
      setPasteData('');
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Gagal menyimpan transaksi.' });
    } finally {
      setLoading(false);
    }
  };

  // Sums for verification
  let totalDebet = 0;
  let totalKredit = 0;
  parsedRows.forEach(r => {
    totalDebet += r.DEBET;
    totalKredit += r.KREDIT;
  });

  const isBalanced = Math.abs(totalDebet - totalKredit) < 0.01 && parsedRows.length > 0;

  if (!isSessionActive) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/40 dark:bg-transparent h-full">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
          <Database className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-zinc-150 tracking-tight uppercase">Sesi Belum Aktif</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-2 leading-relaxed">
            Pilih Unit Kebun, Bulan, dan Tahun di baris menu atas terlebih dahulu sebelum mengimpor transaksi Kas/Gudang.
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
            <Database className="w-5 h-5 text-emerald-600" />
            Append Kas & Gudang (Excel Import)
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">
            Tempel baris data dari Excel untuk diimpor secara massal ke Jurnal Transaksi Unit <span className="text-emerald-600 font-bold">{koke}</span>.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/laporan-jurnal">
            <Button variant="outline" size="sm" className="border-slate-200 dark:border-zinc-800 h-9 font-bold text-xs">
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Lihat Jurnal
            </Button>
          </Link>
        </div>
      </div>

      {/* Instructions alert */}
      <div className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-850 rounded-xl p-4 text-xs font-semibold text-slate-600 dark:text-zinc-400 space-y-2">
        <h3 className="font-extrabold text-slate-800 dark:text-zinc-200 uppercase flex items-center gap-1.5 text-[10px]">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" /> Panduan Impor Cepat Excel:
        </h3>
        <ol className="list-decimal list-inside space-y-1 pl-1">
          <li>Buka Microsoft Excel yang berisi transaksi Kas & Gudang Anda.</li>
          <li>Susun kolom dengan urutan: <span className="font-mono text-emerald-600 font-bold">TANGGAL | NO_BUKJUR | REK | REKLA | NAREK | URAIAN1 | DEBET | KREDIT</span></li>
          <li>Salin (Ctrl+C) baris data tersebut tanpa baris header.</li>
          <li>Tempel (Ctrl+V) ke dalam kotak di bawah ini, lalu klik <span className="text-emerald-600 font-bold">Proses Tempelan</span>.</li>
        </ol>
      </div>

      {/* Message feedback */}
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

      {/* Input box */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Tempel Data Tab-Separated (Excel) Di Sini:</label>
        <textarea
          value={pasteData}
          onChange={(e) => setPasteData(e.target.value)}
          placeholder="2026-05-01&#9;M.KOKE.05.0001.2026&#9;112101&#9;112102&#9;KAS BESAR&#9;Pengisian kas kecil&#9;15000000&#9;0"
          className="w-full h-44 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 p-4 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-zinc-100 shadow-inner"
        />
        <div className="flex justify-end gap-2">
          <Button 
            onClick={() => { setPasteData(''); setParsedRows([]); setMessage(null); }} 
            variant="ghost" 
            size="sm" 
            className="text-slate-500 hover:text-rose-600 font-bold h-9 text-xs"
            disabled={!pasteData}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Bersihkan
          </Button>
          <Button 
            onClick={handleParse} 
            size="sm" 
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 text-xs dark:bg-zinc-800 dark:hover:bg-zinc-700"
            disabled={!pasteData}
          >
            <Clipboard className="w-3.5 h-3.5 mr-1.5" /> Proses Tempelan
          </Button>
        </div>
      </div>

      {/* Preview Table */}
      {parsedRows.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-950/20">
            <div>
              <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider block">
                Pratinjau Impor Jurnal ({parsedRows.length} baris)
              </span>
              <span className="text-[10px] text-slate-400 font-bold mt-1 block">
                Total Debet: <span className="font-mono text-slate-700 dark:text-zinc-300">Rp {totalDebet.toLocaleString('id-ID')}</span> | 
                Total Kredit: <span className="font-mono text-slate-700 dark:text-zinc-300">Rp {totalKredit.toLocaleString('id-ID')}</span>
              </span>
            </div>

            <Button 
              onClick={handleSave} 
              className={cn(
                "h-9 font-bold text-xs text-white transition-colors",
                isBalanced ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
              )}
              disabled={loading || (!isBalanced && parsedRows.length > 0)}
            >
              <Save className="w-3.5 h-3.5 mr-1.5" /> 
              {!isBalanced ? 'Jurnal Tidak Seimbang' : 'Simpan ke Jurnal'}
            </Button>
          </div>

          <div className="flex-1 overflow-auto max-h-96">
            <table className="w-full text-left text-[11px] border-collapse min-w-[700px]">
              <thead className="bg-slate-50/50 dark:bg-zinc-900/60 text-[9px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-2 font-black">Tanggal</th>
                  <th className="px-4 py-2 font-black">No Bukti</th>
                  <th className="px-4 py-2 font-black">Rekening</th>
                  <th className="px-4 py-2 font-black">Lawan</th>
                  <th className="px-4 py-2 font-black">Keterangan</th>
                  <th className="px-4 py-2 font-black text-right">Debet</th>
                  <th className="px-4 py-2 font-black text-right">Kredit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
                {parsedRows.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50/40 dark:hover:bg-zinc-900/10 transition-colors font-mono">
                    <td className="px-4 py-2">{row.TANGGAL}</td>
                    <td className="px-4 py-2 truncate max-w-[120px]" title={row.NO_BUKJUR}>{row.NO_BUKJUR}</td>
                    <td className="px-4 py-2 font-bold text-slate-800 dark:text-zinc-200">{row.REK}</td>
                    <td className="px-4 py-2 text-slate-500">{row.REKLA || '-'}</td>
                    <td className="px-4 py-2 font-sans truncate max-w-[200px]" title={row.URAIAN1}>{row.URAIAN1}</td>
                    <td className="px-4 py-2 text-right font-bold text-emerald-700 dark:text-emerald-450">
                      {row.DEBET > 0 ? row.DEBET.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-rose-700 dark:text-rose-455">
                      {row.KREDIT > 0 ? row.KREDIT.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
