import { defineType } from 'sanity'
import { group, section, str } from './fields'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Textos globales',
  type: 'document',
  fieldsets: [
    section('cta', 'Banner de reserva'),
    {
      ...section('reserveEmail', 'Email de reserva'),
      description:
        'Si un producto no tiene enlace de reserva, su botón «Reservar» abre un email al centro con este asunto y mensaje.',
    },
  ],
  fields: [
    group('nav', 'Menú de navegación', [
      str('home', 'Inicio'),
      str('dives', 'Inmersiones'),
      str('baptisms', 'Bautizos'),
      str('courses', 'Cursos'),
      str('rates', 'Tarifas'),
      str('gallery', 'Galería'),
      str('sidemount', 'Sidemount'),
      str('contact', 'Contacto'),
    ], 'Nombres de las páginas en el menú y el pie de página (también se usan como títulos en algunas páginas).'),
    str('book', 'Botón «Reservar»', {
      description: 'Botón del menú y de cada tarjeta de producto.',
    }),
    str('ctaButton', 'Botón del banner', { fieldset: 'cta' }),
    str('ctaNote', 'Nota bajo el botón', { fieldset: 'cta' }),
    group('cardLabels', 'Etiquetas de las tarjetas de producto', [
      str('includes', 'Incluye'),
      str('supplements', 'Suplementos / opciones'),
      str('requirements', 'Requisitos'),
      str('depth', 'Profundidad máx. (abreviatura)'),
      str('packageBadge', 'Distintivo de bono / pack'),
    ], 'Títulos que aparecen dentro de las tarjetas de cursos, bautizos e inmersiones.'),
    str('reserveInterestSubject', 'Email de reserva — asunto', {
      fieldset: 'reserveEmail',
      description: 'Escribe {item} donde debe ir el nombre del producto.',
    }),
    str('reserveInterest', 'Email de reserva — mensaje', {
      fieldset: 'reserveEmail',
      description: 'Escribe {item} donde debe ir el nombre del producto.',
    }),
    group('footer', 'Pie de página', [
      str('country', 'País'),
      str('tagline', 'Eslogan'),
      str('servicesTitle', 'Título «Servicios»'),
      str('companyTitle', 'Título «Empresa»'),
      str('legalTitle', 'Título «Avisos legales»'),
      str('rightsReserved', '«Todos los derechos reservados»'),
      str('textsCredit', 'Créditos de textos y fotos'),
    ]),
    group('legal', 'Enlaces legales (pie de página)', [
      str('privacy', 'Privacidad'),
      str('cancellation', 'Cancelación'),
      str('terms', 'Condiciones'),
    ]),
  ],
  preview: { prepare: () => ({ title: 'Textos globales', subtitle: 'Menú, pie de página, banner de reserva' }) },
})
