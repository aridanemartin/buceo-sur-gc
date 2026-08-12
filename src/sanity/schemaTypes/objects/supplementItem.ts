import { defineField, defineType } from 'sanity'

// A single "Suplementos / opciones" row: a concept and its price, kept as two
// separate fields (instead of one free-text string) so the front end can
// style them differently. Either may be left empty — the front end skips
// rendering the row entirely when that happens, rather than showing a blank.
export const supplementItem = defineType({
  name: 'supplementItem',
  title: 'Suplemento',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Concepto', type: 'string' }),
    defineField({ name: 'price', title: 'Precio', type: 'string' }),
  ],
  preview: {
    select: { label: 'label', price: 'price' },
    prepare({ label, price }) {
      return { title: [label, price].filter(Boolean).join(' — ') || 'Sin definir' }
    },
  },
})
