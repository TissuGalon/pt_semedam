export type MasterAreal = {
  KODA: string;
  NAMA_AREAL: string;
  created_at?: string;
};

export type MasterArealInput = Omit<MasterAreal, 'created_at'>;
