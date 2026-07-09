import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import Card from '../../ui/Card';

export default function ResultsKPIs({ results, formatVal }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        title="Tổng vốn đầu tư"
        value={formatVal(results.totalInvested)}
        icon={DollarSign}
        iconClass="text-slate-400"
      />

      <Card
        title="Giá trị tài sản hiện tại"
        value={formatVal(results.finalValue)}
        icon={DollarSign}
        iconClass="text-emerald-400"
      />

      <Card
        title="Lợi nhuận ròng"
        value={(results.netProfit >= 0 ? '+' : '') + formatVal(results.netProfit)}
        icon={results.netProfit >= 0 ? TrendingUp : TrendingDown}
        iconClass={results.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}
        bgIconClass={results.netProfit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}
        valueClass={results.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}
      />

      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tỷ suất lợi nhuận</span>
          <div className="flex flex-col">
            <span className={`text-base font-bold ${results.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {results.netProfit >= 0 ? '+' : ''}{results.profitPercent.toFixed(2)}%
            </span>
            {results.cagr !== null && (
              <span className="text-[10px] text-slate-400">CAGR: {results.cagr.toFixed(2)}%/năm</span>
            )}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
          results.netProfit >= 0 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          <Percent className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
