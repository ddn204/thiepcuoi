import { deepMerge } from '@/lib/merge'
import { invitationDataSchema, type InvitationData } from '@/types/invitation'

/** Nội dung mẫu cho thiệp mới. Ảnh mẫu là placeholder trong /public/placeholders. */
export const defaultInvitation: InvitationData = {
  theme: {
    primary: '#511419',
    primaryDark: '#3a0d11',
    cream: '#ece4d8',
    paper: '#f7efe6',
    gold: '#c9a24a',
  },
  assets: {
    backgroundArt: '/decor/arches.svg',
    flowerDecor: '/decor/flower-branch.svg',
    cornerFlower: '/decor/flower-corner.svg',
  },
  cover: {
    greeting: 'Thân mời',
    buttonText: 'Mở thiệp',
  },
  hero: {
    label: 'Save The Date',
    photo: '/placeholders/photo-1.svg',
  },
  groom: {
    fullName: 'Nguyễn Minh Quân',
    shortName: 'Minh Quân',
    role: 'Trưởng nam',
    father: 'Nguyễn Văn Hùng',
    mother: 'Lê Thị Lan',
    address: 'Quận Hải Châu, TP. Đà Nẵng',
  },
  bride: {
    fullName: 'Trần Thu Trang',
    shortName: 'Thu Trang',
    role: 'Thứ nữ',
    father: 'Trần Quốc Bảo',
    mother: 'Phạm Thị Hoa',
    address: 'Quận Sơn Trà, TP. Đà Nẵng',
  },
  ceremony: {
    title: 'Thông tin lễ cưới',
    announcement: 'Trân trọng báo tin\nLễ thành hôn của con chúng tôi',
    heading: 'Lễ thành hôn được cử hành tại',
    venue: 'Tư gia nhà trai',
    date: '2026-12-19',
    time: '09:00',
    lunarOverride: '',
  },
  album: {
    enabled: true,
    title: 'Album ảnh',
    photos: [1, 2, 3, 4, 5].map((n) => ({ url: `/placeholders/photo-${n}.svg`, alt: `Ảnh cưới ${n}` })),
  },
  party: {
    title: 'Thông tin tiệc cưới',
    heading: 'Tiệc cưới sẽ diễn ra vào lúc:',
    date: '2026-12-19',
    time: '18:00',
    welcomeTime: '17:30',
    startTime: '18:00',
    lunarOverride: '',
    venueTitle: 'Tiệc cưới sẽ tổ chức tại',
    venueName: 'Trung tâm Tiệc cưới Hoa Sen',
    address: '123 Đường Bạch Đằng, Quận Hải Châu, TP. Đà Nẵng',
    mapQuery: '',
  },
  dressCode: {
    enabled: true,
    title: 'Dress code',
    subtitle: 'Trang phục dự tiệc',
    colors: ['#511419', '#8c3a44', '#c9a24a', '#ece4d8'],
  },
  schedule: {
    enabled: true,
    title: 'Lịch trình ngày cưới',
    items: [
      { time: '17:30', label: 'Đón khách' },
      { time: '18:00', label: 'Khai tiệc' },
      { time: '18:30', label: 'Nghi thức cưới' },
      { time: '19:00', label: 'Cắt bánh & nâng ly' },
      { time: '20:30', label: 'Kết thúc tiệc' },
    ],
  },
  rsvp: {
    enabled: true,
    buttonText: 'Xác nhận tham dự',
  },
  guestbook: {
    enabled: true,
    title: 'Sổ lưu bút',
  },
  gift: {
    enabled: true,
    title: 'Hộp quà mừng',
    accounts: [
      {
        label: 'Chú rể',
        bankBin: '970436',
        bankName: 'Vietcombank',
        accountNumber: '0123456789',
        accountName: 'NGUYEN MINH QUAN',
        qrImage: '',
      },
      {
        label: 'Cô dâu',
        bankBin: '970407',
        bankName: 'Techcombank',
        accountNumber: '1903456789',
        accountName: 'TRAN THU TRANG',
        qrImage: '',
      },
    ],
  },
  music: {
    enabled: false,
    url: '',
  },
  autoScroll: true,
  footer: {
    message: 'Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!',
  },
  seo: {
    title: '',
    description: '',
    ogImage: '',
  },
}

/** Chuẩn hoá dữ liệu thiệp đọc từ DB: bù trường thiếu bằng dữ liệu mặc định rồi validate. */
export function normalizeInvitationData(raw: unknown): InvitationData {
  const merged = deepMerge(defaultInvitation, raw)
  const parsed = invitationDataSchema.safeParse(merged)
  return parsed.success ? parsed.data : merged
}
