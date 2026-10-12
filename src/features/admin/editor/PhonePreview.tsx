import { useState } from 'react'
import { InvitationView } from '@/features/invitation/InvitationView'
import { ScrollContainerContext } from '@/features/invitation/scroll-container'
import type { InvitationData } from '@/types/invitation'

interface PhonePreviewProps {
  data: InvitationData
  showCover: boolean
}

/**
 * Khung điện thoại xem trước thiệp. Khung ngoài có transform để các phần tử `fixed`
 * (màn bìa, nút nhạc) neo theo khung thay vì cả màn hình; khung trong tự cuộn.
 */
export function PhonePreview({ data, showCover }: PhonePreviewProps) {
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null)

  return (
    <div className="relative h-[760px] max-h-[calc(100dvh-7rem)] w-[375px] shrink-0 overflow-hidden rounded-[2.5rem] border-[10px] border-neutral-900 bg-neutral-900 shadow-2xl [transform:translateZ(0)]">
      <div ref={setScroller} className="h-full overflow-y-auto overscroll-contain rounded-[1.9rem] [scrollbar-width:none]">
        {scroller && (
          <ScrollContainerContext.Provider value={scroller}>
            <InvitationView data={data} mode="preview" showCover={showCover} />
          </ScrollContainerContext.Provider>
        )}
      </div>
    </div>
  )
}
