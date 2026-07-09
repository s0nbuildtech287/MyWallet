import React, { useState, useEffect } from 'react';
import { 
  Compass, LayoutDashboard, Calculator, Percent, Newspaper, LineChart, BookOpen
} from 'lucide-react';

// Import Modular Pages
import Overview from './pages/Overview';
import AssetDetails from './pages/AssetDetails';
import Simulator from './pages/Simulator';
import InterestCalculator from './pages/InterestCalculator';
import News from './pages/News';
import Guides from './pages/Guides';

// Macro Indices Presets
const MACRO_INDICES = [
  { name: 'VN-Index', symbol: '^VNINDEX', price: 1245.8, change: 0.45, isVnd: false },
  { name: 'Bitcoin', symbol: 'BTC-USD', price: 92350, change: 2.4, isVnd: false },
  { name: 'Vàng Thế Giới', symbol: 'GC=F', price: 2345.5, change: -0.85, isVnd: false },
  { name: 'S&P 500', symbol: '^GSPC', price: 5120.4, change: 1.15, isVnd: false }
];

// Market Assets Data
const MARKET_ASSETS = [
  { name: 'Bitcoin', symbol: 'BTC-USD', price: 92350, change: 2.4, category: 'Crypto', isVnd: false, details: { pe: 'N/A', high52: '$98,500', low52: '$38,200', volume: '$28.4B' } },
  { name: 'Ethereum', symbol: 'ETH-USD', price: 3450, change: 1.6, category: 'Crypto', isVnd: false, details: { pe: 'N/A', high52: '$4,090', low52: '$1,850', volume: '$12.5B' } },
  { name: 'Solana', symbol: 'SOL-USD', price: 145.2, change: 4.8, category: 'Crypto', isVnd: false, details: { pe: 'N/A', high52: '$210', low52: '$18.5', volume: '$3.8B' } },
  { name: 'Cardano', symbol: 'ADA-USD', price: 0.58, change: -1.2, category: 'Crypto', isVnd: false, details: { pe: 'N/A', high52: '$0.82', low52: '$0.24', volume: '$450M' } },
  
  { name: 'FPT Corp', symbol: 'FPT.VN', price: 142500, change: 1.8, category: 'Chứng khoán VN', isVnd: true, details: { pe: '22.4', high52: '154.000 đ', low52: '72.000 đ', volume: '180B đ' } },
  { name: 'Hòa Phát', symbol: 'HPG.VN', price: 29450, change: -0.6, category: 'Chứng khoán VN', isVnd: true, details: { pe: '14.2', high52: '32.500 đ', low52: '23.000 đ', volume: '340B đ' } },
  { name: 'Vietcombank', symbol: 'VCB.VN', price: 91400, change: 0.2, category: 'Chứng khoán VN', isVnd: true, details: { pe: '16.8', high52: '98.000 đ', low52: '78.500 đ', volume: '95B đ' } },
  { name: 'Vingroup', symbol: 'VIC.VN', price: 42500, change: -1.5, category: 'Chứng khoán VN', isVnd: true, details: { pe: '28.1', high52: '58.000 đ', low52: '39.000 đ', volume: '120B đ' } },
  { name: 'Vinamilk', symbol: 'VNM.VN', price: 68200, change: 0.5, category: 'Chứng khoán VN', isVnd: true, details: { pe: '18.2', high52: '76.000 đ', low52: '63.400 đ', volume: '110B đ' } },
  { name: 'SSI Securities', symbol: 'SSI.VN', price: 34800, change: 2.1, category: 'Chứng khoán VN', isVnd: true, details: { pe: '21.5', high52: '38.200 đ', low52: '24.500 đ', volume: '290B đ' } },
  
  { name: 'Apple Inc.', symbol: 'AAPL', price: 182.4, change: 1.5, category: 'Chứng khoán Mỹ', isVnd: false, details: { pe: '28.4', high52: '$199.6', low52: '$164.1', volume: '$8.2B' } },
  { name: 'Tesla Inc.', symbol: 'TSLA', price: 178.6, change: -3.4, category: 'Chứng khoán Mỹ', isVnd: false, details: { pe: '42.1', high52: '$265.1', low52: '$138.8', volume: '$12.4B' } },
  { name: 'Nvidia Corp', symbol: 'NVDA', price: 875.2, change: 6.2, category: 'Chứng khoán Mỹ', isVnd: false, details: { pe: '74.6', high52: '$974.0', low52: '$420.5', volume: '$24.6B' } },
  { name: 'Microsoft', symbol: 'MSFT', price: 420.8, change: 0.8, category: 'Chứng khoán Mỹ', isVnd: false, details: { pe: '35.8', high52: '$430.8', low52: '$315.2', volume: '$6.5B' } },
  { name: 'Amazon.com', symbol: 'AMZN', price: 175.4, change: 1.1, category: 'Chứng khoán Mỹ', isVnd: false, details: { pe: '40.2', high52: '$189.7', low52: '$118.3', volume: '$5.4B' } },
  { name: 'Google (Alphabet)', symbol: 'GOOG', price: 152.6, change: -0.4, category: 'Chứng khoán Mỹ', isVnd: false, details: { pe: '25.6', high52: '$160.2', low52: '$115.6', volume: '$4.1B' } }
];

// Presets for Simulator
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

// Financial news
const FINANCIAL_NEWS = [
  { id: 1, title: 'Thị trường chứng khoán Việt Nam: VN-Index bứt phá chinh phục mốc cản tâm lý mới nhờ dòng vốn FDI ổn định', source: 'Vietstock', time: '20 phút trước', summary: 'Dòng tiền khối ngoại quay trở lại mua ròng mạnh mẽ các cổ phiếu trụ cột như FPT, VCB, và HPG, kéo VN-Index duy trì sắc xanh tích cực trong bối cảnh vĩ mô trong nước tiếp tục hồi phục.', category: 'Trong nước', sentiment: 'bullish' },
  { id: 2, title: 'GDP Việt Nam tăng trưởng vượt dự báo nhờ lực kéo từ hoạt động xuất khẩu và thu hút đầu tư nước ngoài mạnh mẽ', source: 'CafeF', time: '2 giờ trước', summary: 'Báo cáo mới nhất từ Tổng cục Thống kê cho thấy chỉ số công nghiệp và dịch vụ phục hồi rõ rệt. Lãi suất huy động tại các ngân hàng thương mại duy trì ở mức thấp hỗ trợ doanh nghiệp tối đa.', category: 'Trong nước', sentiment: 'bullish' },
  { id: 3, title: 'Ngân hàng Nhà nước giữ nguyên mức lãi suất điều hành, linh hoạt ổn định tỷ giá USD/VND trong biên độ cho phép', source: 'Kinh tế & Đầu tư', time: '5 giờ trước', summary: 'Chính sách tiền tệ ổn định giúp củng cố niềm tin cho thị trường tài sản và bất động sản trong nước, tạo điều kiện thuận lợi cho các chiến lược đầu tư tích sản dài hạn của nhà đầu tư.', category: 'Trong nước', sentiment: 'neutral' },
  { id: 4, title: 'FED phát đi tín hiệu nới lỏng chính sách: Thị trường chứng khoán Mỹ và Crypto đồng loạt lập đỉnh lịch sử mới', source: 'Bloomberg', time: '45 phút trước', summary: 'Ủy ban Thị trường Mở Liên bang (FOMC) hé lộ lộ trình cắt giảm lãi suất cơ bản trong các tháng tới do lạm phát hạ nhiệt nhanh chóng, tạo đà tăng phi mã cho Bitcoin và chỉ số S&P 500.', category: 'Quốc tế', sentiment: 'bullish' },
  { id: 5, title: 'Căng thẳng địa chính trị tiếp tục leo thang, dòng tiền trú ẩn an toàn thúc đẩy giá Vàng thế giới tăng vọt lập kỷ lục', source: 'Reuters', time: '3 giờ trước', summary: 'Giá vàng giao ngay thế giới duy trì vững chắc trên đà tăng. Các chuyên gia quốc tế nhận định vàng tiếp tục là kênh tích lũy phòng thủ thiết yếu nhất trong danh mục đầu tư đa tài sản hiện nay.', category: 'Quốc tế', sentiment: 'neutral' },
  { id: 6, title: 'Làn sóng AI thúc đẩy lợi nhuận kỷ lục của nhóm Big Tech Mỹ: Nvidia, Apple và Microsoft duy trì dẫn dắt thị trường', source: 'Wall Street Journal', time: '6 giờ trước', summary: 'Nhu cầu khổng lồ về chip xử lý và hạ tầng đám mây AI giúp các tập đoàn công nghệ đạt biên lợi nhuận vượt bậc, thu hút dòng vốn đầu tư khổng lồ đổ về sàn chứng khoán New York.', category: 'Quốc tế', sentiment: 'bullish' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'asset-details' | 'simulator' | 'interest' | 'news'
  const [globalSearch, setGlobalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

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

  // News filters
  const [newsFilter, setNewsFilter] = useState('Tất cả');

  // Simulator Backtest states
  const [symbol, setSymbol] = useState('BTC-USD');
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [investMode, setInvestMode] = useState('dca-qty');
  const [inputValue, setInputValue] = useState('100');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const isVndAsset = symbol.toUpperCase().endsWith('.VN');

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
    if (activeTab === 'asset-details') {
      fetchAssetDetailChart();
    }
  }, [selectedDetailSymbol, detailRange, activeTab]);

  useEffect(() => {
    calculateCompoundInterest();
  }, [interestInit, interestMonthly, interestRate, interestYears]);

  const fetchAssetDetailChart = async () => {
    setDetailLoading(true);
    const nowSecs = Math.floor(new Date().getTime() / 1000);
    let startSecs = nowSecs - 365 * 24 * 60 * 60;
    
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
    setActiveTab('simulator');
    setResults(null);
  };

  const handleOpenAssetDetails = (targetSymbol) => {
    setSelectedDetailSymbol(targetSymbol);
    setActiveTab('asset-details');
  };

  const formatValSymbol = (val, sym) => {
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

  const formatVal = (val, roundInt = false) => {
    if (isVndAsset) {
      return Math.round(val).toLocaleString('vi-VN') + ' đ';
    }
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: roundInt ? 0 : 2,
      maximumFractionDigits: roundInt ? 0 : 2
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

  const handleGlobalSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      handleQuickSimulation(globalSearch.trim());
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
              label += formatVal(context.parsed.y);
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
            return formatVal(value, true);
          }
        }
      }
    }
  };

  const paginatedPurchases = results 
    ? results.purchases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const totalPages = results 
    ? Math.ceil(results.purchases.length / itemsPerPage)
    : 0;

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
        </nav>

        <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online Cổng 5001</span>
        </div>
      </aside>

      {/* Right Content Panel */}
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
            <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/25 py-1.5 px-3.5 rounded-full text-[9px] font-extrabold tracking-wider text-emerald-400 font-mono shadow-lg shadow-emerald-500/5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>LIVE</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="flex-1 p-6 overflow-y-auto z-10">
          {activeTab === 'overview' && (
            <Overview
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              macroIndices={macroIndices}
              filteredAssets={filteredAssets}
              handleQuickSimulation={handleQuickSimulation}
              handleOpenAssetDetails={handleOpenAssetDetails}
              handleGlobalSearchSubmit={handleGlobalSearchSubmit}
              formatValSymbol={formatValSymbol}
            />
          )}

          {activeTab === 'guides' && (
            <Guides
              handleQuickSimulation={handleQuickSimulation}
              setActiveTab={setActiveTab}
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
              setActiveTab={setActiveTab}
              handleQuickSimulation={handleQuickSimulation}
              marketAssets={marketPrices}
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
              formatVal={formatVal}
              getChartData={getChartData}
              chartOptions={chartOptions}
              paginatedPurchases={paginatedPurchases}
              totalPages={totalPages}
              presetSymbols={PRESET_SYMBOLS}
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
            <News
              newsFilter={newsFilter}
              setNewsFilter={setNewsFilter}
              filteredNews={filteredNews}
            />
          )}
        </main>
      </div>
    </div>
  );
}
