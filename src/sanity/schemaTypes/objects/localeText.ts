import { defineField, defineType } from 'sanity'

export const localeText = defineType({
  name: 'localeText',
  title: 'Texto largo (localizado)',
  type: 'object',
  groups: [
    { name: 'es', title: '🇪🇸 Español', default: true },
    { name: 'en', title: '🇬🇧 English' },
    { name: 'fr', title: '🇫🇷 Français' },
    { name: 'de', title: '🇩🇪 Deutsch' },
  ],
  fields: [
    defineField({
      name: 'es',
      title: '🇪🇸 Español',
      type: 'text',
      rows: 4,
      group: 'es',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'en', title: '🇬🇧 English', type: 'text', rows: 4, group: 'en' }),
    defineField({ name: 'fr', title: '🇫🇷 Français', type: 'text', rows: 4, group: 'fr' }),
    defineField({ name: 'de', title: '🇩🇪 Deutsch', type: 'text', rows: 4, group: 'de' }),
  ],
})
