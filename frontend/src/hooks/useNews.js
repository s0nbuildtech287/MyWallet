import { useState, useEffect, useCallback } from 'react';

export default function useNews(category = 'Tất cả') {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/news?category=${encodeURIComponent(category)}`
      );
      if (!response.ok) {
        throw new Error('Không thể tải tin tức từ server.');
      }
      const data = await response.json();
      setNews(data);
    } catch (err) {
      console.error('Lỗi khi fetch news:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchNews();

    // Auto refresh news every 5 minutes
    const intervalId = setInterval(fetchNews, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [fetchNews]);

  return { news, loading, error, refetch: fetchNews };
}
