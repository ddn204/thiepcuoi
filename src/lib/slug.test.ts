import { describe, expect, it } from 'vitest'
import { slugify, validateSlug } from './slug'

describe('slugify', () => {
  it('bỏ dấu tiếng Việt và ký tự đặc biệt', () => {
    expect(slugify('Minh Quân & Thu Trang')).toBe('minh-quan-thu-trang')
    expect(slugify('  Đức Đạt -- Hồng Nhung!! ')).toBe('duc-dat-hong-nhung')
  })
})

describe('validateSlug', () => {
  it('chấp nhận slug hợp lệ', () => {
    expect(validateSlug('minh-quan-thu-trang')).toBeNull()
  })

  it.each(['ab', 'Có-Dấu', 'a--b', '-abc', 'admin'])('từ chối "%s"', (slug) => {
    expect(validateSlug(slug)).not.toBeNull()
  })
})
