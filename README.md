# Buceo Sur Gran Canaria

Astro site with an embedded Sanity Studio (`/admin`), four languages (es/en/fr/de).
Every content section is editable via the Sanity CMS.

## Architecture

- **Astro** (static output) with `@astrojs/vercel` for deployment and `@astrojs/react`
  islands for the interactive bits (Nav, Lightbox, ContactForm).
- **Sanity Studio** embedded at `/admin` via `@sanity/astro` (`studioBasePath`).
- **Field-level i18n**: every translatable field is a `localeString`/`localeText` object
  with `es`/`en`/`fr`/`de` sub-fields. `es` is required; `en`/`fr`/`de` fall back to
  `es` when empty.
- **Canonical content data** lives in `src/content/data/*.ts` and is the build-time
  fallback: the site renders full content even when Sanity is unreachable or a
  document type hasn't been seeded yet.
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

## Still needed before launch

- **Sanity project**: create it at manage.sanity.io, set the credentials in `.env` (see
  above), and add content for each document type via Studio — the canonical data in
  `src/content/data/*.ts` is the fallback shape to match, not something that auto-seeds.
- **Real photos/videos** for the Galería dive sites (uploaded via Sanity Studio — the
  gallery is meant to be updated over time).
- **Contact form**: client-side confirmation only (no backend), matching the previous site.

## Deployment

Deployed on Vercel via `@astrojs/vercel`. Set the same `SANITY_*` environment variables in
the Vercel project settings.

## Sanity content model

- `course` — courses (SSI/CMAS/PADI/FSGT), used by `/courses` and `/sidemount` (tagged).
- `certifyingAgency` — certifying bodies referenced by `course.agency`; can't be deleted while a published course still references it.
- `baptism` — bautizos (beginner), used by `/baptisms`.
- `dive` — inmersiones (certified), used by `/dives`.
- `diveSite` — gallery sites, used by `/gallery`.
- `tariffExtra` — standalone priced items (nitrox, bottles, insurance), used by `/rates`.
- `centroInfo` (singleton) — home page: intro, history, installations, staff, stats, certifications.
