import { defineField, defineType } from 'sanity'
import { StatsFieldExample } from '../../components/StatsFieldExample'

export const centroInfo = defineType({
  name: 'centroInfo',
  title: 'Información del centro / general',
  type: 'document',
  fieldsets: [
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
      name: 'heroImage',
      title: 'Imagen de hero',
      description: 'Se usa como imagen de portada en la página de inicio debajo del logo',
      type: 'image',
      options: { accept: 'image/webp' },
    }),
    defineField({ name: 'intro', title: 'Introducción', type: 'localeText' }),
    defineField({ name: 'history', title: 'Historia / zona de buceo', type: 'localeText' }),
    defineField({ name: 'installations', title: 'Instalaciones', type: 'localeText' }),
    defineField({
      name: 'installationsImages',
      title: 'Fotos de las instalaciones',
      type: 'array',
      of: [{ type: 'image', options: { accept: 'image/webp' } }],
    }),
    defineField({
      name: 'staff',
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
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'stats',
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
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'mapImage',
      title: 'Imagen del mapa de acceso',
      type: 'image',
      options: { accept: 'image/webp' },
    }),
    defineField({
      name: 'ogImageDefault',
      title: 'Imagen OG por defecto',
      description: 'Se usa en cualquier página que no tenga su propia imagen OG asignada abajo.',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageHome',
      title: 'Imagen OG — Inicio',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageDives',
      title: 'Imagen OG — Inmersiones',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageBaptisms',
      title: 'Imagen OG — Bautizos',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageCourses',
      title: 'Imagen OG — Cursos',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageRates',
      title: 'Imagen OG — Tarifas',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageGallery',
      title: 'Imagen OG — Galería',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageSidemount',
      title: 'Imagen OG — Sidemount',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
    defineField({
      name: 'ogImageContact',
      title: 'Imagen OG — Contacto',
      type: 'image',
      fieldset: 'ogImages',
      options: { accept: 'image/jpeg' },
    }),
  ],
  preview: {
    select: { intro: 'intro.es' },
    prepare({ intro }) {
      return { title: 'Información del centro / general', subtitle: intro }
    },
  },
})
