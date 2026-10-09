import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { formatLongDate } from '@/lib/date'
import type { InvitationData } from '@/types/invitation'
import { FallingHearts } from '../overlays/FallingHearts'
import { Ornament } from '../ui/Ornament'

interface CoverScreenProps {
  data: InvitationData
  guestName?: string
  onOpen: () => void
}

/** Màn bìa: card kem trên nền đỏ đô, bấm "Mở thiệp" để vào thiệp. */
export function CoverScreen({ data, guestName, onOpen }: CoverScreenProps) {
  const { groom, bride, party, cover, assets } = data

  return (
    <motion.div
      className="wine-gradient-bg fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, delay: 0.25 } }}
    >
      <FallingHearts count={14} />

      <motion.div
        className="paper-bg relative w-full max-w-[310px] overflow-hidden rounded-md border border-cream/60 px-8 pt-10 pb-12 text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } }}
        exit={{ opacity: 0, scale: 1.08, y: -20, transition: { duration: 0.5, ease: 'easeIn' } }}
      >
        {assets.cornerFlower && (
          <>
            <img src={assets.cornerFlower} alt="" className="pointer-events-none absolute -top-1 -left-1 w-14 -scale-x-100" />
            <img src={assets.cornerFlower} alt="" className="pointer-events-none absolute -right-1 -bottom-1 w-16 rotate-180 -scale-x-100" />
          </>
        )}

        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-wine to-wine-dark shadow-[0_10px_25px_-6px_var(--inv-primary)]">
          <Heart className="size-6 fill-cream text-cream" />
        </div>

        <h1 className="mt-8 font-display text-[30px] leading-tight text-wine">
          {groom.shortName}
          <span className="block text-xl">&amp;</span>
          {bride.shortName}
        </h1>

        <Ornament className="mt-4 text-wine" />

        <p className="mt-4 font-body text-lg text-wine/80">{formatLongDate(party.date)}</p>

        <p className="mt-5 font-body text-base text-wine/75">{cover.greeting}</p>
        {guestName && <p className="mt-1 font-display text-2xl text-wine">{guestName}</p>}

        <button
          type="button"
          onClick={onOpen}
          className="mt-7 rounded-full bg-wine px-9 py-3 font-body text-base font-semibold text-cream shadow-[0_12px_24px_-10px_var(--inv-primary)] transition hover:bg-wine-dark active:scale-95"
        >
          {cover.buttonText}
        </button>
      </motion.div>
    </motion.div>
  )
}
