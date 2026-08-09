// src/components/GallerySwiper.tsx
// One-at-a-time photo carousel for a dive site with manual navigation.
// The optional site video is the first slide: whenever that slide is active the
// embed mounts and autoplays muted with the player chrome hidden, pausing the
// carousel until the user swipes away. On other slides a thumbnail is shown
// that navigates back to the video.
import { useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './GallerySwiper.module.css'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export interface GalleryImage {
  url: string
  alt: string
}

interface GallerySwiperProps {
  images: GalleryImage[]
  videoUrl?: string
  videoAlt?: string
}

function getYoutubeThumbnail(embedUrl: string): string | null {
  const match = embedUrl.match(/embed\/([a-zA-Z0-9_-]+)/)
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
}

export default function GallerySwiper({ images, videoUrl, videoAlt }: GallerySwiperProps) {
  // The video is always the first slide, so realIndex 0 == video slide active.
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)

  const isVideoActive = Boolean(videoUrl) && activeIndex === 0

  if (images.length === 0 && !videoUrl) return null

  const videoThumbnail = videoUrl ? getYoutubeThumbnail(videoUrl) : null
  const slideCount = images.length + (videoUrl ? 1 : 0)
  const multiSlide = slideCount > 1

  return (
    <Swiper
      className={styles.swiper}
      modules={[Navigation, Pagination]}
      onSwiper={(swiper) => {
        swiperRef.current = swiper
      }}
      onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      loop={multiSlide}
      navigation={multiSlide}
      pagination={multiSlide ? { type: 'progressbar' } : false}
    >
      {videoUrl && (
        <SwiperSlide>
          {isVideoActive ? (
            <iframe
              className={styles.media}
              src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1&mute=1&controls=0`}
              title={videoAlt ?? 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className={styles.videoThumbBtn}
              onClick={() => swiperRef.current?.slideToLoop(0)}
              aria-label={videoAlt ?? 'Video'}
              style={videoThumbnail ? { backgroundImage: `url(${videoThumbnail})` } : undefined}
            >
              {videoThumbnail && (
                <img src={videoThumbnail} alt={videoAlt ?? 'Video'} className={styles.media} />
              )}
              <span className={styles.playIcon} aria-hidden="true">
                ▶
              </span>
            </button>
          )}
        </SwiperSlide>
      )}
      {images.map((image) => (
        <SwiperSlide key={image.url}>
          <div className={styles.slide} style={{ backgroundImage: `url(${image.url})` }}>
            <img src={image.url} alt={image.alt} loading="lazy" className={styles.media} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
