import { defineField, defineType } from 'sanity'

export const sidemountCourse = defineType({
  name: 'sidemountCourse',
  title: 'Cursos Sidemount',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString' }),
    defineField({
      name: 'agency',
      title: 'Entidad certificadora',
      type: 'reference',
      to: [{ type: 'certifyingAgency' }],
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: { list: ['recreational', 'specialty', 'technical', 'professional'] },
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { accept: 'image/webp' },
    }),
    defineField({ name: 'summary', title: 'Resumen', type: 'localeText' }),
    defineField({ name: 'prerequisites', title: 'Requisitos', type: 'localeText' }),
    defineField({ name: 'depthLimit', title: 'Profundidad máxima (m)', type: 'number' }),
    defineField({ name: 'duration', title: 'Duración', type: 'localeString' }),
    defineField({ name: 'minAge', title: 'Edad mínima', type: 'number' }),
    defineField({ name: 'price', title: 'Precio (EUR)', type: 'number' }),
    defineField({ name: 'includes', title: 'Incluye', type: 'localeText' }),
    defineField({ name: 'supplements', title: 'Suplementos / opciones', type: 'localeText' }),
    defineField({ name: 'groupDiscount', title: 'Descuento por grupo', type: 'localeStringOptional' }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title.es', agencyName: 'agency.name', category: 'category', media: 'image' },
    prepare({ title, agencyName, category, media }) {
      return {
        title: title || 'Sin título',
        subtitle: [agencyName, category].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
