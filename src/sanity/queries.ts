import { sanityClient } from 'sanity:client'
import { baptismsData } from '../content/data/baptisms'
import { centroInfoData } from '../content/data/centroInfo'
import { allCoursesData } from '../content/data/courses'
import { divesData } from '../content/data/dives'
import { diveSitesData } from '../content/data/diveSites'
import { homeTexts, pageTextsByType } from '../content/data/pageTexts'
import { tariffExtrasData } from '../content/data/tariffExtras'
import type { Locale } from '../i18n/locales'
import { ui } from '../i18n/strings'
import { mergeTexts, resolveTexts } from './pageTexts'

// All query helpers fall back to the canonical docx-sourced data (src/content/data)
// when Sanity is not configured, unreachable, OR the dataset is still empty (not yet
// seeded). Once documents exist, the CMS content takes over automatically.

export async function getCentroInfo() {
  try {
    const data = await sanityClient.fetch(`
      *[_type == "centroInfo"][0] {
        ...,
        "heroImage": heroImage.asset->url,
        "installationsImages": installationsImages[].asset->url,
        staff[] {
          ...,
          "photo": photo.asset->url,
        },
        certifications[] {
          ...,
          "logo": logo.asset->url,
        },
        "mapImage": mapImage.asset->url,
        "ogImageDefault": ogImageDefault.asset->url,
        "ogImageHome": ogImageHome.asset->url,
        "ogImageDives": ogImageDives.asset->url,
        "ogImageBaptisms": ogImageBaptisms.asset->url,
        "ogImageCourses": ogImageCourses.asset->url,
        "ogImageRates": ogImageRates.asset->url,
        "ogImageGallery": ogImageGallery.asset->url,
        "ogImageSidemount": ogImageSidemount.asset->url,
        "ogImageContact": ogImageContact.asset->url,
      }
    `)
    return data ?? centroInfoData
  } catch {
    return centroInfoData
  }
}

export async function getCourses() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "course"] | order(order asc) { ..., "image": image.asset->url, "agency": agency->name }`,
    )
    return Array.isArray(data) && data.length > 0 ? data : allCoursesData
  } catch {
    return allCoursesData
  }
}

export async function getCertifyingAgencies() {
  try {
    const data = await sanityClient.fetch(`
      *[_type == "certifyingAgency"] {
        name,
        "logo": logo.asset->url,
      }
    `)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function getBaptisms() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "baptism"] | order(order asc) { ..., "image": image.asset->url }`,
    )
    return Array.isArray(data) && data.length > 0 ? data : baptismsData
  } catch {
    return baptismsData
  }
}

export async function getDives() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "dive"] | order(order asc) { ..., "image": image.asset->url }`,
    )
    return Array.isArray(data) && data.length > 0 ? data : divesData
  } catch {
    return divesData
  }
}

export async function getDiveSites() {
  try {
    const data = await sanityClient.fetch(`
      *[_type == "diveSite"] | order(order asc) {
        ...,
        "images": images[].asset->url
      }
    `)
    return Array.isArray(data) && data.length > 0 ? data : diveSitesData
  } catch {
    return diveSitesData
  }
}

export async function getTariffExtras() {
  try {
    const data = await sanityClient.fetch(`*[_type == "tariffExtra"] | order(order asc)`)
    return Array.isArray(data) && data.length > 0 ? data : tariffExtrasData
  } catch {
    return tariffExtrasData
  }
}

export async function getSidemountCourses() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "sidemountCourse"] | order(order asc) { ..., "image": image.asset->url, "agency": agency->name }`,
    )
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

// --- Page texts ("Contenido" singletons) --------------------------------
// Each singleton's _id is its type name. The Sanity document is merged leaf by
// leaf over the canonical fallback (src/content/data/pageTexts.ts), so a
// missing document or an empty field keeps today's copy instead of a blank.

type PageType = keyof typeof pageTextsByType

// Every page renders the layout, footer and banner, which all read
// siteSettings: memoize per build so it is fetched once, not ~150 times.
// In dev there is no cache, so Studio edits show up on reload.
const pageDocCache = new Map<PageType, Promise<unknown>>()

function fetchPageDoc(type: PageType): Promise<unknown> {
  const load = async () => {
    try {
      return await sanityClient.fetch(
        `*[_id == $id][0] {
          ...,
          sections[] {
            ...,
            "image": image.asset->url,
            "imageWidth": image.asset->metadata.dimensions.width,
            "imageHeight": image.asset->metadata.dimensions.height,
            "images": images[].asset->url,
          },
        }`,
        { id: type },
      )
    } catch {
      return null
    }
  }
  if (!import.meta.env.PROD) return load()
  if (!pageDocCache.has(type)) pageDocCache.set(type, load())
  return pageDocCache.get(type)!
}

/** The texts of one page singleton, resolved to plain strings for `lang`. */
export async function getPageTexts<K extends PageType>(type: K, lang: Locale) {
  const data = await fetchPageDoc(type)
  return resolveTexts(mergeTexts(pageTextsByType[type], data), lang)
}

/**
 * Shared UI strings for `lang`: the "Textos globales" singleton (nav, footer,
 * booking banner, card labels…) on top of the code-only strings (a11y labels).
 */
export async function getUi(lang: Locale) {
  const site = await getPageTexts('siteSettings', lang)
  return { ...ui[lang], ...site }
}

/** Home section headings, stored as top-level fields of the centroInfo document. */
export function getHomeTexts(info: unknown, lang: Locale) {
  return resolveTexts(mergeTexts(homeTexts, info), lang)
}
