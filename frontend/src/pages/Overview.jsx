import React from "react";
import { Search, Layers, ArrowRight, ChevronLeft, ChevronRight, Loader2, AlertCircle, PlusCircle } from "lucide-react";

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
  overviewPage,
  setOverviewPage,
  overviewTotalPages,
  overviewItemsPerPage,
  searchLoading,
  searchError,
}) {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
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

      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-lg flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/60 pb-3 gap-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            Danh sách tài sản tham khảo
            <span className="text-slate-500 normal-case font-normal tracking-normal">({totalFilteredCount} tài sản)</span>
          </h3>
          <div className="flex items-center gap-1.5 self-start flex-wrap">
            {["All", "Crypto", "Chứng khoán VN", "Chứng khoán Mỹ", "Khác"].map((cat) => (
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
                <th className="py-2.5 px-4">Biến động</th>
                <th className="py-2.5 px-4">Khối lượng 24h</th>
                <th className="py-2.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500 text-xs">
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
                      {asset.isVnd
                        ? `${asset.price.toLocaleString("vi-VN")} đ`
                        : `$${asset.price.toLocaleString("en-US")}`}
                    </td>
                    <td className={`py-3 px-4 font-bold font-mono ${asset.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {asset.change >= 0 ? "+" : ""}{asset.change}%
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono font-medium">
                      {asset.volume || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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

        {overviewTotalPages > 1 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <span className="text-[10px] text-slate-500">
              Trang {overviewPage}/{overviewTotalPages} &nbsp;·&nbsp; {totalFilteredCount} tài sản
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setOverviewPage((p) => Math.max(1, p - 1))}
                disabled={overviewPage === 1}
                className="h-7 w-7 flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: overviewTotalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === overviewTotalPages || Math.abs(p - overviewPage) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== p - 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={"e" + i} className="px-1 text-slate-600 text-[10px]">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setOverviewPage(p)}
                      className={`h-7 w-7 flex items-center justify-center rounded-lg text-[10px] font-bold border transition-all ${
                        overviewPage === p
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                          : "border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setOverviewPage((p) => Math.min(overviewTotalPages, p + 1))}
                disabled={overviewPage === overviewTotalPages}
                className="h-7 w-7 flex items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
