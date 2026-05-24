'use client';

import * as React from 'react';
import { Calculator, X, Copy, RotateCcw, Plus, Minus, Equal, CornerRightDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FloatingCalculator() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [display, setDisplay] = React.useState('0');
  const [equation, setEquation] = React.useState('');
  const [history, setHistory] = React.useState<string[]>([]);
  const [shouldReset, setShouldReset] = React.useState(false);

  const handleDigit = (digit: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(digit);
      setShouldReset(false);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setShouldReset(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setShouldReset(false);
  };

  const handleCalculate = () => {
    if (!equation) return;
    try {
      const fullEq = equation + display;
      // Safe math eval using Function constructor
      const evalResult = new Function(`return (${fullEq})`)();
      const formattedResult = Number(evalResult).toString();
      
      setHistory(prev => [fullEq + ' = ' + formattedResult, ...prev.slice(0, 9)]);
      setDisplay(formattedResult);
      setEquation('');
      setShouldReset(true);
    } catch (err) {
      setDisplay('Error');
      setEquation('');
      setShouldReset(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    alert('Nominal ' + display + ' berhasil disalin ke clipboard!');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          isOpen 
            ? "bg-rose-600 hover:bg-rose-700 text-white rotate-90" 
            : "bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-110"
        )}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Calculator className="w-5 h-5" />}
      </Button>

      {/* Calculator Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white/95 dark:bg-zinc-950/95 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-200 backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
            <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-emerald-600" /> Kalkulator Akuntansi
            </span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-6 w-6 rounded" onClick={handleCopy} title="Salin Nominal">
                <Copy className="w-3 h-3 text-slate-500 hover:text-emerald-600" />
              </Button>
              <Button size="icon" variant="ghost" className="h-6 w-6 rounded" onClick={handleClear} title="Clear">
                <RotateCcw className="w-3 h-3 text-slate-500 hover:text-rose-600" />
              </Button>
            </div>
          </div>

          {/* Displays */}
          <div className="bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-850 rounded-lg p-3 text-right font-mono flex flex-col gap-0.5 shadow-inner">
            <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate h-4 font-bold">{equation}</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-zinc-100 truncate">{display}</div>
          </div>

          {/* Grid of buttons */}
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1 */}
            <button onClick={handleClear} className="h-10 text-xs font-extrabold bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 hover:bg-rose-100 rounded-lg transition-colors">C</button>
            <button onClick={() => handleOperator('/')} className="h-10 text-xs font-extrabold bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-350 hover:bg-slate-100 rounded-lg transition-colors">/</button>
            <button onClick={() => handleOperator('*')} className="h-10 text-xs font-extrabold bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-350 hover:bg-slate-100 rounded-lg transition-colors">*</button>
            <button onClick={() => handleOperator('-')} className="h-10 text-xs font-extrabold bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-350 hover:bg-slate-100 rounded-lg transition-colors">-</button>

            {/* Row 2 */}
            <button onClick={() => handleDigit('7')} className="h-10 text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 rounded-lg transition-all">7</button>
            <button onClick={() => handleDigit('8')} className="h-10 text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 rounded-lg transition-all">8</button>
            <button onClick={() => handleDigit('9')} className="h-10 text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 rounded-lg transition-all">9</button>
            <button onClick={() => handleOperator('+')} className="row-span-2 h-22 text-xs font-extrabold bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-350 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"><Plus className="w-4 h-4" /></button>

            {/* Row 3 */}
            <button onClick={() => handleDigit('4')} className="h-10 text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 rounded-lg transition-all">4</button>
            <button onClick={() => handleDigit('5')} className="h-10 text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 rounded-lg transition-all">5</button>
            <button onClick={() => handleDigit('6')} className="h-10 text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 rounded-lg transition-all">6</button>

            {/* Row 4 */}
            <button onClick={() => handleDigit('1')} className="h-10 text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 rounded-lg transition-all">1</button>
            <button onClick={() => handleDigit('2')} className="h-10 text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 rounded-lg transition-all">2</button>
            <button onClick={() => handleDigit('3')} className="h-10 text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 rounded-lg transition-all">3</button>
            <button onClick={handleCalculate} className="row-span-2 h-22 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center"><Equal className="w-4 h-4" /></button>

            {/* Row 5 */}
            <button onClick={() => handleDigit('0')} className="col-span-2 h-10 text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 rounded-lg transition-all">0</button>
            <button onClick={() => handleDigit('.')} className="h-10 text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 rounded-lg transition-all">.</button>
          </div>

          {/* Audit Tape History Log */}
          {history.length > 0 && (
            <div className="border-t border-slate-100 dark:border-zinc-850 pt-2 flex flex-col gap-1.5">
              <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Riwayat Perhitungan (Audit Tape):</span>
              <div className="max-h-24 overflow-y-auto space-y-1 pr-1 font-mono text-[10px] text-slate-500 dark:text-zinc-400">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-0.5 border-b border-dashed border-slate-100 dark:border-zinc-900">
                    <span className="truncate">{h}</span>
                    <button 
                      onClick={() => setDisplay(h.split(' = ')[1])}
                      className="text-[9px] text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 shrink-0"
                      title="Gunakan Hasil ini"
                    >
                      <CornerRightDown className="w-2.5 h-2.5" /> Use
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
