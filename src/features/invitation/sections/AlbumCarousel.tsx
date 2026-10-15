import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Lightbox from "yet-another-react-lightbox";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "yet-another-react-lightbox/styles.css";
import { cn } from "@/lib/utils";
import type { InvitationData } from "@/types/invitation";
import { Reveal } from "../ui/Reveal";
import { SectionTitle } from "../ui/SectionTitle";

const OPACITY_BY_DISTANCE = [1, 0.75, 0.5, 0.3, 0];
const MIN_LOOP_SLIDES = 8;
/** Dưới ngưỡng này = chạm (tap), trên = vuốt */
const TAP_MOVE_THRESHOLD = 12;

type SlideEl = HTMLElement & { progress?: number };

function fadeSideSlides(swiper: SwiperType) {
  for (const slide of swiper.slides as SlideEl[]) {
    const distance = Math.min(
      Math.abs(slide.progress ?? 0),
      OPACITY_BY_DISTANCE.length - 1,
    );
    const step = Math.floor(distance);
    const next =
      OPACITY_BY_DISTANCE[Math.min(step + 1, OPACITY_BY_DISTANCE.length - 1)];
    const opacity =
      OPACITY_BY_DISTANCE[step] +
      (next - OPACITY_BY_DISTANCE[step]) * (distance - step);
    slide.style.opacity = String(opacity);
  }
}

export function AlbumCarousel({ data }: { data: InvitationData }) {
  const { album } = data;
  const photos = album.photos;
  const total = photos.length;
  const loop = total >= 3;
  const copies = loop ? Math.ceil(MIN_LOOP_SLIDES / total) : 1;
  const slides = Array.from({ length: copies }, () => photos).flat();

  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const active = total ? activeSlide % total : 0;
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!swiper?.autoplay || swiper.destroyed) return;
    if (lightboxIndex >= 0) swiper.autoplay.stop();
    else swiper.autoplay.start();
  }, [swiper, lightboxIndex]);

  if (!album.enabled || total === 0) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
    // Dừng autoplay ngay khi chạm — tránh đổi slide lúc đang bấm
    swiper?.autoplay?.stop();
  };

  const handleSlideClick = (
    slideIndex: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!swiper || swiper.destroyed) return;

    // Có kéo tay → bỏ qua, để Swiper xử lý vuốt
    if (pointerStart.current) {
      const dx = Math.abs(e.clientX - pointerStart.current.x);
      const dy = Math.abs(e.clientY - pointerStart.current.y);
      pointerStart.current = null;
      if (dx > TAP_MOVE_THRESHOLD || dy > TAP_MOVE_THRESHOLD) return;
    }

    const photoIndex = slideIndex % total;

    // Ảnh đang ở giữa (hoặc gần giữa) → mở lightbox
    // Dùng activeIndex ± 1 cho dễ bấm trên mobile
    const isCenter =
      slideIndex === swiper.activeIndex ||
      Math.abs(slideIndex - swiper.activeIndex) <= 0;

    if (isCenter || photoIndex === swiper.realIndex) {
      setLightboxIndex(photoIndex);
    } else {
      swiper.slideToLoop(slideIndex);
    }
  };

  const goToPhoto = (photoIndex: number) => {
    if (!swiper || swiper.destroyed) return;
    swiper.autoplay?.stop();

    const candidates = Array.from(
      { length: copies },
      (_, copy) => copy * total + photoIndex,
    );
    const nearest = candidates.reduce((best, slideIndex) =>
      Math.abs(slideIndex - swiper.activeIndex) <
      Math.abs(best - swiper.activeIndex)
        ? slideIndex
        : best,
    );
    swiper.slideToLoop(nearest);
  };

  return (
    <section
      style={{ backgroundColor: data.theme.cream }}
      className="relative flex flex-col items-center overflow-x-clip px-6 pt-10 pb-10"
    >
      <Reveal>
        <SectionTitle>{album.title}</SectionTitle>
      </Reveal>

      <Reveal className="relative mt-5 w-full max-w-[570px]" delay={0.1}>
        <Swiper
          className="album-swiper h-[510px] touch-pan-y"
          modules={[EffectCoverflow, Autoplay]}
          effect="coverflow"
          centeredSlides
          slidesPerView="auto"
          loop={loop}
          loopAdditionalSlides={2}
          speed={800}
          grabCursor
          watchSlidesProgress
          // Mobile: cần kéo > 15px mới tính là vuốt — tránh nuốt mất tap
          threshold={15}
          preventClicks={false}
          preventClicksPropagation={false}
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: -45,
            stretch: "40%",
            depth: 150,
            modifier: 1,
            scale: 0.85,
            slideShadows: false,
          }}
          onSwiper={setSwiper}
          onRealIndexChange={(instance) => setActiveSlide(instance.realIndex)}
          onProgress={fadeSideSlides}
          onTouchStart={(s) => s.autoplay?.stop()}
        >
          {slides.map((photo, slideIndex) => (
            <SwiperSlide
              key={`${photo.url}-${slideIndex}`}
              className="album-slide"
            >
              <button
                type="button"
                onPointerDown={handlePointerDown}
                onClick={(e) => handleSlideClick(slideIndex, e)}
                aria-label={`Xem ảnh ${(slideIndex % total) + 1}`}
                className="album-card block size-full overflow-hidden rounded-2xl bg-cream shadow-xl"
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  draggable={false}
                  className="pointer-events-none size-full object-cover"
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        {total > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {photos.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Tới ảnh ${index + 1}`}
                onClick={() => goToPhoto(index)}
                className={cn(
                  "h-2 rounded-full bg-current transition-all duration-300",
                  index === active
                    ? "w-6 opacity-70"
                    : "w-2 opacity-25 hover:opacity-40",
                )}
              />
            ))}
          </div>
        )}
      </Reveal>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={photos.map((photo) => ({ src: photo.url, alt: photo.alt }))}
      />
    </section>
  );
}
