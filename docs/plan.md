# Plan: Thiệp cưới online (clone bố cục "Minimalism Đỏ Đậm") + trang admin chỉnh sửa

## Context

Bạn muốn dựng lại bố cục và trải nghiệm của thiệp mẫu https://chungdoi.com/vi/mau-thiep/minimalism-do-dam/demo bằng **Vite + React + Tailwind (+ shadcn/ui, React Bits)**, và có **trang admin** để đổi ảnh/chữ, tạo thiệp cho nhiều cặp đôi khác nhau (mỗi thiệp một link riêng).

Các lựa chọn đã chốt:
- Lưu dữ liệu: **Supabase** (Postgres + Storage + Auth), frontend deploy tĩnh lên Vercel.
- Người chỉnh sửa: **chỉ admin**. Admin đăng nhập `/admin`, tạo/sửa thiệp rồi gửi link.
- Editor: **form bên trái + preview live bên phải**.
- Tính năng giữ lại: Lưu bút + RSVP, QR quà mừng, nhạc nền + map + thêm vào lịch, link riêng có tên từng khách.

Thư mục `thiepcuoi/` hiện trống (chỉ có `requiremennt.md`) và chưa `git init`.

**Tài nguyên:** chỉ dựng lại bố cục, màu sắc, hiệu ứng bằng code của mình. **Không tải về hay dùng lại** ảnh cưới, hoa trang trí, nền lâu đài, giấy, phong bì hay file nhạc của chungdoi. Hình trang trí mặc định lấy từ nguồn CC0/free-license (hoặc SVG tự vẽ). Ảnh cưới và nhạc do admin upload. Nội dung mẫu mặc định tự viết với tên giả khác.

## Phân tích thiệp mẫu (xem bằng Chrome DevTools, viewport 500px)

Thứ tự section:
1. **Màn bìa**: nền đỏ đô gradient, tim rơi lơ lửng. Ở giữa có card kem gồm icon tim tròn, tên "A & B", ngày, "Thân Mời", nút **Mở thiệp**. Bấm nút thì mở thiệp và bật nhạc.
2. **Header "Save The Date"**: tên cô dâu chú rể, ảnh cưới lồng trong phong bì, hoa trang trí bay nhẹ (`translateY` ±8px). Nền là giấy kem có hình lâu đài mờ.
3. **Thông tin lễ cưới** (card đỏ đô, chữ kem):
   - Bố mẹ hai họ chia hai cột, kèm địa chỉ.
   - "Trân trọng báo tin lễ thành hôn của con chúng tôi".
   - Tên đầy đủ kèm vai vế (Trưởng nam / Út nữ).
   - "Lễ thành hôn được cử hành tại Tư gia", giờ, thứ, ngày tháng năm, (Tức ngày … âm lịch).
4. **Album ảnh**: carousel 3D coverflow, dots, mở lightbox khi bấm.
5. **Thông tin tiệc cưới** (card đỏ đô):
   - Giờ, ngày, âm lịch, Đón khách / Khai tiệc.
   - Lịch tháng có ô ngày cưới hình trái tim.
   - Link **Thêm vào lịch** (Google Calendar).
   - Nút **Xác nhận tham dự** mở modal RSVP: tên + "Tôi sẽ đến / Rất tiếc, tôi không thể đến".
6. **Địa điểm tiệc**: địa chỉ, Google Map embed, nút **Chỉ đường**.
7. **Dress code**: 4 chấm màu.
8. **Lịch trình ngày cưới**: timeline giờ + hoạt động.
9. **Sổ lưu bút**:
   - Form gồm tên, lời chúc, nút 🪄 gợi ý lời chúc và nút **Gửi lời chúc**.
   - Danh sách lời chúc cuộn (khung cao tối đa 500px).
10. **Hộp quà mừng**: hộp quà lấp lánh "Nhấn để mở" mở bottom sheet. Bottom sheet có QR chuyển khoản của chú rể và cô dâu (ngân hàng, STK, tên) và nút **Lưu QR**.
11. **Footer** lời cảm ơn.
12. Nổi trên trang: nút nhạc (đĩa xoay, play/pause), tự động cuộn chậm sau khi mở thiệp.

Bảng màu: đỏ đô `#511419` / `#590310`, kem `#ECE4D8` / `#F7EFE6`, vàng `#C9A24A`.

Font (đều có trên Google Fonts, hỗ trợ tiếng Việt):
- Viaoda Libre cho tên.
- Cormorant Garamond / Libre Baskerville / Lora cho nội dung.
- Ms Madi cho chữ viết tay ("Tháng 1 / 2026").

## Tech stack

| Mục đích | Thư viện |
|---|---|
| Build | Vite + React 19 + TypeScript |
| Style | Tailwind CSS v4 (`@tailwindcss/vite`), theme token CSS variables |
| UI admin + dialog/sheet | shadcn/ui: Button, Input, Textarea, Label, Dialog, Drawer (vaul), Accordion, Tabs, Switch, Select, RadioGroup, Card, Table, ScrollArea, Sonner |
| Hiệu ứng chữ / reveal | React Bits (cài qua shadcn registry `https://reactbits.dev/r/<Name>-TS-TW`): SplitText/BlurText cho tên, AnimatedContent/FadeContent cho reveal khi cuộn |
| Animation tuỳ biến | `motion` (mở bìa, tim rơi, hộp quà, hoa bay) |
| Album | `swiper` (EffectCoverflow + Pagination) + `yet-another-react-lightbox` |
| Router | `react-router` v7 |
| Data | `@supabase/supabase-js` + `@tanstack/react-query` |
| Form editor | `react-hook-form` + `zod` + `@hookform/resolvers` |
| Ảnh | `browser-image-compression` (nén sang webp, tối đa 1600px trước khi upload) |
| Test | `vitest` (util âm lịch, VietQR, link lịch) |

## Kiến trúc dữ liệu

Mỗi thiệp là **một bản ghi** gồm cột `data jsonb` chứa toàn bộ nội dung. Schema zod nằm ở `src/types/invitation.ts` và dùng chung cho cả trang public lẫn editor. Thêm section hay trường mới thì không cần migrate DB.

```ts
InvitationData = {
  theme:    { primary, primaryDark, cream, paper, gold }        // đổi màu được
  assets:   { paperTexture, backgroundArt, flowerDecor, envelope? } // ảnh trang trí, đổi được
  cover:    { greeting: 'Thân mời', buttonText: 'Mở thiệp' }
  hero:     { label: 'Save The Date', photo }
  groom/bride: { fullName, shortName, role, father, mother, address }
  ceremony: { heading, venue, datetime, lunarOverride? }
  album:    { title, photos: [{ url, alt }] }
  party:    { datetime, welcomeTime, startTime, venueName, address, mapQuery, lunarOverride? }
  dressCode:{ enabled, subtitle, colors: string[] }
  schedule: { enabled, items: [{ time, label }] }
  guestbook:{ enabled }   rsvp: { enabled }
  gift:     { enabled, accounts: [{ label, bankBin, bankName, accountNumber, accountName, qrImage? }] }
  music:    { enabled, url, autoplayOnOpen }
  autoScroll: boolean
  footer:   { message }
  seo:      { title, description, ogImage }
}
```

### Supabase (`supabase/migrations/0001_init.sql`)

Bảng:
- `invitations`: `id`, `slug` (unique), `title`, `data jsonb`, `published bool`, `owner_id`, `created_at`, `updated_at`.
- `wishes`: `id`, `invitation_id`, `name`, `message`, `hidden bool`, `created_at`. Có check độ dài: tên ≤ 60, lời chúc ≤ 500.
- `rsvps`: `id`, `invitation_id`, `guest_id?`, `name`, `attending bool`, `guest_count int`, `created_at`.
- `guests`: `id`, `invitation_id`, `display_name` (vd "Anh Minh & người thương"), `code` (short, unique), `created_at`.

Storage bucket `invitation-media`: đọc public, chỉ user đã đăng nhập được ghi. Đường dẫn file: `{invitation_id}/{uuid}.webp`.

RLS:
- `invitations`: anon chỉ `select` được thiệp có `published = true`. Authenticated được toàn quyền.
- `wishes`: anon được `insert`, và `select` được lời chúc `hidden = false` của thiệp đã publish. Authenticated toàn quyền.
- `rsvps`: anon chỉ được `insert`. Chỉ authenticated mới đọc được.
- `guests`: anon không đọc trực tiếp. Dùng RPC `get_guest(slug, code)` (`security definer`) trả về đúng `display_name`, tránh lộ danh sách khách.
- Tắt sign-up trong Supabase Auth. Admin được tạo tay trong dashboard.

> Trước khi chạy `supabase db reset` hoặc bất kỳ lệnh xoá dữ liệu nào, mình sẽ hỏi lại bạn (theo CLAUDE.md).

## Cấu trúc thư mục

```
src/
  main.tsx, App.tsx                  # routes: /:slug, /admin/login, /admin, /admin/thiep/:id
  lib/ supabase.ts, utils.ts(cn), lunar.ts, vietqr.ts, calendar-link.ts, upload-image.ts
  types/invitation.ts                # zod schema + types
  data/ default-invitation.ts, wish-suggestions.ts
  components/ui/*                    # shadcn
  components/reactbits/*             # React Bits
  features/invitation/
    InvitationView.tsx               # nhận (data, guestName, mode: 'live'|'preview'), ghép các section
    sections/ CoverScreen, HeroHeader, CeremonyInfo, AlbumCarousel, PartyInfo, MonthCalendar,
              VenueMap, DressCode, Schedule, Guestbook, GiftBox, Footer
    overlays/ RsvpDialog, GiftDrawer, MusicPlayer, FallingHearts, useAutoScroll
  features/admin/
    LoginPage, DashboardPage, EditorPage, RequireAuth
    editor/ fields/*Fields.tsx (mỗi section 1 file), ImageUploadField, ColorListField, PhonePreview
    tabs/ WishesTab, RsvpTab (export CSV), GuestsTab (tạo khách + copy link)
  pages/PublicInvitationPage.tsx     # fetch theo slug, đọc ?g=code hoặc ?khach=Tên
supabase/migrations/0001_init.sql
docs/plan.md, docs/plan.html
.env.example (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY), vercel.json (SPA rewrite)
```

Các util chính:
- `lunar.ts`: thuật toán âm lịch Hồ Ngọc Đức (múi giờ +7) trả về "ngày 15 tháng 11 năm Ất Tỵ". Có thể ghi đè thủ công trong editor.
- `vietqr.ts`: tạo URL `https://img.vietqr.io/image/{bin}-{stk}-compact2.png?accountName=…`. Danh sách ngân hàng lấy từ `https://api.vietqr.io/v2/banks`, có fallback upload ảnh QR riêng.
- `calendar-link.ts`: tạo link Google Calendar template và file `.ics`.
- Map: `https://www.google.com/maps?q=<địa chỉ>&output=embed` (không cần API key). Chỉ đường dùng `maps/dir/?api=1&destination=`.

## Các bước thực hiện (mỗi bước 1 commit, không có dòng Co-Authored-By)

0. **Docs + git**: chép plan này vào `docs/plan.md` và `docs/plan.html`, chạy `git init` và tạo `.gitignore`.
   Commit: `docs: plan clone thiệp cưới`
1. **Scaffold**:
   - Vite React TS, Tailwind v4, alias `@/`, `shadcn init`, thêm các component shadcn cần dùng.
   - Google Fonts, theme tokens (`--primary`… trong `index.css`).
   - Layout mobile-first: max-w 480px canh giữa, có viền khi màn hình desktop.
   Commit: `feat: khởi tạo vite react tailwind shadcn`
2. **Model + util**: zod schema, `default-invitation.ts`, `lunar.ts`, `vietqr.ts`, `calendar-link.ts`, kèm vitest. Ca test: 03/01/2026 phải ra 15/11 Ất Tỵ.
   Commit: `feat: schema dữ liệu thiệp và tiện ích âm lịch/vietqr`
3. **Trang thiệp tĩnh** (dùng default data, chưa nối DB), chia commit theo nhóm:
   - 3a. CoverScreen (card, mở thiệp bằng animation motion) và FallingHearts.
   - 3b. HeroHeader và CeremonyInfo.
   - 3c. AlbumCarousel (Swiper coverflow + lightbox).
   - 3d. PartyInfo, MonthCalendar (ô tim), nút Thêm vào lịch, VenueMap.
   - 3e. DressCode, Schedule, Footer, reveal khi cuộn bằng React Bits.
   - 3f. MusicPlayer (đĩa xoay, bật nhạc khi bấm "Mở thiệp") và useAutoScroll (dừng khi người dùng chạm hoặc cuộn).
4. **Supabase**:
   - Viết migration, RLS, bucket, RPC `get_guest`; thêm `supabase.ts`.
   - `PublicInvitationPage` fetch theo slug. Thiệp chưa publish hoặc không tồn tại thì hiện trang 404 đẹp.
   Commit: `feat: kết nối supabase và trang thiệp theo slug`
5. **Tương tác khách**:
   - RsvpDialog (shadcn Dialog + RadioGroup) và Guestbook (insert, danh sách, nút 🪄 lấy lời chúc mẫu ngẫu nhiên, honeypot chống spam).
   - Tên khách qua `?g=code` / `?khach=`.
   - GiftBox + GiftDrawer (shadcn Drawer, QR, Lưu QR tải ảnh về).
   Mỗi phần 1 commit.
6. **Admin**:
   - 6a. Login (email/password), RequireAuth, Dashboard: danh sách thiệp, tạo mới (slug + tiêu đề), bật/tắt publish, copy link.
   - 6b. EditorPage: Accordion form theo section + `useFieldArray` (album, lịch trình, màu dress code, tài khoản quà). Preview live trong khung điện thoại dùng `watch()`. Có nút Lưu và cảnh báo khi rời trang mà chưa lưu.
   - 6c. ImageUploadField: nén ảnh, upload Storage, preview, hỗ trợ dán URL. Upload nhạc mp3 dùng chung field này.
   - 6d. Các tab Lời chúc (ẩn/xoá), RSVP (bảng + xuất CSV), Khách mời (thêm khách, copy link cá nhân hoá).
7. **Deploy + chia sẻ**:
   - Thêm `vercel.json`.
   - Viết Vercel Edge Middleware cho `/:slug`: chèn `og:title` / `og:image` từ Supabase để khi share link qua Zalo/Messenger hiện đúng ảnh và tên cặp đôi (SPA thuần không làm được việc này).
   - README hướng dẫn tạo Supabase project và admin.
   Commit: `feat: deploy vercel và og meta theo thiệp`

**Cần bạn chuẩn bị khi tới bước 4:** tạo Supabase project, gửi `URL` + `anon key`, tạo 1 user admin. Ảnh cưới và nhạc mẫu thì để sau, upload qua admin.

## Kiểm tra (verification)

- `npm run build`, `npm run lint`, `npx vitest run` đều phải pass.
- Chạy `npm run dev` rồi dùng **Chrome DevTools MCP** (bản plugin `chrome-devtools-mcp`, bản thường không kết nối được Chrome). Mở song song trang gốc và bản clone ở 390×844 và 1280×800, so sánh từng section.
- Test luồng người xem:
  - Mở bìa thì nhạc phát và auto-scroll chạy.
  - Swipe album, mở lightbox.
  - Thêm vào lịch, Chỉ đường.
  - Gửi RSVP thì có dòng mới trong bảng `rsvps`.
  - Gửi lời chúc thì lời chúc hiện ngay trong danh sách.
  - Mở hộp quà, QR hiển thị đúng, Lưu QR tải được file.
  - `?g=code` hiện "Thân mời {tên}".
- Test admin:
  - Login, tạo thiệp, sửa text và upload ảnh thì preview đổi ngay.
  - Lưu xong mở `/:slug` thấy cập nhật.
  - Tắt publish thì trang ra 404.
  - Ẩn lời chúc thì lời chúc biến mất trên trang public.
- Test RLS: dùng `curl` với anon key gọi `rsvps` / `guests` phải bị chặn; `insert` vào `wishes` phải được.
