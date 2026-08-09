// Seeds the certifying agency documents (SSI, CMAS, PADI, FSGT) referenced by
// courses. Idempotent (createOrReplace) — safe to re-run. Run this before
// seed-courses.mjs, since courses reference these documents by id.
// Run: npm run seed scripts/seed-certifying-agencies.mjs
import { createClient } from '@sanity/client'
import { certifyingAgenciesData } from '../src/content/data/certifyingAgencies.ts'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const tx = client.transaction()
for (const a of certifyingAgenciesData) tx.createOrReplace(a)
await tx.commit()
console.log(`${certifyingAgenciesData.length} certifying agencies seeded`)
