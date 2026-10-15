import { deepMerge } from "@/lib/merge";
import { invitationDataSchema, type InvitationData } from "@/types/invitation";

/** Nội dung mẫu cho thiệp mới. Ảnh mẫu là placeholder trong /public/placeholders. */
export const defaultInvitation: InvitationData = {
  theme: {
    primary: "#511419",
    primaryDark: "#3a0d11",
    cream: "#ece4d8",
    paper: "#ece4d8",
    gold: "#c9a24a",
  },
  assets: {
    // Màu đỏ solid toàn trang
    backgroundArt: "#511419",
    flowerDecor: "",
    cornerFlower: "",
    coverEnvelope: "/decor/thip moi.svg",
    loveStoryBg: "/decor/our-love-story.jpg",
    ceremonyImage: "/decor/le-vu-quy.svg",
    partyBg: "/decor/thongtintieccuoi.svg",
  },
  cover: {
    greeting: "Thân mời",
    buttonText: "Mở thiệp",
  },
  hero: {
    label: "- SAVE THE DATE -",
    photo: "/decor/bg.png",
  },
  groom: {
    fullName: "Chu Huy",
    shortName: "Chu Huy",
    role: "Út nam",
    father: "Ông CHU QUANG VỸ",
    mother: "Bà DIỆU THỊ TRÀ",
    address: "Khu 7, Thôn Tiên Phong, Xã Quảng Oai, TP. Hà Nội",
  },
  bride: {
    fullName: "Trang Dung",
    shortName: "Trang Dung",
    role: "Trưởng nữ",
    father: "Ông CẤU ĐỨC LONG",
    mother: "Bà HOÀNG MAI NGOAN",
    address: "Khu 7, Thôn Tiên Phong, Xã Quảng Oai, TP. Hà Nội",
  },
  ceremony: {
    title: "LỄ VU QUY",
    announcement: "TRÂN TRỌNG BÁO TIN\nLỄ VU QUY CỦA CHÚNG MÌNH",
    heading: "LỄ VU QUY ĐƯỢC CỬ HÀNH TẠI",
    venue: "TƯ GIA NHÀ GÁI",
    date: "2026-10-25",
    time: "07:30",
    lunarOverride: "Tức ngày 15 tháng 9 năm Bính Ngọ",
  },
  album: {
    enabled: true,
    title: "Album ảnh",
    photos: [1, 2, 3, 4, 5, 6].map((n) => ({
      url: `/placeholders/anh${n}.jpg`,
      alt: `Ảnh cưới ${n}`,
    })),
  },
  party: {
    title: "THÔNG TIN TIỆC CƯỚI",
    heading: "TIỆC CƯỚI DIỄN RA VÀO LÚC",
    date: "2026-10-24",
    time: "16:30",
    welcomeTime: "",
    startTime: "",
    lunarOverride: "Tức ngày 13 tháng 9 năm Bính Ngọ",
    venueTitle: "TIỆC CƯỚI SẼ ĐƯỢC TỔ CHỨC TẠI",
    venueName: "Nhà Văn hóa Thôn Vị Nhất",
    address: "Khu 7, Thôn Tiên Phong, Xã Quảng Oai, TP. Hà Nội",
    mapQuery: "nhà văn hoá khu 7 thôn vị nhuế, Quảng Oai, Hà Nội, Việt Nam",
  },
  dressCode: {
    enabled: false,
    title: "Dress code",
    subtitle: "Trang phục dự tiệc",
    colors: ["#511419", "#8c3a44", "#c9a24a", "#ece4d8"],
  },
  schedule: {
    enabled: false,
    title: "Lịch trình ngày cưới",
    items: [
      { time: "16:30", label: "Đón khách" },
      { time: "17:00", label: "Khai tiệc" },
    ],
  },
  rsvp: {
    enabled: true,
    buttonText: "Xác nhận tham dự",
  },
  guestbook: {
    enabled: true,
    title: "Sổ lưu bút",
  },
  gift: {
    enabled: true,
    title: "Lì xì mừng",
    accounts: [
      {
        label: "Chú rể",
        bankBin: "",
        bankName: "TP Bank",
        accountNumber: "10005283195",
        accountName: "CHU QUANG HUY",
        qrImage: "/decor/qr-chu-re.jpg",
      },
      {
        label: "Cô dâu",
        bankBin: "",
        bankName: "MB Bank",
        accountNumber: "0379591256",
        accountName: "CAN THI DUNG",
        qrImage: "/decor/qr-co-dau.jpg",
      },
    ],
  },
  music: {
    enabled: true,
    url: "/music/Happy Ending.mp3", // path trong public
  },
  autoScroll: true,
  footer: {
    message:
      "Cảm ơn bạn đã dành tình cảm cho chúng mình! Sự hiện diện của bạn chính là món quà ý nghĩa nhất, và chúng mình vô cùng trân quý khi được cùng bạn chia sẻ niềm hạnh phúc trong ngày trọng đại này.",
  },
  seo: {
    title: "Trang Dung & Chu Huy | 25.10.2026",
    description: "Thiệp mời lễ vu quy & tiệc cưới Trang Dung và Chu Huy",
    ogImage: "",
  },
};

/** Chuẩn hoá dữ liệu thiệp đọc từ DB: bù trường thiếu bằng dữ liệu mặc định rồi validate. */
export function normalizeInvitationData(raw: unknown): InvitationData {
  const merged = deepMerge(defaultInvitation, raw);
  const parsed = invitationDataSchema.safeParse(merged);
  return parsed.success ? parsed.data : merged;
}
