# Split "Experiencia" into `baptism` (Bautismos) and `dive` (Inmersiones)

## Goal

The frontend already treats baptisms and dives as two separate sections
(`BaptismsView.astro` / `DivesView.astro`, filtered from a shared `experience`
type via `audience`). Mirror that split in Sanity: two independent document
types instead of one type with an `audience` discriminator — the same pattern
already used for `course` / `sidemountCourse`. Also sweep the whole Sanity
admin for dead code (unused fields/components) and remove what's found.

## Current state

- `src/sanity/schemaTypes/documents/experience.ts`: single `experience` type,
  `audience: 'beginner' | 'certified'` field selects which page it belongs to.
- `src/sanity/queries.ts`: `getExperiences(audience)` — one function, called
  with `'beginner'` (`BaptismsView.astro`) or `'certified'`
  (`DivesView.astro`), and both (`RatesView.astro`).
- `src/content/data/experiences.ts`: fallback/seed data, both audiences in one
  file (`experiencesData`), same shape as the Sanity documents.
- Production dataset (`3rasdmh3` / `production`) has **12 published
  `experience` documents** (2 `beginner`, 10 `certified`), no drafts. Nothing
  else references `experience` documents.
- Dead-code sweep across every schema field vs. its Frontend usage found two
  unused fields:
  - `groupDiscount` (`experience`, `course`, `sidemountCourse` + their seed
    data files) — defined and seeded but never read by any `.astro`/`.tsx`
    file.
  - `certifyingAgency.website` — fetched by `getCertifyingAgencies()` but only
    `.logo` is ever read (`CoursesView.astro`); `.website` has no consumer.

  Every other field on every document type (`centroInfo`, `course`,
  `sidemountCourse`, `diveSite`, `tariffExtra`, `certifyingAgency`) was
  confirmed in use. All custom Studio components (`BareField`,
  `ImagesFieldWarning`, `StatsFieldExample`, `StudioLayout`) are wired into a
  schema field and in use — none are dead.

## Changes

### 1. Two new document types replace `experience`

`src/sanity/schemaTypes/documents/baptism.ts` ("Bautismos"):
- `title` (localeString), `description` (localeText), `duration`
  (localeString), `depthLimit` (number), `price` (number), `includes`
  (localeList), `supplements` (localeSupplementList), `requirements`
  (localeList), `reservationLink` (url), `videoUrl` (url), `image` (image,
  webp-only), `order` (number).
- `orderings`/`preview` follow the same pattern as `experience.ts` today
  (title, duration + media; `audience` dropped from the preview subtitle
  since the type itself now carries that meaning).

`src/sanity/schemaTypes/documents/dive.ts` ("Inmersiones"):
- Same fields as `baptism`, plus `isPackage` (boolean, `initialValue: false`)
  — only ever set on dive bundles (`Bono 4/6/8/10 Inmersiones`), never on a
  baptism.

Neither type has `audience` (redundant — the type is the discriminator now)
or `groupDiscount` (dead, see below).

`src/sanity/schemaTypes/index.ts`: replace the `experience` import/entry with
`baptism` and `dive`. No `structure.ts` change needed — both types have their
own Spanish `title`, so `documentTypeListItems()` lists them like `course`,
`diveSite`, etc. do today.

### 2. Dead code removal

- Remove `groupDiscount` entirely: field from `experience`/`baptism`/`dive`
  (i.e. just don't carry it over), `course.ts`, `sidemountCourse.ts`; the
  `groupDiscount` property from the `ExperienceSeed`/course/sidemountCourse
  interfaces and every seed entry in `src/content/data/courses.ts` and the
  new `baptisms.ts`/`dives.ts` seed files.
- Remove `certifyingAgency.website`: field from
  `src/sanity/schemaTypes/documents/certifyingAgency.ts`, and drop `website`
  from the GROQ projection in `getCertifyingAgencies()`
  (`src/sanity/queries.ts`).

### 3. Production data migration

One-off script (not committed — written, run against the live `production`
dataset using the existing `SANITY_API_TOKEN` from `.env`, then deleted),
following the same shape as the certifying-agencies migration:

1. Fetch all 12 `experience` documents (`_id`, `audience`).
2. For each, `client.patch(id).set({ _type: audience === 'beginner' ?
   'baptism' : 'dive' }).unset(['audience', 'groupDiscount']).commit()` —
   `_id` is kept as-is (nothing references `experience` documents, so this is
   safe).
3. Verify: `count(*[_type == "baptism"])` == 2, `count(*[_type == "dive"])`
   == 10, `count(*[_type == "experience"])` == 0, spot-check a couple of
   patched documents for the dropped fields.

### 4. Frontend query changes

`src/sanity/queries.ts`: `getExperiences(audience)` is replaced by
`getBaptisms()` and `getDives()`, querying `*[_type == "baptism"] | order(order
asc)` / `*[_type == "dive"] | order(order asc)` respectively (same `image`
projection as today).

### 5. Frontend data/view changes

- `src/content/data/experiences.ts` splits into `src/content/data/baptisms.ts`
  (`baptismsData`) and `src/content/data/dives.ts` (`divesData`), each keeping
  only the fields relevant to their type (no `audience`, no `groupDiscount`;
  `isPackage` only in `dives.ts`).
- `BaptismsView.astro`: `getExperiences('beginner')` → `getBaptisms()`,
  `experiencesData.filter(...)` fallback → `baptismsData` import.
- `DivesView.astro`: `getExperiences('certified')` → `getDives()`, fallback →
  `divesData` import.
- `RatesView.astro`: the two `getExperiences(...)` calls become `getBaptisms()`
  and `getDives()`.

## Out of scope

- No visual/UI changes to `BaptismsView`, `DivesView`, or `RatesView` — same
  cards, same data, just re-sourced.
- No change to `course` / `sidemountCourse` beyond removing `groupDiscount`.
- No new Studio components, icons, or custom `structure.ts` list items for
  `baptism`/`dive` — the default `documentTypeListItems()` entry (as used by
  `course`, `diveSite`, `tariffExtra`, `certifyingAgency`) is enough.
