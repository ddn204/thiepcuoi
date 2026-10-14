import type { InvitationData } from '@/types/invitation'
import { Reveal } from '../ui/Reveal'

/** Header "Save The Date": ảnh full khung, chữ nằm trong ảnh (cách top ~30px, căn giữa). */
export function HeroHeader({ data }: { data: InvitationData }) {
  const { hero, groom, bride } = data

  return (
    <header className="relative w-full overflow-hidden">
      <Reveal className="w-full" distance={40}>
        <div className="relative w-full overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.45)]">
          {hero.photo ? (
            <img
              src={hero.photo}
              alt={`${bride.shortName} & ${groom.shortName}`}
              className=" h-full w-full object-cover"
            />
          ) : (
            <div className="flex  w-full items-center justify-center bg-wine/10">
              <span className="font-serif text-wine/50">Ảnh Save the Date</span>
            </div>
          )}

          {/* Chữ SAVE THE DATE nằm trong ảnh, cách top 30px, căn giữa */}
          <p
            className="pointer-events-none absolute left-0 right-0 text-center font-serif text-lg font-semibold tracking-[0.4em] uppercase text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] sm:text-2xl"
            style={{ top: 45 }}
          >
            {hero.label || '- SAVE THE DATE -'}
          </p>
        </div>
      </Reveal>
    </header>
  )
}