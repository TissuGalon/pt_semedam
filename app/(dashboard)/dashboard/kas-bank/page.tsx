'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  ArrowLeft, 
  CalendarDays,
  Database,
  Coins,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  PlusCircle,
  FileSpreadsheet,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

// Mock treasury mutasi tailored to PT Semadam cashier
const initialMutations = [
  { id: 'T001', date: '2026-05-29', desc: 'Droping Dana Operasional Kebun (Pusat)', bank: 'BSI - 100101', type: 'Masuk', amount: 450000000, status: 'Completed' },
  { id: 'T002', date: '2026-05-28', desc: 'Bayar Pembelian Pupuk NPK Afdeling B', bank: 'Mandiri - 200502', type: 'Keluar', amount: 155000000, status: 'Completed' },
  { id: 'T003', date: '2026-05-28', desc: 'Dropping Kas Kecil Afdeling A', bank: 'Kas Kecil - 100201', type: 'Keluar', amount: 15000000, status: 'Completed' },
  { id: 'T004', date: '2026-05-27', desc: 'Penerimaan Penjualan TBS Sawit PKS', bank: 'BSI - 100101', type: 'Masuk', amount: 320000000, status: 'Completed' },
  { id: 'T005', date: '2026-05-26', desc: 'Biaya Solar Alat Berat Afdeling C', bank: 'Kas Kecil - 100201', type: 'Keluar', amount: 12500000, status: 'Completed' },
];

export default function KasBankDashboard() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredMutations = initialMutations.filter(m =>
    m.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 space-y-8 flex flex-col justify-between">
      
      {/* Top Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800 pb-6 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-widest leading-none">Sub-Modul Keuangan</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              <span className="text-[10px] font-black text-slate-455 dark:text-zinc-550 uppercase tracking-widest leading-none">Treasury</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight mt-1">
              Dashboard Kas & Bank
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link href="/proses/append?tab=kas">
            <Button className="bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-xs font-bold h-9 cursor-pointer">
              <Database className="w-4 h-4" />
              Append Koran Bank
            </Button>
          </Link>
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 shadow-sm text-xs font-bold text-slate-600 dark:text-zinc-300 h-9">
            <CalendarDays className="w-4 h-4 text-indigo-600" />
            {format(new Date(), 'dd MMMM yyyy', { locale: localeID })}
          </div>
        </div>
      </div>

      {/* Financial Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Bank Balance */}
        <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Rekening Bank (BSI & Mandiri)</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-zinc-100 font-mono tracking-tight mt-1">
              {formatRupiah(1850000000)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-slate-450 font-semibold leading-none">Akumulasi saldo rekening koran operasional terintegrasi.</div>
          </CardContent>
        </Card>

        {/* Card 2: Petty Cash */}
        <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kas Kecil Kantor Kebun & Afdeling</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-zinc-100 font-mono tracking-tight mt-1">
              {formatRupiah(124500000)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-slate-450 font-semibold leading-none">Pencatatan kas fisik terbagi di Afdeling A, B, C, & PKS.</div>
          </CardContent>
        </Card>

        {/* Card 3: Reconciliation Status */}
        <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status Rekonsiliasi Kas</CardDescription>
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
            </div>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-1 flex items-center gap-2">
              Balanced <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">Reconciled</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-slate-450 font-semibold leading-none">Saldo fisik pembukuan klop dengan mutasi koran bank.</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Mutations Table */}
      <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl shadow-sm flex-1 flex flex-col justify-between overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-zinc-850/60 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <CardTitle className="text-sm font-black text-slate-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <Wallet className="w-4 h-4 text-indigo-600" />
              Aliran Arus Kas & Treasury PT Semadam
            </CardTitle>
            <CardDescription className="text-[11px] font-semibold text-slate-450 dark:text-zinc-450 mt-0.5">Monitoring mutasi droping dana dari kantor pusat ke kasir kebun sawit.</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Mutasi / Akun..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 w-[200px] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 overflow-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-150 dark:border-zinc-850/60 font-black text-slate-450 dark:text-zinc-400">
                <th className="py-3 px-4">No Transaksi</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Deskripsi Mutasi</th>
                <th className="py-3 px-4">Akun Rekening</th>
                <th className="py-3 px-4 text-center">Jenis</th>
                <th className="py-3 px-4 text-right">Jumlah Mutasi</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-zinc-850/60 font-semibold text-slate-700 dark:text-zinc-300">
              {filteredMutations.map((m) => {
                const isMasuk = m.type === 'Masuk';
                const typeColor = isMasuk ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' : 'text-amber-600 bg-amber-50 dark:bg-amber-950/20';

                return (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-500 dark:text-zinc-400">{m.id}</td>
                    <td className="py-2.5 px-4 font-mono">{m.date}</td>
                    <td className="py-2.5 px-4 text-slate-900 dark:text-zinc-100">{m.desc}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-550 dark:text-zinc-400">{m.bank}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded font-black text-[9px] uppercase ${typeColor}`}>
                        {m.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-900 dark:text-zinc-100 font-bold">
                      {formatRupiah(m.amount)}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> {m.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>

        <CardFooter className="border-t border-slate-100 dark:border-zinc-850/60 py-3 flex items-center justify-between text-[10px] font-bold text-slate-450 dark:text-zinc-550 shrink-0">
          <span>Menampilkan {filteredMutations.length} mutasi harian aktif</span>
          <div className="flex gap-2.5">
            <Link href="/input-jurnal" className="text-indigo-650 hover:underline">Entri Kas Kecil</Link>
            <span>•</span>
            <Link href="/laporan/buku-besar" className="text-indigo-650 hover:underline">Buku Besar Kas</Link>
          </div>
        </CardFooter>
      </Card>

      {/* Footer Branding */}
      <div className="text-center text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest pt-6 border-t border-slate-100 dark:border-zinc-900 shrink-0">
        PT Semedam © {new Date().getFullYear()} • Sistem Informasi Manajemen Terintegrasi
      </div>

    </div>
  );
}
