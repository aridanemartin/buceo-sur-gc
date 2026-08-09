# Buceo Sur Gran Canaria

Astro site with an embedded Sanity Studio (`/admin`), four languages (es/en/fr/de).
Content is seeded from the project's own documents (`docs/`) and every content section is
editable via the Sanity CMS.

## Architecture

- **Astro** (static output) with `@astrojs/vercel` for deployment and `@astrojs/react`
  islands for the interactive bits (Nav, Lightbox, ContactForm).
- **Sanity Studio** embedded at `/admin` via `@sanity/astro` (`studioBasePath`).
- **Field-level i18n**: every translatable field is a `localeString`/`localeText` object
  with `es`/`en`/`fr`/`de` sub-fields. `es` is required; `en`/`fr`/`de` fall back to
  `es` when empty.
- **Canonical content data** lives in `src/content/data/*.ts`, sourced from the docx
  documents in `docs/` (which take precedence over any other source). The same data
  powers both the seed scripts (writing to Sanity) and the build-time fallback, so the
  site renders full content even before Sanity is configured.
- Routes: `/`, `/dives`, `/baptisms`, `/courses`, `/rates`, `/gallery`, `/sidemount`,
  `/contact`, `/legal/{privacy,cancellation,terms}` — each with `/en/`, `/fr/`, `/de/`
  variants. Spanish is the default locale (no prefix).

## Development

1. Copy `.env.example` to `.env` and fill in `SANITY_PROJECT_ID`, `SANITY_DATASET`
   (usually `production`), `SANITY_API_TOKEN` (Editor permission, from manage.sanity.io).
   Also set the `PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET` copies used by the
   browser-bundled Studio.
2. `npm install`
3. `npm run dev` — site at `http://localhost:4321`, Studio at `http://localhost:4321/admin`.

Without `.env`, the build still succeeds: the Sanity integration is skipped and an offline
`sanity:client` shim makes every query fall back to `src/content/data`.

## Seeding content

One-time scripts in `scripts/` populate the Sanity dataset with the canonical content:

```bash
npm run seed scripts/seed-centro-info.mjs
npm run seed scripts/seed-certifying-agencies.mjs
npm run seed scripts/seed-courses.mjs
npm run seed scripts/seed-experiences.mjs
npm run seed scripts/seed-dive-sites.mjs
npm run seed scripts/seed-tariff-extras.mjs
```

## Still needed before launch

- **Sanity project**: create it at manage.sanity.io and set the credentials in `.env`
  (see above), then run the seed scripts.
- **Real photos/videos** for the Galería dive sites (uploaded via Sanity Studio — the
  docx documents note the gallery is meant to be updated over time).
- **Course descriptions**: the Cursos page is seeded from `docs/5. Tarifas.docx` (names,
  prices, durations, includes, supplements). Refine the marketing copy in Sanity Studio
  when doc 4 (Cursos) arrives.
- **Contact form**: client-side confirmation only (no backend), matching the previous site.

## Deployment

Deployed on Vercel via `@astrojs/vercel`. Set the same `SANITY_*` environment variables in
the Vercel project settings.

## Sanity content model

- `course` — courses (SSI/CMAS/PADI/FSGT), used by `/courses` and `/sidemount` (tagged).
- `certifyingAgency` — certifying bodies referenced by `course.agency`; can't be deleted while a published course still references it.
- `experience` — bautizos (beginner) and inmersiones (certified), used by `/baptisms` and `/dives`.
- `diveSite` — gallery sites, used by `/gallery`.
- `tariffExtra` — standalone priced items (nitrox, bottles, insurance), used by `/rates`.
- `centroInfo` (singleton) — home page: intro, history, installations, staff, stats, certifications.
