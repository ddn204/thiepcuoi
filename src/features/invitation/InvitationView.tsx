import { useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import type { InvitationData } from '@/types/invitation'
import { AlbumCarousel } from './sections/AlbumCarousel'
import { CeremonyInfo } from './sections/CeremonyInfo'
import { CoverScreen } from './sections/CoverScreen'
import { HeroHeader } from './sections/HeroHeader'
import { PartyInfo } from './sections/PartyInfo'
import { VenueMap } from './sections/VenueMap'

export type InvitationMode = 'live' | 'preview'

interface InvitationViewProps {
  data: InvitationData
  /** Tên khách mời hiển thị trên bìa ("Thân mời …") */
  guestName?: string
  /** id thiệp trong DB; không có thì lưu bút / RSVP chạy ở chế độ xem thử */
  invitationId?: string
  mode?: InvitationMode
  showCover?: boolean
}

function themeVars(theme: InvitationData['theme']): React.CSSProperties {
  return {
    '--inv-primary': theme.primary,
    '--inv-primary-dark': theme.primaryDark,
    '--inv-cream': theme.cream,
    '--inv-paper': theme.paper,
    '--inv-gold': theme.gold,
  } as React.CSSProperties
}

export function InvitationView({ data, guestName, mode = 'live', showCover = true }: InvitationViewProps) {
  const [opened, setOpened] = useState(!showCover)

  useEffect(() => setOpened(!showCover), [showCover])

  // Khoá cuộn trang khi đang ở màn bìa (chỉ trang public)
  useEffect(() => {
    if (mode !== 'live' || opened) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [mode, opened])

  return (
    <div style={themeVars(data.theme)} className="paper-bg min-h-full w-full font-body text-wine [font-variant-numeric:lining-nums]">
      <main className="relative isolate mx-auto w-full max-w-[480px] overflow-hidden">
        {data.assets.backgroundArt && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-repeat-y opacity-[0.06]"
            style={{ backgroundImage: `url(${data.assets.backgroundArt})`, backgroundSize: '100% auto' }}
          />
        )}
        <HeroHeader data={data} />
        <CeremonyInfo data={data} />
        <AlbumCarousel data={data} />
        <PartyInfo data={data} />
        <VenueMap data={data} />
        <div className="h-24" />
      </main>

      <AnimatePresence>
        {!opened && <CoverScreen data={data} guestName={guestName} onOpen={() => setOpened(true)} />}
      </AnimatePresence>
    </div>
  )
}
