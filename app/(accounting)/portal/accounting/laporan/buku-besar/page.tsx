'use client';

import * as React from 'react';
import { 
  Layers, 
  Search, 
  Printer, 
  ArrowRight,
  TrendingDown,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { useAccounting } from '@/hooks/use-accounting-context';
import { getBukuBesar } from '@/lib/actions/laporan';
import { getMasterRekening } from '@/lib/actions/master-rekening';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function BukuBesarPage() {
  const { koke, bulan, tahun, isSessionActive } = useAccounting();
  const [coaList, setCoaList] = React.useState<any[]>([]);
  const [selectedRek, setSelectedRek] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isCoaOpen, setIsCoaOpen] = React.useState(false);
  
  const [ledgerData, setLedgerData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  // Load COA list once
  React.useEffect(() => {
    const loadCOA = async () => {
      try {
        const data = await getMasterRekening();
        setCoaList(data);
        if (data.length > 0) {
          // select first account as default
          setSelectedRek(data[0].REKSUB);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadCOA();
  }, []);

  const loadLedger = async (rekCode: string) => {
    if (!isSessionActive || !rekCode) return;
    setLoading(true);
    try {
      const data = await getBukuBesar(rekCode, koke, bulan, tahun);
      setLedgerData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (selectedRek) {
      loadLedger(selectedRek);
    }
  }, [selectedRek, koke, bulan, tahun, isSessionActive]);

  const filteredCOA = coaList.filter(coa => 
    coa.REKSUB.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coa.NAMA_PERK.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCoa = coaList.find(c => c.REKSUB === selectedRek);

  if (!isSessionActive) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/40 dark:bg-transparent h-full">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-zinc-150 tracking-tight uppercase">Sesi Belum Aktif</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-2 leading-relaxed">
            Pilih Unit Kebun, Bulan, dan Tahun di baris menu atas terlebih dahulu untuk menampilkan laporan Buku Besar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 space-y-6 flex flex-col print:p-0 print:bg-white print:text-black">
      {/* Header (hidden in print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5 print:hidden">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            Laporan Buku Besar
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">
            Kartu Mutasi Buku Besar per rekening COA untuk Unit <span className="text-emerald-600 font-bold">{koke}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Print trigger */}
          <Button 
            onClick={() => window.print()} 
            variant="outline" 
            size="sm" 
            className="border-slate-200 dark:border-zinc-800 h-9 font-bold text-xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" /> Cetak Buku Besar
          </Button>
        </div>
      </div>

      {/* Account Selector (hidden in print) */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="relative flex-1 max-w-md">
          <label className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest block mb-1.5">Pencarian & Pilih Rekening COA:</label>
          <div className="relative">
            <Button
              onClick={() => setIsCoaOpen(!isCoaOpen)}
              variant="outline"
              className="w-full justify-between h-9 text-left font-bold text-xs border-slate-200 dark:border-zinc-800 dark:bg-zinc-950"
            >
              {activeCoa ? `[${activeCoa.REKSUB}] ${activeCoa.NAMA_PERK}` : 'Pilih Rekening...'}
              <Search className="w-4 h-4 ml-2 text-slate-400 shrink-0" />
            </Button>

            {isCoaOpen && (
              <div className="absolute top-11 left-0 w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xl z-20 p-2 space-y-2 max-h-72 overflow-y-auto">
                <input
                  type="text"
                  placeholder="Ketik kode atau nama rekening..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 px-2 rounded border border-slate-200 dark:border-zinc-800 text-[11px] font-semibold bg-slate-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <div className="space-y-0.5 max-h-48 overflow-y-auto">
                  {filteredCOA.map(coa => (
                    <button
                      key={coa.REKSUB}
                      onClick={() => {
                        setSelectedRek(coa.REKSUB);
                        setIsCoaOpen(false);
                        setSearchQuery('');
                      }}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 text-[11px] font-semibold rounded hover:bg-slate-50 dark:hover:bg-zinc-900 block truncate transition-colors",
                        selectedRek === coa.REKSUB ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-bold" : "text-slate-600 dark:text-zinc-400"
                      )}
                    >
                      <span className="font-mono text-emerald-600 font-bold mr-1.5">[{coa.REKSUB}]</span> {coa.NAMA_PERK}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {activeCoa && (
          <div className="bg-slate-50 dark:bg-zinc-950/20 border border-slate-100 dark:border-zinc-850 rounded-lg p-2.5 px-4 text-xs">
            <div className="text-[9px] font-bold text-slate-400 uppercase">Tipe Saldo Normal</div>
            <div className="font-extrabold text-slate-700 dark:text-zinc-300 mt-0.5">
              {selectedRek.startsWith('1') || selectedRek.startsWith('5') ? 'DEBET (Aktiva / Biaya)' : 'KREDIT (Pasiva / Pendapatan)'}
            </div>
          </div>
        )}
      </div>

      {/* Printable Report Sheet */}
      {ledgerData && activeCoa && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1 p-6 print:p-0 print:border-none print:shadow-none">
          
          {/* Corporate Header for Print */}
          <div className="flex flex-col items-center text-center pb-4 border-b border-slate-200 dark:border-zinc-800">
            <h2 className="text-sm font-black text-slate-900 dark:text-zinc-100 uppercase tracking-wide">PT SEMEDAM</h2>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-zinc-200 uppercase mt-0.5">BUKU BESAR MUTASI REKENING</h3>
            <div className="flex items-center gap-2 mt-1.5 text-[10px] font-bold text-slate-500">
              <span>Unit: {koke}</span>
              <span>•</span>
              <span>Periode: {bulan}/{tahun}</span>
            </div>
            <div className="mt-2 text-xs font-black text-slate-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 px-3 py-1 rounded-md bg-slate-50 dark:bg-zinc-900/30">
              REKENING: {activeCoa.REKSUB} - {activeCoa.NAMA_PERK}
            </div>
          </div>

          {/* Quick Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 print:grid-cols-3">
            <div className="bg-slate-50 dark:bg-zinc-950/20 border border-slate-100 dark:border-zinc-850 p-3 rounded-lg text-center">
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Saldo Awal</span>
              <div className="text-xs font-black text-slate-800 dark:text-zinc-200 mt-1 font-mono">
                Rp {Number(ledgerData.beginning.balance).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950/20 border border-slate-100 dark:border-zinc-850 p-3 rounded-lg text-center">
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Mutasi Bulan Ini</span>
              <div className="text-xs font-black text-emerald-700 dark:text-emerald-450 mt-1 font-mono">
                Rp {ledgerData.rows.reduce((sum: number, r: any) => sum + (ledgerData.isDebitNormal ? (r.DEBET - r.KREDIT) : (r.KREDIT - r.DEBET)), 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950/20 border border-slate-100 dark:border-zinc-850 p-3 rounded-lg text-center">
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Saldo Akhir</span>
              <div className="text-xs font-black text-slate-900 dark:text-zinc-150 mt-1 font-mono">
                Rp {Number(ledgerData.endingBalance).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-400 font-bold text-xs gap-1.5">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" /> Memuat mutasi kartu...
              </div>
            ) : ledgerData.rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center gap-1.5 h-full">
                <FolderOpen className="w-8 h-8 text-slate-300" />
                <div className="text-xs font-bold">Tidak ada aktivitas transaksi bulan ini.</div>
                <p className="text-[10px] text-slate-400 font-semibold max-w-xs">Saldo awal akun tetap tercatat sesuai saldo awal di atas.</p>
              </div>
            ) : (
              <table className="w-full text-left text-[10px] border-collapse min-w-[700px]">
                <thead className="bg-slate-50/50 dark:bg-zinc-900/60 text-[9px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-3 py-2 font-black">Tanggal</th>
                    <th className="px-3 py-2 font-black">No Bukti</th>
                    <th className="px-3 py-2 font-black">Keterangan Jurnal</th>
                    <th className="px-3 py-2 font-black">Lawan</th>
                    <th className="px-3 py-2 font-black text-right">Debet (Rp)</th>
                    <th className="px-3 py-2 font-black text-right">Kredit (Rp)</th>
                    <th className="px-3 py-2 font-black text-right">Saldo Akhir (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-850 font-mono">
                  {/* Saldo Awal row */}
                  <tr className="bg-slate-50/20 dark:bg-zinc-950/10 italic text-slate-400 font-bold">
                    <td className="px-3 py-2">01/{bulan}</td>
                    <td className="px-3 py-2">SA.AWAL</td>
                    <td className="px-3 py-2 font-sans font-black text-slate-500 dark:text-zinc-400 uppercase tracking-tight text-[9px]">Saldo Awal Terbuka Periode</td>
                    <td className="px-3 py-2">-</td>
                    <td className="px-3 py-2 text-right">{ledgerData.beginning.debet > 0 ? ledgerData.beginning.debet.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}</td>
                    <td className="px-3 py-2 text-right">{ledgerData.beginning.kredit > 0 ? ledgerData.beginning.kredit.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}</td>
                    <td className="px-3 py-2 text-right text-slate-700 dark:text-zinc-300 font-black">{ledgerData.beginning.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                  </tr>

                  {/* Transactions list */}
                  {ledgerData.rows.map((row: any) => (
                    <tr key={row.id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-900/10 transition-colors">
                      <td className="px-3 py-2">{row.TANGGAL}</td>
                      <td className="px-3 py-2 font-bold truncate max-w-[120px]">{row.NO_BUKJUR}</td>
                      <td className="px-3 py-2 font-sans font-bold text-slate-700 dark:text-zinc-300">{row.URAIAN1}</td>
                      <td className="px-3 py-2 text-slate-400 font-bold">{row.REKLA || '-'}</td>
                      
                      <td className="px-3 py-2 text-right text-slate-700 dark:text-zinc-400">
                        {row.DEBET > 0 ? row.DEBET.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-700 dark:text-zinc-400">
                        {row.KREDIT > 0 ? row.KREDIT.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
                      </td>

                      <td className="px-3 py-2 text-right font-black text-slate-900 dark:text-zinc-100">
                        {row.SALDO.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Signature blocks for Printing (hidden in screen, shown in print) */}
          <div className="hidden print:grid print:grid-cols-3 gap-6 pt-12 text-center text-xs font-bold text-slate-800">
            <div>
              <div>Dibuat Oleh,</div>
              <div className="h-16"></div>
              <div className="border-t border-slate-400 pt-1">Staf Administrasi</div>
            </div>
            <div>
              <div>Diperiksa Oleh,</div>
              <div className="h-16"></div>
              <div className="border-t border-slate-400 pt-1">Kepala Tata Usaha</div>
            </div>
            <div>
              <div>Disetujui Oleh,</div>
              <div className="h-16"></div>
              <div className="border-t border-slate-400 pt-1">Manager Kebun</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
