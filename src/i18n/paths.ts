import { getRelativeLocaleUrl } from 'astro:i18n'
import { LOCALES, LOCALE_LABELS, type Locale } from './locales'

export function localePath(lang: Locale, path = ''): string {
  return getRelativeLocaleUrl(lang, path)
}

export function alternateLinks(path = '') {
  return LOCALES.map((locale) => ({
    locale,
    label: LOCALE_LABELS[locale],
    href: localePath(locale, path),
  }))
}
