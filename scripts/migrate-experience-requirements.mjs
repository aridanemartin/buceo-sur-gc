// Migrates Sanity experience documents: moves the prerequisites/conditions
// prose out of `groupDiscount` (localeStringOptional) into a new
// `requirements` (localeList) field — the same card used by the Cursos page.
//
// Beginner experiences (bautizos): the text starts with "Requisitos:"/
// "Requirements:"/"Conditions :"/"Voraussetzungen:" and is an enumeration,
// so it is split on segment boundaries ('. ', ', ', ' y ', ' and ', …).
// Certified experiences (inmersiones): plain prose ("Mínimo 2 participantes…")
// is split only on sentence enders ('. ') so conjunctions inside a sentence
// ("hace más de un año y has realizado…") are preserved.
//
// Run (dry run by default — prints what would change, commits nothing):
//   node --env-file=.env scripts/migrate-experience-requirements.mjs
// Apply the migration:
//   node --env-file=.env scripts/migrate-experience-requirements.mjs --apply
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const LOCALES = ['es', 'en', 'fr', 'de']

// "Requisitos: …", "Requirements: …", "Conditions : …", "Voraussetzungen: …"
// — the label is now rendered by the card itself, so the prefix is dropped.
const PREFIX = /^(?:Requisitos|Requirements|Conditions|Voraussetzungen)\s*:\s*/i

// Beginner splitter: full segment split (sentence enders + conjunctions).
const SEGMENT_SPLIT = /(?:\.\s+|\s*,\s*|\s+y\s+|\s+and\s+|\s+plus\s+|\s+et\s+|\s+und\s+)/i
// Certified splitter: sentence enders only.
const SENTENCE_SPLIT = /\.\s+/

function toItems(text, splitter, stripPrefix) {
  if (!text || typeof text !== 'string') return []
  const cleaned = stripPrefix ? text.replace(PREFIX, '') : text
  return cleaned
    .split(splitter)
    .map((s) => s.trim().replace(/\.$/, ''))
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
}

function buildRequirements(groupDiscount, audience) {
  const stripPrefix = audience === 'beginner'
  const splitter = audience === 'beginner' ? SEGMENT_SPLIT : SENTENCE_SPLIT
  const out = {}
  for (const locale of LOCALES) {
    const items = toItems(groupDiscount?.[locale], splitter, stripPrefix)
    if (items.length) out[locale] = items
  }
  return Object.keys(out).length ? { _type: 'localeList', ...out } : null
}

const apply = process.argv.includes('--apply')

const docs = await client.fetch(
  `*[_type == "experience"] { _id, audience, groupDiscount, requirements }`,
)

const tx = client.transaction()
let pending = 0
let skipped = 0

for (const doc of docs) {
  const hasOld = !!doc.groupDiscount && typeof doc.groupDiscount === 'object'
  const hasNew = !!doc.requirements && typeof doc.requirements === 'object'
  const hasOldText = hasOld && Object.values(doc.groupDiscount).some((v) => v && v.trim())
  if (!hasOldText || hasNew) {
    skipped += 1
    continue
  }
  const requirements = buildRequirements(doc.groupDiscount, doc.audience)
  if (!requirements) {
    skipped += 1
    continue
  }
  console.log(`[experience:${doc.audience}] ${doc._id}`)
  for (const locale of LOCALES) {
    if (requirements[locale]) console.log(`   ${locale}: ${JSON.stringify(requirements[locale])}`)
  }
  if (apply) {
    tx.patch(doc._id, (patch) => patch.set({ requirements }).unset(['groupDiscount']))
    pending += 1
  }
}

if (apply) {
  if (pending === 0) {
    console.log('Nothing to migrate.')
  } else {
    await tx.commit()
    console.log(`Migrated ${pending} document(s): groupDiscount → requirements.`)
  }
} else {
  console.log(`\nDry run: ${docs.length} document(s) checked, nothing committed. Pass --apply to write.`)
}
