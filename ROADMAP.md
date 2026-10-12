# Dự Án Web Portfolio & Q&A Game - Lộ Trình Phát Triển

*Quy tắc làm việc: Sau khi hoàn thành bất kỳ task nào, BẮT BUỘC phải mở file này và đổi `[ ]` thành `[x]` để cập nhật tiến độ.*

---

## Giai đoạn 1: Nền tảng & Cấu trúc (Foundation Setup)
- [x] 1.1 Khởi tạo dự án Vite + React (Đã hoàn thành)
- [x] 1.2 Cài đặt thư viện: Tailwind CSS, Lucide React, Framer Motion, Supabase JS, React Router.
  - [x] 1.2.1 Cài đặt Tailwind CSS (v4 / v3 plugin cho Vite), `clsx`, `tailwind-merge`.
  - [x] 1.2.2 Cài đặt `lucide-react`, `framer-motion`.
  - [x] 1.2.3 Cài đặt `@supabase/supabase-js`, `react-router-dom`.
- [x] 1.3 Cấu hình `tailwind.config.js` và `index.css`.
  - [x] 1.3.1 Cấu hình Tailwind theme tokens và content paths.
  - [x] 1.3.2 Cấu hình `index.css` với CSS reset và styles cơ sở.
- [x] 1.4 Tổ chức cây thư mục (`src/components`, `src/features`, `src/lib`, `src/hooks`).
  - [x] 1.4.1 Tạo cấu trúc modular: `components/ui`, `features/portfolio`, `features/game`, `services`, `hooks`, `lib`.
  - [x] 1.4.2 Dọn dẹp mã boilerplate mặc định của Vite (`App.css`, assets mặc định).
- [x] 1.5 Tạo file `.env` và thiết lập kết nối `src/lib/supabase.js`.
  - [x] 1.5.1 Tạo file mẫu `.env.example`, `.env` cục bộ và cập nhật `.gitignore`.
  - [x] 1.5.2 Xây dựng client Supabase trong `src/lib/supabase.js` kèm cơ chế Graceful Fallback (Mock Proxy Adapter khi chưa nhập credentials).
- [x] 1.6 Cấu hình Path Alias `@` trong Vite và Chuẩn hóa SEO / Meta Tags.
  - [x] 1.6.1 Thêm alias `@` trỏ tới `./src` trong `vite.config.js` để import module sạch đẹp.
  - [x] 1.6.2 Cập nhật `index.html` với tiêu đề chuyên nghiệp, thẻ SEO Open Graph (OG), favicon và ngôn ngữ chuẩn `vi`.

---

## Giai đoạn 2: UI Kit & Design System Nền Tảng (Foundation Components)
*Định hướng cá nhân hóa: Portfolio phong cách Báo chí Công nghệ Tối giản (Minimalist Tech Gazette - Tông đen trắng / xanh đậm lạnh), tương phản tinh tế với Game mode (bắt mắt, nhiều chuyển động hơn, không lòe loẹt). Tập trung xây dựng bộ khung Component linh hoạt, KHOAN khóa cứng mã màu cuối cùng.*
- [ ] 2.1 Cấu hình bộ khung Biến động (Design Tokens & CSS Variables Skeleton).
  - [ ] 2.1.1 Thiết lập hệ thống biến trừu tượng (`--bg-primary`, `--accent-cool`, `--text-primary`, `--border-subtle`).
  - [ ] 2.1.2 Chuẩn bị bộ token tương phản cho Chế độ Game (Gamified mode tokens: accent lạnh bắt mắt, nhiều chuyển động visual).
- [ ] 2.2 Tích hợp Typography tiếng Việt (Google Fonts).
  - [ ] 2.2.1 Font chữ hiện đại, sắc sảo cho văn bản & nội dung kỹ thuật (`Inter` / `Be Vietnam Pro`).
  - [ ] 2.2.2 Font tiêu đề mang hơi hướng Editorial / Display cá tính (`Space Grotesk` / `Outfit`).
- [ ] 2.3 Xây dựng Typography & Layout Wrapper gốc.
  - [ ] 2.3.1 Xây dựng `Navbar` cố định kèm nút chuyển đổi chế độ (`ModeSwitcher`: Portfolio <-> Game Playground).
  - [ ] 2.3.2 Xây dựng `Footer` và container layout chuẩn responsive.
- [ ] 2.4 Xây dựng bộ Atomic & Interactive Components linh hoạt (`src/components/ui/`).
  - [ ] 2.4.1 `Button.jsx` (hỗ trợ hiệu ứng hover vi mô, magnetic motion, glass, outline, icon).
  - [ ] 2.4.2 `Card.jsx` (hỗ trợ viền tinh tế 1px, phản quang vi mô, tilt tương tác).
  - [ ] 2.4.3 `Badge.jsx` (tag công nghệ đơn sắc thanh lịch, trạng thái cấp bậc).
  - [ ] 2.4.4 `Toast.jsx` & Toast Notification Manager (thông báo kết quả gửi liên hệ, auth).
  - [ ] 2.4.5 `SkeletonLoader.jsx` (placeholder chuyển động shimmer lúc tải dữ liệu).
  - [ ] 2.4.6 `Modal.jsx` (hộp thoại xem chi tiết dự án, đăng nhập Gmail, thử thách game).

---

## Giai đoạn 2.5: Thiết kế Database SQL, RLS & Trigger Tự Động Lưu User
*Mục tiêu: Cung cấp 1 file script `supabase/schema.sql` duy nhất để chạy trên Supabase SQL Editor là có ngay toàn bộ Database hoàn chỉnh.*
- [ ] 2.5.1 Thiết kế Schema bảng dữ liệu cốt lõi (SQL DDL).
  - [ ] 2.5.1.1 Bảng `profiles`: ID (FK auth.users), email, full_name, avatar_url, role (`recruiter`, `friend`, `admin`), created_at.
  - [ ] 2.5.1.2 Bảng `projects`: Tiêu đề, mô tả, tags, demo_link, github_link, metrics, architecture_notes, order_index.
  - [ ] 2.5.1.3 Bảng `contacts`: Tên, email, tin nhắn, is_recruiter, created_at.
  - [ ] 2.5.1.4 Bảng Game: `game_profiles`, `questions`, `vouchers`, `user_vouchers`.
- [ ] 2.5.2 Viết PostgreSQL Trigger tự động lưu thông tin khi Đăng nhập Gmail (`handle_new_user`).
  - [ ] 2.5.2.1 Trigger lắng nghe sự kiện `auth.users` -> tự động chèn record vào `public.profiles` với avatar và tên từ Google.
- [ ] 2.5.3 Thiết lập Row Level Security (RLS) & Quyền truy cập an toàn.
  - [ ] 2.5.3.1 Công khai đọc `projects`; Cho phép người dùng gửi tin nhắn vào `contacts`.
  - [ ] 2.5.3.2 Bảo vệ dữ liệu cá nhân trong `profiles` và bảo vệ đáp án câu hỏi game.
- [ ] 2.5.4 Tạo file Seed Data mẫu (`supabase/seed.sql`) với dữ liệu dự án mẫu của Đông Anh.

---

## Giai đoạn 3: Professional Web Portfolio (Ưu tiên)
- [ ] 3.1 Xây dựng `Hero Section` (Typing text, Buttons).
  - [ ] 3.1.1 Hiệu ứng gõ chữ động (Dynamic Typing Headline).
  - [ ] 3.1.2 CTA Buttons: "Tải CV", "Liên hệ ngay", "Khu vui chơi Arcade".
- [ ] 3.2 Xây dựng `About Me` (Tiểu sử, Tầm nhìn).
  - [ ] 3.2.1 Câu chuyện nghề nghiệp, triết lý kỹ thuật và cam kết chất lượng.
- [ ] 3.3 Xây dựng `Skills Matrix` (Grid UI với phân cấp kỹ năng).
  - [ ] 3.3.1 Danh mục phân loại: Frontend, Backend, Database, Cloud/DevOps, AI.
  - [ ] 3.3.2 Huy hiệu kinh nghiệm & mức độ thành thạo trực quan.
- [ ] 3.4 Xây dựng `Projects Showcase` (Lấy dữ liệu từ Supabase/Mock data).
  - [ ] 3.4.1 Bộ lọc phân loại dự án theo lĩnh vực.
  - [ ] 3.4.2 Modal xem chi tiết kiến trúc giải pháp (Architecture breakdown) & chỉ số tác động.
- [ ] 3.5 Xây dựng `Contact Form` (Tích hợp Supabase Insert).
  - [ ] 3.5.1 Form nhập liệu có validation Tiếng Việt chặt chẽ.
  - [ ] 3.5.2 Gửi liên hệ lưu vào Supabase + thông báo Toast thành công.

---

## Giai đoạn 4: Xác Thực (Auth), Phân Quyền (RBAC) & Quản Lý Phiên
- [ ] 4.1 Xây dựng luồng Đăng nhập (Google / Gmail OAuth & VIP Recruiter).
  - [ ] 4.1.1 Đăng nhập Gmail một chạm qua Google OAuth (`supabase.auth.signInWithOAuth`).
  - [ ] 4.1.2 Đăng nhập nhanh cho nhà tuyển dụng (VIP Access Code / Magic Link).
  - [ ] 4.1.3 Tự động đồng bộ và lưu thông tin người dùng từ Gmail vào `profiles`.
- [ ] 4.2 Thiết lập Row Level Security (RLS) & RPC Functions trên Supabase.
  - [ ] 4.2.1 Chính sách RLS chỉ đọc/ghi đúng theo phân quyền (`recruiter`, `friend`, `admin`).
  - [ ] 4.2.2 Viết PostgreSQL RPC Functions ẩn đáp án Q&A và khóa gian lận điểm.
- [ ] 4.3 Viết Custom Hook quản lý phiên đăng nhập (`useAuth.js`).
  - [ ] 4.3.1 Lắng nghe `onAuthStateChange`, quản lý trạng thái đăng nhập, user role và avatar.

---

## Giai đoạn 5: Gamified Arcade (Q&A Game)
- [ ] 5.1 Xây dựng `Player Dashboard` (Cấp bậc, EXP).
  - [ ] 5.1.1 Thanh trạng thái người chơi: Avatar, Danh hiệu cấp bậc, Thanh tiến trình EXP, Số dư Coins.
- [ ] 5.2 Xây dựng `Quest / Trivia Modal` (Giao diện câu hỏi, hiệu ứng nổi/kính mờ).
  - [ ] 5.2.1 Bản đồ thử thách các ải câu hỏi (Quest Map).
  - [ ] 5.2.2 Giao diện chọn đáp án tương tác kèm âm thanh/hiệu ứng visual.
- [ ] 5.3 Xây dựng luồng kiểm tra đáp án (Gọi Supabase RPC).
  - [ ] 5.3.1 Xác thực câu trả lời server-side, cộng điểm atomic và mở khóa nội dung kỷ niệm bí mật.
- [ ] 5.4 Xây dựng `Voucher Store` và logic đổi thưởng.
  - [ ] 5.4.1 Danh sách voucher quà tặng (Cà phê, Ăn trưa, Review Code).
  - [ ] 5.4.2 Logic đổi voucher bằng PostgreSQL transaction an toàn, sinh mã code cá nhân.

---

## Giai đoạn 6: Hoàn thiện & Polish
- [ ] 6.1 Tích hợp RAG AI Chatbot Assistant.
  - [ ] 6.1.1 Widget trò chuyện hỗ trợ trả lời kinh nghiệm, năng lực kỹ thuật của Đông Anh.
- [ ] 6.2 Kiểm tra Responsive 100% trên thiết bị di động.
  - [ ] 6.2.1 Tinh chỉnh UI trên đa kích thước màn hình (Mobile, Tablet, Desktop).
- [ ] 6.3 Tối ưu SEO Meta tags và hiệu năng load trang.
  - [ ] 6.3.1 OpenGraph tags, semantic HTML, tối ưu asset và tốc độ tải.
