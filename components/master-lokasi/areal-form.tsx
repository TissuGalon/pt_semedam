"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MasterAreal } from "@/lib/types/master-areal";
import { addMasterAreal, updateMasterAreal } from "@/lib/actions/master-areal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  KODA: z.string().min(1, "Kode Budi Daya diperlukan").max(20),
  NAMA_AREAL: z.string().min(1, "Nama Budi Daya diperlukan").max(255),
});

type FormValues = z.infer<typeof formSchema>;

interface ArealFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: MasterAreal;
  onSuccess: (data: MasterAreal, isEdit: boolean) => void;
}

export default function ArealForm({ isOpen, onClose, initialData, onSuccess }: ArealFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!initialData;

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      KODA: initialData?.KODA || "",
      NAMA_AREAL: initialData?.NAMA_AREAL || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      let result;
      const processedValues = {
        KODA: values.KODA,
        NAMA_AREAL: values.NAMA_AREAL,
      };

      if (isEdit && initialData) {
        result = await updateMasterAreal(initialData.KODA, processedValues);
      } else {
        result = await addMasterAreal(processedValues);
      }
      onSuccess(result, isEdit);
    } catch (error: any) {
      alert("Gagal menyimpan data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Budidaya Kebun" : "Tambah Budidaya Kebun"}</DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Ubah data budidaya kebun/areal di bawah ini." 
              : "Masukkan data budidaya kebun/areal baru. Kode budidaya harus unik."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="KODA">Kode Budi Daya (Areal) *</Label>
            <Input 
              id="KODA" 
              placeholder="Contoh: A01" 
              disabled={isEdit} 
              {...register("KODA")} 
              className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs"
            />
            {errors.KODA && <p className="text-xs text-red-500 font-semibold">{errors.KODA.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="NAMA_AREAL">Nama Budi Daya *</Label>
            <Input 
              id="NAMA_AREAL" 
              placeholder="Contoh: Kelapa Sawit TM 2015" 
              {...register("NAMA_AREAL")} 
              className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs"
            />
            {errors.NAMA_AREAL && <p className="text-xs text-red-500 font-semibold">{errors.NAMA_AREAL.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="text-xs h-9">
              Batal
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white min-w-[100px] text-xs h-9" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : null}
              {isEdit ? "Simpan Perubahan" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
