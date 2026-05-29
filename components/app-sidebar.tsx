'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  LayoutDashboard, 
  BookOpen, 
  FileCheck, 
  TrendingUp, 
  FileSpreadsheet, 
  LogOut, 
  ChevronRight,
  Database,
  Terminal,
  History,
  Activity,
  Layers,
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNavItems = [
  { name: 'Dashboard', href: '/portal', icon: Home },
  { name: 'Master Unit', href: '/master-unit', icon: LayoutDashboard },
  { name: 'Master Rekening', href: '/master-rekening', icon: BookOpen },
];

const transactionNavItems = [
  { name: 'Input Jurnal', href: '/input-jurnal', icon: FileCheck },
  { name: 'Input Saldo Awal', href: '/input-saldo-awal', icon: TrendingUp },
  { name: 'Laporan Jurnal', href: '/laporan-jurnal', icon: FileSpreadsheet },
];

const reportNavItems = [
  { name: 'Buku Besar', href: '/laporan/buku-besar', icon: Layers },
  { name: 'Neraca Klasifikasi', href: '/laporan/neraca-klasifikasi', icon: FileSpreadsheet },
  { name: 'Neraca Kompilasi', href: '/laporan/neraca-kompilasi', icon: Layers },
  { name: 'Laporan Manajemen', href: '/laporan-manajemen', icon: LineChart },
];

const processNavItems = [
  { name: 'Proses Akhir Bulan', href: '/proses', icon: Activity },
  { name: 'Append Kas & Gudang', href: '/proses/append', icon: Database },
];

const utilityNavItems = [
  { name: 'Console Admin', href: '/utility/console', icon: Terminal },
  { name: 'Backup & Restore', href: '/utility/backup-restore', icon: History },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const user = {
    name: "Akuntan Semedam",
    email: "accounting@semedam.co.id",
    avatar: ""
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-sidebar text-slate-900 dark:text-zinc-100" {...props}>
      {/* Sidebar Header */}
      <SidebarHeader className="border-b border-slate-100 dark:border-zinc-800 py-3.5 px-3 bg-slate-50/50 dark:bg-sidebar/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3.5 w-full overflow-hidden">
              <div className="w-8.5 h-8.5 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shrink-0 shadow-sm shadow-emerald-200">
                S
              </div>
              <div className={cn("transition-all duration-200 flex flex-col min-w-0", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                <span className="font-extrabold text-[9px] text-slate-400 dark:text-zinc-550 tracking-tight leading-none uppercase">Sistem Informasi Manajemen (SIM)</span>
                <span className="text-xs font-black text-slate-900 dark:text-zinc-100 tracking-wider mt-1.5 uppercase">PT Seumadam</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-2 py-4 space-y-3 bg-sidebar text-sidebar-foreground">
        {/* Main Group */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className={cn("px-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 transition-all", isCollapsed && "opacity-0 h-0 hidden")}>
            Menu Utama
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-0.5">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.name}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 h-9 text-xs font-bold transition-all",
                      isActive 
                        ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-bold" 
                        : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("h-4 w-4 shrink-0 transition-transform", isActive ? "text-emerald-600 scale-105" : "text-slate-400")} />
                      <span className={cn("truncate transition-opacity", isCollapsed && "opacity-0")}>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Accounting Group */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className={cn("px-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 transition-all", isCollapsed && "opacity-0 h-0 hidden")}>
            Jurnal & Transaksi
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-0.5">
            {transactionNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.name}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 h-9 text-xs font-bold transition-all",
                      isActive 
                        ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-bold" 
                        : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("h-4 w-4 shrink-0 transition-transform", isActive ? "text-emerald-600 scale-105" : "text-slate-400")} />
                      <span className={cn("truncate transition-opacity", isCollapsed && "opacity-0")}>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Proses Group */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className={cn("px-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 transition-all", isCollapsed && "opacity-0 h-0 hidden")}>
            Kalkulasi & Proses
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-0.5">
            {processNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.name}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 h-9 text-xs font-bold transition-all",
                      isActive 
                        ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-bold" 
                        : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("h-4 w-4 shrink-0 transition-transform", isActive ? "text-emerald-600 scale-105" : "text-slate-400")} />
                      <span className={cn("truncate transition-opacity", isCollapsed && "opacity-0")}>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Laporan Group */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className={cn("px-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 transition-all", isCollapsed && "opacity-0 h-0 hidden")}>
            Laporan Keuangan
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-0.5">
            {reportNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.name}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 h-9 text-xs font-bold transition-all",
                      isActive 
                        ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-bold" 
                        : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("h-4 w-4 shrink-0 transition-transform", isActive ? "text-emerald-600 scale-105" : "text-slate-400")} />
                      <span className={cn("truncate transition-opacity", isCollapsed && "opacity-0")}>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Utility Group */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className={cn("px-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 transition-all", isCollapsed && "opacity-0 h-0 hidden")}>
            Alat & Utilitas
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-0.5">
            {utilityNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.name}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 h-9 text-xs font-bold transition-all",
                      isActive 
                        ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-bold" 
                        : "text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("h-4 w-4 shrink-0 transition-transform", isActive ? "text-emerald-600 scale-105" : "text-slate-400")} />
                      <span className={cn("truncate transition-opacity", isCollapsed && "opacity-0")}>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t border-slate-100 dark:border-zinc-800 p-2 bg-slate-50/50 dark:bg-sidebar/30">
        {/* System Online Badge */}
        {!isCollapsed && (
          <div className="bg-white dark:bg-background/50 rounded-md p-2.5 mb-1.5 border border-slate-100 dark:border-zinc-800 shadow-sm">
            <div className="text-[8px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-1">Status Koneksi</div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-slate-600 dark:text-zinc-400 font-bold font-mono">Server Connected</span>
            </div>
          </div>
        )}

        {/* User Account Popover */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="default"
                  className="data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-zinc-800 data-[state=open]:text-slate-900 dark:data-[state=open]:text-zinc-100 rounded-md h-10 w-full flex items-center justify-between transition-colors px-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar className="h-7 w-7 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="rounded bg-emerald-600 text-white font-bold text-[10px]">AS</AvatarFallback>
                    </Avatar>
                    <div className={cn("grid flex-1 text-left text-[11px] leading-tight min-w-0 transition-opacity", isCollapsed && "opacity-0")}>
                      <span className="truncate font-bold text-slate-800 dark:text-zinc-200">{user.name}</span>
                      <span className="truncate text-[9px] text-slate-400 dark:text-zinc-500 font-medium">{user.email}</span>
                    </div>
                  </div>
                  <ChevronRight className={cn("h-3.5 w-3.5 text-slate-400 dark:text-zinc-500 transition-opacity", isCollapsed && "opacity-0")} />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-md p-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 shadow-md"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={8}
              >
                <div className="px-2 py-1.5 text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">{user.name}</div>
                  <div className="text-[9px] text-slate-400 dark:text-zinc-500 font-medium">{user.email}</div>
                </div>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                
                <DropdownMenuItem asChild className="rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100 flex items-center gap-2 px-2 py-1.5">
                  <Link href="/logout" className="w-full flex items-center gap-2">
                    <LogOut className="h-3.5 w-3.5 text-rose-500" />
                    <span className="font-bold text-xs text-rose-600">Logout</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
