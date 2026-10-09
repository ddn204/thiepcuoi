import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import type { InvitationData } from '@/types/invitation'
import { InvitationRuntimeContext } from './invitation-context'
import { MusicPlayer } from './overlays/MusicPlayer'
import { RsvpDialog } from './overlays/RsvpDialog'
import { useAutoScroll } from './overlays/useAutoScroll'
import { useScrollContainer } from './scroll-container'
import { AlbumCarousel } from './sections/AlbumCarousel'
import { CeremonyInfo } from './sections/CeremonyInfo'
import { CoverScreen } from './sections/CoverScreen'
import { DressCode } from './sections/DressCode'
import { Footer } from './sections/Footer'
import { Guestbook } from './sections/Guestbook'
import { HeroHeader } from './sections/HeroHeader'
import { PartyInfo } from './sections/PartyInfo'
import { Schedule } from './sections/Schedule'
import { VenueMap } from './sections/VenueMap'

export type InvitationMode = 'live' | 'preview'

interface InvitationViewProps {
  data: InvitationData
  /** Tên khách mời hiển thị trên bìa ("Thân mời …") */
  guestName?: string
  /** id thiệp trong DB; không có thì lưu bút / RSVP chạy ở chế độ xem thử */
  invitationId?: string
  /** id khách mời (link cá nhân hoá) để gắn vào RSVP */
  guestId?: string
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

export function InvitationView({
  data,
  guestName,
  invitationId,
  guestId,
  mode = 'live',
  showCover = true,
}: InvitationViewProps) {
  const [opened, setOpened] = useState(!showCover)
  const [playing, setPlaying] = useState(false)
  const [rsvpOpen, setRsvpOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const scroller = useScrollContainer()
  const hasMusic = data.music.enabled && Boolean(data.music.url)

  useEffect(() => setOpened(!showCover), [showCover])

  // Dialog / bottom sheet render qua portal ra ngoài thiệp → đặt màu thiệp lên <html> ở trang public
  useEffect(() => {
    if (mode !== 'live') return
    const root = document.documentElement
    const vars = Object.entries(themeVars(data.theme)) as [string, string][]
    vars.forEach(([name, value]) => root.style.setProperty(name, value))
    return () => vars.forEach(([name]) => root.style.removeProperty(name))
  }, [mode, data.theme])

  const runtime = useMemo(() => ({ invitationId, guestId, guestName, mode }), [invitationId, guestId, guestName, mode])

  useAutoScroll(mode === 'live' && opened && showCover && data.autoScroll, scroller)

  const playMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) playMusic()
    else {
      audio.pause()
      setPlaying(false)
    }
  }

  const handleOpen = () => {
    setOpened(true)
    // Bấm "Mở thiệp" là thao tác của người dùng nên trình duyệt cho phép tự phát nhạc
    if (hasMusic && mode === 'live') playMusic()
  }

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
    <InvitationRuntimeContext.Provider value={runtime}>
      <div
        style={themeVars(data.theme)}
        className="paper-bg min-h-full w-full font-body text-wine [font-variant-numeric:lining-nums]"
      >
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
          <PartyInfo data={data} onRsvp={() => setRsvpOpen(true)} />
          <VenueMap data={data} />
          <DressCode data={data} />
          <Schedule data={data} />
          <Guestbook data={data} />
          <Footer data={data} />
        </main>

        {hasMusic && (
          <>
            <audio ref={audioRef} src={data.music.url} loop preload="none" />
            {opened && <MusicPlayer playing={playing} onToggle={toggleMusic} />}
          </>
        )}

        {data.rsvp.enabled && <RsvpDialog key={guestName} open={rsvpOpen} onOpenChange={setRsvpOpen} />}

        <AnimatePresence>
          {!opened && <CoverScreen data={data} guestName={guestName} onOpen={handleOpen} />}
        </AnimatePresence>
      </div>
    </InvitationRuntimeContext.Provider>
  )
}
