type PlainObject = Record<string, unknown>

const isPlainObject = (value: unknown): value is PlainObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Gộp sâu `override` vào `base`. Mảng và giá trị nguyên thuỷ của `override` thay thế hẳn.
 * Dùng để bù các trường mới (có trong dữ liệu mặc định) cho thiệp cũ đã lưu trong DB.
 */
export function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override === undefined ? base : override) as T
  }
  const result: PlainObject = { ...base }
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue
    result[key] = isPlainObject(result[key]) && isPlainObject(value) ? deepMerge(result[key], value) : value
  }
  return result as T
}
