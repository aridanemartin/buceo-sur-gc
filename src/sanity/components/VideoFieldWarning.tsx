import { Card, Stack, Text } from '@sanity/ui'
import type { StringInputProps } from 'sanity'

// Keeps the CMS editor aware that a YouTube video replaces the image on the
// website, while preserving Sanity's standard URL input and validation.
export function VideoFieldWarning(props: StringInputProps) {
  return (
    <Stack space={4}>
      {props.renderDefault(props)}
      <Card tone="caution" padding={[3, 4]} radius={2}>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            ⚠️ El vídeo tiene prioridad
          </Text>
          <Text size={1}>
            Si añades un vídeo de YouTube, la imagen no se utilizará en la web.
          </Text>
        </Stack>
      </Card>
    </Stack>
  )
}
