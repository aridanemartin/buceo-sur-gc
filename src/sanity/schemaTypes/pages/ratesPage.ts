import { defineType } from 'sanity'
import { str, txt } from './fields'

export const ratesPage = defineType({
  name: 'ratesPage',
  title: 'Página: Tarifas',
  type: 'document',
  fields: [
    txt('subtitle', 'Subtítulo', { description: 'El título de la página es «Tarifas» del menú (Textos globales).' }),
    str('extrasTitle', 'Título de la sección «Extras»'),
    str('ctaTitle', 'Título del banner de reserva'),
  ],
  preview: { prepare: () => ({ title: 'Tarifas' }) },
})
