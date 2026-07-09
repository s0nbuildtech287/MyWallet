import React from 'react';

export default function Card({ 
  title, 
  value, 
  icon: Icon, 
  valueClass = "text-slate-100", 
  iconClass = "text-slate-400", 
  bgIconClass = "bg-slate-800/60" 
}) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <span className={`text-lg font-bold ${valueClass}`}>{value}</span>
      </div>
      <div className={`p-2.5 rounded-xl border border-slate-700/50 flex items-center justify-center ${bgIconClass} ${iconClass}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
export function SubCard({ title, value, valueClass = "text-slate-100" }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-1">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{title}</span>
      <span className={`text-base font-extrabold ${valueClass}`}>{value}</span>
    </div>
  );
}
