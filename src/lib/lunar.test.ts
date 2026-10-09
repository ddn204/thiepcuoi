import { describe, expect, it } from 'vitest'
import { canChiYear, formatLunarDate, solarToLunar } from './lunar'

describe('solarToLunar', () => {
  it('03/01/2026 là ngày 15 tháng 11 năm Ất Tỵ', () => {
    expect(solarToLunar(3, 1, 2026)).toEqual({ day: 15, month: 11, year: 2025, leap: false })
  })

  it.each([
    [10, 2, 2024],
    [29, 1, 2025],
    [17, 2, 2026],
  ])('Tết Nguyên Đán %i/%i/%i là mùng 1 tháng 1', (d, m, y) => {
    expect(solarToLunar(d, m, y)).toEqual({ day: 1, month: 1, year: y, leap: false })
  })
})

describe('canChiYear', () => {
  it.each([
    [2024, 'Giáp Thìn'],
    [2025, 'Ất Tỵ'],
    [2026, 'Bính Ngọ'],
  ])('%i → %s', (year, name) => {
    expect(canChiYear(year)).toBe(name)
  })
})

describe('formatLunarDate', () => {
  it('định dạng chuỗi hiển thị', () => {
    expect(formatLunarDate('2026-01-03')).toBe('ngày 15 tháng 11 năm Ất Tỵ')
  })

  it('trả về chuỗi rỗng khi ngày không hợp lệ', () => {
    expect(formatLunarDate('')).toBe('')
  })
})
