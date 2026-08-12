import { ALL_FIELDS_GROUP, defineField, defineType } from 'sanity'
import { BareField } from '../../components/BareField'

// Same es/en/fr/de tab pattern as localeList, but each locale holds an array
// of { label, price } supplementItem objects instead of plain strings.
export const localeSupplementList = defineType({
  name: 'localeSupplementList',
  title: 'Lista de suplementos (localizada)',
  type: 'object',
  groups: [
    { name: 'es', title: '🇪🇸 Español', default: true },
    { name: 'en', title: '🇬🇧 English' },
    { name: 'fr', title: '🇫🇷 Français' },
    { name: 'de', title: '🇩🇪 Deutsch' },
    { ...ALL_FIELDS_GROUP, hidden: true },
  ],
  fields: [
    defineField({
      name: 'es',
      title: ' ',
      type: 'array',
      of: [{ type: 'supplementItem' }],
      group: 'es',
      components: { field: BareField },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: ' ',
      type: 'array',
      of: [{ type: 'supplementItem' }],
      group: 'en',
      components: { field: BareField },
    }),
    defineField({
      name: 'fr',
      title: ' ',
      type: 'array',
      of: [{ type: 'supplementItem' }],
      group: 'fr',
      components: { field: BareField },
    }),
    defineField({
      name: 'de',
      title: ' ',
      type: 'array',
      of: [{ type: 'supplementItem' }],
      group: 'de',
      components: { field: BareField },
    }),
  ],
})
