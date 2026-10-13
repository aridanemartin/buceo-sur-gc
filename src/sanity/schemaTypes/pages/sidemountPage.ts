import { defineType } from 'sanity'
import { sectionsField } from '../objects/textMediaSection'
import { str, txt } from './fields'

export const sidemountPage = defineType({
  name: 'sidemountPage',
  title: 'Página: Sidemount',
  type: 'document',
  groups: [
    { name: 'header', title: 'Cabecera' },
    { name: 'sections', title: 'Secciones', default: true },
    { name: 'course', title: 'Curso' },
    { name: 'cta', title: 'Banner' },
  ],
  fields: [
    str('eyebrow', 'Antetítulo', { group: 'header' }),
    str('introTitle', 'Título', { group: 'header' }),
    str('motto', 'Lema', { group: 'header' }),
    sectionsField(),
    str('courseTitle', 'Título', { group: 'course' }),
    str('courseRequirementsTitle', 'Requisitos — etiqueta', { group: 'course' }),
    txt('courseRequirements', 'Requisitos — texto', { group: 'course' }),
    str('courseIncludesTitle', 'Incluido — etiqueta', { group: 'course' }),
    txt('courseIncludes', 'Incluido — texto', { group: 'course' }),
    str('ctaTitle', 'Título del banner de reserva', { group: 'cta' }),
  ],
  preview: { prepare: () => ({ title: 'Sidemount' }) },
})
