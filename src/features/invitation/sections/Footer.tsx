import type { InvitationData } from '@/types/invitation'
import { Ornament } from '../ui/Ornament'
import { Reveal } from '../ui/Reveal'

export function Footer({ data }: { data: InvitationData }) {
  const { footer, groom, bride } = data
  return (
    <footer className="relative flex flex-col items-center px-6 pt-6 pb-12 text-center">
      <Reveal>
        <Ornament />
        <p className="mx-auto mt-4 max-w-[340px] font-serif text-xl leading-relaxed italic">{footer.message}</p>
        <p className="mt-4 font-display text-3xl">
          {groom.shortName} &amp; {bride.shortName}
        </p>
      </Reveal>
    </footer>
  )
}
