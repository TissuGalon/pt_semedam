"use server";

import { createClient } from '../supabase/server';
import { MasterAreal, MasterArealInput } from '../types/master-areal';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export async function getMasterAreal() {
  noStore();
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('master_areal')
      .select('*')
      .order('KODA', { ascending: true });
    
    if (error) throw error;
    return data as MasterAreal[];
  } catch (error) {
    console.error("Error fetching master_areal:", error);
    return [];
  }
}

export async function addMasterAreal(input: MasterArealInput) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('master_areal')
      .insert([input])
      .select()
      .single();
    
    if (error) throw error;
    revalidatePath('/portal/accounting/master-lokasi');
    return data as MasterAreal;
  } catch (error: any) {
    console.error("Error adding master_areal:", error);
    throw new Error(error.message);
  }
}

export async function updateMasterAreal(koda: string, input: Partial<MasterArealInput>) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('master_areal')
      .update(input)
      .eq('KODA', koda)
      .select()
      .single();
    
    if (error) throw error;
    revalidatePath('/portal/accounting/master-lokasi');
    return data as MasterAreal;
  } catch (error: any) {
    console.error("Error updating master_areal:", error);
    throw new Error(error.message);
  }
}

export async function deleteMasterAreal(koda: string) {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from('master_areal')
      .delete()
      .eq('KODA', koda);
    
    if (error) throw error;
    revalidatePath('/portal/accounting/master-lokasi');
    return true;
  } catch (error: any) {
    console.error("Error deleting master_areal:", error);
    throw new Error(error.message);
  }
}

