import React from 'react';
import { Bar } from 'react-chartjs-2';
import ConfigPanel from '../components/features/interest/ConfigPanel';
import ResultsKPIs from '../components/features/interest/ResultsKPIs';

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
      {/* Config Panel */}
      <ConfigPanel
        interestInit={interestInit}
        setInterestInit={setInterestInit}
        interestMonthly={interestMonthly}
        setInterestMonthly={setInterestMonthly}
        interestRate={interestRate}
        setInterestRate={setInterestRate}
        interestYears={interestYears}
        setInterestYears={setInterestYears}
      />

      {/* Results visual */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {interestResults && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <ResultsKPIs interestResults={interestResults} />

            {/* Chart visual */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col gap-4">
              <div className="border-b border-slate-800/60 pb-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Biểu đồ tăng trưởng lãi kép theo năm</h3>
              </div>
              <div className="h-[250px]">
                <Bar
                  key={`interest-chart-${interestInit}-${interestMonthly}-${interestRate}-${interestYears}`}
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
                      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 9 } } },
                      y: {
                        grid: { color: 'rgba(71, 85, 105, 0.1)' },
                        ticks: {
                          color: '#94a3b8',
                          font: { size: 9 },
                          callback: function (value) {
                            return value.toLocaleString('vi-VN') + ' VNĐ';
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
