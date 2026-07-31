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
