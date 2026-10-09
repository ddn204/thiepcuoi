import { cn } from '@/lib/utils'

/** Đường kẻ ngang có hoạ tiết ❦ ở giữa */
export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3', className)} aria-hidden>
      <span className="h-px w-14 bg-current opacity-50" />
      <span className="text-sm">❦</span>
      <span className="h-px w-14 bg-current opacity-50" />
    </div>
  )
}
