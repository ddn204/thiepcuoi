import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAdminWishes, useDeleteWish, useUpdateWish } from '../api'
import { formatDateTime } from './format'
import { ConfirmDeleteButton, TabShell } from './TabShell'

/** Sổ lưu bút: xem toàn bộ lời chúc, ẩn lời chúc không phù hợp khỏi thiệp hoặc xoá hẳn. */
export function WishesTab({ invitationId }: { invitationId: string }) {
  const wishes = useAdminWishes(invitationId)
  const updateWish = useUpdateWish(invitationId)
  const deleteWish = useDeleteWish(invitationId)
  const list = wishes.data ?? []
  const hiddenCount = list.filter((wish) => wish.hidden).length

  return (
    <TabShell
      title="Sổ lưu bút"
      summary={`${list.length} lời chúc${hiddenCount ? ` · ${hiddenCount} đang ẩn` : ''}`}
      query={wishes}
      isEmpty={list.length === 0}
      emptyText="Chưa có lời chúc nào."
    >
      <ul className="divide-y">
        {list.map((wish) => (
          <li key={wish.id} className={cn('flex items-start gap-2 p-4', wish.hidden && 'bg-muted/50')}>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-medium">{wish.name}</span>
                <span className="text-xs text-muted-foreground">{formatDateTime(wish.created_at)}</span>
                {wish.hidden && <Badge variant="secondary">Đang ẩn</Badge>}
              </p>
              <p
                className={cn(
                  'mt-1 text-sm break-words whitespace-pre-line',
                  wish.hidden && 'text-muted-foreground',
                )}
              >
                {wish.message}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title={wish.hidden ? 'Hiện lại trên thiệp' : 'Ẩn khỏi thiệp'}
              disabled={updateWish.isPending}
              onClick={() =>
                updateWish.mutate(
                  { id: wish.id, hidden: !wish.hidden },
                  {
                    onSuccess: () => toast.success(wish.hidden ? 'Đã hiện lại lời chúc' : 'Đã ẩn lời chúc'),
                    onError: () => toast.error('Cập nhật thất bại'),
                  },
                )
              }
            >
              {wish.hidden ? <Eye /> : <EyeOff />}
            </Button>
            <ConfirmDeleteButton
              title={`Xoá lời chúc của “${wish.name}”?`}
              description="Lời chúc bị xoá hẳn, không hoàn tác được. Muốn giữ lại thì chọn Ẩn."
              disabled={deleteWish.isPending}
              onConfirm={() =>
                deleteWish.mutate(wish.id, {
                  onSuccess: () => toast.success('Đã xoá lời chúc'),
                  onError: () => toast.error('Xoá thất bại'),
                })
              }
            />
          </li>
        ))}
      </ul>
    </TabShell>
  )
}
