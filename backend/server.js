import express from 'express';
import cors from 'cors';
import axios from 'axios';
import Parser from 'rss-parser';

const app = express();
const PORT = process.env.PORT || 5001;

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
});

let newsCache = {
  data: null,
  timestamp: 0
};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

app.use(cors());
app.use(express.json());

// Helper utilities for news processing
function timeAgo(dateInput) {
  try {
    const now = new Date();
    const past = new Date(dateInput);
    const elapsed = now - past;
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;

    if (isNaN(past.getTime())) return 'Gần đây';

    if (elapsed < msPerMinute) {
      return 'Vừa xong';
    } else if (elapsed < msPerHour) {
      return Math.max(1, Math.round(elapsed / msPerMinute)) + ' phút trước';
    } else if (elapsed < msPerDay) {
      return Math.max(1, Math.round(elapsed / msPerHour)) + ' giờ trước';
    } else {
      return Math.max(1, Math.round(elapsed / msPerDay)) + ' ngày trước';
    }
  } catch (e) {
    return 'Gần đây';
  }
}

function stripHtmlAndExtractImg(html) {
  let imageUrl = '';
  let summary = '';
  if (html) {
    const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      imageUrl = imgMatch[1];
    }
    summary = html.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, ' ').trim();
    if (summary.length > 200) {
      summary = summary.substring(0, 200) + '...';
    }
  }
  return { imageUrl, summary };
}

function filterNews(newsList, category) {
  if (!category || category === 'Tất cả') {
    return newsList;
  }
  return newsList.filter(item => item.category === category);
}

// API proxy endpoint to fetch Yahoo Finance historical chart data
app.get('/api/chart', async (req, res) => {
  const { symbol, period1, period2, range, interval, events } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing required parameter: symbol' });
  }

  const queryInterval = interval || '1d';
  const eventsParam = events ? `&events=${events}` : '';
  let url;

  if (range) {
    url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${queryInterval}${eventsParam}`;
  } else {
    if (!period1 || !period2) {
      return res.status(400).json({ error: 'Missing required parameters: period1 and period2 (or range)' });
    }
    url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=${queryInterval}${eventsParam}`;
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
        
        let dailyVolume = meta.regularMarketVolume;
        if (dailyVolume === undefined || dailyVolume === null) {
          const nonNullVolumes = volumes.filter(v => v !== null && v !== undefined);
          dailyVolume = nonNullVolumes.reduce((sum, v) => sum + v, 0) || nonNullVolumes.pop() || 0;
        }
        
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
          volume: dailyVolume,
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

// API endpoint to aggregate financial news from multiple feeds and Yahoo Finance
app.get('/api/news', async (req, res) => {
  const { category } = req.query; // 'Tất cả' | 'Trong nước' | 'Quốc tế' | 'Crypto'
  
  const now = Date.now();
  if (newsCache.data && (now - newsCache.timestamp < CACHE_DURATION)) {
    return res.json(filterNews(newsCache.data, category));
  }

  // Fetch all news sources in parallel
  const fetchPromises = [
    // 1. CafeF RSS (Trong nước)
    (async () => {
      try {
        const feed = await parser.parseURL('https://cafef.vn/thi-truong-chung-khoan.rss');
        return feed.items.map(item => {
          const { imageUrl, summary } = stripHtmlAndExtractImg(item.content || item.description);
          return {
            id: item.guid || item.link,
            title: item.title,
            summary: summary || item.title,
            source: 'CafeF',
            url: item.link,
            time: timeAgo(item.pubDate),
            timestamp: new Date(item.pubDate).getTime(),
            category: 'Trong nước',
            sentiment: 'neutral',
            imageUrl
          };
        });
      } catch (err) {
        console.error('Error fetching CafeF RSS:', err.message);
        return [];
      }
    })(),

    // 2. VnExpress RSS (Trong nước)
    (async () => {
      try {
        const feed = await parser.parseURL('https://vnexpress.net/rss/kinh-doanh.rss');
        return feed.items.map(item => {
          const { imageUrl, summary } = stripHtmlAndExtractImg(item.content || item.description);
          return {
            id: item.guid || item.link,
            title: item.title,
            summary: summary || item.title,
            source: 'VnExpress',
            url: item.link,
            time: timeAgo(item.pubDate),
            timestamp: new Date(item.pubDate).getTime(),
            category: 'Trong nước',
            sentiment: 'neutral',
            imageUrl
          };
        });
      } catch (err) {
        console.error('Error fetching VnExpress RSS:', err.message);
        return [];
      }
    })(),

    // 3. Vietstock RSS (Trong nước)
    (async () => {
      try {
        const feed = await parser.parseURL('https://vietstock.vn/rss/chung-khoan.rss');
        return feed.items.map(item => {
          const { imageUrl, summary } = stripHtmlAndExtractImg(item.content || item.description);
          return {
            id: item.guid || item.link,
            title: item.title,
            summary: summary || item.title,
            source: 'Vietstock',
            url: item.link,
            time: timeAgo(item.pubDate),
            timestamp: new Date(item.pubDate).getTime(),
            category: 'Trong nước',
            sentiment: 'neutral',
            imageUrl
          };
        });
      } catch (err) {
        console.error('Error fetching Vietstock RSS:', err.message);
        return [];
      }
    })(),

    // 4. Yahoo Finance News - Crypto
    (async () => {
      try {
        const response = await axios.get('https://query1.finance.yahoo.com/v1/finance/search?q=BTC-USD,ETH-USD,SOL-USD', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        const news = response.data?.news || [];
        return news.map(item => {
          const pubDate = new Date(item.providerPublishTime * 1000);
          return {
            id: item.uuid,
            title: item.title,
            summary: item.summary || item.title,
            source: item.publisher || 'Yahoo Finance',
            url: item.link,
            time: timeAgo(pubDate),
            timestamp: pubDate.getTime(),
            category: 'Crypto',
            sentiment: 'neutral',
            imageUrl: item.thumbnail?.resolutions?.[0]?.url || ''
          };
        });
      } catch (err) {
        console.error('Error fetching Yahoo Crypto news:', err.message);
        return [];
      }
    })(),

    // 5. Yahoo Finance News - CK Quốc tế
    (async () => {
      try {
        const response = await axios.get('https://query1.finance.yahoo.com/v1/finance/search?q=AAPL,TSLA,MSFT,NVDA', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        const news = response.data?.news || [];
        return news.map(item => {
          const pubDate = new Date(item.providerPublishTime * 1000);
          return {
            id: item.uuid,
            title: item.title,
            summary: item.summary || item.title,
            source: item.publisher || 'Yahoo Finance',
            url: item.link,
            time: timeAgo(pubDate),
            timestamp: pubDate.getTime(),
            category: 'Quốc tế',
            sentiment: 'neutral',
            imageUrl: item.thumbnail?.resolutions?.[0]?.url || ''
          };
        });
      } catch (err) {
        console.error('Error fetching Yahoo International news:', err.message);
        return [];
      }
    })()
  ];

  try {
    const results = await Promise.all(fetchPromises);
    // Flatten and sort by timestamp descending
    let allNews = results.flat().sort((a, b) => b.timestamp - a.timestamp);
    
    // De-duplicate by URL or Title
    const seen = new Set();
    allNews = allNews.filter(item => {
      const key = item.url || item.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    newsCache.data = allNews;
    newsCache.timestamp = now;

    res.json(filterNews(allNews, category));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend proxy server running on http://localhost:${PORT}`);
});

