import type { Locale } from '../i18n/locales'

export type LocaleValue = Partial<Record<Locale, string>>

/** Returns the value for `lang`, falling back to Spanish when empty/missing. */
export function t(field: LocaleValue | undefined | null, lang: Locale): string {
  if (!field) return ''
  return field[lang] || field.es || ''
}
