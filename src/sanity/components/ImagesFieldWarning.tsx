import { Stack } from '@sanity/ui'
import type { ArrayOfObjectsInputProps } from 'sanity'
import { WebPInstructions } from './WebPInstructions'

// Custom input wrapper for image arrays. Shows the shared WebP guidance (with
// converter links) above the array input.
export function ImagesFieldWarning(props: ArrayOfObjectsInputProps) {
  return (
    <Stack space={4}>
      <WebPInstructions />
      {props.renderDefault(props)}
    </Stack>
  )
}
