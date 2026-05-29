'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  BookOpen, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Loader2,
  CalendarDays,
  Layers,
  Boxes,
  Users,
  Wallet,
  Coins,
  History,
  FileText,
  BadgePercent,
  ChevronRight,
  ShieldCheck,
  Settings,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { getMasterUnit } from '@/lib/actions/master-unit';
import { getMasterRekening } from '@/lib/actions/master-rekening';
import { getJurnal } from '@/lib/actions/jurnal';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalUnit: number;
  totalRekening: number;
  totalJurnal: number;
  isBalanced: boolean;
  debetSum: number;
  kreditSum: number;
  recentJurnals: any[];
  loading: boolean;
}

export default function Home() {
  const [stats, setStats] = React.useState<DashboardStats>({
    totalUnit: 0,
    totalRekening: 0,
    totalJurnal: 0,
    isBalanced: true,
    debetSum: 0,
    kreditSum: 0,
    recentJurnals: [],
    loading: true,
  });

  const [activeModal, setActiveModal] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadStats() {
      try {
        const [units, reks, jurnals] = await Promise.all([
          getMasterUnit(),
          getMasterRekening(),
          getJurnal()
        ]);

        let dSum = 0;
        let kSum = 0;
        jurnals.forEach(j => {
          dSum += Number(j.DEBET || 0);
          kSum += Number(j.KREDIT || 0);
        });

        const sortedJurnals = [...jurnals]
          .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
          .slice(0, 5);

        setStats({
          totalUnit: units.length,
          totalRekening: reks.length,
          totalJurnal: jurnals.length,
          isBalanced: Math.abs(dSum - kSum) < 0.01,
          debetSum: dSum,
          kreditSum: kSum,
          recentJurnals: sortedJurnals,
          loading: false
        });
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }
    loadStats();
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  if (stats.loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50/30 dark:bg-transparent">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="text-sm font-bold text-slate-400 dark:text-zinc-500 animate-pulse">Memuat data modul...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 space-y-8 flex flex-col justify-between">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800 pb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">Dashboard Utama</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">Ringkasan real-time operasional akuntansi dan database master PT Semedam.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 shadow-sm text-xs font-bold text-slate-600 dark:text-zinc-300 self-start md:self-auto">
          <CalendarDays className="w-4 h-4 text-emerald-600" />
          {format(new Date(), 'dd MMMM yyyy', { locale: localeID })}
        </div>
      </div>

      {/* Main Grid: Clean styled Shadcn Card components */}
      <div className="flex-1 flex items-center justify-center py-6">
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 md:gap-8">
          
          {/* 1. Accounting Card */}
          <Card 
            onClick={() => setActiveModal('accounting')}
            className="md:col-span-2 flex flex-col justify-between border-t-4 border-t-orange-500 hover:border-orange-500/50 bg-white dark:bg-zinc-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-2xl"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Aktif</span>
              </div>
              <CardTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-4">Accounting</CardTitle>
              <CardDescription className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-1">Jurnal & Pembukuan Utama</CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="bg-slate-50 dark:bg-zinc-950/30 rounded-xl p-3 border border-slate-100 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400 dark:text-zinc-500">Status Buku</span>
                  {stats.isBalanced ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Balanced</span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 font-black animate-pulse">Selisih</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400 dark:text-zinc-500">Total Jurnal</span>
                  <span className="text-slate-700 dark:text-zinc-300 font-mono">{stats.totalJurnal} baris</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" className="w-full text-xs font-bold border-orange-500/20 hover:border-orange-500 hover:bg-orange-50/10 text-orange-600 dark:text-orange-400 rounded-xl">
                Buka Portal
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* 2. Inventory Card */}
          <Card 
            onClick={() => setActiveModal('inventory')}
            className="md:col-span-2 flex flex-col justify-between border-t-4 border-t-blue-500 hover:border-blue-500/50 bg-white dark:bg-zinc-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-2xl"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600">
                  <Boxes className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Gudang</span>
              </div>
              <CardTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-4">Inventory</CardTitle>
              <CardDescription className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-1">Persediaan & Logistik Kebun</CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="bg-slate-50 dark:bg-zinc-950/30 rounded-xl p-3 border border-slate-100 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400 dark:text-zinc-500">Integrasi</span>
                  <span className="text-slate-700 dark:text-zinc-300">Append Log</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400 dark:text-zinc-500">Master COA</span>
                  <span className="text-slate-700 dark:text-zinc-300">Gudang & Material</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" className="w-full text-xs font-bold border-blue-500/20 hover:border-blue-500 hover:bg-blue-50/10 text-blue-600 dark:text-blue-400 rounded-xl">
                Kelola Stok
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* 3. Asset Tetap Card */}
          <Card 
            onClick={() => setActiveModal('asset')}
            className="md:col-span-2 flex flex-col justify-between border-t-4 border-t-sky-500 hover:border-sky-500/50 bg-white dark:bg-zinc-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-2xl"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/30 flex items-center justify-center text-sky-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Aktiva</span>
              </div>
              <CardTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-4">Asset Tetap</CardTitle>
              <CardDescription className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-1">Aktiva Tetap & Depresiasi</CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="bg-slate-50 dark:bg-zinc-950/30 rounded-xl p-3 border border-slate-100 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400 dark:text-zinc-500">Penyusutan</span>
                  <span className="text-slate-700 dark:text-zinc-300">Garis Lurus</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400 dark:text-zinc-500">Kategori</span>
                  <span className="text-slate-700 dark:text-zinc-300">Pabrik, Kebun & Mesin</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" className="w-full text-xs font-bold border-sky-500/20 hover:border-sky-500 hover:bg-sky-50/10 text-sky-600 dark:text-sky-400 rounded-xl">
                Buka Inventaris
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* 4. Kas / Bank Card */}
          <Card 
            onClick={() => setActiveModal('kasbank')}
            className="md:col-start-2 md:col-span-2 flex flex-col justify-between border-t-4 border-t-indigo-600 hover:border-indigo-600/50 bg-white dark:bg-zinc-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-2xl"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Kasir</span>
              </div>
              <CardTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-4">KAS/BANK</CardTitle>
              <CardDescription className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-1">Arus Kas & Rekonsiliasi</CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="bg-slate-50 dark:bg-zinc-950/30 rounded-xl p-3 border border-slate-100 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400 dark:text-zinc-500">Prefix Rekening</span>
                  <span className="text-slate-700 dark:text-zinc-300 font-mono">100 (Kas & Setara)</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400 dark:text-zinc-500">Fitur Utama</span>
                  <span className="text-slate-700 dark:text-zinc-300">Rekonsiliasi & Mutasi</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" className="w-full text-xs font-bold border-indigo-600/20 hover:border-indigo-600 hover:bg-indigo-50/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                Buka Kasir
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* 5. Payroll Card */}
          <Card 
            onClick={() => setActiveModal('payroll')}
            className="md:col-span-2 flex flex-col justify-between border-t-4 border-t-emerald-500 hover:border-emerald-500/50 bg-white dark:bg-zinc-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-2xl"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Payroll</span>
              </div>
              <CardTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-4">Payroll/Gaji/Upah</CardTitle>
              <CardDescription className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-1">Upah & Tenaga Kerja Kebun</CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <div className="bg-slate-50 dark:bg-zinc-950/30 rounded-xl p-3 border border-slate-100 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400 dark:text-zinc-500">Kelompok Rekening</span>
                  <span className="text-slate-700 dark:text-zinc-300 font-mono">500 (Beban Tenaga Kerja)</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400 dark:text-zinc-500">Metode</span>
                  <span className="text-slate-700 dark:text-zinc-300">Impor Slip Upah Excel</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" className="w-full text-xs font-bold border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-50/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                Proses Gaji
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>

        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest pt-6 border-t border-slate-100 dark:border-zinc-900 shrink-0">
        PT Semedam © {new Date().getFullYear()} • Sistem Informasi Akuntansi Terintegrasi
      </div>

      {/* ============================================================== */}
      {/* INTERACTIVE MODALS FOR MODULE SHORTCUTS                        */}
      {/* ============================================================== */}
      
      {/* 1. Accounting Portal Modal */}
      <Dialog open={activeModal === 'accounting'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-orange-600 rounded-full"></span>
              Modul Akuntansi & Jurnal Semedam
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 dark:text-zinc-500 font-semibold mt-1">
              Akses cepat pembukuan akuntansi, entri jurnal transaksi, dan penyusunan laporan keuangan.
            </DialogDescription>
          </DialogHeader>

          {/* Quick Stats Banner inside Accounting Modal */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-zinc-950/40 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800 shadow-inner">
            <div className="text-center">
              <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Status Buku</div>
              {stats.isBalanced ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Balanced
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full border border-rose-200/50 dark:border-rose-500/20 animate-pulse">
                  <AlertCircle className="w-3 h-3" /> Selisih
                </span>
              )}
            </div>
            <div className="text-center border-x border-slate-200 dark:border-zinc-800">
              <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Total Jurnal</div>
              <div className="text-sm font-mono font-black text-slate-800 dark:text-zinc-200">{stats.totalJurnal} baris</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Master COA</div>
              <div className="text-sm font-mono font-black text-slate-800 dark:text-zinc-200">{stats.totalRekening} Akun</div>
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="space-y-3">
            <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Akses Menu Transaksi</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link 
                href="/input-jurnal" 
                onClick={() => setActiveModal(null)}
                className="flex flex-col gap-2 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-500/20 hover:bg-orange-50/20 dark:hover:bg-orange-950/10 shadow-sm transition-all group"
              >
                <FileCheck className="w-5 h-5 text-orange-600 group-hover:scale-105 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">Input Jurnal</div>
                  <div className="text-[9px] text-slate-400 dark:text-zinc-500 font-medium mt-0.5">Entri transaksi harian kebun</div>
                </div>
              </Link>

              <Link 
                href="/input-saldo-awal" 
                onClick={() => setActiveModal(null)}
                className="flex flex-col gap-2 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-500/20 hover:bg-orange-50/20 dark:hover:bg-orange-950/10 shadow-sm transition-all group"
              >
                <TrendingUp className="w-5 h-5 text-orange-600 group-hover:scale-105 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">Saldo Awal</div>
                  <div className="text-[9px] text-slate-400 dark:text-zinc-500 font-medium mt-0.5">Pengaturan awal saldo akun</div>
                </div>
              </Link>

              <Link 
                href="/laporan-jurnal" 
                onClick={() => setActiveModal(null)}
                className="flex flex-col gap-2 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-500/20 hover:bg-orange-50/20 dark:hover:bg-orange-950/10 shadow-sm transition-all group"
              >
                <FileSpreadsheet className="w-5 h-5 text-orange-600 group-hover:scale-105 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">Laporan Jurnal</div>
                  <div className="text-[9px] text-slate-400 dark:text-zinc-500 font-medium mt-0.5">Audit & Review entri data</div>
                </div>
              </Link>
            </div>

            <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider pt-2">Laporan Keuangan & Buku Besar</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link 
                href="/laporan/buku-besar" 
                onClick={() => setActiveModal(null)}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-700 bg-slate-50/20 dark:bg-transparent shadow-sm transition-all group"
              >
                <div className="w-8 h-8 rounded bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400 group-hover:scale-105 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-850 dark:text-zinc-200 leading-none">Buku Besar Akun</div>
                  <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-medium mt-1 inline-block">Mutasi & saldo berjalan per COA</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link 
                href="/laporan-manajemen" 
                onClick={() => setActiveModal(null)}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-700 bg-slate-50/20 dark:bg-transparent shadow-sm transition-all group"
              >
                <div className="w-8 h-8 rounded bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-400 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-850 dark:text-zinc-200 leading-none">Laporan Manajemen (LM)</div>
                  <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-medium mt-1 inline-block">Analisis biaya produksi (LNET)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Inventory Detail Modal */}
      <Dialog open={activeModal === 'inventory'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              Modul Gudang & Persediaan (Inventory)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 dark:text-zinc-500 font-semibold mt-1">
              Data logistik material kebun, pupuk, bibit, dan suku cadang PT Semedam.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-zinc-950/40 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 dark:text-zinc-500">Status Modul</span>
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full border border-emerald-200/40">
                  <ShieldCheck className="w-3 h-3" /> Terintegrasi
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 dark:text-zinc-500">Metode Input</span>
                <span className="text-slate-700 dark:text-zinc-300">Append Gudang (Excel/CSV)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-500 dark:text-zinc-400">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                Data stok pergudangan dicatat di unit kebun masing-masing.
              </p>
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                Sinkronisasi saldo material dengan sistem jurnal utama dilakukan secara berkala.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/proses/append?tab=gudang"
                onClick={() => setActiveModal(null)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-sm shadow-blue-100 dark:shadow-none"
              >
                <Layers className="w-4 h-4" />
                Append Data Gudang
              </Link>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-extrabold text-xs py-2 rounded-xl transition-all"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. Asset Detail Modal */}
      <Dialog open={activeModal === 'asset'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-sky-500 rounded-full"></span>
              Modul Aktiva & Aset Tetap
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 dark:text-zinc-500 font-semibold mt-1">
              Pencatatan aset pabrik, kebun, mesin, inventaris kantor, dan depresiasi bulanan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-zinc-950/40 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 dark:text-zinc-500">Status Modul</span>
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full border border-emerald-200/40">
                  <ShieldCheck className="w-3 h-3" /> Aktif (Buku Depresiasi)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 dark:text-zinc-500">Metode Depresiasi</span>
                <span className="text-slate-700 dark:text-zinc-300">Garis Lurus (Straight Line)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-500 dark:text-zinc-400">
              <p className="flex gap-2">
                <span className="text-sky-500">•</span>
                Kalkulasi nilai penyusutan aktiva dilakukan setiap akhir bulan buku.
              </p>
              <p className="flex gap-2">
                <span className="text-sky-500">•</span>
                Hasil kalkulasi otomatis dicatat sebagai beban depresiasi di Jurnal Transaksi.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/proses"
                onClick={() => setActiveModal(null)}
                className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-sm"
              >
                <BadgePercent className="w-4 h-4" />
                Jalankan Kalkulasi Penyusutan
              </Link>
              <Link
                href="/proses/append?tab=penyusutan"
                onClick={() => setActiveModal(null)}
                className="w-full border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-extrabold text-xs py-2 rounded-xl text-center transition-all"
              >
                Upload File Aktiva Tetap (Append)
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. Kas / Bank Detail Modal */}
      <Dialog open={activeModal === 'kasbank'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-900 rounded-full"></span>
              Modul Kas & Bank (Treasury)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 dark:text-zinc-500 font-semibold mt-1">
              Kelola kas kecil kantor pusat, transfer bank ke afdeling, dan laporan rekonsiliasi.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-zinc-950/40 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 dark:text-zinc-500">Status Jurnal Kas</span>
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full border border-emerald-200/40">
                  <ShieldCheck className="w-3 h-3" /> Live Integration
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 dark:text-zinc-500">Aliran Akun Utama</span>
                <span className="text-slate-700 dark:text-zinc-300 font-mono">100. Kas / Bank</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-500 dark:text-zinc-400">
              <p className="flex gap-2">
                <span className="text-indigo-500">•</span>
                Mutasi kas dan bank harian wajib balance sebelum di-posting ke Buku Besar.
              </p>
              <p className="flex gap-2">
                <span className="text-indigo-500">•</span>
                Gunakan menu *Append* untuk mengimpor rekening koran bank eksternal.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/input-jurnal"
                onClick={() => setActiveModal(null)}
                className="w-full flex items-center justify-center gap-2 bg-indigo-900 hover:bg-indigo-950 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-sm"
              >
                <Coins className="w-4 h-4" />
                Entri Transaksi Kas / Bank
              </Link>
              <Link
                href="/proses/append?tab=kas"
                onClick={() => setActiveModal(null)}
                className="w-full border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-extrabold text-xs py-2 rounded-xl text-center transition-all"
              >
                Append Rekening Koran Bank (Excel)
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 5. Payroll Detail Modal */}
      <Dialog open={activeModal === 'payroll'} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-emerald-600 rounded-full"></span>
              Modul Gaji & Payroll Karyawan
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 dark:text-zinc-500 font-semibold mt-1">
              Pemrosesan gaji bulanan staf, buruh panen kebun, lembur, dan bonus karyawan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-zinc-950/40 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 dark:text-zinc-500">Status Integrasi</span>
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full border border-emerald-200/40">
                  <ShieldCheck className="w-3 h-3" /> Rekening Upah (500)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 dark:text-zinc-500">Metode Jurnal</span>
                <span className="text-slate-700 dark:text-zinc-300">Append Transaksi Tenaga Kerja</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-500 dark:text-zinc-400">
              <p className="flex gap-2">
                <span className="text-emerald-500">•</span>
                Beban gaji dan upah otomatis dikelompokkan berdasarkan Unit Kebun (`KOKE`) terkait.
              </p>
              <p className="flex gap-2">
                <span className="text-emerald-500">•</span>
                Impor data upah harian pemanen dilakukan via slip konsol excel.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/proses/append?tab=payroll"
                onClick={() => setActiveModal(null)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-sm"
              >
                <Users className="w-4 h-4" />
                Upload Rekap Gaji & Upah
              </Link>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-extrabold text-xs py-2 rounded-xl transition-all"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
