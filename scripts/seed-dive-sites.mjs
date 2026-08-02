// Seeds all dive-site documents (Galería) from canonical docx-sourced data,
// uploading each site's photos from assets/dive-sites/<id>/*.webp.
// Run: npm run seed scripts/seed-dive-sites.mjs
import { createClient } from '@sanity/client'
import { readdirSync } from 'node:fs'
import { diveSitesData } from '../src/content/data/diveSites.ts'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const assetsDir = new URL('../assets/dive-sites/', import.meta.url).pathname

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// NOTE: `client.assets.upload` fails with "Unprocessable Entity - Invalid image" for this
// Sanity project, but the raw POST to /assets/images works. Use the raw request instead.
// Uploads must run sequentially (not in parallel) or Sanity's API returns 429 Too Many Requests.
async function uploadImage(filePath, label, attempt = 1) {
  try {
    const { readFileSync } = await import('node:fs')
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

const sites = []
for (const site of diveSitesData) {
  const siteDir = `${assetsDir}${site._id}/`
  const files = readdirSync(siteDir)
    .filter((f) => f.endsWith('.webp'))
    .sort()
  const images = []
  for (const file of files) {
    const image = await uploadImage(siteDir + file, `${site._id}/${file}`)
    if (image) images.push({ ...image, _key: `${site._id}-${images.length}` })
    await sleep(150)
  }
  sites.push({ ...site, images })
}

const tx = client.transaction()
for (const s of sites) tx.createOrReplace(s)
await tx.commit()
console.log(`${sites.length} dive sites seeded`)
