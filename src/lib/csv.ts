export type CsvValue = string | number | boolean | null | undefined

/**
 * Một ô CSV: bọc nháy kép khi cần, và thêm `'` trước ô bắt đầu bằng = + - @
 * để Excel không hiểu là công thức (tên/lời chúc do khách tự nhập).
 */
export function csvCell(value: CsvValue): string {
  let text = value == null ? '' : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

/** Ghép bảng thành CSV có BOM để Excel mở đúng tiếng Việt. */
export function toCsv(rows: CsvValue[][]): string {
  return '﻿' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n')
}

export function downloadCsv(fileName: string, rows: CsvValue[][]) {
  const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
