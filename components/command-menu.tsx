'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Command } from 'cmdk';
import { Dialog } from 'radix-ui';
import { 
  Home, 
  LayoutDashboard, 
  BookOpen, 
  FileCheck, 
  FileSpreadsheet,
  Search,
  ArrowRight,
  LogOut,
  PlusCircle,
  Activity,
  Layers,
  Scale,
  TrendingUp,
  Terminal,
  History,
  X,
  Boxes,
  Warehouse,
  ClipboardList,
  AlertTriangle,
  Wallet,
  Coins,
  Landmark,
  Users,
  Users2,
  Calendar,
  FileText,
  Building2,
  FolderOpen,
  Calculator,
  Grid,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface SearchItem {
  label: string;
  href: string;
  icon: any;
  shortcut?: string;
}

interface SearchGroup {
  heading: string;
  subheading: string;
  items: SearchItem[];
}

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, setOpen]);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, [setOpen]);

  // Modular dynamic groups configuration per ERP module
  const getModuleSearchConfig = () => {
    // 1. Accounting SIA Module
    if (pathname.startsWith('/portal/accounting')) {
      return {
        highlightClass: "aria-selected:bg-orange-500",
        footerBranding: "SIA Akuntansi Search",
        placeholder: "Cari jurnal, buku besar, unit, akun SIA...",
        groups: [
          {
            heading: "Menu Utama SIA",
            subheading: "Menu Utama & Master",
            items: [
              { label: "Dasbor Akuntansi SIA", href: "/portal/accounting", icon: Home, shortcut: "A" },
              { label: "Master Unit Kebun", href: "/portal/accounting/master-unit", icon: LayoutDashboard },
              { label: "Master Rekening COA", href: "/portal/accounting/master-rekening", icon: BookOpen },
              { label: "Master Lokasi & Budidaya Kebun", href: "/portal/accounting/master-lokasi", icon: MapPin },
              { label: "Entri Saldo Awal", href: "/portal/accounting/input-saldo-awal", icon: PlusCircle },
            ]
          },
          {
            heading: "Transaksi & Laporan Keuangan",
            subheading: "Jurnal & Pelaporan Keuangan",
            items: [
              { label: "Input Jurnal Transaksi", href: "/portal/accounting/input-jurnal", icon: FileCheck, shortcut: "J" },
              { label: "Laporan Jurnal Transaksi", href: "/portal/accounting/laporan-jurnal", icon: FileSpreadsheet, shortcut: "L" },
              { label: "Laporan Buku Besar", href: "/portal/accounting/laporan/buku-besar", icon: Layers },
              { label: "Laporan Neraca Klasifikasi", href: "/portal/accounting/laporan/neraca-klasifikasi", icon: Scale },
              { label: "Laporan Neraca Kompilasi Multi-Unit", href: "/portal/accounting/laporan/neraca-kompilasi", icon: Layers },
              { label: "Laporan Manajemen (LNET) Dashboard", href: "/portal/accounting/laporan-manajemen", icon: TrendingUp },
            ]
          },
          {
            heading: "Kalkulasi & Utilitas",
            subheading: "Proses & Sistem",
            items: [
              { label: "Proses Akhir Bulan (Closing)", href: "/portal/accounting/proses", icon: Activity },
              { label: "Append Data Kas/Gudang (Excel)", href: "/portal/accounting/proses/append", icon: FileSpreadsheet },
              { label: "Developer Audit Console", href: "/portal/accounting/utility/console", icon: Terminal },
              { label: "Backup & Restorasi Database", href: "/portal/accounting/utility/backup-restore", icon: History },
            ]
          }
        ] as SearchGroup[]
      };
    }

    // 2. Inventory & Logistik Module
    if (pathname.startsWith('/portal/inventory')) {
      return {
        highlightClass: "aria-selected:bg-blue-600",
        footerBranding: "Gudang Logistik Search",
        placeholder: "Cari mutasi barang, stok minimal, SKU pupuk...",
        groups: [
          {
            heading: "Menu Utama Gudang",
            subheading: "Logistik & Stok",
            items: [
              { label: "Dasbor Inventory & Gudang", href: "/portal/inventory", icon: Home, shortcut: "I" },
              { label: "Mutasi Masuk Gudang (Pupuk/Solar)", href: "#", icon: Warehouse },
              { label: "Pengeluaran Barang Kebun", href: "#", icon: ClipboardList },
              { label: "Peringatan Stok Minimum", href: "#", icon: AlertTriangle },
            ]
          },
          {
            heading: "Integrasi Akuntansi",
            subheading: "Posting Ke SIA",
            items: [
              { label: "Append Jurnal Gudang Ke SIA", href: "/portal/accounting/proses/append?tab=gudang", icon: FileSpreadsheet },
            ]
          }
        ] as SearchGroup[]
      };
    }

    // 3. Kas & Bank (Treasury) Module
    if (pathname.startsWith('/portal/kas-bank')) {
      return {
        highlightClass: "aria-selected:bg-indigo-600",
        footerBranding: "Treasury Finance Search",
        placeholder: "Cari kasir, dropping bank, rekonsiliasi...",
        groups: [
          {
            heading: "Menu Utama Treasury",
            subheading: "Kas & Rekening",
            items: [
              { label: "Dasbor Kas & Bank", href: "/portal/kas-bank", icon: Home, shortcut: "T" },
              { label: "Kas Kecil Kantor Kebun", href: "#", icon: Coins },
              { label: "Mutasi Rekening Koran BSI/Mandiri", href: "#", icon: Landmark },
              { label: "Rekonsiliasi Kas/Bank Harian", href: "#", icon: Scale },
            ]
          },
          {
            heading: "Integrasi Akuntansi",
            subheading: "Posting Ke SIA",
            items: [
              { label: "Append Koran Bank Ke SIA", href: "/portal/accounting/proses/append?tab=kas", icon: FileSpreadsheet },
            ]
          }
        ] as SearchGroup[]
      };
    }

    // 4. Payroll & Slip Upah Module
    if (pathname.startsWith('/portal/payroll')) {
      return {
        highlightClass: "aria-selected:bg-emerald-600",
        footerBranding: "HR & Slip Pengupahan Search",
        placeholder: "Cari buruh BHL, slip gaji, rekap kerja...",
        groups: [
          {
            heading: "Menu Utama HRD",
            subheading: "Tenaga Kerja & Slip",
            items: [
              { label: "Dasbor Payroll & Gaji", href: "/portal/payroll", icon: Home, shortcut: "P" },
              { label: "Daftar Kelompok Upah Buruh Harian (BHL)", href: "#", icon: Users2 },
              { label: "Slip Gaji Bulanan Staf", href: "#", icon: FileText },
              { label: "Kalender Kerja & Hari Efektif", href: "#", icon: Calendar },
            ]
          },
          {
            heading: "Integrasi Akuntansi",
            subheading: "Posting Ke SIA",
            items: [
              { label: "Upload Slip Gaji Excel Ke SIA", href: "/portal/accounting/proses/append?tab=payroll", icon: FileSpreadsheet },
            ]
          }
        ] as SearchGroup[]
      };
    }

    // 5. Assets Module
    if (pathname.startsWith('/portal/assets')) {
      return {
        highlightClass: "aria-selected:bg-sky-500",
        footerBranding: "Aktiva Aset Tetap Search",
        placeholder: "Cari aset PKS, excavator, depresiasi aktiva...",
        groups: [
          {
            heading: "Menu Utama Aktiva",
            subheading: "Manajemen Aset Tetap",
            items: [
              { label: "Dasbor Aset & Aktiva", href: "/portal/assets", icon: Home, shortcut: "E" },
              { label: "Registrasi Inventaris Baru", href: "#", icon: FolderOpen },
              { label: "Laporan Depresiasi Bulanan", href: "#", icon: Calculator },
              { label: "Laporan Nilai Buku Aset", href: "#", icon: FileSpreadsheet },
            ]
          },
          {
            heading: "Integrasi Akuntansi",
            subheading: "Posting Ke SIA",
            items: [
              { label: "Kalkulasi Depresiasi Akhir Bulan", href: "/portal/accounting/proses", icon: Activity },
            ]
          }
        ] as SearchGroup[]
      };
    }

    // Fallback global search configuration
    return {
      highlightClass: "aria-selected:bg-emerald-600",
      footerBranding: "ERP Semadam Search",
      placeholder: "Cari fitur, modul, laporan...",
      groups: [
        {
          heading: "Portal Utama",
          subheading: "Navigasi Global",
          items: [
            { label: "Pilih Portal Modul ERP", href: "/portal", icon: Grid },
            { label: "Landing Page PT Semadam", href: "/", icon: Home },
          ]
        }
      ] as SearchGroup[]
    };
  };

  const config = getModuleSearchConfig();

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Search"
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[15vh] bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <Dialog.Title className="sr-only">Menu Pencarian Global</Dialog.Title>
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-slate-900/5 dark:ring-zinc-950/50">
        <div className="flex items-center border-b border-slate-100 dark:border-zinc-800 px-4">
          <Search className="h-5 w-5 text-slate-400 dark:text-zinc-500 mr-3" />
          <Command.Input
            placeholder={config.placeholder}
            className="flex-1 h-14 bg-transparent outline-none text-[15px] font-medium text-slate-700 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
          />
          <div className="flex items-center gap-2 ml-2">
            <kbd className="h-5 px-1.5 rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[10px] font-black text-slate-400 dark:text-zinc-500 shadow-sm uppercase">ESC</kbd>
            <button
              onClick={() => setOpen(false)}
              className="h-5 w-5 flex items-center justify-center rounded border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 hover:text-slate-660 dark:hover:text-zinc-300 transition-colors"
              title="Tutup Pencarian"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>

        <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <Command.Empty className="py-12 text-center text-sm text-slate-500 dark:text-zinc-400">
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-slate-50 dark:bg-zinc-900 rounded-2xl">
                <Search className="h-6 w-6 text-slate-300 dark:text-zinc-600" />
              </div>
              <p className="font-medium">Tidak ada fitur yang ditemukan.</p>
            </div>
          </Command.Empty>

          {config.groups.map((group, groupIdx) => (
            <React.Fragment key={group.heading}>
              {groupIdx > 0 && <Command.Separator className="h-px bg-slate-100 dark:bg-zinc-800 mx-2 my-2" />}
              <Command.Group heading={group.heading} className="px-2 pt-2 pb-1">
                <div className="text-[10px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-[0.2em] mb-2 pl-2">
                  {group.subheading}
                </div>
                {group.items.map((item) => (
                  <Item
                    key={item.label}
                    onSelect={() => runCommand(() => router.push(item.href))}
                    icon={item.icon}
                    label={item.label}
                    shortcut={item.shortcut}
                    highlightClass={config.highlightClass}
                  />
                ))}
              </Command.Group>
            </React.Fragment>
          ))}

          {/* Global Exit Navigation */}
          <Command.Separator className="h-px bg-slate-100 dark:bg-zinc-800 mx-2 my-2" />
          <Command.Group heading="Navigasi ERP" className="px-2 pt-1 pb-2">
            <div className="text-[10px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-[0.2em] mb-2 pl-2">
              Sistem & Sesi
            </div>
            <Item
              onSelect={() => runCommand(() => router.push('/portal'))}
              icon={Grid}
              label="Pindah Modul ERP (Portal)"
              shortcut="M"
              highlightClass={config.highlightClass}
            />
            <Item
              onSelect={() => runCommand(() => router.push('/logout'))}
              icon={LogOut}
              label="Keluar dari SIA Semadam (Logout)"
              highlightClass={config.highlightClass}
            />
          </Command.Group>
        </Command.List>

        <div className="border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50 p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <kbd className="h-5 px-1.5 rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[10px] font-black text-slate-400 dark:text-zinc-550 shadow-sm">↑↓</kbd>
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-widest">Navigasi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="h-5 px-1.5 rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[10px] font-black text-slate-400 dark:text-zinc-550 shadow-sm">ENTER</kbd>
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-widest">Pilih</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-450 dark:text-zinc-550 uppercase tracking-[0.15em]">
            {config.footerBranding}
          </span>
        </div>
      </div>
    </Command.Dialog>
  );
}

function Item({ 
  onSelect, 
  icon: Icon, 
  label, 
  shortcut,
  highlightClass
}: { 
  onSelect: () => void; 
  icon: any; 
  label: string;
  shortcut?: string;
  highlightClass: string;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className={cn(
        "flex items-center justify-between px-3 py-3 rounded-xl cursor-default select-none aria-selected:text-white transition-all duration-200 group",
        highlightClass
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-zinc-900 group-aria-selected:bg-white/20 flex items-center justify-center transition-colors">
          <Icon className="h-5 w-5 text-slate-450 dark:text-zinc-500 group-aria-selected:text-white transition-colors" />
        </div>
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {shortcut && (
          <kbd className="hidden sm:inline-flex h-5 w-5 items-center justify-center rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[10px] font-black text-slate-400 dark:text-zinc-550 group-aria-selected:border-white/20 group-aria-selected:bg-white/20 group-aria-selected:text-white transition-all">
            {shortcut}
          </kbd>
        )}
        <ArrowRight className="h-4 w-4 opacity-0 group-aria-selected:opacity-100 -translate-x-2 group-aria-selected:translate-x-0 transition-all text-white/70" />
      </div>
    </Command.Item>
  );
}
