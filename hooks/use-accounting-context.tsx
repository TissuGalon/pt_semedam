'use client';

import * as React from 'react';

interface AccountingContextType {
  koke: string;
  bulan: string;
  tahun: string;
  setKoke: (koke: string) => void;
  setBulan: (bulan: string) => void;
  setTahun: (tahun: string) => void;
  isSessionActive: boolean;
  clearSession: () => void;
  isFallback?: boolean;
}

const AccountingContext = React.createContext<AccountingContextType | undefined>(undefined);

export function AccountingProvider({ children }: { children: React.ReactNode }) {
  const [koke, setKokeState] = React.useState<string>('');
  const [bulan, setBulanState] = React.useState<string>('');
  const [tahun, setTahunState] = React.useState<string>('');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedKoke = localStorage.getItem('accounting_koke') || '';
      const savedBulan = localStorage.getItem('accounting_bulan') || '';
      const savedTahun = localStorage.getItem('accounting_tahun') || new Date().getFullYear().toString();
      setKokeState(savedKoke);
      setBulanState(savedBulan);
      setTahunState(savedTahun);
    }
  }, []);

  const setKoke = (val: string) => {
    setKokeState(val);
    if (typeof window !== 'undefined') localStorage.setItem('accounting_koke', val);
  };

  const setBulan = (val: string) => {
    setBulanState(val);
    if (typeof window !== 'undefined') localStorage.setItem('accounting_bulan', val);
  };

  const setTahun = (val: string) => {
    setTahunState(val);
    if (typeof window !== 'undefined') localStorage.setItem('accounting_tahun', val);
  };

  const clearSession = () => {
    setKokeState('');
    setBulanState('');
    setTahunState('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accounting_koke');
      localStorage.removeItem('accounting_bulan');
      localStorage.removeItem('accounting_tahun');
    }
  };

  const isSessionActive = isMounted && koke !== '' && bulan !== '' && tahun !== '';

  return (
    <AccountingContext.Provider
      value={{
        koke,
        bulan,
        tahun,
        setKoke,
        setBulan,
        setTahun,
        isSessionActive,
        clearSession,
      }}
    >
      {children}
    </AccountingContext.Provider>
  );
}

export function useAccounting() {
  const context = React.useContext(AccountingContext);
  if (context === undefined) {
    return {
      koke: '',
      bulan: '',
      tahun: '',
      setKoke: () => {},
      setBulan: () => {},
      setTahun: () => {},
      isSessionActive: false,
      clearSession: () => {},
      isFallback: true,
    };
  }
  return { ...context, isFallback: false };
}
