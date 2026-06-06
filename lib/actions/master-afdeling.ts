"use server";

import { createClient } from '../supabase/server';
import { MasterAfdeling } from '../types/master-afdeling';
import { unstable_noStore as noStore } from 'next/cache';

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
