import { ALL_FIELDS_GROUP, defineField, defineType } from 'sanity'
import { BareField } from '../../components/BareField'

export const localeString = defineType({
  name: 'localeString',
  title: 'Texto (localizado)',
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
      type: 'string',
      group: 'es',
      components: { field: BareField },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'en', title: ' ', type: 'string', group: 'en', components: { field: BareField } }),
    defineField({ name: 'fr', title: ' ', type: 'string', group: 'fr', components: { field: BareField } }),
    defineField({ name: 'de', title: ' ', type: 'string', group: 'de', components: { field: BareField } }),
  ],
})
