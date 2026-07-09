# Requirements Document

## Introduction

Tính năng **Watchlist Filter** bổ sung khả năng theo dõi (follow/unfollow) các mã tài sản trong trang Overview của ứng dụng MyWallet. Người dùng có thể đánh dấu các mã quan tâm bằng nút ngôi sao (⭐), lọc nhanh danh sách chỉ hiển thị các mã đang theo dõi qua tab "Watchlist", và dữ liệu được lưu bền vững qua các lần tải lại trang nhờ localStorage. Khi lần đầu sử dụng (chưa có dữ liệu localStorage), hệ thống tự động seed 9 mã mặc định vào Watchlist.

---

## Glossary

- **Watchlist**: Danh sách các mã tài sản mà người dùng đã chọn theo dõi (follow).
- **Follow**: Trạng thái một mã tài sản đang được người dùng theo dõi — hiển thị trong tab Watchlist.
- **Unfollow**: Hành động hủy theo dõi một mã tài sản — mã đó sẽ không còn hiển thị trong tab Watchlist.
- **Star_Button**: Nút hình ngôi sao ở cột "Thao tác" của mỗi hàng trong bảng tài sản tham khảo.
- **Category_Tab**: Thanh tab lọc phân nhóm nằm phía trên bảng tài sản tham khảo (All, Crypto, Chứng khoán VN, …).
- **Watchlist_Tab**: Tab lọc tên "Watchlist (N)" ở cuối dãy Category_Tab, hiển thị số lượng mã đang follow.
- **Overview_Table**: Bảng "Danh sách tài sản tham khảo" trong trang Overview.
- **LocalStorage**: Bộ nhớ trình duyệt phía client, dùng để lưu trữ dữ liệu Watchlist bền vững qua các lần reload.
- **Seed_Data**: Bộ 9 mã tài sản mặc định được thêm vào Watchlist khi lần đầu khởi động ứng dụng mà LocalStorage chưa có dữ liệu Watchlist.
- **WatchlistManager**: Module/hook phía frontend chịu trách nhiệm đọc, ghi, khởi tạo và cung cấp trạng thái Watchlist cho toàn ứng dụng.

---

## Requirements

### Requirement 1: Hiển thị Tab Watchlist trong Category_Tab

**User Story:** As a người dùng, I want xem một tab "Watchlist" riêng biệt ở cuối thanh Category_Tab, so that I can dễ dàng chuyển sang chế độ xem chỉ các mã đang theo dõi.

#### Acceptance Criteria

1. THE Overview_Table SHALL hiển thị tab "Watchlist (N)" ở vị trí cuối cùng trong dãy Category_Tab, sau tab "Khác".
2. WHEN không có mã nào đang được follow, THE Watchlist_Tab SHALL hiển thị nhãn "Watchlist (0)".
3. WHEN có N mã đang được follow (N ≥ 1), THE Watchlist_Tab SHALL hiển thị nhãn "Watchlist (N)" với N là số nguyên dương bằng đúng số mã đang follow.
4. WHEN người dùng click vào Watchlist_Tab, THE Overview_Table SHALL chỉ hiển thị các hàng có mã đang ở trạng thái follow.
5. WHEN người dùng click vào bất kỳ Category_Tab nào khác (All, Crypto, v.v.), THE Overview_Table SHALL hiển thị danh sách tài sản theo bộ lọc phân nhóm tương ứng như trước đây.
6. WHEN Watchlist_Tab đang được chọn và người dùng unfollow tất cả các mã, THE Overview_Table SHALL hiển thị trạng thái trống với thông báo "Chưa có mã nào trong Watchlist".

---

### Requirement 2: Nút ngôi sao (Star_Button) toggle Follow/Unfollow

**User Story:** As a người dùng, I want bấm nút ngôi sao trên mỗi hàng tài sản để follow hoặc unfollow mã đó, so that I can quản lý danh sách theo dõi cá nhân trực tiếp từ bảng tài sản.

#### Acceptance Criteria

1. THE Overview_Table SHALL hiển thị một Star_Button ở cột "Thao tác" của mỗi hàng tài sản, bên cạnh các nút hiện có ("Xem biểu đồ", "Giả lập").
2. WHEN một mã đang ở trạng thái follow, THE Star_Button của mã đó SHALL hiển thị biểu tượng ngôi sao filled màu vàng (yellow-400).
3. WHEN một mã đang ở trạng thái unfollow, THE Star_Button của mã đó SHALL hiển thị biểu tượng ngôi sao outline màu xám (slate-400).
4. WHEN người dùng click Star_Button trên một mã đang unfollow, THE WatchlistManager SHALL chuyển mã đó sang trạng thái follow và cập nhật hiển thị ngôi sao thành filled màu vàng ngay lập tức.
5. WHEN người dùng click Star_Button trên một mã đang follow, THE WatchlistManager SHALL chuyển mã đó sang trạng thái unfollow và cập nhật hiển thị ngôi sao thành outline ngay lập tức.
6. WHEN trạng thái follow/unfollow thay đổi, THE Watchlist_Tab SHALL cập nhật số lượng N trong nhãn ngay lập tức mà không cần reload trang.

---

### Requirement 3: Lưu trữ Watchlist trong LocalStorage

**User Story:** As a người dùng, I want dữ liệu Watchlist được lưu tự động vào trình duyệt, so that I can mở lại ứng dụng bất kỳ lúc nào mà vẫn thấy danh sách theo dõi đã thiết lập.

#### Acceptance Criteria

1. WHEN trạng thái follow/unfollow của bất kỳ mã nào thay đổi, THE WatchlistManager SHALL ghi danh sách các symbol đang follow vào LocalStorage với key `mywallet_watchlist`.
2. WHEN ứng dụng khởi động (page load/reload), THE WatchlistManager SHALL đọc dữ liệu Watchlist từ LocalStorage key `mywallet_watchlist` và khôi phục trạng thái follow cho các mã tương ứng.
3. IF dữ liệu tại LocalStorage key `mywallet_watchlist` bị lỗi hoặc không phải mảng hợp lệ, THEN THE WatchlistManager SHALL bỏ qua dữ liệu lỗi và khởi tạo Watchlist từ Seed_Data.
4. THE WatchlistManager SHALL lưu dữ liệu Watchlist dưới dạng mảng JSON các chuỗi symbol (ví dụ: `["BTC-USD","ETH-USD","GC=F"]`).

---

### Requirement 4: Seed Data mặc định khi lần đầu sử dụng

**User Story:** As a người dùng mới, I want ứng dụng tự động thêm một số mã phổ biến vào Watchlist khi lần đầu sử dụng, so that I can có trải nghiệm khám phá ngay mà không cần tự cấu hình từ đầu.

#### Acceptance Criteria

1. WHEN ứng dụng khởi động và LocalStorage key `mywallet_watchlist` chưa tồn tại, THE WatchlistManager SHALL khởi tạo Watchlist với đúng 9 symbol Seed_Data sau: `BTC-USD`, `ETH-USD`, `GC=F`, `SI=F`, `CL=F`, `^GSPC`, `^N225`, `^GDAXI`, `^HSI`.
2. WHEN Seed_Data được khởi tạo, THE WatchlistManager SHALL ghi 9 symbol đó vào LocalStorage key `mywallet_watchlist`.
3. WHEN LocalStorage key `mywallet_watchlist` đã tồn tại và hợp lệ, THE WatchlistManager SHALL KHÔNG ghi đè Seed_Data lên dữ liệu người dùng đã có.

---

### Requirement 5: Bổ sung hằng số cho mã ^GDAXI và ^HSI

**User Story:** As a developer, I want các mã ^GDAXI (DAX 30 - DE30) và ^HSI (Hang Seng 50 - HK50) có mặt trong danh sách tài sản mặc định của ứng dụng, so that the WatchlistManager có thể hiển thị đầy đủ dữ liệu ban đầu cho 2 mã này trong Watchlist.

#### Acceptance Criteria

1. THE constants/index.js SHALL chứa entry cho mã `^GDAXI` với name "DAX 30 - DE30", category "Khác", và các thuộc tính price, change, isVnd, volume, details hợp lệ.
2. THE constants/index.js SHALL chứa entry cho mã `^HSI` với name "Hang Seng 50 - HK50", category "Khác", và các thuộc tính price, change, isVnd, volume, details hợp lệ.
3. IF `^GDAXI` hoặc `^HSI` chưa có trong mảng MARKET_ASSETS, THEN THE constants/index.js SHALL thêm hai entry này vào mảng MARKET_ASSETS trong nhóm "Khác".

---

### Requirement 6: Lọc bảng theo Watchlist không ảnh hưởng đến phân trang và tìm kiếm

**User Story:** As a người dùng, I want các tính năng phân trang và tìm kiếm hiện có hoạt động đúng khi đang ở tab Watchlist, so that I can duyệt và tìm kiếm trong danh sách theo dõi một cách nhất quán.

#### Acceptance Criteria

1. WHEN Watchlist_Tab đang được chọn, THE Overview_Table SHALL áp dụng phân trang với cùng `overviewItemsPerPage` (10 mã/trang) lên danh sách các mã đang follow.
2. WHEN người dùng chuyển từ một Category_Tab khác sang Watchlist_Tab, THE Overview_Table SHALL reset về trang 1.
3. WHEN Watchlist_Tab đang được chọn và người dùng thực hiện tìm kiếm toàn cục, THE Overview_Table SHALL xử lý tìm kiếm như bình thường (thêm mã mới vào danh sách, không reset trạng thái Watchlist).
