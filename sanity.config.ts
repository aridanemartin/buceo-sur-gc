import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { createProtectedDeleteAction } from './src/sanity/actions/protectDeleteWhenReferenced'
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
  document: {
    actions: (prev, context) =>
      context.schemaType === 'certifyingAgency'
        ? prev.map((action) =>
            action.action === 'delete' ? createProtectedDeleteAction(action) : action,
          )
        : prev,
  },
})
