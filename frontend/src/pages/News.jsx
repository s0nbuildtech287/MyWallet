import React, { useState } from 'react';
import { Globe, RefreshCw } from 'lucide-react';
import useNews from '../hooks/useNews';

export default function News() {
  const [newsFilter, setNewsFilter] = useState('Tất cả');
  const { news, loading, error, refetch } = useNews(newsFilter);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <section className="bg-slate-900/40 border border-slate-700/25 rounded-2xl p-5 shadow-2xl backdrop-blur-lg flex flex-col gap-4">
        
        {/* News filters header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/20 pb-3">
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-200">Tin tức tài chính tổng hợp</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] text-emerald-400/80 font-mono font-bold tracking-wider">LIVE</span>
            </div>
            <button
              onClick={refetch}
              disabled={loading}
              className="p-1.5 rounded-lg bg-slate-950/40 border border-slate-700/15 hover:border-slate-700 text-slate-400 hover:text-slate-200 disabled:opacity-50 transition-all ml-1"
              title="Làm mới"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['Tất cả', 'Trong nước', 'Quốc tế', 'Crypto'].map(filterOpt => (
              <button
                key={filterOpt}
                onClick={() => setNewsFilter(filterOpt)}
                className={`text-[10px] font-semibold py-1 px-3 rounded-lg border transition-all whitespace-nowrap ${
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

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 bg-slate-950/20 border border-slate-900/60 rounded-xl flex gap-4 animate-pulse">
                <div className="w-20 h-20 bg-slate-800/40 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3 bg-slate-800/40 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-800/40 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-800/40 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-10 bg-rose-500/5 border border-rose-500/10 rounded-xl">
            <p className="text-xs text-rose-400 font-medium">{error}</p>
            <button 
              onClick={refetch} 
              className="mt-3 text-[10px] font-semibold bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg transition-all"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && news.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-xs">
            Không có tin tức nào trong danh mục này.
          </div>
        )}

        {/* News Grid layout */}
        {!loading && !error && news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.map((item) => (
              <div 
                key={item.id}
                onClick={() => window.open(item.url, '_blank')}
                className="p-4 bg-slate-950/40 border border-slate-700/10 hover:border-slate-700/60 rounded-xl transition-all flex gap-4 shadow-lg group cursor-pointer hover:shadow-emerald-950/10"
              >
                {item.imageUrl && (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-950 border border-slate-700/15">
                    <img 
                      src={item.imageUrl} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
                <div className="flex flex-col justify-between flex-1 gap-2 min-w-0">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[9px] font-semibold font-mono">
                      <span className={`px-2 py-0.5 rounded-full ${
                        item.category === 'Trong nước' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : item.category === 'Crypto'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-slate-500">{item.time}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-900/60 pt-1.5 text-[9px] font-mono">
                    <span className="text-slate-500">Nguồn: {item.source}</span>
                    <span className="text-slate-500 hover:text-emerald-400 transition-colors font-medium">Chi tiết →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
