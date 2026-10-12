# Hướng dẫn cài đặt, deploy và sử dụng

Thiệp cưới online gồm 2 phần:

- **Trang thiệp** `/{slug}`: khách mở link, xem thiệp, gửi lời chúc, xác nhận tham dự, xem QR mừng cưới.
- **Trang quản trị** `/admin`: admin tạo thiệp cho từng cặp đôi, sửa chữ/ảnh/nhạc, xem lời chúc, RSVP, tạo link riêng cho từng khách.

Frontend là Vite + React (SPA) deploy tĩnh lên Vercel. Dữ liệu, ảnh, đăng nhập dùng Supabase.

## 1. Tạo Supabase

1. Tạo project tại [supabase.com](https://supabase.com) (region Singapore cho gần Việt Nam).
2. Mở **SQL Editor**, dán toàn bộ nội dung `supabase/migrations/20261009000000_init.sql` rồi chạy. Lệnh này tạo:
   - Bảng `invitations`, `guests`, `wishes`, `rsvps`, `admin_users` kèm RLS.
   - Hàm `is_admin()` và RPC `get_guest(slug, code)`.
   - Storage bucket public `invitation-media` (ảnh + nhạc, tối đa 15MB/file, chỉ admin được ghi).
3. **Tạo tài khoản admin**: Authentication → Users → *Add user* → nhập email + mật khẩu, tick *Auto confirm*. Sau đó chạy trong SQL Editor (thay email):

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'admin@example.com';
   ```

   Chỉ user có trong `admin_users` mới sửa được thiệp. Đăng nhập được nhưng không có trong bảng này thì vẫn không làm gì được.
4. **Tắt đăng ký tự do**: Authentication → Sign In / Providers → Email → tắt *Allow new users to sign up*.
5. Lấy **Project URL** và **Publishable key** (hoặc *anon key* kiểu cũ) ở Project Settings → API.

> Không bao giờ đưa `service_role` / secret key vào biến môi trường của frontend. App chỉ cần URL + publishable/anon key, mọi quyền đã được RLS kiểm soát.

## 2. Chạy ở máy

```bash
npm install
cp .env.example .env   # rồi điền SUPABASE_URL và NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
npm run dev            # http://localhost:5173
```

- `/` và `/demo`: thiệp mẫu chạy hoàn toàn trên trình duyệt, không cần Supabase. Thêm `?khach=Tên` để thử lời mời có tên khách.
- `/admin/playground` (chỉ khi `npm run dev`): thử editor với dữ liệu mẫu, không cần đăng nhập.
- `/admin`: đăng nhập bằng tài khoản admin ở bước 1.

Các lệnh khác:

| Lệnh | Việc |
|---|---|
| `npm run build` | Typecheck + build ra `dist/` |
| `npm run lint` | oxlint |
| `npm test` | vitest (âm lịch, VietQR, link lịch, CSV, meta OG…) |
| `npm run preview` | Xem thử bản build |

### Biến môi trường

Vite đọc được cả tên biến do *Supabase integration* của Vercel tạo, nên chỉ cần **một** trong mỗi nhóm:

| Ý nghĩa | Tên biến (ưu tiên từ trái sang) |
|---|---|
| URL | `VITE_SUPABASE_URL`, `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL` |
| Key public | `VITE_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

`vite.config.ts` chỉ nhúng đúng 2 giá trị này vào bundle. Các biến khác trong `.env` (service role, mật khẩu Postgres…) không bao giờ ra trình duyệt.

## 3. Deploy Vercel

1. Import repo GitHub vào Vercel. Framework được nhận là **Vite** (đã cấu hình sẵn trong `vercel.json`).
2. Environment Variables: thêm `SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` cho Production và Preview. Nếu dùng *Supabase integration* của Vercel thì các biến này được tạo tự động.
3. Deploy. Sau mỗi lần push lên `main`, Vercel tự build lại.
4. Supabase → Authentication → URL Configuration: đặt **Site URL** là domain Vercel (vd `https://thiepcuoi.vercel.app`).

`vercel.json`:
- Rewrite mọi đường dẫn về `index.html` (SPA).
- Cache 1 năm cho `/assets/*`, vì tên file đã có hash.

### Ảnh xem trước khi chia sẻ link (Zalo, Messenger, Facebook)

Trang thiệp là SPA nên bot của mạng xã hội không chạy JavaScript. `middleware.ts` (Vercel Routing Middleware) xử lý việc này:
1. Với mỗi request `/{slug}`, đọc thiệp đã xuất bản từ Supabase.
2. Chèn `og:title`, `og:description`, `og:image` vào `index.html` trước khi trả về.

Nội dung meta:
- Có `?g=mã-khách`: tiêu đề thành "Thân mời {tên khách} | Thiệp cưới A & B".
- Lấy từ mục **Lời cảm ơn & chia sẻ link** trong editor. Để trống thì dùng tên cặp đôi và ảnh chính.
- Nếu Zalo không hiện ảnh (ảnh upload được nén sang WebP): dán link một ảnh JPG/PNG ngang 1200×630 vào ô *Ảnh khi chia sẻ link*.

Mạng xã hội cache bản xem trước. Sau khi đổi ảnh, dùng [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) để làm mới.

## 4. Sử dụng trang quản trị

1. **Tạo thiệp**: `/admin` → *Tạo thiệp*. Nhập tên (chỉ admin thấy) và đường dẫn, vd `minh-quan-thu-trang`. Thiệp mới dùng nội dung mẫu.
2. **Tab Nội dung**: sửa theo từng mục, preview điện thoại bên phải cập nhật ngay.
   - **Ảnh**: bấm *Tải ảnh lên*. Ảnh được nén sang WebP, cạnh dài tối đa 1600px, rồi lưu vào Supabase Storage. Cũng có thể dán URL ảnh.
   - **Album**: *Tải nhiều ảnh lên* để chọn nhiều ảnh cùng lúc. Dùng nút mũi tên để đổi thứ tự.
   - **Nhạc nền**: *Tải nhạc lên* (MP3/M4A, tối đa 15MB). Nhạc phát khi khách bấm *Mở thiệp*.
   - **Quà mừng**: chọn ngân hàng và nhập số tài khoản, QR VietQR được tạo tự động. Có thể dán ảnh QR riêng.
   - Bấm **Lưu**. Rời trang khi chưa lưu sẽ có cảnh báo.
3. **Xuất bản**: bật công tắc *Xuất bản*. Thiệp nháp mở ra sẽ thấy trang "không tồn tại".
4. **Tab Khách mời**: dán danh sách, mỗi dòng một tên (vd "Anh Minh & người thương"). Mỗi khách có link riêng `/{slug}?g=mã`, mở ra thấy "Thân mời {tên}". Có thể *Chép tất cả* (tên + link, dán vào Excel) hoặc tải CSV.
   - Gửi nhanh không cần tạo khách: `/{slug}?khach=Tên khách`.
5. **Tab Lời chúc**: ẩn lời chúc không phù hợp (vẫn giữ trong DB) hoặc xoá hẳn.
6. **Tab Tham dự**: tổng số khách sẽ đến, bảng chi tiết, *Xuất CSV* (mở bằng Excel không lỗi font).

## 5. Bảo mật (RLS)

| Bảng | Khách (anon) | Admin |
|---|---|---|
| `invitations` | Chỉ đọc thiệp đã xuất bản | Toàn quyền |
| `wishes` | Gửi lời chúc vào thiệp đã xuất bản. Chỉ đọc lời chúc không bị ẩn | Toàn quyền |
| `rsvps` | Chỉ gửi, không đọc được | Toàn quyền |
| `guests` | Không đọc trực tiếp. RPC `get_guest(slug, code)` trả đúng tên của 1 mã | Toàn quyền |
| Storage `invitation-media` | Đọc public | Upload/xoá |

Đã kiểm tra bằng anon key:
- Đọc `rsvps` / `guests` / `admin_users` đều trả về rỗng.
- Sửa thiệp, xoá lời chúc, upload file đều bị chặn.

## 6. Cấu trúc thư mục

```
middleware.ts                  Vercel middleware chèn meta OG
supabase/migrations/           SQL tạo bảng, RLS, bucket
src/
  App.tsx                      Router (trang admin tải lazy)
  types/invitation.ts          Schema zod của nội dung thiệp (dùng chung thiệp + editor)
  data/default-invitation.ts   Nội dung mẫu cho thiệp mới
  lib/                         supabase, âm lịch, VietQR, link lịch, upload, CSV, meta OG
  features/invitation/         Trang thiệp: sections/, overlays/ (nhạc, RSVP, quà, tim rơi), ui/
  features/admin/              Đăng nhập, danh sách thiệp, editor/ (form + preview), tabs/
  pages/                       Demo, trang thiệp theo slug, 404
public/decor, public/placeholders   Hình trang trí và ảnh mẫu tự vẽ (SVG)
```

Muốn thêm trường nội dung mới:
1. Thêm vào schema `src/types/invitation.ts` và `default-invitation.ts`.
2. Hiển thị trong `features/invitation/sections`.
3. Thêm ô nhập trong `features/admin/editor/fields`.

Thiệp cũ thiếu trường mới sẽ được `normalizeInvitationData` tự lấy giá trị mặc định, nên không cần migrate DB.
