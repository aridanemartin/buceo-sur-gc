import { defineField, defineType } from 'sanity'

export const localeStringOptional = defineType({
  name: 'localeStringOptional',
  title: 'Texto (localizado, opcional)',
  type: 'object',
  groups: [
    { name: 'es', title: '🇪🇸 Español', default: true },
    { name: 'en', title: '🇬🇧 English' },
    { name: 'fr', title: '🇫🇷 Français' },
    { name: 'de', title: '🇩🇪 Deutsch' },
  ],
  fields: [
    defineField({ name: 'es', title: '🇪🇸 Español', type: 'string', group: 'es' }),
    defineField({ name: 'en', title: '🇬🇧 English', type: 'string', group: 'en' }),
    defineField({ name: 'fr', title: '🇫🇷 Français', type: 'string', group: 'fr' }),
    defineField({ name: 'de', title: '🇩🇪 Deutsch', type: 'string', group: 'de' }),
  ],
})
