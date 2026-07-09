import React, { useEffect, useRef, useState } from 'react';

// Cache để tránh gọi API nhiều lần cho cùng symbol
const sparklineCache = {};

export default function SparklineChart({ symbol, change }) {
  const canvasRef = useRef(null);
  const [prices, setPrices] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchSparkline = async () => {
      // Dùng cache nếu đã có
      if (sparklineCache[symbol]) {
        if (!cancelled) setPrices(sparklineCache[symbol]);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5001/api/chart?symbol=${encodeURIComponent(symbol)}&range=1mo&interval=1d`
        );
        if (!res.ok) return;
        const data = await res.json();
        const result = data?.chart?.result?.[0];
        if (!result) return;

        const closes = result.indicators?.quote?.[0]?.close || [];
        const filtered = closes.filter(v => v !== null && v !== undefined);
        if (filtered.length < 2) return;

        sparklineCache[symbol] = filtered;
        if (!cancelled) setPrices(filtered);
      } catch {
        // Bỏ qua lỗi fetch, sparkline sẽ không hiển thị
      }
    };

    fetchSparkline();
    return () => { cancelled = true; };
  }, [symbol]);

  useEffect(() => {
    if (!prices || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const isPositive = change >= 0;
    const lineColor = isPositive ? '#10b981' : '#f43f5e';
    const fillColor = isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)';

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;

    const padX = 2;
    const padY = 4;
    const plotW = W - padX * 2;
    const plotH = H - padY * 2;

    const toX = (i) => padX + (i / (prices.length - 1)) * plotW;
    const toY = (v) => padY + plotH - ((v - min) / range) * plotH;

    // Vẽ fill area
    ctx.beginPath();
    ctx.moveTo(toX(0), H);
    prices.forEach((v, i) => ctx.lineTo(toX(i), toY(v)));
    ctx.lineTo(toX(prices.length - 1), H);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Vẽ đường line
    ctx.beginPath();
    prices.forEach((v, i) => {
      if (i === 0) ctx.moveTo(toX(i), toY(v));
      else ctx.lineTo(toX(i), toY(v));
    });
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Chấm tròn tại điểm cuối
    const lastX = toX(prices.length - 1);
    const lastY = toY(prices[prices.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();
  }, [prices, change]);

  if (!prices) {
    return (
      <div className="w-[100px] h-[36px] flex items-center justify-center">
        <div className="w-12 h-0.5 bg-slate-700 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={100}
      height={36}
      className="block"
      title={`Biểu đồ giá 30 ngày của ${symbol}`}
    />
  );
}
