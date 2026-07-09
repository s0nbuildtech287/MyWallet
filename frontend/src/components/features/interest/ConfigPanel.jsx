import React from 'react';
import { Calculator } from 'lucide-react';

export default function ConfigPanel({
  interestInit,
  setInterestInit,
  interestMonthly,
  setInterestMonthly,
  interestRate,
  setInterestRate,
  interestYears,
  setInterestYears
}) {
  return (
    <section className="lg:col-span-1 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-lg flex flex-col gap-5 h-fit shadow-2xl">
      <div className="border-b border-slate-800/60 pb-3 flex items-center gap-2">
        <Calculator className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Thông số đầu tư</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400">Số tiền ban đầu (VND)</label>
          <input
            type="number"
            value={interestInit}
            onChange={(e) => setInterestInit(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-sm focus:outline-none text-slate-100 font-mono"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400">Gửi thêm hàng tháng (VND)</label>
          <input
            type="number"
            value={interestMonthly}
            onChange={(e) => setInterestMonthly(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-sm focus:outline-none text-slate-100 font-mono"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400">Lãi suất hàng năm (%)</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-sm focus:outline-none text-slate-100 font-mono"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400">Thời gian gửi (Năm)</label>
          <input
            type="number"
            value={interestYears}
            onChange={(e) => setInterestYears(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-sm focus:outline-none text-slate-100 font-mono"
          />
        </div>
      </div>
    </section>
  );
}
