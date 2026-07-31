// Seeds all dive-site documents (Galería) from canonical docx-sourced data.
// Images are left empty — the user uploads real photos via Sanity Studio,
// matching doc 6's note that the gallery is meant to be updated over time.
// Run: npm run seed scripts/seed-dive-sites.mjs
import { createClient } from '@sanity/client'
import { diveSitesData } from '../src/content/data/diveSites.ts'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const tx = client.transaction()
for (const s of diveSitesData) tx.createOrReplace(s)
await tx.commit()
console.log(`${diveSitesData.length} dive sites seeded`)
