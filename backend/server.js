import express from 'express';
import cors from 'cors';
import axios from 'axios';
import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic env loader looking both in /backend and root folder
function loadEnv() {
  const pathsToTry = [
    path.join(__dirname, '.env'),
    path.join(__dirname, '../.env')
  ];
  for (const envPath of pathsToTry) {
    if (fs.existsSync(envPath)) {
      try {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split(/\r?\n/).forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const index = trimmed.indexOf('=');
            if (index !== -1) {
              const key = trimmed.substring(0, index).trim();
              let val = trimmed.substring(index + 1).trim();
              if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.substring(1, val.length - 1);
              }
              process.env[key] = val;
            }
          }
        });
        console.log(`[Env Loader] Loaded variables from: ${envPath}`);
        return;
      } catch (err) {
        console.error(`[Env Loader] Error reading ${envPath}:`, err.message);
      }
    }
  }
  console.log('[Env Loader] No .env file found in /backend or root folder.');
}
loadEnv();

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
          shortName: meta.shortName || meta.longName || sym,
          marketCap: meta.marketCap || null,
          high52: meta.fiftyTwoWeekHigh || null,
          low52: meta.fiftyTwoWeekLow || null
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

let yahooSession = {
  cookie: null,
  crumb: null,
  timestamp: 0
};
const SESSION_DURATION = 15 * 60 * 1000; // 15 minutes

async function getYahooSession() {
  const now = Date.now();
  if (yahooSession.cookie && yahooSession.crumb && (now - yahooSession.timestamp < SESSION_DURATION)) {
    return yahooSession;
  }

  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  
  // 1. Get initial cookie from fc.yahoo.com
  const fcResponse = await axios.get('https://fc.yahoo.com', {
    headers: { 'User-Agent': userAgent },
    validateStatus: () => true
  });
  
  const setCookie = fcResponse.headers['set-cookie'];
  if (!setCookie || setCookie.length === 0) {
    throw new Error('No cookie returned from fc.yahoo.com');
  }
  
  const cookiesList = setCookie.map(c => c.split(';')[0]);
  const cookiesString = cookiesList.join('; ');

  // 2. Fetch crumb
  const crumbResponse = await axios.get('https://query2.finance.yahoo.com/v1/test/getcrumb', {
    headers: {
      'User-Agent': userAgent,
      'Cookie': cookiesString
    }
  });
  
  const crumb = crumbResponse.data;
  if (!crumb) {
    throw new Error('Failed to retrieve crumb');
  }

  yahooSession = {
    cookie: cookiesString,
    crumb,
    timestamp: now
  };

  return yahooSession;
}

// API endpoint to fetch market cap for multiple symbols via quoteSummary
app.get('/api/market-cap', async (req, res) => {
  const { symbols } = req.query;
  if (!symbols) {
    return res.status(400).json({ error: 'Missing required parameter: symbols' });
  }

  const symbolList = symbols.split(',').filter(Boolean);

  try {
    let session;
    try {
      session = await getYahooSession();
    } catch (sessionErr) {
      console.error('Failed to resolve Yahoo session:', sessionErr.message);
      // Fallback: return null for all
      return res.json(symbolList.map(sym => ({ symbol: sym, success: false, marketCap: null })));
    }

    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    const results = await Promise.all(symbolList.map(async (sym) => {
      try {
        const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${sym.toUpperCase()}?modules=summaryDetail,defaultKeyStatistics&crumb=${session.crumb}`;
        const response = await axios.get(url, {
          headers: {
            'User-Agent': userAgent,
            'Cookie': session.cookie
          }
        });

        const summary = response.data?.quoteSummary?.result?.[0];
        const marketCap = summary?.summaryDetail?.marketCap?.raw
          || summary?.defaultKeyStatistics?.enterpriseValue?.raw
          || null;

        return { symbol: sym, success: true, marketCap };
      } catch (err) {
        console.error(`Failed to fetch market cap for ${sym}:`, err.message);
        if (err.response?.status === 401) {
          // Invalidate cache on unauthorized error so it re-fetches next time
          yahooSession.cookie = null;
          yahooSession.crumb = null;
        }
        return { symbol: sym, success: false, marketCap: null };
      }
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/ai-analyze', async (req, res) => {
  const { symbol, currentPrice, indicators, priceTrend } = req.body;
  
  const openaiKey = process.env.OPENAI_API_KEY || process.env.openaikey;
  if (!openaiKey) {
    return res.status(500).json({ error: 'OpenAI API Key (hoặc openaikey) is missing in backend .env file.' });
  }

  const systemPrompt = `Bạn là một chuyên gia phân tích tài chính cấp cao của hệ thống MyWallet Hub. 
Nhiệm vụ của bạn là phân tích dữ liệu kỹ thuật thời gian thực của tài sản và đưa ra khuyến nghị kép:

1. CHIẾN LƯỢC TÍCH SẢN DÀI HẠN (DCA):
   - Đánh giá giá hiện tại so với xu hướng lịch sử (đắt hay rẻ).
   - Đưa ra lời khuyên về việc phân bổ tỷ trọng vốn hàng tháng (tăng lượng mua tích lũy hay tạm dừng chờ giá tối ưu).

2. CHIẾN LƯỢC GIAO GỊCH NGẮN HẠN (CFD/FUTURES/LEVERAGE):
   - Xác định hướng đánh khả thi nhất: LONG (Mua) hay SHORT (Bán) hay Đứng ngoài quan sát.
   - Gợi ý vùng điểm vào lệnh (Entry), điểm dừng lỗ (Stop Loss - SL) và điểm chốt lời (Take Profit - TP) cụ thể dựa trên các chỉ báo như dải Bollinger và hỗ trợ/kháng cự kỹ thuật.
   - Khuyến nghị tỷ lệ đòn bẩy (Leverage) an toàn tương ứng với độ biến động hiện tại của tài sản đó (ví dụ: x2, x5, x10).

Hãy phân tích dựa trên dữ liệu đầu vào thật được cung cấp. Trả lời ngắn gọn, tập trung, sử dụng ngôn từ chuyên nghiệp của giới trading tài chính. Định dạng câu trả lời rõ ràng có bullet points nhưng TUYỆT ĐỐI KHÔNG sử dụng ký tự dấu sao kép (** hoặc *) trong toàn bộ văn bản. Khi muốn nhấn mạnh từ khóa, hãy viết IN HOA từ đó.`;

  const userPrompt = `Hãy phân tích tài sản: ${symbol}
- Giá hiện tại: ${currentPrice}
- Xu hướng 15 nến gần nhất: ${priceTrend ? priceTrend.join(', ') : 'N/A'}
- RSI (14): ${indicators?.rsi ? Number(indicators.rsi).toFixed(2) : 'N/A'}
- MACD: MACD Line = ${indicators?.macd?.macdLine ? Number(indicators.macd.macdLine).toFixed(2) : 'N/A'}, Signal Line = ${indicators?.macd?.signalLine ? Number(indicators.macd.signalLine).toFixed(2) : 'N/A'}
- Bollinger Bands: Upper = ${indicators?.bollinger?.upper ? indicators.bollinger.upper : 'N/A'}, Middle = ${indicators?.bollinger?.middle ? indicators.bollinger.middle : 'N/A'}, Lower = ${indicators?.bollinger?.lower ? indicators.bollinger.lower : 'N/A'}
- MA xu hướng: MA20 = ${indicators?.ma20 ? indicators.ma20 : 'N/A'}, MA50 = ${indicators?.ma50 ? indicators.ma50 : 'N/A'}`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        }
      }
    );

    const advice = response.data?.choices?.[0]?.message?.content || 'Không thể tạo phân tích.';
    const cleanAdvice = advice.replace(/\*/g, '');
    res.json({ success: true, advice: cleanAdvice });
  } catch (error) {
    console.error('OpenAI API request failed:', error.message);
    res.status(500).json({ error: error.response?.data?.error?.message || error.message });
  }
});


app.post('/api/ai-chat', async (req, res) => {
  const { messages, symbol, currentPrice } = req.body;
  
  const openaiKey = process.env.OPENAI_API_KEY || process.env.openaikey;
  if (!openaiKey) {
    return res.status(500).json({ error: 'OpenAI API Key (hoặc openaikey) is missing in backend .env file.' });
  }

  const systemPrompt = `Bạn là một trợ lý AI tài chính chuyên sâu thuộc hệ thống MyWallet Hub. 
Người dùng đang xem tài sản ${symbol || 'tài sản bất kỳ'} với giá hiện tại là ${currentPrice || 'chưa rõ'}.
Hãy trả lời các câu hỏi của người dùng về tài sản này, thị trường tài chính, phân tích kỹ thuật hoặc chiến lược đầu tư (Tích sản & Trading CFD/Futures).
Hãy trả lời ngắn gọn, trực diện, chuyên nghiệp bằng Tiếng Việt. Định dạng câu trả lời rõ ràng có bullet points nhưng TUYỆT ĐỐI KHÔNG sử dụng ký tự dấu sao kép (** hoặc *) trong toàn bộ văn bản. Khi muốn nhấn mạnh từ khóa, hãy viết IN HOA từ đó.`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        }
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content || '';
    const cleanReply = reply.replace(/\*/g, '');
    res.json({ success: true, reply: cleanReply });
  } catch (error) {
    console.error('OpenAI Chat API request failed:', error.message);
    res.status(500).json({ error: error.response?.data?.error?.message || error.message });
  }
});


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

