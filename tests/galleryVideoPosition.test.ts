import assert from 'node:assert/strict'
import test from 'node:test'

let galleryMedia: undefined | {
  orderGalleryMedia: (images: string[], videoUrl?: string, videoFirst?: boolean) => Array<
    { type: 'image'; item: string } | { type: 'video'; url: string }
  >
}

try {
  galleryMedia = await import('../src/lib/galleryVideoPosition.ts')
} catch {
  galleryMedia = undefined
}

test('places a gallery video after the images when the CMS switch is off', () => {
  assert.ok(galleryMedia, 'The gallery media ordering helper must be exported')

  assert.deepEqual(
    galleryMedia.orderGalleryMedia(['first.webp', 'second.webp'], 'https://youtube.com/embed/video', false),
    [
      { type: 'image', item: 'first.webp' },
      { type: 'image', item: 'second.webp' },
      { type: 'video', url: 'https://youtube.com/embed/video' },
    ],
  )
})

test('keeps gallery videos first by default for existing CMS documents', () => {
  assert.ok(galleryMedia, 'The gallery media ordering helper must be exported')

  assert.deepEqual(
    galleryMedia.orderGalleryMedia(['first.webp'], 'https://youtube.com/embed/video'),
    [
      { type: 'video', url: 'https://youtube.com/embed/video' },
      { type: 'image', item: 'first.webp' },
    ],
  )
})
