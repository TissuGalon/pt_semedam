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
import { 
  exportBackup, 
  importBackup, 
  getExportMetadata, 
  getExportTableChunk, 
  clearTableForImport, 
  importTableChunk 
} from '@/lib/actions/utility';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function BackupRestorePage() {
  const [loadingExport, setLoadingExport] = React.useState(false);
  const [loadingImport, setLoadingImport] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

  // File parsing states
  const [fileContent, setFileContent] = React.useState<any>(null);
  const [fileName, setFileName] = React.useState('');

  // Real-time progress monitoring state
  const [progress, setProgress] = React.useState<{
    active: boolean;
    mode: 'export' | 'import';
    percent: number;
    statusText: string;
  } | null>(null);

  // 1. Optimized Chunked Local Export
  const handleExport = async () => {
    setLoadingExport(true);
    setMessage(null);
    setProgress({ 
      active: true, 
      mode: 'export', 
      percent: 0, 
      statusText: 'Menghubungi server dan menghitung total baris basis data...' 
    });

    try {
      // Step A: Fetch counts of all tables
      const metadata = await getExportMetadata();
      const tables = [
        { name: 'master_unit', displayName: 'Master Unit', total: metadata.master_unit },
        { name: 'master_rekening', displayName: 'Bagan Akun COA', total: metadata.master_rekening },
        { name: 'saldo_awal', displayName: 'Saldo Awal', total: metadata.saldo_awal },
        { name: 'jurnal_transaksi', displayName: 'Jurnal Transaksi', total: metadata.jurnal_transaksi }
      ];

      const backupData: Record<string, any[]> = {
        master_unit: [],
        master_rekening: [],
        saldo_awal: [],
        jurnal_transaksi: []
      };

      const EXPORT_CHUNK_SIZE = 2500;
      let processedRows = 0;
      const totalRows = tables.reduce((acc, t) => acc + t.total, 0);

      // Step B: Loop sekuensial to fetch slices
      for (const table of tables) {
        if (table.total === 0) continue;

        let offset = 0;
        while (offset < table.total) {
          const limit = Math.min(EXPORT_CHUNK_SIZE, table.total - offset);
          const currentPercent = Math.round((processedRows / Math.max(1, totalRows)) * 100);
          
          setProgress({
            active: true,
            mode: 'export',
            percent: Math.min(99, currentPercent),
            statusText: `Mengunduh ${table.displayName}: baris ${offset.toLocaleString()} sampai ${(offset + limit).toLocaleString()} dari ${table.total.toLocaleString()}...`
          });

          const chunk = await getExportTableChunk(table.name, offset, limit);
          backupData[table.name].push(...chunk);
          offset += limit;
          processedRows += limit;
        }
      }

      setProgress({
        active: true,
        mode: 'export',
        percent: 100,
        statusText: 'Mengekstraksi dan menyusun struktur cadangan berkas JSON...'
      });

      const payload = {
        backupDate: new Date().toISOString(),
        version: '1.0.0',
        data: backupData
      };
      
      // Browser download triggers using Blob to prevent page memory overflow
      const jsonString = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const downloadUrl = URL.createObjectURL(blob);
      
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute("href", downloadUrl);
      downloadAnchor.setAttribute("download", `sia_semedam_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      
      // Cleanup
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(downloadUrl);

      setMessage({ type: 'success', text: 'Sukses! Berkas backup JSON berhasil diunduh ke komputer Anda.' });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal membuat berkas ekspor: ' + err.message });
    } finally {
      setLoadingExport(false);
      setProgress(null);
    }
  };

  // 2. Local File Parsing and Verification
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);
    setMessage(null);
    setProgress({
      active: true,
      mode: 'import',
      percent: 0,
      statusText: `Membaca berkas cadangan lokal: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)...`
    });
    
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.data || !parsed.version) {
          throw new Error('Format berkas backup tidak valid.');
        }
        setFileContent(parsed);
        setMessage({ type: 'success', text: 'Berkas cadangan valid! Tinjau rincian struktur data di bawah sebelum memulai restorasi.' });
      } catch (err: any) {
        setFileContent(null);
        setMessage({ type: 'error', text: 'Gagal membaca berkas backup JSON: ' + err.message });
      } finally {
        setProgress(null);
      }
    };
    
    fileReader.onerror = () => {
      setMessage({ type: 'error', text: 'Gagal membaca berkas dari sistem lokal.' });
      setProgress(null);
    };

    fileReader.readAsText(file);
  };

  // 3. Optimized High-Performance Chunked Import
  const handleImport = async () => {
    if (!fileContent) return;
    const confirmAction = window.confirm(
      "PERINGATAN KRITIKAL!\n\nTindakan ini akan mengosongkan seluruh tabel unit, COA, saldo awal, dan jurnal transaksi aktif saat ini dan menimpanya dengan isi berkas backup.\n\nApakah Anda yakin ingin melanjutkan restorasi?"
    );
    if (!confirmAction) return;

    setLoadingImport(true);
    setMessage(null);
    setProgress({ 
      active: true, 
      mode: 'import', 
      percent: 0, 
      statusText: 'Memulai pemulihan basis data, menganalisis muatan data...' 
    });

    try {
      const { data } = fileContent;
      if (!data) throw new Error("Format berkas backup tidak valid (data kosong).");

      const units = data.master_unit || [];
      const coas = data.master_rekening || [];
      const saldos = data.saldo_awal || [];
      const journals = data.jurnal_transaksi || [];

      const totalItems = units.length + coas.length + saldos.length + journals.length;
      let processedItems = 0;

      // STEP A: CLEAR TABLES IN SECURE CASCADE ORDER (FK Safe)
      setProgress({ active: true, mode: 'import', percent: 1, statusText: 'Mengosongkan baris Jurnal Transaksi aktif (Cascade Step 1)...' });
      await clearTableForImport('jurnal_transaksi');
      
      setProgress({ active: true, mode: 'import', percent: 3, statusText: 'Mengosongkan baris Saldo Awal aktif (Cascade Step 2)...' });
      await clearTableForImport('saldo_awal');

      setProgress({ active: true, mode: 'import', percent: 5, statusText: 'Mengosongkan Bagan Akun COA aktif (Cascade Step 3)...' });
      await clearTableForImport('master_rekening');

      setProgress({ active: true, mode: 'import', percent: 7, statusText: 'Mengosongkan Unit Kerja aktif (Cascade Step 4)...' });
      await clearTableForImport('master_unit');

      // STEP B: INSERT DATA IN REVERSE DEPENDENCY ORDER (FK Safe)
      const IMPORT_CHUNK_SIZE = 800; // Optimal bulk size for Supabase payload & memory consumption

      // 1. Master Unit
      if (units.length > 0) {
        let offset = 0;
        while (offset < units.length) {
          const chunk = units.slice(offset, offset + IMPORT_CHUNK_SIZE);
          await importTableChunk('master_unit', chunk);
          offset += chunk.length;
          processedItems += chunk.length;
          setProgress({
            active: true,
            mode: 'import',
            percent: Math.min(99, Math.round((processedItems / Math.max(1, totalItems)) * 100)),
            statusText: `Menyisipkan Unit Kerja: ${offset.toLocaleString()} / ${units.length.toLocaleString()}...`
          });
        }
      }

      // 2. Master Rekening
      if (coas.length > 0) {
        let offset = 0;
        while (offset < coas.length) {
          const chunk = coas.slice(offset, offset + IMPORT_CHUNK_SIZE);
          await importTableChunk('master_rekening', chunk);
          offset += chunk.length;
          processedItems += chunk.length;
          setProgress({
            active: true,
            mode: 'import',
            percent: Math.min(99, Math.round((processedItems / Math.max(1, totalItems)) * 100)),
            statusText: `Menyisipkan Bagan Akun COA: ${offset.toLocaleString()} / ${coas.length.toLocaleString()}...`
          });
        }
      }

      // 3. Saldo Awal
      if (saldos.length > 0) {
        let offset = 0;
        while (offset < saldos.length) {
          const chunk = saldos.slice(offset, offset + IMPORT_CHUNK_SIZE);
          await importTableChunk('saldo_awal', chunk);
          offset += chunk.length;
          processedItems += chunk.length;
          setProgress({
            active: true,
            mode: 'import',
            percent: Math.min(99, Math.round((processedItems / Math.max(1, totalItems)) * 100)),
            statusText: `Menyisipkan Saldo Awal: ${offset.toLocaleString()} / ${saldos.length.toLocaleString()}...`
          });
        }
      }

      // 4. Jurnal Transaksi
      if (journals.length > 0) {
        let offset = 0;
        while (offset < journals.length) {
          const chunk = journals.slice(offset, offset + IMPORT_CHUNK_SIZE);
          await importTableChunk('jurnal_transaksi', chunk);
          offset += chunk.length;
          processedItems += chunk.length;
          setProgress({
            active: true,
            mode: 'import',
            percent: Math.min(99, Math.round((processedItems / Math.max(1, totalItems)) * 100)),
            statusText: `Menyisipkan Jurnal Transaksi: ${offset.toLocaleString()} / ${journals.length.toLocaleString()}...`
          });
        }
      }

      setProgress({ 
        active: true, 
        mode: 'import', 
        percent: 100, 
        statusText: 'Restorasi sekuensial selesai! Database terisi penuh.' 
      });

      setMessage({ type: 'success', text: 'Luar Biasa! Seluruh tabel basis data berhasil direstorasi penuh dari berkas cadangan secara aman.' });
      setFileContent(null);
      setFileName('');
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: 'Kegagalan restorasi: ' + err.message });
    } finally {
      setLoadingImport(false);
      setProgress(null);
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

      {/* Progress Monitor Bar */}
      {progress && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-3 duration-250">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
              {progress.mode === 'export' ? 'Sedang Mengekspor Basis Data (Chunked)...' : 'Sedang Memulihkan Basis Data (Sekuensial)...'}
            </span>
            <span className="text-emerald-600 dark:text-emerald-450 font-mono text-[13px]">{progress.percent}%</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress.percent}%` }}
            />
          </div>

          <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
            Status: <span className="normal-case text-slate-600 dark:text-zinc-350 font-semibold">{progress.statusText}</span>
          </div>
        </div>
      )}

      {/* Two cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card: Export */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-600" /> Ekspor Basis Data (Aman & Streamed)
            </h3>
            <p className="text-slate-500 dark:text-zinc-400 text-[11px] font-semibold leading-relaxed">
              Mengekspor seluruh tabel aktif (<span className="font-bold">Unit</span>, <span className="font-bold">Bagan Akun COA</span>, <span className="font-bold">Saldo Awal</span>, dan <span className="font-bold">Jurnal Transaksi</span>) secara bertahap untuk mencegah timeout. File cadangan disimpan langsung ke disk lokal Anda.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-zinc-850 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Optimized Chunking</span>
            <Button 
              onClick={handleExport} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 text-xs"
              disabled={loadingExport || !!progress}
            >
              <Download className={cn("w-3.5 h-3.5 mr-1.5", loadingExport && "animate-spin")} /> Unduh Backup JSON
            </Button>
          </div>
        </div>

        {/* Card: Import */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-600" /> Restorasi & Impor Sekuensial
            </h3>
            <p className="text-slate-500 dark:text-zinc-400 text-[11px] font-semibold leading-relaxed">
              Mengimpor kembali berkas cadangan JSON Anda secara bertahap. Tindakan ini meminimalisasi penggunaan sumber daya Supabase dan memulihkan basis data dengan aman tanpa melanggar Foreign Keys.
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
              disabled={!!progress}
            />
            <label 
              htmlFor="backup-file"
              className={cn(
                "w-full flex items-center justify-center gap-2 border border-dashed border-slate-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-950/20 cursor-pointer transition-colors h-9",
                !!progress && "opacity-50 cursor-not-allowed"
              )}
            >
              <FileJson className="w-4 h-4 text-emerald-600" /> {fileName ? fileName : 'Pilih Berkas Backup JSON...'}
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-zinc-850 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Cascade Overwrite</span>
            <Button 
              onClick={handleImport} 
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-9 text-xs"
              disabled={loadingImport || !fileContent || !!progress}
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
              <div className="text-xs font-bold text-slate-700 dark:text-zinc-350 mt-1 truncate">{fileContent.backupDate ? new Date(fileContent.backupDate).toLocaleDateString() : '-'}</div>
            </div>
            
            <div className="bg-slate-50 dark:bg-zinc-950/20 p-3 rounded-lg border border-slate-100 dark:border-zinc-850 text-center">
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Master COA Akun</span>
              <div className="text-xs font-black text-slate-800 dark:text-zinc-200 mt-1 font-mono">{(fileContent.data?.master_rekening?.length || 0).toLocaleString()} Baris</div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950/20 p-3 rounded-lg border border-slate-100 dark:border-zinc-850 text-center">
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Jurnal Transaksi</span>
              <div className="text-xs font-black text-slate-800 dark:text-zinc-200 mt-1 font-mono">{(fileContent.data?.jurnal_transaksi?.length || 0).toLocaleString()} Transaksi</div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950/20 p-3 rounded-lg border border-slate-100 dark:border-zinc-850 text-center">
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Saldo Awal Terdaftar</span>
              <div className="text-xs font-black text-slate-800 dark:text-zinc-200 mt-1 font-mono">{(fileContent.data?.saldo_awal?.length || 0).toLocaleString()} Rekening</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
