'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  Upload, 
  Save, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  X,
  Search,
  Info,
  Edit,
  Plus,
  Loader2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { getMasterUnit } from '@/lib/actions/master-unit';
import { getMasterRekening } from '@/lib/actions/master-rekening';
import { addSaldoAwal, getSaldoAwal, clearSaldoAwal, updateSaldoAwal, deleteSaldoAwal } from '@/lib/actions/saldo-awal';
import { MasterUnit } from '@/lib/types/master-unit';
import { MasterRekening } from '@/lib/types/master-rekening';
import { SaldoAwal } from '@/lib/types/saldo-awal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
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

export default function InputSaldoAwalPage() {
  const [units, setUnits] = useState<MasterUnit[]>([]);
  const [rekening, setRekening] = useState<MasterRekening[]>([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedBulan, setSelectedBulan] = useState('01');
  const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear().toString());
  
  const columns: ColumnDef<SaldoAwal>[] = [
    {
      accessorKey: 'KOKE',
      header: 'Unit',
      cell: ({ row }) => (
        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase border border-slate-200">
          {row.original.KOKE}
        </span>
      )
    },
    {
      accessorKey: 'BULAN',
      header: 'Periode',
      cell: ({ row }) => <span className="text-xs font-bold text-slate-700">{row.original.BULAN}/{row.original.TAHUN}</span>
    },
    {
      accessorKey: 'REK',
      header: 'Kode Akun',
      cell: ({ row }) => <span className="font-mono text-xs font-bold text-slate-800">{row.original.REK}</span>
    },
    {
      accessorKey: 'NAMA_PERK',
      header: 'Nama Rekening',
      cell: ({ row }) => {
        const rekDetail = rekening.find(r => r.REKSUB === row.original.REK);
        return <span className="text-xs font-medium text-slate-800">{row.original.NAMA_PERK || rekDetail?.NAMA_PERK || 'Tidak dikenal'}</span>
      }
    },
    {
      accessorKey: 'DEBET',
      header: () => <div className="text-right">Debet</div>,
      cell: ({ row }) => <div className="text-right font-mono text-xs font-bold text-emerald-700">{formatRupiah(row.original.DEBET)}</div>
    },
    {
      accessorKey: 'KREDIT',
      header: () => <div className="text-right">Kredit</div>,
      cell: ({ row }) => <div className="text-right font-mono text-xs font-bold text-slate-700">{formatRupiah(row.original.KREDIT)}</div>
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleEdit(row.original)}
            className="h-7 w-7 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
          >
            <Edit className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleDeleteRow(row.original.id!)}
            className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];
  
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [existingData, setExistingData] = useState<SaldoAwal[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<Partial<SaldoAwal>>({
    KOKE: '',
    BULAN: '01',
    TAHUN: new Date().getFullYear().toString(),
    REK: '',
    DEBET: 0,
    KREDIT: 0
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const [u, r] = await Promise.all([
        getMasterUnit(),
        getMasterRekening()
      ]);
      setUnits(u);
      setRekening(r);
    };
    init();
  }, []);

  const fetchExistingData = async () => {
    setLoading(true);
    try {
      const data = await getSaldoAwal(
        selectedUnit || undefined, 
        selectedBulan === 'ALL' ? undefined : selectedBulan, 
        selectedTahun || undefined
      );
      setExistingData(data);
    } catch (err) {
      console.error("Failed to fetch existing data", err);
    } finally {
      setLoading(false);
    }
  };

  const showAllData = () => {
    setSelectedUnit('');
    setSelectedBulan('ALL');
    fetchExistingData();
  };

  useEffect(() => {
    fetchExistingData();
  }, [selectedUnit, selectedBulan, selectedTahun]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      const mapped = data.map((row: any) => ({
        KOKE: String(row.KOKE || selectedUnit).trim(),
        BULAN: String(row.BULAN || selectedBulan).trim(),
        TAHUN: selectedTahun,
        REK: String(row.REKSUB || row.REK || '').trim(),
        NAMA_PERK: row.NAMA_PERK || '',
        DEBET: parseFloat(row.SAWAL_DEB || row.DEBET || 0),
        KREDIT: parseFloat(row.SAWAL_KRE || row.KREDIT || 0)
      })).filter(r => r.REK !== '' && rekening.some(rek => rek.REKSUB === r.REK));

      setPreviewData(mapped);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const handleSave = async () => {
    if (previewData.length === 0) return;
    setLoading(true);
    setMessage(null);

    try {
      const rowsToSave: SaldoAwal[] = previewData.map(p => ({
        KOKE: p.KOKE,
        BULAN: p.BULAN,
        TAHUN: p.TAHUN,
        REK: p.REK,
        DEBET: p.DEBET,
        KREDIT: p.KREDIT
      }));

      await clearSaldoAwal(selectedUnit, selectedBulan, selectedTahun);
      await addSaldoAwal(rowsToSave);

      setMessage({ type: 'success', text: `Berhasil menyimpan ${rowsToSave.length} data saldo awal.` });
      setPreviewData([]);
      fetchExistingData();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Gagal menyimpan: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("Hapus semua saldo awal untuk unit dan periode ini?")) return;
    setLoading(true);
    try {
      await clearSaldoAwal(selectedUnit, selectedBulan, selectedTahun);
      setMessage({ type: 'success', text: 'Data saldo awal telah dikosongkan.' });
      fetchExistingData();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Gagal menghapus: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setDialogMode('add');
    setFormData({
      KOKE: selectedUnit,
      BULAN: selectedBulan === 'ALL' ? '01' : selectedBulan,
      TAHUN: selectedTahun,
      REK: '',
      DEBET: 0,
      KREDIT: 0
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (record: SaldoAwal) => {
    setDialogMode('edit');
    setFormData(record);
    setIsDialogOpen(true);
  };

  const handleDeleteRow = async (id: number) => {
    if (!confirm("Hapus baris saldo awal ini?")) return;
    setLoading(true);
    try {
      await deleteSaldoAwal(id);
      setMessage({ type: 'success', text: 'Baris saldo awal berhasil dihapus.' });
      fetchExistingData();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Gagal menghapus: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogSave = async () => {
    if (!formData.KOKE || !formData.REK) {
      alert("Unit dan Rekening wajib diisi!");
      return;
    }
    
    setLoading(true);
    try {
      if (dialogMode === 'add') {
        await addSaldoAwal([formData as SaldoAwal]);
        setMessage({ type: 'success', text: 'Berhasil menambahkan saldo awal manual.' });
      } else {
        await updateSaldoAwal(formData.id!, formData);
        setMessage({ type: 'success', text: 'Berhasil memperbarui saldo awal.' });
      }
      setIsDialogOpen(false);
      fetchExistingData();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Gagal menyimpan: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 p-6 lg:p-8 space-y-6 flex flex-col">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Input Saldo Awal
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-1">
            Pengaturan saldo awal akun untuk memulai periode pembukuan baru secara manual atau Excel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".xlsx, .xls" 
            className="hidden" 
          />
          <Button 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 h-9 px-3 text-xs rounded-md shadow-sm transition-all flex items-center gap-1.5 font-bold"
          >
            <Upload className="w-3.5 h-3.5" /> Import Excel
          </Button>
          <Button 
            onClick={handleOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-3 text-xs rounded-md shadow-sm transition-all flex items-center gap-1.5 font-bold animate-in fade-in"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Manual
          </Button>
          {previewData.length > 0 && (
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-3 text-xs rounded-md shadow-sm transition-all flex items-center gap-1.5 font-bold"
            >
              <Save className="w-3.5 h-3.5" /> {loading ? 'Menyimpan...' : 'Simpan Saldo Awal'}
            </Button>
          )}
        </div>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Unit & Period Card */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2.5">
             <Building2 className="w-3.5 h-3.5 text-slate-400" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter Unit & Periode</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <select 
              className="w-full border border-slate-200 bg-white rounded-md px-2 py-1.5 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
            >
              <option value="">Semua Unit</option>
              {units.map(u => <option key={u.KOKE} value={u.KOKE}>{u.KOKE}</option>)}
            </select>
            <select 
              className="w-full border border-slate-200 bg-white rounded-md px-2 py-1.5 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(e.target.value)}
            >
              <option value="ALL">Semua Bulan</option>
              {BULAN_OPTIONS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
            <input 
              type="number"
              className="w-full border border-slate-200 bg-white rounded-md px-2 py-1.5 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
            />
          </div>
        </div>

        {/* Total stats metric card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Baris Saldo</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{existingData.length}</span>
            <span className="text-[10px] font-semibold text-slate-400">Akun</span>
          </div>
          <div className="text-[9px] text-slate-400 font-bold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Data tersinkron
          </div>
        </div>

        {/* Operations Shortcut Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={showAllData}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex flex-col items-center justify-center gap-1 h-auto py-2.5 rounded-md flex-1 text-[10px] uppercase tracking-wider transition-all"
          >
            <Search className="w-4 h-4 text-slate-400" />
            Semua Data
          </Button>
          <Button 
            variant="ghost"
            onClick={handleClear}
            disabled={loading || existingData.length === 0}
            className="text-rose-600 hover:bg-rose-50/50 hover:text-rose-700 font-bold flex flex-col items-center justify-center gap-1 h-auto py-2.5 rounded-md flex-1 text-[10px] uppercase tracking-wider transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Kosongkan
          </Button>
        </div>
      </div>

      {message && (
        <div className={cn(
          "p-3 rounded-lg text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200",
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-850 border border-rose-100'
        )}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          {message.text}
          <button className="ml-auto hover:opacity-60" onClick={() => setMessage(null)}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Content Area */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
             <div className="bg-emerald-600 h-1.5 w-4 rounded-full"></div>
             <h2 className="font-bold text-xs text-slate-800 tracking-tight uppercase">
               {previewData.length > 0 ? 'Preview Data Excel' : 'Daftar Saldo Awal Terdaftar'}
             </h2>
          </div>
          {previewData.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setPreviewData([])} className="text-xs text-slate-400 hover:text-rose-600 h-8 px-2">
               Batalkan Preview
            </Button>
          )}
        </div>

        <div className="p-5 flex-1 overflow-auto">
          <DataTable 
            columns={columns} 
            data={previewData.length > 0 ? previewData : existingData}
            searchKey="REK"
            searchPlaceholder="Cari berdasarkan kode akun atau unit..."
            filename={`Saldo_Awal_${selectedUnit}_${selectedBulan}_${selectedTahun}`}
          />
        </div>
      </div>
      
      {/* Summary Bar */}
      {(previewData.length > 0 || existingData.length > 0) && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Debet</p>
              <p className="text-lg font-black text-slate-800 font-mono">
                {formatRupiah((previewData.length > 0 ? previewData : existingData).reduce((a, b) => a + b.DEBET, 0))}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Kredit</p>
              <p className="text-lg font-black text-slate-800 font-mono">
                {formatRupiah((previewData.length > 0 ? previewData : existingData).reduce((a, b) => a + b.KREDIT, 0))}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border",
              Math.abs((previewData.length > 0 ? previewData : existingData).reduce((a, b) => a + (b.DEBET - b.KREDIT), 0)) < 0.01 
               ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
               : "bg-rose-50 text-rose-800 border-rose-200"
            )}>
              {Math.abs((previewData.length > 0 ? previewData : existingData).reduce((a, b) => a + (b.DEBET - b.KREDIT), 0)) < 0.01 
               ? "Balance / Seimbang" : "Selisih / Tidak Seimbang"}
            </span>
          </div>
        </div>
      )}

      {/* Instruction alert */}
      <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/40 flex items-start gap-3">
         <Info className="w-4 h-4 text-amber-600 mt-0.5" />
         <div className="space-y-1">
            <h4 className="font-bold text-amber-900 text-xs">Petunjuk Penggunaan</h4>
            <p className="text-amber-800/80 text-[10px] font-medium leading-relaxed">
              Saldo awal biasanya dimasukkan sekali pada awal tahun buku. Pastikan total Debet dan Kredit Anda seimbang sebelum menyimpan. 
              Jika mengimpor dari Excel, pastikan kolom <span className="font-bold">REKSUB</span> (kode akun) sesuai dengan yang ada di Master Rekening.
            </p>
         </div>
      </div>

      {/* Manual Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl border border-slate-200 shadow-lg p-0 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-5">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold tracking-tight text-slate-800 flex items-center gap-2">
                {dialogMode === 'add' ? <Plus className="w-4 h-4 text-emerald-600" /> : <Edit className="w-4 h-4 text-emerald-600" />}
                {dialogMode === 'add' ? 'Tambah Saldo Awal' : 'Edit Saldo Awal'}
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-semibold text-xs mt-1">
                {dialogMode === 'add' 
                  ? 'Masukkan data saldo awal untuk akun tertentu secara manual.' 
                  : 'Perbarui nilai debet atau kredit untuk baris saldo awal ini.'}
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-5 space-y-4 bg-white">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unit</Label>
                <select 
                  className="w-full border border-slate-200 bg-white rounded-md px-2 py-1.5 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                  value={formData.KOKE}
                  onChange={(e) => setFormData({...formData, KOKE: e.target.value})}
                  disabled={dialogMode === 'edit'}
                >
                  <option value="">Pilih Unit</option>
                  {units.map(u => <option key={u.KOKE} value={u.KOKE}>{u.KOKE}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rekening</Label>
                <select 
                  className="w-full border border-slate-200 bg-white rounded-md px-2 py-1.5 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                  value={formData.REK}
                  onChange={(e) => setFormData({...formData, REK: e.target.value})}
                  disabled={dialogMode === 'edit'}
                >
                  <option value="">Pilih Akun</option>
                  {rekening.map(r => <option key={r.REKSUB} value={r.REKSUB}>{r.REKSUB} - {r.NAMA_PERK}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bulan</Label>
                <select 
                  className="w-full border border-slate-200 bg-white rounded-md px-2 py-1.5 text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                  value={formData.BULAN}
                  onChange={(e) => setFormData({...formData, BULAN: e.target.value})}
                  disabled={dialogMode === 'edit'}
                >
                  {BULAN_OPTIONS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tahun</Label>
                <Input 
                  type="number"
                  value={formData.TAHUN}
                  onChange={(e) => setFormData({...formData, TAHUN: e.target.value})}
                  disabled={dialogMode === 'edit'}
                  className="bg-white border border-slate-200 rounded-md font-bold text-xs h-8.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Debet</Label>
                <Input 
                  type="number"
                  value={formData.DEBET}
                  onChange={(e) => setFormData({...formData, DEBET: parseFloat(e.target.value) || 0})}
                  className="bg-white border border-slate-200 text-slate-800 font-mono font-bold text-sm h-9 rounded-md"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kredit</Label>
                <Input 
                  type="number"
                  value={formData.KREDIT}
                  onChange={(e) => setFormData({...formData, KREDIT: parseFloat(e.target.value) || 0})}
                  className="bg-white border border-slate-200 text-slate-800 font-mono font-bold text-sm h-9 rounded-md"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-5 border-t border-slate-100 bg-white">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="rounded-md font-bold text-slate-500 h-9 px-3 text-xs"
            >
              Batal
            </Button>
            <Button 
              onClick={handleDialogSave}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-4 rounded-md font-bold text-xs shadow-sm transition-all"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
              ) : null}
              {dialogMode === 'add' ? 'Tambah Data' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
