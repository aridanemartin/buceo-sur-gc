// Migrates Sanity course documents: renames `prerequisites` (localeText) to
// `requirements` (localeList), splitting each locale's prose into list items
// on segment boundaries ('. ', ', ', ' y ', ' and ', ' plus ', ' et ', ' und ').
//
// Mirrors the manual conversion already done in src/content/data/courses.ts
// so the CMS path renders the same check-list card as the seed-data fallback.
//
// Run (dry run by default — prints what would change, commits nothing):
//   node --env-file=.env scripts/migrate-requirements.mjs
// Apply the migration:
//   node --env-file=.env scripts/migrate-requirements.mjs --apply
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const LOCALES = ['es', 'en', 'fr', 'de']

// Deterministic prose → list-items splitter: breaks on sentence enders and
// the conjunctions/comma joins used across the four locales, trims trailing
// periods and capitalises each item's first letter.
function toItems(text) {
  if (!text || typeof text !== 'string') return []
  return text
    .split(/(?:\.\s+|\s*,\s*|\s+y\s+|\s+and\s+|\s+plus\s+|\s+et\s+|\s+und\s+)/i)
    .map((s) => s.trim().replace(/\.$/, ''))
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
}

function buildRequirements(prerequisites) {
  const out = {}
  for (const locale of LOCALES) {
    const items = toItems(prerequisites?.[locale])
    if (items.length) out[locale] = items
  }
  return Object.keys(out).length ? { _type: 'localeList', ...out } : null
}

const apply = process.argv.includes('--apply')

const types = ['course', 'sidemountCourse']
const docs = []
for (const type of types) {
  const found = await client.fetch(
    `*[_type == $type] { _id, _type, prerequisites, requirements }`,
    { type },
  )
  docs.push(...found)
}

const tx = client.transaction()
let pending = 0
let skipped = 0

for (const doc of docs) {
  const hasOld = !!doc.prerequisites && typeof doc.prerequisites === 'object'
  const hasNew = !!doc.requirements && typeof doc.requirements === 'object'
  if (!hasOld || hasNew) {
    skipped += 1
    continue
  }
  const requirements = buildRequirements(doc.prerequisites)
  if (!requirements) {
    skipped += 1
    continue
  }
  console.log(`[${doc._type}] ${doc._id}`)
  for (const locale of LOCALES) {
    if (requirements[locale]) console.log(`   ${locale}: ${JSON.stringify(requirements[locale])}`)
  }
  if (apply) {
    tx.patch(doc._id, (patch) => patch.set({ requirements }).unset(['prerequisites']))
    pending += 1
  }
}

if (apply) {
  if (pending === 0) {
    console.log('Nothing to migrate.')
  } else {
    await tx.commit()
    console.log(`Migrated ${pending} document(s): prerequisites → requirements.`)
  }
} else {
  console.log(`\nDry run: ${docs.length} document(s) checked, ${pending === 0 ? 'would migrate' : ''} nothing committed. Pass --apply to write.`)
}
