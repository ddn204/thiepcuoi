/** Slug không dấu cho link thiệp, vd "Minh Quân & Thu Trang" → "minh-quan-thu-trang" */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '')
}

/** Đường dẫn đã dùng cho trang khác, không đặt làm slug thiệp */
export const RESERVED_SLUGS = ['admin', 'demo', 'api', 'assets', 'decor', 'placeholders']

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

export function validateSlug(slug: string): string | null {
  if (slug.length < 3) return 'Đường dẫn tối thiểu 3 ký tự'
  if (slug.length > 60) return 'Đường dẫn tối đa 60 ký tự'
  if (!SLUG_PATTERN.test(slug)) return 'Chỉ dùng chữ thường không dấu, số và dấu gạch ngang'
  if (RESERVED_SLUGS.includes(slug)) return 'Đường dẫn này đã được dùng cho hệ thống'
  return null
}
