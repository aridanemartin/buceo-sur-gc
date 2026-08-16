// Shared SEO helpers: absolute-URL resolution, Sanity CDN image transforms, and the
// LocalBusiness JSON-LD block emitted on every page (see BaseLayout.astro).
import type { Locale } from '../i18n/locales'
import { SITE } from './constants'

/** BCP-47 → OG "language_TERRITORY" locale codes (underscore form required by og:locale). */
export const OG_LOCALES: Record<Locale, string> = {
  es: 'es_ES',
  en: 'en_GB',
  fr: 'fr_FR',
  de: 'de_DE',
}

/** Resolves a relative path (e.g. "/assets/x.webp") or an already-absolute URL
 * (e.g. a Sanity CDN asset) to a fully-qualified URL rooted at SITE.url. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  return `${SITE.url}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

/** Appends Sanity's image-CDN transform params (bounded width + automatic format
 * negotiation, i.e. WebP/AVIF when the browser supports it) to a raw asset URL.
 * No-ops for anything that isn't a cdn.sanity.io URL (local assets, undefined). */
export function sanityImageUrl(
  url: string | undefined | null,
  opts: { width?: number; quality?: number } = {},
): string | undefined {
  if (!url) return url ?? undefined
  if (!url.includes('cdn.sanity.io')) return url
  const { width = 1400, quality = 75 } = opts
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}w=${width}&auto=format&q=${quality}`
}

/** Route keys that map to a dedicated OG image field on the `centroInfo` Sanity
 * document (see src/sanity/schemaTypes/documents/centroInfo.ts). 'legal' covers
 * cancellation/privacy/terms, which share the default rather than getting their own. */
export type OgImageRoute =
  | 'home'
  | 'dives'
  | 'baptisms'
  | 'courses'
  | 'rates'
  | 'gallery'
  | 'sidemount'
  | 'contact'
  | 'legal'

const OG_IMAGE_FIELD: Record<Exclude<OgImageRoute, 'legal'>, string> = {
  home: 'ogImageHome',
  dives: 'ogImageDives',
  baptisms: 'ogImageBaptisms',
  courses: 'ogImageCourses',
  rates: 'ogImageRates',
  gallery: 'ogImageGallery',
  sidemount: 'ogImageSidemount',
  contact: 'ogImageContact',
}

/** Resolves the og:image/twitter:image for a route: the editor-uploaded image for
 * that route, falling back to the site-wide default from Sanity, falling back to
 * the static local asset (SITE.defaultOgImage) if Studio has nothing set yet.
 * Forces real JPEG output at 1200x630 on Sanity URLs — `options.accept` on the
 * schema field only restricts the Studio file picker, not what's actually stored,
 * so this is a defensive re-encode, not just a resize. */
export function resolveOgImage(
  centroInfo: Record<string, unknown> | null | undefined,
  route: OgImageRoute,
): string {
  const routeField = route === 'legal' ? undefined : OG_IMAGE_FIELD[route]
  const raw =
    (routeField && (centroInfo?.[routeField] as string | undefined)) ||
    (centroInfo?.ogImageDefault as string | undefined) ||
    SITE.defaultOgImage
  if (!raw.includes('cdn.sanity.io')) return raw
  const separator = raw.includes('?') ? '&' : '?'
  return `${raw}${separator}w=1200&h=630&fit=crop&fm=jpg&q=80`
}

/** LocalBusiness JSON-LD, identical on every page (a single business, not per-page
 * entities) — reinforces the Google Business Profile / knowledge-panel signals. */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#business`,
    name: SITE.fullName,
    url: SITE.url,
    image: absoluteUrl(SITE.defaultOgImage),
    telephone: SITE.phones[0]?.href.replace('tel:', ''),
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.streetAddress,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      addressCountry: SITE.address.addressCountry,
    },
    sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.youtube].filter(Boolean),
  }
}

/** BreadcrumbList JSON-LD for an inner page: Home → current page. */
export function breadcrumbJsonLd(homeHref: string, pageTitle: string, pageHref: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE.fullName,
        item: absoluteUrl(homeHref),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageTitle,
        item: absoluteUrl(pageHref),
      },
    ],
  }
}
