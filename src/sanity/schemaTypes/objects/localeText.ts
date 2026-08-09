import { defineField, defineType } from 'sanity'

export const localeText = defineType({
  name: 'localeText',
  title: 'Texto largo (localizado)',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: 'es',
      title: '🇪🇸 Español',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'en', title: '🇬🇧 English', type: 'text', rows: 4 }),
    defineField({ name: 'fr', title: '🇫🇷 Français', type: 'text', rows: 4 }),
    defineField({ name: 'de', title: '🇩🇪 Deutsch', type: 'text', rows: 4 }),
  ],
})
