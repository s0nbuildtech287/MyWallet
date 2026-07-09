import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { LineChart, RefreshCw, ArrowRight, TrendingUp } from 'lucide-react';
import CandlestickChart from '../components/features/chart/CandlestickChart';
import { crosshairPlugin } from '../utils/crosshairPlugin';
import { calculateSMA, calculateBollingerBands, calculateRSI, calculateMACD } from '../utils/indicators';
import SmartAdvisor from '../components/features/advisor/SmartAdvisor';

const RANGE_TOOLTIPS = {
  '1D': 'Dữ liệu 1 ngày gần nhất, nến 5 phút',
  '5D': 'Dữ liệu 5 ngày gần nhất, nến 15 phút',
  '1M': 'Dữ liệu 1 tháng gần nhất, nến 1 ngày',
  '3M': 'Dữ liệu 3 tháng gần nhất, nến 1 ngày',
  '6M': 'Dữ liệu 6 tháng gần nhất, nến 1 ngày',
  '1Y': 'Dữ liệu 1 năm gần nhất, nến 1 ngày',
  '5Y': 'Dữ liệu 5 năm gần nhất, nến 1 tuần',
  'ALL': 'Toàn bộ dữ liệu lịch sử, nến 1 tháng'
};

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

  const [chartType, setChartType] = useState('line'); // 'line' | 'candlestick'
  const [showMA20, setShowMA20] = useState(false);
  const [showMA50, setShowMA50] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [showMACD, setShowMACD] = useState(false);

  // Extract prices for indicators
  const prices = detailData ? detailData.map(d => d.price) : [];
  
  // Calculate indicators dynamically
  const ma20Data = prices.length > 0 ? calculateSMA(prices, 20) : [];
  const ma50Data = prices.length > 0 ? calculateSMA(prices, 50) : [];
  const bbData = prices.length > 0 ? calculateBollingerBands(prices, 20, 2) : { middle: [], upper: [], lower: [] };
  const rsiData = prices.length > 0 ? calculateRSI(prices, 14) : [];
  const macdData = prices.length > 0 ? calculateMACD(prices, 12, 26, 9) : { macdLine: [], signalLine: [], histogram: [] };

  // Latest values for SmartAdvisor
  const latestPrice = prices[prices.length - 1] || 0;
  const latestMa20 = ma20Data[ma20Data.length - 1];
  const latestMa50 = ma50Data[ma50Data.length - 1];
  const latestRsi = rsiData[rsiData.length - 1];
  
  const latestMacd = macdData.macdLine?.length > 0 ? {
    macdLine: macdData.macdLine[macdData.macdLine.length - 1],
    signalLine: macdData.signalLine[macdData.signalLine.length - 1]
  } : null;

  const latestBollinger = bbData.upper?.length > 0 ? {
    upper: bbData.upper[bbData.upper.length - 1],
    middle: bbData.middle[bbData.middle.length - 1],
    lower: bbData.lower[bbData.lower.length - 1]
  } : null;
  const isVndAsset = selectedDetailSymbol.toUpperCase().endsWith('.VN') || 
                     selectedDetailSymbol.toUpperCase().endsWith('.HM') || 
                     selectedDetailSymbol.toUpperCase() === 'USDVND=X';

  const chartDatasets = [
    {
      label: 'Giá thị trường',
      data: prices,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.03)',
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 5,
      fill: true,
      tension: 0.15
    }
  ];

  if (showMA20) {
    chartDatasets.push({
      label: 'MA20',
      data: ma20Data,
      borderColor: '#3b82f6',
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
      tension: 0.15
    });
  }

  if (showMA50) {
    chartDatasets.push({
      label: 'MA50',
      data: ma50Data,
      borderColor: '#f59e0b',
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
      tension: 0.15
    });
  }

  if (showBollinger) {
    chartDatasets.push({
      label: 'BB Upper',
      data: bbData.upper,
      borderColor: '#ec4899',
      backgroundColor: 'transparent',
      borderWidth: 1.2,
      borderDash: [3, 3],
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
      tension: 0.15
    });
    chartDatasets.push({
      label: 'BB Middle (MA20)',
      data: bbData.middle,
      borderColor: '#8b5cf6',
      backgroundColor: 'transparent',
      borderWidth: 1,
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
      tension: 0.15
    });
    chartDatasets.push({
      label: 'BB Lower',
      data: bbData.lower,
      borderColor: '#ec4899',
      backgroundColor: 'transparent',
      borderWidth: 1.2,
      borderDash: [3, 3],
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
      tension: 0.15
    });
  }

  return (
    <div className="flex flex-col gap-6 text-slate-100 pb-10 animate-fadeIn">
      {/* Detail Chart Section */}
      <section className="bg-slate-900/40 border border-slate-700/25 rounded-2xl p-5 backdrop-blur-lg flex flex-col gap-5 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/20 pb-4">
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-200">Biểu đồ kỹ thuật chi tiết: {selectedDetailSymbol}</h3>
              <p className="text-[10px] text-slate-500 font-mono">Dữ liệu đóng cửa hàng ngày</p>
            </div>
          </div>

          {/* Controls Container */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Chart Type Toggle */}
            <div className="flex bg-slate-950/60 p-0.5 rounded-lg border border-slate-700/25">
              <button
                type="button"
                onClick={() => setChartType('line')}
                className={`text-[9px] font-bold py-1 px-2.5 rounded-md transition-all cursor-pointer ${
                  chartType === 'line'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Đường
              </button>
              <button
                type="button"
                onClick={() => setChartType('candlestick')}
                className={`text-[9px] font-bold py-1 px-2.5 rounded-md transition-all cursor-pointer ${
                  chartType === 'candlestick'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Nến Nhật
              </button>
            </div>

            <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

            {/* Range selectors */}
            <div className="flex gap-1.5">
              {['1D', '5D', '1M', '3M', '6M', '1Y', '5Y', 'ALL'].map((rng) => (
                <div key={rng} className="group relative">
                  <button
                    onClick={() => setDetailRange(rng)}
                    className={`text-[9px] font-semibold py-1 px-2.5 rounded-lg border transition-all cursor-pointer ${
                      detailRange === rng 
                        ? 'bg-slate-850 border-slate-700 text-emerald-400 font-bold shadow-md' 
                        : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {rng}
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 border border-slate-700/25 text-[9px] text-slate-300 py-1.5 px-2.5 rounded-md whitespace-nowrap shadow-xl z-50 pointer-events-none font-normal">
                    {RANGE_TOOLTIPS[rng]}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Indicator Toggles */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center bg-slate-950/30 border border-slate-700/15 rounded-xl p-3 text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Chỉ báo kỹ thuật:</span>
          
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showMA20}
              onChange={(e) => setShowMA20(e.target.checked)}
              className="accent-emerald-500 rounded border-slate-700/25 bg-slate-950 h-3.5 w-3.5"
            />
            <span className="font-medium">Đường MA20</span>
          </label>
          
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showMA50}
              onChange={(e) => setShowMA50(e.target.checked)}
              className="accent-emerald-500 rounded border-slate-700/25 bg-slate-950 h-3.5 w-3.5"
            />
            <span className="font-medium">Đường MA50</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showBollinger}
              onChange={(e) => setShowBollinger(e.target.checked)}
              className="accent-emerald-500 rounded border-slate-700/25 bg-slate-950 h-3.5 w-3.5"
            />
            <span className="font-medium">Dải Bollinger</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showRSI}
              onChange={(e) => setShowRSI(e.target.checked)}
              className="accent-emerald-500 rounded border-slate-700/25 bg-slate-950 h-3.5 w-3.5"
            />
            <span className="font-medium">Chỉ báo RSI</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showMACD}
              onChange={(e) => setShowMACD(e.target.checked)}
              className="accent-emerald-500 rounded border-slate-700/25 bg-slate-950 h-3.5 w-3.5"
            />
            <span className="font-medium">Chỉ báo MACD</span>
          </label>
        </div>

        {/* Technical Stats Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-950/40 border border-slate-700/15 rounded-xl text-xs font-mono">
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

        {/* Big Chart & Volume Chart Grid */}
        <div className="flex flex-col gap-6 mt-2">
          {detailLoading ? (
            <div className="h-[320px] flex items-center justify-center bg-slate-950/20 rounded-xl border border-slate-700/10">
              <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
            </div>
          ) : detailData && detailData.length > 0 ? (
            chartType === 'candlestick' ? (
              <CandlestickChart data={detailData} isVndAsset={isVndAsset} />
            ) : (
              <>
              {/* Price Line Chart */}
              <div className="h-[240px] relative w-full">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Xu hướng giá đóng cửa</span>
                <Line
                  key={`detail-chart-${selectedDetailSymbol}-${detailRange}`}
                  data={{
                    labels: detailData.map(d => d.date),
                    datasets: chartDatasets
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f8fafc',
                        bodyColor: '#f1f5f9',
                        callbacks: {
                          label: function (context) {
                            const label = context.dataset.label || '';
                            if (label === 'Giá thị trường') {
                              return `Giá: ` + formatValSymbol(context.parsed.y, selectedDetailSymbol);
                            }
                            return `${label}: ` + formatValSymbol(context.parsed.y, selectedDetailSymbol);
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
                  plugins={[crosshairPlugin]}
                />
              </div>

              {/* Volume Bar Chart */}
              <div className="h-[120px] relative w-full border-t border-slate-800/40 pt-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Khối lượng giao dịch (Volume)</span>
                <Bar
                  key={`detail-volume-${selectedDetailSymbol}-${detailRange}`}
                  data={{
                    labels: detailData.map(d => d.date),
                    datasets: [
                      {
                        label: 'Khối lượng giao dịch',
                        data: detailData.map(d => d.volume),
                        backgroundColor: '#3b82f6',
                        borderColor: '#2563eb',
                        borderWidth: 1,
                        barPercentage: 0.8,
                        categoryPercentage: 0.9,
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
                            const val = context.parsed.y;
                            if (val >= 1_000_000_000) return `KL: ${(val / 1_000_000_000).toFixed(2)}B`;
                            if (val >= 1_000_000) return `KL: ${(val / 1_000_000).toFixed(2)}M`;
                            if (val >= 1_000) return `KL: ${(val / 1_000).toFixed(2)}K`;
                            return `KL: ` + val.toLocaleString();
                          }
                        }
                      }
                    },
                    scales: {
                      x: { ticks: { display: false }, grid: { display: false } },
                      y: { 
                        ticks: { 
                          color: '#64748b', 
                          font: { size: 8 },
                          callback: function(value) {
                            if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B';
                            if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
                            if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K';
                            return value;
                          }
                        },
                        grid: { color: 'rgba(71, 85, 105, 0.05)' } 
                      }
                    }
                  }}
                />
              </div>

              {/* RSI Sub-chart */}
              {showRSI && rsiData.length > 0 && (
                <div className="h-[120px] relative w-full border-t border-slate-800/40 pt-3 animate-fadeIn">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Chỉ số sức mạnh tương đối (RSI 14)</span>
                    <span className={`text-[10px] font-mono font-bold ${latestRsi >= 70 ? 'text-rose-400' : latestRsi <= 30 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      Hiện tại: {latestRsi?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                  <Line
                    key={`rsi-chart-${selectedDetailSymbol}-${detailRange}`}
                    data={{
                      labels: detailData.map(d => d.date),
                      datasets: [
                        {
                          label: 'RSI',
                          data: rsiData,
                          borderColor: '#a855f7',
                          backgroundColor: 'rgba(168, 85, 247, 0.05)',
                          borderWidth: 1.5,
                          pointRadius: 0,
                          pointHoverRadius: 4,
                          fill: true,
                          tension: 0.15
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: { mode: 'index', intersect: false },
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: '#1e293b',
                          titleColor: '#f8fafc',
                          bodyColor: '#f1f5f9',
                          callbacks: {
                            label: function (context) {
                              return `RSI: ${context.parsed.y.toFixed(2)}`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: { ticks: { display: false }, grid: { display: false } },
                        y: {
                          min: 0,
                          max: 100,
                          ticks: {
                            color: '#64748b',
                            font: { size: 8 },
                            stepSize: 20
                          },
                          grid: {
                            color: (context) => {
                              if (context.tick.value === 30 || context.tick.value === 70) {
                                return 'rgba(239, 68, 68, 0.25)';
                              }
                              return 'rgba(71, 85, 105, 0.05)';
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              )}

              {/* MACD Sub-chart */}
              {showMACD && macdData.macdLine?.length > 0 && (
                <div className="h-[120px] relative w-full border-t border-slate-800/40 pt-3 animate-fadeIn">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Chỉ báo MACD (12, 26, 9)</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      MACD: <span className="text-[#3b82f6] font-bold">{latestMacd?.macdLine?.toFixed(2) || 'N/A'}</span> | Tín hiệu: <span className="text-[#f59e0b] font-bold">{latestMacd?.signalLine?.toFixed(2) || 'N/A'}</span>
                    </span>
                  </div>
                  <Bar
                    key={`macd-chart-${selectedDetailSymbol}-${detailRange}`}
                    data={{
                      labels: detailData.map(d => d.date),
                      datasets: [
                        {
                          type: 'bar',
                          label: 'Histogram',
                          data: macdData.histogram,
                          backgroundColor: macdData.histogram.map(v => v >= 0 ? 'rgba(16, 185, 129, 0.45)' : 'rgba(239, 68, 68, 0.45)'),
                          borderColor: macdData.histogram.map(v => v >= 0 ? '#10b981' : '#ef4444'),
                          borderWidth: 0.8,
                          barPercentage: 0.8,
                        },
                        {
                          type: 'line',
                          label: 'MACD',
                          data: macdData.macdLine,
                          borderColor: '#3b82f6',
                          borderWidth: 1.2,
                          pointRadius: 0,
                          fill: false,
                          tension: 0.15
                        },
                        {
                          type: 'line',
                          label: 'Signal',
                          data: macdData.signalLine,
                          borderColor: '#f59e0b',
                          borderWidth: 1.2,
                          pointRadius: 0,
                          fill: false,
                          tension: 0.15
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: { mode: 'index', intersect: false },
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: '#1e293b',
                          titleColor: '#f8fafc',
                          bodyColor: '#f1f5f9',
                          callbacks: {
                            label: function (context) {
                              return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: { ticks: { display: false }, grid: { display: false } },
                        y: {
                          ticks: { color: '#64748b', font: { size: 8 } },
                          grid: { color: 'rgba(71, 85, 105, 0.05)' }
                        }
                      }
                    }}
                  />
                </div>
              )}
            </>
            )
          ) : (
            <div className="h-[320px] flex items-center justify-center text-slate-500 font-semibold border border-slate-700/10 rounded-xl">
              Không thể tải biểu đồ lịch sử của mã này.
            </div>
          )}
        </div>

        {/* Smart Advisor Recommendation Widget */}
        {detailData && detailData.length > 0 && !detailLoading && (
          <div className="mt-2">
            <SmartAdvisor
              symbol={selectedDetailSymbol}
              currentPrice={latestPrice}
              ma20={latestMa20}
              ma50={latestMa50}
              rsi={latestRsi}
              macd={latestMacd}
              bollinger={latestBollinger}
              isVnd={isVndAsset}
            />
          </div>
        )}

        <div className="flex gap-2 justify-end border-t border-slate-700/20 pt-4 mt-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className="px-4 py-2 bg-slate-950/60 hover:bg-slate-900 border border-slate-700/25 text-slate-400 hover:text-slate-200 text-xs rounded-xl transition-all cursor-pointer"
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
