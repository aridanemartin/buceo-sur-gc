import type { FieldProps } from 'sanity'

/**
 * Renders a field's input with no label, description, or spacing above it.
 * Used for locale object fields (es/en/fr/de) where the language is already
 * shown as the tab label, so repeating it as a field label is redundant.
 */
export function BareField(props: FieldProps) {
  return props.children
}
