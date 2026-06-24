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
  LineChart,
  Grid,
  ArrowLeft,
  MapPin
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
  { name: 'Dashboard SIA', href: '/portal/accounting', icon: Home },
  { name: 'Master Unit', href: '/portal/accounting/master-unit', icon: LayoutDashboard },
  { name: 'Master Rekening', href: '/portal/accounting/master-rekening', icon: BookOpen },
  { name: 'Lokasi & Budidaya', href: '/portal/accounting/master-lokasi', icon: MapPin },
];


const transactionNavItems = [
  { name: 'Input Jurnal', href: '/portal/accounting/input-jurnal', icon: FileCheck },
  { name: 'Input Saldo Awal', href: '/portal/accounting/input-saldo-awal', icon: TrendingUp },
  { name: 'Laporan Jurnal', href: '/portal/accounting/laporan-jurnal', icon: FileSpreadsheet },
];

const reportNavItems = [
  { name: 'Buku Besar', href: '/portal/accounting/laporan/buku-besar', icon: Layers },
  { name: 'Neraca Klasifikasi', href: '/portal/accounting/laporan/neraca-klasifikasi', icon: FileSpreadsheet },
  { name: 'Neraca Kompilasi', href: '/portal/accounting/laporan/neraca-kompilasi', icon: Layers },
  { name: 'Laporan Manajemen', href: '/portal/accounting/laporan-manajemen', icon: LineChart },
];

const processNavItems = [
  { name: 'Proses Akhir Bulan', href: '/portal/accounting/proses', icon: Activity },
  { name: 'Append Kas & Gudang', href: '/portal/accounting/proses/append', icon: Database },
];

const utilityNavItems = [
  { name: 'Console Admin', href: '/portal/accounting/utility/console', icon: Terminal },
  { name: 'Backup & Restore', href: '/portal/accounting/utility/backup-restore', icon: History },
];

export function AccountingSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
              <div className="w-8.5 h-8.5 rounded-lg bg-orange-500 flex items-center justify-center text-white font-extrabold text-lg shrink-0 shadow-sm shadow-orange-200">
                S
              </div>
              <div className={cn("transition-all duration-200 flex flex-col min-w-0", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                <span className="font-extrabold text-[9px] text-slate-400 dark:text-zinc-550 tracking-tight leading-none uppercase">PT Semadam ERP</span>
                <span className="text-xs font-black text-slate-900 dark:text-zinc-100 tracking-wider mt-1.5 uppercase">Accounting SIA</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-2 py-3 space-y-4">
        
        {/* Core Gateway Navigator */}
        <SidebarGroup className="p-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20 font-black text-[10px] uppercase tracking-widest gap-2">
                <Link href="/portal">
                  <Grid className="w-4 h-4 text-orange-500" />
                  <span>Pilih Modul ERP</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Menu Utama */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-[9px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-widest px-2.5 mb-1.5">Menu Utama</SidebarGroupLabel>
          <SidebarMenu>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActive} className={cn("text-xs font-bold gap-3 rounded-xl py-2 px-2.5 transition-colors cursor-pointer", isActive ? "bg-slate-100 dark:bg-zinc-800 text-orange-600 dark:text-orange-400 font-extrabold" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-zinc-200")}>
                    <Link href={item.href}>
                      <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-orange-600 dark:text-orange-400" : "text-slate-400 dark:text-zinc-500")} />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Jurnal & Transaksi */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-[9px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-widest px-2.5 mb-1.5">Jurnal & Transaksi</SidebarGroupLabel>
          <SidebarMenu>
            {transactionNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActive} className={cn("text-xs font-bold gap-3 rounded-xl py-2 px-2.5 transition-colors cursor-pointer", isActive ? "bg-slate-100 dark:bg-zinc-800 text-orange-600 dark:text-orange-400 font-extrabold" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-zinc-200")}>
                    <Link href={item.href}>
                      <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-orange-600 dark:text-orange-400" : "text-slate-400 dark:text-zinc-500")} />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Laporan Keuangan */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-[9px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-widest px-2.5 mb-1.5">Laporan Keuangan</SidebarGroupLabel>
          <SidebarMenu>
            {reportNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActive} className={cn("text-xs font-bold gap-3 rounded-xl py-2 px-2.5 transition-colors cursor-pointer", isActive ? "bg-slate-100 dark:bg-zinc-800 text-orange-600 dark:text-orange-400 font-extrabold" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-zinc-200")}>
                    <Link href={item.href}>
                      <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-orange-600 dark:text-orange-400" : "text-slate-400 dark:text-zinc-500")} />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Kalkulasi & Proses */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-[9px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-widest px-2.5 mb-1.5">Kalkulasi & Proses</SidebarGroupLabel>
          <SidebarMenu>
            {processNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActive} className={cn("text-xs font-bold gap-3 rounded-xl py-2 px-2.5 transition-colors cursor-pointer", isActive ? "bg-slate-100 dark:bg-zinc-800 text-orange-600 dark:text-orange-400 font-extrabold" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-zinc-200")}>
                    <Link href={item.href}>
                      <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-orange-600 dark:text-orange-400" : "text-slate-400 dark:text-zinc-500")} />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Alat & Utilitas */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-[9px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-widest px-2.5 mb-1.5">Alat & Utilitas</SidebarGroupLabel>
          <SidebarMenu>
            {utilityNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActive} className={cn("text-xs font-bold gap-3 rounded-xl py-2 px-2.5 transition-colors cursor-pointer", isActive ? "bg-slate-100 dark:bg-zinc-800 text-orange-600 dark:text-orange-400 font-extrabold" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-zinc-200")}>
                    <Link href={item.href}>
                      <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-orange-600 dark:text-orange-400" : "text-slate-400 dark:text-zinc-500")} />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t border-slate-100 dark:border-zinc-800 p-3 bg-slate-50/50 dark:bg-sidebar/20 shrink-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="hover:bg-slate-100 dark:hover:bg-zinc-850 rounded-xl cursor-pointer">
                  <Avatar className="h-7 w-7 rounded-lg shrink-0">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 text-xs font-black">AS</AvatarFallback>
                  </Avatar>
                  <div className={cn("transition-all duration-200 flex flex-col min-w-0 text-left", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                    <span className="text-[10px] font-black text-slate-800 dark:text-zinc-300 truncate leading-none">{user.name}</span>
                    <span className="text-[8px] font-bold text-slate-450 dark:text-zinc-550 truncate mt-1 leading-none">{user.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1 shadow-md" side="right" align="end">
                <DropdownMenuItem className="text-[10px] font-bold py-2 text-slate-700 dark:text-zinc-350 cursor-pointer">
                  <UserIcon className="w-3.5 h-3.5 mr-2" /> Profil Akuntan
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                <DropdownMenuItem asChild className="text-[10px] font-bold py-2 text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer">
                  <Link href="/">
                    <LogOut className="w-3.5 h-3.5 mr-2" /> Log Out / Keluar
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

function UserIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}
