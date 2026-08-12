// Uploads improved images to Sanity and updates sidemount course documents.
// Run: node --env-file=.env scripts/upload-sidemount-images.mjs
import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function uploadImage(filePath, attempt = 1) {
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
      return uploadImage(filePath, attempt + 1)
    }
    throw err
  }
}

// Upload both images
console.log('Uploading sidemount-improved.webp...')
const image1 = await uploadImage('/tmp/sidemount-improved.webp')
await sleep(200)

console.log('Uploading sidemount-improved2.webp...')
const image2 = await uploadImage('/tmp/sidemount-improved2.webp')

// Update the two sidemount course documents
const tx = client.transaction()

tx.patch('sidemount-course-baptism', (patch) =>
  patch.set({ image: image1 }),
)

tx.patch('sidemount-course-recreational', (patch) =>
  patch.set({ image: image2 }),
)

await tx.commit()
console.log('Sidemount courses updated with new images')
