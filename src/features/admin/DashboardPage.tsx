import { useState } from 'react'
import { Copy, ExternalLink, Heart, Loader2, LogOut, Pencil, Plus, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { slugify, validateSlug } from '@/lib/slug'
import type { Invitation } from '@/types/invitation'
import {
  isDuplicateSlugError,
  signOut,
  useCreateInvitation,
  useDeleteInvitation,
  useInvitations,
  useSession,
  useUpdateInvitation,
} from './api'
import { copyText, invitationUrl } from './share'

const dateFormat = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })

function CreateInvitationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate()
  const create = useCreateInvitation()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const slugError = slug ? validateSlug(slug) : null

  const handleTitle = (value: string) => {
    setTitle(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim() || validateSlug(slug)) return
    create.mutate(
      { title: title.trim(), slug },
      {
        onSuccess: (id) => {
          onOpenChange(false)
          navigate(`/admin/thiep/${id}`)
        },
        onError: (error) =>
          toast.error(isDuplicateSlugError(error) ? 'Đường dẫn này đã có thiệp khác dùng' : 'Tạo thiệp thất bại'),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Tạo thiệp mới</DialogTitle>
            <DialogDescription>Thiệp mới dùng nội dung mẫu, bạn sửa lại trong trang chỉnh sửa.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="new-title">Tên thiệp (chỉ admin thấy)</Label>
            <Input
              id="new-title"
              placeholder="Vd: Minh Quân & Thu Trang"
              value={title}
              onChange={(e) => handleTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-slug">Đường dẫn</Label>
            <div className="flex items-center rounded-lg border bg-muted/40 pl-3 text-sm text-muted-foreground focus-within:ring-2 focus-within:ring-ring/40">
              <span className="shrink-0">{window.location.host}/</span>
              <input
                id="new-slug"
                className="h-9 min-w-0 flex-1 bg-transparent pr-3 text-foreground outline-none"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  setSlug(e.target.value.toLowerCase())
                }}
              />
            </div>
            {slugError && <p className="text-sm text-destructive">{slugError}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Huỷ
            </Button>
            <Button type="submit" disabled={!title.trim() || !slug || Boolean(slugError) || create.isPending}>
              {create.isPending && <Loader2 className="animate-spin" />}
              Tạo thiệp
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function InvitationCard({ invitation, onDelete }: { invitation: Invitation; onDelete: () => void }) {
  const update = useUpdateInvitation(invitation.id)
  const { groom, bride, party, hero } = invitation.data
  const url = invitationUrl(invitation.slug)

  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="flex gap-4 p-4">
        <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          {hero.photo && <img src={hero.photo} alt="" className="size-full object-cover" />}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold">{invitation.title || `${groom.shortName} & ${bride.shortName}`}</h3>
            {invitation.published ? <Badge>Đã xuất bản</Badge> : <Badge variant="secondary">Bản nháp</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">
            {groom.shortName} &amp; {bride.shortName} · tiệc {party.date.split('-').reverse().join('/')}
          </p>
          <button
            type="button"
            onClick={() => copyText(url, 'Đã sao chép link thiệp')}
            className="flex max-w-full items-center gap-1 truncate text-sm text-primary hover:underline"
          >
            <Copy className="size-3.5 shrink-0" />
            <span className="truncate">{url}</span>
          </button>
          <p className="text-xs text-muted-foreground">Cập nhật {dateFormat.format(new Date(invitation.updated_at))}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <label className="flex items-center gap-2 text-sm">
            Xuất bản
            <Switch
              checked={invitation.published}
              disabled={update.isPending}
              onCheckedChange={(published) =>
                update.mutate(
                  { published },
                  { onSuccess: () => toast.success(published ? 'Đã xuất bản thiệp' : 'Đã chuyển về bản nháp') },
                )
              }
            />
          </label>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" asChild title="Mở thiệp">
              <a href={url} target="_blank" rel="noreferrer">
                <ExternalLink />
              </a>
            </Button>
            <Button variant="outline" size="icon" title="Xoá thiệp" onClick={onDelete}>
              <Trash2 />
            </Button>
            <Button size="sm" asChild className="h-8">
              <Link to={`/admin/thiep/${invitation.id}`}>
                <Pencil />
                Sửa
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const session = useSession()
  const invitations = useInvitations()
  const deleteInvitation = useDeleteInvitation()
  const [createOpen, setCreateOpen] = useState(false)
  const [deleting, setDeleting] = useState<Invitation | null>(null)

  return (
    <div className="min-h-dvh bg-muted/40">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-3 px-4">
          <Heart className="size-5 fill-[#511419] text-[#511419]" />
          <span className="font-semibold">Quản trị thiệp cưới</span>
          <span className="ml-auto hidden text-sm text-muted-foreground sm:inline">{session?.user.email}</span>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut />
            Đăng xuất
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-4 px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Danh sách thiệp</h1>
            <p className="text-sm text-muted-foreground">Mỗi thiệp có một đường dẫn riêng để gửi cho khách.</p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus />
            Tạo thiệp
          </Button>
        </div>

        {invitations.isPending && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {invitations.isError && <p className="text-destructive">Không tải được danh sách thiệp.</p>}
        {invitations.data?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Chưa có thiệp nào. Bấm “Tạo thiệp” để bắt đầu.
            </CardContent>
          </Card>
        )}
        <div className="space-y-3">
          {invitations.data?.map((invitation) => (
            <InvitationCard key={invitation.id} invitation={invitation} onDelete={() => setDeleting(invitation)} />
          ))}
        </div>
      </main>

      <CreateInvitationDialog key={String(createOpen)} open={createOpen} onOpenChange={setCreateOpen} />

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá thiệp “{deleting?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              Toàn bộ lời chúc, xác nhận tham dự và danh sách khách của thiệp này cũng bị xoá. Không hoàn tác được.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() =>
                deleting &&
                deleteInvitation.mutate(deleting.id, {
                  onSuccess: () => toast.success('Đã xoá thiệp'),
                  onError: () => toast.error('Xoá thiệp thất bại'),
                })
              }
            >
              Xoá thiệp
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
