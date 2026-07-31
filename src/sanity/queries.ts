import { sanityClient } from 'sanity:client'
import { centroInfoData } from '../content/data/centroInfo'
import { allCoursesData } from '../content/data/courses'
import { experiencesData } from '../content/data/experiences'
import { diveSitesData } from '../content/data/diveSites'
import { tariffExtrasData } from '../content/data/tariffExtras'

// All query helpers fall back to the canonical docx-sourced data (src/content/data)
// when Sanity is not configured or unreachable (e.g. placeholder .env during development,
// or a build before the user creates their Sanity project). Once Sanity is live and seeded,
// the CMS content takes over automatically.

export async function getCentroInfo() {
  try {
    const data = await sanityClient.fetch(`
      *[_type == "centroInfo"][0] {
        ...,
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
      }
    `)
    return data ?? centroInfoData
  } catch {
    return centroInfoData
  }
}

export async function getCourses() {
  try {
    return await sanityClient.fetch(`*[_type == "course"] | order(order asc)`)
  } catch {
    return allCoursesData
  }
}

export async function getCoursesByTag(tag: string) {
  try {
    return await sanityClient.fetch(`*[_type == "course" && $tag in tags] | order(order asc)`, { tag })
  } catch {
    return allCoursesData.filter((c) => c.tags?.includes(tag))
  }
}

export async function getExperiences(audience: 'beginner' | 'certified') {
  try {
    return await sanityClient.fetch(
      `*[_type == "experience" && audience == $audience] | order(order asc)`,
      { audience },
    )
  } catch {
    return experiencesData.filter((e) => e.audience === audience)
  }
}

export async function getDiveSites() {
  try {
    return await sanityClient.fetch(`
      *[_type == "diveSite"] | order(order asc) {
        ...,
        "images": images[].asset->url
      }
    `)
  } catch {
    return diveSitesData
  }
}

export async function getTariffExtras() {
  try {
    return await sanityClient.fetch(`*[_type == "tariffExtra"] | order(order asc)`)
  } catch {
    return tariffExtrasData
  }
}
