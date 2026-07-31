// src/content.config.ts
// Astro content collections. The `legal` collection loads the localized legal
// markdown files from src/content/legal/ (one file per document per locale:
// privacy/cancellation/terms × es/en/fr/de). Entry ids follow the
// `<slug>.<lang>` convention, e.g. `privacy.es`.
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const legal = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/legal',
    // Preserve the `<slug>.<lang>` id (e.g. `privacy.es`); the default slugger
    // would strip the dot, producing `privacyes`.
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
  }),
})

export const collections = { legal }
