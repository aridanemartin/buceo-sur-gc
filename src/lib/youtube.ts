// Shared YouTube URL helpers.
//
// A YouTube link can be shared in several shapes: youtu.be/<id>,
// youtube.com/watch?v=<id>, /embed/<id>, /shorts/<id>, /live/<id>, with or
// without extra query params. Only the /embed/ form can be framed — a plain
// `watch?v=` URL is served with `X-Frame-Options: sameorigin`, so the browser
// refuses to render it inside an <iframe>. Always run URLs through
// `toYoutubeEmbedUrl` (or `getYoutubeVideoId`) before embedding.

export function getYoutubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null

  // Path-based forms: youtu.be/<id>, /embed/<id>, /shorts/<id>, /live/<id>
  const pathMatch = url.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed|shorts|live)\/)([A-Za-z0-9_-]{11})/,
  )
  if (pathMatch) return pathMatch[1]

  // Query-based form: youtube.com/watch?v=<id> (v need not be the first param)
  const watchMatch = url.match(/[?&]v=([A-Za-z0-9_-]{11})/)
  if (watchMatch) return watchMatch[1]

  return null
}

// Builds a privacy-enhanced youtube-nocookie embed URL from any YouTube link.
// Returns null when no video id can be extracted, so callers can fall back to
// an image or hide the player entirely.
export function toYoutubeEmbedUrl(
  url: string | null | undefined,
  params: Record<string, string> = {},
): string | null {
  const id = getYoutubeVideoId(url)
  if (!id) return null
  const query = new URLSearchParams(params).toString()
  return `https://www.youtube-nocookie.com/embed/${id}${query ? `?${query}` : ''}`
}

export function getYoutubeThumbnail(url: string | null | undefined): string | null {
  const id = getYoutubeVideoId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
