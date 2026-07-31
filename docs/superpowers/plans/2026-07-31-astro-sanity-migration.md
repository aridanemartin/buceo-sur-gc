# Astro + Sanity Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-page Vite/React SPA with a multi-page, four-language (es/en/fr/de) Astro site backed by an embedded Sanity CMS, seeded with real content sourced from the previous live site.

**Architecture:** Astro (static output by default, `@astrojs/vercel` adapter for the one on-demand `/admin` route) with `@astrojs/react` islands for interactive bits (nav menu, language switcher, contact form). Sanity Studio embedded at `/admin` via `@sanity/astro`. Content fetched at build time with GROQ via `sanity:client`. Field-level i18n: every translatable field is a `localeString`/`localeText` object with `es`/`en`/`fr`/`de` sub-fields, `es` required, others falling back to `es` when empty.

**Tech Stack:** Astro, `@astrojs/react`, `@astrojs/vercel`, `@sanity/astro`, `sanity`, `@sanity/client` (for seed scripts), React 19 (already in `package.json`).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-31-astro-sanity-migration-design.md` — every task below implements a section of it.
- Locales: `es` (default, unprefixed), `en`, `fr`, `de` (prefixed `/en/`, `/fr/`, `/de/`). Configured via Astro's native i18n routing with `prefixDefaultLocale: false`.
- URL slugs are the **same English words across all locales**: `/`, `/dives`, `/baptisms`, `/courses`, `/rates`, `/gallery`, `/sidemount`, `/contact`, `/legal/privacy`, `/legal/cancellation`, `/legal/terms`.
- No automated test framework exists and none is introduced (per spec's "Out of scope"). Verification per task = `npm run build` succeeding + manual check via `npm run dev` in the browser for each affected locale.
- Deploy target: Vercel (confirmed by user) — `@astrojs/vercel` adapter, `output` stays the Astro default (static-first; only `/admin` opts out via `export const prerender = false`).
- Prerequisite the user owns: a Sanity project already exists. Before Task 2, the user must supply `SANITY_PROJECT_ID`, `SANITY_DATASET` (typically `production`), and a write-capable `SANITY_API_TOKEN` (created at manage.sanity.io → API → Tokens → Editor permission) in a local `.env` file (`.env` is already covered by the default Vite `.gitignore`; confirm it's still gitignored after the Astro migration in Task 1).
- Missing-translation fallback: any `t(field, lang)` call returns `field.es` when `field[lang]` is empty — implemented once in Task 3, used everywhere.
- Divemaster is a `course` document (category `professional`), not a separate page.
- Some `course` documents have `price: null` because the crawled source material didn't include a euro figure for every course (only structural facts — duration, dive count, prerequisites — were available). This is real, intentional data, not a plan omission: the user fills in exact pricing via Sanity Studio before launch. All other prices below are real figures taken from the crawled site.

---

### Task 1: Astro project scaffold, remove the Vite/React SPA

**Files:**
- Create: `astro.config.mjs`
- Create: `src/pages/index.astro` (temporary placeholder, replaced in Task 6)
- Modify: `package.json`
- Delete: `vite.config.js`, `index.html`, `src/App.jsx`, `src/App.css`, `src/main.jsx`, `src/index.css`, `src/i18n.js`, `src/components/` (entire tree — About/Contact/Footer/Header/Hero/Nav/Services), `src/assets/react.svg`, `src/assets/vite.svg`
- Keep: `src/assets/hero.png`, `public/buceoSur.png`, `public/favicon.svg`, `public/icons.svg`, `public/logo.png` (still used by later tasks)

**Interfaces:**
- Produces: an Astro project buildable with `npm run build`, dev server with `npm run dev`, matching the script names the rest of the plan assumes.

- [ ] **Step 1: Remove the old Vite/React SPA files**

```bash
git rm -r vite.config.js index.html src/App.jsx src/App.css src/main.jsx src/index.css src/i18n.js src/components src/assets/react.svg src/assets/vite.svg
```

- [ ] **Step 2: Install Astro and adapters, replacing Vite**

```bash
npm uninstall vite @vitejs/plugin-react
npm install astro @astrojs/react @astrojs/vercel @sanity/astro sanity @sanity/client react react-dom
npm install -D @types/react @types/react-dom
```

- [ ] **Step 3: Create `astro.config.mjs`**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import sanity from '@sanity/astro'

export default defineConfig({
  adapter: vercel(),
  i18n: {
    locales: ['es', 'en', 'fr', 'de'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sanity({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET ?? 'production',
      useCdn: false,
      studioBasePath: '/admin',
    }),
    react(),
  ],
})
```

- [ ] **Step 4: Update `package.json` scripts**

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "lint": "oxlint",
    "seed": "node --env-file=.env"
  }
}
```

- [ ] **Step 5: Add a placeholder home page so the build has something to render**

```astro
---
// src/pages/index.astro
// Temporary — replaced by the real HomeView in Task 6.
---
<html lang="es">
  <body><p>Buceo Sur — migrating to Astro.</p></body>
</html>
```

- [ ] **Step 6: Confirm `.env` is gitignored**

Check `.gitignore` contains a `.env` (or `.env*`) line; add one if the Vite scaffold's `.gitignore` didn't already have it (Vite's default template does, but verify).

- [ ] **Step 7: Verify the build**

Run: `npm run build`
Expected: build succeeds, `dist/` contains a prerendered `index.html`.

Run: `npm run dev`, open `http://localhost:4321/`
Expected: the placeholder text renders.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: migrate project scaffold from Vite/React SPA to Astro"
```

---

### Task 2: Sanity schema and embedded Studio

**Files:**
- Create: `src/sanity/schemaTypes/objects/localeString.ts`
- Create: `src/sanity/schemaTypes/objects/localeText.ts`
- Create: `src/sanity/schemaTypes/documents/course.ts`
- Create: `src/sanity/schemaTypes/documents/experience.ts`
- Create: `src/sanity/schemaTypes/documents/diveSite.ts`
- Create: `src/sanity/schemaTypes/documents/tariffExtra.ts`
- Create: `src/sanity/schemaTypes/documents/centroInfo.ts`
- Create: `src/sanity/schemaTypes/index.ts`
- Create: `src/sanity/structure.ts`
- Create: `sanity.config.ts`
- Create: `src/pages/admin/[...tool].astro`
- Create: `.env` (not committed — see Global Constraints)
- Modify: `.gitignore` (add `.env` if not already present)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `schemaTypes` array (imported by `sanity.config.ts`); document type names `course`, `experience`, `diveSite`, `tariffExtra`, `centroInfo` used by every GROQ query in Task 5 onward. Object type name `localeString`/`localeText` with sub-fields `es`/`en`/`fr`/`de`, used as the field shape everywhere translatable text appears.

- [ ] **Step 1: Locale object types**

```ts
// src/sanity/schemaTypes/objects/localeString.ts
import { defineType, defineField } from 'sanity'

export const localeString = defineType({
  name: 'localeString',
  title: 'Texto (localizado)',
  type: 'object',
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'en', title: 'English', type: 'string' }),
    defineField({ name: 'fr', title: 'Français', type: 'string' }),
    defineField({ name: 'de', title: 'Deutsch', type: 'string' }),
  ],
})
```

```ts
// src/sanity/schemaTypes/objects/localeText.ts
import { defineType, defineField } from 'sanity'

export const localeText = defineType({
  name: 'localeText',
  title: 'Texto largo (localizado)',
  type: 'object',
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
    defineField({ name: 'en', title: 'English', type: 'text', rows: 4 }),
    defineField({ name: 'fr', title: 'Français', type: 'text', rows: 4 }),
    defineField({ name: 'de', title: 'Deutsch', type: 'text', rows: 4 }),
  ],
})
```

- [ ] **Step 2: `course` document type**

```ts
// src/sanity/schemaTypes/documents/course.ts
import { defineType, defineField } from 'sanity'

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
    defineField({ name: 'summary', title: 'Resumen', type: 'localeText' }),
    defineField({ name: 'prerequisites', title: 'Requisitos', type: 'localeText' }),
    defineField({ name: 'depthLimit', title: 'Profundidad máxima (m)', type: 'number' }),
    defineField({ name: 'duration', title: 'Duración', type: 'localeString' }),
    defineField({ name: 'minAge', title: 'Edad mínima', type: 'number' }),
    defineField({ name: 'price', title: 'Precio (EUR)', type: 'number' }),
    defineField({ name: 'groupDiscount', title: 'Descuento por grupo', type: 'localeString' }),
    defineField({ name: 'tags', title: 'Etiquetas', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
```

- [ ] **Step 3: `experience` document type**

```ts
// src/sanity/schemaTypes/documents/experience.ts
import { defineType, defineField } from 'sanity'

export const experience = defineType({
  name: 'experience',
  title: 'Experiencia (bautizo / inmersión)',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString' }),
    defineField({
      name: 'audience',
      title: 'Público',
      type: 'string',
      options: { list: ['beginner', 'certified'] },
    }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({ name: 'duration', title: 'Duración', type: 'localeString' }),
    defineField({ name: 'depthLimit', title: 'Profundidad máxima (m)', type: 'number' }),
    defineField({ name: 'price', title: 'Precio (EUR)', type: 'number' }),
    defineField({ name: 'groupDiscount', title: 'Descuento por grupo', type: 'localeString' }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
```

- [ ] **Step 4: `diveSite` document type**

```ts
// src/sanity/schemaTypes/documents/diveSite.ts
import { defineType, defineField } from 'sanity'

export const diveSite = defineType({
  name: 'diveSite',
  title: 'Punto de inmersión',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'localeString' }),
    defineField({ name: 'depthRange', title: 'Rango de profundidad', type: 'string' }),
    defineField({ name: 'levelTag', title: 'Nivel', type: 'localeString' }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({ name: 'images', title: 'Imágenes', type: 'array', of: [{ type: 'image' }] }),
    defineField({ name: 'youtubeUrl', title: 'Vídeo de YouTube', type: 'url' }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
```

- [ ] **Step 5: `tariffExtra` document type**

```ts
// src/sanity/schemaTypes/documents/tariffExtra.ts
import { defineType, defineField } from 'sanity'

export const tariffExtra = defineType({
  name: 'tariffExtra',
  title: 'Tarifa adicional',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString' }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({ name: 'price', title: 'Precio (EUR)', type: 'number' }),
    defineField({ name: 'unit', title: 'Unidad', type: 'localeString' }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
```

- [ ] **Step 6: `centroInfo` singleton document type**

```ts
// src/sanity/schemaTypes/documents/centroInfo.ts
import { defineType, defineField } from 'sanity'

export const centroInfo = defineType({
  name: 'centroInfo',
  title: 'Información del centro',
  type: 'document',
  fields: [
    defineField({ name: 'intro', title: 'Introducción', type: 'localeText' }),
    defineField({ name: 'history', title: 'Historia / zona de buceo', type: 'localeText' }),
    defineField({
      name: 'stats',
      title: 'Estadísticas',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'stat',
          fields: [
            defineField({ name: 'value', title: 'Valor', type: 'string' }),
            defineField({ name: 'label', title: 'Etiqueta', type: 'localeString' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'certifications',
      title: 'Certificaciones / partners',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'certification',
          fields: [
            defineField({ name: 'name', title: 'Nombre', type: 'string' }),
            defineField({ name: 'logo', title: 'Logo', type: 'image' }),
          ],
        },
      ],
    }),
  ],
})
```

- [ ] **Step 7: Schema index and singleton structure**

```ts
// src/sanity/schemaTypes/index.ts
import { localeString } from './objects/localeString'
import { localeText } from './objects/localeText'
import { course } from './documents/course'
import { experience } from './documents/experience'
import { diveSite } from './documents/diveSite'
import { tariffExtra } from './documents/tariffExtra'
import { centroInfo } from './documents/centroInfo'

export const schemaTypes = [localeString, localeText, course, experience, diveSite, tariffExtra, centroInfo]
```

```ts
// src/sanity/structure.ts
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Información del centro')
        .child(S.document().schemaType('centroInfo').documentId('centroInfo')),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'centroInfo'),
    ])
```

- [ ] **Step 8: Studio config**

```ts
// sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
  name: 'buceo-sur',
  title: 'Buceo Sur Gran Canaria',
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET ?? 'production',
  plugins: [structureTool({ structure })],
  schema: { types: schemaTypes },
})
```

- [ ] **Step 9: On-demand admin route**

```astro
---
// src/pages/admin/[...tool].astro
export const prerender = false
import StudioLayout from '@sanity/astro/StudioLayout.astro'
import Studio from '@sanity/astro/Studio.astro'
---
<StudioLayout>
  <Studio />
</StudioLayout>
```

- [ ] **Step 10: Create `.env` with real project credentials**

```
SANITY_PROJECT_ID=<your-project-id>
SANITY_DATASET=production
SANITY_API_TOKEN=<write-token-from-manage.sanity.io>
```

- [ ] **Step 11: Verify**

Run: `npm run build` — expected: succeeds (only `/admin` is on-demand, rest still static).
Run: `npm run dev`, open `http://localhost:4321/admin` — expected: Sanity Studio loads, shows "Contenido" list with Información del centro pinned at top, followed by Curso / Experiencia / Punto de inmersión / Tarifa adicional lists (all empty).

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add Sanity schema and embed Studio at /admin"
```

---

### Task 3: i18n foundation (locales, UI strings, fallback helper, base layout)

**Files:**
- Create: `src/i18n/locales.ts`
- Create: `src/i18n/strings.ts`
- Create: `src/i18n/paths.ts`
- Create: `src/sanity/localize.ts`
- Create: `src/lib/constants.ts`
- Create: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Produces: `Locale` type, `LOCALES`, `DEFAULT_LOCALE` (from `locales.ts`); `ui: Record<Locale, UiStrings>` (from `strings.ts`); `localePath(lang, path?)` and `alternateLinks(path?)` (from `paths.ts`); `t(field, lang)` (from `localize.ts`); `SITE` constants object (from `constants.ts`); `BaseLayout.astro` accepting props `{ lang: Locale; path: string; title: string; description: string }` and rendering a named default `<slot />` between Nav and Footer (Nav/Footer wired in Task 4 — until then, BaseLayout renders only the `<head>`/hreflang/slot so this task is independently verifiable).
- Consumes: nothing from earlier tasks except the Astro project itself (Task 1).

- [ ] **Step 1: Locale list and type**

```ts
// src/i18n/locales.ts
export const LOCALES = ['es', 'en', 'fr', 'de'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'es'

export const LOCALE_LABELS: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
}
```

- [ ] **Step 2: Fallback helper**

```ts
// src/sanity/localize.ts
import type { Locale } from '../i18n/locales'

export type LocaleValue = Partial<Record<Locale, string>>

export function t(field: LocaleValue | undefined | null, lang: Locale): string {
  if (!field) return ''
  return field[lang] || field.es || ''
}
```

- [ ] **Step 3: UI strings (nav labels, book CTA, footer)**

```ts
// src/i18n/strings.ts
import type { Locale } from './locales'

export interface UiStrings {
  nav: {
    home: string
    dives: string
    baptisms: string
    courses: string
    rates: string
    gallery: string
    sidemount: string
    contact: string
  }
  book: string
  footer: {
    servicesTitle: string
    companyTitle: string
    rightsReserved: string
  }
}

export const ui: Record<Locale, UiStrings> = {
  es: {
    nav: {
      home: 'Centro de buceo',
      dives: 'Inmersiones',
      baptisms: 'Bautizos',
      courses: 'Cursos',
      rates: 'Tarifas',
      gallery: 'Galería',
      sidemount: 'Sidemount',
      contact: 'Contacto',
    },
    book: 'Reservar',
    footer: {
      servicesTitle: 'Servicios',
      companyTitle: 'Empresa',
      rightsReserved: 'Todos los derechos reservados.',
    },
  },
  en: {
    nav: {
      home: 'Dive Center',
      dives: 'Dives',
      baptisms: 'Discover Diving',
      courses: 'Courses',
      rates: 'Rates',
      gallery: 'Gallery',
      sidemount: 'Sidemount',
      contact: 'Contact',
    },
    book: 'Book now',
    footer: {
      servicesTitle: 'Services',
      companyTitle: 'Company',
      rightsReserved: 'All rights reserved.',
    },
  },
  fr: {
    nav: {
      home: 'Centre de plongée',
      dives: 'Plongées',
      baptisms: 'Baptêmes',
      courses: 'Formations',
      rates: 'Tarifs',
      gallery: 'Galerie',
      sidemount: 'Sidemount',
      contact: 'Contact',
    },
    book: 'Réserver',
    footer: {
      servicesTitle: 'Services',
      companyTitle: 'Le centre',
      rightsReserved: 'Tous droits réservés.',
    },
  },
  de: {
    nav: {
      home: 'Tauchcenter',
      dives: 'Tauchgänge',
      baptisms: 'Schnuppertauchen',
      courses: 'Kurse',
      rates: 'Preise',
      gallery: 'Galerie',
      sidemount: 'Sidemount',
      contact: 'Kontakt',
    },
    book: 'Jetzt buchen',
    footer: {
      servicesTitle: 'Leistungen',
      companyTitle: 'Unternehmen',
      rightsReserved: 'Alle Rechte vorbehalten.',
    },
  },
}
```

- [ ] **Step 4: Locale-aware path helpers**

```ts
// src/i18n/paths.ts
import { getRelativeLocaleUrl } from 'astro:i18n'
import { LOCALES, LOCALE_LABELS, type Locale } from './locales'

export function localePath(lang: Locale, path = ''): string {
  return getRelativeLocaleUrl(lang, path)
}

export function alternateLinks(path = '') {
  return LOCALES.map((locale) => ({
    locale,
    label: LOCALE_LABELS[locale],
    href: localePath(locale, path),
  }))
}
```

- [ ] **Step 5: Site-wide constants (booking link, contact, socials — kept out of Sanity per spec)**

```ts
// src/lib/constants.ts
export const SITE = {
  name: 'Buceo Sur',
  bookingUrl: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1',
  email: 'buceosur.gc@gmail.com',
  phones: [
    { label: 'Anne', href: 'tel:+34651352573', display: '+34 651 35 25 73' },
    { label: 'Yann (instructor)', href: 'tel:+34655989917', display: '+34 655 98 99 17' },
  ],
  address: {
    line1: 'Calle Roger de Lauria, 80',
    line2: 'Playa de Arinaga',
    line3: 'Gran Canaria, España',
  },
  social: {
    instagram: 'https://www.instagram.com/',
    tripadvisor: 'https://www.tripadvisor.com/',
  },
}
```

- [ ] **Step 6: Base layout with hreflang tags**

```astro
---
// src/layouts/BaseLayout.astro
import type { Locale } from '../i18n/locales'
import { alternateLinks } from '../i18n/paths'

interface Props {
  lang: Locale
  path: string
  title: string
  description: string
}

const { lang, path, title, description } = Astro.props
const alternates = alternateLinks(path)
---
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    {alternates.map((a) => (
      <link rel="alternate" hreflang={a.locale} href={a.href} />
    ))}
    <link rel="alternate" hreflang="x-default" href={alternates.find((a) => a.locale === 'es')?.href} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 7: Verify**

Temporarily point `src/pages/index.astro` at `BaseLayout` to confirm it compiles:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
---
<BaseLayout lang="es" path="" title="Buceo Sur" description="Centro de buceo en Gran Canaria">
  <p>Layout OK</p>
</BaseLayout>
```

Run: `npm run build` — expected: succeeds, `dist/index.html` contains 4 `<link rel="alternate" hreflang="...">` tags (es, en, fr, de) plus `x-default`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add i18n foundation (locales, strings, fallback helper, base layout)"
```

---

### Task 4: Nav, Footer, and locale-aware navigation data

**Files:**
- Create: `src/components/Nav.tsx`
- Create: `src/components/Nav.module.css`
- Create: `src/components/Footer.astro`
- Create: `src/components/Footer.module.css`
- Modify: `src/layouts/BaseLayout.astro:1-30` (render Nav + Footer around the slot)

**Interfaces:**
- Consumes: `Locale`, `ui`, `localePath`, `alternateLinks`, `SITE` (Task 3).
- Produces: `<Nav lang items localeLinks bookHref bookLabel client:load />` (React island, no other module reaches into its internals); `<Footer lang path />` (Astro component).

- [ ] **Step 1: Nav island (presentational — hrefs precomputed by the caller)**

```tsx
// src/components/Nav.tsx
import { useState, useEffect } from 'react'
import styles from './Nav.module.css'
import type { Locale } from '../i18n/locales'

interface NavLink {
  label: string
  href: string
}

interface LocaleLink {
  locale: Locale
  label: string
  href: string
}

interface NavProps {
  lang: Locale
  items: NavLink[]
  localeLinks: LocaleLink[]
  bookHref: string
  bookLabel: string
}

export default function Nav({ lang, items, localeLinks, bookHref, bookLabel }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => {
    const close = () => setLangOpen(false)
    if (langOpen) document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [langOpen])

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navegación principal">
        <a href={items[0]?.href ?? '/'} className={styles.logo}>
          <span className={styles.logoText}>Buceo Sur</span>
          <span className={styles.logoSub}>Gran Canaria</span>
        </a>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={styles.link} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}

          <li className={styles.langItem} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.langBtn}
              onClick={() => setLangOpen((o) => !o)}
              aria-expanded={langOpen}
              aria-haspopup="listbox"
            >
              {lang.toUpperCase()}
            </button>
            {langOpen && (
              <ul className={styles.langDropdown} role="listbox">
                {localeLinks.map((l) => (
                  <li key={l.locale} role="option" aria-selected={lang === l.locale}>
                    <a href={l.href} className={styles.langOption}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <a href={bookHref} target="_blank" rel="noopener noreferrer" className={styles.cta}>
              {bookLabel}
            </a>
          </li>
        </ul>

        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
    </header>
  )
}
```

```css
/* src/components/Nav.module.css */
.header { position: sticky; top: 0; z-index: 50; background: #fff; }
.nav { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; }
.logo { display: flex; flex-direction: column; line-height: 1.1; text-decoration: none; color: inherit; }
.logoText { font-weight: 700; }
.logoSub { font-size: 0.75rem; opacity: 0.7; }
.links { display: flex; align-items: center; gap: 1.5rem; list-style: none; margin: 0; padding: 0; }
.link { text-decoration: none; color: inherit; }
.cta { background: #0a6cff; color: #fff; padding: 0.5rem 1rem; border-radius: 999px; text-decoration: none; }
.langItem { position: relative; }
.langBtn { background: none; border: 1px solid currentColor; border-radius: 999px; padding: 0.25rem 0.6rem; cursor: pointer; }
.langDropdown { position: absolute; top: 100%; right: 0; background: #fff; border: 1px solid #ddd; border-radius: 8px; list-style: none; margin: 0.25rem 0 0; padding: 0.25rem; min-width: 140px; }
.langOption { display: block; padding: 0.4rem 0.6rem; text-decoration: none; color: inherit; border-radius: 4px; }
.burger { display: none; background: none; border: none; }
@media (max-width: 720px) {
  .links { position: fixed; inset: 0 0 0 auto; width: 80vw; height: 100vh; flex-direction: column; background: #fff; transform: translateX(100%); transition: transform 0.2s; padding: 5rem 1.5rem; }
  .open { transform: translateX(0); }
  .burger { display: flex; flex-direction: column; gap: 5px; }
  .burger span { width: 22px; height: 2px; background: currentColor; }
}
```

- [ ] **Step 2: Footer**

```astro
---
// src/components/Footer.astro
import styles from './Footer.module.css'
import type { Locale } from '../i18n/locales'
import { ui } from '../i18n/strings'
import { localePath } from '../i18n/paths'
import { SITE } from '../lib/constants'

interface Props {
  lang: Locale
}

const { lang } = Astro.props
const t = ui[lang]
---
<footer class={styles.footer}>
  <div class={styles.container}>
    <div class={styles.brand}>
      <span class={styles.logo}>Buceo Sur</span>
      <span class={styles.sub}>Gran Canaria · España</span>
    </div>

    <nav class={styles.links} aria-label="Navegación del pie de página">
      <div>
        <h4>{t.footer.servicesTitle}</h4>
        <ul>
          <li><a href={localePath(lang, 'baptisms')}>{t.nav.baptisms}</a></li>
          <li><a href={localePath(lang, 'courses')}>{t.nav.courses}</a></li>
          <li><a href={localePath(lang, 'dives')}>{t.nav.dives}</a></li>
          <li><a href={localePath(lang, 'sidemount')}>{t.nav.sidemount}</a></li>
        </ul>
      </div>
      <div>
        <h4>{t.footer.companyTitle}</h4>
        <ul>
          <li><a href={localePath(lang, '')}>{t.nav.home}</a></li>
          <li><a href={localePath(lang, 'contact')}>{t.nav.contact}</a></li>
          <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
        </ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul>
          <li><a href={localePath(lang, 'legal/privacy')}>Privacidad</a></li>
          <li><a href={localePath(lang, 'legal/cancellation')}>Cancelación</a></li>
          <li><a href={localePath(lang, 'legal/terms')}>Condiciones</a></li>
        </ul>
      </div>
    </nav>
  </div>

  <div class={styles.bottom}>
    <p>© {new Date().getFullYear()} Buceo Sur Gran Canaria. {t.footer.rightsReserved}</p>
  </div>
</footer>
```

```css
/* src/components/Footer.module.css */
.footer { background: #0b1d33; color: #fff; padding: 3rem 1.5rem 1.5rem; }
.container { display: flex; flex-wrap: wrap; gap: 2rem; justify-content: space-between; max-width: 1100px; margin: 0 auto; }
.links { display: flex; gap: 3rem; flex-wrap: wrap; }
.links ul { list-style: none; margin: 0.5rem 0 0; padding: 0; }
.links a { color: #cfd8e3; text-decoration: none; }
.bottom { text-align: center; opacity: 0.6; margin-top: 2rem; font-size: 0.85rem; }
```

- [ ] **Step 3: Wire Nav + Footer into BaseLayout**

```astro
---
// src/layouts/BaseLayout.astro
import type { Locale } from '../i18n/locales'
import { alternateLinks, localePath } from '../i18n/paths'
import { ui } from '../i18n/strings'
import { SITE } from '../lib/constants'
import Nav from '../components/Nav'
import Footer from '../components/Footer.astro'

interface Props {
  lang: Locale
  path: string
  title: string
  description: string
}

const { lang, path, title, description } = Astro.props
const alternates = alternateLinks(path)
const t = ui[lang]

const navItems = [
  { label: t.nav.home, href: localePath(lang, '') },
  { label: t.nav.dives, href: localePath(lang, 'dives') },
  { label: t.nav.baptisms, href: localePath(lang, 'baptisms') },
  { label: t.nav.courses, href: localePath(lang, 'courses') },
  { label: t.nav.rates, href: localePath(lang, 'rates') },
  { label: t.nav.gallery, href: localePath(lang, 'gallery') },
  { label: t.nav.sidemount, href: localePath(lang, 'sidemount') },
  { label: t.nav.contact, href: localePath(lang, 'contact') },
]
---
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    {alternates.map((a) => (
      <link rel="alternate" hreflang={a.locale} href={a.href} />
    ))}
    <link rel="alternate" hreflang="x-default" href={alternates.find((a) => a.locale === 'es')?.href} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <Nav lang={lang} items={navItems} localeLinks={alternates} bookHref={SITE.bookingUrl} bookLabel={t.book} client:load />
    <slot />
    <Footer lang={lang} />
  </body>
</html>
```

- [ ] **Step 4: Verify**

Run: `npm run dev`, open `http://localhost:4321/`
Expected: Nav shows all 8 links pointing at `/`, `/dives`, `/baptisms`, `/courses`, `/rates`, `/gallery`, `/sidemount`, `/contact`; language switcher shows ES/EN/FR/DE and switching to EN navigates to `/en/`; Footer shows the 3 columns with working links; mobile menu (resize < 720px) toggles.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Nav and Footer, wire into BaseLayout"
```

---

### Task 5: Sanity GROQ queries module

**Files:**
- Create: `src/sanity/queries.ts`

**Interfaces:**
- Consumes: `sanity:client` (Task 2 integration), document type names `course`/`experience`/`diveSite`/`tariffExtra`/`centroInfo`.
- Produces: `getCentroInfo()`, `getCourses()`, `getCoursesByTag(tag: string)`, `getExperiences(audience: 'beginner' | 'certified')`, `getDiveSites()`, `getTariffExtras()` — all `async`, all used starting in Task 6.

- [ ] **Step 1: Write the queries module**

```ts
// src/sanity/queries.ts
import { sanityClient } from 'sanity:client'

export async function getCentroInfo() {
  return sanityClient.fetch(`*[_type == "centroInfo"][0]`)
}

export async function getCourses() {
  return sanityClient.fetch(`*[_type == "course"] | order(order asc)`)
}

export async function getCoursesByTag(tag: string) {
  return sanityClient.fetch(`*[_type == "course" && $tag in tags] | order(order asc)`, { tag })
}

export async function getExperiences(audience: 'beginner' | 'certified') {
  return sanityClient.fetch(
    `*[_type == "experience" && audience == $audience] | order(order asc)`,
    { audience },
  )
}

export async function getDiveSites() {
  // Projects `images` down to plain asset URL strings so callers never touch
  // unresolved Sanity image-asset references.
  return sanityClient.fetch(`
    *[_type == "diveSite"] | order(order asc) {
      ...,
      "images": images[].asset->url
    }
  `)
}

export async function getTariffExtras() {
  return sanityClient.fetch(`*[_type == "tariffExtra"] | order(order asc)`)
}
```

- [ ] **Step 2: Verify**

Temporarily call `getCourses()` from `src/pages/index.astro` and `console.log` the result during `npm run dev` (remove afterward).
Expected: logs `[]` (empty array — no documents seeded yet), no thrown errors, confirming the client connects with the `.env` credentials from Task 2.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Sanity GROQ query helpers"
```

---

### Task 6: Home page (Centro de buceo)

**Files:**
- Create: `src/views/HomeView.astro`
- Create: `src/pages/index.astro` (replace Task 1's placeholder)
- Create: `src/pages/en/index.astro`
- Create: `src/pages/fr/index.astro`
- Create: `src/pages/de/index.astro`
- Create: `scripts/seed-centro-info.mjs`

**Interfaces:**
- Consumes: `BaseLayout`, `t` (localize), `getCentroInfo`, `SITE`.
- Produces: nothing consumed by later tasks (leaf page).

- [ ] **Step 1: Seed script for the `centroInfo` singleton**

```js
// scripts/seed-centro-info.mjs
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const doc = {
  _id: 'centroInfo',
  _type: 'centroInfo',
  intro: {
    es: 'Buceo Sur es un centro de buceo familiar en Playa de Arinaga, al borde de la reserva marina de El Cabrón, al sureste de Gran Canaria. Fundado por un buceador francés y su equipo internacional, ofrecemos inmersiones todo el año en español, francés, inglés y alemán.',
    en: 'Buceo Sur is a family-run dive center in Playa de Arinaga, right at the edge of the El Cabrón marine reserve on the south-east coast of Gran Canaria. Founded by a French diver and an international team, we offer year-round diving in Spanish, French, English and German.',
    fr: "Buceo Sur est un centre de plongée familial à Playa de Arinaga, au bord de la réserve marine d'El Cabrón, au sud-est de Gran Canaria. Fondé par un plongeur français et son équipe internationale, nous proposons des plongées toute l'année en espagnol, français, anglais et allemand.",
    de: 'Buceo Sur ist ein familiengeführtes Tauchcenter in Playa de Arinaga, direkt am Rand des Meeresschutzgebiets El Cabrón im Südosten von Gran Canaria. Gegründet von einem französischen Taucher und seinem internationalen Team, bieten wir das ganze Jahr über Tauchgänge auf Spanisch, Französisch, Englisch und Deutsch an.',
  },
  history: {
    es: 'Cerca de diez inmersiones variadas solo dentro de la reserva de El Cabrón, consideradas entre las más espectaculares de Canarias, y salidas por toda la isla para descubrir formaciones volcánicas, cuevas, arcos y más de 20 pecios, incluidos el Arona, el Cabotero y el Cermona.',
    en: 'Around ten varied dives inside the El Cabrón reserve alone — considered among the most spectacular in the Canaries — plus trips across the island to volcanic formations, caves, arches and more than 20 wrecks, including the Arona, Cabotero and Cermona.',
    fr: "Une dizaine de plongées variées rien que dans la réserve d'El Cabrón, considérées parmi les plus spectaculaires des Canaries, ainsi que des sorties sur toute l'île vers des formations volcaniques, grottes, arches et plus de 20 épaves, dont l'Arona, le Cabotero et le Cermona.",
    de: 'Rund zehn abwechslungsreiche Tauchgänge allein im Schutzgebiet El Cabrón, die zu den spektakulärsten der Kanaren zählen, sowie Ausfahrten über die ganze Insel zu vulkanischen Formationen, Höhlen, Bögen und mehr als 20 Wracks, darunter die Arona, die Cabotero und die Cermona.',
  },
  stats: [
    { _key: 'years', value: '20+', label: { es: 'Años de experiencia', en: 'Years of experience', fr: "Ans d'expérience", de: 'Jahre Erfahrung' } },
    { _key: 'sites', value: '50+', label: { es: 'Puntos de inmersión', en: 'Dive sites', fr: 'Sites de plongée', de: 'Tauchplätze' } },
    { _key: 'temp', value: '22°C', label: { es: 'Temperatura media', en: 'Average water temp', fr: 'Température moyenne', de: 'Durchschnittstemperatur' } },
    { _key: 'months', value: '12', label: { es: 'Meses al año', en: 'Months a year', fr: 'Mois par an', de: 'Monate im Jahr' } },
  ],
  certifications: [
    { _key: 'canarias', name: 'Gobierno de Canarias' },
    { _key: 'fsgt', name: 'FSGT' },
    { _key: 'ssi', name: 'SSI' },
    { _key: 'padi', name: 'PADI' },
  ],
}

await client.createOrReplace(doc)
console.log('centroInfo seeded')
```

- [ ] **Step 2: Run the seed script**

Run: `npm run seed scripts/seed-centro-info.mjs`
Expected: prints `centroInfo seeded`, no errors.

- [ ] **Step 3: Shared home view**

```astro
---
// src/views/HomeView.astro
import BaseLayout from '../layouts/BaseLayout.astro'
import type { Locale } from '../i18n/locales'
import { t } from '../sanity/localize'
import { getCentroInfo } from '../sanity/queries'

interface Props {
  lang: Locale
}

const { lang } = Astro.props
const info = await getCentroInfo()
---
<BaseLayout lang={lang} path="" title="Buceo Sur Gran Canaria" description={t(info?.intro, lang)}>
  <main>
    <section>
      <p>{t(info?.intro, lang)}</p>
      <p>{t(info?.history, lang)}</p>
    </section>

    <section aria-label="Estadísticas">
      {(info?.stats ?? []).map((stat: any) => (
        <div>
          <strong>{stat.value}</strong>
          <span>{t(stat.label, lang)}</span>
        </div>
      ))}
    </section>

    <section aria-label="Certificaciones">
      {(info?.certifications ?? []).map((cert: any) => (
        <span>{cert.name}</span>
      ))}
    </section>
  </main>
</BaseLayout>
```

- [ ] **Step 4: Route files (one per locale)**

```astro
---
// src/pages/index.astro
import HomeView from '../views/HomeView.astro'
---
<HomeView lang="es" />
```

```astro
---
// src/pages/en/index.astro
import HomeView from '../../views/HomeView.astro'
---
<HomeView lang="en" />
```

```astro
---
// src/pages/fr/index.astro
import HomeView from '../../views/HomeView.astro'
---
<HomeView lang="fr" />
```

```astro
---
// src/pages/de/index.astro
import HomeView from '../../views/HomeView.astro'
---
<HomeView lang="de" />
```

- [ ] **Step 5: Verify**

Run: `npm run dev`, check `/`, `/en/`, `/fr/`, `/de/`.
Expected: each renders the intro/history text in its own language, stats show `20+`/`50+`/`22°C`/`12` with translated labels, certifications list the 4 names.

Run: `npm run build` — expected: succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement home page from centroInfo Sanity document"
```

---

### Task 7: Cursos de buceo page

**Files:**
- Create: `src/views/CoursesView.astro`
- Create: `src/pages/courses.astro`
- Create: `src/pages/en/courses.astro`
- Create: `src/pages/fr/courses.astro`
- Create: `src/pages/de/courses.astro`
- Create: `scripts/seed-courses.mjs`

**Interfaces:**
- Consumes: `getCourses`, `t`, `BaseLayout`.
- Produces: nothing consumed by later tasks (leaf page); course `tags` field (`sidemount`) is reused by Task 8's query.

- [ ] **Step 1: Seed script — all 15 courses, real facts from the crawled site**

```js
// scripts/seed-courses.mjs
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const loc = (es, en, fr, de) => ({ es, en, fr, de })

const courses = [
  {
    _id: 'course-scuba-diver',
    _type: 'course',
    title: loc('Scuba Diver', 'Scuba Diver', 'Scuba Diver', 'Scuba Diver'),
    agency: 'SSI',
    category: 'recreational',
    summary: loc(
      'Iniciación a la autonomía bajo supervisión, hasta 12 m.',
      'Introduction to supervised diving, down to 12 m.',
      "Introduction à la plongée encadrée, jusqu'à 12 m.",
      'Einstieg ins begleitete Tauchen bis 12 m.',
    ),
    prerequisites: loc(
      'Certificado médico; se recomienda un bautizo previo.',
      'Medical certificate; a prior introductory dive is recommended.',
      'Certificat médical ; un baptême préalable est recommandé.',
      'Ärztliches Attest; ein vorheriger Schnuppertauchgang wird empfohlen.',
    ),
    depthLimit: 12,
    duration: loc('2 días', '2 days', '2 jours', '2 Tage'),
    minAge: 12,
    price: null,
    groupDiscount: loc('10% dto. grupos de 3+', '10% off groups of 3+', "10% de réduction dès 3 personnes", '10% Rabatt ab 3 Personen'),
    tags: [],
    order: 1,
  },
  {
    _id: 'course-open-water',
    _type: 'course',
    title: loc('Open Water', 'Open Water', 'Open Water', 'Open Water'),
    agency: 'SSI',
    category: 'recreational',
    summary: loc(
      'La certificación de buceo autónomo más reconocida internacionalmente, hasta 18 m.',
      'The most widely recognized entry-level certification for autonomous diving, down to 18 m.',
      "La certification de plongée autonome la plus reconnue à l'international, jusqu'à 18 m.",
      'Die international anerkannteste Zertifizierung für selbstständiges Tauchen bis 18 m.',
    ),
    prerequisites: loc(
      'Certificado médico; se recomienda un bautizo previo.',
      'Medical certificate; a prior introductory dive is recommended.',
      'Certificat médical ; un baptême préalable est recommandé.',
      'Ärztliches Attest; ein vorheriger Schnuppertauchgang wird empfohlen.',
    ),
    depthLimit: 18,
    duration: loc('4 días', '4 days', '4 jours', '4 Tage'),
    minAge: 12,
    price: null,
    groupDiscount: loc('10% dto. grupos de 3+', '10% off groups of 3+', "10% de réduction dès 3 personnes", '10% Rabatt ab 3 Personen'),
    tags: [],
    order: 2,
  },
  {
    _id: 'course-advanced-open-water',
    _type: 'course',
    title: loc('Advanced Open Water', 'Advanced Open Water', 'Advanced Open Water', 'Advanced Open Water'),
    agency: 'SSI',
    category: 'recreational',
    summary: loc(
      'Amplía tu autonomía hasta 30 m explorando tres especialidades a tu elección.',
      'Extend your range down to 30 m while exploring three specialties of your choice.',
      "Étendez votre autonomie jusqu'à 30 m en explorant trois spécialités de votre choix.",
      'Erweitern Sie Ihre Tauchtiefe bis 30 m und wählen Sie drei Spezialgebiete.',
    ),
    prerequisites: loc(
      'Certificado médico, certificación Open Water y 10 inmersiones registradas.',
      'Medical certificate, Open Water certification and 10 logged dives.',
      'Certificat médical, certification Open Water et 10 plongées enregistrées.',
      'Ärztliches Attest, Open-Water-Zertifizierung und 10 protokollierte Tauchgänge.',
    ),
    depthLimit: 30,
    duration: loc('3 días', '3 days', '3 jours', '3 Tage'),
    minAge: 12,
    price: null,
    groupDiscount: loc('10% dto. grupos de 3+', '10% off groups of 3+', "10% de réduction dès 3 personnes", '10% Rabatt ab 3 Personen'),
    tags: [],
    order: 3,
  },
  {
    _id: 'course-deep-diving',
    _type: 'course',
    title: loc('Especialidad Deep Diving', 'Deep Diving Specialty', 'Spécialité Deep Diving', 'Deep-Diving-Spezialkurs'),
    agency: 'SSI',
    category: 'specialty',
    summary: loc(
      'Tres inmersiones hasta 40 m sin descompresión.',
      'Three dives down to 40 m, no decompression.',
      "Trois plongées jusqu'à 40 m sans décompression.",
      'Drei Tauchgänge bis 40 m ohne Dekompression.',
    ),
    prerequisites: loc(
      'Open Water y se recomiendan 15 inmersiones.',
      'Open Water certification, 15 dives recommended.',
      'Open Water, 15 plongées recommandées.',
      'Open Water, 15 Tauchgänge empfohlen.',
    ),
    depthLimit: 40,
    duration: loc('3 inmersiones', '3 dives', '3 plongées', '3 Tauchgänge'),
    minAge: 12,
    price: null,
    groupDiscount: loc('', '', '', ''),
    tags: [],
    order: 4,
  },
  {
    _id: 'course-nitrox',
    _type: 'course',
    title: loc('Especialidad Nitrox', 'Nitrox Specialty', 'Spécialité Nitrox', 'Nitrox-Spezialkurs'),
    agency: 'SSI',
    category: 'specialty',
    summary: loc(
      'Dos inmersiones con aire enriquecido (32% o 40% de oxígeno).',
      'Two dives using enriched air (32% or 40% oxygen).',
      "Deux plongées à l'air enrichi (32% ou 40% d'oxygène).",
      'Zwei Tauchgänge mit angereicherter Luft (32% oder 40% Sauerstoff).',
    ),
    prerequisites: loc('Certificación Open Water.', 'Open Water certification.', 'Certification Open Water.', 'Open-Water-Zertifizierung.'),
    depthLimit: null,
    duration: loc('2 inmersiones', '2 dives', '2 plongées', '2 Tauchgänge'),
    minAge: 12,
    price: null,
    groupDiscount: loc('', '', '', ''),
    tags: [],
    order: 5,
  },
  {
    _id: 'course-deco',
    _type: 'course',
    title: loc('Especialidad Decompression Diving', 'Decompression Diving Specialty', 'Spécialité Decompression Diving', 'Dekompressions-Spezialkurs'),
    agency: 'SSI',
    category: 'specialty',
    summary: loc(
      'Buceo hasta 40 m con descompresión limitada (hasta 15 min).',
      'Diving down to 40 m with limited decompression (up to 15 min).',
      "Plongée jusqu'à 40 m avec décompression limitée (jusqu'à 15 min).",
      'Tauchen bis 40 m mit begrenzter Dekompression (bis zu 15 Min.).',
    ),
    prerequisites: loc(
      'Certificado médico, 24 inmersiones registradas, certificaciones Deep Diving y Nitrox.',
      'Medical certificate, 24 logged dives, Deep Diving and Nitrox certifications.',
      'Certificat médical, 24 plongées enregistrées, certifications Deep Diving et Nitrox.',
      'Ärztliches Attest, 24 protokollierte Tauchgänge, Deep-Diving- und Nitrox-Zertifizierung.',
    ),
    depthLimit: 40,
    duration: loc('1 inmersión a 12 m + 3 a 40 m + e-learning', '1 dive at 12 m + 3 at 40 m + e-learning', '1 plongée à 12 m + 3 à 40 m + e-learning', '1 Tauchgang bei 12 m + 3 bei 40 m + E-Learning'),
    minAge: 16,
    price: null,
    groupDiscount: loc('', '', '', ''),
    tags: [],
    order: 6,
  },
  {
    _id: 'course-navigation',
    _type: 'course',
    title: loc('Especialidad Navegación', 'Navigation Specialty', 'Spécialité Navigation', 'Navigations-Spezialkurs'),
    agency: 'SSI',
    category: 'specialty',
    summary: loc(
      'Tres inmersiones para dominar la orientación natural y el uso de la brújula.',
      'Three dives covering natural orientation and compass navigation.',
      "Trois plongées pour maîtriser l'orientation naturelle et l'usage de la boussole.",
      'Drei Tauchgänge zur natürlichen Orientierung und Kompassnavigation.',
    ),
    prerequisites: loc('Certificación Open Water.', 'Open Water certification.', 'Certification Open Water.', 'Open-Water-Zertifizierung.'),
    depthLimit: null,
    duration: loc('3 inmersiones', '3 dives', '3 plongées', '3 Tauchgänge'),
    minAge: 12,
    price: null,
    groupDiscount: loc('', '', '', ''),
    tags: [],
    order: 7,
  },
  {
    _id: 'course-rescue',
    _type: 'course',
    title: loc('Especialidad Rescate', 'Rescue Specialty', 'Spécialité Sauvetage', 'Rettungs-Spezialkurs'),
    agency: 'SSI',
    category: 'specialty',
    summary: loc(
      'Cuatro inmersiones centradas en identificar el estrés, prevenir accidentes y responder ante emergencias. Requisito para Divemaster.',
      'Four dives focused on identifying stress, preventing accidents and emergency response. Required for Divemaster.',
      "Quatre plongées centrées sur l'identification du stress, la prévention des accidents et la réponse aux urgences. Requis pour le Divemaster.",
      'Vier Tauchgänge zur Stresserkennung, Unfallverhütung und Notfallreaktion. Voraussetzung für Divemaster.',
    ),
    prerequisites: loc('Certificación Open Water.', 'Open Water certification.', 'Certification Open Water.', 'Open-Water-Zertifizierung.'),
    depthLimit: null,
    duration: loc('4 inmersiones', '4 dives', '4 plongées', '4 Tauchgänge'),
    minAge: 12,
    price: null,
    groupDiscount: loc('', '', '', ''),
    tags: [],
    order: 8,
  },
  {
    _id: 'course-react-right',
    _type: 'course',
    title: loc('React Right — Primeros auxilios', 'React Right First Aid', 'React Right — Premiers secours', 'React Right Erste Hilfe'),
    agency: 'SSI',
    category: 'specialty',
    summary: loc(
      'Formación teórica y simulacros: evaluación primaria, RCP, oxígeno y uso básico de desfibrilador (DEA).',
      'Theory and simulation drills: primary assessment, CPR, oxygen administration and basic AED use.',
      "Théorie et exercices de simulation : évaluation primaire, RCP, oxygène et utilisation de base du défibrillateur (DEA).",
      'Theorie und Simulationsübungen: Erstbeurteilung, HLW, Sauerstoffgabe und grundlegende AED-Anwendung.',
    ),
    prerequisites: loc('Ninguno.', 'None.', 'Aucun.', 'Keine.'),
    depthLimit: null,
    duration: loc('1 día', '1 day', '1 jour', '1 Tag'),
    minAge: 12,
    price: null,
    groupDiscount: loc('', '', '', ''),
    tags: [],
    order: 9,
  },
  {
    _id: 'course-pa20',
    _type: 'course',
    title: loc('Plongeur Autonome 20m (PA20)', 'Autonomous Diver 20m (PA20)', 'Plongeur Autonome 20m (PA20)', 'Autonomer Taucher 20m (PA20)'),
    agency: 'CMAS',
    category: 'technical',
    summary: loc(
      'Buceo autónomo en pareja o grupo reducido hasta 20 m.',
      'Autonomous diving in pairs or small groups, down to 20 m.',
      'Plongée autonome en binôme ou petit groupe jusqu\'à 20 m.',
      'Selbstständiges Tauchen zu zweit oder in kleiner Gruppe bis 20 m.',
    ),
    prerequisites: loc('Certificado médico.', 'Medical certificate.', 'Certificat médical.', 'Ärztliches Attest.'),
    depthLimit: 20,
    duration: loc('3 días', '3 days', '3 jours', '3 Tage'),
    minAge: 16,
    price: null,
    groupDiscount: loc('', '', '', ''),
    tags: [],
    order: 10,
  },
  {
    _id: 'course-pe40',
    _type: 'course',
    title: loc('Plongeur Encadré 40m (PE40)', 'Guided Diver 40m (PE40)', 'Plongeur Encadré 40m (PE40)', 'Begleiteter Taucher 40m (PE40)'),
    agency: 'CMAS',
    category: 'technical',
    summary: loc(
      'Inmersiones guiadas en grupo hasta 40 m.',
      'Guided group dives down to 40 m.',
      'Plongées encadrées en groupe jusqu\'à 40 m.',
      'Begleitete Gruppentauchgänge bis 40 m.',
    ),
    prerequisites: loc(
      'Certificado médico y experiencia previa entre 0-20 m.',
      'Medical certificate and prior experience in the 0-20 m range.',
      'Certificat médical et expérience préalable entre 0 et 20 m.',
      'Ärztliches Attest und Vorerfahrung im Bereich 0-20 m.',
    ),
    depthLimit: 40,
    duration: loc('2 días', '2 days', '2 jours', '2 Tage'),
    minAge: 16,
    price: null,
    groupDiscount: loc('', '', '', ''),
    tags: [],
    order: 11,
  },
  {
    _id: 'course-niveau-2',
    _type: 'course',
    title: loc('Niveau 2 (PA20 + PE40)', 'Level 2 (PA20 + PE40)', 'Niveau 2 (PA20 + PE40)', 'Niveau 2 (PA20 + PE40)'),
    agency: 'CMAS',
    category: 'technical',
    summary: loc(
      'Combina el buceo autónomo a 20 m con la exploración guiada hasta 40 m: protocolos de seguridad, gestión de incidentes y orientación submarina.',
      'Combines autonomous diving to 20 m with guided exploration down to 40 m: safety protocols, incident management and underwater orientation.',
      'Combine la plongée autonome à 20 m et l\'exploration encadrée jusqu\'à 40 m : protocoles de sécurité, gestion des incidents et orientation sous-marine.',
      'Kombiniert selbstständiges Tauchen bis 20 m mit begleiteter Erkundung bis 40 m: Sicherheitsprotokolle, Zwischenfallmanagement und Unterwasserorientierung.',
    ),
    prerequisites: loc(
      'Certificado médico y Niveau 1.',
      'Medical certificate and Level 1.',
      'Certificat médical et Niveau 1.',
      'Ärztliches Attest und Niveau 1.',
    ),
    depthLimit: 40,
    duration: loc('5 días', '5 days', '5 jours', '5 Tage'),
    minAge: 16,
    price: null,
    groupDiscount: loc('', '', '', ''),
    tags: [],
    order: 12,
  },
  {
    _id: 'course-divemaster',
    _type: 'course',
    title: loc('Divemaster', 'Divemaster', 'Divemaster', 'Divemaster'),
    agency: 'SSI',
    category: 'professional',
    summary: loc(
      'Formación profesional de 4 a 6 semanas en primavera, entre 40 y 60 inmersiones: teoría, talleres prácticos y buceos supervisados. Al terminar tendrás competencias reales, no solo una tarjeta.',
      'A 4-6 week professional program in spring, 40-60 dives: theory, practical workshops and supervised dives. You finish with genuine skills, not just a certification card.',
      'Formation professionnelle de 4 à 6 semaines au printemps, 40 à 60 plongées : théorie, ateliers pratiques et plongées supervisées. Vous terminez avec de vraies compétences, pas seulement une carte.',
      'Ein 4-6-wöchiges Berufsprogramm im Frühling, 40-60 Tauchgänge: Theorie, praktische Workshops und begleitete Tauchgänge. Am Ende stehen echte Fähigkeiten, nicht nur eine Zertifizierungskarte.',
    ),
    prerequisites: loc(
      'Mínimo 18 años, certificado médico, seguro de buceo, Advanced Open Water o Rescue (o equivalente), 40 inmersiones registradas.',
      'Minimum age 18, medical certificate, dive insurance, Advanced Open Water or Rescue (or equivalent), 40 logged dives.',
      'Minimum 18 ans, certificat médical, assurance plongée, Advanced Open Water ou Rescue (ou équivalent), 40 plongées enregistrées.',
      'Mindestalter 18, ärztliches Attest, Tauchversicherung, Advanced Open Water oder Rescue (oder gleichwertig), 40 protokollierte Tauchgänge.',
    ),
    depthLimit: null,
    duration: loc('4-6 semanas', '4-6 weeks', '4 à 6 semaines', '4-6 Wochen'),
    minAge: 18,
    price: 800,
    groupDiscount: loc(
      'Certificación PADI +250€, SSI +150€, material obligatorio.',
      'PADI certification +€250, SSI +€150, mandatory materials.',
      'Certification PADI +250€, SSI +150€, matériel obligatoire.',
      'PADI-Zertifizierung +250€, SSI +150€, Pflichtmaterial.',
    ),
    tags: [],
    order: 13,
  },
  {
    _id: 'course-sidemount-recreational',
    _type: 'course',
    title: loc('Sidemount recreativo SSI', 'SSI Recreational Sidemount', 'Sidemount récréatif SSI', 'SSI Recreational Sidemount'),
    agency: 'SSI',
    category: 'technical',
    summary: loc(
      'Cuatro inmersiones técnicas para pasar de la configuración dorsal a botellas laterales: más comodidad, mejor hidrodinámica, mayor seguridad.',
      'Four technical dives moving from back-mounted tanks to a sidemount configuration: more comfort, better hydrodynamics, added safety.',
      'Quatre plongées techniques pour passer de la configuration dorsale au montage latéral : plus de confort, meilleure hydrodynamique, sécurité accrue.',
      'Vier technische Tauchgänge zum Wechsel von Rücken- auf Sidemount-Konfiguration: mehr Komfort, bessere Hydrodynamik, mehr Sicherheit.',
    ),
    prerequisites: loc(
      'Certificación N1/Open Water con 30 inmersiones registradas, certificado médico.',
      'N1/Open Water certification with 30 logged dives, medical certificate.',
      'Certification N1/Open Water avec 30 plongées enregistrées, certificat médical.',
      'N1/Open-Water-Zertifizierung mit 30 protokollierten Tauchgängen, ärztliches Attest.',
    ),
    depthLimit: null,
    duration: loc('4 inmersiones técnicas', '4 technical dives', '4 plongées techniques', '4 technische Tauchgänge'),
    minAge: 16,
    price: 450,
    groupDiscount: loc('', '', '', ''),
    tags: ['sidemount'],
    order: 14,
  },
  {
    _id: 'course-sidemount-combined',
    _type: 'course',
    title: loc('Sidemount — Pack combinado', 'Sidemount Combined Package', 'Sidemount — Pack combiné', 'Sidemount Kombipaket'),
    agency: 'SSI',
    category: 'technical',
    summary: loc(
      'El curso recreativo más cuatro inmersiones adicionales de configuración, equipo y certificación incluidos.',
      'The recreational course plus four additional configuration dives, with equipment and certification included.',
      'Le cours récréatif plus quatre plongées de configuration supplémentaires, équipement et certification inclus.',
      'Der Recreational-Kurs plus vier zusätzliche Konfigurationstauchgänge, Ausrüstung und Zertifizierung inklusive.',
    ),
    prerequisites: loc(
      'Certificación N1/Open Water con 30 inmersiones registradas, certificado médico.',
      'N1/Open Water certification with 30 logged dives, medical certificate.',
      'Certification N1/Open Water avec 30 plongées enregistrées, certificat médical.',
      'N1/Open-Water-Zertifizierung mit 30 protokollierten Tauchgängen, ärztliches Attest.',
    ),
    depthLimit: null,
    duration: loc('8 inmersiones técnicas', '8 technical dives', '8 plongées techniques', '8 technische Tauchgänge'),
    minAge: 16,
    price: 690,
    groupDiscount: loc('', '', '', ''),
    tags: ['sidemount'],
    order: 15,
  },
]

const tx = client.transaction()
for (const c of courses) tx.createOrReplace(c)
await tx.commit()
console.log(`${courses.length} courses seeded`)
```

- [ ] **Step 2: Run the seed script**

Run: `npm run seed scripts/seed-courses.mjs`
Expected: prints `15 courses seeded`.

- [ ] **Step 3: Courses view**

```astro
---
// src/views/CoursesView.astro
import BaseLayout from '../layouts/BaseLayout.astro'
import type { Locale } from '../i18n/locales'
import { t } from '../sanity/localize'
import { getCourses } from '../sanity/queries'

interface Props {
  lang: Locale
}

const { lang } = Astro.props
const courses = await getCourses()
---
<BaseLayout lang={lang} path="courses" title="Cursos de buceo — Buceo Sur" description="Cursos SSI y CMAS para todos los niveles en Gran Canaria.">
  <main>
    <h1>Cursos de buceo</h1>
    {courses.map((c: any) => (
      <article>
        <h2>{t(c.title, lang)} — {c.agency}</h2>
        <p>{t(c.summary, lang)}</p>
        <p>{t(c.prerequisites, lang)}</p>
        <ul>
          {c.depthLimit && <li>{c.depthLimit} m</li>}
          <li>{t(c.duration, lang)}</li>
          {c.minAge && <li>{c.minAge}+</li>}
          <li>{c.price ? `${c.price} €` : ''}</li>
        </ul>
        {t(c.groupDiscount, lang) && <p>{t(c.groupDiscount, lang)}</p>}
      </article>
    ))}
  </main>
</BaseLayout>
```

- [ ] **Step 4: Route files**

```astro
---
// src/pages/courses.astro
import CoursesView from '../views/CoursesView.astro'
---
<CoursesView lang="es" />
```

```astro
---
// src/pages/en/courses.astro
import CoursesView from '../../views/CoursesView.astro'
---
<CoursesView lang="en" />
```

```astro
---
// src/pages/fr/courses.astro
import CoursesView from '../../views/CoursesView.astro'
---
<CoursesView lang="fr" />
```

```astro
---
// src/pages/de/courses.astro
import CoursesView from '../../views/CoursesView.astro'
---
<CoursesView lang="de" />
```

- [ ] **Step 5: Verify**

Run: `npm run dev`, open `/courses`, `/en/courses`, `/fr/courses`, `/de/courses`.
Expected: 15 courses render in each language in the right order (Scuba Diver → ... → Sidemount Combined Package), Divemaster shows `800 €`, both sidemount courses show `450 €`/`690 €`, courses without a crawled price show no price line (not `null` or `NaN`).

Run: `npm run build` — expected: succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement Cursos page with 15 seeded course documents"
```

---

### Task 8: Sidemount page

**Files:**
- Create: `src/views/SidemountView.astro`
- Create: `src/pages/sidemount.astro`
- Create: `src/pages/en/sidemount.astro`
- Create: `src/pages/fr/sidemount.astro`
- Create: `src/pages/de/sidemount.astro`

**Interfaces:**
- Consumes: `getCoursesByTag('sidemount')` (Task 5/7), `t`, `BaseLayout`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Sidemount view (filters the same `course` documents by tag — no new schema or seed needed)**

```astro
---
// src/views/SidemountView.astro
import BaseLayout from '../layouts/BaseLayout.astro'
import type { Locale } from '../i18n/locales'
import { t } from '../sanity/localize'
import { getCoursesByTag } from '../sanity/queries'

interface Props {
  lang: Locale
}

const { lang } = Astro.props
const courses = await getCoursesByTag('sidemount')

const intro = {
  es: 'La configuración con las botellas laterales al cuerpo, en lugar de a la espalda: más comodidad, mejor hidrodinámica y mayor disponibilidad de aire. Gran Canaria, con sus relieves volcánicos, pecios, cuevas y arcos, es un entorno ideal para practicarlo.',
  en: 'Tanks mounted at your sides instead of on your back: more comfort, better hydrodynamics and more available air. Gran Canaria, with its volcanic reliefs, wrecks, caves and arches, is an ideal place to train.',
  fr: "Les bouteilles montées sur les côtés plutôt que dans le dos : plus de confort, une meilleure hydrodynamique et davantage d'air disponible. Gran Canaria, avec ses reliefs volcaniques, épaves, grottes et arches, est un terrain idéal pour s'entraîner.",
  de: 'Flaschen seitlich statt auf dem Rücken montiert: mehr Komfort, bessere Hydrodynamik und mehr verfügbare Luft. Gran Canaria mit seinen vulkanischen Reliefs, Wracks, Höhlen und Bögen ist ideal zum Üben.',
}
---
<BaseLayout lang={lang} path="sidemount" title="Sidemount — Buceo Sur" description={intro[lang]}>
  <main>
    <h1>Sidemount</h1>
    <p>{intro[lang]}</p>
    {courses.map((c: any) => (
      <article>
        <h2>{t(c.title, lang)}</h2>
        <p>{t(c.summary, lang)}</p>
        <p>{t(c.prerequisites, lang)}</p>
        <p>{t(c.duration, lang)} — {c.price} €</p>
      </article>
    ))}
  </main>
</BaseLayout>
```

- [ ] **Step 2: Route files**

```astro
---
// src/pages/sidemount.astro
import SidemountView from '../views/SidemountView.astro'
---
<SidemountView lang="es" />
```

```astro
---
// src/pages/en/sidemount.astro
import SidemountView from '../../views/SidemountView.astro'
---
<SidemountView lang="en" />
```

```astro
---
// src/pages/fr/sidemount.astro
import SidemountView from '../../views/SidemountView.astro'
---
<SidemountView lang="fr" />
```

```astro
---
// src/pages/de/sidemount.astro
import SidemountView from '../../views/SidemountView.astro'
---
<SidemountView lang="de" />
```

- [ ] **Step 3: Verify**

Run: `npm run dev`, open `/sidemount`, `/en/sidemount`, `/fr/sidemount`, `/de/sidemount`.
Expected: shows exactly the 2 sidemount courses (`450 €`, `690 €`) in each language, not all 15.

Run: `npm run build` — expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: implement Sidemount page filtered from tagged course documents"
```

---

### Task 9: Bautizos and Inmersiones pages

**Files:**
- Create: `src/views/BaptismsView.astro`
- Create: `src/views/DivesView.astro`
- Create: `src/pages/baptisms.astro`, `src/pages/en/baptisms.astro`, `src/pages/fr/baptisms.astro`, `src/pages/de/baptisms.astro`
- Create: `src/pages/dives.astro`, `src/pages/en/dives.astro`, `src/pages/fr/dives.astro`, `src/pages/de/dives.astro`
- Create: `scripts/seed-experiences.mjs`

**Interfaces:**
- Consumes: `getExperiences('beginner' | 'certified')`, `t`, `BaseLayout`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Seed script — 2 beginner + 7 certified experiences, real prices from the crawl**

```js
// scripts/seed-experiences.mjs
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const loc = (es, en, fr, de) => ({ es, en, fr, de })

const experiences = [
  {
    _id: 'experience-bautismo-simple',
    _type: 'experience',
    title: loc('Bautismo simple', 'Discover Scuba Diving', 'Baptême simple', 'Schnuppertauchen'),
    audience: 'beginner',
    description: loc(
      'Tu primera inmersión en el mar, sin experiencia previa: un instructor por buceador en una zona protegida y rica en vida marina.',
      'Your first dive in the sea, no experience needed: one instructor per diver in a protected, marine-life-rich zone.',
      'Votre première plongée en mer, sans expérience préalable : un instructeur par plongeur dans une zone protégée et riche en vie marine.',
      'Ihr erster Tauchgang im Meer, ohne Vorerfahrung: ein Instruktor pro Taucher in einem geschützten, artenreichen Gebiet.',
    ),
    duration: loc('1 inmersión / 2,5 h', '1 dive / 2.5h', '1 plongée / 2,5 h', '1 Tauchgang / 2,5 Std.'),
    depthLimit: 6,
    price: 80,
    groupDiscount: loc('10% dto. grupos de 3+', '10% off groups of 3+', '10% de réduction dès 3 personnes', '10% Rabatt ab 3 Personen'),
    order: 1,
  },
  {
    _id: 'experience-ssi-basic-diver',
    _type: 'experience',
    title: loc('SSI Basic Diver', 'SSI Basic Diver', 'SSI Basic Diver', 'SSI Basic Diver'),
    audience: 'beginner',
    description: loc(
      'Para quien ya probó el bautismo y busca más autonomía: teoría y técnicas básicas en una piscina natural, seguidas de una inmersión en mar abierto. Certificación SSI Basic Diver incluida.',
      'For those who have tried a baptism and want more autonomy: theory and basic skills in a natural beach pool, followed by an open water dive. SSI Basic Diver certification included.',
      'Pour ceux qui ont déjà essayé le baptême et cherchent plus d\'autonomie : théorie et techniques de base dans un bassin naturel, suivies d\'une plongée en mer. Certification SSI Basic Diver incluse.',
      'Für alle, die bereits geschnuppert haben und mehr Selbstständigkeit suchen: Theorie und Grundtechniken in einem natürlichen Pool, gefolgt von einem Freiwassertauchgang. SSI-Basic-Diver-Zertifizierung inbegriffen.',
    ),
    duration: loc('Teoría + 2 inmersiones / 4 h', 'Theory + 2 dives / 4h', 'Théorie + 2 plongées / 4 h', 'Theorie + 2 Tauchgänge / 4 Std.'),
    depthLimit: 12,
    price: 120,
    groupDiscount: loc('10% dto. grupos de 4+', '10% off groups of 4+', '10% de réduction dès 4 personnes', '10% Rabatt ab 4 Personen'),
    order: 2,
  },
  {
    _id: 'experience-inmersion-sencilla',
    _type: 'experience',
    title: loc('Inmersión sencilla desde costa', 'Single shore dive', 'Plongée simple depuis le bord', 'Einfacher Tauchgang vom Ufer'),
    audience: 'certified',
    description: loc('Una inmersión guiada desde la costa para buceadores certificados.', 'A single guided shore dive for certified divers.', 'Une plongée encadrée depuis le bord pour plongeurs certifiés.', 'Ein begleiteter Tauchgang vom Ufer für zertifizierte Taucher.'),
    duration: loc('', '', '', ''),
    depthLimit: null,
    price: 50,
    groupDiscount: loc('', '', '', ''),
    order: 3,
  },
  {
    _id: 'experience-doble-costa',
    _type: 'experience',
    title: loc('Doble inmersión desde costa (El Cabrón incluido)', 'Double shore dive (including El Cabrón)', 'Double plongée depuis le bord (El Cabrón inclus)', 'Doppelter Tauchgang vom Ufer (inkl. El Cabrón)'),
    audience: 'certified',
    description: loc(
      'Dos inmersiones guiadas desde la costa, incluyendo la reserva de El Cabrón.',
      'Two guided shore dives, including the El Cabrón reserve.',
      "Deux plongées encadrées depuis le bord, incluant la réserve d'El Cabrón.",
      'Zwei begleitete Tauchgänge vom Ufer, einschließlich des Schutzgebiets El Cabrón.',
    ),
    duration: loc('', '', '', ''),
    depthLimit: null,
    price: 75,
    groupDiscount: loc('', '', '', ''),
    order: 4,
  },
  {
    _id: 'experience-barco-mogan',
    _type: 'experience',
    title: loc('Doble inmersión en barco desde Mogán', 'Double boat dive from Mogán', 'Double plongée en bateau depuis Mogán', 'Doppelter Bootstauchgang ab Mogán'),
    audience: 'certified',
    description: loc('Dos inmersiones guiadas en barco partiendo de Mogán.', 'Two guided boat dives departing from Mogán.', 'Deux plongées encadrées en bateau au départ de Mogán.', 'Zwei begleitete Bootstauchgänge ab Mogán.'),
    duration: loc('', '', '', ''),
    depthLimit: null,
    price: 95,
    groupDiscount: loc('', '', '', ''),
    order: 5,
  },
  {
    _id: 'experience-nocturna',
    _type: 'experience',
    title: loc('Inmersión nocturna', 'Night dive', 'Plongée de nuit', 'Nachttauchgang'),
    audience: 'certified',
    description: loc('Descubre la vida marina nocturna en una inmersión guiada al atardecer.', 'Discover nocturnal marine life on a guided dive at dusk.', 'Découvrez la vie marine nocturne lors d\'une plongée encadrée au crépuscule.', 'Entdecken Sie das nächtliche Meeresleben bei einem begleiteten Tauchgang in der Dämmerung.'),
    duration: loc('', '', '', ''),
    depthLimit: null,
    price: 70,
    groupDiscount: loc('', '', '', ''),
    order: 6,
  },
  {
    _id: 'experience-pecios-profundos',
    _type: 'experience',
    title: loc('Pecios profundos (Arona, Coreano)', 'Deep wrecks (Arona, Coreano)', 'Épaves profondes (Arona, Coreano)', 'Tiefe Wracks (Arona, Coreano)'),
    audience: 'certified',
    description: loc(
      'Inmersiones espectaculares que exigen buenas condiciones de mar, a 20 minutos en barco desde Telde. Nitrox incluido.',
      'Spectacular dives that demand good sea conditions, 20 minutes by boat from Telde. Nitrox included.',
      'Plongées spectaculaires exigeant de bonnes conditions de mer, à 20 minutes en bateau depuis Telde. Nitrox inclus.',
      'Spektakuläre Tauchgänge, die gute Seebedingungen erfordern, 20 Minuten mit dem Boot von Telde. Nitrox inbegriffen.',
    ),
    duration: loc('30-40 m', '30-40 m', '30-40 m', '30-40 m'),
    depthLimit: 40,
    price: 115,
    groupDiscount: loc(
      'Requiere Advanced + 40 inmersiones (5 por debajo de 30 m); mínimo 5 buceadores.',
      'Requires Advanced + 40 dives (5 below 30 m); minimum 5 divers.',
      'Nécessite Advanced + 40 plongées (5 sous 30 m) ; minimum 5 plongeurs.',
      'Erfordert Advanced + 40 Tauchgänge (5 unter 30 m); mindestens 5 Taucher.',
    ),
    order: 7,
  },
  {
    _id: 'experience-refresh',
    _type: 'experience',
    title: loc('Puesta a punto (refresh)', 'Refresher dive', 'Remise à niveau', 'Auffrischungstauchgang'),
    audience: 'certified',
    description: loc('Recupera confianza y técnica antes de volver a bucear con normalidad.', 'Rebuild confidence and skills before diving normally again.', 'Retrouvez confiance et technique avant de replonger normalement.', 'Vertrauen und Technik auffrischen, bevor Sie wieder normal tauchen.'),
    duration: loc('Equipo y seguro incluidos', 'Equipment and insurance included', 'Équipement et assurance inclus', 'Ausrüstung und Versicherung inbegriffen'),
    depthLimit: null,
    price: 80,
    groupDiscount: loc('', '', '', ''),
    order: 8,
  },
  {
    _id: 'experience-validacion-n1',
    _type: 'experience',
    title: loc('Validación N1 en piscina', 'N1 pool-only validation', 'Validation N1 en piscine', 'N1-Validierung im Pool'),
    audience: 'certified',
    description: loc('Inmersión técnica en piscina con instrucción reforzada para validar el nivel N1.', 'A technical pool dive with enhanced instruction to validate N1 level.', 'Plongée technique en piscine avec instruction renforcée pour valider le niveau N1.', 'Technischer Pooltauchgang mit intensiver Anleitung zur N1-Validierung.'),
    duration: loc('por inmersión', 'per dive', 'par plongée', 'pro Tauchgang'),
    depthLimit: null,
    price: 70,
    groupDiscount: loc('', '', '', ''),
    order: 9,
  },
]

const tx = client.transaction()
for (const e of experiences) tx.createOrReplace(e)
await tx.commit()
console.log(`${experiences.length} experiences seeded`)
```

- [ ] **Step 2: Run the seed script**

Run: `npm run seed scripts/seed-experiences.mjs`
Expected: prints `9 experiences seeded`.

- [ ] **Step 3: Bautizos view (audience: beginner)**

```astro
---
// src/views/BaptismsView.astro
import BaseLayout from '../layouts/BaseLayout.astro'
import type { Locale } from '../i18n/locales'
import { t } from '../sanity/localize'
import { getExperiences } from '../sanity/queries'

interface Props {
  lang: Locale
}

const { lang } = Astro.props
const experiences = await getExperiences('beginner')
---
<BaseLayout lang={lang} path="baptisms" title="Bautizos de buceo — Buceo Sur" description="Tu primera inmersión sin experiencia previa en Gran Canaria.">
  <main>
    <h1>Bautizos</h1>
    {experiences.map((e: any) => (
      <article>
        <h2>{t(e.title, lang)}</h2>
        <p>{t(e.description, lang)}</p>
        <p>{t(e.duration, lang)} — {e.depthLimit} m — {e.price} €</p>
        {t(e.groupDiscount, lang) && <p>{t(e.groupDiscount, lang)}</p>}
      </article>
    ))}
  </main>
</BaseLayout>
```

- [ ] **Step 4: Inmersiones view (audience: certified)**

```astro
---
// src/views/DivesView.astro
import BaseLayout from '../layouts/BaseLayout.astro'
import type { Locale } from '../i18n/locales'
import { t } from '../sanity/localize'
import { getExperiences } from '../sanity/queries'

interface Props {
  lang: Locale
}

const { lang } = Astro.props
const experiences = await getExperiences('certified')
---
<BaseLayout lang={lang} path="dives" title="Inmersiones — Buceo Sur" description="Salidas guiadas para buceadores certificados en Gran Canaria.">
  <main>
    <h1>Inmersiones</h1>
    {experiences.map((e: any) => (
      <article>
        <h2>{t(e.title, lang)}</h2>
        <p>{t(e.description, lang)}</p>
        <p>{e.price} €</p>
        {t(e.groupDiscount, lang) && <p>{t(e.groupDiscount, lang)}</p>}
      </article>
    ))}
  </main>
</BaseLayout>
```

- [ ] **Step 5: Route files**

```astro
---
// src/pages/baptisms.astro
import BaptismsView from '../views/BaptismsView.astro'
---
<BaptismsView lang="es" />
```

Repeat identically for `src/pages/en/baptisms.astro` (`import ... '../../views/BaptismsView.astro'`, `lang="en"`), `src/pages/fr/baptisms.astro` (`lang="fr"`), `src/pages/de/baptisms.astro` (`lang="de"`).

```astro
---
// src/pages/dives.astro
import DivesView from '../views/DivesView.astro'
---
<DivesView lang="es" />
```

Repeat identically for `src/pages/en/dives.astro` (`lang="en"`), `src/pages/fr/dives.astro` (`lang="fr"`), `src/pages/de/dives.astro` (`lang="de"`).

- [ ] **Step 6: Verify**

Run: `npm run dev`, open `/baptisms` and `/dives` in all 4 locales.
Expected: Bautizos shows exactly 2 entries (`80 €`, `120 €`); Inmersiones shows exactly 7 entries (`50`, `75`, `95`, `70`, `115`, `80`, `70` €), correctly translated per locale.

Run: `npm run build` — expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: implement Bautizos and Inmersiones pages from seeded experience documents"
```

---

### Task 10: Galería page

**Files:**
- Create: `src/components/Lightbox.tsx`
- Create: `src/components/Lightbox.module.css`
- Create: `src/views/GalleryView.astro`
- Create: `src/pages/gallery.astro`, `src/pages/en/gallery.astro`, `src/pages/fr/gallery.astro`, `src/pages/de/gallery.astro`
- Create: `scripts/seed-dive-sites.mjs`

**Interfaces:**
- Consumes: `getDiveSites`, `t`, `BaseLayout`.
- Produces: nothing consumed by later tasks. `images` array left empty in seed data (real photos need uploading through Sanity Studio — no binaries were crawlable) — `Lightbox` renders nothing when a site has zero images, this is expected until the user uploads photos.

- [ ] **Step 1: Seed script — 9 dive sites from the crawled gallery structure**

```js
// scripts/seed-dive-sites.mjs
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const loc = (es, en, fr, de) => ({ es, en, fr, de })

const sites = [
  {
    _id: 'site-el-cabron',
    _type: 'diveSite',
    name: loc('Reserva marina El Cabrón', 'El Cabrón marine reserve', 'Réserve marine El Cabrón', 'Meeresschutzgebiet El Cabrón'),
    depthRange: '5-30 m',
    levelTag: loc('Todos los niveles', 'All levels', 'Tous niveaux', 'Alle Levels'),
    description: loc(
      'Un concentrado de vida increíble: enormes bancos de barracudas y una biodiversidad excepcional en la reserva más emblemática de la zona.',
      'A concentrate of incredible life: enormous schools of barracudas and exceptional biodiversity in the area\'s most iconic reserve.',
      'Un concentré de vie incroyable : d\'énormes bancs de barracudas et une biodiversité exceptionnelle dans la réserve la plus emblématique du secteur.',
      'Ein Konzentrat unglaublichen Lebens: riesige Barrakuda-Schwärme und außergewöhnliche Artenvielfalt im bekanntesten Schutzgebiet der Region.',
    ),
    images: [],
    youtubeUrl: 'https://www.youtube-nocookie.com/embed/3ZaJwr3My3Y',
    order: 1,
  },
  {
    _id: 'site-risco-verde',
    _type: 'diveSite',
    name: loc('Risco Verde', 'Risco Verde', 'Risco Verde', 'Risco Verde'),
    depthRange: '10-20 m',
    levelTag: loc('Todos los niveles', 'All levels', 'Tous niveaux', 'Alle Levels'),
    description: loc(
      'Formaciones volcánicas y fondos rocosos poco profundos, ideales para observar la fauna local con calma.',
      'Volcanic formations and shallow rocky bottoms, ideal for calmly observing local marine life.',
      'Formations volcaniques et fonds rocheux peu profonds, idéaux pour observer calmement la faune locale.',
      'Vulkanische Formationen und flache Felsböden, ideal um die lokale Tierwelt in Ruhe zu beobachten.',
    ),
    images: [],
    youtubeUrl: '',
    order: 2,
  },
  {
    _id: 'site-tufia',
    _type: 'diveSite',
    name: loc('Tufia', 'Tufia', 'Tufia', 'Tufia'),
    depthRange: '5-18 m',
    levelTag: loc('Todos los niveles', 'All levels', 'Tous niveaux', 'Alle Levels'),
    description: loc(
      'Fondos variados junto a un pueblo de pescadores tradicional, buena visibilidad y vida marina abundante.',
      'Varied bottoms next to a traditional fishing village, good visibility and abundant marine life.',
      'Fonds variés à côté d\'un village de pêcheurs traditionnel, bonne visibilité et vie marine abondante.',
      'Abwechslungsreiche Böden neben einem traditionellen Fischerdorf, gute Sicht und reiches Meeresleben.',
    ),
    images: [],
    youtubeUrl: '',
    order: 3,
  },
  {
    _id: 'site-pasito-blanco',
    _type: 'diveSite',
    name: loc('Pasito Blanco', 'Pasito Blanco', 'Pasito Blanco', 'Pasito Blanco'),
    depthRange: '10-25 m',
    levelTag: loc('Todos los niveles', 'All levels', 'Tous niveaux', 'Alle Levels'),
    description: loc(
      'Punto habitual para avistar rayas y ángeles marinos entre arenales y roquedos.',
      'A regular spot for sighting rays and angel sharks among sandy patches and rocky reef.',
      'Point habituel pour observer raies et anges de mer entre étendues de sable et zones rocheuses.',
      'Ein beliebter Ort, um Rochen und Engelhaie zwischen Sandflächen und Felsriffen zu beobachten.',
    ),
    images: [],
    youtubeUrl: '',
    order: 4,
  },
  {
    _id: 'site-cermona',
    _type: 'diveSite',
    name: loc('Pecio "Cermona"', '"Cermona" wreck', 'Épave "Cermona"', 'Wrack "Cermona"'),
    depthRange: '20-35 m',
    levelTag: loc('Avanzado', 'Advanced', 'Avancé', 'Fortgeschritten'),
    description: loc(
      'Uno de los cerca de 200 pecios de la isla, hoy colonizado por esponjas y peces de roca.',
      'One of the island\'s roughly 200 wrecks, now colonized by sponges and reef fish.',
      'L\'une des quelque 200 épaves de l\'île, aujourd\'hui colonisée par des éponges et des poissons de roche.',
      'Eines von rund 200 Wracks der Insel, heute besiedelt von Schwämmen und Riff-Fischen.',
    ),
    images: [],
    youtubeUrl: '',
    order: 5,
  },
  {
    _id: 'site-arona',
    _type: 'diveSite',
    name: loc('Pecio "Arona"', '"Arona" wreck', 'Épave "Arona"', 'Wrack "Arona"'),
    depthRange: '30-40 m',
    levelTag: loc('Avanzado', 'Advanced', 'Avancé', 'Fortgeschritten'),
    description: loc(
      'Inmersión espectacular en pecio profundo, exige buenas condiciones de mar y buceadores experimentados.',
      'A spectacular deep wreck dive that demands good sea conditions and experienced divers.',
      'Plongée spectaculaire sur épave profonde, exigeant de bonnes conditions de mer et des plongeurs expérimentés.',
      'Ein spektakulärer Tieftauchgang am Wrack, der gute Seebedingungen und erfahrene Taucher erfordert.',
    ),
    images: [],
    youtubeUrl: '',
    order: 6,
  },
  {
    _id: 'site-sardina-del-norte',
    _type: 'diveSite',
    name: loc('Sardina del Norte', 'Sardina del Norte', 'Sardina del Norte', 'Sardina del Norte'),
    depthRange: '8-20 m',
    levelTag: loc('Todos los niveles', 'All levels', 'Tous niveaux', 'Alle Levels'),
    description: loc(
      'Costa norte de la isla con fondos volcánicos y una fuerte presencia de fauna atlántica.',
      'North coast of the island with volcanic bottoms and a strong presence of Atlantic marine life.',
      'Côte nord de l\'île avec des fonds volcaniques et une forte présence de faune atlantique.',
      'Die Nordküste der Insel mit vulkanischen Böden und einer starken Präsenz atlantischer Meeresfauna.',
    ),
    images: [],
    youtubeUrl: '',
    order: 7,
  },
  {
    _id: 'site-comotu',
    _type: 'diveSite',
    name: loc('Pecio "Comotu"', '"Comotu" wreck', 'Épave "Comotu"', 'Wrack "Comotu"'),
    depthRange: '20-30 m',
    levelTag: loc('Avanzado', 'Advanced', 'Avancé', 'Fortgeschritten'),
    description: loc(
      'Otro de los pecios históricos de la isla, con estructura penetrable para buceadores con formación específica.',
      'Another of the island\'s historic wrecks, with a penetrable structure for divers with specific training.',
      'Une autre épave historique de l\'île, à structure pénétrable pour les plongeurs ayant une formation spécifique.',
      'Ein weiteres historisches Wrack der Insel mit begehbarer Struktur für speziell ausgebildete Taucher.',
    ),
    images: [],
    youtubeUrl: '',
    order: 8,
  },
  {
    _id: 'site-caleta-de-abajo',
    _type: 'diveSite',
    name: loc('Caleta de Abajo', 'Caleta de Abajo', 'Caleta de Abajo', 'Caleta de Abajo'),
    depthRange: '5-15 m',
    levelTag: loc('Iniciación', 'Beginner-friendly', 'Débutant', 'Anfängerfreundlich'),
    description: loc(
      'Cala tranquila y poco profunda, perfecta para bautizos y primeras inmersiones certificadas.',
      'A calm, shallow cove, perfect for baptisms and first certified dives.',
      'Crique calme et peu profonde, parfaite pour les baptêmes et premières plongées certifiées.',
      'Eine ruhige, flache Bucht, perfekt für Schnuppertauchgänge und erste zertifizierte Tauchgänge.',
    ),
    images: [],
    youtubeUrl: '',
    order: 9,
  },
]

const tx = client.transaction()
for (const s of sites) tx.createOrReplace(s)
await tx.commit()
console.log(`${sites.length} dive sites seeded`)
```

- [ ] **Step 2: Run the seed script**

Run: `npm run seed scripts/seed-dive-sites.mjs`
Expected: prints `9 dive sites seeded`.

- [ ] **Step 3: Lightbox island (opens a larger view of a clicked image; no-op if a site has no images)**

```tsx
// src/components/Lightbox.tsx
import { useState } from 'react'
import styles from './Lightbox.module.css'

interface LightboxProps {
  images: { url: string; alt: string }[]
}

export default function Lightbox({ images }: LightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  return (
    <div className={styles.grid}>
      {images.map((img, i) => (
        <button key={img.url} className={styles.thumbBtn} onClick={() => setOpenIndex(i)}>
          <img src={img.url} alt={img.alt} className={styles.thumb} />
        </button>
      ))}

      {openIndex !== null && (
        <div className={styles.overlay} onClick={() => setOpenIndex(null)}>
          <img src={images[openIndex].url} alt={images[openIndex].alt} className={styles.full} />
        </div>
      )}
    </div>
  )
}
```

```css
/* src/components/Lightbox.module.css */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.5rem; }
.thumbBtn { border: none; padding: 0; background: none; cursor: pointer; }
.thumb { width: 100%; height: 100px; object-fit: cover; border-radius: 6px; }
.overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); display: flex; align-items: center; justify-content: center; z-index: 100; }
.full { max-width: 90vw; max-height: 90vh; object-fit: contain; }
```

- [ ] **Step 4: Gallery view**

```astro
---
// src/views/GalleryView.astro
import BaseLayout from '../layouts/BaseLayout.astro'
import type { Locale } from '../i18n/locales'
import { t } from '../sanity/localize'
import { getDiveSites } from '../sanity/queries'
import Lightbox from '../components/Lightbox'

interface Props {
  lang: Locale
}

const { lang } = Astro.props
const sites = await getDiveSites()
---
<BaseLayout lang={lang} path="gallery" title="Galería — Buceo Sur" description="Fotos y vídeos de los puntos de inmersión en Gran Canaria.">
  <main>
    <h1>Galería</h1>
    {sites.map((site: any) => (
      <section>
        <h2>{t(site.name, lang)} — {site.depthRange} — {t(site.levelTag, lang)}</h2>
        <p>{t(site.description, lang)}</p>
        {site.youtubeUrl && (
          <iframe src={site.youtubeUrl} title={t(site.name, lang)} allowfullscreen loading="lazy" />
        )}
        <Lightbox images={(site.images ?? []).map((url: string) => ({ url, alt: t(site.name, lang) }))} client:visible />
      </section>
    ))}
  </main>
</BaseLayout>
```

- [ ] **Step 5: Route files**

```astro
---
// src/pages/gallery.astro
import GalleryView from '../views/GalleryView.astro'
---
<GalleryView lang="es" />
```

Repeat identically for `src/pages/en/gallery.astro` (`lang="en"`), `src/pages/fr/gallery.astro` (`lang="fr"`), `src/pages/de/gallery.astro` (`lang="de"`).

- [ ] **Step 6: Verify**

Run: `npm run dev`, open `/gallery` in all 4 locales.
Expected: 9 dive sites render in order (El Cabrón → Caleta de Abajo) with translated names/descriptions; El Cabrón shows the embedded YouTube video; no broken image grid appears for sites with zero images (Lightbox returns `null`).

Run: `npm run build` — expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: implement Galeria page with 9 seeded dive sites and lightbox"
```

---

### Task 11: Tarifas page

**Files:**
- Create: `src/views/RatesView.astro`
- Create: `src/pages/rates.astro`, `src/pages/en/rates.astro`, `src/pages/fr/rates.astro`, `src/pages/de/rates.astro`
- Create: `scripts/seed-tariff-extras.mjs`

**Interfaces:**
- Consumes: `getCourses`, `getExperiences`, `getTariffExtras`, `t`, `BaseLayout`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Seed script — standalone priced items (insurance, rental, packages)**

```js
// scripts/seed-tariff-extras.mjs
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const loc = (es, en, fr, de) => ({ es, en, fr, de })

const extras = [
  {
    _id: 'tariff-pack-10',
    _type: 'tariffExtra',
    title: loc('Pack 10', 'Pack 10', 'Pack 10', 'Pack 10'),
    description: loc('Cinco inmersiones dobles por la isla, con acceso en barco.', 'Five double dives around the island, with boat access.', 'Cinq plongées doubles autour de l\'île, avec accès en bateau.', 'Fünf Doppeltauchgänge rund um die Insel, mit Bootszugang.'),
    price: 390,
    unit: loc('paquete', 'package', 'forfait', 'Paket'),
    order: 1,
  },
  {
    _id: 'tariff-estancia-7-noches',
    _type: 'tariffExtra',
    title: loc('Estancia 7 noches + Pack 10', '7-night stay + Pack 10', 'Séjour 7 nuits + Pack 10', '7 Nächte + Pack 10'),
    description: loc('Alojamiento amueblado en Playa de Arinaga más el Pack 10 de inmersiones.', 'Furnished accommodation in Playa de Arinaga plus the Pack 10 dive package.', 'Hébergement meublé à Playa de Arinaga plus le forfait Pack 10.', 'Möblierte Unterkunft in Playa de Arinaga plus das Pack-10-Tauchpaket.'),
    price: 590,
    unit: loc('por persona, tarifa pareja', 'per person, couple rate', 'par personne, tarif couple', 'pro Person, Paartarif'),
    order: 2,
  },
  {
    _id: 'tariff-seguro-diario',
    _type: 'tariffExtra',
    title: loc('Seguro de buceo diario', 'Daily dive insurance', 'Assurance plongée journalière', 'Tages-Tauchversicherung'),
    description: loc('', '', '', ''),
    price: 7,
    unit: loc('por día', 'per day', 'par jour', 'pro Tag'),
    order: 3,
  },
  {
    _id: 'tariff-seguro-semanal',
    _type: 'tariffExtra',
    title: loc('Seguro de buceo semanal', 'Weekly dive insurance', 'Assurance plongée hebdomadaire', 'Wöchentliche Tauchversicherung'),
    description: loc('', '', '', ''),
    price: 15,
    unit: loc('por semana', 'per week', 'par semaine', 'pro Woche'),
    order: 4,
  },
  {
    _id: 'tariff-seguro-anual',
    _type: 'tariffExtra',
    title: loc('Seguro de buceo anual', 'Annual dive insurance', 'Assurance plongée annuelle', 'Jährliche Tauchversicherung'),
    description: loc('', '', '', ''),
    price: 40,
    unit: loc('al año', 'per year', 'par an', 'pro Jahr'),
    order: 5,
  },
  {
    _id: 'tariff-alquiler-simple',
    _type: 'tariffExtra',
    title: loc('Alquiler de equipo (1 botella)', 'Equipment rental (single tank)', 'Location de matériel (1 bouteille)', 'Ausrüstungsverleih (1 Flasche)'),
    description: loc('', '', '', ''),
    price: 10,
    unit: loc('por inmersión', 'per dive', 'par plongée', 'pro Tauchgang'),
    order: 6,
  },
  {
    _id: 'tariff-alquiler-doble',
    _type: 'tariffExtra',
    title: loc('Alquiler de equipo (2 botellas)', 'Equipment rental (double tank)', 'Location de matériel (2 bouteilles)', 'Ausrüstungsverleih (2 Flaschen)'),
    description: loc('', '', '', ''),
    price: 20,
    unit: loc('por inmersión', 'per dive', 'par plongée', 'pro Tauchgang'),
    order: 7,
  },
  {
    _id: 'tariff-alquiler-ordenador',
    _type: 'tariffExtra',
    title: loc('Alquiler de ordenador o foco', 'Computer or torch rental', 'Location d\'ordinateur ou phare', 'Computer- oder Lampenverleih'),
    description: loc('', '', '', ''),
    price: 5,
    unit: loc('por día', 'per day', 'par jour', 'pro Tag'),
    order: 8,
  },
]

const tx = client.transaction()
for (const e of extras) tx.createOrReplace(e)
await tx.commit()
console.log(`${extras.length} tariff extras seeded`)
```

- [ ] **Step 2: Run the seed script**

Run: `npm run seed scripts/seed-tariff-extras.mjs`
Expected: prints `8 tariff extras seeded`.

- [ ] **Step 3: Rates view — aggregates all three price sources into one page**

```astro
---
// src/views/RatesView.astro
import BaseLayout from '../layouts/BaseLayout.astro'
import type { Locale } from '../i18n/locales'
import { t } from '../sanity/localize'
import { getCourses, getExperiences, getTariffExtras } from '../sanity/queries'

interface Props {
  lang: Locale
}

const { lang } = Astro.props
const [courses, beginnerExperiences, certifiedExperiences, extras] = await Promise.all([
  getCourses(),
  getExperiences('beginner'),
  getExperiences('certified'),
  getTariffExtras(),
])
---
<BaseLayout lang={lang} path="rates" title="Tarifas — Buceo Sur" description="Todos los precios de bautizos, cursos, inmersiones y extras en un solo lugar.">
  <main>
    <h1>Tarifas</h1>

    <section>
      <h2>Bautizos</h2>
      {beginnerExperiences.map((e: any) => (
        <p>{t(e.title, lang)} — {e.price} €{t(e.groupDiscount, lang) ? ` (${t(e.groupDiscount, lang)})` : ''}</p>
      ))}
    </section>

    <section>
      <h2>Cursos</h2>
      {courses.filter((c: any) => c.price != null).map((c: any) => (
        <p>{t(c.title, lang)} — {c.price} €{t(c.groupDiscount, lang) ? ` (${t(c.groupDiscount, lang)})` : ''}</p>
      ))}
    </section>

    <section>
      <h2>Inmersiones</h2>
      {certifiedExperiences.map((e: any) => (
        <p>{t(e.title, lang)} — {e.price} €{t(e.groupDiscount, lang) ? ` (${t(e.groupDiscount, lang)})` : ''}</p>
      ))}
    </section>

    <section>
      <h2>Extras</h2>
      {extras.map((x: any) => (
        <p>{t(x.title, lang)} — {x.price} € ({t(x.unit, lang)})</p>
      ))}
    </section>
  </main>
</BaseLayout>
```

- [ ] **Step 4: Route files**

```astro
---
// src/pages/rates.astro
import RatesView from '../views/RatesView.astro'
---
<RatesView lang="es" />
```

Repeat identically for `src/pages/en/rates.astro` (`lang="en"`), `src/pages/fr/rates.astro` (`lang="fr"`), `src/pages/de/rates.astro` (`lang="de"`).

- [ ] **Step 5: Verify**

Run: `npm run dev`, open `/rates` in all 4 locales.
Expected: 4 sections (Bautizos, Cursos, Inmersiones, Extras) render; Cursos section shows only Divemaster (`800 €`) and the 2 sidemount courses (`450 €`, `690 €`) since those are the only courses with a non-null price; Extras shows all 8 items with their unit label.

Run: `npm run build` — expected: succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement Tarifas page aggregating course/experience/tariffExtra prices"
```

---

### Task 12: Contacto page

**Files:**
- Create: `src/components/ContactForm.tsx`
- Create: `src/components/ContactForm.module.css`
- Create: `src/views/ContactView.astro`
- Create: `src/pages/contact.astro`, `src/pages/en/contact.astro`, `src/pages/fr/contact.astro`, `src/pages/de/contact.astro`

**Interfaces:**
- Consumes: `SITE` (Task 3), `BaseLayout`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Contact form island (client-side only — same behavior as the current site: no backend, just a submitted-state confirmation; matches the existing `Contact.jsx` this replaces)**

```tsx
// src/components/ContactForm.tsx
import { useState } from 'react'
import styles from './ContactForm.module.css'

export default function ContactForm() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className={styles.success} role="alert">
        <p>¡Mensaje enviado! Te responderemos lo antes posible por email o WhatsApp.</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="name">Nombre *</label>
        <input id="name" name="name" type="text" value={fields.name} onChange={handleChange} required autoComplete="name" />
      </div>
      <div className={styles.field}>
        <label htmlFor="email">Email *</label>
        <input id="email" name="email" type="email" value={fields.email} onChange={handleChange} required autoComplete="email" />
      </div>
      <div className={styles.field}>
        <label htmlFor="message">Mensaje *</label>
        <textarea id="message" name="message" rows={5} value={fields.message} onChange={handleChange} required />
      </div>
      <button type="submit" className={styles.submit}>Enviar mensaje</button>
    </form>
  )
}
```

```css
/* src/components/ContactForm.module.css */
.form { display: flex; flex-direction: column; gap: 1rem; max-width: 480px; }
.field { display: flex; flex-direction: column; gap: 0.25rem; }
.field input, .field textarea { padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; font: inherit; }
.submit { background: #0a6cff; color: #fff; border: none; padding: 0.75rem 1.5rem; border-radius: 999px; cursor: pointer; }
.success { padding: 1.5rem; border: 1px solid #2ecc71; border-radius: 8px; }
```

- [ ] **Step 2: Contact view**

```astro
---
// src/views/ContactView.astro
import BaseLayout from '../layouts/BaseLayout.astro'
import type { Locale } from '../i18n/locales'
import { SITE } from '../lib/constants'
import ContactForm from '../components/ContactForm'

interface Props {
  lang: Locale
}

const { lang } = Astro.props
---
<BaseLayout lang={lang} path="contact" title="Contacto — Buceo Sur" description="Contacta con Buceo Sur Gran Canaria por email, teléfono o WhatsApp.">
  <main>
    <h1>Contacto</h1>
    <ul>
      <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
      {SITE.phones.map((p) => (
        <li><a href={p.href}>{p.display} — {p.label}</a></li>
      ))}
      <li>
        <address>
          {SITE.address.line1}<br />
          {SITE.address.line2}<br />
          {SITE.address.line3}
        </address>
      </li>
    </ul>
    <p>
      <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
      {' · '}
      <a href={SITE.social.tripadvisor} target="_blank" rel="noopener noreferrer">TripAdvisor</a>
    </p>
    <ContactForm client:load />
  </main>
</BaseLayout>
```

- [ ] **Step 3: Route files**

```astro
---
// src/pages/contact.astro
import ContactView from '../views/ContactView.astro'
---
<ContactView lang="es" />
```

Repeat identically for `src/pages/en/contact.astro` (`lang="en"`), `src/pages/fr/contact.astro` (`lang="fr"`), `src/pages/de/contact.astro` (`lang="de"`).

- [ ] **Step 4: Verify**

Run: `npm run dev`, open `/contact` in all 4 locales, fill in the form and submit.
Expected: contact details render correctly, form shows the success message after submit, Instagram/TripAdvisor links open in a new tab.

Run: `npm run build` — expected: succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement Contacto page with contact form island"
```

---

### Task 13: Legal pages (static content collection)

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/legal/privacy.es.md`, `privacy.en.md`, `privacy.fr.md`, `privacy.de.md`
- Create: `src/content/legal/cancellation.es.md`, `cancellation.en.md`, `cancellation.fr.md`, `cancellation.de.md`
- Create: `src/content/legal/terms.es.md`, `terms.en.md`, `terms.fr.md`, `terms.de.md`
- Create: `src/views/LegalView.astro`
- Create: `src/pages/legal/privacy.astro`, `src/pages/legal/cancellation.astro`, `src/pages/legal/terms.astro`
- Create: `src/pages/en/legal/privacy.astro`, `en/legal/cancellation.astro`, `en/legal/terms.astro`
- Create: `src/pages/fr/legal/privacy.astro`, `fr/legal/cancellation.astro`, `fr/legal/terms.astro`
- Create: `src/pages/de/legal/privacy.astro`, `de/legal/cancellation.astro`, `de/legal/terms.astro`

**Interfaces:**
- Consumes: `BaseLayout`.
- Produces: nothing consumed by later tasks. Placeholder body text is intentional per the design spec — replace with the user's real legal text once supplied, by editing these 12 Markdown files directly (no schema change needed).

- [ ] **Step 1: Content collection config**

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const legal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
  }),
})

export const collections = { legal }
```

- [ ] **Step 2: Placeholder Markdown files (one example shown per document; repeat the same body/title pattern for the other two slugs, translating the title only — body stays the placeholder sentence until the user sends real text)**

```md
---
title: Política de privacidad y protección de datos
---

Este texto será sustituido por el contenido legal definitivo proporcionado por Buceo Sur Gran Canaria.
```
Save as `src/content/legal/privacy.es.md`.

```md
---
title: Privacy Policy and Data Protection
---

This text will be replaced with the final legal content provided by Buceo Sur Gran Canaria.
```
Save as `src/content/legal/privacy.en.md`.

```md
---
title: Politique de confidentialité et protection des données
---

Ce texte sera remplacé par le contenu légal définitif fourni par Buceo Sur Gran Canaria.
```
Save as `src/content/legal/privacy.fr.md`.

```md
---
title: Datenschutzrichtlinie
---

Dieser Text wird durch den endgültigen rechtlichen Inhalt von Buceo Sur Gran Canaria ersetzt.
```
Save as `src/content/legal/privacy.de.md`.

Repeat with the same 4-language body sentence for:
- `cancellation.{es,en,fr,de}.md`, titles: "Política de cancelación" / "Cancellation Policy" / "Politique d'annulation" / "Stornierungsbedingungen".
- `terms.{es,en,fr,de}.md`, titles: "Condiciones de las actividades" / "Activity Terms and Conditions" / "Conditions des activités" / "Aktivitätsbedingungen".

- [ ] **Step 3: Legal view (takes a slug and reads the matching entry)**

```astro
---
// src/views/LegalView.astro
import BaseLayout from '../layouts/BaseLayout.astro'
import { getEntry, render } from 'astro:content'
import type { Locale } from '../i18n/locales'

interface Props {
  lang: Locale
  slug: 'privacy' | 'cancellation' | 'terms'
}

const { lang, slug } = Astro.props
const entry = await getEntry('legal', `${slug}.${lang}`)
const { Content } = entry ? await render(entry) : { Content: null }
---
<BaseLayout lang={lang} path={`legal/${slug}`} title={entry?.data.title ?? slug} description={entry?.data.title ?? slug}>
  <main>
    <h1>{entry?.data.title}</h1>
    {Content && <Content />}
  </main>
</BaseLayout>
```

- [ ] **Step 4: Route files (3 slugs × 4 locales = 12 files, identical pattern)**

```astro
---
// src/pages/legal/privacy.astro
import LegalView from '../../views/LegalView.astro'
---
<LegalView lang="es" slug="privacy" />
```

Repeat this exact pattern for the remaining 11 combinations — only the import's relative path (`../../` at root, `../../../` under a locale folder), the `lang` prop, and the `slug` prop change:

| File | Import path | `lang` | `slug` |
|---|---|---|---|
| `src/pages/legal/cancellation.astro` | `../../views/LegalView.astro` | `es` | `cancellation` |
| `src/pages/legal/terms.astro` | `../../views/LegalView.astro` | `es` | `terms` |
| `src/pages/en/legal/privacy.astro` | `../../../views/LegalView.astro` | `en` | `privacy` |
| `src/pages/en/legal/cancellation.astro` | `../../../views/LegalView.astro` | `en` | `cancellation` |
| `src/pages/en/legal/terms.astro` | `../../../views/LegalView.astro` | `en` | `terms` |
| `src/pages/fr/legal/privacy.astro` | `../../../views/LegalView.astro` | `fr` | `privacy` |
| `src/pages/fr/legal/cancellation.astro` | `../../../views/LegalView.astro` | `fr` | `cancellation` |
| `src/pages/fr/legal/terms.astro` | `../../../views/LegalView.astro` | `fr` | `terms` |
| `src/pages/de/legal/privacy.astro` | `../../../views/LegalView.astro` | `de` | `privacy` |
| `src/pages/de/legal/cancellation.astro` | `../../../views/LegalView.astro` | `de` | `cancellation` |
| `src/pages/de/legal/terms.astro` | `../../../views/LegalView.astro` | `de` | `terms` |

- [ ] **Step 5: Verify**

Run: `npm run dev`, open `/legal/privacy`, `/legal/cancellation`, `/legal/terms` and their `/en/`, `/fr/`, `/de/` variants.
Expected: each renders its translated title and the placeholder sentence in the correct language.

Run: `npm run build` — expected: succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement legal pages as a static Markdown content collection"
```

---

### Task 14: Final integration pass

**Files:**
- Modify: `README.md`
- No new source files — this task is verification + cleanup only.

**Interfaces:**
- Consumes: everything from Tasks 1-13.
- Produces: nothing (final task).

- [ ] **Step 1: Full build across every route**

Run: `npm run build`
Expected: succeeds, `dist/` contains all of: `index.html`, `dives/`, `baptisms/`, `courses/`, `rates/`, `gallery/`, `sidemount/`, `contact/`, `legal/privacy/`, `legal/cancellation/`, `legal/terms/`, plus the same set under `en/`, `fr/`, `de/`, plus the on-demand `admin` function.

- [ ] **Step 2: Manual browser pass**

Run: `npm run dev`. For each of the 4 locales, click through Nav to all 8 pages plus the 3 legal pages (32 page loads total) confirming:
- No console errors.
- Language switcher always lands on the equivalent page in the new locale (e.g. from `/courses` switching to FR lands on `/fr/courses`, not `/fr/`).
- Footer legal links resolve correctly per locale.
- `/admin` loads the Sanity Studio and shows all 5 document types populated (Información del centro: 1, Curso: 15, Experiencia: 9, Punto de inmersión: 9, Tarifa adicional: 8).

- [ ] **Step 3: Update README**

Replace the default Vite README content with:

```md
# Buceo Sur Gran Canaria

Astro site with an embedded Sanity Studio (`/admin`), four languages (es/en/fr/de).

## Development

1. Copy `.env.example` to `.env` and fill in `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN` (Editor permission, from manage.sanity.io).
2. `npm install`
3. `npm run dev` — site at `http://localhost:4321`, Studio at `http://localhost:4321/admin`.

## Seeding content

One-time scripts in `scripts/` populate the Sanity dataset with the initial migrated content:

```bash
npm run seed scripts/seed-centro-info.mjs
npm run seed scripts/seed-courses.mjs
npm run seed scripts/seed-experiences.mjs
npm run seed scripts/seed-dive-sites.mjs
npm run seed scripts/seed-tariff-extras.mjs
```

## Still needed before launch

- Real photos/videos for the Galería dive sites (uploaded via Sanity Studio — the old site's images weren't retrievable by crawling).
- Real legal text for `/legal/privacy`, `/legal/cancellation`, `/legal/terms` (edit the Markdown files directly in `src/content/legal/`).
- Exact pricing for the courses currently seeded with `price: null` in Sanity Studio.

## Deployment

Deployed on Vercel via `@astrojs/vercel`. Set the same three `SANITY_*` environment variables in the Vercel project settings.
```

- [ ] **Step 4: Create `.env.example`**

```
SANITY_PROJECT_ID=
SANITY_DATASET=production
SANITY_API_TOKEN=
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: update README with setup, seeding, and launch checklist"
```
