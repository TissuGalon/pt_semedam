"use client";

import { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { MasterUnit } from '@/lib/types/master-unit';
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { deleteMasterUnit } from '@/lib/actions/master-unit';
import { DataTable } from "@/components/ui/data-table";
import UnitForm from './unit-form';

interface UnitTableProps {
  data: MasterUnit[];
}

export default function UnitTable({ data }: UnitTableProps) {
  const [tableData, setTableData] = useState(data);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<MasterUnit | undefined>();

  const handleDelete = async (koke: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus unit ini?')) {
      try {
        await deleteMasterUnit(koke);
        setTableData(tableData.filter(d => d.KOKE !== koke));
      } catch (error) {
        alert('Gagal menghapus data.');
        console.error(error);
      }
    }
  };

  const columns: ColumnDef<MasterUnit>[] = [
    {
      accessorKey: "KOKE",
      header: "Kode",
      cell: ({ row }) => <div className="font-bold text-slate-800 dark:text-zinc-200">{row.getValue("KOKE")}</div>,
    },
    {
      accessorKey: "NAKE",
      header: "Nama Kebun/Unit",
      cell: ({ row }) => <div className="font-medium text-slate-900 dark:text-zinc-100">{row.getValue("NAKE")}</div>,
    },
    {
      accessorKey: "PIMPINAN",
      header: "Pimpinan",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-900 dark:text-zinc-100">{row.getValue("PIMPINAN") || "-"}</span>
        </div>
      ),
    },
    {
      accessorKey: "NAMA_KTU",
      header: "KTU",
      cell: ({ row }) => <span className="text-slate-500 dark:text-zinc-400">{row.getValue("NAMA_KTU") || "-"}</span>,
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
              onClick={() => handleDelete(item.KOKE)}
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
        searchPlaceholder="Cari berdasarkan nama kebun, kode, atau pimpinan..."
        filename="Master_Unit_Semadam"
        toolbarChildren={
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-md h-9 px-3 text-xs transition-all animate-in fade-in" 
            onClick={() => {
              setEditingData(undefined);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Tambah Unit
          </Button>
        }
      />

      {isFormOpen && (
        <UnitForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          initialData={editingData} 
          onSuccess={(newData: MasterUnit, isEdit: boolean) => {
            setIsFormOpen(false);
            if (isEdit) {
              setTableData(tableData.map(d => d.KOKE === newData.KOKE ? newData : d));
            } else {
              setTableData([newData, ...tableData]);
            }
          }}
        />
      )}
    </div>
  );
}
