'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from 'lucide-react';
import { CommandMenu } from '@/components/command-menu';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Simple path-to-title map
  const getBreadcrumbTitle = () => {
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/master-unit':
        return 'Master Unit / Kebun';
      case '/master-rekening':
        return 'Master Rekening (COA)';
      case '/input-jurnal':
        return 'Input Jurnal Transaksi';
      case '/input-saldo-awal':
        return 'Input Saldo Awal';
      case '/laporan-jurnal':
        return 'Tinjauan Jurnal Transaksi';
      default:
        return 'Sistem Informasi Akuntansi';
    }
  };

  return (
    <>
      <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 transition-all duration-300">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50" />
          <Separator
            orientation="vertical"
            className="mx-2 h-4 bg-slate-200"
          />
          <h1 className="text-sm font-extrabold text-slate-800 tracking-tight transition-all">
            {getBreadcrumbTitle()}
          </h1>
        </div>

        {/* Global Search Bar Trigger */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="relative w-full max-w-[240px] h-9 rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-400 hover:text-slate-600 px-3 flex items-center justify-between gap-10 shadow-sm transition-all focus-visible:ring-emerald-500/20"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-xs font-bold tracking-tight">Cari fitur...</span>
            </div>
            <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 font-mono text-[9px] font-black text-slate-400 shadow-sm uppercase">
              Ctrl K
            </kbd>
          </Button>
        </div>
      </header>

      {/* Global Command Menu Modal */}
      <CommandMenu open={open} setOpen={setOpen} />
    </>
  );
}
