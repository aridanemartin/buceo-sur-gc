import { Box, Card, Flex, Stack, Text } from '@sanity/ui'
import type { ArrayOfObjectsInputProps } from 'sanity'

// Custom input wrapper for the `Estadísticas` (stats) section. Shows the editor a
// screenshot of how the stats render on the homepage plus an example entry, so it's
// clear what each item (Valor + Etiqueta) feeds into. Wrapping `input` (rather than
// `field`) keeps Sanity's default title/description above this explanation.
export function StatsFieldExample(props: ArrayOfObjectsInputProps) {
  return (
    <Stack space={4}>
      <Card tone="caution" padding={[3, 4]} radius={2}>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Esta sección se muestra en la portada como una fila de cifras destacadas.
          </Text>
          <Text size={1}>
            Cada elemento es una cifra: <strong>Valor</strong> es el número grande (p. ej.
            «20+») y <strong>Etiqueta</strong> es el texto debajo (p. ej. «Años de
            experiencia»).
          </Text>
          <Flex align="center" gap={3}>
            <Card padding={3} radius={2} tone="default" border>
              <Stack space={1} align="center">
                <Text as="span" size={4} weight="bold">
                  20+
                </Text>
                <Text as="span" size={1} muted>
                  Años de experiencia
                </Text>
              </Stack>
            </Card>
            <Text size={1} muted>
              ← Así se ve cada elemento en la portada
            </Text>
          </Flex>
          <Box style={{ maxWidth: 640 }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img
              src="/assets/statistics-screenshot.webp"
              alt="Captura de ejemplo de la sección Estadísticas en la portada"
              style={{ width: '100%', height: 'auto', borderRadius: 4, display: 'block' }}
            />
          </Box>
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  )
}
