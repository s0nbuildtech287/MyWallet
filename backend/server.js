import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API proxy endpoint to fetch Yahoo Finance historical chart data
app.get('/api/chart', async (req, res) => {
  const { symbol, period1, period2, range, interval } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing required parameter: symbol' });
  }

  const queryInterval = interval || '1d';
  let url;

  if (range) {
    url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${queryInterval}`;
  } else {
    if (!period1 || !period2) {
      return res.status(400).json({ error: 'Missing required parameters: period1 and period2 (or range)' });
    }
    url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=${queryInterval}`;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (response.data.chart && response.data.chart.error) {
      return res.status(400).json({ error: response.data.chart.error.description });
    }

    res.json(response.data);
  } catch (error) {
    console.error('Yahoo API fetch error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.chart?.error?.description || error.message || 'Failed to fetch data from Yahoo Finance API.'
    });
  }
});

// API endpoint to fetch live prices for multiple symbols in parallel
app.get('/api/live-prices', async (req, res) => {
  const { symbols } = req.query;
  if (!symbols) {
    return res.status(400).json({ error: 'Missing required parameter: symbols' });
  }

  const symbolList = symbols.split(',');

  try {
    const results = await Promise.all(symbolList.map(async (sym) => {
      try {
        const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${sym}?range=1d&interval=1m`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });

        if (response.data.chart && response.data.chart.error) {
          return { symbol: sym, success: false, error: response.data.chart.error.description };
        }

        const result = response.data.chart.result?.[0];
        if (!result) {
          return { symbol: sym, success: false, error: 'No chart data' };
        }

        const meta = result.meta;
        const closes = result.indicators?.quote?.[0]?.close || [];
        const volumes = result.indicators?.quote?.[0]?.volume || [];
        
        let latestClose = closes.filter(v => v !== null && v !== undefined).pop();
        if (latestClose === undefined || latestClose === null) {
          latestClose = meta.regularMarketPrice;
        }
        
        const latestVolume = volumes.filter(v => v !== null && v !== undefined).pop();
        
        if (latestClose === undefined || latestClose === null || isNaN(latestClose)) {
          return { symbol: sym, success: false, error: 'No price data found' };
        }

        // Calculate daily change percentage based on previous close
        const openPrice = meta.previousClose || meta.chartPreviousClose || (closes.filter(Boolean)[0] || latestClose);
        const changePercent = openPrice ? parseFloat((((latestClose - openPrice) / openPrice) * 100).toFixed(2)) : 0;

        return {
          symbol: sym,
          success: true,
          price: latestClose,
          change: changePercent,
          volume: latestVolume || 0,
          shortName: meta.shortName || meta.longName || sym
        };
      } catch (err) {
        return { symbol: sym, success: false, error: err.message };
      }
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend proxy server running on http://localhost:${PORT}`);
});

