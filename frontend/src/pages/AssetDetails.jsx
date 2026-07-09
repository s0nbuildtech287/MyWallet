import React from 'react';
import { Line } from 'react-chartjs-2';
import { LineChart, RefreshCw, ArrowRight } from 'lucide-react';

export default function AssetDetails({
  selectedDetailSymbol,
  detailRange,
  setDetailRange,
  detailData,
  detailLoading,
  formatValSymbol,
  setActiveTab,
  handleQuickSimulation,
  marketAssets
}) {
  const targetAsset = marketAssets.find(a => a.symbol === selectedDetailSymbol) || { 
    name: 'Tài sản', 
    details: { pe: 'N/A', high52: 'N/A', low52: 'N/A', volume: 'N/A' } 
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-lg flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/60 pb-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-xl border border-slate-700 text-emerald-400">
              <LineChart className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Biểu đồ kỹ thuật chi tiết: {selectedDetailSymbol}</h3>
              <p className="text-[10px] text-slate-500 font-mono">Dữ liệu đóng cửa hàng ngày</p>
            </div>
          </div>

          {/* Range selectors */}
          <div className="flex gap-1">
            {['1M', '6M', '1Y', '5Y'].map((rng) => (
              <button
                key={rng}
                onClick={() => setDetailRange(rng)}
                className={`text-[9px] font-semibold py-1 px-3.5 rounded-lg border transition-all ${
                  detailRange === rng 
                    ? 'bg-slate-850 border-slate-700 text-emerald-400' 
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {rng}
              </button>
            ))}
          </div>
        </div>

        {/* Technical Stats Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-950/40 border border-slate-850 rounded-xl text-xs font-mono">
          <div className="flex flex-col gap-1">
            <span className="text-slate-500">Tên tài sản</span>
            <span className="text-slate-200 font-bold">{targetAsset.name}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-500">Volume giao dịch</span>
            <span className="text-slate-200 font-bold">{targetAsset.details.volume}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-500">Cao nhất 52 tuần</span>
            <span className="text-slate-200 font-bold">{targetAsset.details.high52}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-500">Thấp nhất 52 tuần</span>
            <span className="text-slate-200 font-bold">{targetAsset.details.low52}</span>
          </div>
        </div>

        {/* Big Chart */}
        <div className="h-[320px] relative w-full mt-2">
          {detailLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
              <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
            </div>
          ) : detailData && detailData.length > 0 ? (
            <Line
              data={{
                labels: detailData.map(d => d.date),
                datasets: [
                  {
                    label: 'Giá thị trường',
                    data: detailData.map(d => d.price),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.03)',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    fill: true,
                    tension: 0.15
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f8fafc',
                    bodyColor: '#f1f5f9',
                    callbacks: {
                      label: function (context) {
                        return `Giá: ` + formatValSymbol(context.parsed.y, selectedDetailSymbol);
                      }
                    }
                  }
                },
                scales: {
                  x: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { display: false } },
                  y: { 
                    ticks: { 
                      color: '#94a3b8', 
                      font: { size: 9 },
                      callback: function(value) {
                        return formatValSymbol(value, selectedDetailSymbol);
                      }
                    },
                    grid: { color: 'rgba(71, 85, 105, 0.1)' } 
                  }
                }
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-semibold">
              Không thể tải biểu đồ lịch sử của mã này.
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end border-t border-slate-800/60 pt-4 mt-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className="px-4 py-2 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs rounded-xl transition-all cursor-pointer"
          >
            Quay lại thị trường
          </button>
          <button 
            onClick={() => handleQuickSimulation(selectedDetailSymbol)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
          >
            <span>Mở giả lập tích sản</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
