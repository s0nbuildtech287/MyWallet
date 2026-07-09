import React from 'react';
import { Globe } from 'lucide-react';

export default function News({
  newsFilter,
  setNewsFilter,
  filteredNews
}) {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-lg flex flex-col gap-4">
        
        {/* News filters header */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200">Tin tức tài chính tổng hợp</h3>
          </div>

          <div className="flex gap-1">
            {['Tất cả', 'Trong nước', 'Quốc tế'].map(filterOpt => (
              <button
                key={filterOpt}
                onClick={() => setNewsFilter(filterOpt)}
                className={`text-[10px] font-semibold py-1 px-3 rounded-lg border transition-all ${
                  newsFilter === filterOpt
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {filterOpt}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNews.map((news) => (
            <div 
              key={news.id}
              className="p-4 bg-slate-950/40 border border-slate-850 hover:border-slate-700/60 rounded-xl transition-all flex flex-col justify-between gap-3 shadow-lg group cursor-pointer"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[9px] font-semibold font-mono">
                  <span className={`px-2 py-0.5 rounded-full ${
                    news.category === 'Trong nước' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {news.category}
                  </span>
                  <span className="text-slate-500">{news.time}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors leading-snug">
                  {news.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                  {news.summary}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-900/60 pt-2 text-[10px] font-mono">
                <span className="text-slate-500">Nguồn: {news.source}</span>
                <span className={`font-semibold ${
                  news.sentiment === 'bullish' ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  {news.sentiment === 'bullish' ? 'Tích cực ↑' : 'Trung tính'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
