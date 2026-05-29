'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ArrowLeft, 
  CalendarDays,
  Database,
  BadgePercent,
  TrendingUp,
  FileCheck,
  PlusCircle,
  FileSpreadsheet,
  Search,
  CheckCircle2,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

// Mock assets list tailored to PT Semadam estate & factory (PKS)
const initialAssets = [
  { id: 'A001', name: 'Boiler PKS Model B (Pabrik Kelapa Sawit)', category: 'Mesin PKS', cost: 1850000000, depreciationRate: 10, usefulLife: 10, usefulLifeLeft: 6.5, location: 'PKS Mill' },
  { id: 'A002', name: 'Heavy Excavator Caterpillar 320 (Kanal Kebun)', category: 'Alat Berat', cost: 1250000000, depreciationRate: 12.5, usefulLife: 8, usefulLifeLeft: 4.2, location: 'Afdeling A' },
  { id: 'A003', name: 'Heavy Tractor John Deere 5075 (Tractor Panen)', category: 'Kendaraan Lapangan', cost: 650000000, depreciationRate: 20, usefulLife: 5, usefulLifeLeft: 2.8, location: 'Afdeling B' },
  { id: 'A004', name: 'Genset Silent Perkins 250kVA (Solar Generator)', category: 'Mesin PKS', cost: 420000000, depreciationRate: 10, usefulLife: 10, usefulLifeLeft: 7.1, location: 'PKS Mill' },
  { id: 'A005', name: 'Mobil Truk Angkut TBS Mitsubishi Fuso', category: 'Logistik/Pengangkutan', cost: 380000000, depreciationRate: 20, usefulLife: 5, usefulLifeLeft: 1.5, location: 'Logistik Kebun' },
];

export default function AssetsDashboard() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredAssets = initialAssets.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
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
              <span className="text-[10px] font-black text-sky-650 dark:text-sky-400 uppercase tracking-widest leading-none">Sub-Modul Aktiva</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
              <span className="text-[10px] font-black text-slate-455 dark:text-zinc-550 uppercase tracking-widest leading-none">Aset Tetap</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight mt-1">
              Dashboard Aset & Aktiva
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link href="/proses">
            <Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold h-9 cursor-pointer">
              <BadgePercent className="w-4 h-4" />
              Hitung Penyusutan Aset
            </Button>
          </Link>
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 shadow-sm text-xs font-bold text-slate-600 dark:text-zinc-300 h-9">
            <CalendarDays className="w-4 h-4 text-sky-600" />
            {format(new Date(), 'dd MMMM yyyy', { locale: localeID })}
          </div>
        </div>
      </div>

      {/* Asset metrics statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Gross Asset Cost */}
        <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Nilai Perolehan Aset</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-zinc-100 font-mono tracking-tight mt-1">
              {formatRupiah(4550000000)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-slate-455 font-semibold leading-none">Akumulasi nilai pembelian awal mesin, bangunan, & alat berat.</div>
          </CardContent>
        </Card>

        {/* Card 2: Accumulated Depreciation */}
        <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Akumulasi Depresiasi Buku</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-zinc-100 font-mono tracking-tight mt-1">
              {formatRupiah(1240000000)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-slate-455 font-semibold leading-none">Total penyusutan yang telah dibebankan ke jurnal operasional.</div>
          </CardContent>
        </Card>

        {/* Card 3: Depreciation Method */}
        <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Metode Penyusutan Buku</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-1 flex items-center gap-2">
              Garis Lurus <span className="text-xs font-extrabold text-sky-600 bg-sky-50 dark:bg-sky-950/20 px-2 py-0.5 rounded">Straight-Line</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-slate-455 font-semibold leading-none">Penyusutan sama rata dialokasikan di akhir bulan berjalan.</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Assets Table */}
      <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl shadow-sm flex-1 flex flex-col justify-between overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-zinc-850/60 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <CardTitle className="text-sm font-black text-slate-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              Daftar Aktiva Tetap Pabrik PKS & Kebun PT Semadam
            </CardTitle>
            <CardDescription className="text-[11px] font-semibold text-slate-455 dark:text-zinc-455 mt-0.5">Monitoring perolehan aset operasional, masa penyusutan ekonomi, dan nilai sisa buku.</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Aset / Lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 w-[200px] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-sky-500 font-bold"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 overflow-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-150 dark:border-zinc-850/60 font-black text-slate-455 dark:text-zinc-400">
                <th className="py-3 px-4">Kode Aset</th>
                <th className="py-3 px-4">Nama Aset / Inventaris</th>
                <th className="py-3 px-4">Kategori Aset</th>
                <th className="py-3 px-4 text-right">Nilai Perolehan</th>
                <th className="py-3 px-4 text-center">Tarif</th>
                <th className="py-3 px-4 text-center">Umur Manfaat</th>
                <th className="py-3 px-4 text-center">Sisa Manfaat</th>
                <th className="py-3 px-4 text-right">Lokasi Aktif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-zinc-850/60 font-semibold text-slate-700 dark:text-zinc-300">
              {filteredAssets.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-500 dark:text-zinc-400">{a.id}</td>
                  <td className="py-2.5 px-4 text-slate-900 dark:text-zinc-100">{a.name}</td>
                  <td className="py-2.5 px-4 text-slate-550 dark:text-zinc-400">{a.category}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-900 dark:text-zinc-100 font-bold">
                    {formatRupiah(a.cost)}
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono text-slate-500">{a.depreciationRate}%</td>
                  <td className="py-2.5 px-4 text-center">{a.usefulLife} Tahun</td>
                  <td className="py-2.5 px-4 text-center font-bold text-emerald-600 dark:text-emerald-450">{a.usefulLifeLeft} Tahun</td>
                  <td className="py-2.5 px-4 text-right font-bold text-slate-550 dark:text-zinc-400">{a.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>

        <CardFooter className="border-t border-slate-100 dark:border-zinc-850/60 py-3 flex items-center justify-between text-[10px] font-bold text-slate-455 dark:text-zinc-550 shrink-0">
          <span>Menampilkan {filteredAssets.length} aset terkapitalisasi</span>
          <div className="flex gap-2">
            <span className="w-1.5 h-3 bg-sky-500 rounded-sm"></span> Depresiasi Jurnal Terintegrasi
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
