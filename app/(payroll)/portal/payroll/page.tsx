'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Users, 
  ArrowLeft, 
  CalendarDays,
  Database,
  Users2,
  TrendingUp,
  FileCheck,
  PlusCircle,
  FileSpreadsheet,
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

// Mock payroll kelompok upah tailored to PT Semadam oil estate
const initialPayrollGroups = [
  { id: 'G001', groupName: 'Staf & Karyawan Kantor Kebun (Bulanan)', count: 24, account: '500.01 - Gaji Staf', totalDisbursed: 120000000, method: 'Direct Transfer', lastRun: '2026-05-25' },
  { id: 'G002', groupName: 'Buruh Pemanen Afdeling A (BHL / Tonase)', count: 48, account: '500.02 - Upah Pemanen', totalDisbursed: 68500000, method: 'Kas Tunai / Drop', lastRun: '2026-05-26' },
  { id: 'G003', groupName: 'Buruh Pemanen Afdeling B (BHL / Tonase)', count: 52, account: '500.02 - Upah Pemanen', totalDisbursed: 72400000, method: 'Kas Tunai / Drop', lastRun: '2026-05-26' },
  { id: 'G004', groupName: 'Buruh Pemanen Afdeling C (BHL / Tonase)', count: 42, account: '500.02 - Upah Pemanen', totalDisbursed: 59300000, method: 'Kas Tunai / Drop', lastRun: '2026-05-26' },
  { id: 'G005', groupName: 'Operator Boiler & Press Pabrik (PKS)', count: 19, account: '500.03 - Upah Pabrik', totalDisbursed: 45000000, method: 'Direct Transfer', lastRun: '2026-05-27' },
];

export default function PayrollDashboard() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredGroups = initialPayrollGroups.filter(g =>
    g.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.id.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Link href="/portal">
            <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-650 dark:text-emerald-400 uppercase tracking-widest leading-none">Sub-Modul HR & Upah</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[10px] font-black text-slate-455 dark:text-zinc-550 uppercase tracking-widest leading-none">Tenaga Kerja</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight mt-1">
              Dashboard Payroll & Gaji
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link href="/proses/append?tab=payroll">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold h-9 cursor-pointer">
              <Database className="w-4 h-4" />
              Upload Slip Gaji Excel
            </Button>
          </Link>
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 shadow-sm text-xs font-bold text-slate-600 dark:text-zinc-300 h-9">
            <CalendarDays className="w-4 h-4 text-emerald-600" />
            {format(new Date(), 'dd MMMM yyyy', { locale: localeID })}
          </div>
        </div>
      </div>

      {/* Workforce stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Total Employees */}
        <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pekerja Kebun Aktif (BHL & Staf)</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-zinc-100 font-mono tracking-tight mt-1">
              185 <span className="text-xs font-bold text-slate-455">Karyawan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-slate-450 font-semibold leading-none">Terdiri dari buruh panen harian, supir truk TBS, & operator pabrik.</div>
          </CardContent>
        </Card>

        {/* Card 2: Total Disbursed */}
        <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Pembayaran Upah Bulan Berjalan</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-zinc-100 font-mono tracking-tight mt-1">
              {formatRupiah(365200000)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-slate-450 font-semibold leading-none">Akumulasi upah BHL panen & gaji bulanan staf kantor.</div>
          </CardContent>
        </Card>

        {/* Card 3: Kelompok Akun */}
        <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kelompok Rekening Beban Jurnal</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-zinc-100 font-mono tracking-tight mt-1">
              500 <span className="text-xs font-bold text-slate-400">(COA Upah)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-slate-450 font-semibold leading-none">Otomatis dialokasikan ke jurnal operasional unit terkait.</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Payroll Groups Table */}
      <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl shadow-sm flex-1 flex flex-col justify-between overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-zinc-850/60 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <CardTitle className="text-sm font-black text-slate-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Kelompok Slip Upah Buruh Harian & Pemanen PT Semadam
            </CardTitle>
            <CardDescription className="text-[11px] font-semibold text-slate-455 dark:text-zinc-455 mt-0.5">Monitoring rekap gaji per divisi afdeling kebun dan upah borongan tonase TBS sawit.</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Divisi / Akun..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 w-[200px] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 overflow-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-150 dark:border-zinc-850/60 font-black text-slate-450 dark:text-zinc-400">
                <th className="py-3 px-4">Kode Kelompok</th>
                <th className="py-3 px-4">Kelompok Pekerja / Afdeling</th>
                <th className="py-3 px-4 text-right">Jumlah Pekerja</th>
                <th className="py-3 px-4">Rujukan Akun COA</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4 text-right">Total Upah</th>
                <th className="py-3 px-4 text-right">Update Slip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-zinc-850/60 font-semibold text-slate-700 dark:text-zinc-300">
              {filteredGroups.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-500 dark:text-zinc-400">{g.id}</td>
                  <td className="py-2.5 px-4 text-slate-900 dark:text-zinc-100">{g.groupName}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-900 dark:text-zinc-100 font-bold">
                    {g.count} Orang
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-550 dark:text-zinc-400">{g.account}</td>
                  <td className="py-2.5 px-4 text-slate-500 font-bold">{g.method}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-900 dark:text-zinc-100 font-bold">
                    {formatRupiah(g.totalDisbursed)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-450 dark:text-zinc-550 flex items-center justify-end gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" /> {g.lastRun}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>

        <CardFooter className="border-t border-slate-100 dark:border-zinc-850/60 py-3 flex items-center justify-between text-[10px] font-bold text-slate-450 dark:text-zinc-550 shrink-0">
          <span>Menampilkan {filteredGroups.length} divisi tenaga kerja aktif</span>
          <div className="flex gap-2">
            <span className="w-1.5 h-3 bg-emerald-500 rounded-sm"></span> Jurnal Auto-Posting Active
          </div>
        </CardFooter>
      </Card>

      {/* Footer Branding */}
      <div className="text-center text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest pt-6 border-t border-slate-100 dark:border-zinc-900 shrink-0">
        PT Semadam © {new Date().getFullYear()} • Sistem Informasi Manajemen Terintegrasi
      </div>

    </div>
  );
}
