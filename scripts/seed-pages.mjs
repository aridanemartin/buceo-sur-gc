// Seeds the "Páginas web" singletons from the canonical page copy in
// src/content/data/pageTexts.ts, so the Studio starts with exactly the texts
// the site shows today.
//
// Production-safe by construction:
//   - page singletons are created with createIfNotExists (an existing document,
//     edited or not, is never touched);
//   - centroInfo only gets the new `homeTexts` field via setIfMissing — none of
//     its existing fields are read or written.
//
// Dry run (default) prints what would happen; pass --apply to write.
// Run: node --env-file=.env scripts/seed-pages.mjs [--apply]
import { createClient } from '@sanity/client'
import { homeTexts, pageTextsByType } from '../src/content/data/pageTexts.ts'

const apply = process.argv.includes('--apply')

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: 'raw',
})

// Array items need _type and a stable _key in Sanity; locale leaves inside
// arrays are paragraphs (localeText).
function toSanity(value) {
  if (Array.isArray(value)) {
    return value.map((item, i) => ({ _type: 'localeText', _key: `p${i}`, ...toSanity(item) }))
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toSanity(v)]))
  }
  return value
}

const ids = [...Object.keys(pageTextsByType), 'centroInfo']
const existing = await client.fetch(`*[_id in $ids || _id in $drafts]{ _id, "hasHomeTexts": defined(homeTexts) }`, {
  ids,
  drafts: ids.map((id) => `drafts.${id}`),
})
const byId = new Map(existing.map((d) => [d._id, d]))

const tx = client.transaction()
let changes = 0

for (const [type, texts] of Object.entries(pageTextsByType)) {
  if (byId.has(type) || byId.has(`drafts.${type}`)) {
    console.log(`[skip] ${type}: already exists`)
    continue
  }
  console.log(`[create] ${type}`)
  tx.createIfNotExists({ _id: type, _type: type, ...toSanity(texts) })
  changes++
}

// centroInfo: add homeTexts to the published doc and to a pending draft, if any.
for (const id of ['centroInfo', 'drafts.centroInfo']) {
  const doc = byId.get(id)
  if (!doc) continue
  if (doc.hasHomeTexts) {
    console.log(`[skip] ${id}.homeTexts: already set`)
    continue
  }
  console.log(`[patch] ${id}: setIfMissing homeTexts`)
  tx.patch(id, (p) => p.setIfMissing({ homeTexts: toSanity(homeTexts) }))
  changes++
}

if (!changes) {
  console.log('Nothing to do.')
} else if (!apply) {
  console.log(`\nDry run: ${changes} change(s) pending. Re-run with --apply to write.`)
} else {
  const res = await tx.commit()
  console.log(`\nApplied ${changes} change(s) — transaction ${res.transactionId}`)
}
