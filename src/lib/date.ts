/** Tiện ích ngày giờ cho thiệp. Ngày lưu dạng "YYYY-MM-DD", giờ "HH:mm", hiểu theo giờ Việt Nam. */

const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']

export interface DateParts {
  year: number
  month: number
  day: number
}

export function parseIsoDate(isoDate: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  if (!match) return null
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) }
}

/** 0 = Chủ nhật … 6 = Thứ bảy (không phụ thuộc múi giờ máy) */
export function weekdayIndex({ year, month, day }: DateParts): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

export function weekdayName(isoDate: string): string {
  const parts = parseIsoDate(isoDate)
  return parts ? WEEKDAYS[weekdayIndex(parts)] : ''
}

/** "2026-01-03" → "3 tháng 1, 2026" */
export function formatLongDate(isoDate: string): string {
  const parts = parseIsoDate(isoDate)
  if (!parts) return ''
  return `${parts.day} tháng ${parts.month}, ${parts.year}`
}

export const pad2 = (n: number) => String(n).padStart(2, '0')

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}
