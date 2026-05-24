import UnitTable from '@/components/master-unit/unit-table';
import { getMasterUnit } from '@/lib/actions/master-unit';
import { LayoutDashboard } from 'lucide-react';

export default async function MasterUnitPage() {
  const data = await getMasterUnit();

  return (
    <div className="flex-1 overflow-auto bg-slate-50/40 p-6 lg:p-8 space-y-6 flex flex-col">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-emerald-600" />
            Master Unit / Kebun
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-1">
            Kelola data daftar kebun, pimpinan afdeling, dan referensi lokasi operasional.
          </p>
        </div>
      </div>
      
      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <UnitTable data={data} />
      </div>
    </div>
  );
}
