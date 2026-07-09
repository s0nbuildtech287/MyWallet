import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export default function SmartAdvisor({
  symbol,
  currentPrice,
  ma20,
  ma50,
  rsi,
  macd,
  bollinger,
  isVnd
}) {
  // Logic to calculate recommendation
  let rsiText = 'Bình thường';
  let rsiColor = 'text-slate-300';
  let rsiAdvice = '';
  
  if (rsi !== null && rsi !== undefined) {
    if (rsi >= 70) {
      rsiText = `Quá mua (${rsi})`;
      rsiColor = 'text-rose-400 font-bold';
      rsiAdvice = 'Giá đang ở vùng quá mua (hưng phấn cao), có rủi ro điều chỉnh ngắn hạn.';
    } else if (rsi <= 30) {
      rsiText = `Quá bán (${rsi})`;
      rsiColor = 'text-emerald-400 font-bold';
      rsiAdvice = 'Giá đang ở vùng quá bán (hoảng loạn), là vùng chiết khấu tốt cho tích sản dài hạn.';
    } else {
      rsiText = `Trung tính (${rsi})`;
      rsiColor = 'text-slate-300';
      rsiAdvice = 'Giá đang tích lũy ổn định, chưa có dấu hiệu quá nóng hoặc quá bán.';
    }
  }

  // Trend analysis (price vs MA50)
  let trendText = 'Chưa xác định';
  let trendColor = 'text-slate-300';
  let trendAdvice = '';
  const hasMa = ma50 !== null && ma50 !== undefined;
  
  if (hasMa) {
    if (currentPrice > ma50) {
      trendText = 'Tăng trưởng';
      trendColor = 'text-emerald-400 font-bold';
      trendAdvice = 'Giá nằm trên đường trung bình 50 ngày (MA50), xác nhận xu hướng tăng trung hạn.';
    } else {
      trendText = 'Điều chỉnh';
      trendColor = 'text-amber-400 font-bold';
      trendAdvice = 'Giá nằm dưới đường trung bình 50 ngày (MA50), báo hiệu xu hướng điều chỉnh hoặc tích lũy giảm.';
    }
  }

  // MACD Analysis
  let macdText = 'Ổn định';
  let macdColor = 'text-slate-300';
  let macdAdvice = '';
  
  if (macd && macd.macdLine !== null && macd.signalLine !== null) {
    const diff = macd.macdLine - macd.signalLine;
    if (diff > 0) {
      macdText = 'Tích cực';
      macdColor = 'text-emerald-400 font-bold';
      macdAdvice = 'Đường MACD nằm trên đường Tín hiệu, dòng tiền ngắn hạn đang ủng hộ xu hướng tăng.';
    } else {
      macdText = 'Tiêu cực';
      macdColor = 'text-rose-400 font-bold';
      macdAdvice = 'Đường MACD nằm dưới đường Tín hiệu, dòng tiền ngắn hạn đang suy yếu.';
    }
  }

  // Bollinger Bands Analysis
  let bbText = 'Tích lũy';
  let bbColor = 'text-slate-300';
  let bbAdvice = '';
  
  if (bollinger && bollinger.upper !== null && bollinger.lower !== null) {
    const bandWidth = (bollinger.upper - bollinger.lower) / bollinger.middle;
    if (currentPrice >= bollinger.upper * 0.97) {
      bbText = 'Cận trên dải';
      bbColor = 'text-rose-400 font-bold';
      bbAdvice = 'Giá đang tiệm cận biên trên của dải Bollinger, dễ gặp lực cản chốt lời.';
    } else if (currentPrice <= bollinger.lower * 1.03) {
      bbText = 'Cận dưới dải';
      bbColor = 'text-emerald-400 font-bold';
      bbAdvice = 'Giá đang giảm về biên dưới của dải Bollinger, thường có lực cầu đỡ giá tại đây.';
    } else {
      bbText = 'Trong biên an toàn';
      bbColor = 'text-slate-300';
      bbAdvice = 'Giá dao động ổn định quanh trục trung tâm của dải Bollinger.';
    }
  }

  // Final Recommendation Aggregator & Dynamic Sentence Generator
  let finalStatus = 'Theo dõi thêm'; // default
  let statusBadgeClass = 'bg-slate-800 text-slate-300 border-slate-700';
  let mainIcon = <Info className="h-5 w-5 text-slate-400" />;
  let finalDescription = '';

  const rsiScore = rsi !== null && rsi !== undefined ? (rsi >= 70 ? -1 : rsi <= 30 ? 2 : 0) : 0;
  const trendScore = hasMa ? (currentPrice > ma50 ? 1 : -0.5) : 0;
  const macdScore = macd && macd.macdLine !== null && macd.signalLine !== null ? ((macd.macdLine - macd.signalLine) > 0 ? 1 : -0.5) : 0;
  const bbScore = bollinger && bollinger.upper !== null && bollinger.lower !== null ? (currentPrice <= bollinger.lower * 1.03 ? 1 : currentPrice >= bollinger.upper * 0.97 ? -1 : 0) : 0;

  const totalScore = rsiScore + trendScore + macdScore + bbScore;

  // Compile active indicator signals dynamically
  const activeSignals = [];
  if (rsi !== null && rsi !== undefined) {
    if (rsi >= 70) activeSignals.push(`chỉ số định giá ngắn hạn RSI đang ở vùng quá mua hưng phấn (${rsi})`);
    else if (rsi <= 30) activeSignals.push(`chỉ số RSI rơi vào vùng quá bán chiết khấu tốt (${rsi})`);
  }
  if (hasMa) {
    if (currentPrice > ma50) activeSignals.push("đường giá giữ vững trên xu thế tăng MA50");
    else activeSignals.push("giá đang nằm trong nhịp điều chỉnh dưới MA50");
  }
  if (macd && macd.macdLine !== null && macd.signalLine !== null) {
    if (macd.macdLine > macd.signalLine) activeSignals.push("dòng tiền ngắn hạn MACD ủng hộ xu hướng tăng");
    else activeSignals.push("dòng tiền MACD đang suy yếu ngắn hạn");
  }
  if (bollinger && bollinger.upper !== null && bollinger.lower !== null) {
    if (currentPrice >= bollinger.upper * 0.97) activeSignals.push("giá chạm cận trên dải Bollinger Bands (vùng cản kỹ thuật)");
    else if (currentPrice <= bollinger.lower * 1.03) activeSignals.push("giá chạm dải dưới Bollinger Bands (vùng hỗ trợ kỹ thuật)");
  }

  const signalsText = activeSignals.length > 0 ? activeSignals.join(', ') : 'các chỉ báo đang ở trạng thái cân bằng';

  if (totalScore >= 2) {
    finalStatus = 'Tích sản tốt';
    statusBadgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    mainIcon = <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
    finalDescription = `Tài sản ${symbol} ghi nhận các tín hiệu tích sản tốt do ${signalsText}. Vùng giá hiện tại đang có mức chiết khấu kỹ thuật hấp dẫn, rất phù hợp để gia tăng tích trữ đều đặn cho danh mục dài hạn.`;
  } else if (totalScore < 0) {
    finalStatus = 'Hạn chế mua đuổi';
    statusBadgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    mainIcon = <AlertTriangle className="h-5 w-5 text-rose-400" />;
    finalDescription = `Tài sản ${symbol} đang có dấu hiệu tăng nóng trong ngắn hạn hoặc chịu áp lực điều chỉnh do ${signalsText}. Bạn nên kiên nhẫn chờ các nhịp điều chỉnh (rung lắc kỹ thuật) để có điểm mua tối ưu hơn thay vì dồn vốn mua đuổi ở vùng đỉnh ngắn hạn.`;
  } else {
    finalStatus = 'Quan sát & Mua rải';
    statusBadgeClass = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    mainIcon = <Sparkles className="h-5 w-5 text-amber-300" />;
    finalDescription = `Tài sản ${symbol} đang tích lũy đi ngang ổn định với trạng thái kỹ thuật: ${signalsText}. Chiến lược thích hợp nhất lúc này là duy trì mua tích lũy rải đều định kỳ theo tuần/tháng (DCA) để tối ưu hóa giá vốn dài hạn.`;
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-slate-700/15 rounded-2xl p-5 shadow-2xl backdrop-blur-lg flex flex-col gap-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/25 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-200">Trợ lý Khuyến nghị Tích sản</h3>
        </div>
        <span className={`text-[10px] uppercase tracking-wider font-bold py-1 px-3 rounded-full border ${statusBadgeClass} flex items-center gap-1.5`}>
          {mainIcon}
          {finalStatus}
        </span>
      </div>

      {/* Main Analysis Text */}
      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 border border-slate-700/15 rounded-xl p-3.5 italic">
        "{finalDescription}"
      </p>

      {/* Grid of Indicator Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* RSI */}
        {rsi !== null && (
          <div className="bg-slate-950/30 border border-slate-700/15 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Định giá ngắn hạn (RSI)</span>
            <span className={`text-xs font-mono font-bold ${rsiColor}`}>{rsiText}</span>
            <p className="text-[9px] text-slate-400 mt-1 leading-normal">{rsiAdvice}</p>
          </div>
        )}

        {/* Trend */}
        {hasMa && (
          <div className="bg-slate-950/30 border border-slate-700/15 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Xu thế trung hạn (MA50)</span>
            <span className={`text-xs font-bold ${trendColor}`}>{trendText}</span>
            <p className="text-[9px] text-slate-400 mt-1 leading-normal">{trendAdvice}</p>
          </div>
        )}

        {/* MACD */}
        {macd && macd.macdLine !== null && (
          <div className="bg-slate-950/30 border border-slate-700/15 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Dòng tiền ngắn hạn (MACD)</span>
            <span className={`text-xs font-bold ${macdColor}`}>{macdText}</span>
            <p className="text-[9px] text-slate-400 mt-1 leading-normal">{macdAdvice}</p>
          </div>
        )}

        {/* Bollinger Bands */}
        {bollinger && bollinger.upper !== null && (
          <div className="bg-slate-950/30 border border-slate-700/15 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Vùng biến động (Bollinger)</span>
            <span className={`text-xs font-bold ${bbColor}`}>{bbText}</span>
            <p className="text-[9px] text-slate-400 mt-1 leading-normal">{bbAdvice}</p>
          </div>
        )}
      </div>
    </div>
  );
}
