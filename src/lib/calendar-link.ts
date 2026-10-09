import { pad2, parseIsoDate } from './date'

const VN_OFFSET_HOURS = 7

export interface CalendarEvent {
  title: string
  /** "YYYY-MM-DD" theo giờ Việt Nam */
  date: string
  /** "HH:mm" theo giờ Việt Nam */
  time: string
  durationHours?: number
  location?: string
  details?: string
}

/** Đổi ngày giờ VN sang chuỗi UTC dạng 20260103T110000Z */
function toUtcStamp(date: string, time: string, addHours = 0): string {
  const parts = parseIsoDate(date)
  const [hh, mm] = time.split(':').map(Number)
  if (!parts || Number.isNaN(hh) || Number.isNaN(mm)) return ''
  const d = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, hh - VN_OFFSET_HOURS + addHours, mm))
  return (
    `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}` +
    `T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}00Z`
  )
}

export function googleCalendarUrl(event: CalendarEvent): string {
  const start = toUtcStamp(event.date, event.time)
  const end = toUtcStamp(event.date, event.time, event.durationHours ?? 3)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    ctz: 'Asia/Ho_Chi_Minh',
  })
  if (event.details) params.set('details', event.details)
  if (event.location) params.set('location', event.location)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

const escapeIcs = (value: string) => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1')

export function icsContent(event: CalendarEvent): string {
  const start = toUtcStamp(event.date, event.time)
  const end = toUtcStamp(event.date, event.time, event.durationHours ?? 3)
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//thiepcuoi//VI',
    'BEGIN:VEVENT',
    `UID:${start}-${Math.random().toString(36).slice(2)}@thiepcuoi`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    event.location ? `LOCATION:${escapeIcs(event.location)}` : '',
    event.details ? `DESCRIPTION:${escapeIcs(event.details)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n')
}

export function mapEmbedUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
}

export function mapDirectionsUrl(query: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`
}
