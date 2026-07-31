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

async function uploadImage(filePath, label) {
  try {
    const asset = await client.assets.upload('image', filePath, { filename: label })
    return asset._id
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
    photo: m._key === 'staff-yann'
      ? await uploadImage(assetsDir + 'Staf.Yann.jpg', 'yann.jpg')
      : m._key === 'staff-anne'
        ? await uploadImage(assetsDir + 'staf.anne.jpeg', 'anne.jpg')
        : await uploadImage(assetsDir + 'staf.kike.jpg', 'kike.jpg'),
  }))
)

const doc = {
  _id: 'centroInfo',
  _type: 'centroInfo',
  intro: centroInfoData.intro,
  history: centroInfoData.history,
  installations: centroInfoData.installations,
  installationsImages: [
    await uploadImage(assetsDir + 'Local.jpg', 'local.jpg'),
    await uploadImage(assetsDir + 'Local grupo.groupe.jpg', 'local-grupo.jpg'),
    await uploadImage(assetsDir + 'Local zona humeda.jpg', 'local-zona-humeda.jpg'),
  ].filter(Boolean),
  staff: staffRefs,
  stats: centroInfoData.stats,
  certifications: [
    { _key: 'anmp', name: 'ANMP', logo: await uploadImage(assetsDir + 'Icon.ANMP EPF.jpg', 'anmp.jpg') },
    { _key: 'cmas', name: 'CMAS', logo: await uploadImage(assetsDir + 'Icon.CMAS.png', 'cmas.png') },
    { _key: 'ssi', name: 'SSI', logo: await uploadImage(assetsDir + 'Icon.diveSSI.jpeg', 'ssi.jpg') },
    { _key: 'canarias', name: 'Gobierno de Canarias', logo: await uploadImage(assetsDir + 'Icon.gobernio de canarias.jpg', 'gobierno.jpg') },
  ],
  mapImage: await uploadImage(assetsDir + 'mapa.sitio.buceo.isla.png', 'mapa-isla.png'),
}

await client.createOrReplace(doc)
console.log('centroInfo seeded')
