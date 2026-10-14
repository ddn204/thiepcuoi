import type { InvitationData } from '@/types/invitation'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

/** Dress code: các chấm màu gợi ý trang phục. */
export function DressCode({ data }: { data: InvitationData }) {
  const { dressCode } = data
  if (!dressCode.enabled || dressCode.colors.length === 0) return null

  return (
    <section className="relative flex flex-col items-center gap-4 px-6 py-10">
      
      <Reveal className="text-center">
        <SectionTitle>{dressCode.title}</SectionTitle>
        {dressCode.subtitle && <p className="mt-2 font-serif text-lg opacity-85">{dressCode.subtitle}</p>}
      </Reveal>
      <Reveal className="flex flex-wrap justify-center gap-4" delay={0.1}>
        {dressCode.colors.map((color, index) => (
          <span
            key={`${color}-${index}`}
            className="size-14 rounded-full border-2 border-white/70 shadow-[0_8px_18px_-8px_rgba(0,0,0,0.45)] ring-1 ring-wine/10"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </Reveal>
    </section>
  )
}
