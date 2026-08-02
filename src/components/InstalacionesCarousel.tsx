// src/components/InstalacionesCarousel.tsx
// Facilities photo carousel for the home page "Instalaciones" section, hydrated
// as an Astro island. Uses Swiper (fade effect) like every other slider in the
// app. Renders nothing when `images` is empty.
import { A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import styles from './InstalacionesCarousel.module.css'

export interface CarouselImage {
  url: string
  alt: string
}

interface InstalacionesCarouselProps {
  images: CarouselImage[]
  prevLabel?: string
  nextLabel?: string
}

export default function InstalacionesCarousel({
  images,
  prevLabel = 'Previous image',
  nextLabel = 'Next image',
}: InstalacionesCarouselProps) {
  if (images.length === 0) return null

  const multiSlide = images.length > 1

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label={images[0]?.alt}
    >
      <Swiper
        className={styles.swiper}
        modules={[A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={multiSlide}
        navigation={multiSlide}
        pagination={
          multiSlide
            ? {
                clickable: true,
                renderBullet: (bulletIndex, bulletClass) =>
                  `<button type="button" class="${bulletClass}" aria-label="${
                    bulletIndex + 1
                  } / ${images.length}"></button>`,
              }
            : false
        }
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{
          prevSlideMessage: prevLabel,
          nextSlideMessage: nextLabel,
        }}
      >
        {images.map((image) => (
          <SwiperSlide key={image.url}>
            <img
              className={styles.slide}
              src={image.url}
              alt={image.alt}
              width={1152}
              height={864}
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
