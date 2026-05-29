'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Building2, 
  ChevronRight,
  Grid,
  FileCheck,
  TrendingDown,
  Calculator,
  LogOut,
  FolderOpen
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
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AssetsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const user = {
    name: "Asset Manager Semedam",
    email: "assets@semedam.co.id",
    avatar: ""
  };

  const navItems = [
    { name: 'Dashboard Aset Tetap', href: '/portal/assets', icon: Home },
    { name: 'Registrasi Aktiva Baru', href: '#', icon: FolderOpen },
    { name: 'Jadwal Penyusutan Aset', href: '#', icon: Calculator },
    { name: 'Jurnal Depresiasi', href: '#', icon: FileCheck },
    { name: 'Laporan Sisa Manfaat', href: '#', icon: TrendingDown },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-sidebar text-slate-900 dark:text-zinc-100" {...props}>
      {/* Sidebar Header */}
      <SidebarHeader className="border-b border-slate-100 dark:border-zinc-800 py-3.5 px-3 bg-slate-50/50 dark:bg-sidebar/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3.5 w-full overflow-hidden">
              <div className="w-8.5 h-8.5 rounded-lg bg-sky-600 flex items-center justify-center text-white font-extrabold text-lg shrink-0 shadow-sm">
                S
              </div>
              <div className={cn("transition-all duration-200 flex flex-col min-w-0", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                <span className="font-extrabold text-[9px] text-slate-400 dark:text-zinc-555 tracking-tight leading-none uppercase">PT Semadam ERP</span>
                <span className="text-xs font-black text-slate-900 dark:text-zinc-100 tracking-wider mt-1.5 uppercase">Aset & Aktiva</span>
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
              <SidebarMenuButton asChild className="text-sky-655 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/20 font-black text-[10px] uppercase tracking-widest gap-2">
                <Link href="/portal">
                  <Grid className="w-4 h-4 text-sky-500" />
                  <span>Pilih Modul ERP</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Menu Utama */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-[9px] font-black text-slate-400 dark:text-zinc-555 uppercase tracking-widest px-2.5 mb-1.5">Menu Aset Tetap</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActive} className={cn("text-xs font-bold gap-3 rounded-xl py-2 px-2.5 transition-colors cursor-pointer", isActive ? "bg-slate-100 dark:bg-zinc-800 text-sky-650 dark:text-sky-400 font-extrabold" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-zinc-200")}>
                    <Link href={item.href}>
                      <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-sky-655" : "text-slate-455 dark:text-zinc-550")} />
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
                    <AvatarFallback className="bg-sky-100 dark:bg-sky-950/30 text-sky-755 dark:text-sky-400 text-xs font-black">AS</AvatarFallback>
                  </Avatar>
                  <div className={cn("transition-all duration-200 flex flex-col min-w-0 text-left", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                    <span className="text-[10px] font-black text-slate-800 dark:text-zinc-300 truncate leading-none">{user.name}</span>
                    <span className="text-[8px] font-bold text-slate-455 dark:text-zinc-555 truncate mt-1 leading-none">{user.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1 shadow-md" side="right" align="end">
                <DropdownMenuItem className="text-[10px] font-bold py-2 text-slate-700 dark:text-zinc-350 cursor-pointer">
                  Profil Aset Tetap
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                <DropdownMenuItem asChild className="text-[10px] font-bold py-2 text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer">
                  <Link href="/">
                    <LogOut className="w-3.5 h-3.5 mr-2" /> Log Out
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
