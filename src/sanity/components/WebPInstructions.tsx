import { Card, Stack, Text } from '@sanity/ui'

// The single source of truth for the "upload WebP" guidance shown across every
// content image input in the Studio. Keeping it in one place means the copy and
// the converter links only have to be maintained once.
//
// Free, reputable pages to convert JPG/PNG to WebP. Squoosh runs entirely in the
// browser (nothing is uploaded); CloudConvert and iLoveIMG also handle other
// formats. All serve over HTTPS.
const converterPages = [
  { label: 'Squoosh', note: 'de Google, sin subir la imagen', href: 'https://squoosh.app/' },
  { label: 'CloudConvert', note: 'JPG → WebP', href: 'https://cloudconvert.com/jpg-to-webp' },
  { label: 'iLoveIMG', note: 'cualquier formato → WebP', href: 'https://www.iloveimg.com/convert-to-webp' },
]

export function WebPInstructions() {
  return (
    <Card tone="caution" padding={[3, 4]} radius={2}>
      <Stack space={3}>
        <Text size={1} weight="semibold">
          ⚠️ Formato requerido: WebP
        </Text>
        <Text size={1}>
          Sube siempre las imágenes en formato <strong>WebP</strong>. Pesan mucho menos que JPG o
          PNG y hacen que la web cargue más rápido, con la misma calidad visual.
        </Text>
        <Text size={1}>
          ¿La tienes en JPG o PNG? Conviértela gratis aquí antes de subirla:
        </Text>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {converterPages.map((page) => (
            <li key={page.href}>
              <Text size={1}>
                <a href={page.href} target="_blank" rel="noopener noreferrer">
                  {page.label}
                </a>
                {page.note ? ` (${page.note})` : ''}
              </Text>
            </li>
          ))}
        </ul>
      </Stack>
    </Card>
  )
}
