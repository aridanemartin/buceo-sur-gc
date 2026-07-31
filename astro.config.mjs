// astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import sanity from '@sanity/astro'

const integrations = [react()]

// Sanity integration is conditional: only enabled when SANITY_PROJECT_ID is set to a real value.
// This allows the project to build without Sanity credentials. Once the user creates the Sanity
// project and sets SANITY_PROJECT_ID in .env, the embedded Studio at /admin and build-time
// content fetching activate automatically.
if (process.env.SANITY_PROJECT_ID && process.env.SANITY_PROJECT_ID !== 'placeholder-project-id') {
  integrations.unshift(
    sanity({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET ?? 'production',
      useCdn: false,
      studioBasePath: '/admin',
    })
  )
}

export default defineConfig({
  adapter: vercel(),
  i18n: {
    locales: ['es', 'en', 'fr', 'de'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations,
})
