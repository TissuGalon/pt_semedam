'use client';

import * as React from 'react';
import { 
  Download, 
  Upload, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  FileJson,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { exportBackup, importBackup } from '@/lib/actions/utility';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function BackupRestorePage() {
  const [loadingExport, setLoadingExport] = React.useState(false);
  const [loadingImport, setLoadingImport] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

  // File parsing states
  const [fileContent, setFileContent] = React.useState<any>(null);
  const [fileName, setFileName] = React.useState('');

  const handleExport = async () => {
    setLoadingExport(true);
    setMessage(null);
    try {
      const payload = await exportBackup();
      
      // Browser download triggers
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `sia_semedam_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setMessage({ type: 'success', text: 'Sukses! Berkas backup JSON berhasil diunduh ke komputer Anda.' });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal membuat berkas ekspor: ' + err.message });
    } finally {
      setLoadingExport(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);
    
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.data || !parsed.version) {
          throw new Error('Format berkas backup tidak valid.');
        }
        setFileContent(parsed);
        setMessage({ type: 'success', text: 'Berkas cadangan valid! Tinjau rincian di bawah sebelum memulai restorasi.' });
      } catch (err: any) {
        setFileContent(null);
        setMessage({ type: 'error', text: 'Gagal membaca berkas backup JSON: ' + err.message });
      }
    };
    fileReader.readAsText(file);
  };

  const handleImport = async () => {
    if (!fileContent) return;
    const confirmAction = window.confirm(
      "PERINGATAN KRITIKAL!\n\nTindakan ini akan mengosongkan seluruh tabel unit, COA, saldo awal, dan jurnal transaksi aktif saat ini dan menimpanya dengan isi berkas backup.\n\nApakah Anda yakin ingin melanjutkan restorasi?"
    );
    if (!confirmAction) return;

    setLoadingImport(true);
    setMessage(null);
    try {
      await importBackup(fileContent);
      setMessage({ type: 'success', text: 'Luar Biasa! Database berhasil direstorasi penuh dari berkas cadangan.' });
      setFileContent(null);
      setFileName('');
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: 'Kegagalan restorasi: ' + err.message });
    } finally {
      setLoadingImport(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 space-y-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            Utilitas Cadangan & Restorasi (Backup/Restore)
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">
            Ekspor seluruh transaksi dan data dasar ke berkas cadangan offline, atau impor kembali untuk sinkronisasi.
          </p>
        </div>
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

      {/* Two cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card: Export */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-600" /> Ekspor Basis Data
            </h3>
            <p className="text-slate-500 dark:text-zinc-400 text-[11px] font-semibold leading-relaxed">
              Mengekspor seluruh tabel aktif (<span className="font-bold">Unit</span>, <span className="font-bold">Bagan Akun COA</span>, <span className="font-bold">Saldo Awal</span>, dan <span className="font-bold">Jurnal Transaksi</span>) ke dalam berkas cadangan terenkripsi berformat JSON portabel yang disimpan ke harddisk lokal Anda.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-zinc-850 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Safe Local Export</span>
            <Button 
              onClick={handleExport} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 text-xs"
              disabled={loadingExport}
            >
              <Download className={cn("w-3.5 h-3.5 mr-1.5", loadingExport && "animate-spin")} /> Unduh Backup JSON
            </Button>
          </div>
        </div>

        {/* Card: Import */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-600" /> Restorasi & Impor
            </h3>
            <p className="text-slate-500 dark:text-zinc-400 text-[11px] font-semibold leading-relaxed">
              Mengimpor kembali berkas cadangan JSON Anda. Tindakan ini merupakan pemulihan bencana (disaster recovery) yang akan menulis ulang tabel aktif saat ini. Selalu berhati-hati sebelum menekan tombol restorasi.
            </p>
          </div>

          {/* Hidden File Input */}
          <div className="space-y-3">
            <input
              type="file"
              accept=".json"
              id="backup-file"
              onChange={handleFileChange}
              className="hidden"
            />
            <label 
              htmlFor="backup-file"
              className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-950/20 cursor-pointer transition-colors h-9"
            >
              <FileJson className="w-4 h-4 text-emerald-600" /> {fileName ? fileName : 'Pilih Berkas Backup JSON...'}
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-zinc-850 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Danger Overwrite Zone</span>
            <Button 
              onClick={handleImport} 
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-9 text-xs"
              disabled={loadingImport || !fileContent}
            >
              <Upload className={cn("w-3.5 h-3.5 mr-1.5", loadingImport && "animate-spin")} /> Jalankan Restorasi
            </Button>
          </div>
        </div>

      </div>

      {/* Backup Preview Details Card */}
      {fileContent && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-250">
          <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Struktur Berkas Cadangan Terpilih:</span>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
            <div className="bg-slate-50 dark:bg-zinc-950/20 p-3 rounded-lg border border-slate-100 dark:border-zinc-850 text-center">
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Waktu Ekspor</span>
              <div className="text-xs font-bold text-slate-700 dark:text-zinc-350 mt-1 truncate">{new Date(fileContent.backupDate).toLocaleDateString()}</div>
            </div>
            
            <div className="bg-slate-50 dark:bg-zinc-950/20 p-3 rounded-lg border border-slate-100 dark:border-zinc-850 text-center">
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Master COA Akun</span>
              <div className="text-xs font-black text-slate-800 dark:text-zinc-200 mt-1 font-mono">{fileContent.data.master_rekening?.length || 0} Baris</div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950/20 p-3 rounded-lg border border-slate-100 dark:border-zinc-850 text-center">
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Jurnal Transaksi</span>
              <div className="text-xs font-black text-slate-800 dark:text-zinc-200 mt-1 font-mono">{fileContent.data.jurnal_transaksi?.length || 0} Transaksi</div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950/20 p-3 rounded-lg border border-slate-100 dark:border-zinc-850 text-center">
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Saldo Awal Terdaftar</span>
              <div className="text-xs font-black text-slate-800 dark:text-zinc-200 mt-1 font-mono">{fileContent.data.saldo_awal?.length || 0} Rekening</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
