// Seeds the centroInfo singleton (home page content) from the canonical docx-sourced data.
// Run: npm run seed scripts/seed-centro-info.mjs
import { createClient } from '@sanity/client'
import { centroInfoData } from '../src/content/data/centroInfo.ts'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const assetsDir = new URL('../assets/', import.meta.url).pathname

// NOTE: `client.assets.upload` fails with "Unprocessable Entity - Invalid image" for this
// Sanity project, but the raw POST to /assets/images works. Use the raw request instead.
async function uploadImage(filePath, label) {
  try {
    const { readFileSync } = await import('node:fs')
    const data = readFileSync(filePath)
    const asset = await client.request({
      uri: `/assets/images/${process.env.SANITY_DATASET ?? 'production'}`,
      method: 'POST',
      headers: { 'Content-Type': 'image/webp' },
      body: data,
    })
    const id = asset.document?._id ?? asset._id
    if (!id) throw new Error('upload returned no asset id')
    // Return a proper Sanity image object so `photo.asset->url` projections resolve.
    return { _type: 'image', asset: { _ref: id } }
  } catch (err) {
    console.warn(`[skip] image ${label}: ${err.message}`)
    return null
  }
}

// Map canonical data (without _key photo refs) to a seeded doc with image refs.
const staffRefs = await Promise.all(
  centroInfoData.staff.map(async (m) => ({
    _key: m._key,
    name: m.name,
    role: m.role,
    bio: m.bio,
    languages: m.languages,
    photo:
      m._key === 'staff-yann'
        ? await uploadImage(assetsDir + 'staff/Staf.Yann.webp', 'yann.webp')
        : m._key === 'staff-anne'
          ? await uploadImage(assetsDir + 'staff/staf.anne.webp', 'anne.webp')
          : await uploadImage(assetsDir + 'staff/staf.kike.webp', 'kike.webp'),
  })),
)

const doc = {
  _id: 'centroInfo',
  _type: 'centroInfo',
  intro: centroInfoData.intro,
  history: centroInfoData.history,
  installations: centroInfoData.installations,
  installationsImages: [
    await uploadImage(assetsDir + 'local/Local.webp', 'local.webp'),
    await uploadImage(assetsDir + 'local/Local grupo.groupe.webp', 'local-grupo.webp'),
    await uploadImage(assetsDir + 'local/Local zona humeda.webp', 'local-zona-humeda.webp'),
  ].filter(Boolean),
  staff: staffRefs,
  stats: centroInfoData.stats,
  certifications: [
    {
      _key: 'anmp',
      name: 'ANMP',
      logo: await uploadImage(assetsDir + 'certifications/Icon.ANMP EPF.webp', 'anmp.webp'),
    },
    {
      _key: 'cmas',
      name: 'CMAS',
      logo: await uploadImage(assetsDir + 'certifications/Icon.CMAS.webp', 'cmas.webp'),
    },
    {
      _key: 'ssi',
      name: 'SSI',
      logo: await uploadImage(assetsDir + 'certifications/Icon.diveSSI.webp', 'ssi.webp'),
    },
    {
      _key: 'canarias',
      name: 'Gobierno de Canarias',
      logo: await uploadImage(
        assetsDir + 'certifications/Icon.gobernio de canarias.webp',
        'gobierno.webp',
      ),
    },
  ],
  mapImage: await uploadImage(assetsDir + 'maps/mapa.sitio.buceo.isla.webp', 'mapa-isla.webp'),
}

await client.createOrReplace(doc)
console.log('centroInfo seeded')
