import { describe, expect, it } from 'vitest'
import { csvCell, toCsv } from './csv'

describe('csv', () => {
  it('giữ nguyên ô thường, bỏ trống null', () => {
    expect(csvCell('Anh Minh')).toBe('Anh Minh')
    expect(csvCell(3)).toBe('3')
    expect(csvCell(null)).toBe('')
  })

  it('bọc nháy kép khi có dấu phẩy, nháy, xuống dòng', () => {
    expect(csvCell('Minh, Trang')).toBe('"Minh, Trang"')
    expect(csvCell('Chúc "mừng"')).toBe('"Chúc ""mừng"""')
    expect(csvCell('dòng 1\ndòng 2')).toBe('"dòng 1\ndòng 2"')
  })

  it('chặn công thức Excel', () => {
    expect(csvCell('=HYPERLINK("x")')).toBe(`"'=HYPERLINK(""x"")"`)
    expect(csvCell('+84 912')).toBe("'+84 912")
    expect(csvCell('-1')).toBe("'-1")
  })

  it('có BOM và xuống dòng CRLF', () => {
    expect(toCsv([['Tên', 'Số người'], ['Minh', 2]])).toBe('﻿Tên,Số người\r\nMinh,2')
  })
})
