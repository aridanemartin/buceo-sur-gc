# Design: Migrate to Astro + Sanity CMS, multi-page multilingual site

Date: 2026-07-31

## Context

The current site (`buceo-sur-gc`) is a single-page Vite + React SPA: one scrolling page
with Nav/Hero/About/Services/Contact sections, anchor-linked, client-side rendered only.
Only the Nav and Hero strings actually go through `src/i18n.js` — About/Services/Contact
are hardcoded Spanish.

`docs/spec.md` describes the intended site as 6-7 real pages (Centro, Inmersiones,
Bautizos, Cursos, Tarifas, Galería, Sidemount) in Spanish, French, English and German,
with Spanish as the source language ("te mando solo texto en español... luego la IA va
producir los textos en otro idioma").

This design covers three coupled changes requested together:
1. Sourcing real content by crawling the previous live site,
   https://www.buceosur-gc.com/ (French section crawled for structure/facts).
2. Restructuring the site into the multi-page layout from `docs/spec.md`.
3. Integrating Sanity as a headless CMS for the content that changes over time
   (courses, pricing, dive sites/gallery, services copy).

## Architecture & stack

- **Migrate from Vite+React SPA to Astro.** Astro prerenders static HTML per page at
  build time (real per-page SEO), while `@astrojs/react` provides islands for the few
  interactive bits: mobile nav menu, language switcher, contact form, gallery lightbox.
- **Sanity Studio embedded in the same Astro project** at `/admin`, via the official
  `@sanity/astro` integration (`npx astro add @sanity/astro @astrojs/react`, then
  `studioBasePath: '/admin'` in `astro.config.mjs`). One repo, one deploy — no separate
  Studio app to host.
- **Content fetched at build time** via `sanityClient.fetch(...)` (GROQ queries),
  `useCdn: false` since this is a static build.
- **Prerequisite:** the user already has a Sanity.io account/project; they will supply
  `projectId`/`dataset` (or create the project themselves) at implementation time —
  not something this design or its plan needs to script.

## Routing & page structure

Spanish is the default locale served at the root path (no prefix, since it's the source
language and primary market). English, French, German are prefixed (`/en/`, `/fr/`,
`/de/`). **URL slugs are the same English words across all four locales** — e.g.
`/courses`, `/en/courses`, `/fr/courses`, `/de/courses` — rather than translating the
slug per language.

Rationale: Google's own guidance is that hreflang tags + fully translated page
titles/meta descriptions/on-page content drive local search ranking, not the literal
URL slug. Translating slugs per locale would need a slug field per language in the
schema, per-locale route resolution, and creates redirect risk if a slug is ever
renamed — complexity not justified for this site's competitive landscape. SEO effort
instead goes into hreflang tags and fully translated on-page content/metadata.

| Page | Path | Source |
|---|---|---|
| Centro de buceo (home) | `/`, `/en/`, `/fr/`, `/de/` | old "qui-et-où-sommes-nous" + current About |
| Inmersiones | `/dives` (+ locale prefix) | old "excursions-et-séjours" |
| Bautizos | `/baptisms` | old "baptêmes" |
| Cursos de buceo | `/courses` | old "formations" **+ Divemaster folded in** as the most advanced entry |
| Tarifas | `/rates` | consolidated pricing from courses/baptisms/excursions/en-pratique |
| Galería | `/gallery` | old "images-des-sites" |
| Sidemount | `/sidemount` | old "sidemount" |
| Contacto | `/contact` | current Contact section, becomes its own page |
| Legal ×3 | `/legal/privacy`, `/legal/cancellation`, `/legal/terms` (+ locale prefix) | static Markdown, texts to be supplied by user later |

Nav, footer, booking (Buky) link, phone numbers, and social links stay hardcoded in one
small constants file — out of Sanity's scope per the user's decision, since they rarely
change and don't need CMS overhead. Legal page bodies are also static Markdown, not
Sanity documents, for the same reason.

## Sanity content model

Reusable localized field types, following Sanity's standard field-level i18n recipe —
one object type per field, with `es`/`en`/`fr`/`de` sub-fields (chosen over the
document-internationalization plugin because content volume is small and side-by-side
editing of all four languages on one document is preferable to managing linked sibling
documents):

- `localeString` — object with `es`, `en`, `fr`, `de` string fields (titles/labels)
- `localeText` — same shape, `text` fields (descriptions/paragraphs)

Document types:

- **`course`** — used by Cursos (`/courses`) and Sidemount (`/sidemount`, filtered by
  tag). Fields: `title` (localeString), `agency` (string enum: SSI/CMAS/PADI/FSGT),
  `category` (enum: recreational/specialty/technical/professional), `summary`
  (localeText), `prerequisites` (localeText), `depthLimit`, `duration`, `minAge`,
  `price`, `groupDiscount` (localeString), `tags` (array of string, includes
  `"sidemount"` for the two sidemount courses), `order` (number).
- **`experience`** — used by Bautizos (`/baptisms`) and Inmersiones (`/dives`). Fields:
  `title` (localeString), `audience` (enum: beginner/certified), `description`
  (localeText), `duration`, `depthLimit`, `price`, `groupDiscount` (localeString),
  `order`.
- **`diveSite`** — used by Galería (`/gallery`), referenced from Inmersiones. Fields:
  `name` (localeString), `depthRange` (string), `levelTag` (localeString),
  `description` (localeText), `images` (array of image), `youtubeUrl` (url), `order`.
- **`tariffExtra`** — used by Tarifas (`/rates`) for standalone priced items not tied to
  a course/experience (insurance daily/weekly/annual, equipment rental, Pack 10,
  7-night stay package, refresher training). Fields: `title` (localeString),
  `description` (localeText), `price`, `unit` (localeString, e.g. "por día"), `order`.
- **`centroInfo`** (singleton) — used by the home page. Fields: `intro` (localeText),
  `history` (localeText), `stats` (array of {value: string, label: localeString}),
  `certifications` (array of {name: string, logo: image}) — using the old site's
  certification list (Gobierno de Canarias, FSGT, SSI, PADI/CMAS), which was confirmed
  as accurate over the differing list in `docs/spec.md`.

`/rates` aggregates `price`/`groupDiscount` fields across `course`, `experience`, and
`tariffExtra` into one consolidated table, matching the spec's "todos los tarifas en la
misma página con opciones y suplemento posible."

**Missing-translation fallback:** if a locale sub-field (`en`/`fr`/`de`) is empty,
render the `es` value instead of blank content — supports the plan to launch with
complete Spanish content and fill in other languages progressively.

## Content migration

The crawl of https://www.buceosur-gc.com/ (French section) surfaced real structure and
facts: course catalog (SSI Scuba Diver/OW/AOW/specialties, CMAS PA20/PE40/N2,
Divemaster), pricing (baptisms €80/€120, guided dives €50-€115, packages, insurance
€7/€15/€40), and ~9 named dive sites for the gallery (El Cabrón, Risco Verde, Tufia,
Pasito Blanco, wrecks Cermona/Arona/Comotu, Sardina del Norte, Caleta de Abajo).

Since the user's source language is Spanish and the crawled text is French, migration
does **not** copy-translate the French copy. Instead:

1. Author fresh Spanish copy per Sanity document, informed by the crawled facts (prices,
   durations, depth limits, prerequisites carry over directly as facts; descriptive
   marketing copy is written fresh in Spanish, matching the current site's voice).
2. Generate `en`/`fr`/`de` field values from that Spanish source — same process the
   current `i18n.js` already uses for nav strings, just extended to every document.
3. Photos/videos: crawling cannot retrieve the old site's image binaries. Gallery
   `diveSite` documents are seeded with real names/descriptions/YouTube links where
   found; the `images` field is left empty with a placeholder note for the user to
   upload via Sanity's media library.
4. Legal pages: static Markdown placeholders until the user sends the real
   privacidad/cancelación/condiciones texts (per `docs/spec.md`).

## Out of scope

- Automated tests: no test framework exists in the project today; verification relies
  on `astro build` succeeding, `astro check`, and manual browser checks per locale.
  Introducing a test framework is not part of this design (YAGNI — can be proposed
  separately if desired).
- Actual Sanity project creation/credentials — user-owned account action, handled at
  implementation time, not scripted by the plan.
- Divemaster as a separate page — folded into the Cursos course catalog per user
  decision.
