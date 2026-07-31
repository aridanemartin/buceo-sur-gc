import { sanityClient } from 'sanity:client'

export async function getCentroInfo() {
  return sanityClient.fetch(`
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
}

export async function getCourses() {
  return sanityClient.fetch(`*[_type == "course"] | order(order asc)`)
}

export async function getCoursesByTag(tag: string) {
  return sanityClient.fetch(`*[_type == "course" && $tag in tags] | order(order asc)`, { tag })
}

export async function getExperiences(audience: 'beginner' | 'certified') {
  return sanityClient.fetch(
    `*[_type == "experience" && audience == $audience] | order(order asc)`,
    { audience },
  )
}

export async function getDiveSites() {
  // Projects `images` down to plain asset URL strings so callers never touch
  // unresolved Sanity image-asset references.
  return sanityClient.fetch(`
    *[_type == "diveSite"] | order(order asc) {
      ...,
      "images": images[].asset->url
    }
  `)
}

export async function getTariffExtras() {
  return sanityClient.fetch(`*[_type == "tariffExtra"] | order(order asc)`)
}
