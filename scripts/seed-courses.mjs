// Seeds all course documents from the canonical docx-sourced data, uploading each
// course's image from assets/courses/*.webp (sourced from SSI's official course pages).
// Run: npm run seed scripts/seed-courses.mjs
import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { agencyIdByName } from '../src/content/data/certifyingAgencies.ts'
import { allCoursesData } from '../src/content/data/courses.ts'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const assetsDir = new URL('../assets/courses/', import.meta.url).pathname

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// NOTE: `client.assets.upload` fails with "Unprocessable Entity - Invalid image" for this
// Sanity project, but the raw POST to /assets/images works. Use the raw request instead.
// Uploads must run sequentially (not in parallel) or Sanity's API returns 429 Too Many Requests.
async function uploadImage(filePath, label, attempt = 1) {
  try {
    const data = readFileSync(filePath)
    const asset = await client.request({
      uri: `/assets/images/${process.env.SANITY_DATASET ?? 'production'}`,
      method: 'POST',
      headers: { 'Content-Type': 'image/webp' },
      body: data,
    })
    const id = asset.document?._id ?? asset._id
    if (!id) throw new Error('upload returned no asset id')
    return { _type: 'image', asset: { _ref: id } }
  } catch (err) {
    if (err.message.includes('Too Many Requests') && attempt < 5) {
      await sleep(attempt * 1000)
      return uploadImage(filePath, label, attempt + 1)
    }
    console.warn(`[skip] image ${label}: ${err.message}`)
    return null
  }
}

// Each source image comes from SSI's own product page for the matching course
// (divessi.com/es/get-certified, /es/advanced-training/scuba-diving and /es/professional).
// Courses without a direct SSI match (CMAS courses, bundles) reuse the closest SSI
// specialty image by depth/level/theme — every course gets a distinct image.
const courseImageFile = {
  'course-scuba-diver': 'scuba-diver-basic.webp',
  'course-open-water': 'open-water-diver.webp',
  'course-advanced-open-water': 'continue-scuba-advanced.webp',
  'course-deep-diving': 'deep-diving.webp',
  'course-nitrox': 'nitrox.webp',
  'course-deco': 'decompression.webp',
  'course-navigation': 'navigation.webp',
  'course-rescue': 'rescue.webp',
  'course-react-right': 'dive-guide.webp',
  'course-pe12': 'buoyancy.webp',
  'course-pe20': 'night-diving.webp',
  'course-pa20': 'dpv-cave.webp',
  'course-pe40': 'dry-suit-gully.webp',
  'course-niveau-2': 'wreck.webp',
  'course-sidemount-baptism': 'try-scuba.webp',
  'course-sidemount-recreational': 'sidemount.webp',
  'course-pack-2-specialties': 'turtle-ecology.webp',
  'course-pack-3-specialties': 'manta-ecology.webp',
}

// Cache uploads so images shared across multiple courses only upload once.
const uploadedByFile = {}

const courses = []
for (const c of allCoursesData) {
  const file = courseImageFile[c._id]
  let image = null
  if (file) {
    if (!uploadedByFile[file]) {
      uploadedByFile[file] = await uploadImage(assetsDir + file, file)
      await sleep(150)
    }
    image = uploadedByFile[file]
  }
  const agencyId = agencyIdByName[c.agency]
  if (!agencyId) throw new Error(`Unknown agency "${c.agency}" for course ${c._id}`)
  const agency = { _type: 'reference', _ref: agencyId }
  courses.push({ ...c, agency, ...(image ? { image } : {}) })
}

const tx = client.transaction()
for (const c of courses) tx.createOrReplace(c)
await tx.commit()
console.log(`${courses.length} courses seeded`)
