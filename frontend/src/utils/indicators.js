/**
 * Utility functions for calculating technical indicators.
 * Calculations are performed on arrays of numbers (prices).
 */

// 1. Simple Moving Average (SMA)
export const calculateSMA = (prices, period) => {
  const sma = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += prices[i - j];
      }
      sma.push(Number((sum / period).toFixed(2)));
    }
  }
  return sma;
};

// 2. Exponential Moving Average (EMA)
export const calculateEMA = (prices, period) => {
  const ema = [];
  if (prices.length === 0) return ema;

  const k = 2 / (period + 1);
  let prevEma = prices[0];
  ema.push(prevEma);

  for (let i = 1; i < prices.length; i++) {
    const currentVal = prices[i];
    const val = currentVal * k + prevEma * (1 - k);
    ema.push(Number(val.toFixed(2)));
    prevEma = val;
  }
  return ema;
};

// 3. Bollinger Bands
export const calculateBollingerBands = (prices, period = 20, stdDevMultiplier = 2) => {
  const middle = calculateSMA(prices, period);
  const upper = [];
  const lower = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1 || middle[i] === null) {
      upper.push(null);
      lower.push(null);
    } else {
      // Calculate standard deviation
      let sumOfSquares = 0;
      const avg = middle[i];
      for (let j = 0; j < period; j++) {
        sumOfSquares += Math.pow(prices[i - j] - avg, 2);
      }
      const variance = sumOfSquares / period;
      const stdDev = Math.sqrt(variance);

      upper.push(Number((avg + stdDevMultiplier * stdDev).toFixed(2)));
      lower.push(Number((avg - stdDevMultiplier * stdDev).toFixed(2)));
    }
  }

  return { middle, upper, lower };
};

// 4. Relative Strength Index (RSI)
export const calculateRSI = (prices, period = 14) => {
  const rsi = [];
  if (prices.length <= period) {
    return new Array(prices.length).fill(null);
  }

  // First gain/loss calculations
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) {
      gains += diff;
    } else {
      losses -= diff;
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Fill nulls for initial period
  for (let i = 0; i < period; i++) {
    rsi.push(null);
  }

  // Calculate first RSI point
  if (avgLoss === 0) {
    rsi.push(100);
  } else {
    const rs = avgGain / avgLoss;
    rsi.push(Number((100 - 100 / (1 + rs)).toFixed(2)));
  }

  // Calculate subsequent points using Wilder's smoothing
  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    let gain = 0;
    let loss = 0;

    if (diff > 0) {
      gain = diff;
    } else {
      loss = -diff;
    }

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(Number((100 - 100 / (1 + rs)).toFixed(2)));
    }
  }

  return rsi;
};

// 5. Moving Average Convergence Divergence (MACD)
export const calculateMACD = (prices, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) => {
  const macdLine = [];
  const signalLine = [];
  const histogram = [];

  const shortEma = calculateEMA(prices, shortPeriod);
  const longEma = calculateEMA(prices, longPeriod);

  for (let i = 0; i < prices.length; i++) {
    if (i < longPeriod - 1) {
      macdLine.push(null);
    } else {
      macdLine.push(Number((shortEma[i] - longEma[i]).toFixed(2)));
    }
  }

  // Filter out nulls to calculate EMA for Signal Line
  const validMacdVals = macdLine.filter(v => v !== null);
  const validSignalVals = calculateEMA(validMacdVals, signalPeriod);

  let signalIdx = 0;
  for (let i = 0; i < prices.length; i++) {
    if (i < longPeriod - 1 + signalPeriod - 1) {
      signalLine.push(null);
      histogram.push(null);
    } else {
      const sigVal = validSignalVals[signalIdx++];
      const macdVal = macdLine[i];
      signalLine.push(sigVal);
      histogram.push(Number((macdVal - sigVal).toFixed(2)));
    }
  }

  return { macdLine, signalLine, histogram };
};
