import { defineType } from 'sanity'
import { section, str, txt } from './fields'

export const divesPage = defineType({
  name: 'divesPage',
  title: 'Página: Inmersiones',
  type: 'document',
  fieldsets: [
    section('header', 'Cabecera'),
    section('tabs', 'Pestañas'),
    section('info', 'Pestaña «Información»'),
  ],
  fields: [
    str('introTitle', 'Título', { fieldset: 'header' }),
    str('introSubtitle', 'Subtítulo', { fieldset: 'header' }),
    str('infoTab', 'Pestaña de información', { fieldset: 'tabs' }),
    str('ratesTab', 'Pestaña de inmersiones', { fieldset: 'tabs' }),
    txt('intro', 'Introducción', { fieldset: 'info' }),
    str('siteChoiceTitle', 'Lugar de las inmersiones — título', { fieldset: 'info' }),
    txt('siteChoice', 'Lugar de las inmersiones — texto', { fieldset: 'info' }),
    str('refresherTitle', 'Repaso — título', { fieldset: 'info' }),
    txt('refresher', 'Repaso — texto', { fieldset: 'info' }),
    str('scheduleTitle', 'Organización y horarios — título', { fieldset: 'info' }),
    txt('schedule', 'Organización y horarios — texto', { fieldset: 'info' }),
    str('bookingTitle', 'Reservar con antelación — título', { fieldset: 'info' }),
    txt('booking', 'Reservar con antelación — texto', { fieldset: 'info' }),
    str('docsTitle', 'Documentación — título', { fieldset: 'info' }),
    txt('docs', 'Documentación — texto', { fieldset: 'info' }),
    str('ctaTitle', 'Título del banner de reserva'),
  ],
  preview: { prepare: () => ({ title: 'Inmersiones' }) },
})
