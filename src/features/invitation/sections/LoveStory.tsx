import type { InvitationData } from '@/types/invitation'
import { Reveal } from '../ui/Reveal'

/** Section Our love story: dùng ảnh full từ decor (đã có sẵn layout + quote trên ảnh). */
export function LoveStory({ data }: { data: InvitationData }) {
  const imgSrc = data.assets.loveStoryBg || '/decor/our-love-story.svg'

  return (
    <section className="relative mx-auto w-full max-w-[480px] overflow-hidden">
      <Reveal className="w-full">
        <img
          src={imgSrc}
          alt="Our love story"
          className="w-full object-cover"
          draggable={false}
        />
      </Reveal>
    </section>
  )
}