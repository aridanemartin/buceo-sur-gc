// src/components/InstalacionesCarousel.tsx
// Facilities photo carousel for the home page "Instalaciones" section, hydrated
// as an Astro island. Renders nothing when `images` is empty.
import { useEffect, useState } from 'react'
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
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setIndex((i) => (i + 1) % images.length)
      }
      if (event.key === 'ArrowLeft') {
        setIndex((i) => (i - 1 + images.length) % images.length)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length])

  if (images.length === 0) return null

  const showControls = images.length > 1
  const go = (to: number) => setIndex((to + images.length) % images.length)

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label={images[index]?.alt}
    >
      <div className={styles.viewport}>
        {images.map((image, i) => (
          <img
            key={image.url}
            src={image.url}
            alt={image.alt}
            className={`${styles.slide} ${i === index ? styles.active : ''}`}
            width={1152}
            height={864}
            loading="lazy"
          />
        ))}
      </div>

      {showControls && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            onClick={() => go(index - 1)}
            aria-label={prevLabel}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={() => go(index + 1)}
            aria-label={nextLabel}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className={styles.dots}>
            {images.map((image, i) => (
              <button
                key={image.url}
                type="button"
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                onClick={() => go(i)}
                aria-label={`${i + 1} / ${images.length}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
