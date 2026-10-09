import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { useGuest, usePublishedInvitation } from '@/features/invitation/api'
import { InvitationView } from '@/features/invitation/InvitationView'
import { HeartShape } from '@/features/invitation/ui/HeartShape'
import NotFoundPage from './NotFoundPage'

function LoadingScreen() {
  return (
    <div className="paper-bg flex min-h-dvh items-center justify-center text-wine">
      <HeartShape className="size-10 animate-pulse" />
    </div>
  )
}

/** Trang thiệp công khai: /:slug?g=<mã khách> hoặc /:slug?khach=<Tên> */
export default function PublicInvitationPage() {
  const { slug = '' } = useParams()
  const [params] = useSearchParams()
  const guestCode = params.get('g')
  const invitationQuery = usePublishedInvitation(slug)
  const guestQuery = useGuest(slug, guestCode)
  const invitation = invitationQuery.data

  const guestName = guestQuery.data?.display_name ?? params.get('khach')?.trim().slice(0, 80) ?? undefined

  useEffect(() => {
    if (!invitation) return
    const { seo, groom, bride } = invitation.data
    document.title = seo.title || `Thiệp cưới ${groom.shortName} & ${bride.shortName}`
  }, [invitation])

  if (invitationQuery.isPending || (guestCode && guestQuery.isPending)) return <LoadingScreen />
  if (invitationQuery.isError) return <NotFoundPage message="Không tải được thiệp, vui lòng thử lại sau." />
  if (!invitation) return <NotFoundPage />

  return (
    <InvitationView
      data={invitation.data}
      invitationId={invitation.id}
      guestId={guestQuery.data?.id}
      guestName={guestName}
    />
  )
}
