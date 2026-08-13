# Baptism/Dive Schema Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single Sanity `experience` document type (discriminated by an `audience` field) with two independent document types, `baptism` and `dive`, matching how the frontend already splits Bautismos and Inmersiones into separate pages — and remove dead fields found while sweeping the whole Sanity admin (`groupDiscount` on three document types, the now-orphaned `localeStringOptional` object type, and `certifyingAgency.website`).

**Architecture:** Two new Sanity document schemas (`baptism.ts`, `dive.ts`) replace `experience.ts`. A one-off Node script (not committed) re-types the 12 published production documents, since Sanity's `_type` is immutable and can't be patched — each document must be deleted and recreated under its new type with the same `_id`. The frontend's fallback data file and query helpers are split the same way the schema is.

**Tech Stack:** Sanity Studio v6 (embedded in Astro at `/admin` via `@sanity/astro`), TypeScript, plain Node `https` for the one-off migration (no extra dependency — the migration script runs outside `node_modules` resolution, from the scratchpad directory).

## Global Constraints

- Images: `options: { accept: 'image/webp' }` on every image field (existing convention, see memory `sanity_image_conventions`).
- Locale fields use the `localeString`/`localeText`/`localeList`/`localeSupplementList` object types with `groups`/`group` (not `options.layout: 'tabs'`) for the es/en/fr/de tabs (existing convention, see memory `sanity_locale_field_tabs`).
- No new npm scripts, no committed migration/seed scripts (this repo intentionally removed those before — see commit `f5b556b`).
- `npm run build` and `npm run lint` must stay clean after every task (baseline: both pass with zero output/errors today).

---

### Task 1: Add `baptism` and `dive` schema types, remove `experience`

**Files:**
- Create: `src/sanity/schemaTypes/documents/baptism.ts`
- Create: `src/sanity/schemaTypes/documents/dive.ts`
- Delete: `src/sanity/schemaTypes/documents/experience.ts`
- Modify: `src/sanity/schemaTypes/index.ts`

**Interfaces:**
- Produces: two Sanity document types named `baptism` and `dive`, each with fields `title`, `description`, `duration`, `depthLimit`, `price`, `includes`, `supplements`, `requirements`, `reservationLink`, `videoUrl`, `image`, `order` (`dive` additionally has `isPackage`, right after `title`). Neither has `audience` or `groupDiscount` — do not add them.

- [ ] **Step 1: Create `src/sanity/schemaTypes/documents/baptism.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const baptism = defineType({
  name: 'baptism',
  title: 'Bautismos',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString' }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({ name: 'duration', title: 'Duración', type: 'localeString' }),
    defineField({ name: 'depthLimit', title: 'Profundidad máxima (m)', type: 'number' }),
    defineField({ name: 'price', title: 'Precio (EUR)', type: 'number' }),
    defineField({ name: 'includes', title: 'Incluye', type: 'localeList' }),
    defineField({ name: 'supplements', title: 'Suplementos / opciones', type: 'localeSupplementList' }),
    defineField({
      name: 'requirements',
      title: 'Requisitos',
      type: 'localeList',
      description: 'Lista de requisitos. Se muestra como la misma tarjeta "Requisitos" que en los cursos.',
    }),
    defineField({
      name: 'reservationLink',
      title: 'Enlace de reserva (Bukyapp)',
      type: 'url',
      description:
        'Enlace directo al producto en Bukyapp. Si se deja vacío, el botón "Reservar" envía al formulario de contacto con el mensaje precargado.',
    }),
    defineField({ name: 'videoUrl', title: 'Vídeo de YouTube', type: 'url' }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { accept: 'image/webp' },
      description: 'Se usa solo si no hay vídeo de YouTube. El vídeo tiene prioridad.',
    }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title.es', duration: 'duration.es', media: 'image' },
    prepare({ title, duration, media }) {
      return {
        title: title || 'Sin título',
        subtitle: duration || undefined,
        media,
      }
    },
  },
})
```

- [ ] **Step 2: Create `src/sanity/schemaTypes/documents/dive.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const dive = defineType({
  name: 'dive',
  title: 'Inmersiones',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString' }),
    defineField({
      name: 'isPackage',
      title: '¿Es un bono / pack?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({ name: 'duration', title: 'Duración', type: 'localeString' }),
    defineField({ name: 'depthLimit', title: 'Profundidad máxima (m)', type: 'number' }),
    defineField({ name: 'price', title: 'Precio (EUR)', type: 'number' }),
    defineField({ name: 'includes', title: 'Incluye', type: 'localeList' }),
    defineField({ name: 'supplements', title: 'Suplementos / opciones', type: 'localeSupplementList' }),
    defineField({
      name: 'requirements',
      title: 'Requisitos',
      type: 'localeList',
      description: 'Lista de requisitos. Se muestra como la misma tarjeta "Requisitos" que en los cursos.',
    }),
    defineField({
      name: 'reservationLink',
      title: 'Enlace de reserva (Bukyapp)',
      type: 'url',
      description:
        'Enlace directo al producto en Bukyapp. Si se deja vacío, el botón "Reservar" envía al formulario de contacto con el mensaje precargado.',
    }),
    defineField({ name: 'videoUrl', title: 'Vídeo de YouTube', type: 'url' }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { accept: 'image/webp' },
      description: 'Se usa solo si no hay vídeo de YouTube. El vídeo tiene prioridad.',
    }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title.es', duration: 'duration.es', media: 'image' },
    prepare({ title, duration, media }) {
      return {
        title: title || 'Sin título',
        subtitle: duration || undefined,
        media,
      }
    },
  },
})
```

- [ ] **Step 3: Delete `src/sanity/schemaTypes/documents/experience.ts`**

```bash
git rm src/sanity/schemaTypes/documents/experience.ts
```

- [ ] **Step 4: Update `src/sanity/schemaTypes/index.ts`**

Replace the full file content with:

```ts
import { baptism } from './documents/baptism'
import { centroInfo } from './documents/centroInfo'
import { certifyingAgency } from './documents/certifyingAgency'
import { course } from './documents/course'
import { dive } from './documents/dive'
import { diveSite } from './documents/diveSite'
import { sidemountCourse } from './documents/sidemountCourse'
import { tariffExtra } from './documents/tariffExtra'
import { localeList } from './objects/localeList'
import { localeSupplementList } from './objects/localeSupplementList'
import { localeString } from './objects/localeString'
import { localeStringOptional } from './objects/localeStringOptional'
import { localeText } from './objects/localeText'
import { supplementItem } from './objects/supplementItem'

export const schemaTypes = [
  localeString,
  localeStringOptional,
  localeText,
  localeList,
  supplementItem,
  localeSupplementList,
  certifyingAgency,
  course,
  sidemountCourse,
  baptism,
  dive,
  diveSite,
  tariffExtra,
  centroInfo,
]
```

Note: this keeps `localeStringOptional` registered — `course.ts`/`sidemountCourse.ts` still declare a `groupDiscount` field of that type at this point in the plan, and Sanity's schema validation fails at build time if a field references an unregistered object type. `localeStringOptional` is only dropped from this file in Task 3, once every field that uses it is gone.

- [ ] **Step 5: Verify**

```bash
npm run build && npm run lint
```

Expected: both succeed with no errors. The Studio bundle (mounted at `/admin`) now offers "Bautismos" and "Inmersiones" as separate sections instead of "Experiencia (Bautizo / Inmersión)"; the 12 production documents are still `_type == "experience"` at this point (migrated in Task 2), so `getExperiences()` (unchanged until Task 6) still finds them and the site still builds correctly.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(sanity): split experience schema into baptism and dive"
```

---

### Task 2: Migrate the 12 production documents

**Files:**
- Create (scratchpad, NOT committed): `/private/tmp/claude-501/-Users-aridanemartin-workspace-buceo-sur-gc/11bfae98-89d8-4690-827e-332a401b1218/scratchpad/migrate-baptism-dive-split.mjs`

**Interfaces:**
- Consumes: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN` from the repo's `.env` (already present, used by other tooling).
- Produces: every production document that was `_type == "experience"` now exists as `_type == "baptism"` (if `audience` was `"beginner"`) or `_type == "dive"` (if `"certified"`), same `_id`, with the `audience` and `groupDiscount` keys dropped. No other document type is touched.

**Context:** Verified against the live production dataset before writing this plan: Sanity's `_type` is an immutable attribute — both `patch.set` and `createOrReplace` reject changing it on an existing document (`cannotModifyImmutableAttributeError`). The only way to change a document's type while keeping its `_id` is to delete it, then create a new document with that same `_id` in a **separate**, later request (a delete+create in the *same* transaction also fails — Sanity resolves both mutations against the pre-transaction state). This script therefore runs two sequential HTTP calls: one `mutate` request with all 12 `delete`s, then a second `mutate` request with all 12 `create`s.

- [ ] **Step 1: Write the migration script**

```js
// One-off script: splits the 12 published `experience` documents into
// `baptism` (audience === 'beginner') / `dive` (audience === 'certified'),
// dropping the removed `audience` and `groupDiscount` fields. `_type` is
// immutable in Sanity (verified against production: patch/createOrReplace
// both reject changing it), so each document is deleted and recreated with
// the same `_id` under the new `_type`, in two sequential requests (delete
// all, then create all) — not committed, delete this file once verified.
//
// Usage:
//   node --env-file=.env <path-to-this-file> --dry-run
//   node --env-file=.env <path-to-this-file>
import https from 'node:https'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
const dryRun = process.argv.includes('--dry-run')

if (!projectId || !dataset || !token) {
  throw new Error('SANITY_PROJECT_ID / SANITY_DATASET / SANITY_API_TOKEN must be set (run with --env-file=.env)')
}

function query(groqQuery) {
  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(groqQuery)}`
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { Authorization: `Bearer ${token}` } }, (res) => {
        let data = ''
        res.on('data', (d) => (data += d))
        res.on('end', () => resolve(JSON.parse(data)))
      })
      .on('error', reject)
  })
}

function mutate(mutations) {
  const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`
  const body = JSON.stringify({ mutations })
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = ''
        res.on('data', (d) => (data += d))
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }))
      },
    )
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

const { result: docs } = await query('*[_type == "experience"]')
console.log(`Found ${docs.length} experience document(s).`)

const newDocs = docs.map((doc) => {
  const { _id, _type, _rev, _createdAt, _updatedAt, audience, groupDiscount, ...rest } = doc
  return { ...rest, _id, _type: audience === 'beginner' ? 'baptism' : 'dive' }
})

for (const doc of newDocs) {
  console.log(`  ${doc._id}: experience -> ${doc._type}`)
}

if (dryRun) {
  console.log('\nDry run only — no mutations sent. Re-run without --dry-run to apply.')
  process.exit(0)
}

const deleteRes = await mutate(docs.map((doc) => ({ delete: { id: doc._id } })))
console.log('Delete:', deleteRes.status, JSON.stringify(deleteRes.body))
if (deleteRes.status !== 200) throw new Error('Delete step failed, aborting before create step.')

const createRes = await mutate(newDocs.map((doc) => ({ create: doc })))
console.log('Create:', createRes.status, JSON.stringify(createRes.body))
if (createRes.status !== 200) {
  throw new Error(
    'Create step failed — old documents are already deleted; restore from Studio document history if needed.',
  )
}

const verify = await query(
  '{ "baptism": count(*[_type == "baptism"]), "dive": count(*[_type == "dive"]), "experience": count(*[_type == "experience"]) }',
)
console.log('Verification:', JSON.stringify(verify.result))
```

- [ ] **Step 2: Dry run and review the plan**

```bash
node --env-file=.env /private/tmp/claude-501/-Users-aridanemartin-workspace-buceo-sur-gc/11bfae98-89d8-4690-827e-332a401b1218/scratchpad/migrate-baptism-dive-split.mjs --dry-run
```

Expected: `Found 12 experience document(s).` followed by 12 lines, 2 mapping to `baptism` (`experience-bautismo`, `experience-ssi-basic-diver`) and 10 mapping to `dive` (the rest), ending with "Dry run only — no mutations sent."

- [ ] **Step 3: Run it for real**

```bash
node --env-file=.env /private/tmp/claude-501/-Users-aridanemartin-workspace-buceo-sur-gc/11bfae98-89d8-4690-827e-332a401b1218/scratchpad/migrate-baptism-dive-split.mjs
```

Expected: `Delete: 200 ...`, `Create: 200 ...`, then `Verification: {"baptism":2,"dive":10,"experience":0}`.

- [ ] **Step 4: Delete the script**

```bash
rm /private/tmp/claude-501/-Users-aridanemartin-workspace-buceo-sur-gc/11bfae98-89d8-4690-827e-332a401b1218/scratchpad/migrate-baptism-dive-split.mjs
```

No commit for this task — nothing in the git repo changed, only the live Sanity dataset.

---

### Task 3: Remove dead `groupDiscount` field (and the now-orphaned `localeStringOptional` type)

**Files:**
- Modify: `src/sanity/schemaTypes/documents/course.ts`
- Modify: `src/sanity/schemaTypes/documents/sidemountCourse.ts`
- Modify: `src/sanity/schemaTypes/index.ts`
- Delete: `src/sanity/schemaTypes/objects/localeStringOptional.ts`
- Modify: `src/content/data/courses.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `course` and `sidemountCourse` schemas without a `groupDiscount` field; `CourseSeed` (in `src/content/data/courses.ts`) without a `groupDiscount` property. The `localeStringOptional` object type no longer exists anywhere in the schema (it was only ever used by the three now-removed `groupDiscount` fields).

- [ ] **Step 1: Remove `groupDiscount` from `course.ts`**

In `src/sanity/schemaTypes/documents/course.ts`, delete this line:

```ts
    defineField({ name: 'groupDiscount', title: 'Descuento por grupo', type: 'localeStringOptional' }),
```

- [ ] **Step 2: Remove `groupDiscount` from `sidemountCourse.ts`**

In `src/sanity/schemaTypes/documents/sidemountCourse.ts`, delete the identical line:

```ts
    defineField({ name: 'groupDiscount', title: 'Descuento por grupo', type: 'localeStringOptional' }),
```

- [ ] **Step 3: Delete the now-orphaned `localeStringOptional` object type**

```bash
git rm src/sanity/schemaTypes/objects/localeStringOptional.ts
```

In `src/sanity/schemaTypes/index.ts`, remove the import line:

```ts
import { localeStringOptional } from './objects/localeStringOptional'
```

and remove the `localeStringOptional,` entry from the `schemaTypes` array, so it reads:

```ts
export const schemaTypes = [
  localeString,
  localeText,
  localeList,
  supplementItem,
  localeSupplementList,
  certifyingAgency,
  course,
  sidemountCourse,
  baptism,
  dive,
  diveSite,
  tariffExtra,
  centroInfo,
]
```

- [ ] **Step 4: Remove `groupDiscount` from the `courses.ts` seed data**

Remove every `groupDiscount: loc(...)` entry (both the one-line empty ones and the multi-line populated ones):

```bash
perl -0777 -pi -e 's/\n[ \t]*groupDiscount: loc\([^)]*\),//g' src/content/data/courses.ts
```

Then remove the now-unused interface field. In `src/content/data/courses.ts`, delete this line from the `CourseSeed` interface:

```ts
  groupDiscount?: LocaleValue
```

- [ ] **Step 5: Verify no `groupDiscount` remains**

```bash
grep -rn "groupDiscount\|localeStringOptional" src/sanity src/content
```

Expected: no output.

- [ ] **Step 6: Verify build**

```bash
npm run build && npm run lint
```

Expected: both succeed with no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore(sanity): remove dead groupDiscount field and localeStringOptional type"
```

---

### Task 4: Remove dead `certifyingAgency.website` field

**Files:**
- Modify: `src/sanity/schemaTypes/documents/certifyingAgency.ts`
- Modify: `src/sanity/queries.ts`

**Interfaces:**
- Produces: `certifyingAgency` schema and `getCertifyingAgencies()` without a `website` field/projection. `getCertifyingAgencies()` still returns `{ name, logo }` shaped objects — the only fields any caller (`CoursesView.astro`) reads.

- [ ] **Step 1: Remove the field from the schema**

In `src/sanity/schemaTypes/documents/certifyingAgency.ts`, delete this line:

```ts
    defineField({ name: 'website', title: 'Sitio web', type: 'url' }),
```

- [ ] **Step 2: Remove `website` from the query projection**

In `src/sanity/queries.ts`, change `getCertifyingAgencies()` from:

```ts
export async function getCertifyingAgencies() {
  try {
    const data = await sanityClient.fetch(`
      *[_type == "certifyingAgency"] {
        name,
        "logo": logo.asset->url,
        website
      }
    `)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
```

to:

```ts
export async function getCertifyingAgencies() {
  try {
    const data = await sanityClient.fetch(`
      *[_type == "certifyingAgency"] {
        name,
        "logo": logo.asset->url,
      }
    `)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
```

- [ ] **Step 3: Verify**

```bash
npm run build && npm run lint
```

Expected: both succeed with no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(sanity): remove dead certifyingAgency.website field"
```

---

### Task 5: Split the fallback seed data (`experiences.ts` → `baptisms.ts` + `dives.ts`)

**Files:**
- Create: `src/content/data/baptisms.ts`
- Create: `src/content/data/dives.ts`
- Delete: `src/content/data/experiences.ts`

**Interfaces:**
- Produces: `baptismsData: BaptismSeed[]` (2 entries, `_type: 'baptism'`, `order` 1–2) exported from `baptisms.ts`; `divesData: DiveSeed[]` (10 entries, `_type: 'dive'`, `order` 3–12, `isPackage: true` on the four bono entries) exported from `dives.ts`. Neither type/data carries `audience` or `groupDiscount`.

- [ ] **Step 1: Create `src/content/data/baptisms.ts`**

```ts
// Canonical baptism data (bautizos).
// Sourced from docs/3. Bautizos.md and docs/5. Tarifas.md.
export type LocaleValue = Partial<Record<'es' | 'en' | 'fr' | 'de', string>>
export type LocaleListValue = Partial<Record<'es' | 'en' | 'fr' | 'de', string[]>>

// A "Suplementos" row: concept + price as separate fields (so the front end
// can color them differently), instead of one "Concepto: precio" string.
export interface SupplementItem {
  label: string
  price: string
}
export type LocaleSupplementListValue = Partial<Record<'es' | 'en' | 'fr' | 'de', SupplementItem[]>>

const loc = (es: string, en: string, fr: string, de: string): LocaleValue => ({ es, en, fr, de })

// "Incluye" is rendered as a <ul><li> list, so each locale carries an array
// of short items instead of one prose string.
const locList = (es: string[], en: string[], fr: string[], de: string[]): LocaleListValue => ({
  es,
  en,
  fr,
  de,
})

const locSupplements = (
  es: SupplementItem[],
  en: SupplementItem[],
  fr: SupplementItem[],
  de: SupplementItem[],
): LocaleSupplementListValue => ({ es, en, fr, de })

export interface BaptismSeed {
  _id: string
  _type: 'baptism'
  title: LocaleValue
  description: LocaleValue
  duration: LocaleValue
  depthLimit?: number | null
  price?: number | null
  includes: LocaleListValue
  supplements: LocaleSupplementListValue
  // Rendered as the "Requisitos" check-list card (same as courses).
  requirements?: LocaleListValue
  // Direct link to the bookable product in Bukyapp. Left undefined for
  // baptisms Bukyapp doesn't sell online — BaptismsView falls back to a
  // contact-form link with a prefilled "interested in X" message.
  reservationLink?: string
  videoUrl?: string
  image?: string
  order: number
}

export const baptismsData: BaptismSeed[] = [
  {
    _id: 'experience-bautismo',
    _type: 'baptism',
    title: loc('El Bautismo', 'Discover Scuba Diving', 'Le Baptême', 'Schnuppertauchen'),
    description: loc(
      'Tu primera inmersión en el mar, sin experiencia previa. Una vez equipado, bucearás en una zona protegida pero llena de vida submarina: abre los ojos, tu instructor se encarga de todo. Por tu seguridad, dedicamos UN INSTRUCTOR POR BAUTIZO.',
      'Your first dive in the sea, no previous experience needed. Once equipped, you will dive in a protected area full of underwater life: open your eyes, your instructor takes care of everything. For your safety, we dedicate ONE INSTRUCTOR PER DISCOVER DIVE.',
      'Votre première plongée en mer, sans expérience préalable. Une fois équipé, vous plongerez dans une zone protégée mais pleine de vie sous-marine : ouvrez les yeux, votre instructeur s’occupe de tout. Pour votre sécurité, nous dédions UN INSTRUCTEUR PAR BAPTÊME.',
      'Ihr erster Tauchgang im Meer, ohne Vorkenntnisse. Ausgerüstet tauchen Sie in einem geschützten, aber lebendigen Gebiet: Augen auf, Ihr Ausbilder kümmert sich um alles. Für Ihre Sicherheit: EIN AUSBILDER PRO SCHNUPPERTAUCHGANG.',
    ),
    duration: loc(
      '1 inmersión / 2,5 h',
      '1 dive / 2.5 h',
      '1 plongée / 2,5 h',
      '1 Tauchgang / 2,5 Std.',
    ),
    depthLimit: 6,
    price: 80,
    includes: locList(
      [
        '1 inmersión en mar abierto, todo el equipo necesario y el seguro obligatorio',
        'Vamos a Risco Verde, ideal para principiantes con gran diversidad de vida',
      ],
      [
        '1 open water dive, all necessary equipment and mandatory insurance',
        'We go to Risco Verde, ideal for beginners with great marine-life diversity',
      ],
      [
        '1 plongée en mer ouverte, tout l’équipement nécessaire et l’assurance obligatoire',
        'Nous allons à Risco Verde, idéal pour les débutants avec une grande diversité de vie',
      ],
      [
        '1 Freiwassertauchgang, die gesamte notwendige Ausrüstung und die Pflichtversicherung',
        'Wir gehen nach Risco Verde, ideal für Anfänger mit großer Artenvielfalt',
      ],
    ),
    supplements: locSupplements(
      [{ label: 'Clip de vídeo', price: '25 €' }],
      [{ label: 'Video clip', price: '€25' }],
      [{ label: 'Clip vidéo', price: '25 €' }],
      [{ label: 'Videoclip', price: '25 €' }],
    ),
    requirements: locList(
      [
        'Más de 12 años',
        'Saber nadar',
        'Apto para bucear (certificado médico o cuestionario médico cumplimentado sin contraindicaciones)',
        'No tener vuelo el mismo día',
      ],
      [
        'Over 12 years old',
        'Able to swim',
        'Fit to dive (medical certificate or completed medical questionnaire with no contraindications)',
        'No flight the same day',
      ],
      [
        'Plus de 12 ans',
        'Savoir nager',
        'Apte à plonger (certificat médical ou questionnaire médical rempli sans contre-indication)',
        'Ne pas prendre l’avion le jour même',
      ],
      [
        'Über 12 Jahre alt',
        'Schwimmfähig',
        'Tauglich zum Tauchen (ärztliches Attest oder ausgefüllter medizinischer Fragebogen ohne Gegenanzeigen)',
        'Kein Flug am selben Tag',
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69b1475740d7e94c0efbc158',
    videoUrl: 'https://youtu.be/gGARKaie1_s?si=Du0qrp7Z883ECPks',
    order: 1,
  },
  {
    _id: 'experience-ssi-basic-diver',
    _type: 'baptism',
    title: loc(
      'Curso Iniciación Básico (SSI Basic Diver)',
      'Basic Initiation Course (SSI Basic Diver)',
      'Cours d’initiation basique (SSI Basic Diver)',
      'Grundkurs (SSI Basic Diver)',
    ),
    description: loc(
      'En una piscina natural al lado de la playa aprenderás los gestos básicos del buceo (comunicación, vaciar la máscara, manejar el chaleco…). Luego pondrás todo en práctica en una inmersión más profunda en aguas abiertas. UN INSTRUCTOR POR 2 BUCEADORES.',
      'In a natural pool next to the beach you will learn the basic skills of diving (communication, clearing your mask, managing your BCD…). Then you will put everything into practice on a deeper open water dive. ONE INSTRUCTOR PER 2 DIVERS.',
      'Dans une piscine naturelle à côté de la plage, vous apprendrez les gestes de base de la plongée (communication, vider le masque, gérer le gilet…). Ensuite, vous mettrez tout en pratique lors d’une plongée plus profonde en mer ouverte. UN INSTRUCTEUR POUR 2 PLONGEURS.',
      'In einem natürlichen Pool am Strand lernen Sie die Grundtechniken des Tauchens (Kommunikation, Maske ausblasen, Jacket bedienen…). Danach setzen Sie alles bei einem tieferen Freiwassertauchgang um. EIN AUSBILDER PRO 2 TAUCHER.',
    ),
    duration: loc(
      '2 inmersiones + teoría / 4 h',
      '2 dives + theory / 4 h',
      '2 plongées + théorie / 4 h',
      '2 Tauchgänge + Theorie / 4 Std.',
    ),
    depthLimit: 8,
    price: 120,
    includes: locList(
      [
        '1 inmersión técnica en piscina natural (Zoco-Negro, máx. 3 m)',
        '1 inmersión en mar abierto (Risco Verde, máx. 8 m)',
        'Teoría online SSI Basic Diver',
        'Carnet de buceo SSI Basic Diver',
        'Equipo de buceo',
        'Seguro de buceo y todo lo necesario',
      ],
      [
        '1 technical dive in a natural pool (Zoco-Negro, max. 3 m)',
        '1 open water dive (Risco Verde, max. 8 m)',
        'SSI Basic Diver online theory',
        'SSI Basic Diver certification card',
        'Diving equipment',
        'Dive insurance and everything needed',
      ],
      [
        '1 plongée technique en piscine naturelle (Zoco-Negro, max. 3 m)',
        '1 plongée en mer ouverte (Risco Verde, max. 8 m)',
        'Théorie en ligne SSI Basic Diver',
        'Carte de plongée SSI Basic Diver',
        'Équipement de plongée',
        'Assurance plongée et tout le nécessaire',
      ],
      [
        '1 technischer Tauchgang im Naturpool (Zoco-Negro, max. 3 m)',
        '1 Freiwassertauchgang (Risco Verde, max. 8 m)',
        'SSI-Basic-Diver-Online-Theorie',
        'SSI-Basic-Diver-Karte',
        'Tauchausrüstung',
        'Tauchversicherung und alles Notwendige',
      ],
    ),
    supplements: locSupplements(
      [{ label: 'Clip de vídeo', price: '25 €' }],
      [{ label: 'Video clip', price: '€25' }],
      [{ label: 'Clip vidéo', price: '25 €' }],
      [{ label: 'Videoclip', price: '25 €' }],
    ),
    requirements: locList(
      [
        'Más de 12 años',
        'Saber nadar',
        'Apto para bucear (certificado médico o cuestionario médico cumplimentado sin contraindicaciones)',
        'No tener vuelo el mismo día',
      ],
      [
        'Over 12 years old',
        'Able to swim',
        'Fit to dive (medical certificate or completed medical questionnaire with no contraindications)',
        'No flight the same day',
      ],
      [
        'Plus de 12 ans',
        'Savoir nager',
        'Apte à plonger (certificat médical ou questionnaire médical rempli sans contre-indication)',
        'Ne pas prendre l’avion le jour même',
      ],
      [
        'Über 12 Jahre alt',
        'Schwimmfähig',
        'Tauglich zum Tauchen (ärztliches Attest oder ausgefüllter medizinischer Fragebogen ohne Gegenanzeigen)',
        'Kein Flug am selben Tag',
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69b4566e40d7e94c0e14704a',
    videoUrl: 'https://youtu.be/j-qIyqbd0Z8?si=Kow4g7EBo5Uy4Vee',
    order: 2,
  },
]
```

- [ ] **Step 2: Create `src/content/data/dives.ts`**

```ts
// Canonical dive data (inmersiones).
// Sourced from docs/2. inmersiones.md and docs/5. Tarifas.md.
export type LocaleValue = Partial<Record<'es' | 'en' | 'fr' | 'de', string>>
export type LocaleListValue = Partial<Record<'es' | 'en' | 'fr' | 'de', string[]>>

// A "Suplementos" row: concept + price as separate fields (so the front end
// can color them differently), instead of one "Concepto: precio" string.
export interface SupplementItem {
  label: string
  price: string
}
export type LocaleSupplementListValue = Partial<Record<'es' | 'en' | 'fr' | 'de', SupplementItem[]>>

const loc = (es: string, en: string, fr: string, de: string): LocaleValue => ({ es, en, fr, de })

// "Incluye" is rendered as a <ul><li> list, so each locale carries an array
// of short items instead of one prose string.
const locList = (es: string[], en: string[], fr: string[], de: string[]): LocaleListValue => ({
  es,
  en,
  fr,
  de,
})

const locSupplements = (
  es: SupplementItem[],
  en: SupplementItem[],
  fr: SupplementItem[],
  de: SupplementItem[],
): LocaleSupplementListValue => ({ es, en, fr, de })

export interface DiveSeed {
  _id: string
  _type: 'dive'
  title: LocaleValue
  isPackage?: boolean
  description: LocaleValue
  duration: LocaleValue
  depthLimit?: number | null
  price?: number | null
  includes: LocaleListValue
  supplements: LocaleSupplementListValue
  // Rendered as the "Requisitos" check-list card (same as courses).
  requirements?: LocaleListValue
  // Direct link to the bookable product in Bukyapp. Left undefined for
  // dives Bukyapp doesn't sell online — DivesView falls back to a
  // contact-form link with a prefilled "interested in X" message.
  reservationLink?: string
  videoUrl?: string
  image?: string
  order: number
}

export const divesData: DiveSeed[] = [
  {
    _id: 'experience-single-dive',
    _type: 'dive',
    title: loc('1 x Inmersión', '1 x Dive', '1 x Plongée', '1 x Tauchgang'),
    description: loc(
      'Una inmersión guiada por la tarde (zona Risco, Tufia, Cabrón o Sardina).',
      'A guided afternoon dive (Risco, Tufia, Cabrón or Sardina area).',
      'Une plongée encadrée l’après-midi (zone Risco, Tufia, Cabrón ou Sardina).',
      'Ein begleiteter Nachmittagstauchgang (Zone Risco, Tufia, Cabrón oder Sardina).',
    ),
    duration: loc(
      '1 inmersión (tarde)',
      '1 dive (afternoon)',
      '1 plongée (après-midi)',
      '1 Tauchgang (nachmittags)',
    ),
    depthLimit: null,
    price: 50,
    includes: locList(
      ['1 inmersión guiada', 'Plomos y botella incluidos'],
      ['1 guided dive', 'Weights and tank included'],
      ['1 plongée encadrée', 'Plombs et bouteille inclus'],
      ['1 begleiteter Tauchgang', 'Gewichte und Flasche inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico', price: '+10 €' },
        { label: 'Equipo completo (con ordenador)', price: '+15 €' },
      ],
      [
        { label: 'Basic equipment', price: '+€10' },
        { label: 'Full equipment (with computer)', price: '+€15' },
      ],
      [
        { label: 'Équipement de base', price: '+10 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+15 €' },
      ],
      [
        { label: 'Grundausrüstung', price: '+10 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+15 €' },
      ],
    ),
    requirements: locList(
      ['Mínimo 2 participantes'],
      ['Minimum 2 participants'],
      ['Minimum 2 participants'],
      ['Mindestens 2 Teilnehmer'],
    ),
    order: 3,
  },
  {
    _id: 'experience-double-dive',
    _type: 'dive',
    title: loc(
      'Doble Inmersión (1 día)',
      'Double Dive (1 day)',
      'Double Plongée (1 jour)',
      'Doppeltauchgang (1 Tag)',
    ),
    description: loc(
      'Dos inmersiones guiadas en un día (zona Risco, Tufia, Cabrón o Sardina).',
      'Two guided dives in one day (Risco, Tufia, Cabrón or Sardina area).',
      'Deux plongées encadrées en une journée (zone Risco, Tufia, Cabrón ou Sardina).',
      'Zwei begleitete Tauchgänge an einem Tag (Zone Risco, Tufia, Cabrón oder Sardina).',
    ),
    duration: loc(
      '2 inmersiones / 1 día',
      '2 dives / 1 day',
      '2 plongées / 1 jour',
      '2 Tauchgänge / 1 Tag',
    ),
    depthLimit: null,
    price: 75,
    includes: locList(
      ['2 inmersiones guiadas', 'Plomos y botellas incluidos'],
      ['2 guided dives', 'Weights and tanks included'],
      ['2 plongées encadrées', 'Plombs et bouteilles inclus'],
      ['2 begleitete Tauchgänge', 'Gewichte und Flaschen inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Barco (zona sur)', price: '+20 €' },
        { label: 'Equipo básico', price: '+20 €' },
        { label: 'Equipo completo (con ordenador)', price: '+25 €' },
      ],
      [
        { label: 'Boat (south zone)', price: '+€20' },
        { label: 'Basic equipment', price: '+€20' },
        { label: 'Full equipment (with computer)', price: '+€25' },
      ],
      [
        { label: 'Bateau (zone sud)', price: '+20 €' },
        { label: 'Équipement de base', price: '+20 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+25 €' },
      ],
      [
        { label: 'Boot (Südzone)', price: '+20 €' },
        { label: 'Grundausrüstung', price: '+20 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+25 €' },
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69b4584afc967e7d1fa9b887',
    order: 4,
  },
  {
    _id: 'experience-bono-4',
    _type: 'dive',
    title: loc(
      'Bono 4 Inmersiones (2 días)',
      '4-Dive Package (2 days)',
      'Pack 4 plongées (2 jours)',
      '4er-Tauchpaket (2 Tage)',
    ),
    description: loc(
      'Cuatro inmersiones guiadas en 2 días (zona Risco, Tufia, Cabrón o Sardina).',
      'Four guided dives over 2 days (Risco, Tufia, Cabrón or Sardina area).',
      'Quatre plongées encadrées sur 2 jours (zone Risco, Tufia, Cabrón ou Sardina).',
      'Vier begleitete Tauchgänge an 2 Tagen (Zone Risco, Tufia, Cabrón oder Sardina).',
    ),
    duration: loc(
      '4 inmersiones / 2 días',
      '4 dives / 2 days',
      '4 plongées / 2 jours',
      '4 Tauchgänge / 2 Tage',
    ),
    isPackage: true,
    depthLimit: null,
    price: 140,
    includes: locList(
      ['4 inmersiones guiadas', 'Plomos y botellas incluidos'],
      ['4 guided dives', 'Weights and tanks included'],
      ['4 plongées encadrées', 'Plombs et bouteilles inclus'],
      ['4 begleitete Tauchgänge', 'Gewichte und Flaschen inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Barco (zona sur)', price: '+20 €/día' },
        { label: 'Equipo básico', price: '+40 €' },
        { label: 'Equipo completo (con ordenador)', price: '+50 €' },
      ],
      [
        { label: 'Boat (south zone)', price: '+€20/day' },
        { label: 'Basic equipment', price: '+€40' },
        { label: 'Full equipment (with computer)', price: '+€50' },
      ],
      [
        { label: 'Bateau (zone sud)', price: '+20 €/jour' },
        { label: 'Équipement de base', price: '+40 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+50 €' },
      ],
      [
        { label: 'Boot (Südzone)', price: '+20 €/Tag' },
        { label: 'Grundausrüstung', price: '+40 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+50 €' },
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69b45d2cc2395a856d17a423',
    order: 5,
  },
  {
    _id: 'experience-bono-6',
    _type: 'dive',
    title: loc(
      'Bono 6 Inmersiones (3 días)',
      '6-Dive Package (3 days)',
      'Pack 6 plongées (3 jours)',
      '6er-Tauchpaket (3 Tage)',
    ),
    description: loc(
      'Seis inmersiones guiadas en total (4 en zona Risco, Tufia, Cabrón o Sardina + 2 en zona barco sur).',
      'Six guided dives in total (4 in the Risco, Tufia, Cabrón or Sardina area + 2 in the southern boat area).',
      'Six plongées encadrées au total (4 en zone Risco, Tufia, Cabrón ou Sardina + 2 en zone bateau sud).',
      'Sechs begleitete Tauchgänge insgesamt (4 in der Zone Risco, Tufia, Cabrón oder Sardina + 2 in der südlichen Bootszone).',
    ),
    duration: loc(
      '6 inmersiones / 3 días',
      '6 dives / 3 days',
      '6 plongées / 3 jours',
      '6 Tauchgänge / 3 Tage',
    ),
    isPackage: true,
    depthLimit: null,
    price: 230,
    includes: locList(
      ['6 inmersiones guiadas', 'Plomos y botellas incluidos'],
      ['6 guided dives', 'Weights and tanks included'],
      ['6 plongées encadrées', 'Plombs et bouteilles inclus'],
      ['6 begleitete Tauchgänge', 'Gewichte und Flaschen inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico', price: '+60 €' },
        { label: 'Equipo completo (con ordenador)', price: '+75 €' },
      ],
      [
        { label: 'Basic equipment', price: '+€60' },
        { label: 'Full equipment (with computer)', price: '+€75' },
      ],
      [
        { label: 'Équipement de base', price: '+60 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+75 €' },
      ],
      [
        { label: 'Grundausrüstung', price: '+60 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+75 €' },
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69e68a2cbe8564dc8a68eafe',
    order: 6,
  },
  {
    _id: 'experience-bono-8',
    _type: 'dive',
    title: loc(
      'Bono 8 Inmersiones (4 días)',
      '8-Dive Package (4 days)',
      'Pack 8 plongées (4 jours)',
      '8er-Tauchpaket (4 Tage)',
    ),
    description: loc(
      'Ocho inmersiones guiadas en total (6 en zona Risco, Tufia, Cabrón o Sardina + 2 en zona barco sur).',
      'Eight guided dives in total (6 in the Risco, Tufia, Cabrón or Sardina area + 2 in the southern boat area).',
      'Huit plongées encadrées au total (6 en zone Risco, Tufia, Cabrón ou Sardina + 2 en zone bateau sud).',
      'Acht begleitete Tauchgänge insgesamt (6 in der Zone Risco, Tufia, Cabrón oder Sardina + 2 in der südlichen Bootszone).',
    ),
    duration: loc(
      '8 inmersiones / 4 días',
      '8 dives / 4 days',
      '8 plongées / 4 jours',
      '8 Tauchgänge / 4 Tage',
    ),
    isPackage: true,
    depthLimit: null,
    price: 300,
    includes: locList(
      ['8 inmersiones guiadas', 'Plomos y botellas incluidos'],
      ['8 guided dives', 'Weights and tanks included'],
      ['8 plongées encadrées', 'Plombs et bouteilles inclus'],
      ['8 begleitete Tauchgänge', 'Gewichte und Flaschen inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico', price: '+80 €' },
        { label: 'Equipo completo (con ordenador)', price: '+100 €' },
      ],
      [
        { label: 'Basic equipment', price: '+€80' },
        { label: 'Full equipment (with computer)', price: '+€100' },
      ],
      [
        { label: 'Équipement de base', price: '+80 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+100 €' },
      ],
      [
        { label: 'Grundausrüstung', price: '+80 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+100 €' },
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69c1c12f5595aad44548a94e',
    order: 7,
  },
  {
    _id: 'experience-bono-10',
    _type: 'dive',
    title: loc(
      'Bono 10 Inmersiones (5 días)',
      '10-Dive Package (5 days)',
      'Pack 10 plongées (5 jours)',
      '10er-Tauchpaket (5 Tage)',
    ),
    description: loc(
      'Diez inmersiones guiadas en total (8 en zona Risco, Tufia, Cabrón o Sardina + 2 en zona barco sur).',
      'Ten guided dives in total (8 in the Risco, Tufia, Cabrón or Sardina area + 2 in the southern boat area).',
      'Dix plongées encadrées au total (8 en zone Risco, Tufia, Cabrón ou Sardina + 2 en zone bateau sud).',
      'Zehn begleitete Tauchgänge insgesamt (8 in der Zone Risco, Tufia, Cabrón oder Sardina + 2 in der südlichen Bootszone).',
    ),
    duration: loc(
      '10 inmersiones / 5 días',
      '10 dives / 5 days',
      '10 plongées / 5 jours',
      '10 Tauchgänge / 5 Tage',
    ),
    isPackage: true,
    depthLimit: null,
    price: 390,
    includes: locList(
      ['10 inmersiones guiadas', 'Plomos y botellas incluidos'],
      ['10 guided dives', 'Weights and tanks included'],
      ['10 plongées encadrées', 'Plombs et bouteilles inclus'],
      ['10 begleitete Tauchgänge', 'Gewichte und Flaschen inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico', price: '+100 €' },
        { label: 'Equipo completo (con ordenador)', price: '+120 €' },
      ],
      [
        { label: 'Basic equipment', price: '+€100' },
        { label: 'Full equipment (with computer)', price: '+€120' },
      ],
      [
        { label: 'Équipement de base', price: '+100 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+120 €' },
      ],
      [
        { label: 'Grundausrüstung', price: '+100 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+120 €' },
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/6a4d3d9d73dd28bfee51c9e5',
    order: 8,
  },
  {
    _id: 'experience-night-dive',
    _type: 'dive',
    title: loc('Inmersión Nocturna', 'Night Dive', 'Plongée de nuit', 'Nachttauchgang'),
    description: loc(
      'Una inmersión guiada nocturna para descubrir la fauna que sale después del atardecer.',
      'A guided night dive to discover the wildlife that comes out after sunset.',
      'Une plongée encadrée de nuit pour découvrir la faune qui sort après le coucher du soleil.',
      'Ein begleiteter Nachttauchgang, um die Tierwelt zu entdecken, die nach Sonnenuntergang aktiv wird.',
    ),
    duration: loc('1 inmersión nocturna', '1 night dive', '1 plongée de nuit', '1 Nachttauchgang'),
    depthLimit: null,
    price: 70,
    includes: locList(
      ['1 inmersión guiada nocturna', 'Plomos y botellas incluidos'],
      ['1 guided night dive', 'Weights and tank included'],
      ['1 plongée encadrée de nuit', 'Plombs et bouteille inclus'],
      ['1 begleiteter Nachttauchgang', 'Gewichte und Flasche inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Linterna', price: '+5 €' },
        { label: 'Equipo básico', price: '+10 €' },
        { label: 'Equipo completo (con ordenador)', price: '+25 €' },
      ],
      [
        { label: 'Torch', price: '+€5' },
        { label: 'Basic equipment', price: '+€10' },
        { label: 'Full equipment (with computer)', price: '+€25' },
      ],
      [
        { label: 'Lampe', price: '+5 €' },
        { label: 'Équipement de base', price: '+10 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+25 €' },
      ],
      [
        { label: 'Lampe', price: '+5 €' },
        { label: 'Grundausrüstung', price: '+10 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+25 €' },
      ],
    ),
    requirements: locList(
      ['Mínimo 2 participantes'],
      ['Minimum 2 participants'],
      ['Minimum 2 participants'],
      ['Mindestens 2 Teilnehmer'],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69e90e2b3875045b1ac20e68',
    order: 9,
  },
  {
    _id: 'experience-refresher',
    _type: 'dive',
    title: loc(
      'Inmersión de Repaso',
      'Refresher Dive',
      'Plongée de remise à niveau',
      'Auffrischungstauchgang',
    ),
    description: loc(
      'Una inmersión técnica de repaso para recuperar confianza y técnica antes de volver a bucear con normalidad.',
      'A technical refresher dive to rebuild confidence and skills before diving normally again.',
      'Une plongée technique de remise à niveau pour retrouver confiance et technique avant de replonger normalement.',
      'Ein technischer Auffrischungstauchgang, um Vertrauen und Technik wiederzugewinnen, bevor Sie wieder normal tauchen.',
    ),
    duration: loc(
      '1 inmersión de repaso',
      '1 refresher dive',
      '1 plongée de remise à niveau',
      '1 Auffrischungstauchgang',
    ),
    depthLimit: null,
    price: 80,
    includes: locList(
      ['1 inmersión técnica de repaso', 'Plomos y botella incluidos', 'Equipo básico incluido'],
      ['1 technical refresher dive', 'Weights and tank included', 'Basic equipment included'],
      [
        '1 plongée technique de remise à niveau',
        'Plombs et bouteille inclus',
        'Équipement de base inclus',
      ],
      [
        '1 technischer Auffrischungstauchgang',
        'Gewichte und Flasche inklusive',
        'Grundausrüstung inklusive',
      ],
    ),
    supplements: locSupplements(
      [{ label: 'Buceo adicional (mismo día)', price: '+40 €' }],
      [{ label: 'Additional dive (same day)', price: '+€40' }],
      [{ label: 'Plongée supplémentaire (même jour)', price: '+40 €' }],
      [{ label: 'Zusätzlicher Tauchgang (gleicher Tag)', price: '+40 €' }],
    ),
    requirements: locList(
      [
        'Máximo 2 buceadores por instructor',
        'Si tu última inmersión fue hace más de un año y has realizado menos de 10 inmersiones, te recomendamos un curso de actualización',
      ],
      [
        'Maximum 2 divers per instructor',
        'If your last dive was over a year ago and you have fewer than 10 dives, we recommend a refresher course',
      ],
      [
        'Maximum 2 plongeurs par instructeur',
        'Si votre dernière plongée date de plus d’un an et que vous avez moins de 10 plongées, nous recommandons un cours de remise à niveau',
      ],
      [
        'Maximal 2 Taucher pro Ausbilder',
        'Wenn Ihr letzter Tauchgang mehr als ein Jahr zurückliegt und Sie weniger als 10 Tauchgänge haben, empfehlen wir einen Auffrischungskurs',
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69e8b0339fad86498df4112b',
    order: 10,
  },
  {
    _id: 'experience-technical-training',
    _type: 'dive',
    title: loc(
      'Inmersión de Formación Técnica',
      'Technical Training Dive',
      'Plongée de formation technique',
      'Technischer Ausbildungstauchgang',
    ),
    description: loc(
      'Una inmersión técnica de curso para la validación de N1 sin agua abierta.',
      'A technical course dive for N1 validation without open water.',
      'Une plongée technique de formation pour la validation du N1 sans eau ouverte.',
      'Ein technischer Ausbildungstauchgang zur N1-Validierung ohne Freiwasser.',
    ),
    duration: loc(
      '1 inmersión técnica',
      '1 technical dive',
      '1 plongée technique',
      '1 technischer Tauchgang',
    ),
    depthLimit: null,
    price: 70,
    includes: locList(
      ['1 inmersión técnica de curso (validación de N1 sin agua abierta)'],
      ['1 technical course dive (N1 validation without open water)'],
      ['1 plongée technique de formation (validation N1 sans eau ouverte)'],
      ['1 technischer Ausbildungstauchgang (N1-Validierung ohne Freiwasser)'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico', price: '+10 €' },
        { label: 'Equipo completo (con ordenador)', price: '+15 €' },
      ],
      [
        { label: 'Basic equipment', price: '+€10' },
        { label: 'Full equipment (with computer)', price: '+€15' },
      ],
      [
        { label: 'Équipement de base', price: '+10 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+15 €' },
      ],
      [
        { label: 'Grundausrüstung', price: '+10 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+15 €' },
      ],
    ),
    requirements: locList(
      ['Máximo 2 buceadores por instructor'],
      ['Maximum 2 divers per instructor'],
      ['Maximum 2 plongeurs par instructeur'],
      ['Maximal 2 Taucher pro Ausbilder'],
    ),
    order: 11,
  },
  {
    _id: 'experience-deep-wreck',
    _type: 'dive',
    title: loc(
      'Inmersión Doble Especial Pecio Profundo (zona norte)',
      'Special Deep Wreck Double Dive (north zone)',
      'Double plongée spéciale épave profonde (zone nord)',
      'Spezieller Tieftauchgang Wrack (Nordzone)',
    ),
    description: loc(
      'Dos inmersiones guiadas en la zona norte (pecio coreano, Arona…).',
      'Two guided dives in the north zone (Korean wreck, Arona…).',
      'Deux plongées encadrées en zone nord (épave coréenne, Arona…).',
      'Zwei begleitete Tauchgänge in der Nordzone (koreanisches Wrack, Arona…).',
    ),
    duration: loc(
      '2 inmersiones guiadas',
      '2 guided dives',
      '2 plongées encadrées',
      '2 begleitete Tauchgänge',
    ),
    depthLimit: null,
    price: 115,
    includes: locList(
      ['2 inmersiones guiadas zona norte', 'Botellas, plomos y Nitrox incluidos'],
      ['2 guided dives in the north zone', 'Tanks, weights and Nitrox included'],
      ['2 plongées encadrées zone nord', 'Bouteilles, plombs et Nitrox inclus'],
      ['2 begleitete Tauchgänge Nordzone', 'Flaschen, Gewichte und Nitrox inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico', price: '+20 €' },
        { label: 'Equipo completo (con ordenador)', price: '+25 €' },
      ],
      [
        { label: 'Basic equipment', price: '+€20' },
        { label: 'Full equipment (with computer)', price: '+€25' },
      ],
      [
        { label: 'Équipement de base', price: '+20 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+25 €' },
      ],
      [
        { label: 'Grundausrüstung', price: '+20 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+25 €' },
      ],
    ),
    requirements: locList(
      ['Mínimo 4 participantes y condiciones meteorológicas muy favorables, con aprobación previa del director técnico'],
      ['Minimum 4 participants and very favourable weather conditions, subject to prior approval of the technical director'],
      ['Minimum 4 participants et conditions météo très favorables, avec approbation préalable du directeur technique'],
      ['Mindestens 4 Teilnehmer und sehr günstige Wetterbedingungen, mit vorheriger Genehmigung des technischen Leiters'],
    ),
    order: 12,
  },
]
```

- [ ] **Step 3: Delete `src/content/data/experiences.ts`**

```bash
git rm src/content/data/experiences.ts
```

- [ ] **Step 4: Verify**

At this point `queries.ts` still imports `experiencesData` from the now-deleted file, so `npm run build` is expected to fail — that's fixed in Task 6. Just confirm the two new files parse:

```bash
npx tsc --noEmit --skipLibCheck src/content/data/baptisms.ts src/content/data/dives.ts 2>&1 | grep -v "Cannot find module 'astro" || true
```

Expected: no type errors reported for `baptisms.ts`/`dives.ts` themselves (module-resolution warnings about unrelated Astro globals, if any, can be ignored).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(content): split experiences seed data into baptisms and dives"
```

---

### Task 6: Update `queries.ts`

**Files:**
- Modify: `src/sanity/queries.ts`

**Interfaces:**
- Consumes: `baptismsData` from `../content/data/baptisms`, `divesData` from `../content/data/dives` (produced in Task 5).
- Produces: `getBaptisms(): Promise<...>` and `getDives(): Promise<...>`, replacing `getExperiences(audience)`.

- [ ] **Step 1: Replace the imports**

In `src/sanity/queries.ts`, change:

```ts
import { sanityClient } from 'sanity:client'
import { centroInfoData } from '../content/data/centroInfo'
import { allCoursesData } from '../content/data/courses'
import { diveSitesData } from '../content/data/diveSites'
import { experiencesData } from '../content/data/experiences'
import { tariffExtrasData } from '../content/data/tariffExtras'
```

to:

```ts
import { sanityClient } from 'sanity:client'
import { baptismsData } from '../content/data/baptisms'
import { centroInfoData } from '../content/data/centroInfo'
import { allCoursesData } from '../content/data/courses'
import { divesData } from '../content/data/dives'
import { diveSitesData } from '../content/data/diveSites'
import { tariffExtrasData } from '../content/data/tariffExtras'
```

- [ ] **Step 2: Replace `getExperiences`**

Change:

```ts
export async function getExperiences(audience: 'beginner' | 'certified') {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "experience" && audience == $audience] | order(order asc) { ..., "image": image.asset->url }`,
      { audience },
    )
    return Array.isArray(data) && data.length > 0
      ? data
      : experiencesData.filter((e) => e.audience === audience)
  } catch {
    return experiencesData.filter((e) => e.audience === audience)
  }
}
```

to:

```ts
export async function getBaptisms() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "baptism"] | order(order asc) { ..., "image": image.asset->url }`,
    )
    return Array.isArray(data) && data.length > 0 ? data : baptismsData
  } catch {
    return baptismsData
  }
}

export async function getDives() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "dive"] | order(order asc) { ..., "image": image.asset->url }`,
    )
    return Array.isArray(data) && data.length > 0 ? data : divesData
  } catch {
    return divesData
  }
}
```

- [ ] **Step 3: Verify**

```bash
grep -n "getExperiences\|experiencesData" src/sanity/queries.ts
```

Expected: no output (both fully replaced).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor(sanity): replace getExperiences with getBaptisms/getDives"
```

---

### Task 7: Update the views

**Files:**
- Modify: `src/views/BaptismsView.astro`
- Modify: `src/views/DivesView.astro`
- Modify: `src/views/RatesView.astro`

**Interfaces:**
- Consumes: `getBaptisms()`, `getDives()` from `../sanity/queries` (produced in Task 6).

- [ ] **Step 1: Update `BaptismsView.astro`**

Change the import:

```ts
import { getExperiences } from '../sanity/queries'
```

to:

```ts
import { getBaptisms } from '../sanity/queries'
```

Change:

```ts
const experiences = await getExperiences('beginner')
```

to:

```ts
const experiences = await getBaptisms()
```

- [ ] **Step 2: Update `DivesView.astro`**

Change the import:

```ts
import { getExperiences } from '../sanity/queries'
```

to:

```ts
import { getDives } from '../sanity/queries'
```

Change:

```ts
const experiences = await getExperiences('certified')
```

to:

```ts
const experiences = await getDives()
```

- [ ] **Step 3: Update `RatesView.astro`**

Change the import:

```ts
import { getCourses, getExperiences, getTariffExtras } from '../sanity/queries'
```

to:

```ts
import { getBaptisms, getCourses, getDives, getTariffExtras } from '../sanity/queries'
```

Change:

```ts
const [bautizos, inmersiones, cursos, extras] = await Promise.all([
  getExperiences('beginner'),
  getExperiences('certified'),
  getCourses(),
  getTariffExtras(),
])
```

to:

```ts
const [bautizos, inmersiones, cursos, extras] = await Promise.all([
  getBaptisms(),
  getDives(),
  getCourses(),
  getTariffExtras(),
])
```

- [ ] **Step 4: Verify**

```bash
grep -rn "getExperiences" src/views
```

Expected: no output.

```bash
npm run build && npm run lint
```

Expected: both succeed with no errors — this is the first build since Task 1 with everything wired end-to-end (schema, production data, fallback data, queries, views all consistent).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(views): consume getBaptisms/getDives instead of getExperiences"
```

---

### Task 8: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full build + lint**

```bash
npm run build && npm run lint
```

Expected: both succeed with no errors.

- [ ] **Step 2: Confirm the built Bautismos/Inmersiones pages carry real content**

```bash
grep -o "El Bautismo\|Basic Diver" dist/baptisms/index.html | sort -u
grep -o "Doble Inmersión\|Bono 4 Inmersiones" dist/dives/index.html | sort -u
```

Expected: both greps print at least one match — confirms the pages built from real (migrated) Sanity data, not silently falling back to the seed data.

- [ ] **Step 3: Confirm no leftover references anywhere in `src/`**

```bash
grep -rln "experience\b" src/sanity src/content src/views 2>/dev/null
```

Expected: no output (or only unrelated matches — review manually if anything appears; there should be none, since every reference was covered in Tasks 1–7).

- [ ] **Step 4: Confirm the Studio structure shows both sections**

```bash
npm run dev
```

Then open `http://localhost:4321/admin` in a browser and confirm "Bautismos" and "Inmersiones" both appear as top-level sections in the left-hand list, each showing its documents (2 and 10 respectively), and that "Experiencia" no longer appears. Stop the dev server (Ctrl+C) once confirmed.

- [ ] **Step 5: Final commit (if Step 4 required no code changes, this is a no-op — skip if `git status` is clean)**

```bash
git status
```

If clean, no commit needed — the work was already committed at the end of each task.
