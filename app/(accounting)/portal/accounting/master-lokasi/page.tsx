import { getMasterAreal } from '@/lib/actions/master-areal';
import { getMasterAfdeling } from '@/lib/actions/master-afdeling';
import { getMasterUnit } from '@/lib/actions/master-unit';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ArealTable from '@/components/master-lokasi/areal-table';
import AfdelingTable from '@/components/master-lokasi/afdeling-table';
import { MapPin, Sprout, Building2 } from 'lucide-react';

export default async function MasterLokasiPage() {
  const [arealData, afdelingData, unitData] = await Promise.all([
    getMasterAreal(),
    getMasterAfdeling(),
    getMasterUnit()
  ]);

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 dark:bg-transparent p-6 lg:p-8 space-y-6 flex flex-col">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Master Data Lokasi & Budidaya Kebun
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold mt-1">
            Kelola data areal budidaya kelapa sawit dan pembagian wilayah lokasi (afdeling) operasional kebun.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <Tabs defaultValue="budidaya" className="w-full flex-1 flex flex-col gap-4">
          <TabsList className="bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1 w-fit rounded-lg">
            <TabsTrigger value="budidaya" className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-md">
              <Sprout className="w-4 h-4 text-emerald-650" />
              Budidaya Kebun (Areal)
            </TabsTrigger>
            <TabsTrigger value="afdeling" className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-md">
              <Building2 className="w-4 h-4 text-blue-650" />
              Lokasi Kebun (Afdeling)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="budidaya" className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm mt-0">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Referensi Budi Daya / Areal Kebun</h2>
              <p className="text-slate-450 dark:text-zinc-500 text-[11px] font-medium mt-0.5">
                Daftar komoditas dan klasifikasi blok budidaya yang digunakan untuk alokasi pengeluaran jurnal biaya tanaman.
              </p>
            </div>
            <ArealTable data={arealData} />
          </TabsContent>

          <TabsContent value="afdeling" className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm mt-0">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Pembagian Lokasi Kebun (Afdeling)</h2>
              <p className="text-slate-450 dark:text-zinc-500 text-[11px] font-medium mt-0.5">
                Daftar divisi/afdeling penanggung jawab operasional di lapangan yang dihubungkan dengan unit kebun aktif.
              </p>
            </div>
            <AfdelingTable data={afdelingData} units={unitData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
