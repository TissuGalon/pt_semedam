'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  BookOpen, 
  FileSpreadsheet, 
  TrendingUp, 
  FileCheck, 
  Layers, 
  Boxes, 
  Users, 
  Wallet, 
  Coins, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck, 
  Globe, 
  Terminal, 
  Settings, 
  Sun, 
  Moon,
  Sparkles,
  Cpu,
  Database,
  CheckCircle2,
  Workflow,
  Sprout,
  Activity
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

// Mock Modules Data for Bento Grid
const modules = [
  {
    id: 'accounting',
    title: 'Integrated Accounting (SIA)',
    description: 'Pusat pembukuan ledger ganda otomatis dengan audit trail lengkap dan penyusunan Neraca Kompilasi multi-kebun.',
    icon: BookOpen,
    color: 'emerald',
    badge: 'Core Module',
    details: ['Double-Entry Ledger', 'Neraca Klasifikasi & Kompilasi', 'Balanced Check Real-time']
  },
  {
    id: 'inventory',
    title: 'Gudang & Logistik Sawit',
    description: 'Kontrol stok persediaan pupuk NPK, herbisida, solar genset, suku cadang mesin PKS, hingga bibit unggul afdeling.',
    icon: Boxes,
    color: 'blue',
    badge: 'Operational',
    details: ['Material Management', 'Logistik Afdeling', 'Rekonsiliasi Fisik berkala']
  },
  {
    id: 'assets',
    title: 'Fixed Asset & Depresiasi',
    description: 'Pencatatan aset mesin Pabrik Kelapa Sawit (PKS) dan kendaraan operasional kebun dengan penyusutan otomatis.',
    icon: Building2,
    color: 'sky',
    badge: 'Assets',
    details: ['Straight-line Depreciation', 'Penyusutan Akhir Bulan', 'Aset Kebun & Mesin PKS']
  },
  {
    id: 'kasbank',
    title: 'Treasury & Kas Kecil',
    description: 'Manajemen arus kas kecil kantor kebun, transfer dana afdeling, rekonsiliasi otomatis dengan rekening bank utama.',
    icon: Wallet,
    color: 'indigo',
    badge: 'Treasury',
    details: ['Reconciliation Sheet', 'Kasir & Pengeluaran Kas', 'Prefix Ledger 100']
  },
  {
    id: 'payroll',
    title: 'Payroll Buruh Panen (BHL)',
    description: 'Perhitungan upah harian buruh lepas panen berdasarkan lembar rekap kerja harian, lembur, dan bonus tonase TBS.',
    icon: Users,
    color: 'amber',
    badge: 'Human Resources',
    details: ['Impor Excel Slip Upah', 'Kalkulasi Beban Karyawan (500)', 'Rekap Afdeling Terpadu']
  }
];

// Mock Live Transactions for Preview
const mockTransactions = [
  { unit: 'K01-KS', desc: 'Penjualan TBS Afdeling A', debet: 245000000, kredit: 0, status: 'Balanced' },
  { unit: 'K02-PKS', desc: 'Beli Sparepart Conveyor', debet: 0, kredit: 85000000, status: 'Balanced' },
  { unit: 'K01-KS', desc: 'Gaji BHL Pemanen Mei', debet: 120000000, kredit: 0, status: 'Balanced' },
  { unit: 'HQ-ADM', desc: 'Biaya Solar Kantor Kebun', debet: 0, kredit: 32000000, status: 'Balanced' },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = React.useState('accounting');
  const [liveCounter, setLiveCounter] = React.useState(0);
  const [balanceStatus, setBalanceStatus] = React.useState(true);

  // Interval simulating live sync action
  React.useEffect(() => {
    const timer = setInterval(() => {
      setLiveCounter(prev => prev + 1);
      // Randomly trigger a micro flash on the balance status to simulate active checking
      setBalanceStatus(false);
      setTimeout(() => setBalanceStatus(true), 400);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#0f1115] text-slate-800 dark:text-zinc-200 transition-colors duration-300">
      
      {/* ------------------------------------------------------------- */}
      {/* RETRO DOTTED GRID & RADIAL SPOTLIGHTS (MAGICUI BACKGROUND)   */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Dotted Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px] opacity-70"
          style={{ maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)' }}
        />
        
        {/* Soft Radial Ambient Lights */}
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 dark:bg-blue-600/5 blur-[90px] rounded-full" />
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-amber-500/10 dark:bg-amber-500/5 blur-[100px] rounded-full animate-pulse duration-[10000ms]" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* NAVIGATION BAR                                                */}
      {/* ------------------------------------------------------------- */}
      <header className="relative z-10 w-full border-b border-slate-200/50 dark:border-zinc-800/60 bg-white/70 dark:bg-[#0f1115]/75 backdrop-blur-md transition-all duration-300 px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-emerald-500/10 dark:shadow-none ring-1 ring-emerald-400/20">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-550 tracking-wider leading-none uppercase">Enterprise Resource Planning</span>
            <span className="text-sm font-black text-slate-900 dark:text-zinc-100 mt-0.5 tracking-wide uppercase">PT SEMADAM</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 select-none">
          <a href="#modul" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Modul ERP</a>
          <a href="#preview" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Preview SIA</a>
          <a href="#statistik" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Operasional</a>
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 px-2.5 py-1 rounded-full text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Sync Active
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3.5">
          <ThemeToggle />
          
          <Link
            href="/portal"
            className="group relative inline-flex items-center gap-2 h-9 rounded-xl px-4 bg-slate-950 dark:bg-zinc-150 hover:bg-slate-850 dark:hover:bg-white text-white dark:text-slate-950 text-xs font-bold transition-all duration-300 shadow-sm border border-slate-900 dark:border-transparent select-none cursor-pointer"
          >
            Masuk Portal
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            
            {/* Shiny border beam overlay */}
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-0 group-hover:opacity-30 blur-[2px] transition-opacity duration-500 pointer-events-none" />
          </Link>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION                                                  */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-12 md:pt-20 pb-20 flex flex-col items-center text-center">
        
        {/* Floating Release Tag */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-500/20 text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-6 shadow-sm shadow-emerald-50/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-spin duration-3000" />
          PT Semadam ERP • Sistem Terintegrasi V1.0
        </motion.div>

        {/* Main Sleek Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight leading-[1.1] max-w-4xl"
        >
          Pusat Kendali Akuntansi &{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-emerald-500 dark:to-teal-400 bg-clip-text text-transparent relative">
            Operasional Kelapa Sawit
            {/* Underline beam glow */}
            <span className="absolute bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 dark:via-emerald-400/30" />
          </span>
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm md:text-[15px] font-medium mt-6 max-w-2xl leading-relaxed"
        >
          Platform ERP tersentralisasi untuk PT Semadam yang mengintegrasikan pencatatan jurnal transaksi afdeling, inventaris pupuk dan material kebun, depresiasi aktiva pabrik (PKS), hingga penggajian upah buruh panen secara real-time.
        </motion.p>

        {/* Action Button Group with Border Beams */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto"
        >
          {/* Main Glowing CTA Button */}
          <Link
            href="/portal"
            className="w-full sm:w-auto relative group inline-flex items-center justify-center gap-2.5 h-12 px-7 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-emerald-600/20 dark:shadow-none transition-all duration-350 select-none cursor-pointer scale-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            Masuk Portal ERP
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            
            {/* Magic Glow Border beam */}
            <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 opacity-0 group-hover:opacity-100 blur-[3px] -z-10 transition-opacity duration-300" />
            {/* Metallic Sheen animation */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[25deg] -translate-x-[150%] group-hover:animate-[shining_0.8s_ease-in-out_1]" />
          </Link>

          {/* Secondary CTA Button */}
          <a
            href="#modul"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100 text-slate-500 dark:text-zinc-400 text-sm font-bold shadow-sm transition-all"
          >
            Tinjau Fitur Modul
          </a>
        </motion.div>

        {/* ------------------------------------------------------------- */}
        {/* INTERACTIVE MOCKUP PORTAL PREVIEW (THE HERO VISUAL)          */}
        {/* ------------------------------------------------------------- */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          id="preview"
          className="w-full max-w-5xl mt-16 md:mt-24 p-2 bg-slate-100 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.45)] backdrop-blur-sm group relative"
        >
          {/* Neon side highlight tags */}
          <div className="absolute -left-2 top-1/4 w-[4px] h-20 bg-emerald-500 rounded-full" />
          <div className="absolute -right-2 top-1/3 w-[4px] h-12 bg-blue-500 rounded-full" />

          {/* Glowing Mockup Header Frame */}
          <div className="w-full rounded-[20px] bg-white dark:bg-zinc-950 border border-slate-200/50 dark:border-zinc-900 p-4 sm:p-6 text-left space-y-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-150 dark:border-zinc-900 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                {/* Browser triple button buttons */}
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="h-5 w-px bg-slate-200 dark:bg-zinc-800 mx-1" />
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/60 rounded-lg px-2.5 py-1 text-[10px] font-black tracking-tight text-slate-400 dark:text-zinc-500">
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  SIA_SEMADAM_SERVER://PORTAL-ERP
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                  Live Balance Check ({liveCounter})
                </span>
              </div>
            </div>

            {/* Mock Dashboard Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Stats & Balance Ledger */}
              <div className="md:col-span-2 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-slate-450 dark:text-zinc-500 tracking-wider">Tinjauan Jurnal Harian (Live Stream)</h3>
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md">
                    Autobooking Active
                  </span>
                </div>

                {/* Live Jurnal Table preview */}
                <div className="bg-slate-50/50 dark:bg-[#0c0e12]/60 rounded-2xl border border-slate-100 dark:border-zinc-900/60 overflow-hidden shadow-inner">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-100/60 dark:bg-zinc-900/50 border-b border-slate-150 dark:border-zinc-850/60 font-black text-slate-450 dark:text-zinc-400">
                        <th className="py-2.5 px-3">Unit</th>
                        <th className="py-2.5 px-3">Keterangan Transaksi</th>
                        <th className="py-2.5 px-3 text-right">Debet</th>
                        <th className="py-2.5 px-3 text-right">Kredit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-zinc-850/60 font-semibold text-slate-700 dark:text-zinc-350">
                      {mockTransactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/30 dark:hover:bg-zinc-900/20 transition-colors">
                          <td className="py-2 px-3 font-mono font-bold text-slate-500 dark:text-zinc-400">{tx.unit}</td>
                          <td className="py-2 px-3 truncate max-w-[200px]">{tx.desc}</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-900 dark:text-zinc-100">
                            {tx.debet > 0 ? `Rp ${tx.debet.toLocaleString('id-ID')}` : '-'}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-slate-900 dark:text-zinc-100">
                            {tx.kredit > 0 ? `Rp ${tx.kredit.toLocaleString('id-ID')}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* balanced status bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/10 dark:border-emerald-400/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <ShieldCheck className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-slate-900 dark:text-zinc-150 leading-tight">Ledger Status: Balanced</div>
                      <div className="text-[9px] text-slate-400 dark:text-zinc-550 mt-0.5">Selisih pembukuan Debet & Kredit: <span className="font-mono font-bold">Rp 0 (0.00%)</span></div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-250/20 dark:border-emerald-500/15 px-2.5 py-1 rounded-lg">
                    Balance Verified
                  </span>
                </div>
              </div>

              {/* Right Column: Dynamic System Console Mockup */}
              <div className="bg-slate-50 dark:bg-[#0c0e12]/70 rounded-2xl border border-slate-100 dark:border-zinc-900/60 p-4 space-y-4 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between shrink-0">
                    <span className="text-[10px] font-black text-slate-450 dark:text-zinc-500 uppercase tracking-widest">Koneksi Database</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="space-y-3">
                    {/* DB Sync Indicator 1 */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200/40 dark:border-zinc-900 shadow-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-[10.5px] font-bold truncate text-slate-800 dark:text-zinc-300">HQ Central Server</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded uppercase">Connected</span>
                    </div>

                    {/* DB Sync Indicator 2 */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200/40 dark:border-zinc-900 shadow-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-[10.5px] font-bold truncate text-slate-800 dark:text-zinc-300">Unit Kebun Seumadam</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded uppercase">Synced</span>
                    </div>

                    {/* DB Sync Indicator 3 */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200/40 dark:border-zinc-900 shadow-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-[10.5px] font-bold truncate text-slate-800 dark:text-zinc-300">Pabrik Kelapa Sawit (PKS)</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded uppercase">Synced</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100/60 dark:bg-zinc-900/50 p-2.5 rounded-xl border border-slate-150 dark:border-zinc-850/60 text-[9.5px] font-bold font-mono text-slate-500 dark:text-zinc-450 leading-relaxed mt-4 shrink-0">
                  <div className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase mb-1">System Audit Logs:</div>
                  &gt; SIA: Verified balance ledger... OK<br/>
                  &gt; Inventory: Append log checked... OK<br/>
                  &gt; Sync: 3 database clusters active.<br/>
                  &gt; Status: 100% operational.
                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* ERP MODULES BENTO GRID                                        */}
      {/* ------------------------------------------------------------- */}
      <section id="modul" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-slate-200/60 dark:border-zinc-800/80">
        
        {/* Bento Grid Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl text-left">
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Fitur Unggulan</span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight mt-2">
              Satu Sistem Terpadu untuk Seluruh Kebutuhan Kebun & PKS
            </h2>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm max-w-md font-medium text-left leading-relaxed">
            Dari pembukuan akuntansi utama hingga slip upah buruh panen kelapa sawit, seluruh modul PT Semadam dirancang saling terhubung untuk transparansi data mutlak.
          </p>
        </div>

        {/* Bento Grid Structure (5 Modular Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            
            // Layout styling classes
            const gridColSpan = idx < 2 ? 'md:col-span-3' : 'md:col-span-2';
            
            // Color theme presets
            let borderHoverClass = 'hover:border-emerald-500/50';
            let iconBgClass = 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400';
            let badgeClass = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30';
            
            if (m.color === 'blue') {
              borderHoverClass = 'hover:border-blue-500/50';
              iconBgClass = 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400';
              badgeClass = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30';
            } else if (m.color === 'sky') {
              borderHoverClass = 'hover:border-sky-500/50';
              iconBgClass = 'bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400';
              badgeClass = 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30';
            } else if (m.color === 'indigo') {
              borderHoverClass = 'hover:border-indigo-500/50';
              iconBgClass = 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400';
              badgeClass = 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30';
            } else if (m.color === 'amber') {
              borderHoverClass = 'hover:border-amber-500/50';
              iconBgClass = 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400';
              badgeClass = 'text-amber-600 dark:text-amber-450 bg-amber-50 dark:bg-amber-950/30';
            }

            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`${gridColSpan} group relative flex flex-col justify-between p-6 sm:p-7 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl hover:shadow-[0_15px_35px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
              >
                {/* Background soft glowing ring inside card */}
                <div className="absolute -right-16 -bottom-16 w-36 h-36 bg-gradient-to-br from-slate-100 to-transparent dark:from-zinc-800/10 dark:to-transparent rounded-full -z-10 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="space-y-4">
                  {/* Top line with Icon and Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-xl ${iconBgClass} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeClass}`}>
                      {m.badge}
                    </span>
                  </div>

                  {/* Module Name & Summary */}
                  <div>
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-450 transition-colors duration-250">
                      {m.title}
                    </h3>
                    <p className="text-slate-500 dark:text-zinc-450 text-[11px] font-semibold leading-relaxed mt-2.5">
                      {m.description}
                    </p>
                  </div>
                </div>

                {/* Sub Features Details List */}
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-zinc-800/60 space-y-2">
                  {m.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-[10px] font-bold text-slate-650 dark:text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {detail}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* PLANTATION TECH METRICS SECTION                              */}
      {/* ------------------------------------------------------------- */}
      <section id="statistik" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 border-t border-slate-200/60 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/20">
        
        {/* Glowing border outline */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-zinc-800 to-transparent" />
        
        {/* Metric stats columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Stat 1 */}
          <div className="text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-600 dark:text-emerald-450 font-black">
              <Sprout className="w-5 h-5 shrink-0" />
              <span className="text-[10px] uppercase tracking-wider leading-none">Operasional</span>
            </div>
            <div className="text-4xl md:text-5xl font-black font-sans tracking-tight text-slate-900 dark:text-zinc-100">
              5+ <span className="text-lg font-bold text-slate-400">Unit</span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-450 leading-relaxed">
              Kebun Afdeling & Pabrik Kelapa Sawit (PKS) terintegrasi dalam database tunggal.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="text-center sm:text-left space-y-2 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-zinc-800 pt-6 sm:pt-0 sm:pl-8">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-600 dark:text-emerald-450 font-black">
              <Globe className="w-5 h-5 shrink-0" />
              <span className="text-[10px] uppercase tracking-wider leading-none">Sinkronisasi</span>
            </div>
            <div className="text-4xl md:text-5xl font-black font-sans tracking-tight text-slate-900 dark:text-zinc-100">
              99.9%
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-450 leading-relaxed">
              Uptime server awan dengan pencatatan offline cadangan di lokasi kebun terpencil.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="text-center sm:text-left space-y-2 border-t md:border-t-0 md:border-l border-slate-200 dark:border-zinc-800 pt-6 md:pt-0 md:pl-8">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-600 dark:text-emerald-450 font-black">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span className="text-[10px] uppercase tracking-wider leading-none">Akurasi Buku</span>
            </div>
            <div className="text-4xl md:text-5xl font-black font-sans tracking-tight text-slate-900 dark:text-zinc-100 font-mono">
              Rp 0
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-450 leading-relaxed">
              Selisih Debet & Kredit dijamin dengan validasi otomatis (auto-balance ledger checks).
            </p>
          </div>

          {/* Stat 4 */}
          <div className="text-center sm:text-left space-y-2 border-t md:border-t-0 md:border-l border-slate-200 dark:border-zinc-800 pt-6 md:pt-0 md:pl-8">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-600 dark:text-emerald-450 font-black">
              <Activity className="w-5 h-5 shrink-0 animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider leading-none">Pemrosesan</span>
            </div>
            <div className="text-4xl md:text-5xl font-black font-sans tracking-tight text-slate-900 dark:text-zinc-100">
              Instant
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-zinc-450 leading-relaxed">
              Append data slip gaji & persediaan gudang dari format excel dalam hitungan detik.
            </p>
          </div>

        </div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* CTA FOOTER PORTAL                                             */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 py-20 text-center">
        
        {/* Glass card panel */}
        <div className="bg-slate-950 dark:bg-zinc-900 border border-slate-900 dark:border-zinc-800/80 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-5 pointer-events-none" />
          {/* Neon blob background */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/10 dark:bg-emerald-500/5 blur-[80px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-teal-500/10 dark:bg-teal-500/5 blur-[80px] rounded-full" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Akses Cepat Portal</span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight">
              Mulai Kelola Operasional PT Semadam Sekarang
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium leading-relaxed">
              Gunakan kredensial otentikasi akunting Anda untuk mengakses data rekap keuangan, master COA, unit kebun, persediaan gudang, dan append proses bulanan.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/portal"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 bg-white hover:bg-zinc-100 text-slate-950 text-sm font-extrabold rounded-2xl shadow-md transition-all scale-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                Buka Dashboard ERP
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* BRAND FOOTER                                                 */}
      {/* ------------------------------------------------------------- */}
      <footer className="relative z-10 w-full border-t border-slate-200/50 dark:border-zinc-800/60 bg-white/50 dark:bg-[#0c0e12]/60 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-sm shadow-inner">
              S
            </div>
            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-widest">
              PT Semedam © {new Date().getFullYear()} • SIM Terintegrasi
            </span>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest select-none">
            <a href="#modul" className="hover:text-emerald-600 dark:hover:text-emerald-450 transition-colors">Modul</a>
            <span>•</span>
            <a href="#preview" className="hover:text-emerald-600 dark:hover:text-emerald-455 transition-colors">Audit Ledger</a>
            <span>•</span>
            <a href="/portal" className="hover:text-emerald-600 dark:hover:text-emerald-455 transition-colors">Portal Dashboard</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
