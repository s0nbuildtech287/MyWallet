import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, totalCount, onPageChange, label = 'tài sản' }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
      <span className="text-[10px] text-slate-500">
        Trang {currentPage}/{totalPages} &nbsp;·&nbsp; {totalCount} {label}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-7 w-7 flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
          .reduce((acc, p, idx, arr) => {
            if (idx > 0 && arr[idx - 1] !== p - 1) acc.push("...");
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === "..." ? (
              <span key={"ellipsis-" + i} className="px-1 text-slate-600 text-[10px]">...</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`h-7 w-7 flex items-center justify-center rounded-lg text-[10px] font-bold border transition-all ${
                  currentPage === p
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                }`}
              >
                {p}
              </button>
            )
          )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-7 w-7 flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
