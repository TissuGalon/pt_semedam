'use client';

import * as React from 'react';
import { 
  Terminal as TermIcon, 
  Play, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Server,
  Zap,
  Info
} from 'lucide-react';
import { auditDatabase, AuditReport } from '@/lib/actions/utility';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ConsolePage() {
  const [report, setReport] = React.useState<AuditReport | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [terminalLogs, setTerminalLogs] = React.useState<string[]>([]);

  const runAudit = async () => {
    setLoading(true);
    setTerminalLogs([
      `[${new Date().toLocaleTimeString()}] SIA_AUDIT: Memulai pemeriksaan integritas database...`,
      `[${new Date().toLocaleTimeString()}] SIA_AUDIT: Mengoneksikan ke server cluster Supabase...`
    ]);

    try {
      // Simulate delay for retro hacker feel
      await new Promise(r => setTimeout(r, 800));
      
      setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] SIA_AUDIT: Membaca tabel master_rekening...`]);
      await new Promise(r => setTimeout(r, 600));

      setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] SIA_AUDIT: Memindai hirarki COA induk-anak...`]);
      await new Promise(r => setTimeout(r, 500));

      setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] SIA_AUDIT: Membaca transaksi jurnal...`]);
      await new Promise(r => setTimeout(r, 700));

      const res = await auditDatabase();
      setReport(res);

      setTerminalLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] SIA_AUDIT: Memindai keseimbangan Debet vs Kredit voucher...`,
        `[${new Date().toLocaleTimeString()}] SIA_AUDIT: Scan selesai dengan hasil: ${res.healthy ? 'DATABASE SEHAT' : 'INTEGRITAS DATA TERGANGGU'}`
      ]);
    } catch (err: any) {
      setTerminalLogs(prev => [...prev, `[ERROR] SIA_AUDIT: Kegagalan diagnosis: ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 space-y-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <TermIcon className="w-5 h-5 text-emerald-600" />
            Developer Console Admin
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">
            Pusat diagnosis internal, audit struktur data keuangan, dan integritas hirarki relasi database akuntansi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={runAudit} 
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-9 text-xs dark:bg-zinc-800 dark:hover:bg-zinc-700"
            disabled={loading}
          >
            <Play className={cn("w-3.5 h-3.5 mr-1.5", loading && "animate-spin")} /> Jalankan Audit Sistem
          </Button>
        </div>
      </div>

      {/* Retro Terminal Logs Log */}
      <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4.5 shadow-2xl font-mono text-[10px] text-emerald-455 space-y-1.5 relative overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-2 text-zinc-500 font-sans font-bold">
          <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-emerald-500" /> CLI Diagnostic Terminal</span>
          <span className="text-[8px] uppercase tracking-wider bg-emerald-500/10 text-emerald-500 px-1.5 rounded-sm">Cluster Active</span>
        </div>
        
        {terminalLogs.length === 0 ? (
          <div className="text-zinc-500 py-6 text-center italic">Klik &quot;Jalankan Audit Sistem&quot; untuk memulai debugging integritas data.</div>
        ) : (
          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
            {terminalLogs.map((log, index) => (
              <div key={index} className={cn(
                log.includes('[ERROR]') ? "text-rose-500" : log.includes('DATABASE SEHAT') ? "text-emerald-400 font-bold" : "text-emerald-500"
              )}>
                {log}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit Reports */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card: COA Relational Hierarchy */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-600" /> Relasi Hirarki COA
            </h3>
            
            {report.orphanCOAs.length === 0 ? (
              <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-450 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Hirarki Rekening Sehat! Seluruh sub-akun memiliki rekening induk valid.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-rose-500/10 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" /> Terdeteksi {report.orphanCOAs.length} rekening yatim (orphan COA)!
                </div>
                <div className="border border-slate-100 dark:border-zinc-850 rounded-lg max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-850 text-[10px] font-semibold text-slate-600 dark:text-zinc-400">
                  {report.orphanCOAs.map((err, i) => (
                    <div key={i} className="p-2 flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-rose-600 shrink-0" /> {err}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card: Unbalanced Transactions check */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" /> Keseimbangan Jurnal Transaksi
            </h3>

            {report.unbalancedJournals.length === 0 ? (
              <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-450 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Seluruh nomor bukti voucher jurnal tervalidasi seimbang (Debet = Kredit)!
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-rose-500/10 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" /> Terdeteksi {report.unbalancedJournals.length} voucher jurnal tidak seimbang!
                </div>
                <div className="border border-slate-100 dark:border-zinc-850 rounded-lg max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-850 font-mono text-[10px] text-slate-600 dark:text-zinc-400">
                  {report.unbalancedJournals.map((v, i) => (
                    <div key={i} className="p-2 flex justify-between items-center">
                      <span className="truncate max-w-[180px] font-bold text-slate-700 dark:text-zinc-300">{v.voucher}</span>
                      <span className="text-rose-600 font-extrabold shrink-0">Selisih: Rp {v.diff.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
