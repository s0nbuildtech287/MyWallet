/**
 * crosshairPlugin.js
 * Chart.js plugin that draws:
 *  - A vertical dashed crosshair line on hover
 *  - Glowing dots on every dataset at the hovered x-index
 */
export const crosshairPlugin = {
  id: 'crosshairDots',
  afterDraw(chart) {
    const { ctx, tooltip, chartArea, scales } = chart;
    if (!tooltip || !tooltip.getActiveElements || tooltip.getActiveElements().length === 0) return;

    const activeElements = tooltip.getActiveElements();
    if (!activeElements.length) return;

    const firstEl = activeElements[0];
    const x = firstEl.element.x;
    const { top, bottom } = chartArea;

    ctx.save();

    // ── 1. Vertical dashed crosshair line ──────────────────────────────────
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 1;
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── 2. Glowing dot on each dataset at hover position ──────────────────
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      // Skip hidden datasets or non-line types
      if (meta.hidden || meta.type === 'bar') return;

      const element = meta.data[firstEl.index];
      if (!element) return;

      const { x: dotX, y: dotY } = element;
      const color = dataset.borderColor || '#10b981';

      // Outer glow ring
      const gradient = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 12);
      gradient.addColorStop(0, `${color}55`);
      gradient.addColorStop(1, `${color}00`);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 12, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // White ring
      ctx.beginPath();
      ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.fill();

      // Colored center
      ctx.beginPath();
      ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    ctx.restore();
  }
};
