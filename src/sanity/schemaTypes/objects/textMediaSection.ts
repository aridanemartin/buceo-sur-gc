import { defineArrayMember, defineField, defineType } from 'sanity'
import { ImagesFieldWarning } from '../../components/ImagesFieldWarning'
import { WebPFieldWarning } from '../../components/WebPFieldWarning'

// A "text + image" block of a page (title, paragraph and an image, carousel or
// video beside it). Pages hold a fixed list of these (see `sectionsField`), one
// per block on the website, identified by `key`. Which media input is shown is
// decided by the hidden `media` value the seed gives each block.
export const textMediaSection = defineType({
  name: 'textMediaSection',
  title: 'Sección',
  type: 'object',
  fields: [
    defineField({ name: 'key', type: 'string', hidden: true, readOnly: true }),
    defineField({ name: 'media', type: 'string', hidden: true, readOnly: true }),
    defineField({ name: 'eyebrow', title: 'Antetítulo', type: 'localeString' }),
    defineField({ name: 'title', title: 'Título', type: 'localeString' }),
    defineField({ name: 'body', title: 'Texto', type: 'localeText' }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { accept: 'image/webp' },
      components: { input: WebPFieldWarning },
      hidden: ({ parent }) => parent?.media !== 'image',
    }),
    defineField({
      name: 'images',
      title: 'Fotos del carrusel',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { accept: 'image/webp' } })],
      components: { input: ImagesFieldWarning },
      hidden: ({ parent }) => parent?.media !== 'carousel',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Vídeo de YouTube (URL)',
      type: 'url',
      hidden: ({ parent }) => parent?.media !== 'video',
    }),
  ],
  preview: {
    select: {
      title: 'title.es',
      eyebrow: 'eyebrow.es',
      body: 'body.es',
      media: 'media',
      image: 'image',
      firstImage: 'images.0',
    },
    prepare({ title, eyebrow, body, media, image, firstImage }) {
      const kind = { image: '🖼 Imagen', carousel: '🎞 Carrusel', video: '▶ Vídeo' }[media as string]
      return {
        title: title || eyebrow || 'Sección',
        subtitle: [kind, body].filter(Boolean).join(' · '),
        media: image ?? firstImage,
      }
    },
  },
})

/**
 * The fixed list of sections of a page: editors open and edit each card but
 * cannot add, remove or reorder them, so the page layout cannot break.
 */
export const sectionsField = (group = 'sections') =>
  defineField({
    name: 'sections',
    title: 'Secciones',
    description: 'En el mismo orden que en la web. Pulsa una sección para editar su texto e imagen.',
    type: 'array',
    group,
    of: [defineArrayMember({ type: 'textMediaSection' })],
    options: {
      sortable: false,
      disableActions: ['add', 'addBefore', 'addAfter', 'remove', 'duplicate', 'copy'],
    },
  })
