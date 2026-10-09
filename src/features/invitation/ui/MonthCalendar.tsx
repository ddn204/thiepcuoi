import { daysInMonth, parseIsoDate, weekdayIndex } from '@/lib/date'
import { HeartShape } from './HeartShape'

const WEEK_HEADER = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

/** Lịch tháng của ngày cưới, ngày cưới đánh dấu bằng trái tim. */
export function MonthCalendar({ date }: { date: string }) {
  const parts = parseIsoDate(date)
  if (!parts) return null

  const { year, month, day } = parts
  // Tuần bắt đầu từ thứ Hai: CN (0) → cột cuối
  const firstWeekday = (weekdayIndex({ year, month, day: 1 }) + 6) % 7
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1),
  ]

  return (
    <div className="rounded-2xl bg-cream px-5 pt-6 pb-5 text-wine">
      <p className="text-center font-script text-4xl">
        Tháng {month} / {year}
      </p>
      <div className="mt-4 grid grid-cols-7 border-y border-wine/20 border-b-wine py-2 text-center font-serif text-sm opacity-80 [border-bottom-width:2px]">
        {WEEK_HEADER.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-y-2 text-center font-serif text-lg">
        {cells.map((value, index) =>
          value === day ? (
            <span key={index} className="relative flex h-8 items-center justify-center font-bold text-cream">
              <HeartShape className="absolute size-9 text-wine" />
              <span className="relative text-sm">{value}</span>
            </span>
          ) : (
            <span key={index} className="flex h-8 items-center justify-center">
              {value}
            </span>
          ),
        )}
      </div>
    </div>
  )
}
