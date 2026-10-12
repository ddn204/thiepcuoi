import { toast } from 'sonner'

export const invitationUrl = (slug: string) => `${window.location.origin}/${slug}`

/** Link thiệp riêng cho từng khách: trang thiệp đọc `?g=` để hiện "Thân mời {tên}" */
export const guestInvitationUrl = (slug: string, code: string) => `${invitationUrl(slug)}?g=${code}`

export async function copyText(text: string, message = 'Đã sao chép') {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(message)
  } catch {
    toast.error('Không sao chép được')
  }
}
