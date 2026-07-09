// Macro Indices Presets
export const MACRO_INDICES = [
  { name: 'VN-Index', symbol: '^VNINDEX', price: 1245.8, change: 0.45, isVnd: false },
  { name: 'Bitcoin', symbol: 'BTC-USD', price: 92350, change: 2.4, isVnd: false },
  { name: 'Vàng Thế Giới', symbol: 'GC=F', price: 2345.5, change: -0.85, isVnd: false },
  { name: 'S&P 500', symbol: '^GSPC', price: 5120.4, change: 1.15, isVnd: false }
];

// Market Assets Data (50 Popular assets)
export const MARKET_ASSETS = [
  // Crypto (15)
  { name: 'Bitcoin', symbol: 'BTC-USD', price: 92350, change: 2.4, category: 'Crypto', isVnd: false, volume: '$28.4B', details: { pe: 'N/A', high52: '$98,500', low52: '$38,200', volume: '$28.4B' } },
  { name: 'Ethereum', symbol: 'ETH-USD', price: 3450, change: 1.6, category: 'Crypto', isVnd: false, volume: '$12.5B', details: { pe: 'N/A', high52: '$4,090', low52: '$1,850', volume: '$12.5B' } },
  { name: 'Solana', symbol: 'SOL-USD', price: 145.2, change: 4.8, category: 'Crypto', isVnd: false, volume: '$3.8B', details: { pe: 'N/A', high52: '$210', low52: '$18.5', volume: '$3.8B' } },
  { name: 'Cardano', symbol: 'ADA-USD', price: 0.58, change: -1.2, category: 'Crypto', isVnd: false, volume: '$450M', details: { pe: 'N/A', high52: '$0.82', low52: '$0.24', volume: '$450M' } },
  { name: 'BNB', symbol: 'BNB-USD', price: 580.0, change: 0.8, category: 'Crypto', isVnd: false, volume: '$1.2B', details: { pe: 'N/A', high52: '$645.0', low52: '$220.0', volume: '$1.2B' } },
  { name: 'Ripple', symbol: 'XRP-USD', price: 1.15, change: 3.5, category: 'Crypto', isVnd: false, volume: '$980M', details: { pe: 'N/A', high52: '$1.45', low52: '$0.40', volume: '$980M' } },
  { name: 'Polkadot', symbol: 'DOT-USD', price: 6.2, change: -0.4, category: 'Crypto', isVnd: false, volume: '$180M', details: { pe: 'N/A', high52: '$9.50', low52: '$3.55', volume: '$180M' } },
  { name: 'Dogecoin', symbol: 'DOGE-USD', price: 0.38, change: 5.2, category: 'Crypto', isVnd: false, volume: '$1.5B', details: { pe: 'N/A', high52: '$0.44', low52: '$0.07', volume: '$1.5B' } },
  { name: 'Avalanche', symbol: 'AVAX-USD', price: 28.5, change: 1.1, category: 'Crypto', isVnd: false, volume: '$240M', details: { pe: 'N/A', high52: '$65.0', low52: '$9.00', volume: '$240M' } },
  { name: 'Chainlink', symbol: 'LINK-USD', price: 18.2, change: -2.1, category: 'Crypto', isVnd: false, volume: '$320M', details: { pe: 'N/A', high52: '$22.8', low52: '$6.50', volume: '$320M' } },
  { name: 'Near Protocol', symbol: 'NEAR-USD', price: 4.8, change: 2.7, category: 'Crypto', isVnd: false, volume: '$150M', details: { pe: 'N/A', high52: '$9.00', low52: '$1.05', volume: '$150M' } },
  { name: 'TRON', symbol: 'TRX-USD', price: 0.18, change: 0.2, category: 'Crypto', isVnd: false, volume: '$210M', details: { pe: 'N/A', high52: '$0.20', low52: '$0.08', volume: '$210M' } },
  { name: 'Litecoin', symbol: 'LTC-USD', price: 85.4, change: -1.5, category: 'Crypto', isVnd: false, volume: '$280M', details: { pe: 'N/A', high52: '$112.0', low52: '$56.0', volume: '$280M' } },
  { name: 'Uniswap', symbol: 'UNI-USD', price: 7.6, change: -0.8, category: 'Crypto', isVnd: false, volume: '$110M', details: { pe: 'N/A', high52: '$17.0', low52: '$3.80', volume: '$110M' } },
  { name: 'Toncoin', symbol: 'TON-USD', price: 5.4, change: 1.9, category: 'Crypto', isVnd: false, volume: '$190M', details: { pe: 'N/A', high52: '$8.25', low52: '$1.95', volume: '$190M' } },

  // Chứng khoán VN (20)
  { name: 'FPT Corp', symbol: 'FPT.VN', price: 142500, change: 1.8, category: 'Chứng khoán VN', isVnd: true, volume: '180B VNĐ', details: { pe: '22.4', high52: '154.000 VNĐ', low52: '72.000 VNĐ', volume: '180B VNĐ' } },
  { name: 'Hòa Phát', symbol: 'HPG.VN', price: 29450, change: -0.6, category: 'Chứng khoán VN', isVnd: true, volume: '340B VNĐ', details: { pe: '14.2', high52: '32.500 VNĐ', low52: '23.000 VNĐ', volume: '340B VNĐ' } },
  { name: 'Vietcombank', symbol: 'VCB.VN', price: 61000, change: 0.2, category: 'Chứng khoán VN', isVnd: true, volume: '95B VNĐ', details: { pe: '16.8', high52: '68.000 VNĐ', low52: '55.000 VNĐ', volume: '95B VNĐ' } },
  { name: 'Vingroup', symbol: 'VIC.VN', price: 42500, change: -1.5, category: 'Chứng khoán VN', isVnd: true, volume: '120B VNĐ', details: { pe: '28.1', high52: '58.000 VNĐ', low52: '39.000 VNĐ', volume: '120B VNĐ' } },
  { name: 'Vinamilk', symbol: 'VNM.VN', price: 68200, change: 0.5, category: 'Chứng khoán VN', isVnd: true, volume: '110B VNĐ', details: { pe: '18.2', high52: '76.000 VNĐ', low52: '63.400 VNĐ', volume: '110B VNĐ' } },
  { name: 'SSI Securities', symbol: 'SSI.VN', price: 34800, change: 2.1, category: 'Chứng khoán VN', isVnd: true, volume: '290B VNĐ', details: { pe: '21.5', high52: '38.200 VNĐ', low52: '24.500 VNĐ', volume: '290B VNĐ' } },
  { name: 'PV Gas', symbol: 'GAS.VN', price: 78500, change: -0.3, category: 'Chứng khoán VN', isVnd: true, volume: '45B VNĐ', details: { pe: '15.6', high52: '92.000 VNĐ', low52: '70.500 VNĐ', volume: '45B VNĐ' } },
  { name: 'Techcombank', symbol: 'TCB.VN', price: 23450, change: 1.2, category: 'Chứng khoán VN', isVnd: true, volume: '160B VNĐ', details: { pe: '9.2', high52: '28.400 VNĐ', low52: '16.200 VNĐ', volume: '160B VNĐ' } },
  { name: 'MBBank', symbol: 'MBB.VN', price: 21850, change: 0.8, category: 'Chứng khoán VN', isVnd: true, volume: '145B VNĐ', details: { pe: '8.4', high52: '25.000 VNĐ', low52: '14.800 VNĐ', volume: '145B VNĐ' } },
  { name: 'ACB Bank', symbol: 'ACB.VN', price: 24200, change: 0.5, category: 'Chứng khoán VN', isVnd: true, volume: '88B VNĐ', details: { pe: '8.9', high52: '28.200 VNĐ', low52: '18.000 VNĐ', volume: '88B VNĐ' } },
  { name: 'Thế Giới Di Động', symbol: 'MWG.VN', price: 58600, change: -1.1, category: 'Chứng khoán VN', isVnd: true, volume: '210B VNĐ', details: { pe: '26.4', high52: '65.200 VNĐ', low52: '34.500 VNĐ', volume: '210B VNĐ' } },
  { name: 'Hóa chất Đức Giang', symbol: 'DGC.VN', price: 112000, change: 3.4, category: 'Chứng khoán VN', isVnd: true, volume: '115B VNĐ', details: { pe: '14.8', high52: '132.000 VNĐ', low52: '82.000 VNĐ', volume: '115B VNĐ' } },
  { name: 'Masan Group', symbol: 'MSN.VN', price: 74200, change: -0.8, category: 'Chứng khoán VN', isVnd: true, volume: '75B VNĐ', details: { pe: '38.5', high52: '86.000 VNĐ', low52: '58.400 VNĐ', volume: '75B VNĐ' } },
  { name: 'Vincom Retail', symbol: 'VRE.VN', price: 21500, change: -2.0, category: 'Chứng khoán VN', isVnd: true, volume: '58B VNĐ', details: { pe: '11.2', high52: '28.500 VNĐ', low52: '19.500 VNĐ', volume: '58B VNĐ' } },
  { name: 'HDBank', symbol: 'HDB.VN', price: 26400, change: 1.5, category: 'Chứng khoán VN', isVnd: true, volume: '62B VNĐ', details: { pe: '8.1', high52: '29.200 VNĐ', low52: '16.500 VNĐ', volume: '62B VNĐ' } },
  { name: 'Sacombank', symbol: 'STB.VN', price: 31200, change: 0.7, category: 'Chứng khoán VN', isVnd: true, volume: '190B VNĐ', details: { pe: '10.5', high52: '34.800 VNĐ', low52: '25.000 VNĐ', volume: '190B VNĐ' } },
  { name: 'VPBank', symbol: 'VPB.VN', price: 18900, change: -0.5, category: 'Chứng khoán VN', isVnd: true, volume: '230B VNĐ', details: { pe: '11.8', high52: '22.800 VNĐ', low52: '16.400 VNĐ', volume: '230B VNĐ' } },
  { name: 'Gemadept', symbol: 'GMD.VN', price: 78600, change: 1.4, category: 'Chứng khoán VN', isVnd: true, volume: '42B VNĐ', details: { pe: '15.2', high52: '88.500 VNĐ', low52: '55.000 VNĐ', volume: '42B VNĐ' } },
  { name: 'Vàng bạc PNJ', symbol: 'PNJ.VN', price: 95400, change: 0.2, category: 'Chứng khoán VN', isVnd: true, volume: '38B VNĐ', details: { pe: '16.1', high52: '108.000 VNĐ', low52: '74.200 VNĐ', volume: '38B VNĐ' } },
  { name: 'Cơ điện lạnh REE', symbol: 'REE.VN', price: 62400, change: -0.4, category: 'Chứng khoán VN', isVnd: true, volume: '28B VNĐ', details: { pe: '12.8', high52: '69.500 VNĐ', low52: '52.000 VNĐ', volume: '28B VNĐ' } },

  // Chứng khoán Mỹ (10)
  { name: 'Apple Inc.', symbol: 'AAPL', price: 182.4, change: 1.5, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$8.2B', details: { pe: '28.4', high52: '$199.6', low52: '$164.1', volume: '$8.2B' } },
  { name: 'Tesla Inc.', symbol: 'TSLA', price: 178.6, change: -3.4, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$12.4B', details: { pe: '42.1', high52: '$265.1', low52: '$138.8', volume: '$12.4B' } },
  { name: 'Nvidia Corp', symbol: 'NVDA', price: 875.2, change: 6.2, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$24.6B', details: { pe: '74.6', high52: '$974.0', low52: '$420.5', volume: '$24.6B' } },
  { name: 'Microsoft', symbol: 'MSFT', price: 420.8, change: 0.8, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$6.5B', details: { pe: '35.8', high52: '$430.8', low52: '$315.2', volume: '$6.5B' } },
  { name: 'Amazon.com', symbol: 'AMZN', price: 175.4, change: 1.1, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$5.4B', details: { pe: '40.2', high52: '$189.7', low52: '$118.3', volume: '$5.4B' } },
  { name: 'Google (Alphabet)', symbol: 'GOOG', price: 152.6, change: -0.4, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$4.1B', details: { pe: '25.6', high52: '$160.2', low52: '$115.6', volume: '$4.1B' } },
  { name: 'Meta Platforms', symbol: 'META', price: 485.4, change: 2.1, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$4.8B', details: { pe: '32.1', high52: '$531.4', low52: '$230.2', volume: '$4.8B' } },
  { name: 'Netflix Inc', symbol: 'NFLX', price: 610.2, change: -1.2, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$2.1B', details: { pe: '45.2', high52: '$639.0', low52: '$315.6', volume: '$2.1B' } },
  { name: 'AMD Devices', symbol: 'AMD', price: 168.5, change: 3.6, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$3.5B', details: { pe: '65.4', high52: '$227.3', low52: '$93.1', volume: '$3.5B' } },
  { name: 'Intel Corp', symbol: 'INTC', price: 34.2, change: -0.9, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$1.4B', details: { pe: '18.4', high52: '$51.2', low52: '$26.8', volume: '$1.4B' } },

  // Hàng hóa & Tỷ giá (9)
  { name: 'Vàng Thế Giới', symbol: 'GC=F', price: 2345.5, change: -0.85, category: 'Hàng hóa & Tỷ giá', isVnd: false, volume: '$1.8B', details: { pe: 'N/A', high52: '$2,450.0', low52: '$1,810.0', volume: '$1.8B' } },
  { name: 'Bạc Thế Giới', symbol: 'SI=F', price: 29.5, change: 0.45, category: 'Hàng hóa & Tỷ giá', isVnd: false, volume: '$450M', details: { pe: 'N/A', high52: '$32.50', low52: '$21.20', volume: '$450M' } },
  { name: 'Dầu Thô WTI', symbol: 'CL=F', price: 78.4, change: 1.2, category: 'Hàng hóa & Tỷ giá', isVnd: false, volume: '$1.1B', details: { pe: 'N/A', high52: '$95.0', low52: '$67.2', volume: '$1.1B' } },
  { name: 'Dầu Thô Brent', symbol: 'BZ=F', price: 82.5, change: 0.85, category: 'Hàng hóa & Tỷ giá', isVnd: false, volume: '$980M', details: { pe: 'N/A', high52: '$98.5', low52: '$72.1', volume: '$980M' } },
  { name: 'Khí Gas Tự Nhiên', symbol: 'NG=F', price: 2.15, change: -1.5, category: 'Hàng hóa & Tỷ giá', isVnd: false, volume: '$350M', details: { pe: 'N/A', high52: '$3.50', low52: '$1.55', volume: '$350M' } },
  { name: 'Tỷ giá USD/VND', symbol: 'USDVND=X', price: 25450, change: 0.05, category: 'Hàng hóa & Tỷ giá', isVnd: true, volume: '95B VNĐ', details: { pe: 'N/A', high52: '25.600 VNĐ', low52: '24.200 VNĐ', volume: '95B VNĐ' } },
  { name: 'Tỷ giá EUR/USD', symbol: 'EURUSD=X', price: 1.08, change: -0.15, category: 'Hàng hóa & Tỷ giá', isVnd: false, volume: '$12.4B', details: { pe: 'N/A', high52: '$1.12', low52: '$1.05', volume: '$12.4B' } },
  { name: 'Tỷ giá GBP/USD', symbol: 'GBPUSD=X', price: 1.27, change: 0.22, category: 'Hàng hóa & Tỷ giá', isVnd: false, volume: '$8.5B', details: { pe: 'N/A', high52: '$1.31', low52: '$1.22', volume: '$8.5B' } },
  { name: 'Tỷ giá USD/JPY', symbol: 'USDJPY=X', price: 156.4, change: 0.35, category: 'Hàng hóa & Tỷ giá', isVnd: false, volume: '$14.2B', details: { pe: 'N/A', high52: '$160.5', low52: '$140.2', volume: '$14.2B' } },

  // ETF & Quỹ (4)
  { name: 'Quỹ ETF Diamond VN', symbol: 'FUEVFVND.HM', price: 32000, change: 1.15, category: 'ETF & Quỹ', isVnd: true, volume: '45B VNĐ', details: { pe: 'N/A', high52: '34.500 VNĐ', low52: '23.000 VNĐ', volume: '45B VNĐ' } },
  { name: 'Quỹ ETF VN30 VN', symbol: 'E1VFVN30.HM', price: 21000, change: 0.85, category: 'ETF & Quỹ', isVnd: true, volume: '28B VNĐ', details: { pe: 'N/A', high52: '23.400 VNĐ', low52: '16.500 VNĐ', volume: '28B VNĐ' } },
  { name: 'Quỹ ETF S&P 500 (SPY)', symbol: 'SPY', price: 512.4, change: 0.75, category: 'ETF & Quỹ', isVnd: false, volume: '$35.2B', details: { pe: 'N/A', high52: '$525.0', low52: '$410.0', volume: '$35.2B' } },
  { name: 'Quỹ ETF Nasdaq (QQQ)', symbol: 'QQQ', price: 435.5, change: 1.35, category: 'ETF & Quỹ', isVnd: false, volume: '$21.8B', details: { pe: 'N/A', high52: '$448.0', low52: '$345.0', volume: '$21.8B' } },

  // Khác (4)
  { name: 'Chỉ số VN-Index', symbol: '^VNINDEX', price: 1245.8, change: 0.45, category: 'Khác', isVnd: false, volume: '19.4T VNĐ', details: { pe: 'N/A', high52: '1,295.0', low52: '1,020.0', volume: '19.4T VNĐ' } },
  { name: 'Chỉ số S&P 500', symbol: '^GSPC', price: 5120.4, change: 1.15, category: 'Khác', isVnd: false, volume: '$42.5B', details: { pe: 'N/A', high52: '$5,250.0', low52: '$4,100.0', volume: '$42.5B' } },
  { name: 'Dow Jones 30', symbol: '^DJI', price: 39120.4, change: 0.35, category: 'Khác', isVnd: false, volume: '$3.8B', details: { pe: 'N/A', high52: '$39,889.0', low52: '$32,715.0', volume: '$3.8B' } },
  { name: 'Chỉ số Nikkei 225', symbol: '^N225', price: 38550.0, change: -0.65, category: 'Khác', isVnd: false, volume: '$5.8B', details: { pe: 'N/A', high52: '$41,000.0', low52: '$30,500.0', volume: '$5.8B' } }
];

// Presets for Simulator
export const PRESET_SYMBOLS = [
  { label: 'Bitcoin (BTC)', value: 'BTC-USD', isVnd: false },
  { label: 'Vàng Thế Giới', value: 'GC=F', isVnd: false },
  { label: 'FPT (HoSE)', value: 'FPT.VN', isVnd: true },
  { label: 'Hòa Phát (HPG)', value: 'HPG.VN', isVnd: true },
  { label: 'VinGroup (VIC)', value: 'VIC.VN', isVnd: true },
  { label: 'Vietcombank (VCB)', value: 'VCB.VN', isVnd: true },
  { label: 'Apple (AAPL)', value: 'AAPL', isVnd: false },
  { label: 'Tesla (TSLA)', value: 'TSLA', isVnd: false }
];

// Financial news
export const FINANCIAL_NEWS = [
  { id: 1, title: 'Thị trường chứng khoán Việt Nam: VN-Index bứt phá chinh phục mốc cản tâm lý mới nhờ dòng vốn FDI ổn định', source: 'Vietstock', time: '20 phút trước', summary: 'Dòng tiền khối ngoại quay trở lại mua ròng mạnh mẽ các cổ phiếu trụ cột như FPT, VCB, và HPG, kéo VN-Index duy trì sắc xanh tích cực trong bối cảnh vĩ mô trong nước tiếp tục hồi phục.', category: 'Trong nước', sentiment: 'bullish' },
  { id: 2, title: 'GDP Việt Nam tăng trưởng vượt dự báo nhờ lực kéo từ hoạt động xuất khẩu và thu hút đầu tư nước ngoài mạnh mẽ', source: 'CafeF', time: '2 giờ trước', summary: 'Báo cáo mới nhất từ Tổng cục Thống kê cho thấy chỉ số công nghiệp và dịch vụ phục hồi rõ rệt. Lãi suất huy động tại các ngân hàng thương mại duy trì ở mức thấp hỗ trợ doanh nghiệp tối đa.', category: 'Trong nước', sentiment: 'bullish' },
  { id: 3, title: 'Ngân hàng Nhà nước giữ nguyên mức lãi suất điều hành, linh hoạt ổn định tỷ giá USD/VND trong biên độ cho phép', source: 'Kinh tế & Đầu tư', time: '5 giờ trước', summary: 'Chính sách tiền tệ ổn định giúp củng cố niềm tin cho thị trường tài sản và bất động sản trong nước, tạo điều kiện thuận lợi cho các chiến lược đầu tư tích sản dài hạn của nhà đầu tư.', category: 'Trong nước', sentiment: 'neutral' },
  { id: 4, title: 'FED phát đi tín hiệu nới lỏng chính sách: Thị trường chứng khoán Mỹ và Crypto đồng loạt lập đỉnh lịch sử mới', source: 'Bloomberg', time: '45 phút trước', summary: 'Ủy ban Thị trường Mở Liên bang (FOMC) hé lộ lộ trình cắt giảm lãi suất cơ bản trong các tháng tới do lạm phát hạ nhiệt nhanh chóng, tạo đà tăng phi mã cho Bitcoin và chỉ số S&P 500.', category: 'Quốc tế', sentiment: 'bullish' },
  { id: 5, title: 'Căng thẳng địa chính trị tiếp tục leo thang, dòng tiền trú ẩn an toàn thúc đẩy giá Vàng thế giới tăng vọt lập kỷ lục', source: 'Reuters', time: '3 giờ trước', summary: 'Giá vàng giao ngay thế giới duy trì vững chắc trên đà tăng. Các chuyên gia quốc tế nhận định vàng tiếp tục là kênh tích lũy phòng thủ thiết yếu nhất trong danh mục đầu tư đa tài sản hiện nay.', category: 'Quốc tế', sentiment: 'neutral' },
  { id: 6, title: 'Làn sóng AI thúc đẩy lợi nhuận kỷ lục của nhóm Big Tech Mỹ: Nvidia, Apple và Microsoft duy trì dẫn dắt thị trường', source: 'Wall Street Journal', time: '6 giờ trước', summary: 'Nhu cầu khổng lồ về chip xử lý và hạ tầng đám mây AI giúp các tập đoàn công nghệ đạt biên lợi nhuận vượt bậc, thu hút dòng vốn đầu tư khổng lồ đổ về sàn chứng khoán New York.', category: 'Quốc tế', sentiment: 'bullish' }
];
