import React from 'react';
import { Line } from 'react-chartjs-2';
import { TrendingUp, RefreshCw, Info, Activity } from 'lucide-react';
import ConfigPanel from '../components/features/simulator/ConfigPanel';
import ResultsKPIs from '../components/features/simulator/ResultsKPIs';
import HistoryTable from '../components/features/simulator/HistoryTable';

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
  chartPlugins,
  paginatedPurchases,
  totalPages,
  presetSymbols
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fadeIn">
      {/* Config Panel */}
      <ConfigPanel
        symbol={symbol}
        setSymbol={setSymbol}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        investMode={investMode}
        setInvestMode={setInvestMode}
        inputValue={inputValue}
        setInputValue={setInputValue}
        loading={loading}
        handleSimulate={handleSimulate}
        presetSymbols={presetSymbols}
        isVndAsset={isVndAsset}
      />

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
            <ResultsKPIs results={results} formatVal={formatVal} />

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
                <Line 
                  key={`sim-chart-${symbol}-${results?.purchases?.length || 0}`} 
                  data={getChartData()} 
                  options={chartOptions}
                  plugins={chartPlugins || []}
                />
              </div>
            </div>

            {/* Transactions details table */}
            <HistoryTable
              results={results}
              paginatedPurchases={paginatedPurchases}
              formatVal={formatVal}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
