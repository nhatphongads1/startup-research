# Nghiên Cứu Tìm Kiếm Cơ Hội Khởi Nghiệp

Trang web tĩnh (HTML/CSS/JS thuần, không cần build) — sẵn sàng deploy bằng GitHub Pages.

## ⚠️ Lưu ý quan trọng

Phần "RESEARCH TÌM KIẾM" gọi Gemini thông qua Vercel Function (`/api/analyze`). API key được giữ ở biến môi trường
`GEMINI_API_KEY`, không bao giờ được đưa vào trình duyệt. Để chức năng hoạt động trên Vercel, thêm biến này tại
**Project → Settings → Environment Variables**, sau đó redeploy.

Các phần còn lại vẫn hoạt động bình thường:
- 4 thẻ liên kết ra Notion
- Thanh trượt tính % độ phù hợp cá nhân
- Bảng so sánh (lưu trên trình duyệt người dùng qua localStorage)
- Nút Zalo nổi + khối kết nối chuyên gia

Mô hình mặc định là Gemini Flash để phản hồi nhanh và tối ưu chi phí. Bạn có thể đổi biến `MODEL` trong
`api/analyze.js` nếu cần một mô hình khác.

## Cách đưa lên GitHub Pages

### 1. Tạo repo mới trên GitHub
Vào https://github.com/new, đặt tên (ví dụ `startup-research`), để **Public**, không cần tick thêm gì, bấm
**Create repository**.

### 2. Đẩy code lên (chạy trong terminal, trên máy bạn)
Giải nén file zip này ra một thư mục, mở terminal tại đó rồi chạy:

```bash
git init
git add .
git commit -m "Trang nghiên cứu cơ hội khởi nghiệp"
git branch -M main
git remote add origin https://github.com/<TEN-GITHUB-CUA-BAN>/startup-research.git
git push -u origin main
```

(Thay `<TEN-GITHUB-CUA-BAN>` bằng username GitHub của bạn.)

### 3. Bật GitHub Pages
- Vào repo trên GitHub → **Settings** → mục **Pages** (menu bên trái)
- Ở **Source**, chọn nhánh **main**, thư mục **/ (root)** → **Save**
- Đợi 1–2 phút, trang sẽ có tại:
  `https://<TEN-GITHUB-CUA-BAN>.github.io/startup-research/`

### 4. (Sau này) Trỏ tên miền riêng
Khi có tên miền, quay lại mục **Pages** → nhập tên miền vào ô **Custom domain** → GitHub sẽ tự tạo file `CNAME`
trong repo. Sau đó vào nơi quản lý DNS của tên miền, thêm bản ghi CNAME trỏ về
`<TEN-GITHUB-CUA-BAN>.github.io`. Nhắn mình tên miền lúc đó, mình sẽ tạo sẵn file CNAME cho bạn.
