# 🎬 TicketBooking

Dự án web đặt vé xem phim trực tuyến.

## 🚀 Tính năng chính

### 👤 Người dùng

- Có thể **đăng ký tài khoản, khám phá phim và đặt vé**.
- Trong khi đặt vé, người dùng có thể **chọn chỗ ngồi ưa thích** của mình.
- Khi đặt vé và **thanh toán bị hủy hoặc không thành công**, chỗ ngồi sẽ được **giữ trong 10 phút** để người dùng thử thanh toán lại.  
  Nếu sau 10 phút không thanh toán, chỗ ngồi sẽ tự động bị hủy.

### 🛠️ Quản trị

- **Bảng điều khiển quản trị**, nơi quản trị viên có thể:
  - Thêm phim mới.
  - Quản lý việc đặt vé.

### 🔐 Xác thực

- Sử dụng [Clerk](https://clerk.com/) để xác thực người dùng.
- Hỗ trợ nhiều tùy chọn đăng ký: **Email, Mạng xã hội, Số điện thoại**.
- Hỗ trợ **đa phiên đăng nhập**, cho phép người dùng tạo nhiều hồ sơ và dễ dàng chuyển đổi giữa các tài khoản mà không cần đăng xuất.

## ⚡ Khởi động dự án

Clone repo về máy:

```bash
git clone <repo-url>
cd TicketBooking
```

npm install

# Chạy frontend

cd client
npm run dev

# Chạy backend

cd server
npm run server
