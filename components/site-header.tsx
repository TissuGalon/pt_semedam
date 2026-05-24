'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, HelpCircle, Activity, Globe, FolderSync } from 'lucide-react';
import { CommandMenu } from '@/components/command-menu';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { useAccounting } from '@/hooks/use-accounting-context';
import { getMasterUnit } from '@/lib/actions/master-unit';

const BULAN_OPTIONS = [
  { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' }, { value: '04', label: 'April' },
  { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' }, { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
];

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { koke, bulan, tahun, setKoke, setBulan, setTahun, isSessionActive } = useAccounting();
  const [units, setUnits] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function loadUnits() {
      try {
        const u = await getMasterUnit();
        setUnits(u);
      } catch (err) {
        console.error("Failed to load master units for header selector:", err);
      }
    }
    loadUnits();
  }, []);

  // Dynamic breadcrumbs structure for premium feel
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const base = { label: 'SIA Semadam', href: '/' };
    switch (pathname) {
      case '/':
        return [base, { label: 'Dashboard', active: true }];
      case '/master-unit':
        return [base, { label: 'Master', href: '#' }, { label: 'Unit Kebun', active: true }];
      case '/master-rekening':
        return [base, { label: 'Master', href: '#' }, { label: 'Rekening (COA)', active: true }];
      case '/input-jurnal':
        return [base, { label: 'Transaksi', href: '#' }, { label: 'Input Jurnal', active: true }];
      case '/input-saldo-awal':
        return [base, { label: 'Transaksi', href: '#' }, { label: 'Saldo Awal', active: true }];
      case '/laporan-jurnal':
        return [base, { label: 'Laporan', href: '#' }, { label: 'Tinjauan Jurnal', active: true }];
      case '/proses':
        return [base, { label: 'Proses', href: '#' }, { label: 'Kalkulasi Bulanan', active: true }];
      case '/proses/append':
        return [base, { label: 'Proses', href: '#' }, { label: 'Append Jurnal', active: true }];
      case '/laporan/buku-besar':
        return [base, { label: 'Laporan', href: '#' }, { label: 'Buku Besar', active: true }];
      case '/laporan/neraca-klasifikasi':
        return [base, { label: 'Laporan', href: '#' }, { label: 'Neraca Klasifikasi', active: true }];
      case '/laporan/neraca-kompilasi':
        return [base, { label: 'Laporan', href: '#' }, { label: 'Neraca Kompilasi', active: true }];
      case '/laporan-manajemen':
        return [base, { label: 'Laporan', href: '#' }, { label: 'Laporan Manajemen', active: true }];
      case '/utility':
        return [base, { label: 'Utility', href: '#' }, { label: 'Dashboard', active: true }];
      case '/utility/console':
        return [base, { label: 'Utility', href: '#' }, { label: 'Admin Console', active: true }];
      case '/utility/backup-restore':
        return [base, { label: 'Utility', href: '#' }, { label: 'Backup & Restore', active: true }];
      default:
        return [base, { label: 'Sistem Informasi Akuntansi', active: true }];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <header className="sticky top-0 z-40 flex w-full max-w-full h-[60px] shrink-0 items-center justify-between border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-background/80 backdrop-blur-md px-6 lg:px-8 transition-all duration-300">
        
        {/* Left Section: Menu trigger and beautiful breadcrumbs */}
        <div className="flex items-center gap-2 min-w-0">
          <SidebarTrigger className="-ml-1 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900 shrink-0 transition-colors duration-200" />
          <Separator
            orientation="vertical"
            className="mx-2 h-4 bg-slate-200 dark:bg-zinc-800 shrink-0"
          />
          
          <nav className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-zinc-500 tracking-tight select-none">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-[10px] text-slate-300 dark:text-zinc-700">/</span>}
                {crumb.active ? (
                  <span className="font-extrabold text-slate-800 dark:text-zinc-100 truncate max-w-[120px] sm:max-w-none transition-all">
                    {crumb.label}
                  </span>
                ) : (
                  <span className="hover:text-slate-600 dark:hover:text-zinc-300 transition-colors duration-200 hidden sm:inline">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Middle Section: Global Active Session Selector */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50/60 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/80 px-3 py-1 rounded-xl shadow-sm max-w-md shrink-0">
          <div className="flex items-center gap-1 text-slate-400 dark:text-zinc-500 shrink-0 select-none">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[9px] font-extrabold uppercase tracking-wider">Unit & Periode:</span>
          </div>
          <div className="flex items-center gap-1">
            <select
              value={koke}
              onChange={(e) => setKoke(e.target.value)}
              className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-zinc-300 cursor-pointer outline-none focus:ring-1 focus:ring-emerald-500 h-6 shrink-0 transition-all hover:border-slate-300"
            >
              <option value="">Unit Kebun</option>
              {units.map((u) => (
                <option key={u.KOKE} value={u.KOKE}>
                  {u.KOKE}
                </option>
              ))}
            </select>
            <select
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-zinc-300 cursor-pointer outline-none focus:ring-1 focus:ring-emerald-500 h-6 shrink-0 transition-all hover:border-slate-300"
            >
              <option value="">Bulan</option>
              {BULAN_OPTIONS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-zinc-300 outline-none focus:ring-1 focus:ring-emerald-500 h-6 w-14 shrink-0 transition-all hover:border-slate-300 font-mono"
              placeholder="Tahun"
            />
          </div>
        </div>

        {/* Right Section: Search input and Theme toggler */}
        <div className="flex items-center gap-3.5 shrink-0">
          
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Search Button (Beautiful dynamic wrapper) */}
            <button
              onClick={() => setOpen(true)}
              className="hidden sm:flex w-[160px] lg:w-[200px] h-9 rounded-xl border border-slate-200/60 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-slate-50/80 dark:hover:bg-zinc-900/60 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 px-3 items-center justify-between shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500/20 group hover:shadow-[0_0_12px_rgba(16,185,129,0.03)] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500 shrink-0 group-hover:text-emerald-500 transition-colors duration-200" />
                <span className="text-[11px] font-bold tracking-tight">Cari Fitur...</span>
              </div>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 px-1.5 font-mono text-[9px] font-black text-slate-400 dark:text-zinc-500 shadow-sm uppercase group-hover:border-emerald-500/20 group-hover:text-emerald-500 transition-all duration-200">
                Ctrl K
              </kbd>
            </button>

            {/* Mobile Search Button (Icon Only) */}
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              size="icon"
              className="sm:hidden h-9 w-9 rounded-xl border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 flex items-center justify-center shadow-sm transition-all focus-visible:ring-emerald-500/20"
            >
              <Search className="h-4 w-4" />
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Global Search Dialog Modal */}
      <CommandMenu open={open} setOpen={setOpen} />
    </>
  );
}
