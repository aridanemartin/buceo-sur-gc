// src/components/GallerySwiper.tsx
// One-at-a-time photo carousel for a dive site, autoplaying with a progress bar.
// The optional site video is included as its own slide: tapping its thumbnail
// plays the embed inline and pauses autoplay until the user moves on.
import { useEffect, useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
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
  const [videoPlaying, setVideoPlaying] = useState(false)
  const swiperRef = useRef<SwiperType | null>(null)

  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper?.autoplay) return
    if (videoPlaying) swiper.autoplay.stop()
    else swiper.autoplay.start()
  }, [videoPlaying])

  if (images.length === 0 && !videoUrl) return null

  const videoThumbnail = videoUrl ? getYoutubeThumbnail(videoUrl) : null
  const slideCount = images.length + (videoUrl ? 1 : 0)
  const multiSlide = slideCount > 1

  return (
    <Swiper
      className={styles.swiper}
      modules={[Autoplay, Navigation, Pagination]}
      onSwiper={(swiper) => {
        swiperRef.current = swiper
      }}
      onSlideChange={() => setVideoPlaying(false)}
      loop={multiSlide}
      autoplay={multiSlide ? { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
      navigation={multiSlide}
      pagination={multiSlide ? { type: 'progressbar' } : false}
    >
      {videoUrl && (
        <SwiperSlide>
          {videoPlaying ? (
            <iframe
              className={styles.media}
              src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
              title={videoAlt ?? 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className={styles.videoThumbBtn}
              onClick={() => setVideoPlaying(true)}
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
