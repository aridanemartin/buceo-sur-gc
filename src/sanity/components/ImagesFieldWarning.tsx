import { Card, Stack, Text } from '@sanity/ui'
import type { ArrayOfObjectsInputProps } from 'sanity'

// Custom input wrapper for image arrays. Shows a warning that images should be
// in WebP format for better website performance.
export function ImagesFieldWarning(props: ArrayOfObjectsInputProps) {
  return (
    <Stack space={4}>
      <Card tone="caution" padding={[3, 4]} radius={2}>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            ⚠️ Formato de imagen requerido
          </Text>
          <Text size={1}>
            Todas las imágenes deben estar en formato <strong>WebP</strong> para un mejor
            rendimiento del sitio web. El formato WebP ofrece una mejor compresión sin perder
            calidad visual.
          </Text>
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  )
}
