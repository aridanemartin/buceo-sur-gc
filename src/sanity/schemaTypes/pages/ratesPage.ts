import { defineType } from 'sanity'
import { optTxt, section, str, txt } from './fields'

const descriptionHelp = 'Se muestra bajo el título de la categoría. Cada línea es un párrafo. Déjalo vacío para no mostrar nada.'

export const ratesPage = defineType({
  name: 'ratesPage',
  title: 'Página: Tarifas',
  type: 'document',
  fieldsets: [section('categories', 'Descripciones por categoría')],
  fields: [
    txt('subtitle', 'Subtítulo', { description: 'El título de la página es «Tarifas» del menú (Textos globales).' }),
    optTxt('baptismsDescription', 'Bautizos', { fieldset: 'categories', description: descriptionHelp }),
    optTxt('divesDescription', 'Inmersiones', { fieldset: 'categories', description: descriptionHelp }),
    optTxt('coursesDescription', 'Cursos', { fieldset: 'categories', description: descriptionHelp }),
    str('extrasTitle', 'Título de la sección «Extras»', { fieldset: 'categories' }),
    optTxt('extrasDescription', 'Extras', { fieldset: 'categories', description: descriptionHelp }),
    str('ctaTitle', 'Título del banner de reserva'),
  ],
  preview: { prepare: () => ({ title: 'Tarifas' }) },
})
