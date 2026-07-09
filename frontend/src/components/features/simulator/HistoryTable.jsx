import React from 'react';
import { History } from 'lucide-react';
import Pagination from '../../ui/Pagination';

export default function HistoryTable({
  results,
  paginatedPurchases,
  formatVal,
  currentPage,
  totalPages,
  setCurrentPage
}) {
  return (
    <div className="bg-slate-900/40 border border-slate-700/25 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-700/20 pb-3">
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
            <tr className="border-b border-slate-700/25 text-slate-400 font-semibold bg-slate-950/30">
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
              <tr key={p.index} className={`border-b border-slate-800/40 hover:bg-slate-800/20 transition-all font-mono ${p.isDividend ? 'bg-emerald-950/10' : ''}`}>
                <td className="py-2.5 px-4 text-slate-500">{p.index}</td>
                <td className="py-2.5 px-4 text-slate-300">
                  {p.date.toLocaleDateString('vi-VN')}
                  {p.isDividend && (
                    <span className="ml-2 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-sans font-bold">
                      Cổ tức
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-slate-300">{formatVal(p.price)}</td>
                <td className="py-2.5 px-4 text-slate-300 font-semibold">
                  {p.sharesBought.toFixed(p.sharesBought > 10 ? 2 : 4)}
                </td>
                <td className="py-2.5 px-4 text-slate-300">
                  {p.isDividend ? (
                    <span className="text-emerald-400 font-bold text-[10px]" title={`Nhận ${formatVal(p.dividendAmount)}/CP`}>
                      +{formatVal(p.dividendPayout)}
                    </span>
                  ) : (
                    formatVal(p.amountSpent)
                  )}
                </td>
                <td className="py-2.5 px-4 text-slate-400">{formatVal(p.totalCost)}</td>
                <td className="py-2.5 px-4 text-emerald-400 font-bold text-right">
                  {formatVal(p.portfolioValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={results.purchases.length}
        onPageChange={setCurrentPage}
        label="giao dịch"
      />
    </div>
  );
}
