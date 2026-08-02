import { defineField, defineType } from 'sanity'

export const experience = defineType({
  name: 'experience',
  title: 'Experiencia (bautizo / inmersión)',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString' }),
    defineField({
      name: 'audience',
      title: 'Público',
      type: 'string',
      options: { list: ['beginner', 'certified'] },
    }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({ name: 'duration', title: 'Duración', type: 'localeString' }),
    defineField({ name: 'depthLimit', title: 'Profundidad máxima (m)', type: 'number' }),
    defineField({ name: 'price', title: 'Precio (EUR)', type: 'number' }),
    defineField({ name: 'includes', title: 'Incluye', type: 'localeText' }),
    defineField({ name: 'supplements', title: 'Suplementos / opciones', type: 'localeText' }),
    defineField({ name: 'groupDiscount', title: 'Descuento por grupo', type: 'localeString' }),
    defineField({ name: 'videoUrl', title: 'Vídeo de YouTube', type: 'url' }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { accept: 'image/webp' },
      description: 'Se usa solo si no hay vídeo de YouTube. El vídeo tiene prioridad.',
    }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title.es', audience: 'audience', duration: 'duration.es' },
    prepare({ title, audience, duration }) {
      return { title: title || 'Sin título', subtitle: [audience, duration].filter(Boolean).join(' · ') }
    },
  },
})
