import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { HeartShape } from '../ui/HeartShape'

const COLORS = ['var(--inv-cream)', 'var(--inv-gold)', '#b8323f', '#e7b7b7']

/** Hiệu ứng tim rơi lơ lửng (CSS animation, không chặn tương tác). */
export function FallingHearts({ count = 16, className }: { count?: number; className?: string }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 16,
        duration: 9 + Math.random() * 9,
        delay: -Math.random() * 18,
        sway: (Math.random() - 0.5) * 120,
        rotate: (Math.random() - 0.5) * 360,
        opacity: 0.35 + Math.random() * 0.45,
        color: COLORS[i % COLORS.length],
      })),
    [count],
  )

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {hearts.map((h) => (
        <HeartShape
          key={h.id}
          className="absolute top-0"
          style={
            {
              left: `${h.left}%`,
              width: h.size,
              height: h.size,
              color: h.color,
              animation: `heart-fall ${h.duration}s linear ${h.delay}s infinite`,
              '--fall-sway': `${h.sway}px`,
              '--fall-rotate': `${h.rotate}deg`,
              '--fall-opacity': h.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
