import { defineField, defineType } from 'sanity'
import { ImagesFieldWarning } from '../../components/ImagesFieldWarning'
import { StatsFieldExample } from '../../components/StatsFieldExample'
import { WebPFieldWarning } from '../../components/WebPFieldWarning'
import { str } from './fields'

export const centroInfo = defineType({
  name: 'centroInfo',
  title: 'Página: Inicio (información del centro)',
  type: 'document',
  // One tab per section of the home page, in page order.
  groups: [
    { name: 'hero', title: 'Portada' },
    { name: 'about', title: 'Quiénes somos', default: true },
    { name: 'facilities', title: 'Instalaciones' },
    { name: 'team', title: 'Equipo' },
    { name: 'stats', title: 'Cifras' },
    { name: 'cta', title: 'Banner' },
    { name: 'og', title: 'Redes sociales (OG)' },
    { name: 'options', title: 'Opciones de la web' },
  ],
  fieldsets: [
    {
      name: 'webOptions',
      title: 'Opciones de la web',
      description: 'Ajustes globales que cambian el comportamiento de la web.',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'ogImages',
      title: 'Imágenes Open Graph (redes sociales)',
      description:
        "Estas imágenes son la vista previa que aparece al compartir un enlace de esta web en WhatsApp, Facebook, Instagram o LinkedIn. Deben subirse en formato JPG (no WEBP — muchas redes sociales no lo muestran correctamente) y con un tamaño recomendado de 1200x630 píxeles. Si no subes una imagen para una página concreta, se usará la 'Imagen OG por defecto'.",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: 'hideDivesTab',
      group: 'options',
      title: 'Ocultar pestaña "Inmersiones"',
      description:
        'Actívalo para ocultar la pestaña "Inmersiones" de la página de Inmersiones. Al ocultarla, la pestaña "Información" también desaparece y su contenido se muestra directamente, sin pestañas.',
      type: 'boolean',
      initialValue: false,
      fieldset: 'webOptions',
    }),
    defineField({
      name: 'heroImage',
      group: 'hero',
      title: 'Imagen de hero',
      description:
        'Se usa como imagen de portada en la página de inicio (debajo del logo) y como fondo de la cabecera del resto de páginas.',
      type: 'image',
      options: { accept: 'image/webp' },
      components: { input: WebPFieldWarning },
    }),
    // Headings of the home page sections (fallback: src/content/data/pageTexts.ts).
    str('whoWeAreEyebrow', 'Antetítulo', { group: 'about' }),
    str('aboutTitle', 'Título', { group: 'about' }),
    str('facilitiesEyebrow', 'Antetítulo', { group: 'facilities' }),
    str('facilitiesTitle', 'Título', { group: 'facilities' }),
    str('aboutEyebrow', 'Antetítulo', { group: 'team' }),
    str('teamTitle', 'Título', { group: 'team' }),
    str('ctaTitle', 'Título del banner de reserva', { group: 'cta' }),
    defineField({ name: 'intro', group: 'about', title: 'Introducción', type: 'localeText' }),
    defineField({ name: 'history', group: 'about', title: 'Historia / zona de buceo', type: 'localeText' }),
    str('videoCaption', 'Pie del vídeo', { group: 'about' }),
    defineField({ name: 'installations', group: 'facilities', title: 'Instalaciones', type: 'localeText' }),
    defineField({
      name: 'installationsImages',
      group: 'facilities',
      title: 'Fotos de las instalaciones',
      type: 'array',
      of: [{ type: 'image', options: { accept: 'image/webp' } }],
      components: { input: ImagesFieldWarning },
    }),
    defineField({
      name: 'staff',
      group: 'team',
      title: 'Equipo',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'staffMember',
          title: 'Miembro del equipo',
          fields: [
            defineField({ name: 'name', title: 'Nombre', type: 'string' }),
            defineField({ name: 'role', title: 'Rol', type: 'localeString' }),
            defineField({ name: 'bio', title: 'Biografía', type: 'localeText' }),
            defineField({ name: 'languages', title: 'Idiomas', type: 'localeString' }),
            defineField({
              name: 'photo',
              title: 'Foto',
              type: 'image',
              options: { accept: 'image/webp' },
              components: { input: WebPFieldWarning },
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'stats',
      group: 'stats',
      title: 'Estadísticas',
      type: 'array',
      components: { input: StatsFieldExample },
      of: [
        {
          type: 'object',
          name: 'stat',
          fields: [
            defineField({ name: 'value', title: 'Valor', type: 'string' }),
            defineField({ name: 'label', title: 'Etiqueta', type: 'localeString' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'certifications',
      group: 'about',
      title: 'Certificaciones / partners',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'certification',
          fields: [
            defineField({ name: 'name', title: 'Nombre', type: 'string' }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              options: { accept: 'image/webp' },
              components: { input: WebPFieldWarning },
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'mapImage',
      group: 'options',
      title: 'Imagen del mapa de acceso',
      type: 'image',
      options: { accept: 'image/webp' },
      components: { input: WebPFieldWarning },
    }),
    defineField({
      name: 'ogImageDefault',
      group: 'og',
      title: 'Imagen OG por defecto',
      description: 'Se usa en cualquier página que no tenga su propia imagen OG asignada abajo.',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageHome',
      group: 'og',
      title: 'Imagen OG — Inicio',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageDives',
      group: 'og',
      title: 'Imagen OG — Inmersiones',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageBaptisms',
      group: 'og',
      title: 'Imagen OG — Bautizos',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageCourses',
      group: 'og',
      title: 'Imagen OG — Cursos',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageRates',
      group: 'og',
      title: 'Imagen OG — Tarifas',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageGallery',
      group: 'og',
      title: 'Imagen OG — Galería',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageSidemount',
      group: 'og',
      title: 'Imagen OG — Sidemount',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageContact',
      group: 'og',
      title: 'Imagen OG — Contacto',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
  ],
  preview: {
    select: { intro: 'intro.es' },
    prepare({ intro }) {
      return { title: 'Inicio (información del centro)', subtitle: intro }
    },
  },
})
