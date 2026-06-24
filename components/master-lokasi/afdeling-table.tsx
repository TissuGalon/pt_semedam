"use client";

import { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { MasterAfdeling } from '@/lib/types/master-afdeling';
import { MasterUnit } from '@/lib/types/master-unit';
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { deleteMasterAfdeling } from '@/lib/actions/master-afdeling';
import { DataTable } from "@/components/ui/data-table";
import AfdelingForm from './afdeling-form';

interface AfdelingTableProps {
  data: MasterAfdeling[];
  units: MasterUnit[];
}

export default function AfdelingTable({ data, units }: AfdelingTableProps) {
  const [tableData, setTableData] = useState(data);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<MasterAfdeling | undefined>();

  const handleDelete = async (kodaf: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data afdeling ini?')) {
      try {
        await deleteMasterAfdeling(kodaf);
        setTableData(tableData.filter(d => d.KODAF !== kodaf));
      } catch (error: any) {
        alert('Gagal menghapus data: ' + error.message);
      }
    }
  };

  const columns: ColumnDef<MasterAfdeling>[] = [
    {
      accessorKey: "KODAF",
      header: "Kode Afdeling",
      cell: ({ row }) => <div className="font-bold text-slate-800 dark:text-zinc-200">{row.getValue("KODAF")}</div>,
    },
    {
      accessorKey: "NAMA_AFDELING",
      header: "Nama Afdeling",
      cell: ({ row }) => <div className="font-medium text-slate-900 dark:text-zinc-100">{row.getValue("NAMA_AFDELING")}</div>,
    },
    {
      accessorKey: "KOKE",
      header: "Unit / Kebun",
      cell: ({ row }) => {
        const kokeVal = row.getValue("KOKE") as string;
        const matchingUnit = units.find(u => u.KOKE === kokeVal);
        return (
          <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-zinc-400">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {kokeVal ? `${kokeVal} - ${matchingUnit?.NAKE || 'Tidak Diketahui'}` : '-'}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-end gap-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2.5 rounded-md border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100 transition-all text-xs"
              onClick={() => {
                setEditingData(item);
                setIsFormOpen(true);
              }}
            >
              <Pencil className="w-3 h-3 mr-1" /> Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2.5 rounded-md border-slate-200 dark:border-zinc-800 text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 hover:border-rose-200 dark:hover:border-rose-900 transition-all text-xs"
              onClick={() => handleDelete(item.KODAF)}
            >
              <Trash2 className="w-3 h-3 mr-1" /> Hapus
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable 
        columns={columns} 
        data={tableData} 
        searchPlaceholder="Cari berdasarkan kode, nama afdeling, atau unit..."
        filename="Master_Afdeling_Semadam"
        toolbarChildren={
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-md h-9 px-3 text-xs transition-all" 
            onClick={() => {
              setEditingData(undefined);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Tambah Afdeling
          </Button>
        }
      />

      {isFormOpen && (
        <AfdelingForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          units={units}
          initialData={editingData} 
          onSuccess={(newData: MasterAfdeling, isEdit: boolean) => {
            setIsFormOpen(false);
            if (isEdit) {
              setTableData(tableData.map(d => d.KODAF === newData.KODAF ? newData : d));
            } else {
              setTableData([newData, ...tableData]);
            }
          }}
        />
      )}
    </div>
  );
}
