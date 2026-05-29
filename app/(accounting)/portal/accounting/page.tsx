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
  PlusCircle,
  Activity,
  Layers,
  Scale,
  TrendingUp,
  FileCheck,
  Loader2,
  CalendarDays,
  Coins,
  History,
  FileText,
  BadgePercent,
  ChevronRight,
  ShieldCheck,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';
import { getMasterUnit } from '@/lib/actions/master-unit';
import { getMasterRekening } from '@/lib/actions/master-rekening';
import { getJurnal } from '@/lib/actions/jurnal';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
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

export default function AccountingDashboard() {
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
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="text-sm font-bold text-slate-400 dark:text-zinc-550 animate-pulse">Memuat Statistik Keuangan SIA...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 space-y-8">
      
      {/* ------------------------------------------------------------- */}
      {/* HEADER SECTION                                                */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800/80 pb-6 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/portal">
            <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em] leading-none">Sistem Informasi Akuntansi (SIA)</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-1">Dasbor Akuntansi Kebun</h1>
            <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">
              Ringkasan data balance sheet, bagan rekening COA, dan audit voucher jurnal harian PT Semadam.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 shadow-sm text-xs font-bold text-slate-650 dark:text-zinc-300 h-9">
            <CalendarDays className="w-4 h-4 text-orange-500" />
            {format(new Date(), 'dd MMMM yyyy', { locale: localeID })}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* METRIC STATISTICS DECK                                         */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Trial Balance Symmetrical Check */}
        <Card className="bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-sm rounded-2xl relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-widest flex items-center justify-between">
              Keseimbangan Buku
              <Scale className="w-4 h-4 text-orange-500" />
            </CardDescription>
            <CardTitle className="text-xl font-black mt-2 tracking-tight flex items-center gap-2">
              {stats.isBalanced ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-5 h-5 shrink-0" /> Balanced
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 animate-pulse">
                  <AlertCircle className="w-5 h-5 shrink-0" /> Selisih
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 text-[11px] font-bold text-slate-500 dark:text-zinc-400">
            Debet/Kredit: <span className="font-mono text-slate-800 dark:text-zinc-200 font-extrabold">{formatRupiah(stats.debetSum)}</span>
          </CardContent>
        </Card>

        {/* Card 2: Total Voucher Jurnal */}
        <Card className="bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-sm rounded-2xl relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-widest flex items-center justify-between">
              Baris Jurnal
              <FileCheck className="w-4 h-4 text-orange-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-black mt-2 tracking-tight text-slate-850 dark:text-zinc-150 font-mono">
              {stats.totalJurnal} <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">baris</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 text-[11px] font-bold text-slate-500 dark:text-zinc-400">
            Telah diposting ke Buku Besar utama.
          </CardContent>
        </Card>

        {/* Card 3: Bagan Akun COA */}
        <Card className="bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-sm rounded-2xl relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-widest flex items-center justify-between">
              Bagan Rekening (COA)
              <BookOpen className="w-4 h-4 text-orange-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-black mt-2 tracking-tight text-slate-850 dark:text-zinc-150 font-mono">
              {stats.totalRekening} <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">Akun</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 text-[11px] font-bold text-slate-500 dark:text-zinc-400">
            Struktur rekening kebun terstandarisasi.
          </CardContent>
        </Card>

        {/* Card 4: Unit Kebun Terdaftar */}
        <Card className="bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-sm rounded-2xl relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-widest flex items-center justify-between">
              Unit Kebun & PKS
              <Building2 className="w-4 h-4 text-orange-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-black mt-2 tracking-tight text-slate-850 dark:text-zinc-150 font-mono">
              {stats.totalUnit} <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">Unit</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 text-[11px] font-bold text-slate-500 dark:text-zinc-400">
            Terdiri dari Afdeling, PKS, & ADM.
          </CardContent>
        </Card>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* QUICK ACTIONS BENTO GRID                                      */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] pl-1">
          Menu Utama & Aksi Cepat Akuntansi
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Action 1: Input Jurnal */}
          <Link href="/portal/accounting/input-jurnal" className="group">
            <Card className="h-full bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 hover:border-orange-500/40 dark:hover:border-orange-500/20 hover:shadow-md p-5 rounded-2xl transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform duration-300">
                <PlusCircle className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-4 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                Entri Jurnal Harian
              </CardTitle>
              <CardDescription className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-1 leading-normal">
                Input voucher transaksi debet & kredit harian untuk pengeluaran kas, bank, solar, dan biaya pemanen.
              </CardDescription>
            </Card>
          </Link>

          {/* Action 2: Laporan Jurnal */}
          <Link href="/portal/accounting/laporan-jurnal" className="group">
            <Card className="h-full bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 hover:border-orange-500/40 dark:hover:border-orange-500/20 hover:shadow-md p-5 rounded-2xl transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform duration-300">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-4 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                Laporan Buku Jurnal
              </CardTitle>
              <CardDescription className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-1 leading-normal">
                Tinjau ulang seluruh catatan voucher, filter per unit/tanggal, lakukan audit internal, dan ekspor data ke Excel.
              </CardDescription>
            </Card>
          </Link>

          {/* Action 3: Buku Besar */}
          <Link href="/portal/accounting/laporan/buku-besar" className="group">
            <Card className="h-full bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 hover:border-orange-500/40 dark:hover:border-orange-500/20 hover:shadow-md p-5 rounded-2xl transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform duration-300">
                <Layers className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-4 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                Buku Besar Per Akun
              </CardTitle>
              <CardDescription className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-1 leading-normal">
                Tampilkan rekap mutasi debet, kredit, dan saldo akhir berjalan terperinci untuk masing-masing kode akun COA.
              </CardDescription>
            </Card>
          </Link>

          {/* Action 4: Neraca Klasifikasi */}
          <Link href="/portal/accounting/laporan/neraca-klasifikasi" className="group">
            <Card className="h-full bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 hover:border-orange-500/40 dark:hover:border-orange-500/20 hover:shadow-md p-5 rounded-2xl transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform duration-300">
                <Scale className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-4 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                Laporan Neraca Klasifikasi
              </CardTitle>
              <CardDescription className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-1 leading-normal">
                Susun Neraca Harian/Bulanan kebun berdasarkan kelompok Aktiva Lancar, Tetap, serta Kewajiban & Ekuitas secara riil.
              </CardDescription>
            </Card>
          </Link>

          {/* Action 5: Laporan Manajemen (LNET) */}
          <Link href="/portal/accounting/laporan-manajemen" className="group">
            <Card className="h-full bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 hover:border-orange-500/40 dark:hover:border-orange-500/20 hover:shadow-md p-5 rounded-2xl transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform duration-300">
                <TrendingUp className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-4 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                Laporan Manajemen (LNET)
              </CardTitle>
              <CardDescription className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-1 leading-normal">
                Dashboard analisis profitabilitas kebun, perbandingan realisasi budget, serta pemantauan biaya pokok produksi TBS.
              </CardDescription>
            </Card>
          </Link>

          {/* Action 6: Proses Akhir Bulan (Closing) */}
          <Link href="/portal/accounting/proses" className="group">
            <Card className="h-full bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 hover:border-orange-500/40 dark:hover:border-orange-500/20 hover:shadow-md p-5 rounded-2xl transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform duration-300">
                <Activity className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-4 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                Proses & Closing Bulanan
              </CardTitle>
              <CardDescription className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-1 leading-normal">
                Kalkulasi neraca saldo (Trial Balance), jalankan tutup buku akhir bulan, dan impor append data eksternal kas/gudang.
              </CardDescription>
            </Card>
          </Link>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RECENT TRANSACTIONS TABLE                                      */}
      {/* ------------------------------------------------------------- */}
      <Card className="bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800/80 shadow-sm rounded-2xl">
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/60">
          <div>
            <CardTitle className="text-sm font-black text-slate-900 dark:text-zinc-100 tracking-tight">
              Entri Jurnal Terakhir
            </CardTitle>
            <CardDescription className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 mt-0.5">
              Menampilkan 5 baris voucher jurnal yang paling baru ditambahkan ke database.
            </CardDescription>
          </div>
          <Link href="/portal/accounting/laporan-jurnal">
            <Button variant="outline" className="h-8 text-[10px] font-black border-orange-500/20 hover:border-orange-500 hover:bg-orange-50/10 text-orange-600 dark:text-orange-400 rounded-lg flex items-center gap-1">
              Lihat Seluruh Jurnal
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-850/60 bg-slate-50/50 dark:bg-zinc-900/50 text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                  <th className="py-3.5 px-6">Tanggal</th>
                  <th className="py-3.5 px-4">No. Voucher</th>
                  <th className="py-3.5 px-4">Akun (COA)</th>
                  <th className="py-3.5 px-4">Uraian / Keterangan</th>
                  <th className="py-3.5 px-4 text-right">Debet</th>
                  <th className="py-3.5 px-6 text-right">Kredit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-850/50 text-xs font-bold text-slate-700 dark:text-zinc-300">
                {stats.recentJurnals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center font-semibold text-slate-400 dark:text-zinc-500">
                      Belum ada transaksi jurnal terdaftar.
                    </td>
                  </tr>
                ) : (
                  stats.recentJurnals.map((j, idx) => (
                    <tr key={j.id || idx} className="hover:bg-slate-50/40 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="py-4 px-6 text-slate-500 dark:text-zinc-400 select-none">
                        {j.TANGGAL || '-'}
                      </td>
                      <td className="py-4 px-4 font-mono font-extrabold text-[11px] text-orange-600 dark:text-orange-400 tracking-tight">
                        {j.NO_BUKJUR || '-'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-slate-800 dark:text-zinc-200">{j.REK || '-'}</span>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">{j.NAREK || '-'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 max-w-[240px] truncate text-slate-650 dark:text-zinc-400 font-semibold">
                        {j.URAIAN1 || '-'}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-extrabold text-emerald-650 dark:text-emerald-400">
                        {j.DEBET > 0 ? formatRupiah(j.DEBET) : '-'}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-extrabold text-slate-700 dark:text-zinc-300">
                        {j.KREDIT > 0 ? formatRupiah(j.KREDIT) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER BRANDING                                                */}
      {/* ------------------------------------------------------------- */}
      <div className="text-center text-[10px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-widest pt-6 border-t border-slate-100 dark:border-zinc-900 shrink-0">
        PT Semedam © {new Date().getFullYear()} • Sistem Informasi Akuntansi Terintegrasi
      </div>

    </div>
  );
}
