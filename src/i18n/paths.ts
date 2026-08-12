import { getRelativeLocaleUrl } from 'astro:i18n'
import { LOCALE_LABELS, LOCALES, type Locale } from './locales'

export function localePath(lang: Locale, path = ''): string {
  return getRelativeLocaleUrl(lang, path)
}

/**
 * Appends (or overrides) a `?lang=` query param on an external URL, so a
 * Bukyapp reservationLink opens in the same language as the page it was
 * clicked from. Falls back to the original string if it isn't a valid URL.
 */
export function withLangParam(url: string, lang: Locale): string {
  try {
    const u = new URL(url)
    u.searchParams.set('lang', lang)
    return u.toString()
  } catch {
    return url
  }
}

export function alternateLinks(path = '') {
  return LOCALES.map((locale) => ({
    locale,
    label: LOCALE_LABELS[locale],
    href: localePath(locale, path),
  }))
}
