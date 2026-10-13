import { ALL_FIELDS_GROUP, defineField, defineType } from 'sanity'
import { BareField } from '../../components/BareField'

const localeTextType = (name: string, title: string, required: boolean) =>
  defineType({
    name,
    title,
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
        validation: required ? (Rule) => Rule.required() : undefined,
      }),
      defineField({ name: 'en', title: ' ', type: 'text', rows: 4, group: 'en', components: { field: BareField } }),
      defineField({ name: 'fr', title: ' ', type: 'text', rows: 4, group: 'fr', components: { field: BareField } }),
      defineField({ name: 'de', title: ' ', type: 'text', rows: 4, group: 'de', components: { field: BareField } }),
    ],
  })

export const localeText = localeTextType('localeText', 'Texto largo (localizado)', true)

// Same, but may stay empty (e.g. optional descriptions that are hidden when blank).
export const localeTextOptional = localeTextType(
  'localeTextOptional',
  'Texto largo opcional (localizado)',
  false,
)
