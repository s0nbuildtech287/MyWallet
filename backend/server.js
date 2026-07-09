import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API proxy endpoint to fetch Yahoo Finance historical chart data
app.get('/api/chart', async (req, res) => {
  const { symbol, period1, period2, interval } = req.query;

  if (!symbol || !period1 || !period2) {
    return res.status(400).json({ error: 'Missing required parameters: symbol, period1, period2' });
  }

  const queryInterval = interval || '1d';
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=${queryInterval}`;

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

app.listen(PORT, () => {
  console.log(`🚀 Backend proxy server running on http://localhost:${PORT}`);
});
