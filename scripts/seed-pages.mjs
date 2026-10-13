// Seeds the "Contenido" singletons from the canonical page copy in
// src/content/data/pageTexts.ts, so the Studio starts with exactly the texts
// and images the site shows today.
//
// Production-safe by construction — it only ever ADDS:
//   - a missing page singleton is created (createIfNotExists);
//   - on an existing singleton, each top-level field is set only if it is
//     missing (setIfMissing), so nothing an editor wrote is ever overwritten;
//   - centroInfo only gets the home headings (setIfMissing, top-level fields).
// Section images are uploaded from public/ (webp, one at a time — the asset API
// rate-limits parallel uploads, and client.assets.upload is rejected for this
// project, so the raw assets endpoint is used). Sanity dedupes identical files.
//
// Dry run (default) prints what would happen; pass --apply to write.
// Run: node --env-file=.env scripts/seed-pages.mjs [--apply]
import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { homeTexts, pageTextsByType, seedOnlyTexts } from '../src/content/data/pageTexts.ts'

const apply = process.argv.includes('--apply')
const dataset = process.env.SANITY_DATASET ?? 'production'
const publicDir = new URL('../public', import.meta.url).pathname

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: 'raw',
})

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function uploadImage(publicPath, attempt = 1) {
  if (!apply) {
    console.log(`  [would upload] ${publicPath}`)
    return { _type: 'image', asset: { _ref: `(dry-run) ${publicPath}` } }
  }
  try {
    const asset = await client.request({
      uri: `/assets/images/${dataset}`,
      method: 'POST',
      headers: { 'Content-Type': 'image/webp' },
      body: readFileSync(publicDir + publicPath),
    })
    const id = asset.document?._id ?? asset._id
    if (!id) throw new Error('upload returned no asset id')
    console.log(`  [uploaded] ${publicPath} → ${id}`)
    await sleep(200)
    return { _type: 'image', asset: { _ref: id } }
  } catch (err) {
    if (String(err.message).includes('Too Many Requests') && attempt < 5) {
      await sleep(attempt * 1000)
      return uploadImage(publicPath, attempt + 1)
    }
    throw err
  }
}

// Converts the fallback shape into Sanity values: sections get their _type/_key
// and real image references (the fallback's imageWidth/imageHeight only exist
// for rendering — Sanity reads dimensions from the asset); paragraph lists
// become localeText array items.
async function toSanity(value) {
  if (Array.isArray(value)) {
    const out = []
    for (const [i, item] of value.entries()) {
      if (item && typeof item === 'object' && typeof item.key === 'string') {
        out.push(await sectionToSanity(item))
      } else {
        out.push({ _type: 'localeText', _key: `p${i}`, ...(await toSanity(item)) })
      }
    }
    return out
  }
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = await toSanity(v)
    return out
  }
  return value
}

async function sectionToSanity({ image, imageWidth, imageHeight, images, ...rest }) {
  const out = { _type: 'textMediaSection', _key: rest.key, ...(await toSanity(rest)) }
  if (image) out.image = await uploadImage(image)
  if (images) {
    out.images = []
    for (const [i, path] of images.entries()) {
      out.images.push({ _key: `img${i}`, ...(await uploadImage(path)) })
    }
  }
  return out
}

const ids = [...Object.keys(pageTextsByType), 'centroInfo']
const docs = await client.fetch(`*[_id in $ids || _id in $drafts]`, {
  ids,
  drafts: ids.map((id) => `drafts.${id}`),
})
const byId = new Map(docs.map((d) => [d._id, d]))

const tx = client.transaction()
let changes = 0

// An all-empty locale value (an optional field with no initial copy) is never
// written: leaving the field unset is what "empty" means in the Studio.
const isEmptyLeaf = (v) =>
  v && typeof v === 'object' && 'es' in v && Object.values(v).every((x) => x === '')
const withoutEmpty = (texts) =>
  Object.fromEntries(Object.entries(texts).filter(([, v]) => !isEmptyLeaf(v)))

// Adds every top-level field of `fallback` that `doc` does not have yet.
async function addMissingFields(id, doc, fallback) {
  const missing = Object.keys(fallback).filter((k) => doc[k] === undefined)
  if (!missing.length) return console.log(`[skip] ${id}: up to date`)
  console.log(`[patch] ${id}: setIfMissing ${missing.join(', ')}`)
  const values = {}
  for (const k of missing) values[k] = await toSanity(fallback[k])
  tx.patch(id, (p) => p.setIfMissing(values))
  changes++
}

for (const [type, fallback] of Object.entries(pageTextsByType)) {
  // Optional fields get their initial copy from seedOnlyTexts.
  const texts = withoutEmpty({ ...fallback, ...(seedOnlyTexts[type] ?? {}) })
  const existing = [type, `drafts.${type}`].filter((id) => byId.has(id))
  if (!existing.length) {
    console.log(`[create] ${type}`)
    tx.createIfNotExists({ _id: type, _type: type, ...(await toSanity(texts)) })
    changes++
    continue
  }
  for (const id of existing) await addMissingFields(id, byId.get(id), texts)
}

// centroInfo: home headings, on the published doc and on a pending draft.
for (const id of ['centroInfo', 'drafts.centroInfo']) {
  if (byId.has(id)) await addMissingFields(id, byId.get(id), homeTexts)
}

if (!changes) {
  console.log('Nothing to do.')
} else if (!apply) {
  console.log(`\nDry run: ${changes} change(s) pending. Re-run with --apply to write.`)
} else {
  const res = await tx.commit()
  console.log(`\nApplied ${changes} change(s) — transaction ${res.transactionId}`)
}
