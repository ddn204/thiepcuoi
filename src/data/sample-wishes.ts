import type { PublicWish } from '@/features/invitation/api'
import { WISH_SUGGESTIONS } from './wish-suggestions'

const SAMPLE_NAMES = ['Hải Yến', 'Đức Anh', 'Mai Phương', 'Quốc Việt', 'Ngọc Hân', 'Thành Đạt']

/** Lời chúc mẫu cho thiệp demo / preview (không lưu DB). */
export const SAMPLE_WISHES: PublicWish[] = SAMPLE_NAMES.map((name, index) => ({
  id: `sample-${index}`,
  name,
  message: WISH_SUGGESTIONS[index % WISH_SUGGESTIONS.length],
  created_at: new Date(Date.UTC(2026, 9, 1, 3 + index, 15)).toISOString(),
}))
