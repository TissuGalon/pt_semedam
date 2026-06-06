"use server";

import { createClient } from '../supabase/server';
import { MasterAreal } from '../types/master-areal';
import { unstable_noStore as noStore } from 'next/cache';

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
