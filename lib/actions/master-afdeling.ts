"use server";

import { createClient } from '../supabase/server';
import { MasterAfdeling, MasterAfdelingInput } from '../types/master-afdeling';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export async function getMasterAfdeling(unit?: string) {
  noStore();
  const supabase = await createClient();
  try {
    let query = supabase.from('master_afdeling').select('*');
    if (unit) {
      query = query.eq('KOKE', unit);
    }
    const { data, error } = await query.order('KODAF', { ascending: true });
    
    if (error) throw error;
    return data as MasterAfdeling[];
  } catch (error) {
    console.error("Error fetching master_afdeling:", error);
    return [];
  }
}



export async function addMasterAfdeling(input: MasterAfdelingInput) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('master_afdeling')
      .insert([input])
      .select()
      .single();
    
    if (error) throw error;
    revalidatePath('/portal/accounting/master-lokasi');
    return data as MasterAfdeling;
  } catch (error: any) {
    console.error("Error adding master_afdeling:", error);
    throw new Error(error.message);
  }
}

export async function updateMasterAfdeling(kodaf: string, input: Partial<MasterAfdelingInput>) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('master_afdeling')
      .update(input)
      .eq('KODAF', kodaf)
      .select()
      .single();
    
    if (error) throw error;
    revalidatePath('/portal/accounting/master-lokasi');
    return data as MasterAfdeling;
  } catch (error: any) {
    console.error("Error updating master_afdeling:", error);
    throw new Error(error.message);
  }
}

export async function deleteMasterAfdeling(kodaf: string) {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from('master_afdeling')
      .delete()
      .eq('KODAF', kodaf);
    
    if (error) throw error;
    revalidatePath('/portal/accounting/master-lokasi');
    return true;
  } catch (error: any) {
    console.error("Error deleting master_afdeling:", error);
    throw new Error(error.message);
  }
}

