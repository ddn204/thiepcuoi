import { useState } from 'react'
import { motion } from 'motion/react'
import type { InvitationData } from '@/types/invitation'
import { GiftDrawer } from '../overlays/GiftDrawer'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

const SPARKLES = [
  { top: '8%', left: '12%', delay: 0 },
  { top: '18%', left: '84%', delay: 0.6 },
  { top: '62%', left: '4%', delay: 1.1 },
  { top: '70%', left: '90%', delay: 1.6 },
]

/** Hộp quà tự vẽ (SVG): thân + nắp + ruy băng. Nắp bật lên khi mở. */
function GiftIllustration({ opening }: { opening: boolean }) {
  return (
    <svg viewBox="0 0 160 160" className="size-40 overflow-visible" aria-hidden>
      <ellipse cx="80" cy="150" rx="52" ry="7" fill="currentColor" opacity="0.12" />
      {/* thân hộp */}
      <rect x="30" y="72" width="100" height="74" rx="6" fill="var(--inv-primary)" />
      <rect x="72" y="72" width="16" height="74" fill="var(--inv-gold)" />
      <rect x="30" y="72" width="100" height="10" fill="var(--inv-primary-dark)" opacity="0.5" />
      {/* nắp + nơ */}
      <motion.g
        style={{ originX: '80px', originY: '70px' }}
        animate={opening ? { y: -36, rotate: -14 } : { y: [0, -5, 0] }}
        transition={opening ? { duration: 0.45, ease: 'easeOut' } : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="24" y="52" width="112" height="22" rx="5" fill="var(--inv-primary)" />
        <rect x="72" y="52" width="16" height="22" fill="var(--inv-gold)" />
        <path d="M80 52c-10-20-36-22-36-8 0 9 18 10 36 8z" fill="var(--inv-gold)" />
        <path d="M80 52c10-20 36-22 36-8 0 9-18 10-36 8z" fill="var(--inv-gold)" />
        <circle cx="80" cy="50" r="6" fill="var(--inv-gold)" stroke="var(--inv-primary-dark)" strokeOpacity="0.3" />
      </motion.g>
    </svg>
  )
}

export function GiftBox({ data }: { data: InvitationData }) {
  const [open, setOpen] = useState(false)
  const [opening, setOpening] = useState(false)

  if (!data.gift.enabled || data.gift.accounts.length === 0) return null

  const handleOpen = () => {
    setOpening(true)
    window.setTimeout(() => {
      setOpen(true)
      setOpening(false)
    }, 450)
  }

  return (
    <section className="relative flex flex-col items-center overflow-x-clip px-6 py-12">
      <Reveal>
        <SectionTitle>{data.gift.title}</SectionTitle>
      </Reveal>

      <Reveal delay={0.1}>
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Mở hộp mừng cưới"
          className="relative mt-6 flex flex-col items-center px-10 pt-6 text-wine"
        >
          {SPARKLES.map((sparkle, index) => (
            <motion.span
              key={index}
              className="absolute text-xl text-gold"
              style={{ top: sparkle.top, left: sparkle.left }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: sparkle.delay }}
              aria-hidden
            >
              ✦
            </motion.span>
          ))}
          <GiftIllustration opening={opening} />
          <motion.span
            className="mt-3 font-serif text-lg italic"
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            Nhấn để mở
          </motion.span>
        </button>
      </Reveal>

      <GiftDrawer data={data} open={open} onOpenChange={setOpen} />
    </section>
  )
}
