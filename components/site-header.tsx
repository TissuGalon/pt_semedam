'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, HelpCircle, Activity } from 'lucide-react';
import { CommandMenu } from '@/components/command-menu';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

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
      default:
        return [base, { label: 'Sistem Informasi Akuntansi', active: true }];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <header className="sticky top-0 z-40 flex w-full max-w-full h-[60px] shrink-0 items-center justify-between border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 lg:px-8 transition-all duration-300">
        
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

        {/* Right Section: System status badge, Search input and Theme toggler */}
        <div className="flex items-center gap-3.5 shrink-0">
          
          {/* Active online status metric */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 dark:border-emerald-500/10 shrink-0 select-none animate-in fade-in slide-in-from-right-3 duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <Activity className="w-2.5 h-2.5" /> Sistem Online
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Search Button (Beautiful dynamic wrapper) */}
            <button
              onClick={() => setOpen(true)}
              className="hidden sm:flex w-[200px] lg:w-[240px] h-9 rounded-xl border border-slate-200/60 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30 hover:bg-slate-50/80 dark:hover:bg-zinc-900/60 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 px-3 items-center justify-between shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500/20 group hover:shadow-[0_0_12px_rgba(16,185,129,0.03)] cursor-pointer"
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
