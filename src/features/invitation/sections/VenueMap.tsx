import { Navigation } from 'lucide-react'
import { mapDirectionsUrl, mapEmbedUrl } from '@/lib/calendar-link'
import type { InvitationData } from '@/types/invitation'
import { Reveal } from '../ui/Reveal'

/** Địa điểm tổ chức: địa chỉ, bản đồ Google nhúng, nút chỉ đường. */
export function VenueMap({ data }: { data: InvitationData }) {
  const { party } = data
  const query = party.mapQuery.trim() || [party.venueName, party.address].filter(Boolean).join(', ')
  if (!query) return null

  return (
    <section style={{ backgroundColor: data.theme.cream }} className="relative flex flex-col items-center overflow-x-clip px-6 pt-10 pb-8 text-center">
      <Reveal>
        <h3 className="font-serif text-2xl font-bold tracking-wide uppercase">{party.venueTitle}</h3>
        <p className=" text-center font-serif text-xl leading-relaxed ">
          {party.venueName && party.address && <br />}
          {party.address}
        </p>
      </Reveal>

      <Reveal className="mt-6 w-full max-w-[360px]" delay={0.1}>
        <div className="overflow-hidden rounded-2xl border border-wine/10 shadow-[0_15px_30px_-18px_rgba(0,0,0,0.5)]">
          <iframe
            title="Bản đồ địa điểm tiệc cưới"
            src={mapEmbedUrl(query)}
            className="block h-64 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href={mapDirectionsUrl(query)}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 font-serif text-lg font-semibold transition hover:opacity-75"
        >
          <Navigation className="size-5" />
          Chỉ đường
        </a>
      </Reveal>
    </section>
  )
}
