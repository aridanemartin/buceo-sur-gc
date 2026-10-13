import { defineType } from 'sanity'
import { sectionsField } from '../objects/textMediaSection'
import { str } from './fields'

export const divesPage = defineType({
  name: 'divesPage',
  title: 'Página: Inmersiones',
  type: 'document',
  groups: [
    { name: 'header', title: 'Cabecera' },
    { name: 'sections', title: 'Secciones', default: true },
    { name: 'cta', title: 'Banner' },
  ],
  fields: [
    str('introTitle', 'Título', { group: 'header' }),
    str('introSubtitle', 'Subtítulo', { group: 'header' }),
    str('infoTab', 'Pestaña de información', { group: 'header' }),
    str('ratesTab', 'Pestaña de inmersiones', { group: 'header' }),
    sectionsField(),
    str('ctaTitle', 'Título del banner de reserva', { group: 'cta' }),
  ],
  preview: { prepare: () => ({ title: 'Inmersiones' }) },
})
