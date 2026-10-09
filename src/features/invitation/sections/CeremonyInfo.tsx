import type { InvitationData, Person } from '@/types/invitation'
import { EventDateBlock } from '../ui/EventDateBlock'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

function ParentsColumn({ person }: { person: Person }) {
  return (
    <div className="flex-1 text-center">
      <p className="font-serif text-base opacity-80">Ông Bà</p>
      <p className="mt-1 font-serif text-lg font-bold">{person.father}</p>
      <p className="font-serif text-lg font-bold">{person.mother}</p>
      {person.address && <p className="mt-1 font-serif text-sm opacity-80">{person.address}</p>}
    </div>
  )
}

function CoupleName({ person }: { person: Person }) {
  return (
    <div className="text-center">
      <h3 className="font-display text-[40px] leading-tight">{person.fullName}</h3>
      {person.role && <p className="mt-2 font-serif text-sm tracking-[0.3em] uppercase opacity-80">{person.role}</p>}
    </div>
  )
}

/** Card đỏ đô: bố mẹ hai họ, tên cô dâu chú rể, thời gian & nơi cử hành lễ. */
export function CeremonyInfo({ data }: { data: InvitationData }) {
  const { groom, bride, ceremony, assets } = data

  return (
    <section className="relative mx-auto w-[88%] max-w-[420px]">
      {assets.flowerDecor && (
        <img
          src={assets.flowerDecor}
          alt=""
          aria-hidden
          className="animate-float-y pointer-events-none absolute top-[22%] -right-12 z-10 w-24"
        />
      )}

      <Reveal>
        <div className="rounded-2xl bg-wine px-6 py-10 text-cream shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]">
          <SectionTitle>{ceremony.title}</SectionTitle>

          <div className="mt-8 flex items-stretch gap-4">
            <ParentsColumn person={groom} />
            <span className="w-px bg-cream/40" />
            <ParentsColumn person={bride} />
          </div>

          <p className="mt-8 text-center font-serif text-lg leading-snug whitespace-pre-line uppercase">
            {ceremony.announcement}
          </p>

          <div className="mt-8 space-y-4">
            <CoupleName person={groom} />
            <p className="text-center font-script text-5xl leading-none">&amp;</p>
            <CoupleName person={bride} />
          </div>

          <p className="mt-10 text-center font-serif text-xl leading-snug uppercase opacity-90">
            {ceremony.heading}
            <br />
            {ceremony.venue}
          </p>

          <div className="mt-6">
            <EventDateBlock date={ceremony.date} time={ceremony.time} lunarOverride={ceremony.lunarOverride} />
          </div>
        </div>
      </Reveal>
    </section>
  )
}
