# Thiệp cưới online

Thiệp cưới online một trang (bố cục "Minimalism Đỏ Đậm") kèm trang quản trị để tạo thiệp cho nhiều cặp đôi, đổi chữ/ảnh/nhạc, quản lý lời chúc, xác nhận tham dự và link mời riêng cho từng khách.

**Stack:** Vite + React 19 + TypeScript, Tailwind CSS v4, shadcn/ui, React Bits, motion, Swiper, Supabase (Postgres + Storage + Auth), deploy Vercel.

## Tính năng

- Màn bìa "Mở thiệp", tim rơi, nhạc nền, tự cuộn chậm.
- Thông tin lễ cưới/tiệc cưới, ngày âm lịch tự tính, lịch tháng, thêm vào Google Calendar / .ics.
- Bản đồ, chỉ đường.
- Album ảnh coverflow + xem phóng to.
- Dress code, lịch trình.
- Sổ lưu bút, xác nhận tham dự (RSVP).
- Hộp quà mừng với QR VietQR.
- Link riêng từng khách `/{slug}?g=mã` → "Thân mời {tên}".
- Admin:
  - Editor dạng form + preview điện thoại trực tiếp.
  - Upload ảnh (tự nén WebP) và nhạc.
  - Quản lý lời chúc / RSVP (xuất CSV) / khách mời.
- Ảnh và tiêu đề xem trước khi chia sẻ link qua Zalo/Messenger (Vercel middleware).

## Chạy nhanh

```bash
npm install
cp .env.example .env   # điền SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
npm run dev            # http://localhost:5173 (thiệp mẫu chạy được cả khi chưa có Supabase)
```

Cài Supabase (chạy migration, tạo admin, tắt đăng ký), deploy Vercel và cách dùng trang quản trị: xem **[docs/huong-dan.md](docs/huong-dan.md)**.

## Lệnh

| Lệnh | Việc |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck + build `dist/` |
| `npm run lint` | oxlint |
| `npm test` | vitest |

Hình trang trí và ảnh mẫu trong `public/` đều tự vẽ bằng SVG. Không dùng lại tài nguyên của trang gốc.
