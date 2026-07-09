import React from 'react';
import { Search, Layers, ArrowRight, Loader2, AlertCircle, PlusCircle } from 'lucide-react';
import Pagination from '../components/ui/Pagination';
import Tooltip from '../components/ui/Tooltip';
import SparklineChart from '../components/ui/SparklineChart';
import { formatMarketCap } from '../utils/formatters';

export default function Overview({
  globalSearch,
  setGlobalSearch,
  categoryFilter,
  setCategoryFilter,
  macroIndices,
  filteredAssets,
  totalFilteredCount,
  handleQuickSimulation,
  handleOpenAssetDetails,
  handleGlobalSearchSubmit,
  formatValSymbol,
  formatVolumeHelper,
  overviewPage,
  setOverviewPage,
  overviewTotalPages,
  overviewItemsPerPage,
  searchLoading,
  searchError,
}) {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Hero Search Section */}
      <section className="bg-gradient-to-r from-slate-900/80 via-slate-900/10 to-slate-900/80 border border-slate-850 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3.5 shadow-2xl backdrop-blur-lg">
        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-100 bg-clip-text text-transparent">
          Cổng tra cứu tài sản &amp; Thiết lập phương án tích sản
        </h2>
        <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
          Nhập mã Yahoo Finance để thêm tài sản bất kỳ vào danh sách tham khảo. Mã chứng khoán VN có đuôi
          {" "}<span className="text-emerald-400 font-mono">.VN</span>{" "}(ví dụ: <span className="font-mono text-slate-300">FPT.VN</span>).
          Tìm kiếm sẽ <strong className="text-emerald-300">thêm mã mới vào danh sách</strong>.
        </p>
        <form onSubmit={handleGlobalSearchSubmit} className="w-full max-w-md relative mt-1.5 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Nhập mã tài sản (VD: VNM.VN, AMZN, ETH-USD...)"
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3.5 pl-9 text-xs focus:outline-none text-slate-100 font-mono transition-all"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          </div>
          <button
            type="submit"
            disabled={searchLoading}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-wait text-slate-950 font-bold px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg min-w-[90px]"
          >
            {searchLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <PlusCircle className="h-3.5 w-3.5" />
                Thêm mã
              </>
            )}
          </button>
        </form>
        {searchError && (
          <div className="flex items-center gap-2 text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {searchError}
          </div>
        )}
        {searchLoading && (
          <p className="text-[10px] text-emerald-400 animate-pulse">Đang tải dữ liệu từ Yahoo Finance...</p>
        )}
      </section>

      {/* Large Market Asset List */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-lg flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/60 pb-3 gap-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            Danh sách tài sản tham khảo
            <span className="text-slate-500 normal-case font-normal tracking-normal">({totalFilteredCount} tài sản)</span>
          </h3>
          <div className="flex items-center gap-1.5 self-start flex-wrap">
            {["All", "Crypto", "Chứng khoán VN", "Chứng khoán Mỹ", "ETF & Quỹ", "Hàng hóa & Tỷ giá", "Khác"].map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategoryFilter(cat); setOverviewPage(1); }}
                className={`text-[10px] font-semibold py-1 px-2.5 rounded-lg border transition-all ${
                  categoryFilter === cat
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/20">
                <th className="py-2.5 px-3 w-8 text-center text-slate-600">#</th>
                <th className="py-2.5 px-4">Tên tài sản</th>
                <th className="py-2.5 px-4 font-mono">Mã Yahoo</th>
                <th className="py-2.5 px-4">Phân nhóm</th>
                <th className="py-2.5 px-4">Giá hiện tại</th>
                <th className="py-2.5 px-4">
                  <span>Biến động</span>
                  <Tooltip content="Phần trăm thay đổi giá của tài sản trong 24 giờ qua." position="bottom" />
                </th>
                <th className="py-2.5 px-4">
                  <div className="flex items-center gap-1">
                    <span>Vốn hóa</span>
                    <Tooltip content="Tổng giá trị thị trường của tài sản (Market Cap). Cập nhật theo live data." position="bottom" />
                  </div>
                </th>
                <th className="py-2.5 px-4">
                  <div className="flex items-center gap-1">
                    <span>52W H/L</span>
                    <Tooltip content="Giá cao nhất và thấp nhất trong 52 tuần gần nhất." position="bottom" />
                  </div>
                </th>
                <th className="py-2.5 px-4">
                  <span>Khối lượng 24h</span>
                  <Tooltip content="Tổng giá trị giao dịch quy đổi (Turnover Value) trong 24 giờ gần nhất." position="bottom" />
                </th>
                <th className="py-2.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>Biểu đồ</span>
                    <Tooltip content="Biểu đồ giá tổng quan 30 ngày gần nhất." position="bottom" />
                  </div>
                </th>
                <th className="py-2.5 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-slate-500 text-xs">
                    Không tìm thấy tài sản phù hợp
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset, idx) => (
                  <tr
                    key={asset.symbol}
                    className={`border-b border-slate-850 hover:bg-slate-800/20 transition-colors duration-300 ${
                      asset.tick === "up" ? "bg-emerald-500/10" : asset.tick === "down" ? "bg-rose-500/10" : ""
                    }`}
                  >
                    <td className="py-3 px-3 text-slate-600 font-mono text-center text-[10px]">
                      {(overviewPage - 1) * overviewItemsPerPage + idx + 1}
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-bold">{asset.name}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono">{asset.symbol}</td>
                    <td className="py-3 px-4 text-slate-500 font-semibold">{asset.category}</td>
                    <td className={`py-3 px-4 font-bold font-mono transition-colors duration-200 ${
                      asset.tick === "up" ? "text-emerald-400" : asset.tick === "down" ? "text-rose-400" : "text-slate-100"
                    }`}>
                      {formatValSymbol(asset.price, asset.symbol)}
                    </td>
                    <td className={`py-3 px-4 font-bold font-mono ${asset.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {asset.change >= 0 ? "+" : ""}{asset.change}%
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300 text-xs">
                      {asset.details?.marketCap ? (
                        formatMarketCap(asset.details.marketCap, asset.isVnd)
                      ) : (
                        <div className="flex items-center text-slate-500 gap-0.5">
                          <span>N/A</span>
                          <Tooltip content="Dữ liệu vốn hóa không khả dụng cho tài sản này" position="top" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {asset.details?.high52 && asset.details?.low52 ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-emerald-400 font-mono font-medium">
                            ▲ {asset.isVnd
                              ? Number(asset.details.high52).toLocaleString('vi-VN') + ' VNĐ'
                              : '$' + Number(asset.details.high52).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-rose-400 font-mono font-medium">
                            ▼ {asset.isVnd
                              ? Number(asset.details.low52).toLocaleString('vi-VN') + ' VNĐ'
                              : '$' + Number(asset.details.low52).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-600">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono font-medium">
                      {formatVolumeHelper(asset.volume, asset.symbol.endsWith('.VN') || asset.symbol.endsWith('.HM'))}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <SparklineChart symbol={asset.symbol} change={asset.change} />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenAssetDetails(asset.symbol)}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-1 px-3 border border-slate-800 rounded-lg text-[9px] transition-all cursor-pointer"
                        >
                          Xem biểu đồ
                        </button>
                        <button
                          onClick={() => handleQuickSimulation(asset.symbol)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-1 px-3 rounded-lg text-[9px] transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Giả lập</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination */}
        <Pagination
          currentPage={overviewPage}
          totalPages={overviewTotalPages}
          totalCount={totalFilteredCount}
          onPageChange={setOverviewPage}
          label="tài sản"
        />
      </section>
    </div>
  );
}
