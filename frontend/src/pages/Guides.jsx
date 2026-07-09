import React from 'react';
import { Flame, BookOpen, Layers, ArrowRight, Shield, Award, HelpCircle } from 'lucide-react';

const SUGGESTED_SIMULATIONS = [
  { 
    name: 'Tích sản FPT 5 năm', 
    symbol: 'FPT.VN', 
    duration: '5 năm (2021-2026)', 
    returnRate: '+192.4%', 
    type: 'DCA Số lượng',
    desc: 'Phương pháp tích lũy cổ phiếu công nghệ FPT đều đặn mỗi tháng, tận dụng sự phát triển mạnh mẽ của kỷ nguyên số và AI.',
    params: { symbol: 'FPT.VN', mode: 'dca-qty', value: '100', start: '2021-01-01' }
  },
  { 
    name: 'Tích lũy Bitcoin từ đáy', 
    symbol: 'BTC-USD', 
    duration: '3 năm (2023-2026)', 
    returnRate: '+284.1%', 
    type: 'DCA Tiền mặt',
    desc: 'Đầu tư định kỳ bằng tiền mặt vào Bitcoin khi thị trường tạo đáy dài hạn, tối ưu hóa giá vốn trung bình cho tài sản số.',
    params: { symbol: 'BTC-USD', mode: 'dca-amount', value: '100', start: '2023-01-01' }
  },
  { 
    name: 'Tích sản Hòa Phát', 
    symbol: 'HPG.VN', 
    duration: '5 năm (2021-2026)', 
    returnRate: '+84.6%', 
    type: 'DCA Số lượng',
    desc: 'Tích lũy cổ phiếu chu kỳ đầu ngành thép Hòa Phát, gặt hái thành quả lớn khi chu kỳ xây dựng và bất động sản hồi phục.',
    params: { symbol: 'HPG.VN', mode: 'dca-qty', value: '100', start: '2021-01-01' }
  },
  { 
    name: 'Đầu tư Vàng phòng thủ', 
    symbol: 'GC=F', 
    duration: '8 năm (2018-2026)', 
    returnRate: '+78.9%', 
    type: 'DCA Tiền mặt',
    desc: 'Chiến lược phân bổ một phần vốn đều đặn vào Vàng để làm hàng rào chống lại lạm phát và các rủi ro địa chính trị toàn cầu.',
    params: { symbol: 'GC=F', mode: 'dca-amount', value: '100', start: '2018-01-01' }
  }
];

const INVESTMENT_METHODS = [
  {
    title: 'DCA Số tiền mặt cố định (DCA Amount)',
    desc: 'Mỗi chu kỳ (ví dụ đầu tháng), bạn bỏ ra một số tiền cố định (ví dụ 2 triệu VND) để mua tài sản mà không cần quan tâm đến giá.',
    pros: 'Thích hợp với người làm công ăn lương có thu nhập cố định hàng tháng. Tự động mua nhiều hơn khi giá rẻ và ít hơn khi giá đắt.',
    cons: 'Số lượng tài sản sở hữu lẻ tẻ, phụ thuộc vào giá thị trường tại thời điểm khớp lệnh.'
  },
  {
    title: 'DCA Số lượng tài sản cố định (DCA Quantity)',
    desc: 'Mỗi chu kỳ, bạn mua chính xác một số lượng tài sản cố định (ví dụ 100 cổ phiếu HPG hoặc 0.01 BTC) bất kể giá cao hay thấp.',
    pros: 'Giúp nhanh chóng tích lũy đủ lô cổ phiếu (ví dụ bội số của 100 để dễ bán trên sàn Việt Nam). Phù hợp gom tài sản tích sản.',
    cons: 'Số tiền chi tiêu hàng tháng sẽ biến động theo giá thị trường, đòi hỏi lượng dự phòng tài chính linh hoạt.'
  },
  {
    title: 'Đầu tư một lần duy nhất (Lump-Sum)',
    desc: 'Bạn đầu tư toàn bộ số vốn dự định ngay tại thời điểm ban đầu và nắm giữ dài hạn.',
    pros: 'Tối ưu hóa lợi nhuận cực đại nếu mua đúng thời điểm thị trường chuẩn bị bước vào sóng tăng giá mạnh mẽ (Uptrend).',
    cons: 'Rủi ro đu đỉnh ngắn hạn rất cao nếu thị trường đảo chiều ngay sau khi giải ngân.'
  }
];

const BEGINNER_TIPS = [
  {
    title: 'Quy tắc "Không bỏ trứng vào một giỏ"',
    content: 'Đa dạng hóa danh mục đầu tư là chìa khóa sống còn. Người mới nên chia vốn vào nhiều nhóm tài sản có tính tương hỗ (Ví dụ: 50% Cổ phiếu tăng trưởng, 20% Vàng phòng thủ, 20% Tiền gửi tiết kiệm, 10% Crypto mạo hiểm).'
  },
  {
    title: 'Xây dựng quỹ khẩn cấp trước khi đầu tư',
    content: 'Không bao giờ được dùng tiền sinh hoạt thiết yếu để đem đi tích sản. Hãy đảm bảo bạn đã có một quỹ khẩn cấp tương đương 3-6 tháng chi tiêu gửi tiết kiệm ngắn hạn để tránh việc phải bán cắt lỗ tài sản khi cần tiền mặt gấp.'
  },
  {
    title: 'Tận dụng sức mạnh vĩ đại của Lãi kép',
    content: 'Lãi kép hoạt động tốt nhất theo thời gian. Đầu tư tích sản đều đặn $100 mỗi tháng với lãi suất 10%/năm sẽ mang lại khối tài sản khổng lồ sau 15-20 năm nhờ việc tái đầu tư phần cổ tức/lợi nhuận liên tục.'
  },
  {
    title: 'Kiên định tâm lý và loại bỏ FOMO',
    content: 'Thị trường tài chính luôn có các nhịp điều chỉnh mạnh 20-30%. Bản chất của tích sản là mua tích lũy dài hạn, do đó những đợt giảm giá chính là cơ hội vàng để gom tài sản với giá chiết khấu rẻ.'
  }
];

export default function Guides({ handleQuickSimulation, setActiveTab, setSymbol, setInvestMode, setInputValue, setStartDate }) {
  const runCustomPreset = (sim) => {
    setSymbol(sim.params.symbol);
    setInvestMode(sim.params.mode);
    setInputValue(sim.params.value);
    setStartDate(sim.params.start);
    setActiveTab('simulator');
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      
      {/* 1. Outstanding Suggested Investment Plans */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-lg flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
          <Flame className="h-5 w-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Các kế hoạch giả định tiêu biểu nổi bật
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUGGESTED_SIMULATIONS.map((sim, index) => (
            <div 
              key={index}
              className="p-4 bg-slate-950/50 border border-slate-850 hover:border-slate-700/60 rounded-xl transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-extrabold text-slate-100">{sim.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{sim.duration}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {sim.desc}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-900/60 pt-2.5">
                <div className="flex gap-4 text-[10px]">
                  <span className="text-slate-500">Kiểu: <strong className="text-slate-300 font-medium">{sim.type}</strong></span>
                  <span className="text-slate-500">Lợi nhuận ròng: <strong className="text-emerald-400 font-extrabold font-mono">{sim.returnRate}</strong></span>
                </div>
                
                <button
                  onClick={() => runCustomPreset(sim)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-1 px-3.5 rounded-lg text-[9px] transition-all flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <span>Chạy thử ngay</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Asset Accumulation Methodologies */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-lg flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
          <Layers className="h-5 w-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Các phương pháp tích lũy & phân bổ vốn phổ biến
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {INVESTMENT_METHODS.map((method, index) => (
            <div key={index} className="p-4 bg-slate-950/30 border border-slate-850 rounded-xl flex flex-col gap-3">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Award className="h-4 w-4 shrink-0" />
                {method.title}
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {method.desc}
              </p>
              <div className="text-[10px] flex flex-col gap-1.5 border-t border-slate-900/60 pt-2.5 mt-auto">
                <span className="text-slate-400"><strong className="text-emerald-400/80 font-semibold">Ưu điểm:</strong> {method.pros}</span>
                <span className="text-slate-500"><strong className="text-rose-400/80 font-semibold">Hạn chế:</strong> {method.cons}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Beginner Guide & Tips */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-lg flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Cẩm nang tài chính cho người mới bắt đầu
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BEGINNER_TIPS.map((tip, index) => (
            <div key={index} className="p-4 bg-slate-950/30 border border-slate-850 rounded-xl flex gap-3.5 items-start">
              <div className="p-2 bg-slate-900 rounded-lg text-emerald-400 border border-slate-800/60 shrink-0">
                <Shield className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-bold text-slate-200 leading-snug">{tip.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {tip.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
