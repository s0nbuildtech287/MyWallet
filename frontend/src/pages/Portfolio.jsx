import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { 
  Plus, Trash2, Briefcase, TrendingUp, TrendingDown, 
  DollarSign, ArrowUpRight, ArrowDownRight, History, X, AlertCircle 
} from 'lucide-react';
import { formatVal } from '../utils/formatters';

export default function Portfolio({ marketPrices, formatValSymbol: parentFormatValSymbol, setActiveTab }) {
  // 1. Transactions State with Seed Data
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('mywallet_portfolio_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing transactions', e);
      }
    }
    // Seed data
    return [
      {
        id: 'seed-1',
        symbol: 'FPT.VN',
        name: 'FPT Corp',
        type: 'BUY',
        quantity: 500,
        price: 135000,
        date: '2026-06-01',
        category: 'Chứng khoán VN',
        isVnd: true
      },
      {
        id: 'seed-2',
        symbol: 'BTC-USD',
        name: 'Bitcoin',
        type: 'BUY',
        quantity: 0.05,
        price: 60000,
        date: '2026-06-15',
        category: 'Crypto',
        isVnd: false
      }
    ];
  });

  // Persist transactions
  useEffect(() => {
    localStorage.setItem('mywallet_portfolio_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Display Currency State: 'VND' | 'USD'
  const [displayCurrency, setDisplayCurrency] = useState('VND');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('holdings'); // 'holdings' | 'history'
  
  // Form State for Add Transaction
  const [txSymbol, setTxSymbol] = useState('');
  const [txType, setTxType] = useState('BUY');
  const [txQuantity, setTxQuantity] = useState('');
  const [txPrice, setTxPrice] = useState('');
  const [txDate, setTxDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formError, setFormError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Allocation Chart Mode: 'category' | 'asset'
  const [chartMode, setChartMode] = useState('category');

  // Fetch USD/VND Rate dynamically from live prices
  const usdVndRate = marketPrices.find(a => a.symbol === 'USDVND=X')?.price || 25400;

  // Helper: check if a symbol is VND-denominated
  const checkIsVnd = (sym) => {
    const s = sym.toUpperCase();
    return s.endsWith('.VN') || s.endsWith('.HM') || s === 'USDVND=X';
  };

  // Helper: convert value to base currency (VND)
  const toVnd = (value, isVndAsset) => {
    return isVndAsset ? value : value * usdVndRate;
  };

  // Helper: format value according to display currency
  const formatPortfolioVal = (valueInVnd) => {
    if (displayCurrency === 'VND') {
      return formatVal(valueInVnd, true, true);
    } else {
      return formatVal(valueInVnd / usdVndRate, false, false);
    }
  };

  // Calculate Holdings from Transactions
  const calculateHoldings = () => {
    const holdingsMap = {};

    // Sort transactions chronologically to calculate avg cost correctly
    const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedTx.forEach(tx => {
      const sym = tx.symbol.toUpperCase();
      if (!holdingsMap[sym]) {
        holdingsMap[sym] = {
          symbol: tx.symbol,
          name: tx.name,
          quantity: 0,
          totalCostVnd: 0,
          category: tx.category || 'Khác',
          isVnd: tx.isVnd
        };
      }

      const holding = holdingsMap[sym];

      if (tx.type === 'BUY') {
        const costVnd = toVnd(tx.price, tx.isVnd);
        const addedValueVnd = tx.quantity * costVnd;
        holding.totalCostVnd += addedValueVnd;
        holding.quantity += tx.quantity;
      } else if (tx.type === 'SELL') {
        const avgCostVnd = holding.quantity > 0 ? holding.totalCostVnd / holding.quantity : 0;
        holding.quantity = Math.max(0, holding.quantity - tx.quantity);
        holding.totalCostVnd = holding.quantity * avgCostVnd; // cost basis scales down
      }
    });

    // Map current market prices & compute metrics
    return Object.values(holdingsMap)
      .filter(h => h.quantity > 0) // only active holdings
      .map(h => {
        const liveAsset = marketPrices.find(p => p.symbol.toUpperCase() === h.symbol.toUpperCase());
        const currentPrice = liveAsset ? liveAsset.price : (h.totalCostVnd / h.quantity) / (h.isVnd ? 1 : usdVndRate); // fallback
        const currentPriceVnd = toVnd(currentPrice, h.isVnd);
        const totalValueVnd = h.quantity * currentPriceVnd;
        const avgCostVnd = h.quantity > 0 ? h.totalCostVnd / h.quantity : 0;
        const pnlVnd = totalValueVnd - h.totalCostVnd;
        const pnlPercent = h.totalCostVnd > 0 ? (pnlVnd / h.totalCostVnd) * 100 : 0;

        return {
          ...h,
          currentPrice,
          currentPriceVnd,
          totalValueVnd,
          avgCostVnd,
          pnlVnd,
          pnlPercent
        };
      });
  };

  const holdings = calculateHoldings();

  // Compute Portfolio Summary Metrics
  const totalCostVnd = holdings.reduce((sum, h) => sum + h.totalCostVnd, 0);
  const totalValueVnd = holdings.reduce((sum, h) => sum + h.totalValueVnd, 0);
  const totalPnlVnd = totalValueVnd - totalCostVnd;
  const totalPnlPercent = totalCostVnd > 0 ? (totalPnlVnd / totalCostVnd) * 100 : 0;

  // Handle auto-populating Asset Name & category from predefined marketPrices
  useEffect(() => {
    if (txSymbol) {
      const match = marketPrices.find(p => p.symbol.toUpperCase() === txSymbol.toUpperCase());
      if (match && match.price) {
        setTxPrice(match.price);
      }
    }
  }, [txSymbol, marketPrices]);

  // Handle Add Transaction Submit
  const handleAddTransaction = (e) => {
    e.preventDefault();
    setFormError('');

    const symbolUpper = txSymbol.trim().toUpperCase();
    if (!symbolUpper) {
      setFormError('Vui lòng nhập hoặc chọn mã tài sản.');
      return;
    }

    const qty = parseFloat(txQuantity);
    if (isNaN(qty) || qty <= 0) {
      setFormError('Số lượng phải lớn hơn 0.');
      return;
    }

    const price = parseFloat(txPrice);
    if (isNaN(price) || price <= 0) {
      setFormError('Đơn giá giao dịch phải lớn hơn 0.');
      return;
    }

    // Auto-detect attributes from predefined list or formats
    const match = marketPrices.find(p => p.symbol.toUpperCase() === symbolUpper);
    const isVnd = checkIsVnd(symbolUpper);
    const name = match ? match.name : symbolUpper;
    let category = match ? match.category : 'Khác';

    if (!match) {
      // Custom typed symbol category detection
      const cryptoSuffixes = ['-USD', '-USDT', '-BTC'];
      if (cryptoSuffixes.some(s => symbolUpper.includes(s))) category = 'Crypto';
      else if (symbolUpper.endsWith('.VN')) category = 'Chứng khoán VN';
      else if (symbolUpper.endsWith('.HM')) category = 'ETF & Quỹ';
      else if (symbolUpper.endsWith('=X') || symbolUpper.endsWith('=F')) category = 'Hàng hóa & Tỷ giá';
      else category = 'Chứng khoán Mỹ';
    }

    // Sell validation
    if (txType === 'SELL') {
      const currentHoldingQty = holdings.find(h => h.symbol.toUpperCase() === symbolUpper)?.quantity || 0;
      if (qty > currentHoldingQty) {
        setFormError(`Số dư không đủ để bán. Số lượng nắm giữ hiện tại của ${symbolUpper} là ${currentHoldingQty}.`);
        return;
      }
    }

    const newTx = {
      id: 'tx-' + Date.now(),
      symbol: symbolUpper,
      name,
      type: txType,
      quantity: qty,
      price,
      date: txDate,
      category,
      isVnd
    };

    setTransactions(prev => {
      // Tự động xóa sạch dữ liệu mẫu (seed-1, seed-2) khi người dùng thêm giao dịch thật đầu tiên
      const isOnlySeed = prev.length > 0 && prev.every(t => 
        !t.id || 
        String(t.id).startsWith('seed-') || 
        t.id === 'tx-1' || 
        t.id === 'tx-2' ||
        (t.symbol === 'FPT.VN' && t.quantity === 500) ||
        (t.symbol === 'BTC-USD' && t.quantity === 0.05)
      );
      const base = isOnlySeed ? [] : prev;
      return [newTx, ...base];
    });

    // Reset Form
    setTxSymbol('');
    setTxType('BUY');
    setTxQuantity('');
    setTxPrice('');
    setTxDate(new Date().toISOString().split('T')[0]);
    setIsAddModalOpen(false);
  };

  // Delete transaction
  const handleDeleteTransaction = (id) => {
    const txToDelete = transactions.find(t => t.id === id);
    if (txToDelete && txToDelete.type === 'BUY') {
      // If deleting a BUY transaction, make sure it doesn't cause negative holdings
      const sym = txToDelete.symbol.toUpperCase();
      const txsWithoutThis = transactions.filter(t => t.id !== id);
      
      // Calculate holdings with remaining txs
      const holdingsMap = {};
      const sortedRemaining = [...txsWithoutThis].sort((a, b) => new Date(a.date) - new Date(b.date));
      let isNegative = false;

      for (let tx of sortedRemaining) {
        if (tx.symbol.toUpperCase() === sym) {
          if (!holdingsMap[sym]) holdingsMap[sym] = 0;
          if (tx.type === 'BUY') holdingsMap[sym] += tx.quantity;
          else {
            holdingsMap[sym] -= tx.quantity;
            if (holdingsMap[sym] < 0) {
              isNegative = true;
              break;
            }
          }
        }
      }
      
      if (isNegative) {
        alert('Không thể xóa giao dịch này vì sẽ gây ra số dư âm cho tài sản ở các giao dịch bán tiếp theo.');
        return;
      }
    }

    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Clear all transactions
  const handleResetPortfolio = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử giao dịch và làm trống danh mục này không?')) {
      setTransactions([]);
    }
  };

  // Prepare Doughnut Chart Data
  const getChartData = () => {
    if (holdings.length === 0) return null;

    const dataMap = {};
    if (chartMode === 'category') {
      holdings.forEach(h => {
        dataMap[h.category] = (dataMap[h.category] || 0) + h.totalValueVnd;
      });
    } else {
      holdings.forEach(h => {
        dataMap[h.symbol] = (dataMap[h.symbol] || 0) + h.totalValueVnd;
      });
    }

    const labels = Object.keys(dataMap);
    const data = Object.values(dataMap);
    const total = data.reduce((a, b) => a + b, 0);
    const percentages = data.map(v => ((v / total) * 100).toFixed(1));

    return {
      labels: labels.map((l, idx) => `${l} (${percentages[idx]}%)`),
      datasets: [
        {
          data: data,
          backgroundColor: [
            'rgba(16, 185, 129, 0.75)', // emerald
            'rgba(14, 165, 233, 0.75)', // sky
            'rgba(245, 158, 11, 0.75)', // amber
            'rgba(139, 92, 246, 0.75)', // violet
            'rgba(236, 72, 153, 0.75)', // pink
            'rgba(239, 68, 68, 0.75)',  // red
            'rgba(59, 130, 246, 0.75)',  // blue
            'rgba(107, 114, 128, 0.75)'  // gray
          ],
          borderColor: '#0f172a',
          borderWidth: 2,
          hoverOffset: 12
        }
      ]
    };
  };

  const chartData = getChartData();
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#cbd5e1',
          font: { size: 10, family: 'Inter' },
          boxWidth: 12,
          padding: 10
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label.split(' (')[0] || '';
            const val = context.raw;
            return ` ${label}: ${formatPortfolioVal(val)}`;
          }
        }
      }
    },
    cutout: '65%'
  };

  const filteredSuggestions = marketPrices.filter(p => {
    const query = txSymbol.toLowerCase().trim();
    if (!query) return true;
    return (
      p.symbol.toLowerCase().includes(query) ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10 text-slate-200">
      
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald-400" />
            Danh mục tài sản ảo (Portfolio)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ghi nhận số dư thực tế hoặc giao dịch để tự động theo dõi biến động lãi/lỗ thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setDisplayCurrency('VND')}
              className={`text-[10px] font-bold py-1 px-3 rounded-md transition-all ${
                displayCurrency === 'VND' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              VND
            </button>
            <button
              onClick={() => setDisplayCurrency('USD')}
              className={`text-[10px] font-bold py-1 px-3 rounded-md transition-all ${
                displayCurrency === 'USD' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              USD
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:opacity-90 font-semibold py-1.5 px-3 rounded-lg text-xs cursor-pointer shadow-lg shadow-emerald-500/10 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            Giao dịch mới
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Net Worth Card */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng tài sản ròng (Net Worth)</span>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-100 font-mono">
              {formatPortfolioVal(totalValueVnd)}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
            <span>Tỷ giá quy đổi USD/VND:</span>
            <span className="text-slate-300 font-semibold">{usdVndRate.toLocaleString('vi-VN')} đ</span>
          </div>
        </div>

        {/* Total Cost Card */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng vốn đầu tư</span>
          <div className="mt-2.5">
            <span className="text-xl font-bold text-slate-100 font-mono">
              {formatPortfolioVal(totalCostVnd)}
            </span>
          </div>
          <span className="mt-1.5 text-[10px] text-slate-500 block">Quy đổi từ giá mua ghi nhận ban đầu</span>
        </div>

        {/* Total P&L Card */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng Lợi nhuận / Lỗ (P&L)</span>
          <div className="mt-2.5 flex items-center justify-between">
            <span className={`text-xl font-bold font-mono flex items-center ${
              totalPnlVnd >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {totalPnlVnd >= 0 ? '+' : ''}{formatPortfolioVal(totalPnlVnd)}
            </span>
            <span className={`text-xs font-bold py-0.5 px-2 rounded-lg flex items-center gap-0.5 ${
              totalPnlVnd >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {totalPnlVnd >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {totalPnlVnd >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%
            </span>
          </div>
          <span className="mt-1.5 text-[10px] text-slate-500 block">Được cập nhật tự động theo giá thị trường real-time</span>
        </div>
      </div>

      {/* 3. Main content area: Charts and List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Doughnut Allocation Chart */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Cơ cấu phân bổ tài sản</h3>
            
            <div className="flex items-center bg-slate-950/60 border border-slate-850 rounded-lg p-0.5">
              <button
                onClick={() => setChartMode('category')}
                className={`text-[9px] font-bold py-0.5 px-2 rounded transition-all ${
                  chartMode === 'category' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Danh mục
              </button>
              <button
                onClick={() => setChartMode('asset')}
                className={`text-[9px] font-bold py-0.5 px-2 rounded transition-all ${
                  chartMode === 'asset' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Mã tài sản
              </button>
            </div>
          </div>

          <div className="relative flex-1 min-h-[220px] flex items-center justify-center">
            {chartData ? (
              <Doughnut key={`portfolio-doughnut-${chartMode}-${transactions.length}`} data={chartData} options={chartOptions} />
            ) : (
              <div className="text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                <Briefcase className="h-8 w-8 text-slate-600 stroke-[1.5]" />
                Chưa có dữ liệu giao dịch để phân tích cơ cấu.
              </div>
            )}
          </div>
        </div>

        {/* Table & Tabs Container */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-4">
          {/* Subtabs header */}
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveSubTab('holdings')}
                className={`text-xs font-bold pb-2.5 transition-all relative border-b-2 ${
                  activeSubTab === 'holdings' 
                    ? 'border-emerald-500 text-emerald-400 font-bold' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Tài sản nắm giữ ({holdings.length})
              </button>
              <button
                onClick={() => setActiveSubTab('history')}
                className={`text-xs font-bold pb-2.5 transition-all relative border-b-2 ${
                  activeSubTab === 'history' 
                    ? 'border-emerald-500 text-emerald-400 font-bold flex items-center gap-1.5' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1.5'
                }`}
              >
                <History className="h-3.5 w-3.5" />
                Lịch sử giao dịch ({transactions.length})
              </button>
            </div>

            {transactions.length > 0 && (
              <button
                onClick={handleResetPortfolio}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-medium py-1 px-2 rounded hover:bg-rose-500/10 transition-all flex items-center gap-1"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Subtab content: Holdings */}
          {activeSubTab === 'holdings' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-400 font-semibold">
                    <th className="py-2.5 px-2">Tài sản</th>
                    <th className="py-2.5 px-2 text-right">Số lượng</th>
                    <th className="py-2.5 px-2 text-right">Giá vốn TB</th>
                    <th className="py-2.5 px-2 text-right">Thị giá</th>
                    <th className="py-2.5 px-2 text-right">Giá trị</th>
                    <th className="py-2.5 px-2 text-right">Lãi/Lỗ tạm tính</th>
                    <th className="py-2.5 px-2 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60">
                  {holdings.length > 0 ? (
                    holdings.map((h) => {
                      const costVal = displayCurrency === 'VND' ? h.totalCostVnd : h.totalCostVnd / usdVndRate;
                      const currentVal = displayCurrency === 'VND' ? h.totalValueVnd : h.totalValueVnd / usdVndRate;
                      
                      return (
                        <tr key={h.symbol} className="hover:bg-slate-900/30 transition-all group">
                          {/* Symbol & Name */}
                          <td className="py-3 px-2">
                            <div className="font-semibold text-slate-100 font-mono group-hover:text-emerald-400 transition-colors">
                              {h.symbol}
                            </div>
                            <div className="text-[10px] text-slate-500 max-w-[120px] truncate">{h.name}</div>
                          </td>
                          {/* Quantity */}
                          <td className="py-3 px-2 text-right font-mono font-medium text-slate-300">
                            {h.quantity.toLocaleString('en-US', { maximumFractionDigits: 6 })}
                          </td>
                          {/* Avg Cost */}
                          <td className="py-3 px-2 text-right font-mono text-slate-400">
                            {displayCurrency === 'VND' 
                              ? formatVal(h.avgCostVnd, true, true) 
                              : formatVal(h.avgCostVnd / usdVndRate, false, false)
                            }
                          </td>
                          {/* Market Price */}
                          <td className="py-3 px-2 text-right font-mono text-slate-300">
                            {displayCurrency === 'VND'
                              ? formatVal(h.currentPriceVnd, true, true)
                              : formatVal(h.currentPriceVnd / usdVndRate, false, false)
                            }
                          </td>
                          {/* Current Value */}
                          <td className="py-3 px-2 text-right font-semibold font-mono text-slate-100">
                            {formatPortfolioVal(h.totalValueVnd)}
                          </td>
                          {/* P&L */}
                          <td className="py-3 px-2 text-right">
                            <span className={`font-semibold font-mono text-[11px] block ${
                              h.pnlVnd >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {h.pnlVnd >= 0 ? '+' : ''}{formatPortfolioVal(h.pnlVnd)}
                            </span>
                            <span className={`text-[9px] font-mono block ${
                              h.pnlVnd >= 0 ? 'text-emerald-500/80' : 'text-rose-500/80'
                            }`}>
                              {h.pnlVnd >= 0 ? '+' : ''}{h.pnlPercent.toFixed(2)}%
                            </span>
                          </td>
                          {/* Actions */}
                          <td className="py-3 px-2 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setTxSymbol(h.symbol);
                                  setTxType('BUY');
                                  setIsAddModalOpen(true);
                                }}
                                className="text-[10px] text-emerald-400 hover:text-slate-950 hover:bg-emerald-400 py-0.5 px-2 rounded border border-emerald-500/20 group-hover:border-emerald-400 transition-all font-medium cursor-pointer"
                              >
                                Mua
                              </button>
                              <button
                                onClick={() => {
                                  setTxSymbol(h.symbol);
                                  setTxType('SELL');
                                  setIsAddModalOpen(true);
                                }}
                                className="text-[10px] text-rose-400 hover:text-slate-950 hover:bg-rose-400 py-0.5 px-2 rounded border border-rose-500/20 group-hover:border-rose-400 transition-all font-medium cursor-pointer"
                              >
                                Bán
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-slate-500 text-xs">
                        Chưa nắm giữ tài sản nào. Ghi nhận giao dịch để theo dõi số dư!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Subtab content: History */}
          {activeSubTab === 'history' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-400 font-semibold">
                    <th className="py-2.5 px-2">Ngày</th>
                    <th className="py-2.5 px-2">Tài sản</th>
                    <th className="py-2.5 px-2 text-center">Loại</th>
                    <th className="py-2.5 px-2 text-right">Số lượng</th>
                    <th className="py-2.5 px-2 text-right">Giá giao dịch</th>
                    <th className="py-2.5 px-2 text-right">Tổng giá trị</th>
                    <th className="py-2.5 px-2 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60 font-mono">
                  {transactions.length > 0 ? (
                    transactions.map((tx) => {
                      const totalValue = tx.quantity * tx.price;
                      return (
                        <tr key={tx.id} className="hover:bg-slate-900/30 transition-all">
                          <td className="py-3 px-2 text-slate-400 text-[11px]">{tx.date}</td>
                          <td className="py-3 px-2">
                            <span className="font-semibold text-slate-100 font-mono block">{tx.symbol}</span>
                            <span className="text-[9px] text-slate-500 normal-case font-sans block">{tx.name}</span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className={`text-[9px] font-extrabold py-0.5 px-1.5 rounded-md ${
                              tx.type === 'BUY' 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {tx.type === 'BUY' ? 'MUA' : 'BÁN'}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right font-medium text-slate-300">
                            {tx.quantity.toLocaleString('en-US', { maximumFractionDigits: 6 })}
                          </td>
                          <td className="py-3 px-2 text-right text-slate-400">
                            {tx.isVnd ? formatVal(tx.price, true, true) : formatVal(tx.price, false, false)}
                          </td>
                          <td className="py-3 px-2 text-right font-semibold text-slate-100">
                            {tx.isVnd ? formatVal(totalValue, true, true) : formatVal(totalValue, false, false)}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <button
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                              title="Xóa giao dịch này"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-slate-500 text-xs">
                        Chưa ghi nhận giao dịch nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 4. Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative flex flex-col gap-4 animate-scaleUp">
            
            <button 
              onClick={() => {
                setIsAddModalOpen(false);
                setFormError('');
                setShowSuggestions(false);
              }}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 p-1"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-400" />
              Ghi nhận giao dịch tài sản
            </h3>
            
            <form onSubmit={handleAddTransaction} className="flex flex-col gap-3.5 mt-2">
              
              {/* Asset Symbol Select / Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Chọn mã tài sản</label>
                <div className="relative">
                  <input
                    type="text"
                    value={txSymbol}
                    onChange={(e) => setTxSymbol(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setShowSuggestions(false)}
                    placeholder="Nhập mã (Ví dụ: FPT.VN, BTC-USD, SPY)"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs focus:outline-none text-slate-100 font-mono transition-all animate-none"
                    required
                    autoComplete="off"
                  />
                  {showSuggestions && (
                    <div className="absolute left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-slate-950 border border-slate-850 rounded-xl z-50 shadow-2xl divide-y divide-slate-900/60 scrollbar-none">
                      {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map(p => (
                          <div
                            key={p.symbol}
                            onMouseDown={() => {
                              setTxSymbol(p.symbol);
                              setShowSuggestions(false);
                            }}
                            className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-900 cursor-pointer transition-all duration-150"
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="text-[11.5px] font-bold text-emerald-400 font-mono truncate">{p.symbol}</span>
                              <span className="text-[10px] text-slate-400 truncate max-w-[200px]">{p.name}</span>
                            </div>
                            <span className="text-[9px] font-extrabold text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800/60 uppercase tracking-wide shrink-0">
                              {p.category}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="px-3.5 py-3 text-center text-slate-500 text-[10px]">
                          Không tìm thấy tài sản khớp. 
                          <span className="block text-[9px] text-slate-600 mt-0.5">Nhấn Enter để tự nhập mã tự do.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* BUY / SELL Switch */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Loại giao dịch</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 border border-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTxType('BUY')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      txType === 'BUY' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    MUA
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('SELL')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      txType === 'SELL' 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    BÁN
                  </button>
                </div>
              </div>

              {/* Quantity & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Số lượng</label>
                  <input
                    type="number"
                    step="any"
                    value={txQuantity}
                    onChange={(e) => setTxQuantity(e.target.value)}
                    placeholder="Ví dụ: 500 hoặc 0.05"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs focus:outline-none text-slate-100 font-mono transition-all"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Đơn giá ({checkIsVnd(txSymbol) ? 'VND' : 'USD'})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={txPrice}
                    onChange={(e) => setTxPrice(e.target.value)}
                    placeholder="Giá giao dịch"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs focus:outline-none text-slate-100 font-mono transition-all"
                    required
                  />
                </div>
              </div>

              {/* Transaction Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Ngày giao dịch</label>
                <input
                  type="date"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs focus:outline-none text-slate-100 font-mono transition-all"
                  required
                />
              </div>

              {/* Error log if validation fails */}
              {formError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] p-2.5 rounded-xl flex items-start gap-1.5 font-sans">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Submit Controls */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 font-semibold py-2 px-4 rounded-xl text-slate-950 text-xs mt-2 cursor-pointer shadow-lg shadow-emerald-500/10 transition-all"
              >
                Ghi nhận giao dịch
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
