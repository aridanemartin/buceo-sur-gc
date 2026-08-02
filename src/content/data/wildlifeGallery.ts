// Curated underwater wildlife photos for the home page's infinite scroll strip.
// Sourced from the legacy "quien somos y donde estamos" page gallery
// (cc-m-gallery-12432000387): buceosur-gc.com/en-español/quien-somos-y-donde-estamos/
export type LocaleValue = Partial<Record<'es' | 'en' | 'fr' | 'de', string>>

const loc = (es: string, en: string, fr: string, de: string): LocaleValue => ({ es, en, fr, de })

export interface WildlifePhoto {
  image: string
  alt: LocaleValue
}

export const wildlifeGalleryData: WildlifePhoto[] = [
  {
    image: '/assets/wildlife/angel-shark.webp',
    alt: loc(
      'Angelote nadando junto a un roque volcánico',
      'Angel shark swimming beside a volcanic rock',
      'Ange de mer nageant près d’un rocher volcanique',
      'Engelhai schwimmt neben einem vulkanischen Felsen',
    ),
  },
  {
    image: '/assets/wildlife/nudibranch.webp',
    alt: loc(
      'Nudibranquio rosa sobre un gorgonario',
      'Pink nudibranch on a gorgonian',
      'Nudibranche rose sur un gorgonaire',
      'Rosa Nacktschnecke auf einer Gorgonie',
    ),
  },
  {
    image: '/assets/wildlife/triggerfish-sponge.webp',
    alt: loc(
      'Pez ballesta nadando junto a una esponja amarilla',
      'Triggerfish swimming beside a yellow sponge',
      'Baliste nageant près d’une éponge jaune',
      'Drückerfisch schwimmt neben einem gelben Schwamm',
    ),
  },
  {
    image: '/assets/wildlife/seahorse.webp',
    alt: loc(
      'Caballito de mar entre algas',
      'Seahorse among seaweed',
      'Hippocampe parmi les algues',
      'Seepferdchen zwischen Algen',
    ),
  },
  {
    image: '/assets/wildlife/octopus.webp',
    alt: loc(
      'Pulpo sobre un arrecife junto a un pez',
      'Octopus on a reef next to a fish',
      'Poulpe sur un récif à côté d’un poisson',
      'Oktopus auf einem Riff neben einem Fisch',
    ),
  },
  {
    image: '/assets/wildlife/fish-school.webp',
    alt: loc(
      'Banco de peces plateados',
      'School of silver fish',
      'Banc de poissons argentés',
      'Schwarm silberner Fische',
    ),
  },
]
