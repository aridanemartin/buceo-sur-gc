import { defineField, defineType } from 'sanity'

export const certifyingAgency = defineType({
  name: 'certifyingAgency',
  title: 'Entidad certificadora',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { accept: 'image/webp' },
    }),
    defineField({ name: 'website', title: 'Sitio web', type: 'url' }),
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
})
