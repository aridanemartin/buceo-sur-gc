// src/components/Lightbox.tsx
// Thumbnail grid + full-screen overlay lightbox, hydrated as an Astro island.
// Renders nothing when `images` is empty (e.g. a dive site with no photos yet).
import { useEffect, useState } from 'react'
import styles from './Lightbox.module.css'

export interface GalleryImage {
  url: string
  alt: string
}

interface LightboxProps {
  images: GalleryImage[]
}

export default function Lightbox({ images }: LightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    if (activeIndex === null) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null)
      if (event.key === 'ArrowRight') {
        setActiveIndex((i) => (i === null ? i : (i + 1) % images.length))
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length))
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [activeIndex, images.length])

  if (images.length === 0) return null

  const activeImage = activeIndex !== null ? images[activeIndex] : null

  return (
    <>
      <ul className={styles.grid}>
        {images.map((image, index) => (
          <li key={image.url}>
            <button
              type="button"
              className={styles.thumbBtn}
              onClick={() => setActiveIndex(index)}
              aria-label={image.alt}
            >
              <img src={image.url} alt={image.alt} loading="lazy" className={styles.thumb} />
            </button>
          </li>
        ))}
      </ul>

      {activeImage && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          onClick={() => setActiveIndex(null)}
        >
          <img src={activeImage.url} alt={activeImage.alt} className={styles.full} />
        </div>
      )}
    </>
  )
}
