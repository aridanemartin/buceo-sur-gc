import { ALL_FIELDS_GROUP, defineField, defineType } from 'sanity'
import { BareField } from '../../components/BareField'

export const localeText = defineType({
  name: 'localeText',
  title: 'Texto largo (localizado)',
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
      type: 'text',
      rows: 4,
      group: 'es',
      components: { field: BareField },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'en', title: ' ', type: 'text', rows: 4, group: 'en', components: { field: BareField } }),
    defineField({ name: 'fr', title: ' ', type: 'text', rows: 4, group: 'fr', components: { field: BareField } }),
    defineField({ name: 'de', title: ' ', type: 'text', rows: 4, group: 'de', components: { field: BareField } }),
  ],
})
