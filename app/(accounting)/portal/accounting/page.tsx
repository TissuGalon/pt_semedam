'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  CalendarDays,
  PlusCircle,
  Coins,
  FileSpreadsheet
} from 'lucide-react';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AccountingMenu() {
  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 flex flex-col justify-between min-h-[calc(100vh-theme(spacing.14))] md:min-h-screen">
      <div className="space-y-8 flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full">
        {/* ------------------------------------------------------------- */}
        {/* HEADER SECTION                                                */}
        {/* ------------------------------------------------------------- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800/80 pb-6 shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/portal">
              <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em] leading-none">Sistem Informasi Akuntansi (SIA)</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-1">Portal Akuntansi Kebun</h1>
              <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">
                Silakan pilih salah satu fitur akuntansi di bawah ini untuk memulai pencatatan atau pelaporan.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 shadow-sm text-xs font-bold text-slate-650 dark:text-zinc-300 h-9">
              <CalendarDays className="w-4 h-4 text-orange-500" />
              {format(new Date(), 'dd MMMM yyyy', { locale: localeID })}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MENU / BUTTONS GRID                                           */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 my-auto">
          {/* Card 1: Input Jurnal */}
          <Link href="/portal/accounting/input-jurnal" className="group h-full flex">
            <Card className="w-full flex flex-col justify-between bg-white dark:bg-zinc-900 border-2 border-transparent hover:border-orange-500/40 dark:hover:border-orange-500/20 hover:shadow-xl rounded-2xl transition-all duration-300 p-6 group hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform duration-300">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-5 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Input Jurnal
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-slate-500 dark:text-zinc-450 mt-2.5 leading-relaxed">
                  Entri voucher transaksi debet & kredit harian kebun untuk mencatat pengeluaran kas, bank, biaya operasional solar, dan aktivitas pemanen.
                </CardDescription>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-black text-orange-600 dark:text-orange-400">
                <span>Buka Formulir</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
              </div>
            </Card>
          </Link>

          {/* Card 2: Input Saldo */}
          <Link href="/portal/accounting/input-saldo-awal" className="group h-full flex">
            <Card className="w-full flex flex-col justify-between bg-white dark:bg-zinc-900 border-2 border-transparent hover:border-orange-500/40 dark:hover:border-orange-500/20 hover:shadow-xl rounded-2xl transition-all duration-300 p-6 group hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform duration-300">
                  <Coins className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-5 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Input Saldo
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-slate-500 dark:text-zinc-450 mt-2.5 leading-relaxed">
                  Konfigurasi dan kelola saldo awal untuk setiap akun COA (Chart of Accounts) pada unit kebun untuk memulai periode pembukuan akuntansi yang valid.
                </CardDescription>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-black text-orange-600 dark:text-orange-400">
                <span>Buka Input Saldo</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
              </div>
            </Card>
          </Link>

          {/* Card 3: Laporan Jurnal */}
          <Link href="/portal/accounting/laporan-jurnal" className="group h-full flex">
            <Card className="w-full flex flex-col justify-between bg-white dark:bg-zinc-900 border-2 border-transparent hover:border-orange-500/40 dark:hover:border-orange-500/20 hover:shadow-xl rounded-2xl transition-all duration-300 p-6 group hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform duration-300">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight mt-5 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Laporan Jurnal
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-slate-550 dark:text-zinc-450 mt-2.5 leading-relaxed">
                  Tinjau seluruh log voucher jurnal akuntansi kebun, filter berdasarkan tanggal, unit, kata kunci uraian, serta lakukan ekspor file ke spreadsheet Excel.
                </CardDescription>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-black text-orange-600 dark:text-orange-400">
                <span>Lihat Laporan</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
              </div>
            </Card>
          </Link>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SUBTLE BRANDING / META INFO                                   */}
        {/* ------------------------------------------------------------- */}
        <div className="text-center text-[10px] font-black text-slate-400 dark:text-zinc-550 uppercase tracking-widest pt-6 border-t border-slate-100 dark:border-zinc-900 shrink-0">
          PT Semadam © {new Date().getFullYear()} • Sistem Informasi Akuntansi Terintegrasi
        </div>
      </div>
    </div>
  );
}
