import { sanityClient } from 'sanity:client'
import { centroInfoData } from '../content/data/centroInfo'
import { allCoursesData } from '../content/data/courses'
import { diveSitesData } from '../content/data/diveSites'
import { experiencesData } from '../content/data/experiences'
import { tariffExtrasData } from '../content/data/tariffExtras'

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

export async function getExperiences(audience: 'beginner' | 'certified') {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "experience" && audience == $audience] | order(order asc) { ..., "image": image.asset->url }`,
      { audience },
    )
    return Array.isArray(data) && data.length > 0
      ? data
      : experiencesData.filter((e) => e.audience === audience)
  } catch {
    return experiencesData.filter((e) => e.audience === audience)
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
