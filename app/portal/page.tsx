'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  BookOpen, 
  Boxes, 
  Users, 
  Wallet, 
  ChevronRight, 
  CalendarDays,
  ShieldCheck,
  Sprout,
  Activity,
  ArrowRight,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from '@/components/theme-toggle';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

const erpModules = [
  {
    id: 'accounting',
    name: 'Accounting & SIA',
    desc: 'Buku besar utama, entri jurnal transaksi harian, dan penyusunan Neraca Klasifikasi & Kompilasi.',
    href: '/dashboard/accounting',
    icon: BookOpen,
    color: 'border-t-orange-500 hover:border-orange-550',
    iconColor: 'text-orange-650 dark:text-orange-400',
    iconBg: 'bg-orange-50 dark:bg-orange-950/30',
    btnBg: 'bg-orange-500 hover:bg-orange-600 text-white',
    status: 'Core Module',
    details: 'Double-Entry Ledger'
  },
  {
    id: 'inventory',
    name: 'Inventory & Logistik',
    desc: 'Kontrol stok persediaan pupuk NPK, solar operasional genset PKS, herbisida, hingga bibit afdeling.',
    href: '/dashboard/inventory',
    icon: Boxes,
    color: 'border-t-blue-500 hover:border-blue-550',
    iconColor: 'text-blue-650 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-950/30',
    btnBg: 'bg-blue-550 hover:bg-blue-600 text-white',
    status: 'Gudang',
    details: 'Material Control'
  },
  {
    id: 'assets',
    name: 'Asset Tetap (Aktiva)',
    desc: 'Pencatatan inventaris aset pabrik sawit (PKS) dan kendaraan dengan depresiasi bulanan otomatis.',
    href: '/dashboard/assets',
    icon: Building2,
    color: 'border-t-sky-500 hover:border-sky-550',
    iconColor: 'text-sky-650 dark:text-sky-400',
    iconBg: 'bg-sky-50 dark:bg-sky-950/30',
    btnBg: 'bg-sky-550 hover:bg-sky-600 text-white',
    status: 'Aktiva',
    details: 'Straight-line Depr.'
  },
  {
    id: 'kasbank',
    name: 'Kas & Bank (Treasury)',
    desc: 'Manajemen kas kecil kantor kebun, aliran mutasi dropping afdeling, dan laporan rekonsiliasi.',
    href: '/dashboard/kas-bank',
    icon: Wallet,
    color: 'border-t-indigo-500 hover:border-indigo-550',
    iconColor: 'text-indigo-650 dark:text-indigo-400',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/30',
    btnBg: 'bg-indigo-550 hover:bg-indigo-600 text-white',
    status: 'Kasir',
    details: 'Cash flow & Sync'
  },
  {
    id: 'payroll',
    name: 'Payroll & Slip Upah',
    desc: 'Kalkulasi upah harian Buruh Harian Lepas (BHL) berdasarkan rekap kerja afdeling & tonase TBS.',
    href: '/dashboard/payroll',
    icon: Users,
    color: 'border-t-emerald-500 hover:border-emerald-550',
    iconColor: 'text-emerald-650 dark:text-emerald-450',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    status: 'Payroll',
    details: 'Buruh Lepas Slip'
  }
];

export default function StandalonePortalSelector() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-[#0f1115] text-slate-800 dark:text-zinc-200 transition-colors duration-300 flex flex-col justify-between">
      
      {/* ------------------------------------------------------------- */}
      {/* RETRO DOTTED GRID & RADIAL SPOTLIGHTS BACKGROUND               */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px] opacity-60"
          style={{ maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 70%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 70%, transparent 100%)' }}
        />
        {/* Soft Spotlights */}
        <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[700px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-blue-500/5 dark:bg-blue-600/5 blur-[90px] rounded-full" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* HEADER NAV                                                    */}
      {/* ------------------------------------------------------------- */}
      <header className="relative z-10 w-full border-b border-slate-200/50 dark:border-zinc-800/60 bg-white/70 dark:bg-[#0f1115]/75 backdrop-blur-md px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-emerald-500/10 ring-1 ring-emerald-400/20">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 dark:text-zinc-550 tracking-wider leading-none uppercase">Enterprise Resource Planning</span>
            <span className="text-sm font-black text-slate-900 dark:text-zinc-100 mt-0.5 tracking-wide uppercase">PT SEMADAM</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/">
            <Button variant="outline" size="sm" className="rounded-xl text-xs font-bold gap-2 cursor-pointer h-9">
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali
            </Button>
          </Link>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN SELECTOR SECTION                                         */}
      {/* ------------------------------------------------------------- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-10 flex-1 flex flex-col justify-center items-center w-full">
        
        {/* Title */}
        <div className="text-center max-w-2xl space-y-3 mb-10 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250/20 text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-emerald-600 animate-spin duration-3000" />
            Gateway Sistem Terpusat
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight leading-none mt-2">
            Pilih Portal Modul ERP
          </h1>
          <p className="text-slate-500 dark:text-zinc-450 text-xs font-semibold leading-relaxed">
            Masuk ke lingkungan kerja terintegrasi PT Semadam berdasarkan hak akses Anda.
          </p>
        </div>

        {/* Modular Bento Grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 md:gap-8">
          {erpModules.map((m, idx) => {
            const Icon = m.icon;
            const gridColSpan = idx < 3 ? 'md:col-span-2' : 'md:col-span-3';

            return (
              <Card 
                key={m.id}
                className={`${gridColSpan} flex flex-col justify-between border-t-4 ${m.color} bg-white dark:bg-zinc-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl group relative overflow-hidden`}
              >
                <div className="absolute -right-8 -bottom-8 w-20 h-20 bg-gradient-to-br from-slate-100 to-transparent dark:from-zinc-800/10 rounded-full -z-10 group-hover:scale-150 transition-transform duration-500" />

                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center ${m.iconColor} group-hover:scale-105 transition-transform duration-350`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[9px] ${m.iconColor} ${m.iconBg} px-2 py-0.5 rounded-full font-black uppercase tracking-wider`}>
                      {m.status}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-450 transition-colors">
                    {m.name}
                  </CardTitle>
                  <CardDescription className="text-xs font-semibold text-slate-550 dark:text-zinc-400 mt-2 leading-relaxed min-h-[38px]">
                    {m.desc}
                  </CardDescription>
                </CardHeader>

                <CardContent className="py-3">
                  <div className="bg-slate-50 dark:bg-zinc-950/40 rounded-xl p-2.5 border border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[9.5px] font-black text-slate-450">
                    <span>INTEGRASI UTAMA:</span>
                    <span className="text-slate-700 dark:text-zinc-350 font-mono">{m.details}</span>
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  <Link href={m.href} className="w-full">
                    <Button className={`w-full text-xs font-extrabold rounded-xl ${m.btnBg} cursor-pointer group-hover:shadow shadow-sm transition-all`}>
                      Masuk Portal Kerja
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Sync Status Banner */}
        <div className="w-full max-w-5xl bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/10 dark:border-emerald-400/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Sprout className="w-4.5 h-4.5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-slate-900 dark:text-zinc-100">SIM PT Semadam Status Aktif</h4>
              <p className="text-[10px] text-slate-450 dark:text-zinc-450 font-semibold mt-0.5">Sistem memverifikasi 3 kluster afdeling aktif dan balanced ledger akuntansi.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[9px] font-black text-slate-450 dark:text-zinc-550 uppercase tracking-widest">Online Database Synced</span>
          </div>
        </div>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER                                                        */}
      {/* ------------------------------------------------------------- */}
      <footer className="relative z-10 w-full border-t border-slate-200/50 dark:border-zinc-800/60 bg-white/50 dark:bg-[#0c0e12]/60 py-6 shrink-0 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[9px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-widest">
            PT Semedam © {new Date().getFullYear()} • Sistem Informasi Manajemen
          </span>
          <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-widest">
            <Link href="/" className="hover:text-emerald-600">Landing Page</Link>
            <span>•</span>
            <span className="text-slate-350 dark:text-zinc-700">Audit Balanced</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
