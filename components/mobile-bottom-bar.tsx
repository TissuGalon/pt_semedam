'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileCheck, FileSpreadsheet, TrendingUp, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomBar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Jurnal', href: '/input-jurnal', icon: FileCheck },
    { name: 'Laporan', href: '/laporan-jurnal', icon: FileSpreadsheet },
    { name: 'Saldo', href: '/input-saldo-awal', icon: TrendingUp },
    { name: 'Master', href: '/master-unit', icon: LayoutDashboard },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4 pt-2 bg-gradient-to-t from-slate-100/90 via-slate-100/40 to-transparent dark:from-zinc-950/90 dark:via-zinc-950/40 pointer-events-none">
      <div className="mx-auto max-w-md w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-1.5 flex items-center justify-around pointer-events-auto transition-all duration-300">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 select-none group flex-1"
            >
              <div
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center relative",
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 scale-105"
                    : "text-slate-400 dark:text-zinc-500 group-hover:text-slate-650 dark:group-hover:text-zinc-300"
                )}
              >
                <item.icon className="h-5 w-5" />
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600 animate-in fade-in zoom-in duration-300" />
                )}
              </div>
              <span
                className={cn(
                  "text-[9px] font-black tracking-tight mt-1 transition-all duration-200",
                  isActive
                    ? "text-emerald-700 dark:text-emerald-400 font-extrabold"
                    : "text-slate-500 dark:text-zinc-400 font-bold"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
