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
  CalendarDays
} from 'lucide-react';
import { getMasterUnit } from '@/lib/actions/master-unit';
import { getMasterRekening } from '@/lib/actions/master-rekening';
import { getJurnal } from '@/lib/actions/jurnal';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

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

        // Get last 5 unique voucher or rows sorted by created_at desc
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
      <div className="flex-1 flex items-center justify-center bg-slate-50/30">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="text-sm font-bold text-slate-400">Memuat data ringkasan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 p-6 lg:p-8 space-y-8">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Utama</h1>
          <p className="text-slate-500 text-xs font-semibold mt-1">Ringkasan real-time operasional akuntansi dan database master PT Semedam.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm text-xs font-bold text-slate-600">
          <CalendarDays className="w-4 h-4 text-emerald-600" />
          {format(new Date(), 'dd MMMM yyyy', { locale: localeID })}
        </div>
      </div>

      {/* Grid Row 1: Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Units */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between h-[120px] transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Unit Kebun</span>
            <Building2 className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{stats.totalUnit}</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-1">Unit terdaftar dalam database</div>
          </div>
        </div>

        {/* Metric 2: Rekening */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between h-[120px] transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Master Perkiraan</span>
            <BookOpen className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{stats.totalRekening}</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-1">Kode akun (COA) aktif</div>
          </div>
        </div>

        {/* Metric 3: Jurnals */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between h-[120px] transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Entri Jurnal</span>
            <FileSpreadsheet className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{stats.totalJurnal}</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-1">Baris transaksi dibukukan</div>
          </div>
        </div>

        {/* Metric 4: Balancing Health */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between h-[120px] transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Status Pembukuan</span>
            {stats.isBalanced ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />
            )}
          </div>
          <div>
            <div className={`text-xl font-black tracking-tight ${stats.isBalanced ? 'text-emerald-700' : 'text-rose-700'}`}>
              {stats.isBalanced ? 'Seimbang (Balanced)' : 'Ada Selisih!'}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold mt-1 truncate">
              {stats.isBalanced 
                ? `Total Debit/Kredit match: ${formatRupiah(stats.debetSum)}`
                : `Diff: ${formatRupiah(Math.abs(stats.debetSum - stats.kreditSum))}`
              }
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Recent Transactions and Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Recent Transactions (60% equivalent) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Aktivitas Jurnal Terbaru</h2>
              <p className="text-[10px] text-slate-400 font-medium">Lima baris jurnal transaksi yang baru saja dimasukkan ke pembukuan.</p>
            </div>
            <Link 
              href="/laporan-jurnal" 
              className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 hover:underline uppercase tracking-wider flex items-center gap-1"
            >
              Lihat Semua
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {stats.recentJurnals.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-medium italic">
                Belum ada transaksi jurnal terdaftar.
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                    <th className="p-4">No. Bukti</th>
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Rekening</th>
                    <th className="p-4">Uraian</th>
                    <th className="p-4 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentJurnals.map((jurnal, idx) => {
                    const value = Number(jurnal.DEBET || jurnal.KREDIT || 0);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors text-slate-700 font-medium">
                        <td className="p-4 font-mono font-bold text-slate-900 whitespace-nowrap">{jurnal.NO_BUKJUR}</td>
                        <td className="p-4 whitespace-nowrap">
                          {jurnal.TANGGAL ? format(new Date(jurnal.TANGGAL), 'dd/MM/yyyy') : '-'}
                        </td>
                        <td className="p-4">
                          <div className="font-mono text-[11px] text-slate-900">{jurnal.REK}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{jurnal.NAREK}</div>
                        </td>
                        <td className="p-4 truncate max-w-[180px]" title={jurnal.URAIAN1}>
                          {jurnal.URAIAN1}
                        </td>
                        <td className={`p-4 text-right font-black font-mono whitespace-nowrap ${jurnal.DEBET > 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
                          {formatRupiah(value)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Pintasan Modul Quick Links */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Pintasan Akses Cepat</h2>
            <p className="text-[10px] text-slate-400 font-medium">Modul-modul aplikasi pembukuan akuntansi.</p>
          </div>

          <div className="p-5 flex flex-col gap-3">
            {/* Link 1: Input Jurnal */}
            <Link 
              href="/input-jurnal" 
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/20 shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-all">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 leading-none">Input Jurnal</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-1">Entri transaksi harian per unit</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
            </Link>

            {/* Link 2: Laporan Jurnal */}
            <Link 
              href="/laporan-jurnal" 
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/20 shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-all">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 leading-none">Laporan & Audit</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-1">Review journal & export Excel</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
            </Link>

            {/* Link 3: Input Saldo Awal */}
            <Link 
              href="/input-saldo-awal" 
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/20 shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-all">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 leading-none">Input Saldo Awal</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-1">Pengaturan awal saldo pembukuan</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
            </Link>

            {/* Link 4: Master Rekening */}
            <Link 
              href="/master-rekening" 
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/20 shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-all">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 leading-none">Master Rekening</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-1">Daftar Chart of Accounts (COA)</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
            </Link>

            {/* Link 5: Master Unit */}
            <Link 
              href="/master-unit" 
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/20 shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-all">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 leading-none">Master Unit / Kebun</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-1">Pecahan unit kebun & afdeling</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
