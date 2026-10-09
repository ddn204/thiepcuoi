import { useState } from 'react'
import { Check, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useSubmitRsvp } from '../api'
import { useInvitationRuntime } from '../invitation-context'

interface RsvpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const GUEST_COUNTS = [1, 2, 3, 4, 5]

function ChoiceCard({
  selected,
  onClick,
  icon,
  children,
}: {
  selected: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-center gap-4 rounded-2xl border-2 px-4 py-3.5 text-left text-base transition',
        selected ? 'border-wine bg-wine/5 text-wine' : 'border-border bg-muted/40 hover:border-wine/40',
      )}
    >
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full transition',
          selected ? 'bg-wine text-cream' : 'bg-muted text-muted-foreground',
        )}
      >
        {icon}
      </span>
      <span className="font-medium">{children}</span>
    </button>
  )
}

/** Popup xác nhận tham dự. */
export function RsvpDialog({ open, onOpenChange }: RsvpDialogProps) {
  const { invitationId, guestId, guestName } = useInvitationRuntime()
  const [name, setName] = useState(guestName ?? '')
  const [attending, setAttending] = useState<boolean | null>(null)
  const [guestCount, setGuestCount] = useState(1)
  const submit = useSubmitRsvp(invitationId, guestId)

  const canSubmit = name.trim().length > 0 && attending !== null && !submit.isPending

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    const thanks = attending ? 'Cảm ơn bạn! Hẹn gặp bạn tại tiệc cưới nhé ♥' : 'Cảm ơn bạn đã báo cho chúng tôi ♥'
    if (!invitationId) {
      toast.success(thanks, { description: 'Đây là thiệp mẫu nên xác nhận không được lưu.' })
      onOpenChange(false)
      return
    }
    submit.mutate(
      { name, attending, guestCount },
      {
        onSuccess: () => {
          toast.success(thanks)
          onOpenChange(false)
        },
        onError: () => toast.error('Gửi xác nhận chưa được, bạn thử lại giúp nhé.'),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl p-7 sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-bold">Xác nhận tham dự</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi. Xin xác nhận để chúng tôi chuẩn bị chu đáo
            nhất.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="rsvp-name" className="text-base">
              Tên của bạn
            </Label>
            <Input
              id="rsvp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên của bạn"
              maxLength={80}
              className="h-12 rounded-2xl text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Bạn sẽ đến chứ?</Label>
            <div className="space-y-3">
              <ChoiceCard selected={attending === true} onClick={() => setAttending(true)} icon={<Check className="size-4" />}>
                Tôi sẽ đến
              </ChoiceCard>
              <ChoiceCard selected={attending === false} onClick={() => setAttending(false)} icon={<X className="size-4" />}>
                Rất tiếc, tôi không thể đến
              </ChoiceCard>
            </div>
          </div>

          {attending && (
            <div className="space-y-2">
              <Label className="text-base">Số người đi cùng (tính cả bạn)</Label>
              <div className="flex gap-2">
                {GUEST_COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setGuestCount(count)}
                    className={cn(
                      'h-11 flex-1 rounded-xl border-2 text-base font-medium transition',
                      guestCount === count ? 'border-wine bg-wine text-cream' : 'border-border hover:border-wine/40',
                    )}
                  >
                    {count}
                    {count === GUEST_COUNTS.length && '+'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-wine text-base font-semibold text-cream shadow-lg transition hover:bg-wine-dark disabled:cursor-not-allowed disabled:bg-wine/10 disabled:text-wine/40 disabled:shadow-none"
          >
            {submit.isPending && <Loader2 className="size-4 animate-spin" />}
            Gửi xác nhận
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
