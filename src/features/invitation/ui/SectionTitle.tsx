import { cn } from '@/lib/utils'

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-center font-serif text-[26px] font-bold tracking-wide uppercase', className)}>
      {children}
    </h2>
  )
}
