import { defineType } from 'sanity'
import { section, str, txt } from './fields'

// Phones, email, address and social links come from src/lib/constants.ts;
// this document holds the texts around them.
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Página: Contacto',
  type: 'document',
  fieldsets: [section('header', 'Cabecera'), section('details', 'Información de contacto')],
  fields: [
    str('eyebrow', 'Antetítulo', { fieldset: 'header' }),
    str('title', 'Título', { fieldset: 'header' }),
    txt('subtitle', 'Subtítulo', { fieldset: 'header' }),
    str('contactTitle', 'Título del bloque', { fieldset: 'details' }),
    str('emailLabel', 'Etiqueta «Email»', { fieldset: 'details' }),
    str('phonesLabel', 'Etiqueta «Teléfonos»', { fieldset: 'details' }),
    str('primaryNote', 'Nota del teléfono principal', { fieldset: 'details' }),
    str('secondaryRole', 'Nota del teléfono secundario', { fieldset: 'details' }),
    str('addressLabel', 'Etiqueta «Dirección»', { fieldset: 'details' }),
    str('socialTitle', 'Título de redes sociales', { fieldset: 'details' }),
    str('mapTitle', 'Título del mapa'),
    str('ctaTitle', 'Título del banner de reserva'),
  ],
  preview: { prepare: () => ({ title: 'Contacto' }) },
})
