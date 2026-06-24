"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MasterAfdeling } from "@/lib/types/master-afdeling";
import { MasterUnit } from "@/lib/types/master-unit";
import { addMasterAfdeling, updateMasterAfdeling } from "@/lib/actions/master-afdeling";
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
  KODAF: z.string().min(1, "Kode Afdeling diperlukan").max(20),
  NAMA_AFDELING: z.string().min(1, "Nama Afdeling diperlukan").max(255),
  KOKE: z.string().max(10).optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface AfdelingFormProps {
  isOpen: boolean;
  onClose: () => void;
  units: MasterUnit[];
  initialData?: MasterAfdeling;
  onSuccess: (data: MasterAfdeling, isEdit: boolean) => void;
}

export default function AfdelingForm({ isOpen, onClose, units, initialData, onSuccess }: AfdelingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!initialData;

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      KODAF: initialData?.KODAF || "",
      NAMA_AFDELING: initialData?.NAMA_AFDELING || "",
      KOKE: initialData?.KOKE || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      let result;
      const processedValues = {
        KODAF: values.KODAF,
        NAMA_AFDELING: values.NAMA_AFDELING,
        KOKE: values.KOKE || null,
      };

      if (isEdit && initialData) {
        result = await updateMasterAfdeling(initialData.KODAF, processedValues);
      } else {
        result = await addMasterAfdeling(processedValues);
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
          <DialogTitle>{isEdit ? "Edit Lokasi/Afdeling" : "Tambah Lokasi/Afdeling Baru"}</DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Ubah data afdeling dan pemetaan unit di bawah ini." 
              : "Masukkan data afdeling baru dan hubungkan dengan unit kebun."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="KODAF">Kode Afdeling *</Label>
            <Input 
              id="KODAF" 
              placeholder="Contoh: AF-01" 
              disabled={isEdit} 
              {...register("KODAF")} 
              className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs"
            />
            {errors.KODAF && <p className="text-xs text-red-500 font-semibold">{errors.KODAF.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="NAMA_AFDELING">Nama Afdeling *</Label>
            <Input 
              id="NAMA_AFDELING" 
              placeholder="Contoh: Afdeling I (Semedam)" 
              {...register("NAMA_AFDELING")} 
              className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs"
            />
            {errors.NAMA_AFDELING && <p className="text-xs text-red-500 font-semibold">{errors.NAMA_AFDELING.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="KOKE">Unit Kebun / Referensi Unit</Label>
            <select
              id="KOKE"
              {...register("KOKE")}
              className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 focus:ring-1 focus:ring-orange-500 outline-none transition-all cursor-pointer h-9"
            >
              <option value="">-- Hubungkan ke Unit --</option>
              {units.map((u) => (
                <option key={u.KOKE} value={u.KOKE}>
                  {u.KOKE} - {u.NAKE}
                </option>
              ))}
            </select>
            {errors.KOKE && <p className="text-xs text-red-500 font-semibold">{errors.KOKE.message}</p>}
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
