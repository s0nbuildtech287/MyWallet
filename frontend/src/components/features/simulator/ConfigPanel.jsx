import React from 'react';
import { Layers, Search, RefreshCw } from 'lucide-react';
import Tooltip from '../../ui/Tooltip';

export default function ConfigPanel({
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
  handleSimulate,
  presetSymbols,
  isVndAsset,
  reinvestDividends,
  setReinvestDividends
}) {
  const handlePresetClick = (p) => {
    setSymbol(p.value);
  };

  return (
    <section className="bg-slate-900/40 border border-slate-700/25 rounded-2xl p-5 backdrop-blur-lg flex flex-col gap-5 h-fit shadow-2xl">
      <div className="border-b border-slate-700/20 pb-3 flex items-center gap-2">
        <Layers className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Cấu hình giả lập</h2>
      </div>

      <form onSubmit={handleSimulate} className="flex flex-col gap-4">
        {/* Symbol input with preset tags */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <span>Ký hiệu tài sản</span>
            <Tooltip content="Mã giao dịch tài sản trên Yahoo Finance (ví dụ: BTC-USD cho Bitcoin, FPT.VN cho cổ phiếu FPT)." />
          </label>
          <div className="relative">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Ví dụ: HPG.VN, BTC-USD"
              className="w-full bg-slate-950/60 border border-slate-700/25 focus:border-emerald-500 rounded-xl py-2 px-3 pl-9 text-sm focus:outline-none transition-all text-slate-100 font-mono"
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
                    : 'bg-slate-950/40 border-slate-700/25 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {p.value.split('-')[0].split('.')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <span>Ngày bắt đầu</span>
            <Tooltip content="Mốc thời gian bắt đầu chạy giả định tích lũy tài sản." />
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onClick={(e) => e.target.showPicker?.()}
            className="w-full bg-slate-950/60 border border-slate-700/25 focus:border-emerald-500 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-0 transition-all font-mono text-slate-200 cursor-pointer"
            required
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <span>Ngày kết thúc</span>
            <Tooltip content="Mốc thời gian dừng việc mua tích lũy và thực hiện chốt số liệu." />
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            onClick={(e) => e.target.showPicker?.()}
            className="w-full bg-slate-950/60 border border-slate-700/25 focus:border-emerald-500 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-0 transition-all font-mono text-slate-200 cursor-pointer"
            required
          />
        </div>

        {/* Investment Mode */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <span>Phương thức tích trữ</span>
            <Tooltip content="Chọn cách thức mua định kỳ (DCA) hoặc mua toàn bộ vốn một lần duy nhất." />
          </label>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setInvestMode('dca-qty')}
              className={`w-full text-left py-2.5 px-3 rounded-xl border flex flex-col gap-0.5 transition-all ${
                investMode === 'dca-qty'
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-bold'
                  : 'bg-slate-950/40 border-slate-700/25 text-slate-400 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="font-semibold text-xs">DCA số lượng cố định</span>
              <span className="text-[9px] text-slate-500">Ví dụ: Mua đúng 100 cổ phiếu vào ngày 1 mỗi tháng</span>
            </button>

            <button
              type="button"
              onClick={() => setInvestMode('dca-amount')}
              className={`w-full text-left py-2.5 px-3 rounded-xl border flex flex-col gap-0.5 transition-all ${
                investMode === 'dca-amount'
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-bold'
                  : 'bg-slate-950/40 border-slate-700/25 text-slate-400 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="font-semibold text-xs">DCA số tiền cố định</span>
              <span className="text-[9px] text-slate-500">Ví dụ: Đầu tư đúng 2.000.000 đ vào ngày 1 mỗi tháng</span>
            </button>

            <button
              type="button"
              onClick={() => setInvestMode('lump-sum')}
              className={`w-full text-left py-2.5 px-3 rounded-xl border flex flex-col gap-0.5 transition-all ${
                investMode === 'lump-sum'
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-bold'
                  : 'bg-slate-950/40 border-slate-700/25 text-slate-400 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="font-semibold text-xs">Mua một lần duy nhất</span>
              <span className="text-[9px] text-slate-500">Mua X tiền vào ngày bắt đầu và nắm giữ</span>
            </button>
          </div>
        </div>

        {/* Input Value */}
        <div className="flex flex-col gap-1.5 border-t border-slate-700/20 pt-3">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <span>
              {investMode === 'dca-qty' 
                ? `Số lượng mua mỗi tháng` 
                : `Số tiền đầu tư mỗi kỳ (${isVndAsset ? 'VNĐ' : 'USD'})`
              }
            </span>
            <Tooltip content="Số vốn bỏ ra (hoặc số lượng tài sản mua) trong mỗi kỳ giao dịch tích lũy." />
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-700/25 focus:border-emerald-500 rounded-xl py-2 px-3 text-sm focus:outline-none font-bold text-slate-200"
            required
          />
          {isVndAsset && (investMode === 'dca-amount' || investMode === 'lump-sum') && (
            <span className="text-[10px] text-slate-500">
              Ví dụ: 1000000 = 1 triệu đồng
            </span>
          )}
        </div>

        {/* Reinvest Dividends Checkbox */}
        <div className="flex items-center gap-3 border-t border-slate-700/20 pt-3">
          <input
            type="checkbox"
            id="reinvestDividends"
            checked={reinvestDividends}
            onChange={(e) => setReinvestDividends(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-700/25 focus:ring-emerald-500 focus:ring-opacity-25 focus:ring-offset-0 focus:outline-none accent-emerald-500 cursor-pointer"
          />
          <label htmlFor="reinvestDividends" className="text-xs font-semibold text-slate-300 flex items-center gap-1 cursor-pointer select-none">
            <span>Tái đầu tư cổ tức</span>
            <Tooltip content="Nếu được chọn, tiền cổ tức nhận được sẽ tự động quy đổi thành cổ phiếu mua thêm theo thị giá vào ngày phát cổ tức." />
          </label>
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
  );
}
