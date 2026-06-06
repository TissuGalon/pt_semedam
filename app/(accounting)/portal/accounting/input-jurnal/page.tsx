'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  FileCheck, 
  Search, 
  Plus, 
  Save, 
  Clock, 
  HelpCircle, 
  Check, 
  X,
  Building2,
  Calendar,
  AlertCircle,
  Hash,
  CheckCircle2,
  RefreshCcw,
  Loader2,
  FileText
} from 'lucide-react';
import { addJurnalTransaksi, getNextNoBukti } from '@/lib/actions/jurnal';
import { getMasterUnit } from '@/lib/actions/master-unit';
import { getMasterRekening } from '@/lib/actions/master-rekening';
import { getMasterAreal } from '@/lib/actions/master-areal';
import { getMasterAfdeling } from '@/lib/actions/master-afdeling';
import { MasterUnit } from '@/lib/types/master-unit';
import { MasterRekening } from '@/lib/types/master-rekening';
import { MasterAreal } from '@/lib/types/master-areal';
import { MasterAfdeling } from '@/lib/types/master-afdeling';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAccounting } from '@/hooks/use-accounting-context';

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
    (i[valueKey] || '').toLowerCase().includes(search.toLowerCase()) || 
    (i[labelKey] || '').toLowerCase().includes(search.toLowerCase())
  );

  const selectedItem = items.find(i => i[valueKey] === value);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div 
        className={cn(
          "flex items-center justify-between border rounded-md px-3 py-2 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 cursor-pointer transition-all text-xs h-9 text-slate-900 dark:text-zinc-100",
          open ? "border-orange-500 ring-1 ring-orange-500 shadow-sm" : "hover:border-slate-300 dark:hover:border-zinc-700"
        )}
        onClick={() => setOpen(!open)}
      >
        <span className={selectedItem ? "text-slate-900 dark:text-zinc-100 font-medium truncate" : "text-slate-400 dark:text-zinc-500"}>
          {selectedItem ? `${selectedItem[valueKey]} - ${selectedItem[labelKey]}` : placeholder}
        </span>
        <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0 ml-1" />
      </div>

      {open && (
        <div className="absolute z-[60] top-full mt-1 w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1.5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60">
            <input 
              autoFocus
              type="text"
              className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded px-2.5 py-1.5 text-xs outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-orange-500 transition-colors shadow-sm font-medium text-slate-700 dark:text-zinc-200"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="p-3 text-[11px] text-slate-400 dark:text-zinc-500 text-center italic">Tidak ditemukan...</div>
            ) : (
              filtered.map((item) => (
                <div 
                  key={item[valueKey]}
                  className={cn(
                    "px-2.5 py-2 text-xs cursor-pointer rounded flex items-center justify-between transition-colors",
                    value === item[valueKey] 
                      ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 font-bold' 
                      : 'text-slate-650 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100'
                  )}
                  onClick={() => {
                    onChange(item[valueKey]);
                    setOpen(false);
                    setSearch('');
                  }}
                >
                  <span className="truncate">{item[valueKey]} - {item[labelKey]}</span>
                  {value === item[valueKey] && <Check className="w-3.5 h-3.5 shrink-0 text-orange-650" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function InputJurnalPage() {
  const { koke, bulan, tahun, setKoke, setBulan, setTahun, isSessionActive, clearSession } = useAccounting();
  const [units, setUnits] = useState<MasterUnit[]>([]);
  const [rekening, setRekening] = useState<MasterRekening[]>([]);
  const [areal, setAreal] = useState<MasterAreal[]>([]);
  const [afdeling, setAfdeling] = useState<MasterAfdeling[]>([]);
  const [tempUnit, setTempUnit] = useState('');
  const [tempBulan, setTempBulan] = useState('');
  const [tempTahun, setTempTahun] = useState(new Date().getFullYear().toString());

  // Form State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    noBukti: '',
    noRecord: '',
    rek: '',
    rekla: '',
    kodeBudiDaya: '',
    kodeAfdeling: '',
    tahunTanam: '',
    noNota: '',
    jenisNota: '',
    uraian: '',
    debet: '',
    kredit: ''
  });

  const refreshNoBukti = async () => {
    if (!isSessionActive) return;
    try {
      const nextNo = await getNextNoBukti(koke, tahun, bulan);
      setFormData(prev => ({ ...prev, noBukti: nextNo }));
    } catch (err) {
      console.error("Failed to fetch next no bukti:", err);
    }
  };

  useEffect(() => {
    if (isSessionActive) {
      refreshNoBukti();
    }
  }, [isSessionActive, koke, bulan, tahun]);

  useEffect(() => {
    const initData = async () => {
      const [u, r, a, af] = await Promise.all([
        getMasterUnit(),
        getMasterRekening(),
        getMasterAreal(),
        getMasterAfdeling()
      ]);
      setUnits(u);
      setRekening(r);
      setAreal(a);
      setAfdeling(af);
    };
    initData();
  }, []);

  const handleCutoffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUnit && tempBulan && tempTahun) {
      setKoke(tempUnit);
      setBulan(tempBulan);
      setTahun(tempTahun);
    }
  };

  const handleSaveJurnal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const debetVal = parseFloat(formData.debet || '0');
    const kreditVal = parseFloat(formData.kredit || '0');

    if (!formData.rek || !formData.rekla || !formData.noBukti) {
      setMessage({ type: 'error', text: 'Nomor Bukti, Rekening Utama, dan Rekening Lawan wajib terisi.' });
      setLoading(false);
      return;
    }

    if (debetVal <= 0 && kreditVal <= 0) {
      setMessage({ type: 'error', text: 'Salah satu nilai Debet atau Kredit harus diisi lebih besar dari 0.' });
      setLoading(false);
      return;
    }

    if (debetVal > 0 && kreditVal > 0) {
      setMessage({ type: 'error', text: 'Transaksi jurnal hanya boleh memiliki nominal di salah satu kolom Debet atau Kredit.' });
      setLoading(false);
      return;
    }

    try {
      const selectedRek = rekening.find(r => r.REKSUB === formData.rek);
      const selectedRekla = rekening.find(r => r.REKSUB === formData.rekla);
      const selectedAreal = areal.find(a => a.KODA === formData.kodeBudiDaya);
      const selectedAfdeling = afdeling.find(af => af.KODAF === formData.kodeAfdeling);

      // Row 1: Main journal row
      const row1 = {
        KOKE: koke,
        KOBU: bulan,
        NO_BUKJUR: formData.noBukti,
        TANGGAL: formData.tanggal,
        NOREC: formData.noRecord || null,
        REK: formData.rek,
        REKLA: formData.rekla,
        NAREK: selectedRek?.NAMA_PERK || '',
        URAIAN1: formData.uraian,
        DEBET: debetVal,
        KREDIT: kreditVal,
        KODA: formData.kodeBudiDaya || null,
        NAMA_AREAL: selectedAreal?.NAMA_AREAL || null,
        KODAF: formData.kodeAfdeling || null,
        NAMA_AFDELING: selectedAfdeling?.NAMA_AFDELING || null,
        THN_TANAM: formData.tahunTanam || null,
        NO_NOTA: formData.noNota || null,
        JENIS_NOTA: formData.jenisNota || null
      };

      // Row 2: Opposing contra journal row
      const row2 = {
        KOKE: koke,
        KOBU: bulan,
        NO_BUKJUR: formData.noBukti,
        TANGGAL: formData.tanggal,
        NOREC: formData.noRecord ? `${formData.noRecord}-C` : null,
        REK: formData.rekla,
        REKLA: formData.rek,
        NAREK: selectedRekla?.NAMA_PERK || '',
        URAIAN1: formData.uraian,
        DEBET: kreditVal, // Debit for contra is Credit of main
        KREDIT: debetVal, // Credit for contra is Debit of main
        KODA: formData.kodeBudiDaya || null,
        NAMA_AREAL: selectedAreal?.NAMA_AREAL || null,
        KODAF: formData.kodeAfdeling || null,
        NAMA_AFDELING: selectedAfdeling?.NAMA_AFDELING || null,
        THN_TANAM: formData.tahunTanam || null,
        NO_NOTA: formData.noNota || null,
        JENIS_NOTA: formData.jenisNota || null
      };

      await addJurnalTransaksi([row1, row2]);

      setMessage({ type: 'success', text: 'Data voucher transaksi berhasil disimpan (Double Entry Balanced).' });
      setFormData(prev => ({
        ...prev,
        noRecord: '',
        rek: '',
        rekla: '',
        kodeBudiDaya: '',
        kodeAfdeling: '',
        tahunTanam: '',
        noNota: '',
        jenisNota: '',
        uraian: '',
        debet: '',
        kredit: ''
      }));
      
      refreshNoBukti();

    } catch (err: any) {
      setMessage({ type: 'error', text: 'Gagal menyimpan transaksi: ' + (err.message || 'Unknown error') });
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const selectedRekName = rekening.find(r => r.REKSUB === formData.rek)?.NAMA_PERK || '';
  const selectedArealName = areal.find(a => a.KODA === formData.kodeBudiDaya)?.NAMA_AREAL || '';
  const selectedAfdelingName = afdeling.find(af => af.KODAF === formData.kodeAfdeling)?.NAMA_AFDELING || '';

  if (!isSessionActive) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/40 dark:bg-transparent h-full overflow-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 max-w-sm w-full overflow-hidden shadow-md">
          <div className="p-6 border-b border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/20 text-center">
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center mx-auto mb-4 border border-orange-100 dark:border-orange-900/30">
              <FileCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight">Buka Bulan Buku</h2>
            <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">Pilih unit kebun dan periode sebelum menginput.</p>
          </div>
          
          <form onSubmit={handleCutoffSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> Unit Kebun
              </label>
              <select 
                required
                className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 outline-none transition-all cursor-pointer h-9"
                value={tempUnit}
                onChange={(e) => setTempUnit(e.target.value)}
              >
                <option value="">Pilih Unit Kebun</option>
                {units.map(u => (
                  <option key={u.KOKE} value={u.KOKE}>{u.KOKE} - {u.NAKE}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> Bulan
                </label>
                <select 
                  required
                  className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 outline-none transition-all cursor-pointer h-9"
                  value={tempBulan}
                  onChange={(e) => setTempBulan(e.target.value)}
                >
                  <option value="">Bulan</option>
                  {BULAN_OPTIONS.map(b => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  Tahun
                </label>
                <input 
                  type="number" 
                  required
                  className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 outline-none transition-all h-9"
                  value={tempTahun}
                  onChange={(e) => setTempTahun(e.target.value)}
                />
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full h-10 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-md transition-all shadow-sm mt-2 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" /> Buka Sesi Input
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 space-y-6 flex flex-col">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800 pb-5 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-orange-600" />
            Form Input Jurnal
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">
            Form data padat (dense layout) dengan 18 kolom data lengkap akuntansi kebun.
          </p>
        </div>
 
        {/* Active Session Info */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2 flex items-center gap-3.5 shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
            <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">
              Sesi: <span className="text-orange-600 dark:text-orange-400">Unit {koke} ({BULAN_OPTIONS.find(b=>b.value===bulan)?.label} {tahun})</span>
            </div>
          </div>
          <div className="h-4 w-px bg-slate-200 dark:bg-zinc-800"></div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={clearSession} 
            className="h-7 w-7 text-slate-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded cursor-pointer"
            title="Tutup Bulan / Ganti Sesi"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Working Area: Dense Form */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="px-5 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-950/20">
          <div className="flex items-center gap-2">
             <div className="bg-orange-655 h-1.5 w-4 rounded-full bg-orange-600"></div>
             <h2 className="font-bold text-xs text-slate-800 dark:text-zinc-200 tracking-tight uppercase">
               Entri Voucher Jurnal Baru
             </h2>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-zinc-950 px-2.5 py-1 rounded-md border border-slate-200 dark:border-zinc-800 shadow-sm text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            <HelpCircle className="w-3 h-3 text-slate-400" /> Shortcut: Tab untuk pindah kolom
          </div>
        </div>
        
        <form onSubmit={handleSaveJurnal} className="p-5 flex-1 flex flex-col justify-between overflow-auto">
          <div className="space-y-6">
            {message && (
               <div className={cn(
                   "p-3 rounded-lg text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200",
                   message.type === 'success' 
                     ? 'bg-orange-50 dark:bg-orange-950/15 text-orange-850 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30' 
                     : 'bg-rose-50 dark:bg-rose-950/25 text-rose-800 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30'
               )}>
                  {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-orange-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                  {message.text}
               </div>
            )}

            {/* SECTION 1: METADATA & BUKTI */}
            <div className="bg-slate-50/50 dark:bg-zinc-950/20 p-4 rounded-xl border border-slate-250/60 dark:border-zinc-800 space-y-4">
              <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider block">1. Informasi Dokumen & Periode</span>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Kode Unit</label>
                  <input 
                    type="text" 
                    disabled 
                    className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-zinc-400 h-9"
                    value={koke}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Bulan Buku</label>
                  <input 
                    type="text" 
                    disabled 
                    className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-zinc-400 h-9"
                    value={BULAN_OPTIONS.find(b => b.value === bulan)?.label || bulan}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all h-9"
                    value={formData.tanggal}
                    onChange={e => setFormData({...formData, tanggal: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                     <span>Nomor Bukti <span className="text-red-500">*</span></span>
                     <button 
                      type="button"
                      className="text-orange-600 dark:text-orange-400 hover:text-orange-700 hover:scale-105 transition-all outline-none"
                      onClick={refreshNoBukti}
                      title="Generate Nomor"
                     >
                       <RefreshCcw className="w-3 h-3" />
                     </button>
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-zinc-100 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all h-9"
                    value={formData.noBukti}
                    onChange={e => setFormData({...formData, noBukti: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">No Record (Sequence)</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: 001"
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all h-9"
                    value={formData.noRecord}
                    onChange={e => setFormData({...formData, noRecord: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: REKENING & REKENING LAWAN */}
            <div className="bg-slate-50/50 dark:bg-zinc-950/20 p-4 rounded-xl border border-slate-250/60 dark:border-zinc-800 space-y-4">
              <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider block">2. Pemetaan Rekening Akuntansi</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
                    Rekening (COA) <span className="text-red-500">*</span>
                  </label>
                  <CustomCombobox 
                    items={rekening} 
                    value={formData.rek} 
                    onChange={(v) => setFormData({...formData, rek: v})} 
                    placeholder="Pilih rekening utama..."
                    valueKey="REKSUB"
                    labelKey="NAMA_PERK"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Nama Rekening</label>
                  <input 
                    type="text" 
                    disabled 
                    placeholder="Otomatis dari COA..."
                    className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-450 h-9 truncate"
                    value={selectedRekName}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
                    Rekening Lawan (Contra) <span className="text-red-500">*</span>
                  </label>
                  <CustomCombobox 
                    items={rekening} 
                    value={formData.rekla} 
                    onChange={(v) => setFormData({...formData, rekla: v})} 
                    placeholder="Pilih rekening lawan..."
                    valueKey="REKSUB"
                    labelKey="NAMA_PERK"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: BUDI DAYA, AFDELING, TANAM */}
            <div className="bg-slate-50/50 dark:bg-zinc-950/20 p-4 rounded-xl border border-slate-250/60 dark:border-zinc-800 space-y-4">
              <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider block">3. Lokasi & Budidaya Kebun</span>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Kode Budi Daya (Areal)</label>
                  <CustomCombobox 
                    items={areal} 
                    value={formData.kodeBudiDaya} 
                    onChange={(v) => setFormData({...formData, kodeBudiDaya: v})} 
                    placeholder="Pilih budi daya..."
                    valueKey="KODA"
                    labelKey="NAMA_AREAL"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Nama Budi Daya</label>
                  <input 
                    type="text" 
                    disabled 
                    placeholder="Otomatis..."
                    className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-450 h-9 truncate"
                    value={selectedArealName}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Kode Afdeling</label>
                  <CustomCombobox 
                    items={afdeling.filter(af => !af.KOKE || af.KOKE === koke)} 
                    value={formData.kodeAfdeling} 
                    onChange={(v) => setFormData({...formData, kodeAfdeling: v})} 
                    placeholder="Pilih afdeling..."
                    valueKey="KODAF"
                    labelKey="NAMA_AFDELING"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Nama Afdeling</label>
                  <input 
                    type="text" 
                    disabled 
                    placeholder="Otomatis..."
                    className="w-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-450 h-9 truncate"
                    value={selectedAfdelingName}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Tahun Tanam</label>
                  <input 
                    type="text" 
                    maxLength={4}
                    placeholder="Contoh: 2018"
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all h-9"
                    value={formData.tahunTanam}
                    onChange={e => setFormData({...formData, tahunTanam: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: NOTA & DESKRIPSI */}
            <div className="bg-slate-50/50 dark:bg-zinc-950/20 p-4 rounded-xl border border-slate-250/60 dark:border-zinc-800 space-y-4">
              <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider block">4. Dokumen Nota & Penjelasan Transaksi</span>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">No. Nota</label>
                  <input 
                    type="text" 
                    placeholder="No. Nota"
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all h-9"
                    value={formData.noNota}
                    onChange={e => setFormData({...formData, noNota: e.target.value})}
                  />
                </div>
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Jenis Nota</label>
                  <input 
                    type="text" 
                    placeholder="Jenis Nota"
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all h-9"
                    value={formData.jenisNota}
                    onChange={e => setFormData({...formData, jenisNota: e.target.value})}
                  />
                </div>
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Uraian Transaksi / Deskripsi</label>
                  <input 
                    type="text" 
                    maxLength={255}
                    placeholder="Tuliskan uraian transaksi..."
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all h-9"
                    value={formData.uraian}
                    onChange={e => setFormData({...formData, uraian: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: DEBET / KREDIT */}
            <div className="bg-slate-50/50 dark:bg-zinc-950/20 p-4 rounded-xl border border-slate-250/60 dark:border-zinc-800 space-y-4">
              <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider block">5. Nilai Transaksi</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center justify-between px-1">
                    Nilai Debet
                    <span className="text-[8px] bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30 px-1 rounded font-bold uppercase">(+) MASUK</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 dark:text-zinc-500 text-xs font-bold">Rp</span>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-xs font-bold text-slate-800 dark:text-zinc-100 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-mono h-9"
                      placeholder="0.00"
                      value={formData.debet}
                      onChange={e => {
                        const val = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          debet: val,
                          kredit: val ? '0' : prev.kredit
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-450 uppercase tracking-wider flex items-center justify-between px-1">
                    Nilai Kredit
                    <span className="text-[8px] bg-slate-100 dark:bg-zinc-950/40 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 px-1 rounded font-bold uppercase">(-) KELUAR</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 dark:text-zinc-500 text-xs font-bold">Rp</span>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-xs font-bold text-slate-800 dark:text-zinc-100 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-mono h-9"
                      placeholder="0.00"
                      value={formData.kredit}
                      onChange={e => {
                        const val = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          kredit: val,
                          debet: val ? '0' : prev.debet
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setFormData({
                  tanggal: new Date().toISOString().split('T')[0],
                  noBukti: '',
                  noRecord: '',
                  rek: '',
                  rekla: '',
                  kodeBudiDaya: '',
                  kodeAfdeling: '',
                  tahunTanam: '',
                  noNota: '',
                  jenisNota: '',
                  uraian: '',
                  debet: '',
                  kredit: ''
                });
                setMessage(null);
                refreshNoBukti();
              }}
              className="w-full sm:w-auto px-4 h-9 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-450 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-md font-bold text-xs transition-all cursor-pointer"
            >
              Reset Form
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto px-6 h-9 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-md shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Menyimpan...' : 'Simpan Transaksi (Double Entry)'}
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
}
