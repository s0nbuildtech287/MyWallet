import React, { useState, useEffect, useRef } from 'react';

// Import Modular Pages
import Overview from './pages/Overview';
import AssetDetails from './pages/AssetDetails';
import Simulator from './pages/Simulator';
import InterestCalculator from './pages/InterestCalculator';
import News from './pages/News';
import Guides from './pages/Guides';
import Portfolio from './pages/Portfolio';
import Comparison from './pages/Comparison';

// Import Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Import Constants
import { MACRO_INDICES, MARKET_ASSETS, PRESET_SYMBOLS } from './constants';

// Import Utils
import { formatValSymbol, formatVal, formatVolumeHelper } from './utils/formatters';
import { crosshairPlugin } from './utils/crosshairPlugin';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'asset-details' | 'simulator' | 'interest' | 'news'
  const [globalSearch, setGlobalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [overviewPage, setOverviewPage] = useState(1);
  const overviewItemsPerPage = 10;
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Live prices
  const [marketPrices, setMarketPrices] = useState(MARKET_ASSETS);
  const [macroIndices, setMacroIndices] = useState(MACRO_INDICES);

  // Asset details page
  const [selectedDetailSymbol, setSelectedDetailSymbol] = useState('FPT.VN');
  const [detailRange, setDetailRange] = useState('1Y');
  const [detailData, setDetailData] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Compound interest page
  const [interestInit, setInterestInit] = useState('10000000');
  const [interestMonthly, setInterestMonthly] = useState('2000000');
  const [interestRate, setInterestRate] = useState('8');
  const [interestYears, setInterestYears] = useState('10');
  const [interestResults, setInterestResults] = useState(null);

  // Simulator Backtest states
  const [symbol, setSymbol] = useState('BTC-USD');
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [investMode, setInvestMode] = useState('dca-qty');
  const [inputValue, setInputValue] = useState('100');
  const [reinvestDividends, setReinvestDividends] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  // Simple Hash-based Router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      const validTabs = ['overview', 'portfolio', 'asset-details', 'comparison', 'simulator', 'interest', 'news', 'guides'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      } else {
        // Mặc định chuyển hướng về /#/overview nếu đường dẫn trống/lỗi
        window.location.hash = '#/overview';
        setActiveTab('overview');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeTab = (tabName) => {
    window.location.hash = `#/${tabName}`;
  };

  const symUpperDca = symbol.toUpperCase();
  const isVndAsset = symUpperDca.endsWith('.VN') || symUpperDca.endsWith('.HM') || symUpperDca === 'USDVND=X';

  // Refs to prevent stale closure in intervals
  const marketPricesRef = useRef(marketPrices);
  const macroIndicesRef = useRef(macroIndices);

  useEffect(() => {
    marketPricesRef.current = marketPrices;
  }, [marketPrices]);

  useEffect(() => {
    macroIndicesRef.current = macroIndices;
  }, [macroIndices]);

  // Fetch real-time prices from Yahoo Finance via backend proxy
  const fetchRealtimePrices = async () => {
    try {
      const assetSymbols = marketPricesRef.current.map(a => a.symbol);
      const indexSymbols = macroIndicesRef.current.map(a => a.symbol);
      const uniqueSymbols = Array.from(new Set([...assetSymbols, ...indexSymbols]));
      if (uniqueSymbols.length === 0) return;

      const response = await fetch(`http://localhost:5001/api/live-prices?symbols=${uniqueSymbols.join(',')}`);
      if (!response.ok) throw new Error('API server returned error');
      const data = await response.json();

      if (Array.isArray(data)) {
        setMarketPrices(prev => prev.map(item => {
          const live = data.find(l => l.symbol.toUpperCase() === item.symbol.toUpperCase() && l.success);
          if (live && typeof live.price === 'number' && !isNaN(live.price)) {
            const isVnd = item.isVnd;
            const newPrice = isVnd ? Math.round(live.price) : parseFloat(live.price.toFixed(2));
            const priceDiff = newPrice - item.price;
            const tick = priceDiff > 0 ? 'up' : priceDiff < 0 ? 'down' : null;
            const formattedVol = formatVolumeHelper(live.volume, isVnd);
            return {
              ...item,
              price: newPrice,
              change: typeof live.change === 'number' ? live.change : item.change,
              volume: formattedVol,
              details: {
                ...item.details,
                volume: formattedVol,
                high52: live.high52 ?? item.details?.high52 ?? null,
                low52: live.low52 ?? item.details?.low52 ?? null,
                marketCap: live.marketCap ?? item.details?.marketCap ?? null,
              },
              tick
            };
          }
          return item;
        }));

        setMacroIndices(prev => prev.map(item => {
          const live = data.find(l => l.symbol.toUpperCase() === item.symbol.toUpperCase() && l.success);
          if (live && typeof live.price === 'number' && !isNaN(live.price)) {
            const newPrice = parseFloat(live.price.toFixed(2));
            const priceDiff = newPrice - item.price;
            const tick = priceDiff > 0 ? 'up' : priceDiff < 0 ? 'down' : null;
            return {
              ...item,
              price: newPrice,
              change: typeof live.change === 'number' ? live.change : item.change,
              tick
            };
          }
          return item;
        }));
      }
    } catch (err) {
      console.error('Failed to fetch real-time prices:', err);
    }
  };

  // Fetch market cap separately via quoteSummary endpoint (batch mode)
  const fetchMarketCaps = async () => {
    try {
      const symbols = marketPricesRef.current.map(a => a.symbol);
      if (symbols.length === 0) return;

      // Batch 10 symbols per request to avoid rate limit
      const batchSize = 10;
      for (let i = 0; i < symbols.length; i += batchSize) {
        const batch = symbols.slice(i, i + batchSize);
        const response = await fetch(`http://localhost:5001/api/market-cap?symbols=${batch.join(',')}`);
        if (!response.ok) continue;
        const data = await response.json();

        if (Array.isArray(data)) {
          setMarketPrices(prev => prev.map(item => {
            const capData = data.find(d => d.symbol.toUpperCase() === item.symbol.toUpperCase() && d.success);
            if (capData && capData.marketCap) {
              return {
                ...item,
                details: { ...item.details, marketCap: capData.marketCap }
              };
            }
            return item;
          }));
        }

        // Delay 500ms between batches to be polite to Yahoo API
        if (i + batchSize < symbols.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (err) {
      console.error('Failed to fetch market caps:', err);
    }
  };

  // Poll real-time prices every 30 seconds
  useEffect(() => {
    fetchRealtimePrices();
    const interval = setInterval(fetchRealtimePrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch market caps once on mount, refresh every 5 minutes
  useEffect(() => {
    // Delay slightly so live prices load first
    const timeout = setTimeout(fetchMarketCaps, 3000);
    const interval = setInterval(fetchMarketCaps, 5 * 60 * 1000);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, []);

  // Live ticker ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrices(prev => prev.map(item => {
        const factor = (Math.random() - 0.5) * 0.003;
        const rawNewPrice = item.price * (1 + factor);
        let newPrice = rawNewPrice;
        if (item.isVnd) {
          newPrice = Math.round(rawNewPrice / 50) * 50; 
        } else {
          newPrice = parseFloat(rawNewPrice.toFixed(2));
        }
        const priceDiff = newPrice - item.price;
        const tick = priceDiff > 0 ? 'up' : priceDiff < 0 ? 'down' : null;
        return { ...item, price: newPrice, tick };
      }));

      setMacroIndices(prev => prev.map(item => {
        const factor = (Math.random() - 0.5) * 0.002;
        const newPrice = item.price * (1 + factor);
        const priceDiff = newPrice - item.price;
        const tick = priceDiff > 0 ? 'up' : priceDiff < 0 ? 'down' : null;
        return { ...item, price: parseFloat(newPrice.toFixed(2)), tick };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMarketPrices(prev => prev.map(item => ({ ...item, tick: null })));
      setMacroIndices(prev => prev.map(item => ({ ...item, tick: null })));
    }, 800);
    return () => clearTimeout(timeout);
  }, [marketPrices, macroIndices]);

  useEffect(() => {
    if (investMode === 'dca-qty') {
      setInputValue(isVndAsset ? '100' : '10');
    } else {
      setInputValue(isVndAsset ? '1000000' : '100');
    }
  }, [investMode, symbol]);

  useEffect(() => {
    let intervalId;
    if (activeTab === 'asset-details') {
      fetchAssetDetailChart(false);
      
      // Tự động cập nhật dữ liệu biểu đồ sau mỗi 15 giây
      intervalId = setInterval(() => {
        fetchAssetDetailChart(true);
      }, 15000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedDetailSymbol, detailRange, activeTab]);

  useEffect(() => {
    calculateCompoundInterest();
  }, [interestInit, interestMonthly, interestRate, interestYears]);

  const fetchAssetDetailChart = async (isSilent = false) => {
    if (!isSilent) setDetailLoading(true);
    let queryRange = '1y'; // Mặc định 1Y
    let interval = '1d';
    
    if (detailRange === '1D') {
      queryRange = '1d';
      interval = '5m';
    } else if (detailRange === '5D') {
      queryRange = '5d';
      interval = '15m';
    } else if (detailRange === '1M') {
      queryRange = '1mo';
      interval = '1d';
    } else if (detailRange === '3M') {
      queryRange = '3mo';
      interval = '1d';
    } else if (detailRange === '6M') {
      queryRange = '6mo';
      interval = '1d';
    } else if (detailRange === '1Y') {
      queryRange = '1y';
      interval = '1d';
    } else if (detailRange === '5Y') {
      queryRange = '5y';
      interval = '1wk';
    } else if (detailRange === 'ALL') {
      queryRange = 'max';
      interval = '1mo';
    }

    try {
      const response = await fetch(`http://localhost:5001/api/chart?symbol=${selectedDetailSymbol.toUpperCase()}&range=${queryRange}&interval=${interval}`);
      const data = await response.json();
      if (!data.chart || !data.chart.result) throw new Error('Failed to load chart');
      
      const result = data.chart.result[0];
      const timestamps = result.timestamp || [];
      const quote = result.indicators.quote[0] || {};
      const opens = quote.open || [];
      const highs = quote.high || [];
      const lows = quote.low || [];
      const closes = quote.close || [];
      const volumes = quote.volume || [];
      
      const chartPoints = [];
      for (let i = 0; i < timestamps.length; i++) {
        if (timestamps[i] && closes[i] !== null && closes[i] !== undefined) {
          const dateObj = new Date(timestamps[i] * 1000);
          let formattedDate = '';
          
          if (detailRange === '1D') {
            formattedDate = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
          } else if (detailRange === '5D') {
            formattedDate = dateObj.toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' }) + ' ' + 
                            dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
          } else if (detailRange === '1M' || detailRange === '3M' || detailRange === '6M') {
            formattedDate = dateObj.toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' });
          } else {
            formattedDate = dateObj.toLocaleDateString('vi-VN', { year: 'numeric', month: 'numeric' });
          }

          const cVal = closes[i];
          const oVal = opens[i] !== null && opens[i] !== undefined ? opens[i] : cVal;
          const hVal = highs[i] !== null && highs[i] !== undefined ? highs[i] : Math.max(oVal, cVal);
          const lVal = lows[i] !== null && lows[i] !== undefined ? lows[i] : Math.min(oVal, cVal);

          chartPoints.push({
            date: formattedDate,
            price: cVal,
            open: oVal,
            high: hVal,
            low: lVal,
            close: cVal,
            volume: volumes[i] || 0
          });
        }
      }
      setDetailData(chartPoints);
    } catch (e) {
      console.error(e);
      setDetailData([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const calculateCompoundInterest = () => {
    const init = parseFloat(interestInit) || 0;
    const monthly = parseFloat(interestMonthly) || 0;
    const rate = (parseFloat(interestRate) || 0) / 100 / 12;
    const years = parseInt(interestYears) || 0;
    const totalMonths = years * 12;

    let balance = init;
    let totalInvested = init;
    const yearlyBreakdown = [];

    for (let month = 1; month <= totalMonths; month++) {
      balance = (balance + monthly) * (1 + rate);
      totalInvested += monthly;

      if (month % 12 === 0) {
        const year = month / 12;
        yearlyBreakdown.push({
          year: `Năm ${year}`,
          totalInvested: Math.round(totalInvested),
          totalBalance: Math.round(balance),
          interestEarned: Math.round(balance - totalInvested)
        });
      }
    }

    setInterestResults({
      finalBalance: Math.round(balance),
      totalInvested: Math.round(totalInvested),
      interestEarned: Math.round(balance - totalInvested),
      yearlyBreakdown
    });
  };

  const handleQuickSimulation = (targetSymbol) => {
    setSymbol(targetSymbol);
    changeTab('simulator');
    setResults(null);
  };

  const handleOpenAssetDetails = (targetSymbol) => {
    setSelectedDetailSymbol(targetSymbol);
    changeTab('asset-details');
  };


  const handleSimulate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    const p1 = Math.floor(new Date(startDate).getTime() / 1000);
    const p2 = Math.floor(new Date(endDate).getTime() / 1000);
    
    if (isNaN(p1) || isNaN(p2) || p1 >= p2) {
      setError('Thời gian bắt đầu phải trước thời gian kết thúc.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/chart?symbol=${symbol.toUpperCase()}&period1=${p1}&period2=${p2}&events=div`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        throw new Error('Không có dữ liệu hợp lệ cho mã tài sản này.');
      }

      const result = data.chart.result[0];
      const timestamps = result.timestamp || [];
      const closes = result.indicators.quote[0].close || [];

      const dailyPrices = [];
      for (let i = 0; i < timestamps.length; i++) {
        if (timestamps[i] && closes[i] !== null && closes[i] !== undefined) {
          dailyPrices.push({
            date: new Date(timestamps[i] * 1000),
            close: closes[i]
          });
        }
      }

      if (dailyPrices.length === 0) {
        throw new Error('Không có dữ liệu giá đóng cửa trong khoảng thời gian này.');
      }

      let totalInvested = 0;
      let totalShares = 0;
      let totalDividendsReceived = 0;
      const purchases = [];
      const inputNum = parseFloat(inputValue.replace(/,/g, '')) || 0;

      if (inputNum <= 0) {
        throw new Error('Vui lòng nhập giá trị đầu tư hợp lệ (lớn hơn 0).');
      }

      const currentPrice = dailyPrices[dailyPrices.length - 1].close;

      // Extract dividends
      const dividendsData = result.events?.dividends || {};
      const dividends = Object.values(dividendsData).map(div => ({
        date: new Date(div.date * 1000),
        amount: div.amount
      })).sort((a, b) => a.date - b.date);

      let divIndex = 0;
      let count = 0;

      if (investMode === 'lump-sum') {
        const entryPrice = dailyPrices[0].close;
        totalInvested = inputNum;
        totalShares = inputNum / entryPrice;
        count++;

        purchases.push({
          index: count,
          date: dailyPrices[0].date,
          price: entryPrice,
          amountSpent: inputNum,
          sharesBought: totalShares,
          totalShares: totalShares,
          totalCost: inputNum,
          portfolioValue: totalShares * entryPrice
        });

        for (let i = 1; i < dailyPrices.length; i++) {
          const prevDate = dailyPrices[i - 1].date;
          const currDate = dailyPrices[i].date;
          const price = dailyPrices[i].close;

          while (divIndex < dividends.length && dividends[divIndex].date > prevDate && dividends[divIndex].date <= currDate) {
            const div = dividends[divIndex];
            if (totalShares > 0) {
              const payout = totalShares * div.amount;
              totalDividendsReceived += payout;
              
              if (reinvestDividends) {
                const sharesBoughtFromDiv = payout / price;
                totalShares += sharesBoughtFromDiv;
                count++;
                purchases.push({
                  index: count,
                  date: div.date,
                  price: price,
                  amountSpent: 0,
                  sharesBought: sharesBoughtFromDiv,
                  totalShares: totalShares,
                  totalCost: totalInvested,
                  portfolioValue: totalShares * price,
                  isDividend: true,
                  dividendAmount: div.amount,
                  dividendPayout: payout
                });
              }
            }
            divIndex++;
          }
        }

        // Final entry
        count++;
        purchases.push({
          index: count,
          date: dailyPrices[dailyPrices.length - 1].date,
          price: currentPrice,
          amountSpent: 0,
          sharesBought: 0,
          totalShares: totalShares,
          totalCost: totalInvested,
          portfolioValue: totalShares * currentPrice
        });

      } else if (investMode === 'dca-amount') {
        let lastMonthStr = '';
        for (let i = 0; i < dailyPrices.length; i++) {
          const item = dailyPrices[i];
          const prevDate = i > 0 ? dailyPrices[i - 1].date : new Date(item.date.getTime() - 24 * 60 * 60 * 1000);
          const price = item.close;

          const monthStr = `${item.date.getFullYear()}-${item.date.getMonth()}`;
          if (monthStr !== lastMonthStr) {
            count++;
            const sharesBought = inputNum / price;
            totalInvested += inputNum;
            totalShares += sharesBought;

            purchases.push({
              index: count,
              date: item.date,
              price: price,
              amountSpent: inputNum,
              sharesBought: sharesBought,
              totalShares: totalShares,
              totalCost: totalInvested,
              portfolioValue: totalShares * price
            });
            lastMonthStr = monthStr;
          }

          while (divIndex < dividends.length && dividends[divIndex].date > prevDate && dividends[divIndex].date <= item.date) {
            const div = dividends[divIndex];
            if (totalShares > 0) {
              const payout = totalShares * div.amount;
              totalDividendsReceived += payout;
              
              if (reinvestDividends) {
                const sharesBoughtFromDiv = payout / price;
                totalShares += sharesBoughtFromDiv;
                count++;
                purchases.push({
                  index: count,
                  date: div.date,
                  price: price,
                  amountSpent: 0,
                  sharesBought: sharesBoughtFromDiv,
                  totalShares: totalShares,
                  totalCost: totalInvested,
                  portfolioValue: totalShares * price,
                  isDividend: true,
                  dividendAmount: div.amount,
                  dividendPayout: payout
                });
              }
            }
            divIndex++;
          }
        }

      } else { // dca-qty
        let lastMonthStr = '';
        for (let i = 0; i < dailyPrices.length; i++) {
          const item = dailyPrices[i];
          const prevDate = i > 0 ? dailyPrices[i - 1].date : new Date(item.date.getTime() - 24 * 60 * 60 * 1000);
          const price = item.close;

          const monthStr = `${item.date.getFullYear()}-${item.date.getMonth()}`;
          if (monthStr !== lastMonthStr) {
            count++;
            const cost = inputNum * price;
            totalInvested += cost;
            totalShares += inputNum;

            purchases.push({
              index: count,
              date: item.date,
              price: price,
              amountSpent: cost,
              sharesBought: inputNum,
              totalShares: totalShares,
              totalCost: totalInvested,
              portfolioValue: totalShares * price
            });
            lastMonthStr = monthStr;
          }

          while (divIndex < dividends.length && dividends[divIndex].date > prevDate && dividends[divIndex].date <= item.date) {
            const div = dividends[divIndex];
            if (totalShares > 0) {
              const payout = totalShares * div.amount;
              totalDividendsReceived += payout;
              
              if (reinvestDividends) {
                const sharesBoughtFromDiv = payout / price;
                totalShares += sharesBoughtFromDiv;
                count++;
                purchases.push({
                  index: count,
                  date: div.date,
                  price: price,
                  amountSpent: 0,
                  sharesBought: sharesBoughtFromDiv,
                  totalShares: totalShares,
                  totalCost: totalInvested,
                  portfolioValue: totalShares * price,
                  isDividend: true,
                  dividendAmount: div.amount,
                  dividendPayout: payout
                });
              }
            }
            divIndex++;
          }
        }
      }

      const finalValue = totalShares * currentPrice;
      const netProfit = finalValue - totalInvested;
      const profitPercent = (netProfit / totalInvested) * 100;
      const avgPrice = totalInvested / totalShares;

      const yearsElapsed = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24 * 365.25);
      const cagr = yearsElapsed > 0.1 ? (Math.pow((finalValue / totalInvested), 1 / yearsElapsed) - 1) * 100 : null;

      setResults({
        totalInvested,
        totalShares,
        currentPrice,
        finalValue,
        netProfit,
        profitPercent,
        avgPrice,
        cagr,
        purchases,
        totalDividends: totalDividendsReceived,
        symbol: symbol.toUpperCase()
      });

    } catch (err) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra khi xử lý dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const formatVolumeHelper = (vol, isVnd) => {
    if (vol === undefined || vol === null) return 'N/A';
    if (typeof vol === 'string') return vol;
    if (isNaN(vol)) return 'N/A';
    
    if (isVnd) {
      if (vol >= 1_000_000_000) return (vol / 1_000_000_000).toFixed(2) + ' B (CP)';
      if (vol >= 1_000_000) return (vol / 1_000_000).toFixed(2) + ' M (CP)';
      if (vol >= 1_000) return (vol / 1_000).toFixed(2) + ' K (CP)';
      return vol.toLocaleString('vi-VN') + ' CP';
    } else {
      if (vol >= 1_000_000_000) return (vol / 1_000_000_000).toFixed(2) + ' B';
      if (vol >= 1_000_000) return (vol / 1_000_000).toFixed(2) + ' M';
      if (vol >= 1_000) return (vol / 1_000).toFixed(2) + ' K';
      return vol.toLocaleString('en-US');
    }
  };

  const handleGlobalSearchSubmit = async (e) => {
    e.preventDefault();
    const sym = globalSearch.trim().toUpperCase();
    if (!sym) return;

    // Check if already in list
    const existingIndex = marketPrices.findIndex(a => a.symbol.toUpperCase() === sym);
    if (existingIndex !== -1) {
      // If already exists, switch to 'All', calculate its page, jump to it, and flash it green
      setCategoryFilter('All');
      const targetPage = Math.ceil((existingIndex + 1) / overviewItemsPerPage);
      setOverviewPage(targetPage);
      setGlobalSearch('');
      
      // Temporary flash highlight
      setMarketPrices(prev => prev.map((item, idx) => 
        idx === existingIndex ? { ...item, tick: 'up' } : item
      ));
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    try {
      const nowSecs = Math.floor(Date.now() / 1000);
      // Query 30 days instead of 7 days to avoid empty data on holidays/weekends
      const startSecs = nowSecs - 30 * 24 * 60 * 60;
      const res = await fetch(`http://localhost:5001/api/chart?symbol=${sym}&period1=${startSecs}&period2=${nowSecs}`);
      const data = await res.json();
      if (!data.chart || !data.chart.result || !data.chart.result[0]) {
        throw new Error('Không tìm thấy mã tài sản này hoặc API Yahoo quá tải.');
      }
      const result = data.chart.result[0];
      const meta = result.meta;
      const closes = result.indicators?.quote?.[0]?.close || [];
      const volumes = result.indicators?.quote?.[0]?.volume || [];
      const latestClose = closes.filter(v => v !== null && v !== undefined).pop();
      if (!latestClose) throw new Error('Không lấy được giá đóng cửa gần nhất.');
      
      const latestVolume = volumes.filter(v => v !== null && v !== undefined).pop();

      const isVnd = sym.endsWith('.VN') || sym.endsWith('.HM') || sym === 'USDVND=X';
      let category = 'Khác';
      const cryptoSuffixes = ['-USD', '-USDT', '-BTC'];
      if (cryptoSuffixes.some(s => sym.includes(s))) {
        category = 'Crypto';
      } else if (sym.endsWith('.VN')) {
        category = 'Chứng khoán VN';
      } else if (sym.endsWith('.HM')) {
        category = 'ETF & Quỹ';
      } else if (sym === 'SPY' || sym === 'QQQ') {
        category = 'ETF & Quỹ';
      } else if (sym.endsWith('=X') || sym.endsWith('=F')) {
        category = 'Hàng hóa & Tỷ giá';
      } else {
        category = 'Chứng khoán Mỹ';
      }

      const formattedVol = formatVolumeHelper(latestVolume, isVnd);

      const newAsset = {
        name: meta.shortName || meta.longName || sym,
        symbol: sym,
        price: isVnd ? Math.round(latestClose) : parseFloat(latestClose.toFixed(2)),
        change: parseFloat((((latestClose - (closes.filter(Boolean)[0] || latestClose)) / (closes.filter(Boolean)[0] || latestClose)) * 100).toFixed(2)),
        category,
        isVnd,
        volume: formattedVol,
        details: { pe: 'N/A', high52: 'N/A', low52: 'N/A', volume: formattedVol },
        tick: 'up' // Flash it green initially
      };
      
      // Add new asset to the beginning of the list so it is immediately visible on Page 1
      setMarketPrices(prev => [newAsset, ...prev]);
      setCategoryFilter('All');
      setOverviewPage(1);
      setGlobalSearch('');
    } catch (err) {
      setSearchError(err.message || 'Không tìm thấy mã tài sản.');
      setTimeout(() => setSearchError(null), 4000);
    } finally {
      setSearchLoading(false);
    }
  };

  const getChartData = () => {
    if (!results) return null;
    const labels = results.purchases.map(p => 
      p.date.toLocaleDateString('vi-VN', { year: '2-digit', month: 'numeric' })
    );
    const investedData = results.purchases.map(p => p.totalCost);
    const valueData = results.purchases.map(p => p.portfolioValue);

    return {
      labels,
      datasets: [
        {
          label: 'Giá trị tài sản tích lũy',
          data: valueData,
          borderColor: isVndAsset ? '#f59e0b' : '#10b981',
          backgroundColor: isVndAsset ? 'rgba(245, 158, 11, 0.05)' : 'rgba(16, 185, 129, 0.05)',
          borderWidth: 3,
          pointRadius: results.purchases.length > 50 ? 0 : 3,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.3
        },
        {
          label: 'Vốn gốc tích lũy',
          data: investedData,
          borderColor: '#64748b',
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0.1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#f1f5f9',
        borderColor: '#475569',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += formatVal(context.parsed.y, isVndAsset);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(71, 85, 105, 0.1)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(71, 85, 105, 0.15)' },
        ticks: { 
          color: '#94a3b8', 
          font: { size: 10 },
          callback: function(value) {
            return formatVal(value, isVndAsset, true);
          }
        }
      }
    }
  };

  const chartPlugins = [crosshairPlugin];

  const paginatedPurchases = results 
    ? results.purchases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const totalPages = results 
    ? Math.ceil(results.purchases.length / itemsPerPage)
    : 0;

  const filteredAssets = marketPrices.filter(asset => {
    const matchesSearch = globalSearch.trim() === '' ||
                          asset.name.toLowerCase().includes(globalSearch.toLowerCase()) || 
                          asset.symbol.toLowerCase().includes(globalSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || asset.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const overviewTotalPages = Math.ceil(filteredAssets.length / overviewItemsPerPage);
  const paginatedOverviewAssets = filteredAssets.slice(
    (overviewPage - 1) * overviewItemsPerPage,
    overviewPage * overviewItemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans relative overflow-hidden h-screen">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={changeTab} />

      {/* Right Content Panel */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950">
        
        {/* Top Header Live Ticker */}
        <Header macroIndices={macroIndices} />

        {/* Scrollable Content Body */}
        <main className="flex-1 p-6 overflow-y-auto z-10">
          {activeTab === 'overview' && (
            <Overview
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              macroIndices={macroIndices}
              filteredAssets={paginatedOverviewAssets}
              totalFilteredCount={filteredAssets.length}
              handleQuickSimulation={handleQuickSimulation}
              handleOpenAssetDetails={handleOpenAssetDetails}
              handleGlobalSearchSubmit={handleGlobalSearchSubmit}
              formatValSymbol={formatValSymbol}
              formatVolumeHelper={formatVolumeHelper}
              overviewPage={overviewPage}
              setOverviewPage={setOverviewPage}
              overviewTotalPages={overviewTotalPages}
              overviewItemsPerPage={overviewItemsPerPage}
              searchLoading={searchLoading}
              searchError={searchError}
            />
          )}

          {activeTab === 'portfolio' && (
            <Portfolio
              marketPrices={marketPrices}
              formatValSymbol={formatValSymbol}
              setActiveTab={changeTab}
            />
          )}

          {activeTab === 'guides' && (
            <Guides
              handleQuickSimulation={handleQuickSimulation}
              setActiveTab={changeTab}
              setSymbol={setSymbol}
              setInvestMode={setInvestMode}
              setInputValue={setInputValue}
              setStartDate={setStartDate}
            />
          )}

          {activeTab === 'asset-details' && (
            <AssetDetails
              selectedDetailSymbol={selectedDetailSymbol}
              detailRange={detailRange}
              setDetailRange={setDetailRange}
              detailData={detailData}
              detailLoading={detailLoading}
              formatValSymbol={formatValSymbol}
              setActiveTab={changeTab}
              handleQuickSimulation={handleQuickSimulation}
              marketAssets={marketPrices}
            />
          )}

          {activeTab === 'comparison' && (
            <Comparison
              marketPrices={marketPrices}
              formatValSymbol={formatValSymbol}
              setActiveTab={changeTab}
              handleQuickSimulation={handleQuickSimulation}
            />
          )}

          {activeTab === 'simulator' && (
            <Simulator
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
              error={error}
              results={results}
              handleSimulate={handleSimulate}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              isVndAsset={isVndAsset}
              formatVal={(val, roundInt) => formatVal(val, isVndAsset, roundInt)}
              getChartData={getChartData}
              chartOptions={chartOptions}
              chartPlugins={chartPlugins}
              paginatedPurchases={paginatedPurchases}
              totalPages={totalPages}
              presetSymbols={PRESET_SYMBOLS}
              reinvestDividends={reinvestDividends}
              setReinvestDividends={setReinvestDividends}
            />
          )}

          {activeTab === 'interest' && (
            <InterestCalculator
              interestInit={interestInit}
              setInterestInit={setInterestInit}
              interestMonthly={interestMonthly}
              setInterestMonthly={setInterestMonthly}
              interestRate={interestRate}
              setInterestRate={setInterestRate}
              interestYears={interestYears}
              setInterestYears={setInterestYears}
              interestResults={interestResults}
            />
          )}

          {activeTab === 'news' && (
            <News />
          )}
        </main>
      </div>
    </div>
  );
}
