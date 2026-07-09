import React, { useState, useRef } from 'react';

const RANGE_TOOLTIPS = {
  '1D': 'Dữ liệu 1 ngày gần nhất, nến 5 phút',
  '5D': 'Dữ liệu 5 ngày gần nhất, nến 15 phút',
  '1M': 'Dữ liệu 1 tháng gần nhất, nến 1 ngày',
  '3M': 'Dữ liệu 3 tháng gần nhất, nến 1 ngày',
  '6M': 'Dữ liệu 6 tháng gần nhất, nến 1 ngày',
  '1Y': 'Dữ liệu 1 năm gần nhất, nến 1 ngày',
  '5Y': 'Dữ liệu 5 năm gần nhất, nến 1 tuần',
  'ALL': 'Toàn bộ dữ liệu lịch sử, nến 1 tháng'
};

export default function CandlestickChart({ data, isVndAsset }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const svgRef = useRef(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center border border-dashed border-slate-700/25 rounded-2xl bg-slate-900/10">
        <span className="text-slate-500 text-sm">Không có dữ liệu biểu đồ nến</span>
      </div>
    );
  }

  // SVG ViewBox Dimensions
  const viewWidth = 1000;
  const viewHeight = 420;

  const paddingLeft = 30;
  const paddingRight = 90;
  const paddingTop = 60;
  const paddingBottom = 40;

  const chartWidth = viewWidth - paddingLeft - paddingRight;
  const chartHeight = viewHeight - paddingTop - paddingBottom;

  // Price boundaries
  const prices = data.flatMap(d => [d.open, d.high, d.low, d.close]).filter(p => p !== null && !isNaN(p));
  const minPriceRaw = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPriceRaw = prices.length > 0 ? Math.max(...prices) : 100;
  const priceRange = maxPriceRaw - minPriceRaw || 1;
  const minPrice = Math.max(0, minPriceRaw - priceRange * 0.05);
  const maxPrice = maxPriceRaw + priceRange * 0.05;

  // Volume boundary
  const maxVolume = Math.max(...data.map(d => d.volume || 0)) || 1;

  // Coordinate mapping helper functions
  const getX = (index) => {
    return paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;
  };

  const getY = (price) => {
    return paddingTop + (1 - (price - minPrice) / (maxPrice - minPrice)) * chartHeight;
  };

  const getVolHeight = (vol) => {
    const maxVolHeight = chartHeight * 0.22; // max height is 22% of chart height
    return (vol / maxVolume) * maxVolHeight;
  };

  // Format currencies helper
  const formatVal = (val) => {
    if (val === undefined || val === null) return 'N/A';
    if (isVndAsset) {
      return Math.round(val).toLocaleString('vi-VN') + ' VNĐ';
    }
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Format volumes helper
  const formatVolume = (vol) => {
    if (vol === undefined || vol === null) return 'N/A';
    if (isVndAsset) {
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

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const relativeX = (clientX / rect.width) * viewWidth;

    // Estimate index based on relative mouse X
    const estimatedIndex = Math.round(((relativeX - paddingLeft) / chartWidth) * (data.length - 1));
    const clampedIndex = Math.max(0, Math.min(data.length - 1, estimatedIndex));
    setHoveredIndex(clampedIndex);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Y-axis grid ticks (5 subdivisions)
  const yTicks = Array.from({ length: 5 }).map((_, i) => {
    const val = minPrice + (priceRange * 1.1 * i) / 4;
    return val;
  });

  // X-axis date labels (6 labels spaced evenly)
  const xLabelsCount = Math.min(data.length, 6);
  const xIndices = Array.from({ length: xLabelsCount }).map((_, i) => {
    return Math.round((i * (data.length - 1)) / (xLabelsCount - 1 || 1));
  });

  const activePoint = hoveredIndex !== null ? data[hoveredIndex] : data[data.length - 1];
  const isUp = activePoint.close >= activePoint.open;
  const pctChange = activePoint.open !== 0 
    ? ((activePoint.close - activePoint.open) / activePoint.open) * 100 
    : 0;

  return (
    <div className="relative w-full bg-slate-950/20 border border-slate-700/15 rounded-2xl p-4 flex flex-col gap-3">
      {/* HUD Info Header */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono bg-slate-900/40 py-2 px-4 rounded-xl border border-slate-800/50">
        <span className="text-slate-400 font-bold uppercase shrink-0">Chỉ số phiên:</span>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-slate-500">Mở:</span>
          <span className="font-bold text-slate-100">{formatVal(activePoint.open)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-slate-500">Cao:</span>
          <span className="font-bold text-emerald-400">{formatVal(activePoint.high)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-slate-500">Thấp:</span>
          <span className="font-bold text-rose-400">{formatVal(activePoint.low)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-slate-500">Đóng:</span>
          <span className={`font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatVal(activePoint.close)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-slate-500">Thay đổi:</span>
          <span className={`font-bold ${pctChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {pctChange >= 0 ? '+' : ''}{pctChange.toFixed(2)}%
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-slate-500">Vol:</span>
          <span className="font-bold text-slate-100">{formatVolume(activePoint.volume)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300 ml-auto hidden sm:flex">
          <span className="text-slate-500">Thời gian:</span>
          <span className="font-bold text-slate-100">{activePoint.date}</span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="w-full h-auto cursor-crosshair overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid lines (Y-axis horizontal lines) */}
          {yTicks.map((val, idx) => {
            const y = getY(val);
            if (y < paddingTop || y > paddingTop + chartHeight) return null;
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={paddingLeft + chartWidth}
                  y2={y}
                  stroke="#334155"
                  strokeWidth={0.5}
                  strokeDasharray="4 4"
                  opacity={0.3}
                />
                <text
                  x={paddingLeft + chartWidth + 8}
                  y={y + 3.5}
                  fill="#94a3b8"
                  fontSize={8}
                  fontFamily="monospace"
                  textAnchor="start"
                >
                  {formatVal(val)}
                </text>
              </g>
            );
          })}

          {/* Grid lines (X-axis vertical lines for dates) */}
          {xIndices.map((idxVal) => {
            const x = getX(idxVal);
            const item = data[idxVal];
            if (!item) return null;
            return (
              <g key={idxVal}>
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={paddingTop + chartHeight}
                  stroke="#334155"
                  strokeWidth={0.5}
                  strokeDasharray="4 4"
                  opacity={0.15}
                />
                <text
                  x={x}
                  y={paddingTop + chartHeight + 16}
                  fill="#64748b"
                  fontSize={8}
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {item.date}
                </text>
              </g>
            );
          })}

          {/* Volume Bars (rendered behind wicks/bodies for cleanliness) */}
          {data.map((d, idx) => {
            const x = getX(idx);
            const colWidth = Math.max(1.5, (chartWidth / data.length) * 0.7);
            const volHeight = getVolHeight(d.volume);
            const yVol = paddingTop + chartHeight - volHeight;
            const isCandleUp = d.close >= d.open;

            return (
              <rect
                key={`vol-${idx}`}
                x={x - colWidth / 2}
                y={yVol}
                width={colWidth}
                height={volHeight}
                fill={isCandleUp ? '#10b981' : '#f43f5e'}
                opacity={0.15}
              />
            );
          })}

          {/* Candlestick Wicks and Bodies */}
          {data.map((d, idx) => {
            const x = getX(idx);
            const yHigh = getY(d.high);
            const yLow = getY(d.low);
            const yOpen = getY(d.open);
            const yClose = getY(d.close);

            const isCandleUp = d.close >= d.open;
            const color = isCandleUp ? '#10b981' : '#f43f5e';
            const colWidth = Math.max(2, (chartWidth / data.length) * 0.7);

            const bodyY = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(1, Math.abs(yOpen - yClose));

            return (
              <g key={`candle-${idx}`}>
                {/* Wick (Shadow line) */}
                <line
                  x1={x}
                  y1={yHigh}
                  x2={x}
                  y2={yLow}
                  stroke={color}
                  strokeWidth={1.2}
                />
                {/* Body (Rect) */}
                <rect
                  x={x - colWidth / 2}
                  y={bodyY}
                  width={colWidth}
                  height={bodyHeight}
                  fill={color}
                  stroke={color}
                  strokeWidth={0.5}
                />
              </g>
            );
          })}

          {/* Crosshairs & Highlight points (Rendered on Hover) */}
          {hoveredIndex !== null && (
            <g>
              {/* Vertical line */}
              <line
                x1={getX(hoveredIndex)}
                y1={paddingTop}
                x2={getX(hoveredIndex)}
                y2={paddingTop + chartHeight}
                stroke="#64748b"
                strokeWidth={0.8}
                strokeDasharray="3 3"
              />
              {/* Horizontal line */}
              <line
                x1={paddingLeft}
                y1={getY(activePoint.close)}
                x2={paddingLeft + chartWidth}
                y2={getY(activePoint.close)}
                stroke="#64748b"
                strokeWidth={0.8}
                strokeDasharray="3 3"
              />
              {/* Active point indicator */}
              <circle
                cx={getX(hoveredIndex)}
                cy={getY(activePoint.close)}
                r={4}
                fill={isUp ? '#10b981' : '#f43f5e'}
                stroke="#020617"
                strokeWidth={1.5}
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
