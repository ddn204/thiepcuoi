import type { InvitationData } from '@/types/invitation'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

/** Lịch trình ngày cưới dạng timeline dọc. */
export function Schedule({ data }: { data: InvitationData }) {
  const { schedule } = data
  if (!schedule.enabled || schedule.items.length === 0) return null

  return (
    <section className="relative mx-auto my-4 w-[88%] max-w-[420px]">
      <Reveal>
        <div className="rounded-2xl bg-wine px-6 py-10 text-cream shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]">
          <SectionTitle>{schedule.title}</SectionTitle>
          <ol className="relative mx-auto mt-8 max-w-[300px]">
            <span className="absolute top-2 bottom-2 left-[91.5px] w-px bg-cream/35" aria-hidden />
            {schedule.items.map((item, index) => (
              <li key={`${item.time}-${index}`} className="relative flex items-center gap-6 py-3">
                <span className="w-[62px] text-right font-serif text-xl">{item.time}</span>
                <span className="relative z-10 size-3 shrink-0 rounded-full border-2 border-cream bg-wine" />
                <span className="font-serif text-lg">{item.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  )
}
