// Seeds all course documents from the canonical docx-sourced data.
// Run: npm run seed scripts/seed-courses.mjs
import { createClient } from '@sanity/client'
import { allCoursesData } from '../src/content/data/courses.ts'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const tx = client.transaction()
for (const c of allCoursesData) tx.createOrReplace(c)
await tx.commit()
console.log(`${allCoursesData.length} courses seeded`)
