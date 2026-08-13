// src/components/GallerySwiper.tsx
// One-at-a-time photo carousel for a dive site with manual navigation.
// The optional site video can appear before or after the photos. Whenever that
// slide is active the embed mounts and autoplays muted with the player chrome
// hidden. On other slides a thumbnail navigates back to the video.
import { useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { orderGalleryMedia } from '../lib/galleryVideoPosition'
import { sanityImageUrl } from '../lib/seo'
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
  videoFirst?: boolean
}

function getYoutubeThumbnail(embedUrl: string): string | null {
  const match = embedUrl.match(/embed\/([a-zA-Z0-9_-]+)/)
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
}

// The blurred backdrop (.slide::before) reads its image from this div's own
// background-image via `inherit`, but CSS background-images always fetch
// eagerly — setting it upfront would defeat the <img>'s native lazy loading
// and pull every slide's photo on page load. Only apply it once the <img>
// itself has actually loaded, so the backdrop follows the same lazy timing.
function GallerySlideImage({ url, alt }: GalleryImage) {
  const [loaded, setLoaded] = useState(false)
  const src = sanityImageUrl(url, { width: 1600 })
  return (
    <div className={styles.slide} style={loaded ? { backgroundImage: `url(${src})` } : undefined}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={styles.media}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

export default function GallerySwiper({ images, videoUrl, videoAlt, videoFirst }: GallerySwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)
  const media = orderGalleryMedia(images, videoUrl, videoFirst)
  const videoIndex = media.findIndex((item) => item.type === 'video')

  const isVideoActive = videoIndex >= 0 && activeIndex === videoIndex

  if (images.length === 0 && !videoUrl) return null

  const videoThumbnail = videoUrl ? getYoutubeThumbnail(videoUrl) : null
  const slideCount = media.length
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
      {media.map((item) => (
        <SwiperSlide key={item.type === 'video' ? item.url : item.item.url}>
          {item.type === 'video' ? (
            isVideoActive ? (
              <iframe
                className={styles.media}
                src={`${item.url}${item.url.includes('?') ? '&' : '?'}autoplay=1&mute=1&controls=0`}
                title={videoAlt ?? 'Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                className={styles.videoThumbBtn}
                onClick={() => swiperRef.current?.slideToLoop(videoIndex)}
                aria-label={videoAlt ?? 'Video'}
                style={videoThumbnail ? { backgroundImage: `url(${videoThumbnail})` } : undefined}
              >
                {videoThumbnail && (
                  <img
                    src={videoThumbnail}
                    alt={videoAlt ?? 'Video'}
                    loading="lazy"
                    className={styles.media}
                  />
                )}
                <span className={styles.playIcon} aria-hidden="true">
                  ▶
                </span>
              </button>
            )
          ) : (
            <GallerySlideImage url={item.item.url} alt={item.item.alt} />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
