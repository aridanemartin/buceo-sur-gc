import { defineType } from 'sanity'
import { group, paragraphs, section, str } from './fields'

export const coursesPage = defineType({
  name: 'coursesPage',
  title: 'Página: Cursos',
  type: 'document',
  fieldsets: [
    section('header', 'Cabecera'),
    section('beginners', 'Sección «Principiantes»'),
    section('advanced', 'Sección «Avanzados y especialidades»'),
  ],
  fields: [
    str('title', 'Título', { fieldset: 'header' }),
    str('subtitle', 'Subtítulo', {
      fieldset: 'header',
      description: 'Escribe {agencies} donde debe ir la lista de agencias (p. ej. «SSI y CMAS»).',
    }),
    str('subtitleNoAgencies', 'Subtítulo sin agencias', {
      fieldset: 'header',
      description: 'Solo se muestra si no hay ningún curso publicado.',
    }),
    str('beginnersTitle', 'Título', { fieldset: 'beginners' }),
    paragraphs('introParagraphs', 'Párrafos', { fieldset: 'beginners' }),
    str('advancedTitle', 'Título', { fieldset: 'advanced' }),
    paragraphs('specialtyParagraphs', 'Párrafos', {
      fieldset: 'advanced',
      description: 'El primer párrafo se muestra destacado.',
    }),
    group('categoryLabels', 'Distintivos de categoría', [
      str('recreational', 'Recreativo'),
      str('specialty', 'Especialidad'),
      str('technical', 'Técnico'),
    ]),
    str('ctaTitle', 'Título del banner de reserva'),
  ],
  preview: { prepare: () => ({ title: 'Cursos' }) },
})
