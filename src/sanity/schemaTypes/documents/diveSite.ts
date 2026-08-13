import { defineField, defineType } from 'sanity'
import { ImagesFieldWarning } from '../../components/ImagesFieldWarning'

export const diveSite = defineType({
  name: 'diveSite',
  title: 'Galería (Puntos de inmersión)',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'localeString' }),
    defineField({ name: 'depthRange', title: 'Rango de profundidad', type: 'string' }),
    defineField({ name: 'levelTag', title: 'Nivel', type: 'localeString' }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({
      name: 'images',
      title: 'Imágenes',
      type: 'array',
      of: [{ type: 'image', options: { accept: 'image/webp' } }],
      components: { input: ImagesFieldWarning },
    }),
    defineField({ name: 'youtubeUrl', title: 'Vídeo de YouTube', type: 'url' }),
    defineField({
      name: 'youtubeFirst',
      title: 'Mostrar vídeo al principio',
      description: 'Actívalo para mostrar el vídeo antes de las imágenes; desactívalo para mostrarlo al final.',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => !parent?.youtubeUrl,
    }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name.es', level: 'levelTag.es', depth: 'depthRange', media: 'images.0' },
    prepare({ title, level, depth, media }) {
      return { title: title || 'Sin título', subtitle: [level, depth].filter(Boolean).join(' · '), media }
    },
  },
})
