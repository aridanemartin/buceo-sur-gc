import { Stack } from '@sanity/ui'
import type { ImageInputProps } from 'sanity'
import { WebPInstructions } from './WebPInstructions'

// Custom input wrapper for single image fields. Wrapping `input` (rather than
// `field`) keeps Sanity's default label/description above the image picker and
// adds the shared WebP guidance below it.
export function WebPFieldWarning(props: ImageInputProps) {
  return (
    <Stack space={4}>
      <WebPInstructions />
      {props.renderDefault(props)}
    </Stack>
  )
}
