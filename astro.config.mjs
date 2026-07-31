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
const sanityConfigured =
  process.env.SANITY_PROJECT_ID && process.env.SANITY_PROJECT_ID !== 'placeholder-project-id'

if (sanityConfigured) {
  integrations.unshift(
    sanity({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET ?? 'production',
      useCdn: false,
      studioBasePath: '/admin',
    })
  )
} else {
  // Offline fallback: without the Sanity integration the virtual `sanity:client` module does not
  // exist, which would break the static import in src/sanity/queries.ts. Provide a client that
  // always throws so every query helper (getCourses, getExperiences, getTariffExtras, ...) falls
  // back to the canonical docx-sourced data in src/content/data.
  integrations.unshift({
    name: 'sanity-client-offline',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'sanity-client-offline',
                resolveId(id) {
                  if (id === 'sanity:client') return '\0sanity-client-offline'
                },
                load(id) {
                  if (id === '\0sanity-client-offline') {
                    return `const throwIfCalled = () => {
                      throw new Error('Sanity is not configured in this environment; using canonical content data.')
                    }
export const sanityClient = new Proxy({}, { get: () => throwIfCalled })`
                  }
                },
              },
            ],
          },
        })
      },
    },
  })
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
