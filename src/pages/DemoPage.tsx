import { useSearchParams } from 'react-router'
import { defaultInvitation } from '@/data/default-invitation'
import { InvitationView } from '@/features/invitation/InvitationView'

/** Thiệp mẫu với dữ liệu mặc định, không cần DB. */
export default function DemoPage() {
  const [params] = useSearchParams()
  return (
    <InvitationView
      data={defaultInvitation}
      guestName={params.get('khach') ?? undefined}
      showCover={params.get('open') !== '1'}
    />
  )
}
