import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, RefreshCw, AlertTriangle, TrendingUp, Info, ArrowRight, User } from 'lucide-react';
import { calculateSMA, calculateBollingerBands, calculateRSI, calculateMACD } from '../utils/indicators';

// A simple local markdown helper to render basic markdown elements (headers, bold, bullet points) beautifully in React without external packages
function SafeMarkdown({ text }) {
  if (!text) return null;

  // Split lines
  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-slate-300 text-xs leading-relaxed font-sans">
      {lines.map((line, idx) => {
        let cleanLine = line.trim();

        // 1. Headers (### or ## or #)
        if (cleanLine.startsWith('###')) {
          return <h5 key={idx} className="text-slate-100 font-bold text-xs mt-3 mb-1 uppercase tracking-wider text-emerald-400">{cleanLine.replace('###', '').trim()}</h5>;
        }
        if (cleanLine.startsWith('##') || cleanLine.startsWith('#')) {
          return <h4 key={idx} className="text-slate-100 font-bold text-sm mt-4 mb-1.5 border-b border-slate-700/25 pb-1 text-emerald-300">{cleanLine.replace(/^#+\s*/, '').trim()}</h4>;
        }

        // 2. Bullet list
        if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
          const content = cleanLine.substring(1).trim();
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-emerald-500 mt-1.5 shrink-0 block h-1 w-1 rounded-full bg-emerald-500" />
              <span>{renderInlineFormatting(content)}</span>
            </div>
          );
        }

        // 3. Numbered list
        const numMatch = cleanLine.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-2">
              <span className="text-emerald-400 font-mono font-bold">{numMatch[1]}.</span>
              <span>{renderInlineFormatting(numMatch[2])}</span>
            </div>
          );
        }

        // Empty line
        if (cleanLine === '') return <div key={idx} className="h-1.5" />;

        // 4. Default Paragraph
        return <p key={idx}>{renderInlineFormatting(line)}</p>;
      })}
    </div>
  );
}

// Render bold (`**text**`) and code inline formatting
function renderInlineFormatting(text) {
  const parts = [];
  let index = 0;
  
  // Regex to match bold tags **
  const boldRegex = /\*\*([^*]+)\*\*/g;
  let match;
  
  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before match
    if (match.index > index) {
      parts.push(text.substring(index, match.index));
    }
    // Add bold element
    parts.push(
      <strong key={match.index} className="text-slate-100 font-extrabold font-semibold">
        {match[1]}
      </strong>
    );
    index = boldRegex.lastIndex;
  }
  
  if (index < text.length) {
    parts.push(text.substring(index));
  }
  
  return parts.length > 0 ? parts : text;
}

export default function TradingGPT({
  marketAssets,
  formatValSymbol
}) {
  const [selectedSymbol, setSelectedSymbol] = useState(marketAssets[0]?.symbol || 'FPT.VN');
  const [historicalData, setHistoricalData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // AI analysis state
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  
  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState(null);

  const chatEndRef = useRef(null);

  // Find asset metadata
  const currentAsset = marketAssets.find(a => a.symbol === selectedSymbol) || {
    name: 'Tài sản',
    price: 0,
    change: 0,
    isVnd: false
  };

  // 1. Fetch historical data for indicators when selected asset changes
  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5001/api/chart?symbol=${selectedSymbol.toUpperCase()}&range=1y&interval=1d`);
        if (!res.ok) throw new Error('Không thể lấy dữ liệu lịch sử tài sản.');
        const json = await res.json();
        
        const result = json.chart?.result?.[0];
        if (!result) throw new Error('Dữ liệu biểu đồ trống.');

        const quotes = result.indicators?.quote?.[0] || {};
        const timestamps = result.timestamp || [];
        const closes = quotes.close || [];
        const volumes = quotes.volume || [];

        // Build list of valid historical points
        const history = [];
        for (let i = 0; i < timestamps.length; i++) {
          if (closes[i] !== null && closes[i] !== undefined) {
            const dateObj = new Date(timestamps[i] * 1000);
            const dateStr = dateObj.toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit' });
            history.push({
              date: dateStr,
              price: closes[i],
              volume: volumes[i] || 0
            });
          }
        }
        setHistoricalData(history);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
    // Reset analysis and chat when changing symbol
    setAiAnalysis('');
    setChatHistory([]);
  }, [selectedSymbol]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  // 2. Calculations
  const prices = historicalData.map(d => d.price);
  const ma20Data = prices.length > 0 ? calculateSMA(prices, 20) : [];
  const ma50Data = prices.length > 0 ? calculateSMA(prices, 50) : [];
  const bbData = prices.length > 0 ? calculateBollingerBands(prices, 20, 2) : { middle: [], upper: [], lower: [] };
  const rsiData = prices.length > 0 ? calculateRSI(prices, 14) : [];
  const macdData = prices.length > 0 ? calculateMACD(prices, 12, 26, 9) : { macdLine: [], signalLine: [], histogram: [] };

  const latestPrice = currentAsset.price || prices[prices.length - 1] || 0;
  const latestMa20 = ma20Data[ma20Data.length - 1];
  const latestMa50 = ma50Data[ma50Data.length - 1];
  const latestRsi = rsiData[rsiData.length - 1];
  const latestMacd = macdData.macdLine?.length > 0 ? {
    macdLine: macdData.macdLine[macdData.macdLine.length - 1],
    signalLine: macdData.signalLine[macdData.signalLine.length - 1]
  } : null;
  const latestBollinger = bbData.upper?.length > 0 ? {
    upper: bbData.upper[bbData.upper.length - 1],
    middle: bbData.middle[bbData.middle.length - 1],
    lower: bbData.lower[bbData.lower.length - 1]
  } : null;

  // 3. Trigger Deep AI analysis
  const handleTriggerAnalysis = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const priceTrend = prices.slice(-15); // Get last 15 prices
      
      const payload = {
        symbol: selectedSymbol,
        currentPrice: latestPrice,
        priceTrend,
        indicators: {
          rsi: latestRsi,
          ma20: latestMa20,
          ma50: latestMa50,
          macd: latestMacd,
          bollinger: latestBollinger
        }
      };

      const res = await fetch('http://localhost:5001/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || 'Failed to call OpenAI API. Hãy kiểm tra lại API Key trong file .env');
      }

      const data = await res.json();
      if (data.success) {
        setAiAnalysis(data.advice);
        // Start conversation history with the initial analysis
        setChatHistory([
          { role: 'assistant', content: data.advice }
        ]);
      } else {
        throw new Error('Không nhận được phân tích hợp lệ từ AI.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // 4. Send follow-up chat message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setError(null);

    // Update history with user message
    const updatedHistory = [...chatHistory, { role: 'user', content: userMsg }];
    setChatHistory(updatedHistory);
    setChatLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory,
          symbol: selectedSymbol,
          currentPrice: latestPrice
        })
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || 'Gửi tin nhắn thất bại.');
      }

      const data = await res.json();
      if (data.success && data.reply) {
        setChatHistory([...updatedHistory, { role: 'assistant', content: data.reply }]);
      } else {
        throw new Error('Phản hồi từ AI không hợp lệ.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-slate-100 pb-10 animate-fadeIn">
      {/* LEFT COLUMN: Asset Selection & Metrics */}
      <div className="lg:col-span-1 flex flex-col gap-5">
        {/* Selection Card */}
        <div className="bg-slate-900/40 border border-slate-700/25 rounded-2xl p-5 shadow-xl backdrop-blur-lg flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200">Cấu hình phân tích</h3>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Chọn tài sản phân tích</label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/25 focus:border-emerald-500 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-0 transition-all font-semibold text-slate-200 cursor-pointer"
            >
              {marketAssets.map(asset => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.symbol} - {asset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Metrics */}
          <div className="bg-slate-950/40 border border-slate-700/15 rounded-xl p-3.5 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Giá hiện tại</span>
            <span className="text-sm font-bold font-mono text-slate-200">
              {formatValSymbol(latestPrice, selectedSymbol)}
            </span>
            <div className={`text-[10px] font-bold font-mono mt-1 ${currentAsset.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {currentAsset.change >= 0 ? '▲ +' : '▼ '}{currentAsset.change}% (24h)
            </div>
          </div>
        </div>

        {/* Live Metrics Feeder */}
        <div className="bg-slate-900/40 border border-slate-700/15 rounded-2xl p-5 shadow-xl backdrop-blur-lg flex flex-col gap-4">
          <div className="border-b border-slate-700/25 pb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Dữ liệu nạp vào AI (1Y)</span>
            {loadingHistory && <RefreshCw className="h-3.5 w-3.5 text-emerald-400 animate-spin" />}
          </div>

          <div className="flex flex-col gap-3 text-xs font-mono">
            {/* RSI */}
            <div className="flex items-center justify-between border-b border-slate-700/15 pb-1.5">
              <span className="text-slate-500 text-[10px] uppercase">RSI (14)</span>
              <span className={`font-bold ${latestRsi >= 70 ? 'text-rose-400' : latestRsi <= 30 ? 'text-emerald-400' : 'text-slate-200'}`}>
                {latestRsi ? latestRsi.toFixed(2) : 'Đang tính...'}
              </span>
            </div>

            {/* MA50 */}
            <div className="flex items-center justify-between border-b border-slate-700/15 pb-1.5">
              <span className="text-slate-500 text-[10px] uppercase">Đường xu hướng MA50</span>
              <span className="font-bold text-slate-200">
                {latestMa50 ? formatValSymbol(latestMa50, selectedSymbol) : 'Đang tính...'}
              </span>
            </div>

            {/* Bollinger Bands */}
            <div className="flex flex-col gap-1 border-b border-slate-700/15 pb-1.5">
              <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase">
                <span>Dải Bollinger Bands</span>
              </div>
              <div className="flex items-center justify-between pl-2 text-[10px] text-slate-400 font-sans">
                <span>Dải trên (Upper):</span>
                <span className="font-mono text-slate-300">{latestBollinger ? formatValSymbol(latestBollinger.upper, selectedSymbol) : '...'}</span>
              </div>
              <div className="flex items-center justify-between pl-2 text-[10px] text-slate-400 font-sans">
                <span>Dải dưới (Lower):</span>
                <span className="font-mono text-slate-300">{latestBollinger ? formatValSymbol(latestBollinger.lower, selectedSymbol) : '...'}</span>
              </div>
            </div>

            {/* MACD */}
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-[10px] uppercase">Động lượng MACD</span>
              <div className="flex items-center justify-between pl-2 text-[10px] text-slate-400 font-sans">
                <span>MACD Line:</span>
                <span className="font-mono text-slate-300">{latestMacd ? latestMacd.macdLine.toFixed(2) : '...'}</span>
              </div>
              <div className="flex items-center justify-between pl-2 text-[10px] text-slate-400 font-sans">
                <span>Signal Line:</span>
                <span className="font-mono text-slate-300">{latestMacd ? latestMacd.signalLine.toFixed(2) : '...'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: AI Workspace / Chat Dashboard */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        {/* Error panel */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-xs flex items-start gap-3 shadow-lg">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-bold">Lỗi kết nối / xác thực:</span>
              <span>{error}</span>
              <span className="text-[10px] text-slate-500 mt-1 font-sans">Vui lòng kiểm tra lại xem cổng backend 5001 đang chạy và file `.env` ở thư mục backend đã được cài đặt `OPENAI_API_KEY` chính xác chưa.</span>
            </div>
          </div>
        )}

        {/* AI Analysis and Chat Dashboard */}
        <div className="bg-slate-900/40 border border-slate-700/25 rounded-2xl shadow-2xl backdrop-blur-lg flex flex-col min-h-[500px] max-h-[700px] overflow-hidden">
          {/* Dashboard Header */}
          <div className="p-4 border-b border-slate-700/25 flex items-center justify-between bg-slate-950/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl shadow-lg shadow-emerald-500/10">
                <Bot className="h-5 w-5 text-slate-950" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Bàn làm việc Trading GPT Chuyên sâu</h3>
                <p className="text-[9px] text-slate-500 font-medium">Báo cáo & Chiến lược đòn bẩy Futures / DCA</p>
              </div>
            </div>

            {/* Run Analysis Trigger Button */}
            <button
              onClick={handleTriggerAnalysis}
              disabled={analyzing || loadingHistory}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Đang phân tích...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Phân tích chuyên sâu bằng AI ✨</span>
                </>
              )}
            </button>
          </div>

          {/* Chat / Analysis display container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[300px]">
            {/* If no analysis has been generated yet */}
            {chatHistory.length === 0 && !analyzing && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-4 my-10">
                <div className="p-4 bg-slate-850/50 rounded-full border border-slate-700/25 shadow-md">
                  <Bot className="h-10 w-10 text-emerald-400/80" />
                </div>
                <div className="max-w-md">
                  <h4 className="text-sm font-bold text-slate-200">Trợ lý AI sẵn sàng nhận định chiến lược</h4>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-sans">
                    Vui lòng bấm nút **"Phân tích chuyên sâu bằng AI ✨"** ở góc trên để nạp dữ liệu kỹ thuật thực tế của **{selectedSymbol}** vào mô hình AI GPT-4o-mini. Hệ thống sẽ trả về báo cáo phân tích Tích sản và điểm vào lệnh Trading CFD/Futures đầy đủ.
                  </p>
                </div>
              </div>
            )}

            {/* Analyzing loading state */}
            {analyzing && (
              <div className="space-y-4 animate-pulse my-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-emerald-400 animate-spin" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono">Trading GPT đang quét dữ liệu thị trường...</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-md w-3/4"></div>
                <div className="h-3 bg-slate-850 rounded-md w-5/6"></div>
                <div className="h-3 bg-slate-850 rounded-md w-1/2"></div>
                <div className="h-4 bg-slate-800 rounded-md w-2/3 mt-6"></div>
                <div className="h-3 bg-slate-850 rounded-md w-4/5"></div>
              </div>
            )}

            {/* Chat Messages */}
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Icon */}
                <div className={`p-2 h-8 w-8 rounded-xl shrink-0 border flex items-center justify-center shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-slate-950 border-slate-700/25 text-emerald-400' 
                    : 'bg-slate-850 border-slate-750 text-emerald-400'
                }`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Message Box */}
                <div className={`rounded-2xl p-4 text-xs shadow-md border ${
                  msg.role === 'user'
                    ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-200'
                    : 'bg-slate-950/40 border-slate-700/15 text-slate-300'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                    <SafeMarkdown text={msg.content} />
                  )}
                </div>
              </div>
            ))}

            {/* Chat loading state */}
            {chatLoading && (
              <div className="flex gap-3 max-w-[85%] animate-pulse">
                <div className="p-2 h-8 w-8 rounded-xl shrink-0 border flex items-center justify-center bg-slate-850 border-slate-750 text-emerald-400">
                  <Bot className="h-4 w-4 animate-spin" />
                </div>
                <div className="bg-slate-950/40 border border-slate-700/15 rounded-2xl p-4 text-xs text-slate-500 flex items-center gap-1.5">
                  <span>Trợ lý đang suy nghĩ câu trả lời...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat input form */}
          {chatHistory.length > 0 && (
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700/25 bg-slate-950/40 flex items-center gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Hỏi thêm trợ lý về tài sản ${selectedSymbol} hoặc cách áp dụng phương án trade...`}
                disabled={chatLoading}
                className="flex-1 bg-slate-900 border border-slate-700/25 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs focus:outline-none text-slate-200 transition-all placeholder-slate-500 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-750 font-bold p-2.5 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
