import { defineType } from 'sanity'
import { str, txt } from './fields'

export const galleryPage = defineType({
  name: 'galleryPage',
  title: 'Página: Galería',
  type: 'document',
  fields: [str('introTitle', 'Título'), txt('intro', 'Introducción')],
  preview: { prepare: () => ({ title: 'Galería' }) },
})
