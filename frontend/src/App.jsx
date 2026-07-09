import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Activity,
  History,
  Info,
  Layers,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  LayoutDashboard,
  Calculator,
  ArrowUpRight,
  Briefcase,
  Newspaper,
  Compass,
  ArrowRight,
  Flame,
  LineChart,
  BookOpen,
  PieChart,
  Globe,
  Settings
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Macro Indices Presets
const MACRO_INDICES = [
  { name: 'VN-Index', symbol: '^VNINDEX', price: 1245.8, change: 0.45, isVnd: false },
  { name: 'Bitcoin', symbol: 'BTC-USD', price: 92350, change: 2.4, isVnd: false },
  { name: 'Vàng Thế Giới', symbol: 'GC=F', price: 2345.5, change: -0.85, isVnd: false },
  { name: 'S&P 500', symbol: '^GSPC', price: 5120.4, change: 1.15, isVnd: false }
];

// Expanded Assets List
const MARKET_ASSETS = [
  // Crypto
  { name: 'Bitcoin', symbol: 'BTC-USD', price: 92350, change: 2.4, category: 'Crypto', isVnd: false, details: { pe: 'N/A', high52: '$98,500', low52: '$38,200', volume: '$28.4B' } },
  { name: 'Ethereum', symbol: 'ETH-USD', price: 3450, change: 1.6, category: 'Crypto', isVnd: false, details: { pe: 'N/A', high52: '$4,090', low52: '$1,850', volume: '$12.5B' } },
  { name: 'Solana', symbol: 'SOL-USD', price: 145.2, change: 4.8, category: 'Crypto', isVnd: false, details: { pe: 'N/A', high52: '$210', low52: '$18.5', volume: '$3.8B' } },
  { name: 'Cardano', symbol: 'ADA-USD', price: 0.58, change: -1.2, category: 'Crypto', isVnd: false, details: { pe: 'N/A', high52: '$0.82', low52: '$0.24', volume: '$450M' } },
  
  // Vietnam Stocks
  { name: 'FPT Corp', symbol: 'FPT.VN', price: 142500, change: 1.8, category: 'Chứng khoán VN', isVnd: true, details: { pe: '22.4', high52: '154.000 đ', low52: '72.000 đ', volume: '180B đ' } },
  { name: 'Hòa Phát', symbol: 'HPG.VN', price: 29450, change: -0.6, category: 'Chứng khoán VN', isVnd: true, details: { pe: '14.2', high52: '32.500 đ', low52: '23.000 đ', volume: '340B đ' } },
  { name: 'Vietcombank', symbol: 'VCB.VN', price: 91400, change: 0.2, category: 'Chứng khoán VN', isVnd: true, details: { pe: '16.8', high52: '98.000 đ', low52: '78.500 đ', volume: '95B đ' } },
  { name: 'Vingroup', symbol: 'VIC.VN', price: 42500, change: -1.5, category: 'Chứng khoán VN', isVnd: true, details: { pe: '28.1', high52: '58.000 đ', low52: '39.000 đ', volume: '120B đ' } },
  { name: 'Vinamilk', symbol: 'VNM.VN', price: 68200, change: 0.5, category: 'Chứng khoán VN', isVnd: true, details: { pe: '18.2', high52: '76.000 đ', low52: '63.400 đ', volume: '110B đ' } },
  { name: 'SSI Securities', symbol: 'SSI.VN', price: 34800, change: 2.1, category: 'Chứng khoán VN', isVnd: true, details: { pe: '21.5', high52: '38.200 đ', low52: '24.500 đ', volume: '290B đ' } },
  
  // US Stocks
  { name: 'Apple Inc.', symbol: 'AAPL', price: 182.4, change: 1.5, category: 'Chứng khoán Mỹ', isVnd: false, details: { pe: '28.4', high52: '$199.6', low52: '$164.1', volume: '$8.2B' } },
  { name: 'Tesla Inc.', symbol: 'TSLA', price: 178.6, change: -3.4, category: 'Chứng khoán Mỹ', isVnd: false, details: { pe: '42.1', high52: '$265.1', low52: '$138.8', volume: '$12.4B' } },
  { name: 'Nvidia Corp', symbol: 'NVDA', price: 875.2, change: 6.2, category: 'Chứng khoán Mỹ', isVnd: false, details: { pe: '74.6', high52: '$974.0', low52: '$420.5', volume: '$24.6B' } },
  { name: 'Microsoft', symbol: 'MSFT', price: 420.8, change: 0.8, category: 'Chứng khoán Mỹ', isVnd: false, details: { pe: '35.8', high52: '$430.8', low52: '$315.2', volume: '$6.5B' } },
  { name: 'Amazon.com', symbol: 'AMZN', price: 175.4, change: 1.1, category: 'Chứng khoán Mỹ', isVnd: false, details: { pe: '40.2', high52: '$189.7', low52: '$118.3', volume: '$5.4B' } },
  { name: 'Google (Alphabet)', symbol: 'GOOG', price: 152.6, change: -0.4, category: 'Chứng khoán Mỹ', isVnd: false, details: { pe: '25.6', high52: '$160.2', low52: '$115.6', volume: '$4.1B' } }
];

// Presets
const PRESET_SYMBOLS = [
  { label: 'Bitcoin (BTC)', value: 'BTC-USD', isVnd: false },
  { label: 'Vàng Thế Giới', value: 'GC=F', isVnd: false },
  { label: 'FPT (HoSE)', value: 'FPT.VN', isVnd: true },
  { label: 'Hòa Phát (HPG)', value: 'HPG.VN', isVnd: true },
  { label: 'VinGroup (VIC)', value: 'VIC.VN', isVnd: true },
  { label: 'Vietcombank (VCB)', value: 'VCB.VN', isVnd: true },
  { label: 'Apple (AAPL)', value: 'AAPL', isVnd: false },
  { label: 'Tesla (TSLA)', value: 'TSLA', isVnd: false }
];

// Curated Domestic & International News
const FINANCIAL_NEWS = [
  // Domestic News
  {
    id: 1,
    title: 'Thị trường chứng khoán Việt Nam: VN-Index bứt phá chinh phục mốc cản tâm lý mới nhờ dòng vốn FDI ổn định',
    source: 'Vietstock',
    time: '20 phút trước',
    summary: 'Dòng tiền khối ngoại quay trở lại mua ròng mạnh mẽ các cổ phiếu trụ cột như FPT, VCB, và HPG, kéo VN-Index duy trì sắc xanh tích cực trong bối cảnh vĩ mô trong nước tiếp tục hồi phục.',
    category: 'Trong nước',
    sentiment: 'bullish'
  },
  {
    id: 2,
    title: 'GDP Việt Nam tăng trưởng vượt dự báo nhờ lực kéo từ hoạt động xuất khẩu và thu hút đầu tư nước ngoài mạnh mẽ',
    source: 'CafeF',
    time: '2 giờ trước',
    summary: 'Báo cáo mới nhất từ Tổng cục Thống kê cho thấy chỉ số công nghiệp và dịch vụ phục hồi rõ rệt. Lãi suất huy động tại các ngân hàng thương mại duy trì ở mức thấp hỗ trợ doanh nghiệp tối đa.',
    category: 'Trong nước',
    sentiment: 'bullish'
  },
  {
    id: 3,
    title: 'Ngân hàng Nhà nước giữ nguyên mức lãi suất điều hành, linh hoạt ổn định tỷ giá USD/VND trong biên độ cho phép',
    source: 'Kinh tế & Đầu tư',
    time: '5 giờ trước',
    summary: 'Chính sách tiền tệ ổn định giúp củng cố niềm tin cho thị trường tài sản và bất động sản trong nước, tạo điều kiện thuận lợi cho các chiến lược đầu tư tích sản dài hạn của nhà đầu tư.',
    category: 'Trong nước',
    sentiment: 'neutral'
  },
  
  // International News
  {
    id: 4,
    title: 'FED phát đi tín hiệu nới lỏng chính sách: Thị trường chứng khoán Mỹ và Crypto đồng loạt lập đỉnh lịch sử mới',
    source: 'Bloomberg',
    time: '45 phút trước',
    summary: 'Ủy ban Thị trường Mở Liên bang (FOMC) hé lộ lộ trình cắt giảm lãi suất cơ bản trong các tháng tới do lạm phát hạ nhiệt nhanh chóng, tạo đà tăng phi mã cho Bitcoin và chỉ số S&P 500.',
    category: 'Quốc tế',
    sentiment: 'bullish'
  },
  {
    id: 5,
    title: 'Căng thẳng địa chính trị tiếp tục leo thang, dòng tiền trú ẩn an toàn thúc đẩy giá Vàng thế giới tăng vọt lập kỷ lục',
    source: 'Reuters',
    time: '3 giờ trước',
    summary: 'Giá vàng giao ngay thế giới duy trì vững chắc trên đà tăng. Các chuyên gia quốc tế nhận định vàng tiếp tục là kênh tích lũy phòng thủ thiết yếu nhất trong danh mục đầu tư đa tài sản hiện nay.',
    category: 'Quốc tế',
    sentiment: 'neutral'
  },
  {
    id: 6,
    title: 'Làn sóng AI thúc đẩy lợi nhuận kỷ lục của nhóm Big Tech Mỹ: Nvidia, Apple và Microsoft duy trì dẫn dắt thị trường',
    source: 'Wall Street Journal',
    time: '6 giờ trước',
    summary: 'Nhu cầu khổng lồ về chip xử lý và hạ tầng đám mây AI giúp các tập đoàn công nghệ đạt biên lợi nhuận vượt bậc, thu hút dòng vốn đầu tư khổng lồ đổ về sàn chứng khoán New York.',
    category: 'Quốc tế',
    sentiment: 'bullish'
  }
];

// Top Simulated / Performance suggestions
const SUGGESTED_SIMULATIONS = [
  { name: 'Tích sản FPT 5 năm', symbol: 'FPT.VN', duration: '5 năm (2021-2026)', returnRate: '+192.4%', type: 'DCA Số lượng' },
  { name: 'Tích lũy Bitcoin từ đáy', symbol: 'BTC-USD', duration: '3 năm (2023-2026)', returnRate: '+284.1%', type: 'DCA Tiền mặt' },
  { name: 'Tích sản Hòa Phát', symbol: 'HPG.VN', duration: '5 năm (2021-2026)', returnRate: '+84.6%', type: 'DCA Số lượng' },
  { name: 'Đầu tư Vàng phòng thủ', symbol: 'GC=F', duration: '8 năm (2018-2026)', returnRate: '+78.9%', type: 'DCA Tiền mặt' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'asset-details' | 'simulator' | 'interest' | 'news'
  
  // Search & Filter state on Market Tab
  const [globalSearch, setGlobalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Simulated Live Market Prices with fluctuation
  const [marketPrices, setMarketPrices] = useState(MARKET_ASSETS);
  const [macroIndices, setMacroIndices] = useState(MACRO_INDICES);

  // Asset Details Tab state
  const [selectedDetailSymbol, setSelectedDetailSymbol] = useState('FPT.VN');
  const [detailRange, setDetailRange] = useState('1Y'); // '1M', '6M', '1Y', '5Y'
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Compound Interest State
  const [interestInit, setInterestInit] = useState('10000000'); // 10 Million VND
  const [interestMonthly, setInterestMonthly] = useState('2000000'); // 2 Million VND
  const [interestRate, setInterestRate] = useState('8'); // 8%
  const [interestYears, setInterestYears] = useState('10'); // 10 Years
  const [interestResults, setInterestResults] = useState(null);

  // News Tab filters
  const [newsFilter, setNewsFilter] = useState('Tất cả');

  // Simulator State Management
  const [symbol, setSymbol] = useState('BTC-USD');
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [investMode, setInvestMode] = useState('dca-qty'); // 'lump-sum', 'dca-amount', 'dca-qty'
  const [inputValue, setInputValue] = useState('100');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const isVndAsset = symbol.toUpperCase().endsWith('.VN');

  // Fluctuate market prices dynamically every 3 seconds
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

  // Clear ticks highlights
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

  // Fetch data for Asset Details Tab Chart
  useEffect(() => {
    if (activeTab === 'asset-details') {
      fetchAssetDetailChart();
    }
  }, [selectedDetailSymbol, detailRange, activeTab]);

  // Calculate compound interest initially
  useEffect(() => {
    calculateCompoundInterest();
  }, [interestInit, interestMonthly, interestRate, interestYears]);

  const fetchAssetDetailChart = async () => {
    setDetailLoading(true);
    const nowSecs = Math.floor(new Date().getTime() / 1000);
    let startSecs = nowSecs - 365 * 24 * 60 * 60; // default 1Y
    
    if (detailRange === '1M') startSecs = nowSecs - 30 * 24 * 60 * 60;
    else if (detailRange === '6M') startSecs = nowSecs - 180 * 24 * 60 * 60;
    else if (detailRange === '5Y') startSecs = nowSecs - 5 * 365 * 24 * 60 * 60;

    try {
      const response = await fetch(`http://localhost:5001/api/chart?symbol=${selectedDetailSymbol.toUpperCase()}&period1=${startSecs}&period2=${nowSecs}`);
      const data = await response.json();
      if (!data.chart || !data.chart.result) throw new Error('Failed to load chart');
      
      const result = data.chart.result[0];
      const timestamps = result.timestamp || [];
      const closes = result.indicators.quote[0].close || [];
      
      const chartPoints = [];
      for (let i = 0; i < timestamps.length; i++) {
        if (timestamps[i] && closes[i]) {
          chartPoints.push({
            date: new Date(timestamps[i] * 1000).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' }),
            price: closes[i]
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
    const rate = (parseFloat(interestRate) || 0) / 100 / 12; // monthly rate
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
    setActiveTab('simulator');
    setResults(null);
  };

  const handleGlobalSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      handleQuickSimulation(globalSearch.trim());
    }
  };

  const handleOpenAssetDetails = (targetSymbol) => {
    setSelectedDetailSymbol(targetSymbol);
    setActiveTab('asset-details');
  };

  const formatValSymbol = (val, sym) => {
    const isVnd = sym.toUpperCase().endsWith('.VN') || sym === 'GC=F' ? false : sym.toUpperCase().endsWith('.VN') || sym.includes('.VN');
    const displayVnd = sym.toUpperCase().endsWith('.VN');
    if (displayVnd) {
      return Math.round(val).toLocaleString('vi-VN') + ' đ';
    }
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
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
      const response = await fetch(`http://localhost:5001/api/chart?symbol=${symbol.toUpperCase()}&period1=${p1}&period2=${p2}`);
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
      const purchases = [];
      const inputNum = parseFloat(inputValue.replace(/,/g, '')) || 0;

      if (inputNum <= 0) {
        throw new Error('Vui lòng nhập giá trị đầu tư hợp lệ (lớn hơn 0).');
      }

      const currentPrice = dailyPrices[dailyPrices.length - 1].close;

      if (investMode === 'lump-sum') {
        const entryPrice = dailyPrices[0].close;
        totalInvested = inputNum;
        totalShares = inputNum / entryPrice;
        
        purchases.push({
          index: 1,
          date: dailyPrices[0].date,
          price: entryPrice,
          amountSpent: inputNum,
          sharesBought: totalShares,
          totalShares: totalShares,
          totalCost: inputNum,
          portfolioValue: totalShares * entryPrice
        });

        if (dailyPrices.length > 1) {
          purchases.push({
            index: 2,
            date: dailyPrices[dailyPrices.length - 1].date,
            price: currentPrice,
            amountSpent: 0,
            sharesBought: 0,
            totalShares: totalShares,
            totalCost: inputNum,
            portfolioValue: totalShares * currentPrice
          });
        }
      } else if (investMode === 'dca-amount') {
        let lastMonthStr = '';
        let count = 0;
        for (const item of dailyPrices) {
          const monthStr = `${item.date.getFullYear()}-${item.date.getMonth()}`;
          if (monthStr !== lastMonthStr) {
            count++;
            const buyPrice = item.close;
            const sharesBought = inputNum / buyPrice;
            totalInvested += inputNum;
            totalShares += sharesBought;

            purchases.push({
              index: count,
              date: item.date,
              price: buyPrice,
              amountSpent: inputNum,
              sharesBought: sharesBought,
              totalShares: totalShares,
              totalCost: totalInvested,
              portfolioValue: totalShares * buyPrice
            });
            lastMonthStr = monthStr;
          }
        }
      } else {
        let lastMonthStr = '';
        let count = 0;
        for (const item of dailyPrices) {
          const monthStr = `${item.date.getFullYear()}-${item.date.getMonth()}`;
          if (monthStr !== lastMonthStr) {
            count++;
            const buyPrice = item.close;
            const cost = inputNum * buyPrice;
            totalInvested += cost;
            totalShares += inputNum;

            purchases.push({
              index: count,
              date: item.date,
              price: buyPrice,
              amountSpent: cost,
              sharesBought: inputNum,
              totalShares: totalShares,
              totalCost: totalInvested,
              portfolioValue: totalShares * buyPrice
            });
            lastMonthStr = monthStr;
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
        symbol: symbol.toUpperCase()
      });

    } catch (err) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra khi xử lý dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = marketPrices.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(globalSearch.toLowerCase()) || 
                          asset.symbol.toLowerCase().includes(globalSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || asset.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredNews = FINANCIAL_NEWS.filter(news => {
    if (newsFilter === 'Tất cả') return true;
    return news.category === newsFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans relative overflow-hidden h-screen">
      {/* Sidebar Navigation */}
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

        {/* Navigation lists */}
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
            onClick={() => {
              setActiveTab('asset-details');
              fetchAssetDetailChart();
            }}
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
        </nav>

        {/* Sidebar Footer status */}
        <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online Cổng 5001</span>
        </div>
      </aside>

      {/* Right Content Panel Container */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-950">
        
        {/* Top Header Live Ticker */}
        <header className="h-16 border-b border-slate-900 bg-slate-900/40 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-6 overflow-hidden max-w-full">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0 hidden md:block">Bảng tin nhanh:</span>
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
              {macroIndices.map((item) => (
                <div key={item.symbol} className="flex items-center gap-1.5 text-[10px] shrink-0">
                  <span className="text-slate-400 font-semibold">{item.name}</span>
                  <span className="font-bold font-mono text-slate-200">{item.price.toLocaleString('en-US')}</span>
                  <span className={`font-mono font-bold ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.change >= 0 ? '↑' : '↓'}{Math.abs(item.change)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-[10px] text-slate-400 bg-slate-900/80 border border-slate-800 py-1.5 px-3 rounded-full font-mono">
              Phiên bản 1.2.0
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 overflow-y-auto z-10">
          
          {activeTab === 'overview' && (
            /* ================== TAB 1: MARKET OVERVIEW BROWSER ================== */
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
                      placeholder="Tìm mã tài sản (ví dụ: FPT.VN, BTC-USD, SJC...)"
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

              {/* Suggestions row */}
              <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-lg flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-amber-500" />
                    Kế hoạch giả định nổi bật tiêu biểu
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">Hiệu suất 3-8 năm</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {SUGGESTED_SIMULATIONS.map((sim, index) => (
                    <div 
                      key={index}
                      onClick={() => handleQuickSimulation(sim.symbol)}
                      className="p-3.5 bg-slate-950/40 hover:bg-slate-900/80 border border-slate-850 hover:border-slate-700/60 rounded-xl cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-200">{sim.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{sim.duration}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 border-t border-slate-900/60 pt-2 text-[10px]">
                        <span className="text-slate-400 font-medium">{sim.type}</span>
                        <span className="text-emerald-400 font-extrabold font-mono">{sim.returnRate}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
                          className={`border-b border-slate-850 hover:bg-slate-800/20 transition-all ${
                            asset.tick === 'up' ? 'bg-emerald-500/5' : asset.tick === 'down' ? 'bg-rose-500/5' : ''
                          }`}
                        >
                          <td className="py-3 px-4 text-slate-200 font-bold">{asset.name}</td>
                          <td className="py-3 px-4 text-slate-400 font-mono">{asset.symbol}</td>
                          <td className="py-3 px-4 text-slate-500 font-semibold">{asset.category}</td>
                          <td className={`py-3 px-4 font-bold font-mono transition-all ${
                            asset.tick === 'up' ? 'text-emerald-400' : asset.tick === 'down' ? 'text-rose-400' : 'text-slate-100'
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
          )}

          {activeTab === 'asset-details' && (
            /* ================== TAB 2: DETAILED LIVE CHART & STATS ================== */
            <div className="flex flex-col gap-6 animate-fadeIn">
              <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-lg flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/60 pb-3 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-xl border border-slate-700 text-emerald-400">
                      <LineChart className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-200">Biểu đồ kỹ thuật chi tiết: {selectedDetailSymbol}</h3>
                      <p className="text-[10px] text-slate-500 font-mono">Dữ liệu đóng cửa hàng ngày</p>
                    </div>
                  </div>

                  {/* Range selectors */}
                  <div className="flex gap-1">
                    {['1M', '6M', '1Y', '5Y'].map((rng) => (
                      <button
                        key={rng}
                        onClick={() => setDetailRange(rng)}
                        className={`text-[9px] font-semibold py-1 px-3.5 rounded-lg border transition-all ${
                          detailRange === rng 
                            ? 'bg-slate-850 border-slate-700 text-emerald-400' 
                            : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {rng}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Technical Stats Header */}
                {(() => {
                  const targetAsset = MARKET_ASSETS.find(a => a.symbol === selectedDetailSymbol) || { name: 'Chỉ số', details: { pe: 'N/A', high52: 'N/A', low52: 'N/A', volume: 'N/A' } };
                  return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-950/40 border border-slate-850 rounded-xl text-xs font-mono">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500">Tên tài sản</span>
                        <span className="text-slate-200 font-bold">{targetAsset.name}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500">Volume giao dịch</span>
                        <span className="text-slate-200 font-bold">{targetAsset.details.volume}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500">Cao nhất 52 tuần</span>
                        <span className="text-slate-200 font-bold">{targetAsset.details.high52}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500">Thấp nhất 52 tuần</span>
                        <span className="text-slate-200 font-bold">{targetAsset.details.low52}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Big Chart */}
                <div className="h-[320px] relative w-full mt-2">
                  {detailLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                      <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
                    </div>
                  ) : detailData && detailData.length > 0 ? (
                    <Line
                      data={{
                        labels: detailData.map(d => d.date),
                        datasets: [
                          {
                            label: 'Giá thị trường',
                            data: detailData.map(d => d.price),
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.03)',
                            borderWidth: 2.5,
                            pointRadius: 0,
                            pointHoverRadius: 5,
                            fill: true,
                            tension: 0.15
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: '#1e293b',
                            titleColor: '#f8fafc',
                            bodyColor: '#f1f5f9',
                            callbacks: {
                              label: function (context) {
                                return `Giá: ` + formatValSymbol(context.parsed.y, selectedDetailSymbol);
                              }
                            }
                          }
                        },
                        scales: {
                          x: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { display: false } },
                          y: { 
                            ticks: { 
                              color: '#94a3b8', 
                              font: { size: 9 },
                              callback: function(value) {
                                return formatValSymbol(value, selectedDetailSymbol);
                              }
                            },
                            grid: { color: 'rgba(71, 85, 105, 0.1)' } 
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-semibold">
                      Không thể tải biểu đồ lịch sử của mã này.
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-end border-t border-slate-800/60 pt-4 mt-2">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className="px-4 py-2 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Quay lại thị trường
                  </button>
                  <button 
                    onClick={() => handleQuickSimulation(selectedDetailSymbol)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Mở giả lập tích sản</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'simulator' && (
            /* ================== TAB 3: ACCUMULATION SIMULATOR ================== */
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fadeIn">
              {/* Left Sidebar Config Panel */}
              <section className="lg:col-span-1 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-lg flex flex-col gap-5 h-fit shadow-2xl">
                <div className="border-b border-slate-800/60 pb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-emerald-400" />
                  <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Cấu hình giả lập</h2>
                </div>

                <form onSubmit={handleSimulate} className="flex flex-col gap-4">
                  {/* Symbol input with preset tags */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-slate-400">Ký hiệu tài sản</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        placeholder="Ví dụ: HPG.VN, BTC-USD"
                        className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 pl-9 text-sm focus:outline-none transition-all text-slate-100 font-mono"
                        required
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    </div>
                    
                    {/* Presets List */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {PRESET_SYMBOLS.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => handlePresetClick(p)}
                          className={`text-[10px] py-1 px-2 rounded-md border transition-all ${
                            symbol.toUpperCase() === p.value 
                              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                              : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          {p.value.split('-')[0].split('.')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">Ngày bắt đầu</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-0 transition-all font-mono"
                      required
                    />
                  </div>

                  {/* End Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">Ngày kết thúc</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-0 transition-all font-mono"
                      required
                    />
                  </div>

                  {/* Investment mode selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">Hình thức đầu tư</label>
                    <div className="grid grid-cols-1 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setInvestMode('dca-qty')}
                        className={`text-left text-xs py-2 px-3 rounded-xl border transition-all flex flex-col gap-0.5 ${
                          investMode === 'dca-qty'
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-semibold">Tích sản số lượng cố định</span>
                        <span className="text-[10px] text-slate-500">Mỗi tháng mua N cổ phiếu (Khuyên dùng)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setInvestMode('dca-amount')}
                        className={`text-left text-xs py-2 px-3 rounded-xl border transition-all flex flex-col gap-0.5 ${
                          investMode === 'dca-amount'
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-semibold">Tích sản số tiền cố định</span>
                        <span className="text-[10px] text-slate-500">Mỗi tháng bỏ ra X tiền để mua</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setInvestMode('lump-sum')}
                        className={`text-left text-xs py-2 px-3 rounded-xl border transition-all flex flex-col gap-0.5 ${
                          investMode === 'lump-sum'
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-semibold">Mua một lần duy nhất</span>
                        <span className="text-[10px] text-slate-500">Mua X tiền vào ngày bắt đầu và nắm giữ</span>
                      </button>
                    </div>
                  </div>

                  {/* Input Value */}
                  <div className="flex flex-col gap-1.5 border-t border-slate-800/60 pt-3">
                    <label className="text-xs font-medium text-slate-400">
                      {investMode === 'dca-qty' 
                        ? `Số lượng mua mỗi tháng` 
                        : `Số tiền đầu tư mỗi kỳ (${isVndAsset ? 'VND' : 'USD'})`
                      }
                    </label>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-sm focus:outline-none font-bold text-slate-200"
                      required
                    />
                    {isVndAsset && (investMode === 'dca-amount' || investMode === 'lump-sum') && (
                      <span className="text-[10px] text-slate-500">
                        Ví dụ: 1000000 = 1 triệu đồng
                      </span>
                    )}
                  </div>

                  {/* Simulate Trigger Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold py-2.5 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 text-sm flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Đang tính toán...</span>
                      </>
                    ) : (
                      <span>Chạy Giả Lập</span>
                    )}
                  </button>
                </form>
              </section>

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tổng vốn đầu tư</span>
                          <span className="text-lg font-bold text-slate-100">{formatVal(results.totalInvested)}</span>
                        </div>
                        <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-slate-400">
                          <DollarSign className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Giá trị tài sản hiện tại</span>
                          <span className="text-lg font-bold text-slate-100">{formatVal(results.finalValue)}</span>
                        </div>
                        <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-emerald-400">
                          <DollarSign className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Lợi nhuận ròng</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-lg font-bold ${results.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {results.netProfit >= 0 ? '+' : ''}{formatVal(results.netProfit)}
                            </span>
                          </div>
                        </div>
                        <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
                          results.netProfit >= 0 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          {results.netProfit >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                        </div>
                      </div>

                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tỷ suất lợi nhuận</span>
                          <div className="flex flex-col">
                            <span className={`text-base font-bold ${results.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {results.netProfit >= 0 ? '+' : ''}{results.profitPercent.toFixed(2)}%
                            </span>
                            {results.cagr !== null && (
                              <span className="text-[10px] text-slate-400">CAGR: {results.cagr.toFixed(2)}%/năm</span>
                            )}
                          </div>
                        </div>
                        <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
                          results.netProfit >= 0 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          <Percent className="h-5 w-5" />
                        </div>
                      </div>
                    </div>

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
                        <Line data={getChartData()} options={chartOptions} />
                      </div>
                    </div>

                    {/* Transactions details table */}
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
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
                            <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/30">
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
                              <tr key={p.index} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-all font-mono">
                                <td className="py-2.5 px-4 text-slate-500">{p.index}</td>
                                <td className="py-2.5 px-4 text-slate-300">
                                  {p.date.toLocaleDateString('vi-VN')}
                                </td>
                                <td className="py-2.5 px-4 text-slate-300">{formatVal(p.price)}</td>
                                <td className="py-2.5 px-4 text-slate-300 font-semibold">
                                  {p.sharesBought.toFixed(p.sharesBought > 10 ? 2 : 4)}
                                </td>
                                <td className="py-2.5 px-4 text-slate-300">{formatVal(p.amountSpent)}</td>
                                <td className="py-2.5 px-4 text-slate-400">{formatVal(p.totalCost)}</td>
                                <td className="py-2.5 px-4 text-emerald-400 font-bold text-right">
                                  {formatVal(p.portfolioValue)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Table Pagination UI */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 text-xs">
                          <span className="text-slate-400">
                            Trang <span className="font-bold text-slate-200">{currentPage}</span> / {totalPages}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-400 hover:text-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-400 hover:text-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'interest' && (
            /* ================== TAB 4: COMPOUND INTEREST CALCULATOR ================== */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
              {/* Left Config Card */}
              <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-lg flex flex-col gap-4 h-fit">
                <div className="border-b border-slate-800/60 pb-3">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Percent className="h-4 w-4 text-emerald-400" />
                    Thiết lập lãi kép
                  </h3>
                </div>

                <div className="flex flex-col gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-semibold">Vốn ban đầu (VND)</label>
                    <input
                      type="number"
                      value={interestInit}
                      onChange={(e) => setInterestInit(e.target.value)}
                      className="bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-slate-200 font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-semibold">Tiền góp hàng tháng (VND)</label>
                    <input
                      type="number"
                      value={interestMonthly}
                      onChange={(e) => setInterestMonthly(e.target.value)}
                      className="bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-slate-200 font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-semibold">Lãi suất kỳ vọng (% / năm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-slate-200 font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-semibold">Số năm tích lũy</label>
                    <input
                      type="number"
                      value={interestYears}
                      onChange={(e) => setInterestYears(e.target.value)}
                      className="bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 px-3 text-slate-200 font-bold"
                    />
                  </div>
                </div>
              </section>

              {/* Right Output Dashboard */}
              <section className="lg:col-span-2 flex flex-col gap-6">
                {interestResults && (
                  <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tổng vốn gốc đã góp</span>
                        <span className="text-base font-extrabold text-slate-100">{interestResults.totalInvested.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tổng tiền lãi nhận</span>
                        <span className="text-base font-extrabold text-emerald-400">+{interestResults.interestEarned.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tổng tài sản nhận được</span>
                        <span className="text-base font-extrabold bg-gradient-to-r from-emerald-400 to-teal-100 bg-clip-text text-transparent">
                          {interestResults.finalBalance.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                    </div>

                    {/* Chart visual */}
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col gap-4">
                      <div className="border-b border-slate-800/60 pb-2">
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Biểu đồ tăng trưởng lãi kép theo năm</h3>
                      </div>
                      <div className="h-[250px]">
                        <Bar
                          data={{
                            labels: interestResults.yearlyBreakdown.map(y => y.year),
                            datasets: [
                              {
                                label: 'Vốn gốc đã nộp',
                                data: interestResults.yearlyBreakdown.map(y => y.totalInvested),
                                backgroundColor: '#475569'
                              },
                              {
                                label: 'Tổng lãi tích lũy',
                                data: interestResults.yearlyBreakdown.map(y => y.interestEarned),
                                backgroundColor: '#10b981'
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { labels: { color: '#cbd5e1', font: { size: 10 } } }
                            },
                            scales: {
                              x: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { display: false } },
                              y: { 
                                ticks: { 
                                  color: '#94a3b8', 
                                  font: { size: 9 },
                                  callback: function(value) {
                                    return Math.round(value).toLocaleString('vi-VN') + ' đ';
                                  }
                                },
                                grid: { color: 'rgba(71, 85, 105, 0.1)' } 
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Year by year breakdown list */}
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-md">
                      <div className="border-b border-slate-800/60 pb-2 mb-3">
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Số liệu qua từng năm</h3>
                      </div>
                      <div className="max-h-[180px] overflow-y-auto pr-1">
                        <div className="flex flex-col gap-2 text-xs font-mono">
                          {interestResults.yearlyBreakdown.map((row) => (
                            <div key={row.year} className="flex items-center justify-between p-2 bg-slate-950/40 border border-slate-900 rounded-lg">
                              <span className="font-bold text-slate-300">{row.year}</span>
                              <div className="flex gap-4">
                                <span>Gốc: <span className="text-slate-400">{row.totalInvested.toLocaleString('vi-VN')} đ</span></span>
                                <span>Lãi: <span className="text-emerald-400">+{row.interestEarned.toLocaleString('vi-VN')} đ</span></span>
                                <span className="font-bold">Tổng: {row.totalBalance.toLocaleString('vi-VN')} đ</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </section>
            </div>
          )}

          {activeTab === 'news' && (
            /* ================== TAB 5: DEDICATED FINANCIAL NEWS TAB ================== */
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
          )}

        </main>
      </div>
    </div>
  );
}
