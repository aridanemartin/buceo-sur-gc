import { defineType, defineField } from 'sanity'

export const tariffExtra = defineType({
  name: 'tariffExtra',
  title: 'Tarifa adicional',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString' }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({ name: 'price', title: 'Precio (EUR)', type: 'number' }),
    defineField({ name: 'unit', title: 'Unidad', type: 'localeString' }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
})
