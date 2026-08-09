// One-off migration: converts existing course.agency values from a plain
// string (SSI/CMAS/PADI/FSGT) to a reference to the matching certifyingAgency
// document. Run scripts/seed-certifying-agencies.mjs first. Safe to re-run —
// skips courses whose agency is already a reference.
// Run: npm run seed scripts/migrate-course-agency-refs.mjs
import { createClient } from '@sanity/client'
import { agencyIdByName } from '../src/content/data/certifyingAgencies.ts'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const courses = await client.fetch(`*[_type == "course" && defined(agency)]{_id, agency}`)
const toMigrate = courses.filter((c) => typeof c.agency === 'string')

if (toMigrate.length === 0) {
  console.log('No courses need migrating.')
} else {
  const tx = client.transaction()
  for (const c of toMigrate) {
    const agencyId = agencyIdByName[c.agency]
    if (!agencyId) throw new Error(`Unknown agency "${c.agency}" for course ${c._id}`)
    tx.patch(c._id, { set: { agency: { _type: 'reference', _ref: agencyId } } })
  }
  await tx.commit()
  console.log(`${toMigrate.length} course(s) migrated to agency references.`)
}
