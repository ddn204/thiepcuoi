import { describe, expect, it } from 'vitest'
import { invitationDataSchema } from '@/types/invitation'
import { defaultInvitation, normalizeInvitationData } from './default-invitation'

describe('defaultInvitation', () => {
  it('hợp lệ theo schema', () => {
    expect(invitationDataSchema.safeParse(defaultInvitation).success).toBe(true)
  })
})

describe('normalizeInvitationData', () => {
  it('bù trường thiếu từ dữ liệu mặc định, giữ giá trị đã lưu', () => {
    const data = normalizeInvitationData({ groom: { shortName: 'Tuấn' }, album: { photos: [] } })
    expect(data.groom.shortName).toBe('Tuấn')
    expect(data.groom.fullName).toBe(defaultInvitation.groom.fullName)
    expect(data.album.photos).toEqual([])
    expect(data.theme).toEqual(defaultInvitation.theme)
  })
})
