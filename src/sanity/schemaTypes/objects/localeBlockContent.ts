import { defineType, defineField, defineArrayMember } from 'sanity'

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
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({ name: 'es', title: '🇪🇸 Español', type: 'array', of: [block], validation: (Rule) => Rule.required() }),
    defineField({ name: 'en', title: '🇬🇧 English', type: 'array', of: [block] }),
    defineField({ name: 'fr', title: '🇫🇷 Français', type: 'array', of: [block] }),
    defineField({ name: 'de', title: '🇩🇪 Deutsch', type: 'array', of: [block] }),
  ],
})
