import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  DollarSign, 
  Percent, 
  Activity,
  History,
  Info,
  Layers,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Popular presets
const PRESET_SYMBOLS = [
  { label: 'Bitcoin (BTC)', value: 'BTC-USD', isVnd: false },
  { label: 'Vàng Thế Giới', value: 'GC=F', isVnd: false },
  { label: 'FPT (HoSE)', value: 'FPT.VN', isVnd: true },
  { label: 'Hòa Phát (HPG)', value: 'HPG.VN', isVnd: true },
  { label: 'VinGroup (VIC)', value: 'VIC.VN', isVnd: true },
  { label: 'Vietcombank (VCB)', value: 'VCB.VN', isVnd: true },
  { label: 'Apple (AAPL)', value: 'AAPL', isVnd: false },
  { label: 'Tesla (TSLA)', value: 'TSLA', isVnd: false }
];

export default function App() {
  // Input states
  const [symbol, setSymbol] = useState('BTC-USD');
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [investMode, setInvestMode] = useState('dca-qty'); // 'lump-sum', 'dca-amount', 'dca-qty'
  const [inputValue, setInputValue] = useState('100'); // stores investment money amount or share quantity

  // UI & Data states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  // Table pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const isVndAsset = symbol.toUpperCase().endsWith('.VN');

  // Set default values when investment mode or symbol changes
  useEffect(() => {
    if (investMode === 'dca-qty') {
      setInputValue(isVndAsset ? '100' : '10');
    } else {
      setInputValue(isVndAsset ? '1000000' : '100');
    }
  }, [investMode, symbol]);

  const handlePresetClick = (preset) => {
    setSymbol(preset.value);
  };

  // Helper formatting function
  const formatVal = (val, roundInt = false) => {
    if (isVndAsset) {
      return Math.round(val).toLocaleString('vi-VN') + ' đ';
    }
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: roundInt ? 0 : 2,
      maximumFractionDigits: roundInt ? 0 : 2
    });
  };

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    const p1 = Math.floor(new Date(startDate).getTime() / 1000);
    const p2 = Math.floor(new Date(endDate).getTime() / 1000);
    
    if (isNaN(p1) || isNaN(p2) || p1 >= p2) {
      setError('Thời gian bắt đầu phải trước thời gian kết thúc.');
      setLoading(false);
      return;
    }

    try {
      // Fetch via backend proxy
      const response = await fetch(`http://localhost:5001/api/chart?symbol=${symbol.toUpperCase()}&period1=${p1}&period2=${p2}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        throw new Error('Không có dữ liệu hợp lệ cho mã tài sản này.');
      }

      const result = data.chart.result[0];
      const timestamps = result.timestamp || [];
      const closes = result.indicators.quote[0].close || [];

      // Map clean price array
      const dailyPrices = [];
      for (let i = 0; i < timestamps.length; i++) {
        if (timestamps[i] && closes[i] !== null && closes[i] !== undefined) {
          dailyPrices.push({
            date: new Date(timestamps[i] * 1000),
            close: closes[i]
          });
        }
      }

      if (dailyPrices.length === 0) {
        throw new Error('Không có dữ liệu giá đóng cửa trong khoảng thời gian này.');
      }

      // Simulation math
      let totalInvested = 0;
      let totalShares = 0;
      const purchases = [];
      const inputNum = parseFloat(inputValue.replace(/,/g, '')) || 0;

      if (inputNum <= 0) {
        throw new Error('Vui lòng nhập giá trị đầu tư hợp lệ (lớn hơn 0).');
      }

      const currentPrice = dailyPrices[dailyPrices.length - 1].close;

      if (investMode === 'lump-sum') {
        const entryPrice = dailyPrices[0].close;
        totalInvested = inputNum;
        totalShares = inputNum / entryPrice;
        
        // Push single record
        purchases.push({
          index: 1,
          date: dailyPrices[0].date,
          price: entryPrice,
          amountSpent: inputNum,
          sharesBought: totalShares,
          totalShares: totalShares,
          totalCost: inputNum,
          portfolioValue: totalShares * entryPrice
        });

        // Add today's milestone for chart visualization
        if (dailyPrices.length > 1) {
          purchases.push({
            index: 2,
            date: dailyPrices[dailyPrices.length - 1].date,
            price: currentPrice,
            amountSpent: 0,
            sharesBought: 0,
            totalShares: totalShares,
            totalCost: inputNum,
            portfolioValue: totalShares * currentPrice
          });
        }
      } else if (investMode === 'dca-amount') {
        // DCA by fixed cash amount
        let lastMonthStr = '';
        let count = 0;
        for (const item of dailyPrices) {
          const monthStr = `${item.date.getFullYear()}-${item.date.getMonth()}`;
          if (monthStr !== lastMonthStr) {
            count++;
            const buyPrice = item.close;
            const sharesBought = inputNum / buyPrice;
            totalInvested += inputNum;
            totalShares += sharesBought;

            purchases.push({
              index: count,
              date: item.date,
              price: buyPrice,
              amountSpent: inputNum,
              sharesBought: sharesBought,
              totalShares: totalShares,
              totalCost: totalInvested,
              portfolioValue: totalShares * buyPrice
            });
            lastMonthStr = monthStr;
          }
        }
      } else {
        // DCA by fixed asset quantity
        let lastMonthStr = '';
        let count = 0;
        for (const item of dailyPrices) {
          const monthStr = `${item.date.getFullYear()}-${item.date.getMonth()}`;
          if (monthStr !== lastMonthStr) {
            count++;
            const buyPrice = item.close;
            const cost = inputNum * buyPrice;
            totalInvested += cost;
            totalShares += inputNum;

            purchases.push({
              index: count,
              date: item.date,
              price: buyPrice,
              amountSpent: cost,
              sharesBought: inputNum,
              totalShares: totalShares,
              totalCost: totalInvested,
              portfolioValue: totalShares * buyPrice
            });
            lastMonthStr = monthStr;
          }
        }
      }

      const finalValue = totalShares * currentPrice;
      const netProfit = finalValue - totalInvested;
      const profitPercent = (netProfit / totalInvested) * 100;
      const avgPrice = totalInvested / totalShares;

      // CAGR formula: (Final/Start)^(1/years) - 1
      const yearsElapsed = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24 * 365.25);
      const cagr = yearsElapsed > 0.1 ? (Math.pow((finalValue / totalInvested), 1 / yearsElapsed) - 1) * 100 : null;

      setResults({
        totalInvested,
        totalShares,
        currentPrice,
        finalValue,
        netProfit,
        profitPercent,
        avgPrice,
        cagr,
        purchases,
        symbol: symbol.toUpperCase()
      });

    } catch (err) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra khi xử lý dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  // Build Chart Data
  const getChartData = () => {
    if (!results) return null;

    const labels = results.purchases.map(p => 
      p.date.toLocaleDateString('vi-VN', { year: '2-digit', month: 'numeric' })
    );

    const investedData = results.purchases.map(p => p.totalCost);
    const valueData = results.purchases.map(p => p.portfolioValue);

    return {
      labels,
      datasets: [
        {
          label: 'Giá trị tài sản',
          data: valueData,
          borderColor: isVndAsset ? '#f59e0b' : '#10b981', // Amber or Emerald
          backgroundColor: isVndAsset ? 'rgba(245, 158, 11, 0.05)' : 'rgba(16, 185, 129, 0.05)',
          borderWidth: 3,
          pointRadius: results.purchases.length > 50 ? 0 : 3,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.3
        },
        {
          label: 'Tổng vốn đầu tư',
          data: investedData,
          borderColor: '#64748b', // Slate-500
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1', // Slate-300
          font: { family: 'Inter', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#f1f5f9',
        borderColor: '#475569',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += formatVal(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(71, 85, 105, 0.1)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(71, 85, 105, 0.15)' },
        ticks: { 
          color: '#94a3b8', 
          font: { size: 10 },
          callback: function(value) {
            return formatVal(value, true);
          }
        }
      }
    }
  };

  // Pagination helper
  const paginatedPurchases = results 
    ? results.purchases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const totalPages = results 
    ? Math.ceil(results.purchases.length / itemsPerPage)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Decorative neon ambient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none z-0"></div>

      {/* Header section */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md py-4 px-6 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl shadow-lg shadow-emerald-500/20">
            <Wallet className="h-6 w-6 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">MyWallet</h1>
            <p className="text-xs text-slate-400 hidden sm:block">Trình giả lập & Tối ưu tích sản tài sản chuyên nghiệp</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-800/60 border border-slate-700/50 py-1.5 px-3 rounded-full text-slate-300">
          <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span>Real-time API Link</span>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 z-10">
        
        {/* Sidebar Configuration Panel */}
        <section className="lg:col-span-1 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-lg flex flex-col gap-5 h-fit shadow-2xl">
          <div className="border-b border-slate-800/60 pb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Cấu hình giả lập</h2>
          </div>

          <form onSubmit={handleSimulate} className="flex flex-col gap-4">
            {/* Symbol input with preset tags */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-slate-400">Ký hiệu tài sản</label>
              <div className="relative">
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="Ví dụ: HPG.VN, BTC-USD"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 pl-9 text-sm focus:outline-none transition-all text-slate-100 font-mono"
                  required
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              </div>
              
              {/* Presets List */}
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {PRESET_SYMBOLS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => handlePresetClick(p)}
                    className={`text-[10px] py-1 px-2 rounded-md border transition-all ${
                      symbol.toUpperCase() === p.value 
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {p.value.split('-')[0].split('.')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">Ngày bắt đầu</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-0 transition-all font-mono"
                required
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">Ngày kết thúc</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-0 transition-all font-mono"
                required
              />
            </div>

            {/* Investment mode selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">Hình thức đầu tư</label>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => setInvestMode('dca-qty')}
                  className={`text-left text-xs py-2 px-3 rounded-xl border transition-all flex flex-col gap-0.5 ${
                    investMode === 'dca-qty'
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold">Tích sản số lượng cố định</span>
                  <span className="text-[10px] text-slate-500">Mỗi tháng mua N cổ phiếu (Khuyên dùng)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInvestMode('dca-amount')}
                  className={`text-left text-xs py-2 px-3 rounded-xl border transition-all flex flex-col gap-0.5 ${
                    investMode === 'dca-amount'
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold">Tích sản số tiền cố định</span>
                  <span className="text-[10px] text-slate-500">Mỗi tháng bỏ ra X tiền để mua</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInvestMode('lump-sum')}
                  className={`text-left text-xs py-2 px-3 rounded-xl border transition-all flex flex-col gap-0.5 ${
                    investMode === 'lump-sum'
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold">Mua một lần duy nhất</span>
                  <span className="text-[10px] text-slate-500">Mua X tiền vào ngày bắt đầu và nắm giữ</span>
                </button>
              </div>
            </div>

            {/* Input Value */}
            <div className="flex flex-col gap-1.5 border-t border-slate-800/60 pt-3">
              <label className="text-xs font-medium text-slate-400">
                {investMode === 'dca-qty' 
                  ? `Số lượng cổ phiếu/coin mua mỗi tháng` 
                  : `Số tiền đầu tư mỗi kỳ (${isVndAsset ? 'VND' : 'USD'})`
                }
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-sm focus:outline-none font-bold text-slate-200"
                required
              />
              {isVndAsset && (investMode === 'dca-amount' || investMode === 'lump-sum') && (
                <span className="text-[10px] text-slate-500">
                  Ví dụ: 1000000 = 1 triệu đồng
                </span>
              )}
            </div>

            {/* Simulate Trigger Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold py-2.5 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 text-sm flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Đang tính toán...</span>
                </>
              ) : (
                <span>Chạy Giả Lập</span>
              )}
            </button>
          </form>
        </section>

        {/* Results Panel */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Status states */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-sm flex items-center gap-3">
              <Info className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Empty state / Welcome screen */}
          {!results && !loading && (
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-5 flex-1 min-h-[450px] shadow-2xl backdrop-blur-lg">
              <div className="p-4 bg-slate-800/60 rounded-full border border-slate-700/60 shadow-lg">
                <TrendingUp className="h-12 w-12 text-emerald-400 animate-pulse" />
              </div>
              <div className="max-w-md">
                <h3 className="text-xl font-bold text-slate-100">Bắt đầu giả lập tài chính của bạn</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Thiết lập mã tài sản, khoảng thời gian và số lượng mua ở bảng bên trái. Hệ thống sẽ tự động tính toán lợi nhuận và tốc độ gia tăng tài sản của bạn.
                </p>
              </div>
              
              {/* Quick Suggestion Box */}
              <div className="mt-4 bg-slate-950/40 border border-slate-800/80 p-5 rounded-2xl w-full max-w-xl text-left">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Ví dụ khuyên dùng:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div 
                    onClick={() => {
                      setSymbol('FPT.VN');
                      setInvestMode('dca-qty');
                      setInputValue('100');
                      setStartDate('2018-01-01');
                    }}
                    className="p-3 bg-slate-900/60 hover:bg-slate-800/50 border border-slate-800/80 hover:border-slate-700/80 rounded-xl cursor-pointer transition-all flex flex-col gap-1"
                  >
                    <span className="font-semibold text-emerald-400">Gom FPT từ năm 2018</span>
                    <span className="text-slate-500">Mỗi tháng mua đều đặn 100 cổ phiếu FPT.</span>
                  </div>
                  
                  <div 
                    onClick={() => {
                      setSymbol('BTC-USD');
                      setInvestMode('dca-amount');
                      setInputValue('100');
                      setStartDate('2020-01-01');
                    }}
                    className="p-3 bg-slate-900/60 hover:bg-slate-800/50 border border-slate-800/80 hover:border-slate-700/80 rounded-xl cursor-pointer transition-all flex flex-col gap-1"
                  >
                    <span className="font-semibold text-emerald-400">Tích sản Bitcoin hàng tháng</span>
                    <span className="text-slate-500">Mỗi tháng đầu tư $100 mua Bitcoin từ 2020.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading spinner */}
          {loading && (
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 flex-1 min-h-[450px] shadow-2xl backdrop-blur-lg">
              <RefreshCw className="h-10 w-10 text-emerald-400 animate-spin" />
              <p className="text-sm text-slate-400">Đang tải và tính toán dữ liệu lịch sử giá từ Yahoo Finance...</p>
            </div>
          )}

          {/* Simulation Output results */}
          {results && !loading && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              
              {/* KPI cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1: Capital Invested */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tổng vốn đầu tư</span>
                    <span className="text-lg font-bold text-slate-100">{formatVal(results.totalInvested)}</span>
                  </div>
                  <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-slate-400">
                    <Wallet className="h-5 w-5" />
                  </div>
                </div>

                {/* KPI 2: Portfolio Current Value */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Giá trị hiện tại</span>
                    <span className="text-lg font-bold text-slate-100">{formatVal(results.finalValue)}</span>
                  </div>
                  <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-emerald-400">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>

                {/* KPI 3: Net Profit */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Lợi nhuận ròng</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-lg font-bold ${results.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {results.netProfit >= 0 ? '+' : ''}{formatVal(results.netProfit)}
                      </span>
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
                    results.netProfit >= 0 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {results.netProfit >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  </div>
                </div>

                {/* KPI 4: Net Profit % & CAGR */}
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

              {/* Chart container */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-slate-200">Đồ thị tăng trưởng tài sản</h3>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Giá mua trung bình: <span className="font-bold text-slate-200">{formatVal(results.avgPrice)}</span> | Giá hiện tại: <span className="font-bold text-slate-200">{formatVal(results.currentPrice)}</span>
                  </div>
                </div>

                <div className="h-[280px]">
                  <Line data={getChartData()} options={chartOptions} />
                </div>
              </div>

              {/* Transactions details table */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-slate-200">Nhật ký mua tích lũy</h3>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-800/60 border border-slate-700/50 py-1 px-2.5 rounded-full font-mono">
                    Tích lũy được: {results.totalShares.toFixed(results.totalShares > 10 ? 2 : 5)} đơn vị
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/30">
                        <th className="py-2.5 px-4">#</th>
                        <th className="py-2.5 px-4">Ngày mua</th>
                        <th className="py-2.5 px-4">Giá mua</th>
                        <th className="py-2.5 px-4">Số lượng khớp</th>
                        <th className="py-2.5 px-4">Vốn chi chu kỳ</th>
                        <th className="py-2.5 px-4 text-slate-400">Cộng dồn vốn</th>
                        <th className="py-2.5 px-4 text-emerald-400 font-bold text-right">Giá trị tài sản lúc đó</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPurchases.map((p) => (
                        <tr key={p.index} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-all font-mono">
                          <td className="py-2.5 px-4 text-slate-500">{p.index}</td>
                          <td className="py-2.5 px-4 text-slate-300">
                            {p.date.toLocaleDateString('vi-VN')}
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">{formatVal(p.price)}</td>
                          <td className="py-2.5 px-4 text-slate-300 font-semibold">
                            {p.sharesBought.toFixed(p.sharesBought > 10 ? 2 : 4)}
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">{formatVal(p.amountSpent)}</td>
                          <td className="py-2.5 px-4 text-slate-400">{formatVal(p.totalCost)}</td>
                          <td className="py-2.5 px-4 text-emerald-400 font-bold text-right">
                            {formatVal(p.portfolioValue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination UI */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 text-xs">
                    <span className="text-slate-400">
                      Trang <span className="font-bold text-slate-200">{currentPage}</span> / {totalPages}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-400 hover:text-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-400 hover:text-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/40 py-4 px-6 text-center text-xs text-slate-500 z-10 font-mono">
        © {new Date().getFullYear()} MyWallet Simulator. Built for asset accumulation backtesting.
      </footer>
    </div>
  );
}
