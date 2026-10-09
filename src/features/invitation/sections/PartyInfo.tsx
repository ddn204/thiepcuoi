import { googleCalendarUrl, icsContent } from '@/lib/calendar-link'
import type { InvitationData } from '@/types/invitation'
import { EventDateBlock } from '../ui/EventDateBlock'
import { MonthCalendar } from '../ui/MonthCalendar'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

interface PartyInfoProps {
  data: InvitationData
  onRsvp?: () => void
}

function downloadIcs(content: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }))
  const link = Object.assign(document.createElement('a'), { href: url, download: fileName })
  link.click()
  URL.revokeObjectURL(url)
}

/** Card đỏ đô: giờ tiệc, lịch tháng, thêm vào lịch, nút xác nhận tham dự. */
export function PartyInfo({ data, onRsvp }: PartyInfoProps) {
  const { party, groom, bride, rsvp } = data
  const location = [party.venueName, party.address].filter(Boolean).join(', ')
  const event = {
    title: `Đám cưới ${groom.fullName} & ${bride.fullName}`,
    date: party.date,
    time: party.time,
    location,
    details: `Tiệc cưới của ${groom.fullName} & ${bride.fullName} tại ${location}`,
  }

  return (
    <section className="relative mx-auto mb-4 w-[88%] max-w-[420px]">
      <Reveal>
        <div className="rounded-2xl bg-wine px-6 py-10 text-cream shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]">
          <SectionTitle>{party.title}</SectionTitle>

          <h3 className="mt-6 text-center font-serif text-lg uppercase opacity-90">{party.heading}</h3>
          <p className="mt-2 text-center font-display text-5xl">{party.time}</p>

          <div className="mt-4">
            <EventDateBlock date={party.date} time={party.time} lunarOverride={party.lunarOverride} showTime={false} />
          </div>

          {(party.welcomeTime || party.startTime) && (
            <div className="mt-8 flex justify-center gap-12 text-center">
              {party.welcomeTime && (
                <div>
                  <p className="font-serif text-base tracking-wider uppercase opacity-80">Đón khách</p>
                  <p className="mt-1 font-serif text-2xl">{party.welcomeTime}</p>
                </div>
              )}
              {party.startTime && (
                <div>
                  <p className="font-serif text-base tracking-wider uppercase opacity-80">Khai tiệc</p>
                  <p className="mt-1 font-serif text-2xl">{party.startTime}</p>
                </div>
              )}
            </div>
          )}

          <div className="mx-auto mt-8 max-w-[320px]">
            <MonthCalendar date={party.date} />
          </div>

          <div className="mt-6 flex items-center justify-center gap-5 font-serif text-lg">
            <a
              href={googleCalendarUrl(event)}
              target="_blank"
              rel="noreferrer"
              className="border-b border-cream/80 pb-0.5 transition hover:opacity-80"
            >
              Thêm vào lịch
            </a>
            <button
              type="button"
              onClick={() => downloadIcs(icsContent(event), 'dam-cuoi.ics')}
              className="text-sm opacity-70 underline-offset-4 hover:underline"
            >
              Tải .ics
            </button>
          </div>

          {rsvp.enabled && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={onRsvp}
                className="rounded-full bg-cream px-10 py-3 font-serif text-lg tracking-wide text-wine uppercase shadow-lg transition hover:bg-paper active:scale-95"
              >
                {rsvp.buttonText}
              </button>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}
