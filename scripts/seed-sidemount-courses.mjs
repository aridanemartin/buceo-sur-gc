// Seeds sidemount course documents from the canonical data into Sanity.
// Run: npm run seed scripts/seed-sidemount-courses.mjs
import { createClient } from '@sanity/client'
import { agencyIdByName } from '../src/content/data/certifyingAgencies.ts'
import { sidemountCoursesData } from '../src/content/data/sidemountCourses.ts'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const courses = sidemountCoursesData.map((c) => {
  const agencyId = agencyIdByName[c.agency]
  if (!agencyId) throw new Error(`Unknown agency "${c.agency}" for course ${c._id}`)
  const agency = { _type: 'reference', _ref: agencyId }
  return { ...c, agency }
})

const tx = client.transaction()
for (const c of courses) tx.createOrReplace(c)
await tx.commit()
console.log(`${courses.length} sidemount courses seeded`)
