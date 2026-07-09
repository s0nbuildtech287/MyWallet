import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Layers, Search, DollarSign, Percent, TrendingUp, TrendingDown, 
  Activity, History, ChevronLeft, ChevronRight, RefreshCw, Info 
} from 'lucide-react';

export default function Simulator({
  symbol,
  setSymbol,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  investMode,
  setInvestMode,
  inputValue,
  setInputValue,
  loading,
  error,
  results,
  handleSimulate,
  currentPage,
  setCurrentPage,
  isVndAsset,
  formatVal,
  getChartData,
  chartOptions,
  paginatedPurchases,
  totalPages,
  presetSymbols
}) {
  const handlePresetClick = (p) => {
    setSymbol(p.value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fadeIn">
      {/* Left Sidebar Config Panel */}
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
              {presetSymbols.map((p) => (
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
                ? `Số lượng mua mỗi tháng` 
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
      <div className="lg:col-span-3 flex flex-col gap-6">
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
              <h3 className="text-xl font-bold text-slate-100">Bắt đầu giả lập tích sản</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Thiết lập mã tài sản, khoảng thời gian và số lượng mua ở bảng bên trái. Hệ thống sẽ tự động tính toán lợi nhuận và tốc độ gia tăng giá trị.
              </p>
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
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tổng vốn đầu tư</span>
                  <span className="text-lg font-bold text-slate-100">{formatVal(results.totalInvested)}</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-slate-400">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Giá trị tài sản hiện tại</span>
                  <span className="text-lg font-bold text-slate-100">{formatVal(results.finalValue)}</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-emerald-400">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>

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
                  <h3 className="text-sm font-bold text-slate-200">Đồ thị tăng trưởng giả lập</h3>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Giá mua trung bình: <span className="font-bold text-slate-200">{formatVal(results.avgPrice)}</span> | Giá hiện tại: <span className="font-bold text-slate-200">{formatVal(results.currentPrice)}</span>
                </div>
              </div>

              <div className="h-[280px]">
                <Line key={`sim-chart-${symbol}-${results?.purchases?.length || 0}`} data={getChartData()} options={chartOptions} />
              </div>
            </div>

            {/* Transactions details table */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-200">Nhật ký chi tiết chu kỳ tích lũy</h3>
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
      </div>
    </div>
  );
}
