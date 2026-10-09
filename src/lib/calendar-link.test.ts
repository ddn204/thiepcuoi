import { describe, expect, it } from 'vitest'
import { googleCalendarUrl, icsContent } from './calendar-link'

const event = { title: 'Đám cưới', date: '2026-01-03', time: '18:00', location: 'Đà Nẵng' }

describe('googleCalendarUrl', () => {
  it('đổi giờ Việt Nam sang UTC, mặc định kéo dài 3 tiếng', () => {
    const url = new URL(googleCalendarUrl(event))
    expect(url.searchParams.get('dates')).toBe('20260103T110000Z/20260103T140000Z')
    expect(url.searchParams.get('text')).toBe('Đám cưới')
    expect(url.searchParams.get('location')).toBe('Đà Nẵng')
  })

  it('xử lý giờ sáng sớm lùi sang ngày hôm trước theo UTC', () => {
    const url = new URL(googleCalendarUrl({ ...event, time: '06:00', durationHours: 1 }))
    expect(url.searchParams.get('dates')).toBe('20260102T230000Z/20260103T000000Z')
  })
})

describe('icsContent', () => {
  it('có DTSTART/DTEND và escape dấu phẩy', () => {
    const ics = icsContent({ ...event, location: '123 Bạch Đằng, Đà Nẵng' })
    expect(ics).toContain('DTSTART:20260103T110000Z')
    expect(ics).toContain('DTEND:20260103T140000Z')
    expect(ics).toContain('LOCATION:123 Bạch Đằng\\, Đà Nẵng')
  })
})
