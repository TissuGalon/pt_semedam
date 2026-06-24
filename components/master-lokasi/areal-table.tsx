"use client";

import { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { MasterAreal } from '@/lib/types/master-areal';
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { deleteMasterAreal } from '@/lib/actions/master-areal';
import { DataTable } from "@/components/ui/data-table";
import ArealForm from './areal-form';

interface ArealTableProps {
  data: MasterAreal[];
}

export default function ArealTable({ data }: ArealTableProps) {
  const [tableData, setTableData] = useState(data);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<MasterAreal | undefined>();

  const handleDelete = async (koda: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data budidaya ini?')) {
      try {
        await deleteMasterAreal(koda);
        setTableData(tableData.filter(d => d.KODA !== koda));
      } catch (error: any) {
        alert('Gagal menghapus data: ' + error.message);
      }
    }
  };

  const columns: ColumnDef<MasterAreal>[] = [
    {
      accessorKey: "KODA",
      header: "Kode Budi Daya",
      cell: ({ row }) => <div className="font-bold text-slate-800 dark:text-zinc-200">{row.getValue("KODA")}</div>,
    },
    {
      accessorKey: "NAMA_AREAL",
      header: "Nama Budi Daya / Areal",
      cell: ({ row }) => <div className="font-medium text-slate-900 dark:text-zinc-100">{row.getValue("NAMA_AREAL")}</div>,
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
              onClick={() => handleDelete(item.KODA)}
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
        searchPlaceholder="Cari berdasarkan kode atau nama budidaya..."
        filename="Master_Budidaya_Semadam"
        toolbarChildren={
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-md h-9 px-3 text-xs transition-all" 
            onClick={() => {
              setEditingData(undefined);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Tambah Budidaya
          </Button>
        }
      />

      {isFormOpen && (
        <ArealForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          initialData={editingData} 
          onSuccess={(newData: MasterAreal, isEdit: boolean) => {
            setIsFormOpen(false);
            if (isEdit) {
              setTableData(tableData.map(d => d.KODA === newData.KODA ? newData : d));
            } else {
              setTableData([newData, ...tableData]);
            }
          }}
        />
      )}
    </div>
  );
}
