import { defineType, defineField } from 'sanity'

export const course = defineType({
  name: 'course',
  title: 'Curso',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString' }),
    defineField({
      name: 'agency',
      title: 'Entidad certificadora',
      type: 'string',
      options: { list: ['SSI', 'CMAS', 'PADI', 'FSGT'] },
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: { list: ['recreational', 'specialty', 'technical', 'professional'] },
    }),
    defineField({ name: 'summary', title: 'Resumen', type: 'localeText' }),
    defineField({ name: 'prerequisites', title: 'Requisitos', type: 'localeText' }),
    defineField({ name: 'depthLimit', title: 'Profundidad máxima (m)', type: 'number' }),
    defineField({ name: 'duration', title: 'Duración', type: 'localeString' }),
    defineField({ name: 'minAge', title: 'Edad mínima', type: 'number' }),
    defineField({ name: 'price', title: 'Precio (EUR)', type: 'number' }),
    defineField({ name: 'includes', title: 'Incluye', type: 'localeText' }),
    defineField({ name: 'supplements', title: 'Suplementos / opciones', type: 'localeText' }),
    defineField({ name: 'groupDiscount', title: 'Descuento por grupo', type: 'localeString' }),
    defineField({ name: 'tags', title: 'Etiquetas', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
