import { defineField, defineType } from 'sanity'

export const centroInfo = defineType({
  name: 'centroInfo',
  title: 'Información del centro',
  type: 'document',
  fields: [
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
  ],
  preview: {
    select: { intro: 'intro.es' },
    prepare({ intro }) {
      return { title: 'Información del centro', subtitle: intro }
    },
  },
})
