import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules'
import Lightbox from 'yet-another-react-lightbox'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'yet-another-react-lightbox/styles.css'
import type { InvitationData } from '@/types/invitation'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

/** Album ảnh: carousel 3D coverflow, bấm ảnh để xem phóng to. */
export function AlbumCarousel({ data }: { data: InvitationData }) {
  const { album } = data
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  if (!album.enabled || album.photos.length === 0) return null

  return (
    <section className="relative overflow-x-clip py-14">
      <Reveal>
        <SectionTitle>{album.title}</SectionTitle>
      </Reveal>

      <Reveal className="mt-8" delay={0.1}>
        <Swiper
          className="album-swiper !pb-12"
          modules={[EffectCoverflow, Pagination, Autoplay]}
          effect="coverflow"
          centeredSlides
          slidesPerView="auto"
          loop={album.photos.length >= 4}
          grabCursor
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          coverflowEffect={{ rotate: 0, stretch: 40, depth: 220, modifier: 1, scale: 0.88, slideShadows: false }}
          pagination={{ clickable: true }}
        >
          {album.photos.map((photo, index) => (
            <SwiperSlide key={`${photo.url}-${index}`} className="!w-[210px]">
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="block aspect-[2/3] w-full overflow-hidden rounded-2xl border border-white/70 bg-cream shadow-[0_18px_35px_-15px_rgba(0,0,0,0.5)]"
                aria-label={`Xem ảnh ${index + 1}`}
              >
                <img src={photo.url} alt={photo.alt} loading="lazy" className="size-full object-cover" />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </Reveal>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={album.photos.map((photo) => ({ src: photo.url, alt: photo.alt }))}
      />
    </section>
  )
}
