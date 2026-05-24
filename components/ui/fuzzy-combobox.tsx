'use client';

import * as React from 'react';
import { Search, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FuzzyComboboxProps {
  items: { value: string; label: string; [key: string]: any }[];
  placeholder?: string;
  onSelect: (value: string) => void;
  selectedValue?: string;
  className?: string;
}

export function FuzzyCombobox({
  items,
  placeholder = "Cari...",
  onSelect,
  selectedValue = '',
  className
}: FuzzyComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = items.filter(item =>
    item.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedItem = items.find(item => item.value === selectedValue);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full justify-between h-9 text-left font-bold text-xs border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 truncate"
        type="button"
      >
        <span className="truncate">
          {selectedItem ? `[${selectedItem.value}] ${selectedItem.label}` : placeholder}
        </span>
        <Search className="w-3.5 h-3.5 ml-2 text-slate-400 shrink-0" />
      </Button>

      {isOpen && (
        <div className="absolute top-10 left-0 w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xl z-30 p-2 space-y-1.5 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1.5 duration-150">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Ketik kode atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-8 rounded border border-slate-200 dark:border-zinc-800 text-[11px] font-semibold bg-slate-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-zinc-200"
              autoFocus
            />
            <Search className="absolute left-2.5 w-3.5 h-3.5 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-0.5 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full"
                type="button"
              >
                <X className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
          <div className="space-y-0.5 max-h-40 overflow-y-auto pr-1">
            {filteredItems.map(item => (
              <button
                key={item.value}
                onClick={() => {
                  onSelect(item.value);
                  setIsOpen(false);
                  setSearchQuery('');
                }}
                className={cn(
                  "w-full text-left px-2.5 py-1.5 text-[11px] font-semibold rounded hover:bg-slate-50 dark:hover:bg-zinc-900 flex items-center justify-between transition-colors",
                  selectedValue === item.value 
                    ? "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-bold" 
                    : "text-slate-600 dark:text-zinc-400"
                )}
                type="button"
              >
                <span className="truncate">
                  <span className="font-mono text-emerald-600 font-bold mr-1.5">[{item.value}]</span> {item.label}
                </span>
                {selectedValue === item.value && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />}
              </button>
            ))}
            {filteredItems.length === 0 && (
              <div className="text-[10px] text-slate-400 italic text-center py-2 font-semibold">Tidak ditemukan hasil pencarian.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
