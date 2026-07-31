export const LOCALES = ['es', 'en', 'fr', 'de'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'es'

export const LOCALE_LABELS: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
}
