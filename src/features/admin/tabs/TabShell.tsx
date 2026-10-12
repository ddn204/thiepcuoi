import { Loader2, RefreshCw, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface TabShellProps {
  title: string
  summary?: React.ReactNode
  actions?: React.ReactNode
  query: { isPending: boolean; isError: boolean; isFetching: boolean; refetch: () => unknown }
  isEmpty: boolean
  emptyText: string
  children: React.ReactNode
}

/** Khung chung cho các tab dữ liệu: tiêu đề, nút làm mới, trạng thái đang tải / lỗi / trống. */
export function TabShell({ title, summary, actions, query, isEmpty, emptyText, children }: TabShellProps) {
  return (
    <section className="rounded-xl border bg-background">
      <header className="flex flex-wrap items-center gap-2 border-b p-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{title}</h2>
          {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
        </div>
        {actions}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Làm mới"
          disabled={query.isFetching}
          onClick={() => query.refetch()}
        >
          <RefreshCw className={query.isFetching ? 'animate-spin' : undefined} />
        </Button>
      </header>
      {query.isPending ? (
        <div className="flex justify-center p-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : query.isError ? (
        <div className="space-y-3 p-10 text-center text-sm text-muted-foreground">
          <p>Không tải được dữ liệu.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
            Thử lại
          </Button>
        </div>
      ) : isEmpty ? (
        <p className="p-10 text-center text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        children
      )}
    </section>
  )
}

interface ConfirmDeleteButtonProps {
  title: string
  description?: string
  disabled?: boolean
  onConfirm: () => void
}

export function ConfirmDeleteButton({ title, description, disabled, onConfirm }: ConfirmDeleteButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Xoá"
          disabled={disabled}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description ?? 'Không hoàn tác được.'}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Xoá
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
