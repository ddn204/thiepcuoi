import { formatLunarDate } from '@/lib/lunar'
import { parseIsoDate, pad2, weekdayName } from '@/lib/date'

interface EventDateBlockProps {
  date: string
  time: string
  lunarOverride?: string
  /** Ẩn "Vào lúc …" khi giờ đã hiển thị riêng phía trên */
  showTime?: boolean
}

/** Khối "VÀO LÚC 09:00 | THỨ BẢY — 03 | THÁNG 01 / 2026 — (TỨC NGÀY …)" */
export function EventDateBlock({ date, time, lunarOverride, showTime = true }: EventDateBlockProps) {
  const parts = parseIsoDate(date)
  if (!parts) return null
  const lunar = lunarOverride?.trim() || formatLunarDate(date)

  return (
    <div className="text-center uppercase">
      <div className="flex items-center justify-center gap-8 font-serif text-lg">
        {showTime && <span>Vào lúc {time}</span>}
        <span>{weekdayName(date)}</span>
      </div>
      <div className="mt-3 flex items-center justify-center gap-5">
        <span className="font-display text-6xl leading-none">{pad2(parts.day)}</span>
        <span className="h-16 w-px bg-current opacity-40" />
        <span className="text-left font-serif text-lg leading-8">
          Tháng {pad2(parts.month)}
          <br />
          {parts.year}
        </span>
      </div>
      {lunar && <p className="mt-3 font-serif text-sm tracking-[0.2em]">(Tức {lunar})</p>}
    </div>
  )
}
