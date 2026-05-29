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
  LayoutDashboard,
  Sprout,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

// Modules details for the ERP gateway selector
const erpModules = [
  {
    id: 'accounting',
    name: 'Accounting & SIA',
    desc: 'Buku besar utama, entri jurnal transaksi harian, dan penyusunan Neraca Klasifikasi & Kompilasi.',
    href: '/dashboard/accounting',
    icon: BookOpen,
    color: 'border-t-orange-500 hover:border-orange-500/50',
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50 dark:bg-orange-950/30',
    btnBorder: 'border-orange-500/20 hover:border-orange-500 hover:bg-orange-50/10 text-orange-600 dark:text-orange-400',
    status: 'Core Module',
    details: 'Double-Entry Ledger'
  },
  {
    id: 'inventory',
    name: 'Inventory & Logistik',
    desc: 'Kontrol stok persediaan pupuk NPK, solar operasional genset PKS, herbisida, hingga bibit afdeling.',
    href: '/dashboard/inventory',
    icon: Boxes,
    color: 'border-t-blue-500 hover:border-blue-500/50',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50 dark:bg-blue-950/30',
    btnBorder: 'border-blue-500/20 hover:border-blue-500 hover:bg-blue-50/10 text-blue-600 dark:text-blue-400',
    status: 'Gudang',
    details: 'Material Control'
  },
  {
    id: 'assets',
    name: 'Asset Tetap (Aktiva)',
    desc: 'Pencatatan inventaris aset pabrik sawit (PKS) dan kendaraan dengan depresiasi bulanan otomatis.',
    href: '/dashboard/assets',
    icon: Building2,
    color: 'border-t-sky-500 hover:border-sky-500/50',
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-50 dark:bg-sky-950/30',
    btnBorder: 'border-sky-500/20 hover:border-sky-500 hover:bg-sky-50/10 text-sky-600 dark:text-sky-400',
    status: 'Aktiva',
    details: 'Straight-line Depr.'
  },
  {
    id: 'kasbank',
    name: 'Kas & Bank (Treasury)',
    desc: 'Manajemen kas kecil kantor kebun, aliran mutasi dropping afdeling, dan laporan rekonsiliasi.',
    href: '/dashboard/kas-bank',
    icon: Wallet,
    color: 'border-t-indigo-600 hover:border-indigo-600/50',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/30',
    btnBorder: 'border-indigo-600/20 hover:border-indigo-600 hover:bg-indigo-50/10 text-indigo-600 dark:text-indigo-400',
    status: 'Kasir',
    details: 'Cash flow & Sync'
  },
  {
    id: 'payroll',
    name: 'Payroll & Slip Upah',
    desc: 'Kalkulasi upah harian Buruh Harian Lepas (BHL) berdasarkan rekap kerja afdeling & tonase TBS.',
    href: '/dashboard/payroll',
    icon: Users,
    color: 'border-t-emerald-500 hover:border-emerald-500/50',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    btnBorder: 'border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-50/10 text-emerald-600 dark:text-emerald-400',
    status: 'Payroll',
    details: 'Buruh Lepas Slip'
  }
];

export default function DashboardHub() {
  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 space-y-8 flex flex-col justify-between">
      
      {/* Upper header - welcoming accountant */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800 pb-6 shrink-0">
        <div>
          <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-450 uppercase tracking-widest leading-none">Pusat Kendali ERP Terpadu</span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight mt-1">
            Portal Utama PT Semadam
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">
            Selamat datang, pilih sub-dashboard modul di bawah ini untuk mengelola aktivitas operasional kebun sawit & keuangan.
          </p>
        </div>
        
        <div className="flex items-center gap-4 self-start md:self-auto">
          {/* Connection Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-250/20 px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Database Cluster Connected
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 shadow-sm text-xs font-bold text-slate-600 dark:text-zinc-300">
            <CalendarDays className="w-4 h-4 text-emerald-600" />
            {format(new Date(), 'dd MMMM yyyy', { locale: localeID })}
          </div>
        </div>
      </div>

      {/* Main Grid: Clean styled Cards representing each Module Dashboard */}
      <div className="flex-1 flex items-center justify-center py-6">
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 md:gap-8">
          {erpModules.map((m, idx) => {
            const Icon = m.icon;
            
            // First 3 items take 2 columns, next 2 items take 3 columns for perfect symmetric layout!
            const gridColSpan = idx < 3 ? 'md:col-span-2' : 'md:col-span-3';

            return (
              <Card 
                key={m.id}
                className={`${gridColSpan} flex flex-col justify-between border-t-4 ${m.color} bg-white dark:bg-zinc-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl group`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center ${m.iconColor} group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[9px] ${m.iconColor} ${m.iconBg} px-2 py-0.5 rounded-full font-black uppercase tracking-wider`}>
                      {m.status}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-4">
                    {m.name}
                  </CardTitle>
                  <CardDescription className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed min-h-[36px]">
                    {m.desc}
                  </CardDescription>
                </CardHeader>

                <CardContent className="py-2">
                  <div className="bg-slate-50 dark:bg-zinc-950/30 rounded-xl p-2.5 border border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-400 dark:text-zinc-500">Kategori Integrasi:</span>
                    <span className="text-slate-700 dark:text-zinc-350 font-mono">{m.details}</span>
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  <Link href={m.href} className="w-full">
                    <Button variant="outline" className={`w-full text-xs font-bold rounded-xl ${m.btnBorder} cursor-pointer`}>
                      Buka Dashboard
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Overview system summary banner */}
      <div className="max-w-5xl mx-auto w-full bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/10 dark:border-emerald-400/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-zinc-100">Status Operasional Kebun Kelapa Sawit</h4>
            <p className="text-[10px] text-slate-450 dark:text-zinc-450 font-semibold mt-0.5">Sistem memantau afdeling dan PKS secara real-time. Status Sinkronisasi: <span className="text-emerald-600">100% Aktif</span>.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[9px] font-black text-slate-450 dark:text-zinc-550 uppercase tracking-widest">Server Uptime 99.9%</span>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest pt-6 border-t border-slate-100 dark:border-zinc-900 shrink-0">
        PT Semedam © {new Date().getFullYear()} • Sistem Informasi Manajemen Terintegrasi
      </div>

    </div>
  );
}
