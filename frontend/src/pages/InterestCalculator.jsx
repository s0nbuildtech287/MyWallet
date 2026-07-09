import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Percent } from 'lucide-react';

export default function InterestCalculator({
  interestInit,
  setInterestInit,
  interestMonthly,
  setInterestMonthly,
  interestRate,
  setInterestRate,
  interestYears,
  setInterestYears,
  interestResults
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      {/* Left Config Card */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-lg flex flex-col gap-4 h-fit">
        <div className="border-b border-slate-800/60 pb-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Percent className="h-4 w-4 text-emerald-400" />
            Thiết lập lãi kép
          </h3>
        </div>

        <div className="flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 font-semibold">Vốn ban đầu (VND)</label>
            <input
              type="number"
              value={interestInit}
              onChange={(e) => setInterestInit(e.target.value)}
              className="bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-slate-200 font-bold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 font-semibold">Tiền góp hàng tháng (VND)</label>
            <input
              type="number"
              value={interestMonthly}
              onChange={(e) => setInterestMonthly(e.target.value)}
              className="bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-slate-200 font-bold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 font-semibold">Lãi suất kỳ vọng (% / năm)</label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-slate-200 font-bold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 font-semibold">Số năm tích lũy</label>
            <input
              type="number"
              value={interestYears}
              onChange={(e) => setInterestYears(e.target.value)}
              className="bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-slate-200 font-bold"
            />
          </div>
        </div>
      </section>

      {/* Right Output Dashboard */}
      <section className="lg:col-span-2 flex flex-col gap-6">
        {interestResults && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tổng vốn gốc đã góp</span>
                <span className="text-base font-extrabold text-slate-100">{interestResults.totalInvested.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tổng tiền lãi nhận</span>
                <span className="text-base font-extrabold text-emerald-400">+{interestResults.interestEarned.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tổng tài sản nhận được</span>
                <span className="text-base font-extrabold bg-gradient-to-r from-emerald-400 to-teal-100 bg-clip-text text-transparent">
                  {interestResults.finalBalance.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            {/* Chart visual */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col gap-4">
              <div className="border-b border-slate-800/60 pb-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Biểu đồ tăng trưởng lãi kép theo năm</h3>
              </div>
              <div className="h-[250px]">
                <Bar
                  data={{
                    labels: interestResults.yearlyBreakdown.map(y => y.year),
                    datasets: [
                      {
                        label: 'Vốn gốc đã nộp',
                        data: interestResults.yearlyBreakdown.map(y => y.totalInvested),
                        backgroundColor: '#475569'
                      },
                      {
                        label: 'Tổng lãi tích lũy',
                        data: interestResults.yearlyBreakdown.map(y => y.interestEarned),
                        backgroundColor: '#10b981'
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { labels: { color: '#cbd5e1', font: { size: 10 } } }
                    },
                    scales: {
                      x: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { display: false } },
                      y: { 
                        ticks: { 
                          color: '#94a3b8', 
                          font: { size: 9 },
                          callback: function(value) {
                            return Math.round(value).toLocaleString('vi-VN') + ' đ';
                          }
                        },
                        grid: { color: 'rgba(71, 85, 105, 0.1)' } 
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Year by year breakdown list */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md">
              <div className="border-b border-slate-800/60 pb-2 mb-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Số liệu qua từng năm</h3>
              </div>
              <div className="max-h-[180px] overflow-y-auto pr-1">
                <div className="flex flex-col gap-2 text-xs font-mono">
                  {interestResults.yearlyBreakdown.map((row) => (
                    <div key={row.year} className="flex items-center justify-between p-2 bg-slate-950/40 border border-slate-900 rounded-lg">
                      <span className="font-bold text-slate-300">{row.year}</span>
                      <div className="flex gap-4">
                        <span>Gốc: <span className="text-slate-400">{row.totalInvested.toLocaleString('vi-VN')} đ</span></span>
                        <span>Lãi: <span className="text-emerald-400">+{row.interestEarned.toLocaleString('vi-VN')} đ</span></span>
                        <span className="font-bold">Tổng: {row.totalBalance.toLocaleString('vi-VN')} đ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
