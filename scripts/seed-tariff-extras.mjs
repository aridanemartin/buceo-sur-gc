// Seeds all tariff-extra documents (nitrox, bottles, insurance tiers) from canonical docx data.
// Run: npm run seed scripts/seed-tariff-extras.mjs
import { createClient } from '@sanity/client'
import { tariffExtrasData } from '../src/content/data/tariffExtras.ts'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const tx = client.transaction()
for (const e of tariffExtrasData) tx.createOrReplace(e)
await tx.commit()
console.log(`${tariffExtrasData.length} tariff extras seeded`)
