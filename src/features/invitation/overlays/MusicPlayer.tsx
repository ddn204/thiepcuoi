import { Music, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MusicPlayerProps {
  playing: boolean
  onToggle: () => void
}

/** Nút nhạc nổi góc phải dưới: đĩa xoay khi đang phát. */
export function MusicPlayer({ playing, onToggle }: MusicPlayerProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? 'Tạm dừng nhạc' : 'Phát nhạc'}
      className="fixed right-4 bottom-5 z-40 flex size-12 items-center justify-center rounded-full bg-wine text-cream shadow-[0_10px_25px_-8px_rgba(0,0,0,0.6)] ring-4 ring-wine/20 transition active:scale-90"
    >
      <span
        className={cn(
          'absolute inset-1 rounded-full border border-dashed border-cream/40',
          playing && 'animate-spin-slow',
        )}
        aria-hidden
      />
      {playing ? <Pause className="relative size-5" /> : <Music className="relative size-5" />}
      {playing && <span className="absolute inset-0 animate-ping rounded-full bg-wine/30" aria-hidden />}
    </button>
  )
}
