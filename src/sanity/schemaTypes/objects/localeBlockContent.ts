import { ALL_FIELDS_GROUP, defineType, defineField, defineArrayMember } from 'sanity'
import { BareField } from '../../components/BareField'

const block = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'Título 2', value: 'h2' },
    { title: 'Título 3', value: 'h3' },
  ],
  lists: [{ title: 'Lista', value: 'bullet' }],
  marks: {
    decorators: [{ title: 'Negrita', value: 'strong' }],
    annotations: [],
  },
  of: [],
})

export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Contenido enriquecido (localizado)',
  type: 'object',
  groups: [
    { name: 'es', title: '🇪🇸 Español', default: true },
    { name: 'en', title: '🇬🇧 English' },
    { name: 'fr', title: '🇫🇷 Français' },
    { name: 'de', title: '🇩🇪 Deutsch' },
    { ...ALL_FIELDS_GROUP, hidden: true },
  ],
  fields: [
    defineField({ name: 'es', title: ' ', type: 'array', of: [block], group: 'es', components: { field: BareField }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'en', title: ' ', type: 'array', of: [block], group: 'en', components: { field: BareField } }),
    defineField({ name: 'fr', title: ' ', type: 'array', of: [block], group: 'fr', components: { field: BareField } }),
    defineField({ name: 'de', title: ' ', type: 'array', of: [block], group: 'de', components: { field: BareField } }),
  ],
})
