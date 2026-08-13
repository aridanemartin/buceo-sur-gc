export type GalleryMedia<T> = { type: 'image'; item: T } | { type: 'video'; url: string }

export function orderGalleryMedia<T>(images: T[], videoUrl?: string, videoFirst = true): GalleryMedia<T>[] {
  const imageMedia = images.map((item) => ({ type: 'image' as const, item }))

  if (!videoUrl) return imageMedia

  const video = { type: 'video' as const, url: videoUrl }
  return videoFirst ? [video, ...imageMedia] : [...imageMedia, video]
}
