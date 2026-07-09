// Macro Indices Presets
export const MACRO_INDICES = [
  { name: 'VN-Index', symbol: '^VNINDEX', price: 1245.8, change: 0.45, isVnd: false },
  { name: 'Bitcoin', symbol: 'BTC-USD', price: 92350, change: 2.4, isVnd: false },
  { name: 'Vàng Thế Giới', symbol: 'GC=F', price: 2345.5, change: -0.85, isVnd: false },
  { name: 'S&P 500', symbol: '^GSPC', price: 5120.4, change: 1.15, isVnd: false }
];

// Market Assets Data
export const MARKET_ASSETS = [
  { name: 'Bitcoin', symbol: 'BTC-USD', price: 92350, change: 2.4, category: 'Crypto', isVnd: false, volume: '$28.4B', details: { pe: 'N/A', high52: '$98,500', low52: '$38,200', volume: '$28.4B' } },
  { name: 'Ethereum', symbol: 'ETH-USD', price: 3450, change: 1.6, category: 'Crypto', isVnd: false, volume: '$12.5B', details: { pe: 'N/A', high52: '$4,090', low52: '$1,850', volume: '$12.5B' } },
  { name: 'Solana', symbol: 'SOL-USD', price: 145.2, change: 4.8, category: 'Crypto', isVnd: false, volume: '$3.8B', details: { pe: 'N/A', high52: '$210', low52: '$18.5', volume: '$3.8B' } },
  { name: 'Cardano', symbol: 'ADA-USD', price: 0.58, change: -1.2, category: 'Crypto', isVnd: false, volume: '$450M', details: { pe: 'N/A', high52: '$0.82', low52: '$0.24', volume: '$450M' } },
  
  { name: 'FPT Corp', symbol: 'FPT.VN', price: 142500, change: 1.8, category: 'Chứng khoán VN', isVnd: true, volume: '180B VNĐ', details: { pe: '22.4', high52: '154.000 VNĐ', low52: '72.000 VNĐ', volume: '180B VNĐ' } },
  { name: 'Hòa Phát', symbol: 'HPG.VN', price: 29450, change: -0.6, category: 'Chứng khoán VN', isVnd: true, volume: '340B VNĐ', details: { pe: '14.2', high52: '32.500 VNĐ', low52: '23.000 VNĐ', volume: '340B VNĐ' } },
  { name: 'Vietcombank', symbol: 'VCB.VN', price: 91400, change: 0.2, category: 'Chứng khoán VN', isVnd: true, volume: '95B VNĐ', details: { pe: '16.8', high52: '98.000 VNĐ', low52: '78.500 VNĐ', volume: '95B VNĐ' } },
  { name: 'Vingroup', symbol: 'VIC.VN', price: 42500, change: -1.5, category: 'Chứng khoán VN', isVnd: true, volume: '120B VNĐ', details: { pe: '28.1', high52: '58.000 VNĐ', low52: '39.000 VNĐ', volume: '120B VNĐ' } },
  { name: 'Vinamilk', symbol: 'VNM.VN', price: 68200, change: 0.5, category: 'Chứng khoán VN', isVnd: true, volume: '110B VNĐ', details: { pe: '18.2', high52: '76.000 VNĐ', low52: '63.400 VNĐ', volume: '110B VNĐ' } },
  { name: 'SSI Securities', symbol: 'SSI.VN', price: 34800, change: 2.1, category: 'Chứng khoán VN', isVnd: true, volume: '290B VNĐ', details: { pe: '21.5', high52: '38.200 VNĐ', low52: '24.500 VNĐ', volume: '290B VNĐ' } },
  
  { name: 'Apple Inc.', symbol: 'AAPL', price: 182.4, change: 1.5, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$8.2B', details: { pe: '28.4', high52: '$199.6', low52: '$164.1', volume: '$8.2B' } },
  { name: 'Tesla Inc.', symbol: 'TSLA', price: 178.6, change: -3.4, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$12.4B', details: { pe: '42.1', high52: '$265.1', low52: '$138.8', volume: '$12.4B' } },
  { name: 'Nvidia Corp', symbol: 'NVDA', price: 875.2, change: 6.2, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$24.6B', details: { pe: '74.6', high52: '$974.0', low52: '$420.5', volume: '$24.6B' } },
  { name: 'Microsoft', symbol: 'MSFT', price: 420.8, change: 0.8, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$6.5B', details: { pe: '35.8', high52: '$430.8', low52: '$315.2', volume: '$6.5B' } },
  { name: 'Amazon.com', symbol: 'AMZN', price: 175.4, change: 1.1, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$5.4B', details: { pe: '40.2', high52: '$189.7', low52: '$118.3', volume: '$5.4B' } },
  { name: 'Google (Alphabet)', symbol: 'GOOG', price: 152.6, change: -0.4, category: 'Chứng khoán Mỹ', isVnd: false, volume: '$4.1B', details: { pe: '25.6', high52: '$160.2', low52: '$115.6', volume: '$4.1B' } }
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
