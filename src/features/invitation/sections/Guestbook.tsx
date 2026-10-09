import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { SAMPLE_WISHES } from '@/data/sample-wishes'
import { WISH_SUGGESTIONS } from '@/data/wish-suggestions'
import type { InvitationData } from '@/types/invitation'
import { type PublicWish, useAddWish, useWishes } from '../api'
import { useInvitationRuntime } from '../invitation-context'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

const timeFormat = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
})

function WishCard({ wish }: { wish: PublicWish }) {
  return (
    <li className="rounded-2xl border border-wine/20 bg-white/45 px-5 py-4 text-left">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-serif text-lg font-bold">{wish.name}</p>
        <time className="shrink-0 font-serif text-sm opacity-70" dateTime={wish.created_at}>
          {timeFormat.format(new Date(wish.created_at))}
        </time>
      </div>
      <p className="mt-1.5 font-serif text-lg leading-snug whitespace-pre-line">{wish.message}</p>
    </li>
  )
}

/** Sổ lưu bút: form gửi lời chúc + danh sách lời chúc. */
export function Guestbook({ data }: { data: InvitationData }) {
  const { invitationId, guestName } = useInvitationRuntime()
  const wishesQuery = useWishes(invitationId)
  const addWish = useAddWish(invitationId)
  const [localWishes, setLocalWishes] = useState<PublicWish[]>(SAMPLE_WISHES)
  const [name, setName] = useState(guestName ?? '')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')

  if (!data.guestbook.enabled) return null

  const wishes = invitationId ? (wishesQuery.data ?? []) : localWishes
  const canSubmit = name.trim().length > 0 && message.trim().length > 0 && !addWish.isPending

  const suggest = () => {
    const options = WISH_SUGGESTIONS.filter((text) => text !== message)
    setMessage(options[Math.floor(Math.random() * options.length)])
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    // Bot điền ô ẩn → giả vờ thành công, không ghi DB
    if (honeypot) return setMessage('')

    if (!invitationId) {
      setLocalWishes((list) => [
        { id: crypto.randomUUID(), name: name.trim(), message: message.trim(), created_at: new Date().toISOString() },
        ...list,
      ])
      setMessage('')
      toast.success('Cảm ơn lời chúc của bạn ♥', { description: 'Đây là thiệp mẫu nên lời chúc không được lưu.' })
      return
    }

    addWish.mutate(
      { name, message },
      {
        onSuccess: () => {
          setMessage('')
          toast.success('Cảm ơn lời chúc của bạn ♥')
        },
        onError: () => toast.error('Gửi lời chúc chưa được, bạn thử lại giúp nhé.'),
      },
    )
  }

  return (
    <section className="relative overflow-x-clip px-6 pt-12 pb-8">
      <Reveal>
        <SectionTitle>{data.guestbook.title}</SectionTitle>
      </Reveal>

      <Reveal delay={0.1}>
        <form onSubmit={handleSubmit} className="mx-auto mt-7 max-w-[360px] space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên*"
            maxLength={60}
            required
            className="h-12 w-full rounded-xl border border-wine/30 bg-white/60 px-4 font-serif text-lg placeholder:text-wine/50 focus:border-wine focus:outline-none"
          />
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập lời chúc*"
              maxLength={500}
              required
              rows={3}
              className="w-full resize-none rounded-xl border border-wine/30 bg-white/60 px-4 py-3 pr-12 font-serif text-lg placeholder:text-wine/50 focus:border-wine focus:outline-none"
            />
            <button
              type="button"
              onClick={suggest}
              title="Gợi ý lời chúc"
              aria-label="Gợi ý lời chúc"
              className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-full bg-wine/10 text-base transition hover:bg-wine/20"
            >
              🪄
            </button>
          </div>
          {/* Ô bẫy bot: người dùng không thấy */}
          <input
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            name="website"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-wine font-serif text-lg font-semibold tracking-wide text-cream uppercase shadow-lg transition hover:bg-wine-dark disabled:opacity-50"
          >
            {addWish.isPending && <Loader2 className="size-4 animate-spin" />}
            Gửi lời chúc
          </button>
        </form>
      </Reveal>

      {wishes.length > 0 && (
        <ul className="mx-auto mt-8 max-h-[500px] max-w-[400px] space-y-3 overflow-y-auto overscroll-contain pr-1">
          {wishes.map((wish) => (
            <WishCard key={wish.id} wish={wish} />
          ))}
        </ul>
      )}
    </section>
  )
}
