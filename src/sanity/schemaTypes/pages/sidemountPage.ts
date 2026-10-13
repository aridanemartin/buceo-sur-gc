import { defineType } from 'sanity'
import { section, str, txt } from './fields'

export const sidemountPage = defineType({
  name: 'sidemountPage',
  title: 'Página: Sidemount',
  type: 'document',
  fieldsets: [
    section('header', 'Cabecera'),
    section('intro', 'Introducción'),
    section('terrain', 'Gran Canaria, terreno de juego'),
    section('course', 'Curso'),
  ],
  fields: [
    str('eyebrow', 'Antetítulo', { fieldset: 'header' }),
    str('introTitle', 'Título', { fieldset: 'header' }),
    str('motto', 'Lema', { fieldset: 'header' }),
    txt('intro', 'Texto', { fieldset: 'intro' }),
    str('terrainTitle', 'Título', { fieldset: 'terrain' }),
    txt('terrain', 'Texto', { fieldset: 'terrain' }),
    str('courseTitle', 'Título', { fieldset: 'course' }),
    str('courseRequirementsTitle', 'Requisitos — etiqueta', { fieldset: 'course' }),
    txt('courseRequirements', 'Requisitos — texto', { fieldset: 'course' }),
    str('courseIncludesTitle', 'Incluido — etiqueta', { fieldset: 'course' }),
    txt('courseIncludes', 'Incluido — texto', { fieldset: 'course' }),
    str('ctaTitle', 'Título del banner de reserva'),
  ],
  preview: { prepare: () => ({ title: 'Sidemount' }) },
})
