'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Boxes, 
  ArrowLeft, 
  CalendarDays,
  FileCheck,
  TrendingDown,
  ChevronRight,
  Database,
  Search,
  PlusCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

// Mock inventory lists tailored to PT Semadam oil palm estate
const initialInventory = [
  { id: 'M001', name: 'Pupuk NPK 15-15-15 (Kebun)', category: 'Pupuk/Nutrisi', stock: 45, unit: 'Sack (50kg)', minStock: 200, status: 'Warning', lastUpdate: '2026-05-28' },
  { id: 'M002', name: 'Solar Industri HSD (Genset & Heavy Equipment)', category: 'Bahan Bakar', stock: 12500, unit: 'Liter', minStock: 5000, status: 'Safe', lastUpdate: '2026-05-29' },
  { id: 'M003', name: 'Bibit Kelapa Sawit (Marihat Unggul)', category: 'Pembibitan', stock: 3500, unit: 'Polybag', minStock: 1000, status: 'Safe', lastUpdate: '2026-05-27' },
  { id: 'M004', name: 'Herbisida Glifosat (Weed Control)', category: 'Kimia/Pestisida', stock: 12, unit: 'Drigen (20L)', minStock: 50, status: 'Danger', lastUpdate: '2026-05-26' },
  { id: 'M005', name: 'Sparepart Boiler Chain Conveyor PKS', category: 'Suku Cadang PKS', stock: 8, unit: 'Pcs', minStock: 5, status: 'Safe', lastUpdate: '2026-05-29' },
];

export default function InventoryDashboard() {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredInventory = initialInventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-none">Sub-Modul Operasional</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              <span className="text-[10px] font-black text-slate-450 dark:text-zinc-550 uppercase tracking-widest leading-none">Logistik Kebun</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight mt-1">
              Dashboard Inventory & Gudang
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link href="/proses/append?tab=gudang">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold h-9 cursor-pointer">
              <Database className="w-4 h-4" />
              Append Jurnal Gudang
            </Button>
          </Link>
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 shadow-sm text-xs font-bold text-slate-600 dark:text-zinc-300 h-9">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            {format(new Date(), 'dd MMMM yyyy', { locale: localeID })}
          </div>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Total Stock Value */}
        <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Estimasi Nilai Persediaan</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-zinc-100 font-mono tracking-tight mt-1">
              Rp 1.458.500.000
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-slate-450 font-semibold leading-none">Berdasarkan HPP rata-rata berjalan gudang logistik.</div>
          </CardContent>
        </Card>

        {/* Card 2: Alerts Item */}
        <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Barang Perlu Restock</CardDescription>
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-zinc-100 font-mono tracking-tight mt-1 flex items-center gap-2">
              2 <span className="text-xs font-extrabold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded">Warning</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-slate-450 font-semibold leading-none">Pupuk NPK & Herbisida di bawah batas persediaan minimum.</div>
          </CardContent>
        </Card>

        {/* Card 3: Total Types */}
        <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Item Terdaftar</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-zinc-100 font-mono tracking-tight mt-1">
              124 <span className="text-xs font-bold text-slate-400">SKU</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[10px] text-slate-450 font-semibold leading-none">Terdistribusi di 3 Gudang Afdeling Kebun & Pabrik (PKS).</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Stock Table */}
      <Card className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl shadow-sm flex-1 flex flex-col justify-between overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-zinc-850/60 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <CardTitle className="text-sm font-black text-slate-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <Boxes className="w-4 h-4 text-blue-600" />
              Daftar Persediaan Gudang Logistik PT Semadam
            </CardTitle>
            <CardDescription className="text-[11px] font-semibold text-slate-450 dark:text-zinc-450 mt-0.5">Filter stok pupuk, BBM, bibit kelapa sawit, dan sparepart mesin PKS.</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari SKU / Nama Barang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 w-[200px] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 overflow-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-150 dark:border-zinc-850/60 font-black text-slate-450 dark:text-zinc-400">
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Nama Barang</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Stok Fisik</th>
                <th className="py-3 px-4">Satuan</th>
                <th className="py-3 px-4 text-right">Stok Minimal</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Update Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-zinc-850/60 font-semibold text-slate-700 dark:text-zinc-300">
              {filteredInventory.map((item) => {
                let statusColor = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20';
                if (item.status === 'Warning') statusColor = 'text-amber-600 bg-amber-50 dark:bg-amber-950/20';
                if (item.status === 'Danger') statusColor = 'text-rose-600 bg-rose-50 dark:bg-rose-950/20';

                // Percentage calculations for progressive visual bars
                const percent = Math.min(100, Math.round((item.stock / item.minStock) * 100));
                let barColor = 'bg-blue-500';
                if (percent < 30) barColor = 'bg-rose-500';
                else if (percent < 100) barColor = 'bg-amber-500';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-500 dark:text-zinc-400">{item.id}</td>
                    <td className="py-2.5 px-4 text-slate-900 dark:text-zinc-100">{item.name}</td>
                    <td className="py-2.5 px-4 text-slate-550 dark:text-zinc-400">{item.category}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-900 dark:text-zinc-100 font-bold">
                      {item.stock.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">{item.unit}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-500">{item.minStock.toLocaleString('id-ID')}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded font-black text-[9px] uppercase ${statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-450 dark:text-zinc-550">{item.lastUpdate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>

        <CardFooter className="border-t border-slate-100 dark:border-zinc-850/60 py-3 flex items-center justify-between text-[10px] font-bold text-slate-450 dark:text-zinc-500 shrink-0">
          <span>Menampilkan {filteredInventory.length} SKU dari total 5 barang terpilih</span>
          <div className="flex gap-2">
            <span className="w-1.5 h-3 bg-emerald-500 rounded-sm"></span> Safe
            <span className="w-1.5 h-3 bg-amber-500 rounded-sm"></span> Warning
            <span className="w-1.5 h-3 bg-rose-500 rounded-sm"></span> Danger
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
