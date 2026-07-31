// Seeds all experience documents (bautizos + inmersiones) from canonical docx-sourced data.
// Run: npm run seed scripts/seed-experiences.mjs
import { createClient } from '@sanity/client'
import { experiencesData } from '../src/content/data/experiences.ts'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const tx = client.transaction()
for (const e of experiencesData) tx.createOrReplace(e)
await tx.commit()
console.log(`${experiencesData.length} experiences seeded`)
