'use client';

import { useState, useEffect, useRef } from 'react';
import { getJurnal, deleteJurnal, updateJurnal } from '@/lib/actions/jurnal';
import { getMasterUnit } from '@/lib/actions/master-unit';
import { getMasterRekening } from '@/lib/actions/master-rekening';
import { MasterUnit } from '@/lib/types/master-unit';
import { MasterRekening } from '@/lib/types/master-rekening';
import { useAccounting } from '@/hooks/use-accounting-context';
import * as XLSX from 'xlsx';
import { 
  Search,
  Check,
  X,
  Save,
  FileSpreadsheet, 
  Download, 
  Trash2, 
  Edit, 
  Filter, 
  RefreshCcw,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BULAN_OPTIONS = [
  { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' }, { value: '04', label: 'April' },
  { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' }, { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
];

function CustomCombobox({ 
  items, 
  value, 
  onChange, 
  placeholder,
  valueKey,
  labelKey
}: { 
  items: any[]; 
  value: string; 
  onChange: (val: string) => void; 
  placeholder: string;
  valueKey: string;
  labelKey: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filtered = items.filter(i => 
    i[valueKey]?.toLowerCase().includes(search.toLowerCase()) || 
    i[labelKey]?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedItem = items.find(i => i[valueKey] === value);

  return (
    <div ref={wrapperRef} className="relative">
      <div 
        className={cn(
          "flex items-center justify-between border rounded-md px-3 py-2 bg-white dark:bg-zinc-900 cursor-pointer transition-all text-xs h-9",
          open ? "border-orange-500 ring-1 ring-orange-500 shadow-sm" : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
        )}
        onClick={() => setOpen(!open)}
      >
        <span className={selectedItem ? "text-slate-900 dark:text-zinc-100 font-medium" : "text-slate-400 dark:text-zinc-500"}>
          {selectedItem ? `${selectedItem[valueKey]} - ${selectedItem[labelKey]}` : placeholder}
        </span>
        <Search className="w-3.5 h-3.5 text-slate-400" />
      </div>
 
      {open && (
        <div className="absolute z-[60] top-full mt-1 w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1.5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/40">
            <input 
              autoFocus
              type="text"
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-2.5 py-1.5 text-xs outline-none placeholder:text-slate-400 focus:border-orange-500 transition-colors shadow-sm font-medium text-slate-700 dark:text-zinc-200"
              placeholder="Cari kode atau nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-52 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="p-3 text-[11px] text-slate-400 text-center italic">Tidak ditemukan...</div>
            ) : (
              filtered.map((item) => (
                <div 
                  key={item[valueKey]}
                  className={cn(
                    "px-2.5 py-2 text-xs cursor-pointer rounded flex items-center justify-between transition-colors",
                    value === item[valueKey] 
                      ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 font-bold' 
                      : 'text-slate-655 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100'
                  )}
                  onClick={() => {
                    onChange(item[valueKey]);
                    setOpen(false);
                    setSearch('');
                  }}
                >
                  <span className="truncate">{item[valueKey]} - {item[labelKey]}</span>
                  {value === item[valueKey] && <Check className="w-3.5 h-3.5 shrink-0 text-orange-600" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LaporanJurnalPage() {
  const { tahun } = useAccounting();
  const [data, setData] = useState<any[]>([]);
  const [units, setUnits] = useState<MasterUnit[]>([]);
  const [rekening, setRekening] = useState<MasterRekening[]>([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  
  const [filterUnit, setFilterUnit] = useState('00');
  const [filterBulan, setFilterBulan] = useState('01');
  const [filterTahun, setFilterTahun] = useState('2026');

  useEffect(() => {
    if (tahun) {
      setFilterTahun(tahun);
    }
  }, [tahun]);
  
  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    id: 0,
    TANGGAL: '',
    NO_BUKJUR: '',
    REK: '',
    REKLA: '',
    URAIAN1: '',
    DEBET: 0,
    KREDIT: 0
  });

  useEffect(() => {
    const initPage = async () => {
      const [u, r] = await Promise.all([
        getMasterUnit(),
        getMasterRekening()
      ]);
      setUnits(u);
      setRekening(r);
      if (u.length > 0 && !filterUnit) {
        setFilterUnit(u[0].KOKE);
      }
    };
    initPage();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getJurnal(filterUnit, filterBulan, filterTahun);
      
      let currentNoBukti = '';
      let recordCounter = 0;
      const dataWithRecords = (result || []).map((row: any) => {
        if (row.NO_BUKJUR !== currentNoBukti) {
          currentNoBukti = row.NO_BUKJUR;
          recordCounter = 1;
        } else {
          recordCounter++;
        }
        return { ...row, record_seq: recordCounter };
      });

      setData(dataWithRecords);
    } catch (e) {
      console.error("Error fetching data:", e);
      setData([]);
    } finally {
      setTimeout(() => setLoading(false), 500); 
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterUnit, filterBulan, filterTahun]);

  const handleDelete = async (id: string) => {
    if(!confirm("Yakin ingin menghapus record ini?")) return;
    try {
      await deleteJurnal(id);
      setData(data.filter(d => d.id !== id));
    } catch(e) {
      setData(data.filter(d => d.id !== id));
    }
  };

  const handleExport = () => {
    if (data.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    const TAHUN_TANAM_TO_KODE: Record<string, string> = {
      '1991': '01',
      '1994': '03',
      '1995': '04',
      '2003': '05',
      '2003A': '05',
      '2007': '06',
      '2010': '08',
      '2011': '09',
      '2013': '11',
      '2014': '12',
      '1990': '13',
      '2003B': '14',
      '2015': '16',
      '2016': '17',
      '2017': '18',
      '2018': '19',
      '2019': '20',
    };

    const exportData = data.map((row) => {
      let tanggalStr = '';
      try {
        const d = new Date(row.TANGGAL);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        tanggalStr = `${day}-${month}-${year}`;
      } catch (e) {
        tanggalStr = String(row.TANGGAL || '');
      }

      const kokePart = String(row.KOKE || filterUnit || '00').trim().padStart(2, '0');
      const kobuPart = String(row.KOBU || filterBulan || '01').trim().padStart(2, '0');
      
      const noMemori = (row.NO_BUKJUR || '').replaceAll('.', '');
      const noRecord = String(row.record_seq || 1).padStart(4, '0');

      const rekDetail = rekening.find(r => r.REKSUB === row.REK);
      const namaPerk = row.NAREK || rekDetail?.NAMA_PERK || '';

      const thnTanam = row.THN_TANAM || 'Lain2';
      const koTahun = TAHUN_TANAM_TO_KODE[thnTanam] || '99';

      return {
        KOKE: kokePart,
        BULAN: kobuPart,
        TANGGAL: tanggalStr,
        NO_MEMORI: noMemori,
        NO_RECORD: noRecord,
        REKSUB: row.REK || '',
        REKSUB_WN: row.REKLA || '',
        NAMA_PERK: namaPerk,
        BUDIDAYA: row.KODA || '99',
        NAMABUDIDA: row.NAMA_AREAL || 'Lain-lain',
        AFDEL: row.KODAF || '99',
        NAMAFDEL: row.NAMA_AFDELING || 'Lain-lain',
        KOTAHUN: koTahun,
        TAHUNTANAM: thnTanam,
        FISK_KEGIA: '',
        INDIC: 0,
        JEN_NOTA: row.JENIS_NOTA || '',
        NO_NOTA: row.NO_NOTA || '',
        URAIAN: '',
        URAIAN1: row.URAIAN1 || '',
        DEBET: Number(row.DEBET || 0),
        KREDIT: Number(row.KREDIT || 0),
        KETERANGAN: ''
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData, {
      header: [
        'KOKE', 'BULAN', 'TANGGAL', 'NO_MEMORI', 'NO_RECORD', 'REKSUB', 'REKSUB_WN', 
        'NAMA_PERK', 'BUDIDAYA', 'NAMABUDIDA', 'AFDEL', 'NAMAFDEL', 'KOTAHUN', 
        'TAHUNTANAM', 'FISK_KEGIA', 'INDIC', 'JEN_NOTA', 'NO_NOTA', 'URAIAN', 
        'URAIAN1', 'DEBET', 'KREDIT', 'KETERANGAN'
      ]
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Jurnal_Transaksi");
    
    XLSX.writeFile(wb, `Jurnal_Unit_${filterUnit}_Bulan_${filterBulan}_Tahun_${filterTahun}.xlsx`);
  };

  const formatRupiah = (angka: any) => {
    const num = typeof angka === 'number' ? angka : parseFloat(angka || 0);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const totalDebet = data.reduce((acc, curr) => acc + Number(curr.DEBET || 0), 0);
  const totalKredit = data.reduce((acc, curr) => acc + Number(curr.KREDIT || 0), 0);
  const isBalanced = Math.abs(totalDebet - totalKredit) < 0.01;

  const handleOpenEdit = (row: any) => {
    setEditingRow(row);
    setEditFormData({
      id: row.id,
      TANGGAL: row.TANGGAL instanceof Date ? row.TANGGAL.toISOString().split('T')[0] : String(row.TANGGAL).split('T')[0],
      NO_BUKJUR: row.NO_BUKJUR,
      REK: row.REK,
      REKLA: row.REKLA,
      URAIAN1: row.URAIAN1,
      DEBET: parseFloat(row.DEBET || 0),
      KREDIT: parseFloat(row.KREDIT || 0)
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { id, ...input } = editFormData;
      
      const debetAccount = rekening.find(r => r.REKSUB === input.REK);
      const updatedInput = {
        ...input,
        NAREK: debetAccount?.NAMA_PERK || editingRow.NAREK
      };

      await updateJurnal(id, updatedInput);
      setIsEditOpen(false);
      fetchData();
    } catch (err: any) {
      alert("Gagal mengupdate jurnal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Tanggal',
      accessorKey: 'TANGGAL',
      cell: (info: any) => {
        const val = info.getValue();
        const dateStr = val instanceof Date ? val.toISOString().split('T')[0] : String(val || '');
        return <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 whitespace-nowrap">{dateStr}</span>
      }
    },
    {
      header: 'No Bukti',
      accessorKey: 'NO_BUKJUR',
      cell: (info: any) => <span className="font-bold text-xs text-slate-800 dark:text-zinc-200 whitespace-nowrap tracking-tight">{info.getValue()}</span>
    },
    {
      header: 'Rec',
      accessorKey: 'record_seq',
      cell: (info: any) => <span className="text-slate-400 dark:text-zinc-500 font-mono text-[9px] bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 px-1.5 py-0.5 rounded">{info.getValue()}</span>
    },
    {
      header: 'Rek',
      accessorKey: 'REK',
      cell: (info: any) => <span className="text-slate-900 dark:text-zinc-200 font-mono text-xs font-bold">{info.getValue()}</span>
    },
    {
      header: 'Rek Lawan',
      accessorKey: 'REKLA',
      cell: (info: any) => <span className="text-slate-500 dark:text-zinc-400 font-mono text-xs">{info.getValue()}</span>
    },
    {
      header: 'Uraian',
      accessorKey: 'URAIAN1',
      cell: (info: any) => <span className="text-xs leading-relaxed line-clamp-2 max-w-[250px] text-slate-650 dark:text-zinc-350" title={info.getValue()}>{info.getValue()}</span>
    },
    {
      header: 'Debet',
      accessorKey: 'DEBET',
      cell: (info: any) => <span className="font-mono text-xs text-right font-bold text-orange-700 dark:text-orange-400">{formatRupiah(info.getValue())}</span>
    },
    {
      header: 'Kredit',
      accessorKey: 'KREDIT',
      cell: (info: any) => <span className="font-mono text-xs text-right font-bold text-slate-700 dark:text-zinc-300">{formatRupiah(info.getValue())}</span>
    },
    {
      header: 'Aksi',
      id: 'actions',
      cell: (info: any) => (
        <div className="flex items-center justify-end gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md"
            onClick={() => handleOpenEdit(info.row.original)}
            title="Koreksi"
          >
            <Edit className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md"
            onClick={() => handleDelete(info.row.original.id)}
            title="Hapus"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 space-y-6 flex flex-col">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-orange-600" />
            Tinjauan Data Jurnal
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">
            Lihat, koreksi, dan ekspor data buku jurnal (cut-off). Pastikan total pada Debet dan Kredit seimbang.
          </p>
        </div>
 
        <div className="flex items-center gap-2">
          <Button 
            onClick={fetchData}
            variant="outline"
            className="h-9 px-3 rounded-md border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-bold transition-all"
            title="Refresh Data"
          >
            <RefreshCcw className={cn("w-3.5 h-3.5 mr-1.5", loading && "animate-spin")} />
            Refresh
          </Button>

          <Button 
            onClick={handleExport}
            className="h-9 px-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-md shadow-sm transition-all flex items-center gap-1.5 text-xs animate-in fade-in"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel
          </Button>
        </div>
      </div>

      {/* Control Panel Filter bar */}
      <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 pl-1 mr-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
          <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Filter Data Jurnal</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={filterUnit} 
            onChange={e => setFilterUnit(e.target.value)}
            className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 outline-none transition-all cursor-pointer h-8.5"
          >
            {units.map(u => <option key={u.KOKE} value={u.KOKE}>{u.NAKE}</option>)}
          </select>

          <select 
            value={filterBulan} 
            onChange={e => setFilterBulan(e.target.value)}
            className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 outline-none transition-all cursor-pointer h-8.5"
          >
            {BULAN_OPTIONS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>

          <select 
            value={filterTahun} 
            onChange={e => setFilterTahun(e.target.value)}
            className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 outline-none transition-all cursor-pointer h-8.5"
          >
            {['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-950/40 sticky top-0 border-b border-slate-200 dark:border-zinc-800 z-10">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id} 
                      className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors" 
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1.5">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      <Loader2 className="w-6 h-6 text-orange-600 animate-spin" />
                      <p className="text-slate-400 text-xs font-semibold">Menyiapkan data jurnal...</p>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-zinc-700">
                        <FileSpreadsheet className="w-6 h-6 opacity-30 text-slate-400" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-350">Data Tidak Ditemukan</h3>
                      <p className="text-[10px] max-w-xs mx-auto mt-1.5 text-slate-400 dark:text-zinc-500 font-semibold leading-relaxed">Tidak ada transaksi yang tercatat untuk unit ini pada bulan {BULAN_OPTIONS.find(b => b.value === filterBulan)?.label}.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, idx) => (
                  <tr key={row.id} className={cn(
                     "border-b border-slate-100 dark:border-zinc-800/40 transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-800/30",
                     idx % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-slate-50/20 dark:bg-zinc-950/10'
                  )}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="py-2.5 px-5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer balance details bar */}
        <div className="border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/30 p-4 shrink-0 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1 block">Total Debet</span>
              <span className="text-sm font-mono font-black text-orange-850 dark:text-orange-400 tracking-tight">{formatRupiah(totalDebet)}</span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800"></div>
            <div>
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1 block">Total Kredit</span>
              <span className="text-sm font-mono font-black text-slate-800 dark:text-zinc-200 tracking-tight">{formatRupiah(totalKredit)}</span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800"></div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
              isBalanced ? "bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30" : "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30"
            )}>
              {isBalanced ? "Balanced" : "Not Balanced"}
            </span>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm disabled:opacity-30 text-slate-700 dark:text-zinc-300"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-3 py-1 shadow-sm font-bold text-xs text-slate-700 dark:text-zinc-300">
              {table.getState().pagination.pageIndex + 1} <span className="text-slate-300 mx-1 font-medium">/</span> {table.getPageCount()}
            </div>
 
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm disabled:opacity-30 text-slate-700 dark:text-zinc-300"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal using Shadcn Dialog Component */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-xl border border-slate-200 dark:border-zinc-800 shadow-lg p-0 overflow-hidden bg-white dark:bg-zinc-900">
          <div className="bg-slate-50 dark:bg-zinc-950/40 border-b border-slate-200 dark:border-zinc-800 p-5">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold tracking-tight text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                <Edit className="w-4 h-4 text-orange-600" />
                Koreksi Jurnal Transaksi
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-zinc-400 font-semibold text-xs mt-1">
                Koreksi data tanggal, nomor bukti, COA rekening, dan jumlah nominal jurnal terpilih.
              </DialogDescription>
            </DialogHeader>
          </div>
 
          <form onSubmit={handleSaveEdit}>
            <div className="p-5 space-y-4 bg-white dark:bg-zinc-900">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Tanggal</Label>
                  <input 
                    type="date" 
                    required
                    className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 outline-none transition-all h-8.5"
                    value={editFormData.TANGGAL}
                    onChange={e => setEditFormData({...editFormData, TANGGAL: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">No Bukti</Label>
                  <Input 
                    type="text" 
                    required
                    className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 rounded-md font-bold text-xs h-8.5"
                    value={editFormData.NO_BUKJUR}
                    onChange={e => setEditFormData({...editFormData, NO_BUKJUR: e.target.value})}
                  />
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Rekening Utama</Label>
                  <CustomCombobox 
                    items={rekening} 
                    value={editFormData.REK} 
                    onChange={(v) => setEditFormData({...editFormData, REK: v})} 
                    placeholder="Pilih rekening..."
                    valueKey="REKSUB"
                    labelKey="NAMA_PERK"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Rekening Lawan</Label>
                  <CustomCombobox 
                    items={rekening} 
                    value={editFormData.REKLA} 
                    onChange={(v) => setEditFormData({...editFormData, REKLA: v})} 
                    placeholder="Pilih rekening lawan..."
                    valueKey="REKSUB"
                    labelKey="NAMA_PERK"
                  />
                </div>
              </div>
 
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Uraian / Keterangan</Label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 outline-none transition-all h-8.5"
                  value={editFormData.URAIAN1}
                  onChange={e => setEditFormData({...editFormData, URAIAN1: e.target.value})}
                />
              </div>
 
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800 rounded-lg">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-orange-700 dark:text-orange-450 uppercase tracking-wider">Debet</Label>
                  <input 
                    type="number" 
                    className="w-full border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-mono font-bold text-orange-850 dark:text-orange-400 bg-white dark:bg-zinc-900 focus:ring-1 focus:ring-orange-500 outline-none transition-all h-8.5"
                    value={editFormData.DEBET}
                    onChange={e => setEditFormData({...editFormData, DEBET: parseFloat(e.target.value || '0')})}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Kredit</Label>
                  <input 
                    type="number" 
                    className="w-full border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-mono font-bold text-slate-800 dark:text-zinc-300 bg-white dark:bg-zinc-900 focus:ring-1 focus:ring-orange-500 outline-none transition-all h-8.5"
                    value={editFormData.KREDIT}
                    onChange={e => setEditFormData({...editFormData, KREDIT: parseFloat(e.target.value || '0')})}
                  />
                </div>
              </div>
            </div>
 
            <DialogFooter className="p-5 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="rounded-md font-bold text-slate-500 h-9 px-3 text-xs"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white h-9 px-4 rounded-md font-bold text-xs shadow-sm transition-all"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : null}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
