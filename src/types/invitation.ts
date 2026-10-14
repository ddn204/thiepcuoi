import { z } from "zod";

const hex = z
  .string()
  .regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Mã màu dạng #RRGGBB");
const text = (max = 200) => z.string().trim().max(max, `Tối đa ${max} ký tự`);
const required = (max = 200) => text(max).min(1, "Không được để trống");
/** Đường dẫn ảnh/nhạc: URL đầy đủ hoặc path tương đối trong /public. Có thể để trống. */
const mediaUrl = z.string().trim().max(1000);
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày dạng YYYY-MM-DD");
const timeStr = z.string().regex(/^\d{2}:\d{2}$/, "Giờ dạng HH:mm");

export const personSchema = z.object({
  fullName: required(80),
  shortName: required(40),
  /** Vai vế trong gia đình, vd "Trưởng nam", "Út nữ" */
  role: text(40),
  father: text(80),
  mother: text(80),
  address: text(160),
});

export const photoSchema = z.object({
  url: mediaUrl.min(1, "Chưa có ảnh"),
  alt: text(120),
});

export const giftAccountSchema = z.object({
  /** Tiêu đề hiển thị, vd "Chú rể", "Cô dâu" */
  label: text(60),
  /** Mã BIN ngân hàng theo chuẩn VietQR, vd 970436 (Vietcombank) */
  bankBin: text(10),
  bankName: text(80),
  accountNumber: text(30),
  accountName: text(80),
  /** Ảnh QR tự upload; nếu có sẽ dùng thay QR VietQR tự sinh */
  qrImage: mediaUrl,
});

export const scheduleItemSchema = z.object({
  time: timeStr,
  label: required(80),
});

export const invitationDataSchema = z.object({
  theme: z.object({
    primary: hex,
    primaryDark: hex,
    cream: hex,
    paper: hex,
    gold: hex,
  }),
  assets: z.object({
    /** Màu (#RRGGBB) hoặc đường dẫn ảnh nền */
    backgroundArt: mediaUrl,
    /** Nhánh hoa trang trí dọc hai bên */
    flowerDecor: mediaUrl,
    /** Hoa nhỏ ở góc card bìa */
    cornerFlower: mediaUrl,
    coverEnvelope: mediaUrl,
    loveStoryBg: mediaUrl,
    ceremonyImage: mediaUrl,
    partyBg: mediaUrl,
  }),
  cover: z.object({
    greeting: text(60),
    buttonText: required(30),
  }),
  hero: z.object({
    label: text(40),
    photo: mediaUrl,
  }),
  groom: personSchema,
  bride: personSchema,
  ceremony: z.object({
    title: text(60),
    announcement: text(120),
    heading: text(80),
    venue: text(120),
    date: dateStr,
    time: timeStr,
    lunarOverride: text(80),
  }),
  album: z.object({
    enabled: z.boolean(),
    title: text(40),
    photos: z.array(photoSchema).max(30),
  }),
  party: z.object({
    title: text(60),
    heading: text(80),
    date: dateStr,
    time: timeStr,
    welcomeTime: z.union([timeStr, z.literal("")]),
    startTime: z.union([timeStr, z.literal("")]),
    lunarOverride: text(80),
    venueTitle: text(60),
    venueName: text(120),
    address: text(200),
    /** Từ khoá tìm trên Google Maps; để trống sẽ dùng "venueName, address" */
    mapQuery: text(200),
  }),
  dressCode: z.object({
    enabled: z.boolean(),
    title: text(40),
    subtitle: text(80),
    colors: z.array(hex).max(8),
  }),
  schedule: z.object({
    enabled: z.boolean(),
    title: text(60),
    items: z.array(scheduleItemSchema).max(12),
  }),
  rsvp: z.object({
    enabled: z.boolean(),
    buttonText: text(40),
  }),
  guestbook: z.object({
    enabled: z.boolean(),
    title: text(40),
  }),
  gift: z.object({
    enabled: z.boolean(),
    title: text(40),
    accounts: z.array(giftAccountSchema).max(4),
  }),
  music: z.object({
    enabled: z.boolean(),
    url: mediaUrl,
  }),
  autoScroll: z.boolean(),
  footer: z.object({
    message: text(200),
  }),
  seo: z.object({
    title: text(120),
    description: text(300),
    ogImage: mediaUrl,
  }),
});

export type Person = z.infer<typeof personSchema>;
export type Photo = z.infer<typeof photoSchema>;
export type GiftAccount = z.infer<typeof giftAccountSchema>;
export type ScheduleItem = z.infer<typeof scheduleItemSchema>;
export type InvitationData = z.infer<typeof invitationDataSchema>;

/** Bản ghi thiệp trong DB */
export interface Invitation {
  id: string;
  slug: string;
  title: string;
  data: InvitationData;
  published: boolean;
  created_at: string;
  updated_at: string;
}
