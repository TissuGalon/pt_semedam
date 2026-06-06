export type MasterAfdeling = {
  KODAF: string;
  NAMA_AFDELING: string;
  KOKE: string | null;
  created_at?: string;
};

export type MasterAfdelingInput = Omit<MasterAfdeling, 'created_at'>;
