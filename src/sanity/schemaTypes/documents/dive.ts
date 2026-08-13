import { defineField, defineType } from 'sanity'

export const dive = defineType({
  name: 'dive',
  title: 'Inmersiones',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString' }),
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
      description: 'Lista de requisitos. Se muestra como la misma tarjeta "Requisitos" que en los cursos.',
    }),
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
    select: { title: 'title.es', duration: 'duration.es', media: 'image' },
    prepare({ title, duration, media }) {
      return {
        title: title || 'Sin título',
        subtitle: duration || undefined,
        media,
      }
    },
  },
})
