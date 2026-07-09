import React from 'react';
import { Search, Layers, ArrowRight } from 'lucide-react';

export default function Overview({
  globalSearch,
  setGlobalSearch,
  categoryFilter,
  setCategoryFilter,
  macroIndices,
  filteredAssets,
  handleQuickSimulation,
  handleOpenAssetDetails,
  handleGlobalSearchSubmit,
  formatValSymbol
}) {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Hero Search Section */}
      <section className="bg-gradient-to-r from-slate-900/80 via-slate-900/10 to-slate-900/80 border border-slate-850 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3.5 shadow-2xl backdrop-blur-lg">
        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-100 bg-clip-text text-transparent">
          Cổng tra cứu tài sản & Thiết lập phương án tích sản
        </h2>
        <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
          Nhập mã ký hiệu của bất kỳ tài sản tài chính nào dưới đây (chứng khoán Việt Nam `.VN`, cổ phiếu Mỹ, Crypto) để xem biểu đồ chi tiết hoặc tiến hành tính toán giả lập.
        </p>

        <form onSubmit={handleGlobalSearchSubmit} className="w-full max-w-md relative mt-1.5 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Tìm mã tài sản (ví dụ: HPG.VN, BTC-USD, SJC...)"
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3.5 pl-9 text-xs focus:outline-none text-slate-100 font-mono transition-all"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          </div>
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 rounded-xl text-xs transition-all flex items-center justify-center cursor-pointer shadow-lg"
          >
            Tìm kiếm
          </button>
        </form>
      </section>

      {/* Large Market Asset List */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-lg flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/60 pb-3 gap-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            Danh sách tài sản tham khảo
          </h3>
          
          <div className="flex items-center gap-1.5 self-start">
            {['All', 'Crypto', 'Chứng khoán VN', 'Chứng khoán Mỹ'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-[10px] font-semibold py-1 px-2.5 rounded-lg border transition-all ${
                  categoryFilter === cat 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
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
                <th className="py-2.5 px-4">Tên tài sản</th>
                <th className="py-2.5 px-4 font-mono">Mã Yahoo</th>
                <th className="py-2.5 px-4">Phân nhóm</th>
                <th className="py-2.5 px-4">Giá hiện tại</th>
                <th className="py-2.5 px-4">Biến động</th>
                <th className="py-2.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr 
                  key={asset.symbol} 
                  className={`border-b border-slate-850 hover:bg-slate-800/20 transition-colors duration-300 ${
                    asset.tick === 'up' 
                      ? 'bg-emerald-500/10' 
                      : asset.tick === 'down' 
                      ? 'bg-rose-500/10' 
                      : ''
                  }`}
                >
                  <td className="py-3 px-4 text-slate-200 font-bold">{asset.name}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono">{asset.symbol}</td>
                  <td className="py-3 px-4 text-slate-500 font-semibold">{asset.category}</td>
                  <td className={`py-3 px-4 font-bold font-mono transition-colors duration-200 ${
                    asset.tick === 'up' 
                      ? 'text-emerald-400' 
                      : asset.tick === 'down' 
                      ? 'text-rose-400' 
                      : 'text-slate-100'
                  }`}>
                    {asset.isVnd 
                      ? `${asset.price.toLocaleString('vi-VN')} đ` 
                      : `$${asset.price.toLocaleString('en-US')}`
                    }
                  </td>
                  <td className={`py-3 px-4 font-bold font-mono ${
                    asset.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {asset.change >= 0 ? '+' : ''}{asset.change}%
                  </td>
                  <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
