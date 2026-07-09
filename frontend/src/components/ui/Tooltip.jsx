import React from 'react';
import { Info } from 'lucide-react';

export default function Tooltip({ content, position = 'top' }) {
  if (!content) return null;

  return (
    <div className="group relative inline-block ml-1 cursor-pointer align-middle select-none">
      <Info className="h-3.5 w-3.5 text-slate-500 hover:text-slate-300 transition-colors" />
      
      {/* Tooltip box */}
      <div className={`absolute z-[99] hidden group-hover:block w-52 bg-slate-900 border border-slate-700/25 text-[10px] text-slate-300 p-2.5 rounded-lg shadow-xl font-normal leading-normal pointer-events-none transition-all duration-200
        ${position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : ''}
        ${position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' : ''}
        ${position === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2' : ''}
        ${position === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-2' : ''}
      `}>
        {content}
        {/* Tiny arrow */}
        <div className={`absolute border-4 border-transparent
          ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-slate-900' : ''}
          ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-slate-900' : ''}
          ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-l-slate-900' : ''}
          ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1 border-r-slate-900' : ''}
        `} />
      </div>
    </div>
  );
}
