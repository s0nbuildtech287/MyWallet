import React from 'react';
import { 
  Compass, LayoutDashboard, LineChart, Calculator, Percent, Newspaper, BookOpen 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full z-20 shrink-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl shadow-lg shadow-emerald-500/20">
          <Compass className="h-5 w-5 text-slate-950 font-bold" />
        </div>
        <div>
          <h1 className="text-base font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">MyWallet Hub</h1>
          <p className="text-[8px] text-slate-500 font-mono tracking-wide uppercase">Simulation System</p>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 p-4 flex flex-col gap-1.5">
        <button
          onClick={() => setActiveTab('overview')}
          className={`w-full flex items-center gap-3 text-xs font-semibold py-3 px-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-slate-800 border-slate-700 text-emerald-400 shadow-md'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Xem giá thị trường</span>
        </button>

        <button
          onClick={() => setActiveTab('asset-details')}
          className={`w-full flex items-center gap-3 text-xs font-semibold py-3 px-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'asset-details'
              ? 'bg-slate-800 border-slate-700 text-emerald-400 shadow-md'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <LineChart className="h-4 w-4" />
          <span>Biểu đồ chi tiết</span>
        </button>
        
        <button
          onClick={() => setActiveTab('simulator')}
          className={`w-full flex items-center gap-3 text-xs font-semibold py-3 px-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-slate-800 border-slate-700 text-emerald-400 shadow-md'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Calculator className="h-4 w-4" />
          <span>Chạy giả định tích sản</span>
        </button>

        <button
          onClick={() => setActiveTab('interest')}
          className={`w-full flex items-center gap-3 text-xs font-semibold py-3 px-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'interest'
              ? 'bg-slate-800 border-slate-700 text-emerald-400 shadow-md'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Percent className="h-4 w-4" />
          <span>Bảng tính lãi kép</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`w-full flex items-center gap-3 text-xs font-semibold py-3 px-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'news'
              ? 'bg-slate-800 border-slate-700 text-emerald-400 shadow-md'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Newspaper className="h-4 w-4" />
          <span>Tin tức tài chính</span>
        </button>

        <button
          onClick={() => setActiveTab('guides')}
          className={`w-full flex items-center gap-3 text-xs font-semibold py-3 px-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'guides'
              ? 'bg-slate-800 border-slate-700 text-emerald-400 shadow-md'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Cẩm nang & Đề xuất</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Online Cổng 5001</span>
      </div>
    </aside>
  );
}
