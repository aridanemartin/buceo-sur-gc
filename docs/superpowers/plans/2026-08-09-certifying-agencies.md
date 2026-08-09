# Manage "Entidades certificadoras" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded `course.agency` string list (SSI/CMAS/PADI/FSGT) with a
proper `certifyingAgency` document type, managed via CRUD in Sanity Studio, that
cannot be deleted while any published course still references it.

**Architecture:** New `certifyingAgency` Sanity document type (name/logo/website).
`course.agency` becomes a `reference` to it. A custom `delete` document action,
scoped to `certifyingAgency` only, disables itself when a live GROQ count shows
published courses referencing the document. Existing production data (18 published
courses, using `SSI`/`CMAS`) is migrated via a one-off script. Frontend queries
dereference `agency->name` so almost every consumer keeps treating `agency` as a
plain string; only `CoursesView.astro` additionally fetches the new entities to
show a logo next to each agency's section heading.

**Tech Stack:** Sanity Studio v6 (`sanity`, `sanity/structure`), `@sanity/client`,
Astro 7, plain Node ESM seed scripts (Node 24, native `.ts` import support — see
existing `scripts/seed-courses.mjs`).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-09-certifying-agencies-design.md` — follow
  it exactly; this plan implements it task-by-task.
- Code style: no semicolons, single quotes, trailing commas, 2-space indent
  (match surrounding files exactly — this repo has no Prettier config, style is
  purely by convention).
- Images: webp-only, enforced via `options: { accept: 'image/webp' }` on every
  Sanity `image` field (existing convention, e.g. `course.image`).
- No test framework exists in this repo (no Jest/Vitest/etc.). Verification gates
  are: `npm run build` (Astro/Vite production build — catches import errors and
  most bundling-time issues, including the Studio bundle in `sanity.config.ts`)
  and `npm run lint` (oxlint, includes `react/rules-of-hooks`). For
  data-migration tasks, verify with direct GROQ queries against the live dataset
  via `curl` (pattern below). For the delete-protection UI, verify manually via
  `npm run dev` → `http://localhost:4321/admin`.
- Live Sanity project: `SANITY_PROJECT_ID=3rasdmh3`, `SANITY_DATASET=production`,
  credentials in `.env` (already present, not committed). GROQ verification
  pattern used throughout this plan:
  ```bash
  source .env
  curl -s "https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" '<GROQ QUERY>')" \
    -H "Authorization: Bearer ${SANITY_API_TOKEN}"
  ```
- Seed scripts run via `npm run seed scripts/<file>.mjs` (see `README.md`
  "Seeding content"). They're idempotent (`createOrReplace` keyed by stable
  `_id`s) — safe to re-run.
- Task 4's migration script writes to the **live production dataset**. Confirm
  the counts in that task's verification step before and after — do not run it
  more than once without checking whether it already applied.

---

### Task 1: `certifyingAgency` document type

**Files:**
- Create: `src/sanity/schemaTypes/documents/certifyingAgency.ts`
- Modify: `src/sanity/schemaTypes/index.ts`

**Interfaces:**
- Produces: a registered Sanity document type named `'certifyingAgency'` with
  fields `name` (string, required), `logo` (image, webp-only, optional),
  `website` (url, optional). Referenced by name (string) in Task 2 — no direct
  import needed there.

- [ ] **Step 1: Create the schema file**

```typescript
// src/sanity/schemaTypes/documents/certifyingAgency.ts
import { defineField, defineType } from 'sanity'

export const certifyingAgency = defineType({
  name: 'certifyingAgency',
  title: 'Entidad certificadora',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { accept: 'image/webp' },
    }),
    defineField({ name: 'website', title: 'Sitio web', type: 'url' }),
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
})
```

- [ ] **Step 2: Register it in the schema index**

Read `src/sanity/schemaTypes/index.ts` first (current contents):

```typescript
import { centroInfo } from './documents/centroInfo'
import { course } from './documents/course'
import { diveSite } from './documents/diveSite'
import { experience } from './documents/experience'
import { tariffExtra } from './documents/tariffExtra'
import { localeString } from './objects/localeString'
import { localeText } from './objects/localeText'

export const schemaTypes = [
  localeString,
  localeText,
  course,
  experience,
  diveSite,
  tariffExtra,
  centroInfo,
]
```

Replace with:

```typescript
import { centroInfo } from './documents/centroInfo'
import { certifyingAgency } from './documents/certifyingAgency'
import { course } from './documents/course'
import { diveSite } from './documents/diveSite'
import { experience } from './documents/experience'
import { tariffExtra } from './documents/tariffExtra'
import { localeString } from './objects/localeString'
import { localeText } from './objects/localeText'

export const schemaTypes = [
  localeString,
  localeText,
  certifyingAgency,
  course,
  experience,
  diveSite,
  tariffExtra,
  centroInfo,
]
```

- [ ] **Step 3: Verify the Studio picks it up**

Run: `npm run dev`, open `http://localhost:4321/admin`.
Expected: a new "Entidad certificadora" item appears in the content list. Create
one test document (name "Test Agency") to confirm the form works, then delete it
(nothing references it yet, so delete should work normally — this task doesn't
add the protection yet).

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemaTypes/documents/certifyingAgency.ts src/sanity/schemaTypes/index.ts
git commit -m "feat(sanity): add certifyingAgency document type

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: `course.agency` becomes a reference

**Files:**
- Modify: `src/sanity/schemaTypes/documents/course.ts`

**Interfaces:**
- Consumes: the string type name `'certifyingAgency'` (Task 1).
- Produces: `course.agency` is now a Sanity reference field
  (`{_type: 'reference', _ref: <certifyingAgency _id>}` at the data layer).
  Task 4 and Task 6 depend on this shape.

- [ ] **Step 1: Update the field and preview**

Current `src/sanity/schemaTypes/documents/course.ts`:

```typescript
import { defineField, defineType } from 'sanity'

export const course = defineType({
  name: 'course',
  title: 'Curso',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString' }),
    defineField({
      name: 'agency',
      title: 'Entidad certificadora',
      type: 'string',
      options: { list: ['SSI', 'CMAS', 'PADI', 'FSGT'] },
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: { list: ['recreational', 'specialty', 'technical', 'professional'] },
    }),
    // ...unchanged fields...
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title.es', agency: 'agency', category: 'category', media: 'image' },
    prepare({ title, agency, category, media }) {
      return {
        title: title || 'Sin título',
        subtitle: [agency, category].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
```

Change the `agency` field definition to:

```typescript
    defineField({
      name: 'agency',
      title: 'Entidad certificadora',
      type: 'reference',
      to: [{ type: 'certifyingAgency' }],
    }),
```

Change the `preview` block to select `agency.name` instead of the raw `agency`
value (Sanity Studio preview `select` follows reference dot-paths):

```typescript
  preview: {
    select: { title: 'title.es', agencyName: 'agency.name', category: 'category', media: 'image' },
    prepare({ title, agencyName, category, media }) {
      return {
        title: title || 'Sin título',
        subtitle: [agencyName, category].filter(Boolean).join(' · '),
        media,
      }
    },
  },
```

Everything else in the file (all other `defineField` calls, `orderings`) stays
unchanged.

- [ ] **Step 2: Verify in Studio**

Run: `npm run dev`, open `http://localhost:4321/admin`, open any existing
course. Expected: the "Entidad certificadora" field now renders as a reference
picker (not a dropdown of hardcoded strings). It will show as empty/broken for
existing courses until Task 4 migrates the data — that's expected at this
point.

- [ ] **Step 3: Commit**

```bash
git add src/sanity/schemaTypes/documents/course.ts
git commit -m "feat(sanity): course.agency references certifyingAgency

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Canonical agency data + seed script

**Files:**
- Create: `src/content/data/certifyingAgencies.ts`
- Create: `scripts/seed-certifying-agencies.mjs`
- Modify: `README.md`

**Interfaces:**
- Produces: `certifyingAgenciesData: CertifyingAgencySeed[]` (4 entries: SSI,
  CMAS, PADI, FSGT, each with a stable `_id` of the form
  `certifying-agency-<lowercase-name>`) and `agencyIdByName: Record<string,
  string>` mapping e.g. `'SSI' -> 'certifying-agency-ssi'`, both exported from
  `src/content/data/certifyingAgencies.ts`. Task 4 imports `agencyIdByName`.
- After Step 3 (running the script), the live `production` dataset has 4
  `certifyingAgency` documents.

- [ ] **Step 1: Create the canonical data file**

```typescript
// src/content/data/certifyingAgencies.ts
// Canonical certifying agency data — the 4 agencies previously hardcoded as
// course.agency's options list (SSI/CMAS/PADI/FSGT). Powers the seed script;
// logos/websites are filled in later via Sanity Studio.
export interface CertifyingAgencySeed {
  _id: string
  _type: 'certifyingAgency'
  name: string
}

export const certifyingAgenciesData: CertifyingAgencySeed[] = [
  { _id: 'certifying-agency-ssi', _type: 'certifyingAgency', name: 'SSI' },
  { _id: 'certifying-agency-cmas', _type: 'certifyingAgency', name: 'CMAS' },
  { _id: 'certifying-agency-padi', _type: 'certifyingAgency', name: 'PADI' },
  { _id: 'certifying-agency-fsgt', _type: 'certifyingAgency', name: 'FSGT' },
]

// Maps the old string values (still used by src/content/data/courses.ts and
// by any course document not yet migrated) to the matching document _id.
export const agencyIdByName: Record<string, string> = Object.fromEntries(
  certifyingAgenciesData.map((a) => [a.name, a._id]),
)
```

- [ ] **Step 2: Create the seed script**

```javascript
// scripts/seed-certifying-agencies.mjs
// Seeds the certifying agency documents (SSI, CMAS, PADI, FSGT) referenced by
// courses. Idempotent (createOrReplace) — safe to re-run. Run this before
// seed-courses.mjs, since courses reference these documents by id.
// Run: npm run seed scripts/seed-certifying-agencies.mjs
import { createClient } from '@sanity/client'
import { certifyingAgenciesData } from '../src/content/data/certifyingAgencies.ts'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const tx = client.transaction()
for (const a of certifyingAgenciesData) tx.createOrReplace(a)
await tx.commit()
console.log(`${certifyingAgenciesData.length} certifying agencies seeded`)
```

- [ ] **Step 3: Run it against production**

Run: `npm run seed scripts/seed-certifying-agencies.mjs`
Expected output: `4 certifying agencies seeded`

Verify:
```bash
source .env
curl -s "https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" '*[_type=="certifyingAgency"]{_id,name}')" \
  -H "Authorization: Bearer ${SANITY_API_TOKEN}"
```
Expected: an array of 4 objects with `_id`s `certifying-agency-ssi`,
`certifying-agency-cmas`, `certifying-agency-padi`, `certifying-agency-fsgt`
and matching `name`s.

- [ ] **Step 4: Update README**

In `README.md`, in the "Seeding content" code block, add the new script
**before** `seed-courses.mjs` (courses will depend on it once Task 4 lands):

```markdown
npm run seed scripts/seed-centro-info.mjs
npm run seed scripts/seed-certifying-agencies.mjs
npm run seed scripts/seed-courses.mjs
npm run seed scripts/seed-experiences.mjs
npm run seed scripts/seed-dive-sites.mjs
npm run seed scripts/seed-tariff-extras.mjs
```

In the "Sanity content model" list, update the `course` line and add a new
`certifyingAgency` line:

```markdown
- `course` — courses (SSI/CMAS/PADI/FSGT), used by `/courses` and `/sidemount` (tagged).
- `certifyingAgency` — certifying bodies referenced by `course.agency`; can't be deleted while a published course still references it.
```

(Insert the `certifyingAgency` line directly after the `course` line, keeping
the rest of the list — `experience`, `diveSite`, `tariffExtra`, `centroInfo` —
unchanged.)

- [ ] **Step 5: Commit**

```bash
git add src/content/data/certifyingAgencies.ts scripts/seed-certifying-agencies.mjs README.md
git commit -m "feat(sanity): seed certifying agency documents

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Migrate existing courses + fix `seed-courses.mjs`

**Files:**
- Modify: `scripts/seed-courses.mjs`
- Create: `scripts/migrate-course-agency-refs.mjs`

**Interfaces:**
- Consumes: `agencyIdByName` from `src/content/data/certifyingAgencies.ts` (Task 3).
- Produces: every live `course` document's `agency` field becomes
  `{_type: 'reference', _ref: <certifying-agency id>}`. `seed-courses.mjs`
  will keep producing correctly-shaped data on any future re-seed (e.g. a
  fresh dataset).

- [ ] **Step 1: Fix `seed-courses.mjs` to write agency as a reference**

Current relevant section of `scripts/seed-courses.mjs`:

```javascript
import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { allCoursesData } from '../src/content/data/courses.ts'
```

... (uploadImage, courseImageFile, uploadedByFile setup unchanged) ...

```javascript
const courses = []
for (const c of allCoursesData) {
  const file = courseImageFile[c._id]
  let image = null
  if (file) {
    if (!uploadedByFile[file]) {
      uploadedByFile[file] = await uploadImage(assetsDir + file, file)
      await sleep(150)
    }
    image = uploadedByFile[file]
  }
  courses.push(image ? { ...c, image } : c)
}

const tx = client.transaction()
for (const c of courses) tx.createOrReplace(c)
await tx.commit()
console.log(`${courses.length} courses seeded`)
```

Change the import to also bring in `agencyIdByName`:

```javascript
import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { agencyIdByName } from '../src/content/data/certifyingAgencies.ts'
import { allCoursesData } from '../src/content/data/courses.ts'
```

Change the courses-building loop to convert `agency` to a reference:

```javascript
const courses = []
for (const c of allCoursesData) {
  const file = courseImageFile[c._id]
  let image = null
  if (file) {
    if (!uploadedByFile[file]) {
      uploadedByFile[file] = await uploadImage(assetsDir + file, file)
      await sleep(150)
    }
    image = uploadedByFile[file]
  }
  const agencyId = agencyIdByName[c.agency]
  if (!agencyId) throw new Error(`Unknown agency "${c.agency}" for course ${c._id}`)
  const agency = { _type: 'reference', _ref: agencyId }
  courses.push({ ...c, agency, ...(image ? { image } : {}) })
}

const tx = client.transaction()
for (const c of courses) tx.createOrReplace(c)
await tx.commit()
console.log(`${courses.length} courses seeded`)
```

(The rest of the file — the header comment, `client` setup, `uploadImage`,
`courseImageFile`, `uploadedByFile` — is unchanged.)

- [ ] **Step 2: Create the one-off production migration script**

This patches only the `agency` field on existing live course documents,
leaving everything else (images, etc.) untouched — deliberately more surgical
than re-running the full `seed-courses.mjs`, to avoid re-uploading and
duplicating course images in the asset library.

```javascript
// scripts/migrate-course-agency-refs.mjs
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
```

- [ ] **Step 3: Verify current production state before migrating**

```bash
source .env
curl -s "https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" 'count(*[_type=="course" && defined(agency) && agency._type != "reference"])')" \
  -H "Authorization: Bearer ${SANITY_API_TOKEN}"
```
Expected: `"result": 18` (matches the count checked during brainstorming) — if
it's already `0`, the migration already ran; skip Step 4 and go straight to
Step 5's verification.

- [ ] **Step 4: Run the migration**

Run: `npm run seed scripts/migrate-course-agency-refs.mjs`
Expected output: `18 course(s) migrated to agency references.`

- [ ] **Step 5: Verify the migration**

```bash
source .env
curl -s "https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" 'count(*[_type=="course" && agency._type == "reference"])')" \
  -H "Authorization: Bearer ${SANITY_API_TOKEN}"
```
Expected: `"result": 18`. Also re-run the Step 3 query — expect `"result": 0`
now.

Then in Studio (`npm run dev` → `/admin`), open a couple of courses and
confirm the "Entidad certificadora" field now shows the correct agency
(SSI/CMAS) as a resolved reference, not empty.

- [ ] **Step 6: Commit**

```bash
git add scripts/seed-courses.mjs scripts/migrate-course-agency-refs.mjs
git commit -m "fix(sanity): migrate course.agency to references

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: Delete-protection document action

**Files:**
- Create: `src/sanity/actions/protectDeleteWhenReferenced.ts`
- Modify: `sanity.config.ts`

**Interfaces:**
- Produces: `createProtectedDeleteAction(originalAction: DocumentActionComponent):
  DocumentActionComponent`, wired into `sanity.config.ts`'s `document.actions`
  resolver, scoped to `schemaType === 'certifyingAgency'`.

- [ ] **Step 1: Create the action**

```typescript
// src/sanity/actions/protectDeleteWhenReferenced.ts
// Wraps the built-in "delete" action for certifyingAgency documents: disables
// it while any published course still references the document, so editors
// can't orphan a course's agency reference by deleting it out from under it.
import { useEffect, useState } from 'react'
import {
  getPublishedId,
  useClient,
  type DocumentActionComponent,
  type DocumentActionProps,
} from 'sanity'

const API_VERSION = '2024-01-01'

export function createProtectedDeleteAction(
  originalAction: DocumentActionComponent,
): DocumentActionComponent {
  return function ProtectedDeleteAction(props: DocumentActionProps) {
    const client = useClient({ apiVersion: API_VERSION })
    const [publishedCourseCount, setPublishedCourseCount] = useState<number | null>(null)
    const publishedId = getPublishedId(props.id)

    useEffect(() => {
      let cancelled = false
      setPublishedCourseCount(null)
      client
        .fetch<number>(
          `count(*[_type == "course" && !(_id in path("drafts.**")) && references($id)])`,
          { id: publishedId },
        )
        .then((count) => {
          if (!cancelled) setPublishedCourseCount(count)
        })
      return () => {
        cancelled = true
      }
    }, [client, publishedId])

    const original = originalAction(props)
    if (!original) return original

    if (publishedCourseCount === null) {
      return { ...original, disabled: true, title: 'Comprobando cursos que usan esta entidad…' }
    }

    if (publishedCourseCount > 0) {
      const plural = publishedCourseCount === 1 ? '' : 's'
      return {
        ...original,
        disabled: true,
        title: `No se puede eliminar: usada por ${publishedCourseCount} curso${plural} publicado${plural}.`,
      }
    }

    return original
  }
}
```

- [ ] **Step 2: Wire it into `sanity.config.ts`**

Current `sanity.config.ts`:

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { StudioLayout } from './src/sanity/components/StudioLayout'
import { schemaTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

// NOTE: this config is bundled into the client-side Studio (loaded in the browser at /admin),
// so it must read env vars via `import.meta.env` (Vite's client-safe mechanism, requires the
// `PUBLIC_` prefix) rather than `process.env` (Node-only).
export default defineConfig({
  name: 'buceo-sur',
  title: 'Buceo Sur Gran Canaria',
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [structureTool({ structure })],
  schema: { types: schemaTypes },
  studio: { components: { layout: StudioLayout } },
})
```

Replace with:

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { createProtectedDeleteAction } from './src/sanity/actions/protectDeleteWhenReferenced'
import { StudioLayout } from './src/sanity/components/StudioLayout'
import { schemaTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

// NOTE: this config is bundled into the client-side Studio (loaded in the browser at /admin),
// so it must read env vars via `import.meta.env` (Vite's client-safe mechanism, requires the
// `PUBLIC_` prefix) rather than `process.env` (Node-only).
export default defineConfig({
  name: 'buceo-sur',
  title: 'Buceo Sur Gran Canaria',
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [structureTool({ structure })],
  schema: { types: schemaTypes },
  studio: { components: { layout: StudioLayout } },
  document: {
    actions: (prev, context) =>
      context.schemaType === 'certifyingAgency'
        ? prev.map((action) =>
            action.action === 'delete' ? createProtectedDeleteAction(action) : action,
          )
        : prev,
  },
})
```

- [ ] **Step 3: Verify manually in Studio**

Run: `npm run dev`, open `http://localhost:4321/admin`.
1. Open the "SSI" certifying agency document → the "Delete" action should be
   disabled, with a tooltip reading something like "No se puede eliminar:
   usada por N cursos publicados."
2. Create a new test agency (name "Temp Test") with no courses referencing
   it → its "Delete" action should be enabled and work normally. Delete it to
   clean up.

- [ ] **Step 4: Run the build and lint gates**

Run: `npm run build`
Expected: build succeeds (this bundles `sanity.config.ts`, so it will catch
TSX/import errors in the new action file).

Run: `npm run lint`
Expected: no errors (in particular, no `react/rules-of-hooks` violations).

- [ ] **Step 5: Commit**

```bash
git add src/sanity/actions/protectDeleteWhenReferenced.ts sanity.config.ts
git commit -m "feat(sanity): block deleting certifying agencies used by published courses

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: Frontend queries

**Files:**
- Modify: `src/sanity/queries.ts`

**Interfaces:**
- Produces: `getCourses()` / `getCoursesByTag(tag)` continue returning course
  objects whose `.agency` is a plain string (dereferenced agency name) — no
  change for any existing consumer. New `getCertifyingAgencies(): Promise<Array<{
  name: string; logo?: string; website?: string }>>`.

- [ ] **Step 1: Update `getCourses` and `getCoursesByTag`, add `getCertifyingAgencies`**

Current relevant section of `src/sanity/queries.ts`:

```typescript
export async function getCourses() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "course"] | order(order asc) { ..., "image": image.asset->url }`,
    )
    return Array.isArray(data) && data.length > 0 ? data : allCoursesData
  } catch {
    return allCoursesData
  }
}

export async function getCoursesByTag(tag: string) {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "course" && $tag in tags] | order(order asc) { ..., "image": image.asset->url }`,
      { tag },
    )
    return Array.isArray(data) && data.length > 0
      ? data
      : allCoursesData.filter((c) => c.tags?.includes(tag))
  } catch {
    return allCoursesData.filter((c) => c.tags?.includes(tag))
  }
}
```

Replace both fetch projections to also dereference `agency`:

```typescript
export async function getCourses() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "course"] | order(order asc) { ..., "image": image.asset->url, "agency": agency->name }`,
    )
    return Array.isArray(data) && data.length > 0 ? data : allCoursesData
  } catch {
    return allCoursesData
  }
}

export async function getCoursesByTag(tag: string) {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "course" && $tag in tags] | order(order asc) { ..., "image": image.asset->url, "agency": agency->name }`,
      { tag },
    )
    return Array.isArray(data) && data.length > 0
      ? data
      : allCoursesData.filter((c) => c.tags?.includes(tag))
  } catch {
    return allCoursesData.filter((c) => c.tags?.includes(tag))
  }
}
```

Add a new function, placed after `getCourses`/`getCoursesByTag` (e.g. right
before `getExperiences`):

```typescript
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

- [ ] **Step 2: Verify with a build and a manual data check**

Run: `npm run build`
Expected: build succeeds.

```bash
source .env
curl -s "https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" '*[_type=="course"]|order(order asc){_id,"agency":agency->name}[0...3]')" \
  -H "Authorization: Bearer ${SANITY_API_TOKEN}"
```
Expected: the 3 returned courses show `"agency": "SSI"` or `"agency": "CMAS"`
(a plain string, matching the query added in Step 1), not an empty value.

- [ ] **Step 3: Commit**

```bash
git add src/sanity/queries.ts
git commit -m "feat(sanity): dereference agency in course queries, add getCertifyingAgencies

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: Show agency logo on the courses page

**Files:**
- Modify: `src/views/CoursesView.astro`

**Interfaces:**
- Consumes: `getCertifyingAgencies()` (Task 6).

- [ ] **Step 1: Fetch agencies and attach logo/website to each group**

Current relevant section of `src/views/CoursesView.astro` (top of the
frontmatter):

```astro
import CourseCard from '../components/CourseCard.astro'
import CtaBanner from '../components/CtaBanner.astro'
import type { Locale } from '../i18n/locales'
// src/views/CoursesView.astro
// Renders all course documents from getCourses(), grouped by agency (SSI / CMAS)
// and category (recreational / specialty / technical).
import BaseLayout from '../layouts/BaseLayout.astro'
import { SITE } from '../lib/constants'
import { t } from '../sanity/localize'
import { getCourses } from '../sanity/queries'
import styles from '../styles/viewCommon.module.css'
import rowStyles from '../styles/rowLayout.module.css'

interface Props {
  lang: Locale
}

const { lang } = Astro.props
const courses = await getCourses()
```

Change the `getCourses` import and the data fetch:

```astro
import CourseCard from '../components/CourseCard.astro'
import CtaBanner from '../components/CtaBanner.astro'
import type { Locale } from '../i18n/locales'
// src/views/CoursesView.astro
// Renders all course documents from getCourses(), grouped by agency (SSI / CMAS)
// and category (recreational / specialty / technical).
import BaseLayout from '../layouts/BaseLayout.astro'
import { SITE } from '../lib/constants'
import { t } from '../sanity/localize'
import { getCertifyingAgencies, getCourses } from '../sanity/queries'
import styles from '../styles/viewCommon.module.css'
import rowStyles from '../styles/rowLayout.module.css'

interface Props {
  lang: Locale
}

const { lang } = Astro.props
const courses = await getCourses()
const agencies = await getCertifyingAgencies()
const agencyByName = new Map(agencies.map((a: any) => [a.name, a]))
```

Then update the `grouped` construction (currently `agencies` is also the
variable name for the distinct-agency-strings list derived from `courses` —
rename that local to `agencyNames` to avoid clashing with the new `agencies`
fetch result):

Current:

```typescript
const agencies = [...new Set(courses.map((c: any) => c.agency))]
const grouped = agencies.map((agency) => ({
  agency,
  categories: [
    ...new Set(courses.filter((c: any) => c.agency === agency).map((c: any) => c.category)),
  ],
  items: courses.filter((c: any) => c.agency === agency),
}))
```

Replace with:

```typescript
const agencyNames = [...new Set(courses.map((c: any) => c.agency))]
const grouped = agencyNames.map((agency) => ({
  agency,
  logo: agencyByName.get(agency)?.logo ?? null,
  website: agencyByName.get(agency)?.website ?? null,
  categories: [
    ...new Set(courses.filter((c: any) => c.agency === agency).map((c: any) => c.category)),
  ],
  items: courses.filter((c: any) => c.agency === agency),
}))
```

- [ ] **Step 2: Render the logo next to the section heading**

Current markup for the group heading:

```astro
      <section class={styles.sectionAlt} id={group.agency.toLowerCase()}>
        <div class={styles.container}>
          <p class={styles.sectionEyebrow}>{agencyLabel}</p>
          <h2 class={styles.sectionTitle}>{group.agency}</h2>

          {group.categories.map((category) => (
```

Replace with (note the new closing `</div>` for `.agencyHeading` — it goes
right before the existing blank line and `{group.categories.map(...)}`,
which stays exactly as-is):

```astro
      <section class={styles.sectionAlt} id={group.agency.toLowerCase()}>
        <div class={styles.container}>
          <p class={styles.sectionEyebrow}>{agencyLabel}</p>
          <div class="agencyHeading">
            <h2 class={styles.sectionTitle}>{group.agency}</h2>
            {group.logo ? (
              group.website ? (
                <a href={group.website} target="_blank" rel="noopener noreferrer">
                  <img src={group.logo} alt={group.agency} class="agencyLogo" />
                </a>
              ) : (
                <img src={group.logo} alt={group.agency} class="agencyLogo" />
              )
            ) : null}
          </div>

          {group.categories.map((category) => (
```

(Everything after this line — categories/items rendering, and the final
closing `</div></section>` for `styles.container`/`styles.sectionAlt` — is
unchanged.)

- [ ] **Step 3: Add scoped styles**

At the end of the file, after the closing `</BaseLayout>` tag, add (this file
currently has no `<style>` block — check by reading the full file first; if
one already exists, add these rules inside it instead of creating a new
block):

```astro
<style>
  .agencyHeading {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }
  .agencyLogo {
    height: 32px;
    width: auto;
  }
</style>
```

Note: `styles.sectionTitle` already carries a `margin-bottom: 12px` (see
`src/styles/viewCommon.module.css`) — since it now sits inside `.agencyHeading`
next to the logo, that margin no longer visually separates the heading from
the content below it, hence adding `margin-bottom: 12px` to `.agencyHeading`
itself.

- [ ] **Step 4: Verify**

Run: `npm run dev`, open `http://localhost:4321/courses`.
Expected: page renders exactly as before (agencies currently have no logo
seeded, so `group.logo` is `null` and nothing extra renders) — confirms the
change is non-breaking. Then, in Studio, add a logo image to the "SSI"
document, reload the courses page, and confirm the logo now appears next to
the "SSI" heading.

Run: `npm run build && npm run lint`
Expected: both succeed.

- [ ] **Step 5: Commit**

```bash
git add src/views/CoursesView.astro
git commit -m "feat(courses): show certifying agency logo next to section heading

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: Final verification pass

**Files:** none (verification only).

- [ ] **Step 1: Full build and lint**

Run: `npm run build`
Expected: succeeds with no errors.

Run: `npm run lint`
Expected: succeeds with no errors.

- [ ] **Step 2: End-to-end data check**

```bash
source .env
curl -s "https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" '{"agencies": count(*[_type=="certifyingAgency"]), "coursesWithRef": count(*[_type=="course" && agency._type=="reference"]), "coursesWithString": count(*[_type=="course" && agency._type=="string"])}')" \
  -H "Authorization: Bearer ${SANITY_API_TOKEN}"
```
Expected: `{"agencies": 4, "coursesWithRef": 18, "coursesWithString": 0}`.

- [ ] **Step 3: Manual Studio walkthrough**

Run: `npm run dev`, open `http://localhost:4321/admin`.
1. "Entidad certificadora" list shows 4 entries (SSI, CMAS, PADI, FSGT).
2. Add a new entity ("Test") → succeeds.
3. Edit "Test"'s name → succeeds.
4. Delete "Test" (unreferenced) → succeeds.
5. Attempt to delete "SSI" or "CMAS" → delete action is disabled with the
   "usada por N cursos publicados" tooltip.
6. Open `http://localhost:4321/courses` → page renders correctly, courses
   still grouped and labeled by agency name.

- [ ] **Step 4: Confirm no stray changes**

Run: `git status`
Expected: working tree clean (everything committed in Tasks 1–7). If anything
is uncommitted, review and commit it.
