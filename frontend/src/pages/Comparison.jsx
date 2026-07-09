import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Scale, Plus, X, TrendingUp, RefreshCw, AlertCircle, 
  Calendar, ArrowUpRight, ArrowDownRight, Sparkles, Calculator 
} from 'lucide-react';
import { MARKET_ASSETS } from '../constants';
import { formatVal } from '../utils/formatters';
import { crosshairPlugin } from '../utils/crosshairPlugin';

const PRESETS = [
  {
    name: 'Cổ phiếu Bluechip VN',
    symbols: ['FPT.VN', 'HPG.VN', 'VCB.VN'],
    description: 'FPT, Hòa Phát & Vietcombank'
  },
  {
    name: 'Tài sản trú ẩn & Tăng trưởng',
    symbols: ['GC=F', 'BTC-USD', 'AAPL'],
    description: 'Vàng Thế giới, Bitcoin & Apple'
  },
  {
    name: 'Chỉ số vĩ mô toàn cầu',
    symbols: ['^VNINDEX', '^GSPC', '^N225'],
    description: 'VN-Index, S&P 500 & Nikkei 225'
  },
  {
    name: 'Hàng hóa & Năng lượng',
    symbols: ['CL=F', 'SI=F', 'GC=F'],
    description: 'Dầu thô, Bạc & Vàng'
  },
  {
    name: 'Nhóm Ngân hàng VN',
    symbols: ['VCB.VN', 'TCB.VN', 'MBB.VN'],
    description: 'Vietcombank, Techcombank & MBBank'
  }
];

const RANGE_TOOLTIPS = {
  '1M': 'Dữ liệu 1 tháng gần nhất, nến 1 ngày',
  '3M': 'Dữ liệu 3 tháng gần nhất, nến 1 ngày',
  '6M': 'Dữ liệu 6 tháng gần nhất, nến 1 ngày',
  '1Y': 'Dữ liệu 1 năm gần nhất, nến 1 ngày',
  '5Y': 'Dữ liệu 5 năm gần nhất, nến 1 tuần',
  'ALL': 'Toàn bộ dữ liệu lịch sử, nến 1 tháng'
};

export default function Comparison({ marketPrices, formatValSymbol, setActiveTab, handleQuickSimulation }) {
  const [selectedSymbols, setSelectedSymbols] = useState(['FPT.VN', 'HPG.VN', 'GC=F']);
  const [range, setRange] = useState('1Y'); // '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL'
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartDataState, setChartDataState] = useState(null);
  const [stats, setStats] = useState([]);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch chart data when symbols or range changes
  useEffect(() => {
    if (selectedSymbols.length === 0) {
      setChartDataState(null);
      setStats([]);
      return;
    }
    fetchAllCharts();
  }, [selectedSymbols, range]);

  const fetchAllCharts = async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = selectedSymbols.map(async (sym) => {
        let queryRange = '1y';
        let queryInterval = '1d';
        if (range === '1M') { queryRange = '1mo'; queryInterval = '1d'; }
        else if (range === '3M') { queryRange = '3mo'; queryInterval = '1d'; }
        else if (range === '6M') { queryRange = '6mo'; queryInterval = '1d'; }
        else if (range === '1Y') { queryRange = '1y'; queryInterval = '1d'; }
        else if (range === '5Y') { queryRange = '5y'; queryInterval = '1wk'; }
        else if (range === 'ALL') { queryRange = 'max'; queryInterval = '1mo'; }

        const res = await fetch(`http://localhost:5001/api/chart?symbol=${sym.toUpperCase()}&range=${queryRange}&interval=${queryInterval}`);
        if (!res.ok) throw new Error(`HTTP ${res.status} cho mã "${sym}"`);
        const data = await res.json();

        if (data.error) throw new Error(data.error);
        if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
          throw new Error(`Mã tài sản "${sym}" không khả dụng hoặc Yahoo Finance trả về rỗng.`);
        }

        const result = data.chart.result[0];
        if (!result) throw new Error(`Không có dữ liệu cho mã "${sym}".`);

        const timestamps = result.timestamp || [];
        const closes = result.indicators?.quote?.[0]?.close || [];

        const points = [];
        for (let i = 0; i < timestamps.length; i++) {
          if (timestamps[i] && closes[i] !== null && closes[i] !== undefined) {
            // Format to simple date YYYY-MM-DD
            const dateStr = new Date(timestamps[i] * 1000).toISOString().split('T')[0];
            points.push({ date: dateStr, price: closes[i] });
          }
        }
        return { symbol: sym, points };
      });

      // Dùng allSettled để một mã lỗi không làm sập các mã còn lại
      const settled = await Promise.allSettled(promises);
      const successResults = [];
      const failedSymbols = [];

      settled.forEach((outcome, idx) => {
        if (outcome.status === 'fulfilled') {
          successResults.push(outcome.value);
        } else {
          failedSymbols.push(selectedSymbols[idx]);
          console.warn(`Không thể tải dữ liệu cho ${selectedSymbols[idx]}:`, outcome.reason?.message);
        }
      });

      if (failedSymbols.length > 0) {
        setError(`Không tải được dữ liệu cho: ${failedSymbols.join(', ')}. Vui lòng thử lại sau hoặc kiểm tra backend.`);
      }

      if (successResults.length > 0) {
        processChartData(successResults);
      } else {
        setChartDataState(null);
        setStats([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Lỗi kết nối. Hãy chắc chắn backend đang chạy tại cổng 5001.');
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (fetchedData) => {
    // 1. Gather all unique dates across all compared assets
    const allDatesSet = new Set();
    fetchedData.forEach(item => {
      item.points.forEach(pt => allDatesSet.add(pt.date));
    });
    const sortedDates = Array.from(allDatesSet).sort();

    if (sortedDates.length === 0) {
      setChartDataState(null);
      setStats([]);
      return;
    }

    // 2. Align timeline and fill forward missing data
    const datasets = fetchedData.map((item, idx) => {
      const pointsMap = new Map(item.points.map(pt => [pt.date, pt.price]));
      const symbol = item.symbol;
      const name = MARKET_ASSETS.find(a => a.symbol.toUpperCase() === symbol.toUpperCase())?.name || symbol;

      // Find initial base price (first non-null price in chronological order)
      let p0 = null;
      for (let date of sortedDates) {
        const price = pointsMap.get(date);
        if (price !== undefined && price !== null) {
          p0 = price;
          break;
        }
      }

      let lastKnownPrice = p0;
      const dataSeries = [];

      sortedDates.forEach(date => {
        let price = pointsMap.get(date);
        if (price === undefined || price === null) {
          price = lastKnownPrice; // forward-fill (carry forward last price on closed days)
        } else {
          lastKnownPrice = price;
        }

        if (p0 !== null && p0 > 0 && price !== null) {
          const perf = ((price - p0) / p0) * 100;
          dataSeries.push(parseFloat(perf.toFixed(2)));
        } else {
          dataSeries.push(0);
        }
      });

      // Distinct styling color for each asset line
      const colors = [
        '#10b981', // emerald
        '#38bdf8', // sky
        '#fbbf24', // amber
        '#a78bfa', // violet
        '#f472b6', // pink
        '#f87171', // red
        '#60a5fa'  // blue
      ];
      const color = colors[idx % colors.length];

      return {
        label: `${symbol} (${name})`,
        data: dataSeries,
        borderColor: color,
        backgroundColor: `${color}10`,
        borderWidth: 2.5,
        pointRadius: sortedDates.length > 80 ? 0 : 2,
        pointHoverRadius: 6,
        tension: 0.15,
        fill: false
      };
    });

    setChartDataState({
      labels: sortedDates.map(d => {
        // Format to DD/MM/YYYY for cleaner display
        const parts = d.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }),
      datasets
    });

    // 3. Calculate statistics for the table
    const newStats = fetchedData.map(item => {
      const points = item.points;
      const symbol = item.symbol;
      const name = MARKET_ASSETS.find(a => a.symbol.toUpperCase() === symbol.toUpperCase())?.name || symbol;
      
      if (points.length === 0) {
        return { symbol, name, startPrice: 0, currentPrice: 0, minPerf: 0, maxPerf: 0, finalPerf: 0, isVnd: false };
      }

      const p0 = points[0].price;
      const currentPrice = points[points.length - 1].price;
      const finalPerf = ((currentPrice - p0) / p0) * 100;

      const perfs = points.map(pt => ((pt.price - p0) / p0) * 100);
      const minPerf = Math.min(...perfs);
      const maxPerf = Math.max(...perfs);

      const isVnd = symbol.toUpperCase().endsWith('.VN') || 
                    symbol.toUpperCase().endsWith('.HM') || 
                    symbol.toUpperCase() === 'USDVND=X';

      return {
        symbol,
        name,
        startPrice: p0,
        currentPrice,
        minPerf,
        maxPerf,
        finalPerf,
        isVnd
      };
    });

    setStats(newStats);
  };

  // Add symbol to comparison list
  const handleAddSymbol = (sym) => {
    const symUpper = sym.toUpperCase().trim();
    if (!symUpper) return;
    if (selectedSymbols.includes(symUpper)) {
      setSearchQuery('');
      setShowDropdown(false);
      return;
    }
    if (selectedSymbols.length >= 7) {
      alert('Bạn chỉ có thể so sánh tối đa 7 tài sản cùng một lúc để đồ thị rõ nhìn nhất.');
      return;
    }
    setSelectedSymbols([...selectedSymbols, symUpper]);
    setSearchQuery('');
    setShowDropdown(false);
  };

  // Remove symbol
  const handleRemoveSymbol = (sym) => {
    setSelectedSymbols(selectedSymbols.filter(s => s !== sym));
  };

  // Apply preset scenario
  const handleApplyPreset = (symbols) => {
    setSelectedSymbols(symbols);
  };

  // Filter recommendations matching input search
  const filteredSuggestions = MARKET_ASSETS.filter(asset => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return false;
    return (
      asset.symbol.toLowerCase().includes(q) ||
      asset.name.toLowerCase().includes(q)
    );
  });

  // Chart configuration options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { size: 11, family: 'Inter', weight: '600' },
          padding: 15
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        padding: 12,
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#cbd5e1',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label.split(' (')[0] || '';
            let val = context.raw;
            return `  ${label}: ${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(71, 85, 105, 0.08)' },
        ticks: { color: '#64748b', font: { size: 9 } }
      },
      y: {
        grid: { color: 'rgba(71, 85, 105, 0.15)' },
        ticks: { 
          color: '#94a3b8', 
          font: { size: 10 },
          callback: function(value) {
            return `${value >= 0 ? '+' : ''}${value}%`;
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-slate-100 pb-10 animate-fadeIn">
      
      {/* LEFT COLUMN: Controls & Presets */}
      <div className="w-full lg:w-1/4 flex flex-col gap-6">
        
        {/* Control Box */}
        <div className="bg-slate-900/40 border border-slate-700/25 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-700/20 pb-3">
            <Scale className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Cấu hình so sánh</h3>
          </div>

          {/* Search Box */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thêm tài sản</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập mã (FPT.VN, BTC-USD...)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="flex-1 bg-slate-950/80 border border-slate-700/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 font-semibold"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSymbol(searchQuery);
                  }
                }}
              />
              <button
                onClick={() => handleAddSymbol(searchQuery)}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer transition-all"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Recommendations Dropdown */}
            {showDropdown && searchQuery.trim() !== '' && (
              <div className="absolute top-full left-0 w-full bg-slate-900 border border-slate-700/25 rounded-xl mt-1 shadow-2xl z-50 max-h-56 overflow-y-auto">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((asset) => (
                    <button
                      key={asset.symbol}
                      onClick={() => handleAddSymbol(asset.symbol)}
                      className="w-full text-left px-4 py-2 hover:bg-slate-800/80 text-xs flex justify-between items-center border-b border-slate-700/25 last:border-0 transition-colors"
                    >
                      <span className="font-bold text-slate-200">{asset.symbol}</span>
                      <span className="text-slate-400 text-[10px] truncate max-w-[150px]">{asset.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-[10px] text-slate-500 text-center">
                    Bấm <kbd className="bg-slate-800 px-1 rounded text-slate-400 font-mono">Enter</kbd> hoặc nút cộng để thêm mã tùy chỉnh này.
                  </div>
                )}
              </div>
            )}
            
            {showDropdown && searchQuery.trim() !== '' && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowDropdown(false)}
              />
            )}
          </div>

          {/* Active Badges */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Tài sản đang chọn ({selectedSymbols.length})
            </label>
            {selectedSymbols.length === 0 ? (
              <div className="text-[10px] text-slate-500 italic bg-slate-950/20 border border-dashed border-slate-700/15 p-3 rounded-xl text-center">
                Chưa chọn tài sản nào. Vui lòng thêm hoặc chọn kịch bản gợi ý bên dưới.
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                {selectedSymbols.map((sym, idx) => {
                  const colors = [
                    'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
                    'border-sky-500/30 bg-sky-500/5 text-sky-400',
                    'border-amber-500/30 bg-amber-500/5 text-amber-350',
                    'border-violet-500/30 bg-violet-500/5 text-violet-400',
                    'border-pink-500/30 bg-pink-500/5 text-pink-400',
                    'border-rose-500/30 bg-rose-500/5 text-rose-450',
                    'border-blue-500/30 bg-blue-500/5 text-blue-400'
                  ];
                  const colorClass = colors[idx % colors.length];

                  return (
                    <span 
                      key={sym} 
                      className={`inline-flex items-center gap-1 text-[10px] font-bold py-1 px-2.5 rounded-lg border font-mono ${colorClass}`}
                    >
                      {sym}
                      <button 
                        onClick={() => handleRemoveSymbol(sym)}
                        className="hover:bg-slate-800/80 rounded p-0.5 transition-colors cursor-pointer"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Suggestion Presets */}
        <div className="bg-slate-900/40 border border-slate-700/25 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-1.5 border-b border-slate-700/20 pb-3">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Kịch bản gợi ý nhanh</h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {PRESETS.map((p) => {
              const isMatch = selectedSymbols.length === p.symbols.length && 
                              p.symbols.every(s => selectedSymbols.includes(s));
              return (
                <button
                  key={p.name}
                  onClick={() => handleApplyPreset(p.symbols)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                    isMatch 
                      ? 'bg-slate-800 border-slate-700 font-semibold shadow' 
                      : 'bg-slate-950/20 border-slate-700/15 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="font-bold text-slate-200">{p.name}</div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">{p.description}</div>
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {p.symbols.map(s => (
                      <span key={s} className="text-[8px] font-mono bg-slate-900 border border-slate-700/25 text-slate-400 py-0.5 px-1.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Biểu đồ & Thống kê */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Header & Range Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-400" />
              Công cụ So sánh Hiệu suất Tài sản
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Phân tích và đối chiếu tương quan tốc độ tăng trưởng phần trăm của nhiều lớp tài sản khác nhau.
            </p>
          </div>

          {/* Range Selector */}
          <div className="flex gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-700/25 self-start sm:self-center">
            {['1M', '3M', '6M', '1Y', '5Y', 'ALL'].map((rng) => (
              <div key={rng} className="group relative">
                <button
                  onClick={() => setRange(rng)}
                  className={`text-[10px] font-semibold py-1 px-3 rounded-md transition-all cursor-pointer ${
                    range === rng 
                      ? 'bg-slate-800 text-emerald-400 font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {rng}
                </button>
                {/* Range Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 border border-slate-700/25 text-[9px] text-slate-350 py-1 px-2 rounded whitespace-nowrap shadow-xl z-50 font-normal">
                  {RANGE_TOOLTIPS[rng]}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Big Chart Box */}
        <div className="bg-slate-900/40 border border-slate-700/25 rounded-2xl p-5 shadow-2xl backdrop-blur-lg flex flex-col gap-4 relative min-h-[420px]">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs flex items-center gap-3">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Empty / Zero selection state */}
          {selectedSymbols.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-slate-500">
              <Scale className="h-10 w-10 text-slate-700 animate-pulse" />
              <div className="text-xs">Vui lòng chọn ít nhất 1 tài sản để xem đồ thị so sánh hiệu suất.</div>
            </div>
          )}

          {/* Loading status */}
          {loading && (
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3 z-20">
              <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
              <p className="text-xs text-slate-400 font-semibold">Đang truy vấn lịch sử tỷ giá và đồng bộ dữ liệu thời gian...</p>
            </div>
          )}

          {/* Line Chart */}
          {chartDataState && selectedSymbols.length > 0 && (
            <div className="flex-1 min-h-[300px] h-[340px] relative">
              <Line data={chartDataState} options={chartOptions} plugins={[crosshairPlugin]} />
            </div>
          )}
          
          <div className="text-[10px] text-slate-500 flex items-center gap-1.5 border-t border-slate-700/15 pt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Mẹo: Tất cả các đường tăng trưởng đều tự động điều chỉnh xuất phát tại điểm mốc <b>0%</b> từ ngày đầu tiên của khoảng thời gian được chọn để dễ dàng so sánh tỷ lệ sinh lời.</span>
          </div>
        </div>

        {/* Thống kê Chi tiết bảng */}
        {selectedSymbols.length > 0 && stats.length > 0 && (
          <div className="bg-slate-900/40 border border-slate-700/25 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/20 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider">Thống kê hiệu suất chi tiết</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/15 text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-950/20">
                    <th className="py-3 px-4">Tài sản</th>
                    <th className="py-3 px-4">Giá bắt đầu</th>
                    <th className="py-3 px-4">Giá cuối kỳ</th>
                    <th className="py-3 px-4">Biến động Min (%)</th>
                    <th className="py-3 px-4">Biến động Max (%)</th>
                    <th className="py-3 px-4">Lợi nhuận cuối kỳ</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 font-mono">
                  {stats.map((row, idx) => {
                    const colors = [
                      'text-emerald-400',
                      'text-sky-400',
                      'text-amber-400',
                      'text-violet-400',
                      'text-pink-400',
                      'text-rose-450',
                      'text-blue-450'
                    ];
                    const textColor = colors[idx % colors.length];
                    const symbolStyle = `font-bold ${textColor}`;

                    return (
                      <tr key={row.symbol} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-3 px-4 text-left">
                          <span className={symbolStyle}>{row.symbol}</span>
                          <span className="block text-[10px] text-slate-400 font-sans mt-0.5">{row.name}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {formatVal(row.startPrice, row.isVnd, false)}
                        </td>
                        <td className="py-3 px-4 text-slate-200 font-bold">
                          {formatVal(row.currentPrice, row.isVnd, false)}
                        </td>
                        <td className="py-3 px-4 text-rose-400">
                          {row.minPerf >= 0 ? '+' : ''}{row.minPerf.toFixed(2)}%
                        </td>
                        <td className="py-3 px-4 text-emerald-400">
                          {row.maxPerf >= 0 ? '+' : ''}{row.maxPerf.toFixed(2)}%
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-0.5 font-bold py-0.5 px-2 rounded-lg ${
                            row.finalPerf >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {row.finalPerf >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {row.finalPerf >= 0 ? '+' : ''}{row.finalPerf.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              // Direct action to jump to Simulator and load this asset
                              handleQuickSimulation(row.symbol, row.isVnd);
                            }}
                            className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 hover:text-emerald-400 border border-slate-700 text-slate-300 py-1 px-3 rounded-lg text-[10px] font-sans font-semibold cursor-pointer transition-all"
                          >
                            <Calculator className="h-3 w-3" />
                            Giả lập tích sản
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
