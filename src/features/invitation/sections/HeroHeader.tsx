import BlurText from '@/components/reactbits/BlurText'
import type { InvitationData } from '@/types/invitation'
import { Reveal } from '../ui/Reveal'

/** Header "Save The Date": tên cặp đôi + ảnh cưới trong khung vòm, hoa trang trí hai bên. */
export function HeroHeader({ data }: { data: InvitationData }) {
  const { hero, groom, bride, assets } = data

  return (
    <header className="relative flex flex-col items-center overflow-x-clip px-9 pt-14 pb-12 text-center">
      <p className="font-serif text-sm font-semibold tracking-[0.45em] uppercase">{hero.label}</p>

      <BlurText
        text={groom.shortName}
        delay={120}
        className="mt-5 justify-center font-display text-[44px] leading-tight"
      />
      <span className="font-script text-4xl leading-none">&amp;</span>
      <BlurText
        text={bride.shortName}
        delay={120}
        className="justify-center font-display text-[44px] leading-tight"
      />

      <Reveal className="relative mt-8 w-full max-w-[300px]" distance={60}>
        <div className="absolute -inset-3 rounded-t-full border border-gold/60" aria-hidden />
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-cream shadow-[0_25px_50px_-20px_rgba(0,0,0,0.45)]">
          {hero.photo && (
            <img src={hero.photo} alt={`${groom.shortName} & ${bride.shortName}`} className="size-full object-cover" />
          )}
        </div>

        {assets.flowerDecor && (
          <>
            <img
              src={assets.flowerDecor}
              alt=""
              aria-hidden
              className="animate-float-y pointer-events-none absolute -bottom-6 -left-16 w-24 -scale-x-100"
            />
            <img
              src={assets.flowerDecor}
              alt=""
              aria-hidden
              className="animate-float-y pointer-events-none absolute -top-4 -right-16 w-24 [animation-delay:-2s]"
            />
          </>
        )}
      </Reveal>
    </header>
  )
}
