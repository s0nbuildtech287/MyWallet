import React from 'react';

export default function Header({ macroIndices }) {
  return (
    <header className="h-16 border-b border-slate-700/10 bg-slate-900/40 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
      <div className="flex items-center gap-6 overflow-hidden max-w-full">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0 hidden md:block">Bảng tin nhanh:</span>
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
          {macroIndices.map((item) => (
            <div key={item.symbol} className="flex items-center gap-1.5 text-[10px] shrink-0">
              <span className="text-slate-400 font-semibold">{item.name}</span>
              <span className="font-bold font-mono text-slate-200">{item.price.toLocaleString('en-US')}</span>
              <span className={`font-mono font-bold ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.change >= 0 ? '↑' : '↓'}{Math.abs(item.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/25 py-1.5 px-3.5 rounded-full text-[9px] font-extrabold tracking-wider text-emerald-400 font-mono shadow-lg shadow-emerald-500/5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span>LIVE</span>
        </div>
      </div>
    </header>
  );
}
