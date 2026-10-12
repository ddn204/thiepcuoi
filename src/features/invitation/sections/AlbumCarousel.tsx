import { useEffect, useRef, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { cn } from '@/lib/utils'
import type { InvitationData } from '@/types/invitation'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

const AUTOPLAY_MS = 1400
const SWIPE_THRESHOLD = 40
const MAX_VISIBLE_OFFSET = 3

/** Khoảng cách vòng tròn từ ảnh `index` tới ảnh đang chọn, trong khoảng [-n/2, n/2). */
function circularOffset(index: number, active: number, total: number) {
  const half = Math.floor(total / 2)
  return ((((index - active + half) % total) + total) % total) - half
}

/** Ảnh giữa thẳng; ảnh hai bên lệch ngang, lùi sâu, xoay 45° mỗi nấc và mờ dần. */
function cardStyle(offset: number): React.CSSProperties {
  const distance = Math.abs(offset)
  const scale = distance === 0 ? 1 : distance === 1 ? 0.85 : 0.7
  const opacity = distance > MAX_VISIBLE_OFFSET ? 0 : [1, 0.75, 0.5, 0.3][distance]
  return {
    transform: `translateX(${offset * 60}%) translateZ(${-150 * distance}px) rotateY(${45 * offset}deg) scale(${scale})`,
    opacity,
    zIndex: 100 - distance,
    pointerEvents: distance > MAX_VISIBLE_OFFSET ? 'none' : undefined,
  }
}

/** Album ảnh: carousel 3D tự chạy, vuốt ngang để chuyển, bấm ảnh giữa để xem phóng to. */
export function AlbumCarousel({ data }: { data: InvitationData }) {
  const { album } = data
  const photos = album.photos
  const total = photos.length
  const [active, setActive] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [dragging, setDragging] = useState(false)
  const pointerStart = useRef<number | null>(null)
  const swiped = useRef(false)

  const go = (index: number) => setActive(((index % total) + total) % total)

  // Tự chuyển ảnh; đặt lại bộ đếm mỗi lần đổi ảnh, tạm dừng khi đang vuốt / xem phóng to
  useEffect(() => {
    if (total < 2 || dragging || lightboxIndex >= 0) return
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % total), AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [active, total, dragging, lightboxIndex])

  useEffect(() => {
    if (active >= total) setActive(0)
  }, [active, total])

  if (!album.enabled || total === 0) return null

  const handlePointerDown = (event: React.PointerEvent) => {
    pointerStart.current = event.clientX
    swiped.current = false
    setDragging(true)
  }

  const handlePointerUp = (event: React.PointerEvent) => {
    if (pointerStart.current !== null) {
      const dx = event.clientX - pointerStart.current
      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        // Chặn cú click đi kèm thao tác kéo chuột, rồi mở lại ngay sau đó
        swiped.current = true
        window.setTimeout(() => (swiped.current = false), 0)
        go(active + (dx < 0 ? 1 : -1))
      }
    }
    pointerStart.current = null
    setDragging(false)
  }

  const handleCardClick = (index: number, offset: number) => {
    if (swiped.current) return
    if (offset === 0) setLightboxIndex(index)
    else go(index)
  }

  return (
    <section className="relative flex flex-col items-center overflow-x-clip px-6 pt-10 pb-10">
      <Reveal>
        <SectionTitle>{album.title}</SectionTitle>
      </Reveal>

      <Reveal className="relative mt-5 w-full max-w-[380px]" delay={0.1}>
        <div
          className="relative h-[340px] touch-pan-y select-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={(event) => pointerStart.current !== null && handlePointerUp(event)}
        >
          <div className="relative flex size-full items-center justify-center [perspective:1000px]">
            {photos.map((photo, index) => {
              const offset = circularOffset(index, active, total)
              return (
                <div
                  key={`${photo.url}-${index}`}
                  role="button"
                  tabIndex={offset === 0 ? 0 : -1}
                  aria-label={offset === 0 ? `Xem ảnh ${index + 1}` : `Chuyển tới ảnh ${index + 1}`}
                  onClick={() => handleCardClick(index, offset)}
                  onKeyDown={(event) => event.key === 'Enter' && handleCardClick(index, offset)}
                  className={cn(
                    'absolute aspect-[2/3] h-[92%] cursor-pointer overflow-hidden rounded-2xl bg-cream shadow-xl transition-all duration-[1100ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
                    offset === 0 && 'ring-2 ring-white/30',
                  )}
                  style={cardStyle(offset)}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    draggable={false}
                    loading={Math.abs(offset) <= 1 ? 'eager' : 'lazy'}
                    className="size-full object-cover"
                  />
                </div>
              )
            })}
          </div>
        </div>

        {total > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {photos.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Tới ảnh ${index + 1}`}
                onClick={() => go(index)}
                className={cn(
                  'h-2 rounded-full bg-current transition-all duration-300',
                  index === active ? 'w-6 opacity-70' : 'w-2 opacity-25 hover:opacity-40',
                )}
              />
            ))}
          </div>
        )}
      </Reveal>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={photos.map((photo) => ({ src: photo.url, alt: photo.alt }))}
      />
    </section>
  )
}
