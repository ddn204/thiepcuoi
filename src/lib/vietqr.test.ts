import { describe, expect, it } from 'vitest'
import { giftQrUrl } from './vietqr'

const account = {
  label: 'Chú rể',
  bankBin: '970436',
  bankName: 'Vietcombank',
  accountNumber: '0123456789',
  accountName: 'NGUYEN MINH QUAN',
  qrImage: '',
}

describe('giftQrUrl', () => {
  it('sinh URL VietQR từ BIN + số tài khoản', () => {
    expect(giftQrUrl(account)).toBe(
      'https://img.vietqr.io/image/970436-0123456789-qr_only.png?accountName=NGUYEN+MINH+QUAN',
    )
  })

  it('ưu tiên ảnh QR tự upload', () => {
    expect(giftQrUrl({ ...account, qrImage: 'https://cdn/qr.png' })).toBe('https://cdn/qr.png')
  })

  it('trả về rỗng khi thiếu số tài khoản', () => {
    expect(giftQrUrl({ ...account, accountNumber: '' })).toBe('')
  })
})
