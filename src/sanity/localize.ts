import type { Locale } from '../i18n/locales'

export type LocaleValue = Partial<Record<Locale, string>>
export type LocaleListValue = Partial<Record<Locale, string[]>>

// A "Suplementos / opciones" row: concept + price, kept as separate fields so
// they can be styled in two colors. Either may be missing.
export interface SupplementItem {
  label?: string
  price?: string
}
export type LocaleSupplementListValue = Partial<Record<Locale, SupplementItem[]>>

/** Returns the value for `lang`, falling back to Spanish when empty/missing. */
export function t(field: LocaleValue | undefined | null, lang: Locale): string {
  if (!field) return ''
  return field[lang] || field.es || ''
}

/** Returns the list for `lang`, falling back to Spanish when empty/missing. */
export function tList(field: LocaleListValue | undefined | null, lang: Locale): string[] {
  if (!field) return []
  const value = field[lang]?.length ? field[lang] : field.es
  return value ?? []
}

/**
 * Returns the supplement rows for `lang` (falling back to Spanish when
 * empty/missing), keeping only rows that have both a label and a price —
 * a row missing either is dropped rather than rendered half-blank.
 */
export function tSupplements(
  field: LocaleSupplementListValue | undefined | null,
  lang: Locale,
): Required<SupplementItem>[] {
  if (!field) return []
  const value = field[lang]?.length ? field[lang] : field.es
  return (value ?? []).filter(
    (item): item is Required<SupplementItem> => !!item.label && !!item.price,
  )
}
