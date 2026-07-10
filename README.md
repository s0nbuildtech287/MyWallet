# 🌟 MYWALLET HUB - HỆ THỐNG QUẢN LÝ & MÔ PHỎNG TÍCH SẢN TÀI CHÍNH THÔNG MINH

MyWallet Hub là một nền tảng Web App hiện đại, hỗ trợ nhà đầu tư theo dõi giá thị trường thời gian thực, phân tích kỹ thuật nâng cao, chạy mô phỏng tích sản lịch sử (Backtest) và tương tác với Trợ lý ảo AI chuyên sâu để đưa ra chiến lược đầu tư tối ưu (DCA dài hạn & Trading CFD/Futures ngắn hạn).

---

## 🚀 CÁC TÍNH NĂNG NỔI BẬT

### 1. 📊 Bảng giá thị trường thời gian thực (Live Market Watch)
- Theo dõi liên tục biến động của các loại tài sản phổ biến: Tiền điện tử (BTC, ETH), Hàng hóa (Vàng, Bạc, Dầu thô), Chỉ số chứng khoán thế giới (S&P 500, Nikkei 225, DAX, Hang Seng) và Cổ phiếu Việt Nam.
- Định dạng tiền tệ động (USD & tỷ VNĐ) cùng biểu đồ Sparkline 30 ngày trực quan ngay trên danh sách theo dõi.

### 2. 📈 Biểu đồ kỹ thuật nâng cao (Interactive Charting Engine)
- Hỗ trợ hai chế độ xem: Biểu đồ Đường (Line) truyền thống và Biểu đồ Nến Nhật (Candlestick) vẽ bằng SVG tối ưu hiệu năng.
- Tích hợp bộ chỉ báo kỹ thuật động vẽ đè trực tiếp lên đồ thị: MA20, MA50, BOLLINGER BANDS.
- Biểu đồ phụ độc lập biểu diễn động lượng thị trường: RSI (14) (tô màu vùng quá mua/quá bán) và MACD (MACD line, Signal line, Histogram xanh/đỏ).
- Cửa sổ thông tin giải thích nhanh ý nghĩa các chỉ báo kỹ thuật giúp nhà đầu tư dễ dàng nắm bắt kiến thức.

### 3. 🤖 Trading GPT - Trợ lý đầu tư AI chuyên sâu
- Tính năng được bảo vệ quyền truy cập (yêu cầu Đăng nhập).
- Sử dụng mô hình GPT-4O-MINI để phân tích dữ liệu kỹ thuật thực tế thu thập từ thị trường.
- Cung cấp CHIẾN LƯỢC KÉP:
  - Tích sản dài hạn (DCA): Đánh giá đắt/rẻ của giá hiện tại và khuyến nghị phân bổ vốn.
  - Lướt sóng ngắn hạn (CFD/Futures): Gợi ý điểm vào (Entry), Điểm dừng lỗ (SL), Điểm chốt lời (TP) và Tỷ lệ đòn bẩy tối ưu.
- Hỗ trợ trò chuyện tiếp nối (Follow-up Chat) thời gian thực về tài sản đang chọn.

### 4. 🧠 Trợ lý ảo động (SmartAdvisor Widget)
- Nằm trực tiếp dưới biểu đồ chi tiết tài sản.
- Sử dụng BỘ GHÉP CÂU ĐỘNG (Dynamic Sentence Generator) tự động liên kết các trạng thái kỹ thuật (cắt MA, RSI quá mua/bán, MACD đảo chiều) để đưa ra lời khuyên đầu tư bằng Tiếng Việt tức thì.

### 5. 💰 Công cụ mô phỏng tích sản (Portfolio Simulator)
- Chạy giả định đầu tư DCA lịch sử của tài sản theo chu kỳ tùy chọn (Hàng tuần, Hàng tháng, Hàng quý).
- Tính toán chi tiết lợi nhuận gộp, hiệu ứng tái đầu tư cổ tức và vẽ biểu đồ so sánh tăng trưởng tài sản trực quan.

### 6. 📰 Tin tức tài chính đa kênh
- Tự động tổng hợp tin tức tài chính thời gian thực từ các nguồn uy tín trong nước (CafeF, VnExpress, Vietstock) và quốc tế (Yahoo Finance).
- Phân loại danh mục thông minh và lưu bộ nhớ đệm (Cache) để giảm tải cho server.

---

## 🛡️ GIA CỐ BẢO MẬT HỆ THỐNG (Security Enforcement)

Để bảo vệ API Key OpenAI của bạn khi đưa dự án lên Internet, backend đã được thiết lập hệ thống bảo mật 2 tầng:
1. XÁC THỰC API TOKEN: Tất cả các yêu cầu phân tích và chat với AI đều yêu cầu header x-api-token trùng khớp với mã bí mật được định nghĩa ở .env của backend (tránh bot quét và spam API).
2. CHỐNG PROMPT INJECTION & SPAM:
   - Rút gọn mã tài sản về tối đa 10 ký tự, giá về tối đa 30 ký tự.
   - Giới hạn độ dài mỗi tin nhắn chat của người dùng tối đa 500 ký tự.
   - Chỉ gửi tối đa 10 tin nhắn gần nhất trong lịch sử chat để tiết kiệm token và tránh làm tràn bộ nhớ đệm.

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG

- Frontend: ReactJS, Vite, Chart.js, Tailwind CSS, Lucide Icons.
- Backend: Node.js, Express, Axios (kết nối Yahoo Finance API & OpenAI), RSS Parser (đọc tin tức).
- Trí tuệ nhân tạo: OpenAI API (gpt-4o-mini).

---

## ⚙️ HƯỚNG DẪN CÀI ĐẶT & CHẠY CỤC BỘ (Local)

### 1. Chuẩn bị file môi trường .env
Tạo file .env nằm ở thư mục gốc của dự án (/MyWallet/.env) với nội dung:
```env
openaikey=sk-proj-xxxxxx...  # Nhập API Key OpenAI của bạn tại đây
API_SECRET_TOKEN=mywallet_secure_key_2026_xyz # Mã bảo vệ API (mặc định)
```

### 2. Cài đặt thư viện & Khởi động dự án
Mở Terminal tại thư mục gốc dự án và chạy các lệnh:

```bash
# Cài đặt tất cả dependencies cho cả frontend và backend
npm run install-all

# Khởi động đồng thời cả React App (cổng 5173) và Express Server (cổng 5001)
npm run dev
```

---

## 🌐 HƯỚNG DẪN DEPLOY LÊN VERCEL (Monorepo)

Dự án đã được cấu hình sẵn tệp vercel.json ở thư mục gốc để hỗ trợ triển khai đồng thời cả Frontend và Backend Express trên nền tảng Vercel:

1. Đẩy mã nguồn lên kho lưu trữ GITHUB của bạn.
2. Truy cập Vercel, chọn New Project và Import repo vừa đẩy lên.
3. Vercel sẽ tự động dò tìm cấu trúc Monorepo thông qua file vercel.json. Hãy giữ nguyên cấu hình Root Directory: ./.
4. Vào phần Environment Variables, cấu hình biến môi trường:
   - openaikey: Key OpenAI của bạn.
5. Nhấn nút Deploy và chờ Vercel thiết lập trong vài giây.

