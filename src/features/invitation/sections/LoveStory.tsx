import type { InvitationData } from '@/types/invitation'
import { Reveal } from '../ui/Reveal'

export function LoveStory({ data }: { data: InvitationData }) {
  const imgSrc = data.assets.loveStoryBg || '/decor/our-love-story.svg'

  return (
    <section className="relative mx-auto w-full max-w-[480px] overflow-hidden">
        <img
          src={imgSrc}
          alt="Our love story"
          className="w-full object-cover [transform:translateZ(0)]"
          style={{
            imageRendering: 'auto',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
          }}
          draggable={false}
        />
    </section>
  )
}