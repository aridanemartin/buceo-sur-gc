import { defineType, defineField } from 'sanity'

export const diveSite = defineType({
  name: 'diveSite',
  title: 'Punto de inmersión',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'localeString' }),
    defineField({ name: 'depthRange', title: 'Rango de profundidad', type: 'string' }),
    defineField({ name: 'levelTag', title: 'Nivel', type: 'localeString' }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({ name: 'images', title: 'Imágenes', type: 'array', of: [{ type: 'image' }] }),
    defineField({ name: 'youtubeUrl', title: 'Vídeo de YouTube', type: 'url' }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
