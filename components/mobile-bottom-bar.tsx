'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FileCheck, 
  FileSpreadsheet, 
  TrendingUp, 
  Warehouse, 
  ClipboardList, 
  AlertTriangle, 
  Coins, 
  Scale, 
  Landmark, 
  Users2, 
  Calendar, 
  FileText,
  FolderOpen,
  Calculator
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomBar() {
  const pathname = usePathname();

  // Hide mobile bottom bar on landing page and main portal selection page
  if (pathname === '/' || pathname === '/portal') {
    return null;
  }

  // Helper to determine active module configuration and icons
  const getModuleConfig = () => {
    // 1. Accounting SIA Module
    if (pathname.startsWith('/portal/accounting')) {
      return {
        themeClass: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40",
        indicatorClass: "bg-orange-600",
        activeTextClass: "text-orange-700 dark:text-orange-400",
        navItems: [
          { name: 'SIA Home', href: '/portal/accounting', icon: Home },
          { name: 'Jurnal', href: '/portal/accounting/input-jurnal', icon: FileCheck },
          { name: 'Laporan', href: '/portal/accounting/laporan-jurnal', icon: FileSpreadsheet },
          { name: 'Saldo', href: '/portal/accounting/input-saldo-awal', icon: TrendingUp },
        ]
      };
    }

    // 2. Inventory Module
    if (pathname.startsWith('/portal/inventory')) {
      return {
        themeClass: "text-blue-650 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40",
        indicatorClass: "bg-blue-600",
        activeTextClass: "text-blue-700 dark:text-blue-400",
        navItems: [
          { name: 'Gudang', href: '/portal/inventory', icon: Home },
          { name: 'Masuk', href: '#', icon: Warehouse },
          { name: 'Keluar', href: '#', icon: ClipboardList },
          { name: 'Alerts', href: '#', icon: AlertTriangle },
        ]
      };
    }

    // 3. Kas & Bank Module
    if (pathname.startsWith('/portal/kas-bank')) {
      return {
        themeClass: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40",
        indicatorClass: "bg-indigo-600",
        activeTextClass: "text-indigo-700 dark:text-indigo-400",
        navItems: [
          { name: 'Treasury', href: '/portal/kas-bank', icon: Home },
          { name: 'Kasir', href: '#', icon: Coins },
          { name: 'Rekon', href: '#', icon: Scale },
          { name: 'Transfer', href: '#', icon: Landmark },
        ]
      };
    }

    // 4. Payroll Module
    if (pathname.startsWith('/portal/payroll')) {
      return {
        themeClass: "text-emerald-600 dark:text-emerald-455 bg-emerald-50 dark:bg-emerald-950/30",
        indicatorClass: "bg-emerald-600",
        activeTextClass: "text-emerald-700 dark:text-emerald-455",
        navItems: [
          { name: 'Payroll', href: '/portal/payroll', icon: Home },
          { name: 'BHL', href: '#', icon: Users2 },
          { name: 'Slip', href: '#', icon: FileText },
          { name: 'Kalender', href: '#', icon: Calendar },
        ]
      };
    }

    // 5. Assets Module
    if (pathname.startsWith('/portal/assets')) {
      return {
        themeClass: "text-sky-655 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30",
        indicatorClass: "bg-sky-500",
        activeTextClass: "text-sky-700 dark:text-sky-400",
        navItems: [
          { name: 'Aktiva', href: '/portal/assets', icon: Home },
          { name: 'Registrasi', href: '#', icon: FolderOpen },
          { name: 'Depresiasi', href: '#', icon: Calculator },
          { name: 'Laporan', href: '#', icon: FileSpreadsheet },
        ]
      };
    }

    // Fallback global bottombar if accessed outside modules
    return {
      themeClass: "text-emerald-650 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40",
      indicatorClass: "bg-emerald-600",
      activeTextClass: "text-emerald-750 dark:text-emerald-400",
      navItems: [
        { name: 'SIA Home', href: '/portal/accounting', icon: Home },
        { name: 'Jurnal', href: '/portal/accounting/input-jurnal', icon: FileCheck },
        { name: 'Laporan', href: '/portal/accounting/laporan-jurnal', icon: FileSpreadsheet },
        { name: 'Saldo', href: '/portal/accounting/input-saldo-awal', icon: TrendingUp },
      ]
    };
  };

  const config = getModuleConfig();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4 pt-2 bg-gradient-to-t from-slate-100/90 via-slate-100/40 to-transparent dark:from-zinc-950/90 dark:via-zinc-950/40 pointer-events-none">
      <div className="mx-auto max-w-md w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-1.5 flex items-center justify-around pointer-events-auto transition-all duration-300">
        {config.navItems.map((item) => {
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
                    ? config.themeClass + " scale-105"
                    : "text-slate-400 dark:text-zinc-550 group-hover:text-slate-650 dark:group-hover:text-zinc-300"
                )}
              >
                <item.icon className="h-5 w-5" />
                {isActive && (
                  <span className={cn("absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full animate-in fade-in zoom-in duration-300", config.indicatorClass)} />
                )}
              </div>
              <span
                className={cn(
                  "text-[9px] font-black tracking-tight mt-1 transition-all duration-200",
                  isActive
                    ? config.activeTextClass + " font-extrabold"
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
