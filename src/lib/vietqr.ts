import type { GiftAccount } from '@/types/invitation'

export interface Bank {
  bin: string
  shortName: string
  name: string
}

/** Danh sách ngân hàng phổ biến (fallback khi không gọi được API VietQR) */
export const COMMON_BANKS: Bank[] = [
  { bin: '970436', shortName: 'Vietcombank', name: 'Ngân hàng TMCP Ngoại Thương Việt Nam' },
  { bin: '970407', shortName: 'Techcombank', name: 'Ngân hàng TMCP Kỹ thương Việt Nam' },
  { bin: '970418', shortName: 'BIDV', name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam' },
  { bin: '970415', shortName: 'VietinBank', name: 'Ngân hàng TMCP Công thương Việt Nam' },
  { bin: '970405', shortName: 'Agribank', name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam' },
  { bin: '970422', shortName: 'MBBank', name: 'Ngân hàng TMCP Quân đội' },
  { bin: '970416', shortName: 'ACB', name: 'Ngân hàng TMCP Á Châu' },
  { bin: '970432', shortName: 'VPBank', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng' },
  { bin: '970423', shortName: 'TPBank', name: 'Ngân hàng TMCP Tiên Phong' },
  { bin: '970403', shortName: 'Sacombank', name: 'Ngân hàng TMCP Sài Gòn Thương Tín' },
  { bin: '970441', shortName: 'VIB', name: 'Ngân hàng TMCP Quốc tế Việt Nam' },
  { bin: '970437', shortName: 'HDBank', name: 'Ngân hàng TMCP Phát triển TP. Hồ Chí Minh' },
  { bin: '970443', shortName: 'SHB', name: 'Ngân hàng TMCP Sài Gòn - Hà Nội' },
  { bin: '970426', shortName: 'MSB', name: 'Ngân hàng TMCP Hàng Hải' },
  { bin: '970448', shortName: 'OCB', name: 'Ngân hàng TMCP Phương Đông' },
  { bin: '970440', shortName: 'SeABank', name: 'Ngân hàng TMCP Đông Nam Á' },
  { bin: '970431', shortName: 'Eximbank', name: 'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam' },
  { bin: '970449', shortName: 'LPBank', name: 'Ngân hàng TMCP Lộc Phát Việt Nam' },
]

/** Lấy danh sách ngân hàng đầy đủ từ VietQR, lỗi thì trả về danh sách phổ biến. */
export async function fetchBanks(signal?: AbortSignal): Promise<Bank[]> {
  try {
    const res = await fetch('https://api.vietqr.io/v2/banks', { signal })
    if (!res.ok) return COMMON_BANKS
    const json = (await res.json()) as { data?: { bin: string; shortName: string; name: string }[] }
    if (!json.data?.length) return COMMON_BANKS
    return json.data.map(({ bin, shortName, name }) => ({ bin, shortName, name }))
  } catch {
    return COMMON_BANKS
  }
}

/** URL ảnh QR chuyển khoản. Ưu tiên ảnh QR tự upload, nếu không thì sinh qua img.vietqr.io. */
export function giftQrUrl(account: GiftAccount): string {
  if (account.qrImage) return account.qrImage
  if (!account.bankBin || !account.accountNumber) return ''
  const params = new URLSearchParams()
  if (account.accountName) params.set('accountName', account.accountName)
  const query = params.toString()
  const base = `https://img.vietqr.io/image/${encodeURIComponent(account.bankBin)}-${encodeURIComponent(account.accountNumber)}-qr_only.png`
  return query ? `${base}?${query}` : base
}
