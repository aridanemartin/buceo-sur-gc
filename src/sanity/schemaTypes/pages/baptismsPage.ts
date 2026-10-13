import { defineType } from 'sanity'
import { str, txt } from './fields'

export const baptismsPage = defineType({
  name: 'baptismsPage',
  title: 'Página: Bautizos',
  type: 'document',
  fields: [
    str('introTitle', 'Título'),
    txt('intro', 'Introducción'),
    str('ctaTitle', 'Título del banner de reserva'),
  ],
  preview: { prepare: () => ({ title: 'Bautizos' }) },
})
