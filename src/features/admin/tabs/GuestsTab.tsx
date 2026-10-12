import { useState } from 'react'
import { Copy, Download, ExternalLink, Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { downloadCsv } from '@/lib/csv'
import { useAddGuests, useDeleteGuest, useGuests } from '../api'
import { copyText, guestInvitationUrl } from '../share'
import { ConfirmDeleteButton, TabShell } from './TabShell'

const MAX_NAME_LENGTH = 80
const MAX_PER_BATCH = 200

/** Mỗi dòng một khách; bỏ dòng trống, gộp khoảng trắng và tên trùng nhau. */
function parseGuestNames(text: string) {
  const names = text
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
  return [...new Set(names)]
}

interface GuestsTabProps {
  invitationId: string
  slug: string
  published: boolean
}

/** Khách mời: mỗi khách có link riêng `/{slug}?g={code}`, mở ra thiệp hiện "Thân mời {tên}". */
export function GuestsTab({ invitationId, slug, published }: GuestsTabProps) {
  const guests = useGuests(invitationId)
  const addGuests = useAddGuests(invitationId)
  const deleteGuest = useDeleteGuest(invitationId)
  const [draft, setDraft] = useState('')
  const list = guests.data ?? []

  const names = parseGuestNames(draft)
  const tooLong = names.find((name) => name.length > MAX_NAME_LENGTH)
  const draftError = tooLong
    ? `Tên “${tooLong.slice(0, 24)}…” dài quá ${MAX_NAME_LENGTH} ký tự`
    : names.length > MAX_PER_BATCH
      ? `Mỗi lần thêm tối đa ${MAX_PER_BATCH} khách`
      : null

  const submit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (names.length === 0 || draftError) return
    addGuests.mutate(names, {
      onSuccess: () => {
        toast.success(`Đã thêm ${names.length} khách`)
        setDraft('')
      },
      onError: () => toast.error('Thêm khách thất bại'),
    })
  }

  const copyAll = () =>
    copyText(
      list.map((guest) => `${guest.display_name}\t${guestInvitationUrl(slug, guest.code)}`).join('\n'),
      `Đã sao chép ${list.length} link`,
    )

  const exportCsv = () =>
    downloadCsv(`khach-moi-${slug}.csv`, [
      ['Tên khách', 'Link thiệp'],
      ...list.map((guest) => [guest.display_name, guestInvitationUrl(slug, guest.code)]),
    ])

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="space-y-3 rounded-xl border bg-background p-4">
        <div className="space-y-1.5">
          <Label htmlFor="guest-names">Thêm khách mời</Label>
          <Textarea
            id="guest-names"
            rows={4}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={'Mỗi dòng một khách, vd:\nAnh Minh & người thương\nGia đình cô Lan'}
            aria-invalid={Boolean(draftError)}
          />
          <p className={draftError ? 'text-xs text-destructive' : 'text-xs text-muted-foreground'}>
            {draftError ?? 'Tên này hiện sau chữ “Thân mời” khi khách mở link riêng của họ.'}
          </p>
        </div>
        <Button type="submit" disabled={names.length === 0 || Boolean(draftError) || addGuests.isPending}>
          {addGuests.isPending ? <Loader2 className="animate-spin" /> : <UserPlus />}
          {names.length > 1 ? `Thêm ${names.length} khách` : 'Thêm khách'}
        </Button>
      </form>

      {!published && list.length > 0 && (
        <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Thiệp đang là bản nháp: khách mở link sẽ thấy trang không tồn tại. Bật “Xuất bản” trước khi gửi link.
        </p>
      )}

      <TabShell
        title="Danh sách khách"
        summary={`${list.length} khách`}
        actions={
          list.length > 0 && (
            <>
              <Button type="button" variant="outline" size="sm" onClick={copyAll}>
                <Copy />
                Chép tất cả
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
                <Download />
                CSV
              </Button>
            </>
          )
        }
        query={guests}
        isEmpty={list.length === 0}
        emptyText="Chưa có khách nào. Thêm tên ở trên để tạo link riêng cho từng người."
      >
        <ul className="divide-y">
          {list.map((guest) => {
            const url = guestInvitationUrl(slug, guest.code)
            return (
              <li key={guest.id} className="flex items-center gap-1 py-2 pr-2 pl-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{guest.display_name}</p>
                  <p className="truncate text-xs text-muted-foreground">{url}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title="Sao chép link"
                  onClick={() => copyText(url, 'Đã sao chép link')}
                >
                  <Copy />
                </Button>
                <Button type="button" variant="ghost" size="icon" title="Mở thiệp" asChild>
                  <a href={url} target="_blank" rel="noreferrer">
                    <ExternalLink />
                  </a>
                </Button>
                <ConfirmDeleteButton
                  title={`Xoá khách “${guest.display_name}”?`}
                  description="Link riêng của khách này sẽ không còn hiện tên nữa."
                  disabled={deleteGuest.isPending}
                  onConfirm={() =>
                    deleteGuest.mutate(guest.id, {
                      onSuccess: () => toast.success('Đã xoá khách'),
                      onError: () => toast.error('Xoá thất bại'),
                    })
                  }
                />
              </li>
            )
          })}
        </ul>
      </TabShell>
    </div>
  )
}
