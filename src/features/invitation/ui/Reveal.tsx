import AnimatedContent from '@/components/reactbits/AnimatedContent'
import { useScrollContainer } from '../scroll-container'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  distance?: number
}

/** Hiện dần nội dung khi cuộn tới (React Bits AnimatedContent), tự dùng đúng scroller. */
export function Reveal({ children, className, delay = 0, distance = 40 }: RevealProps) {
  const container = useScrollContainer()
  return (
    <AnimatedContent
      container={container}
      distance={distance}
      duration={0.9}
      delay={delay}
      threshold={0.15}
      className={className}
    >
      {children}
    </AnimatedContent>
  )
}
