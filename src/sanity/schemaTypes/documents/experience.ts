import { defineField, defineType } from 'sanity'

export const experience = defineType({
  name: 'experience',
  title: 'Experiencia (Bautizo / Inmersión)',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString' }),
    defineField({
      name: 'audience',
      title: 'Público',
      type: 'string',
      options: { list: ['beginner', 'certified'] },
    }),
    defineField({
      name: 'isPackage',
      title: '¿Es un bono / pack?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({ name: 'duration', title: 'Duración', type: 'localeString' }),
    defineField({ name: 'depthLimit', title: 'Profundidad máxima (m)', type: 'number' }),
    defineField({ name: 'price', title: 'Precio (EUR)', type: 'number' }),
    defineField({ name: 'includes', title: 'Incluye', type: 'localeList' }),
    defineField({ name: 'supplements', title: 'Suplementos / opciones', type: 'localeSupplementList' }),
    defineField({
      name: 'requirements',
      title: 'Requisitos',
      type: 'localeList',
      description: 'Lista de requisitos (bautizos). Se muestra como la misma tarjeta "Requisitos" que en los cursos.',
    }),
    defineField({ name: 'groupDiscount', title: 'Descuento por grupo', type: 'localeStringOptional' }),
    defineField({
      name: 'reservationLink',
      title: 'Enlace de reserva (Bukyapp)',
      type: 'url',
      description:
        'Enlace directo al producto en Bukyapp. Si se deja vacío, el botón "Reservar" envía al formulario de contacto con el mensaje precargado.',
    }),
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
    select: { title: 'title.es', audience: 'audience', duration: 'duration.es', media: 'image' },
    prepare({ title, audience, duration, media }) {
      return {
        title: title || 'Sin título',
        subtitle: [audience, duration].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
