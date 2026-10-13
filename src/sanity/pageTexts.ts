// Helpers for the page-content singletons (siteSettings, divesPage, …).
//
// Page copy is stored with the same shape in two places:
//   - the canonical fallback in src/content/data/pageTexts.ts
//   - the Sanity singleton documents (src/sanity/schemaTypes/pages)
// Every leaf is a locale object `{ es, en, fr, de }`. `mergeTexts` overlays the
// Sanity document onto the fallback leaf by leaf, so a missing or half-filled
// document never blanks a section, and `resolveTexts` turns the merged tree
// into plain strings for one locale.
//
// This file must stay dependency-free (no Astro/Sanity imports): it is also
// imported by scripts/seed-pages.mjs through Node's native type stripping.

const LOCALES = ['es', 'en', 'fr', 'de'] as const
type Lang = (typeof LOCALES)[number]

export type LocaleLeaf = Partial<Record<Lang, string>>

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

// A fallback leaf has only locale keys; a Sanity leaf may also carry _type/_key.
const isLocaleLeaf = (v: unknown): v is LocaleLeaf =>
  isPlainObject(v) &&
  'es' in v &&
  Object.keys(v).every((k) => (LOCALES as readonly string[]).includes(k) || k.startsWith('_'))

const hasText = (v: unknown): boolean =>
  isLocaleLeaf(v) && typeof v.es === 'string' && v.es.trim() !== ''

/**
 * Turns a per-locale record (`{ es: {...}, en: {...}, … }`) into one tree whose
 * leaves are locale objects. Arrays are transposed index by index. Values that
 * are not strings (functions, numbers) are dropped.
 */
export function transpose(byLocale: Record<Lang, unknown>): any {
  const es = byLocale.es
  if (typeof es === 'string') {
    return Object.fromEntries(LOCALES.map((l) => [l, byLocale[l] as string]))
  }
  if (Array.isArray(es)) {
    return es.map((_, i) =>
      transpose(Object.fromEntries(LOCALES.map((l) => [l, (byLocale[l] as unknown[])[i]])) as any),
    )
  }
  if (isPlainObject(es)) {
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(es)) {
      const child = transpose(
        Object.fromEntries(LOCALES.map((l) => [l, (byLocale[l] as any)?.[key]])) as any,
      )
      if (child !== undefined) out[key] = child
    }
    return out
  }
  return undefined
}

/**
 * Overlays a Sanity document onto the fallback tree. Only keys present in the
 * fallback are considered:
 *   - a locale leaf is taken from Sanity when its `es` value is filled in (es is
 *     required in the Studio);
 *   - a plain value (image URL, width…) is taken when Sanity has one;
 *   - page sections (arrays of objects with a `key`) are matched by key, so each
 *     block keeps its place and merges field by field;
 *   - any other array (paragraphs, carousel photos) is taken from Sanity when it
 *     has at least one filled-in item.
 * Otherwise the fallback wins.
 */
export function mergeTexts<T>(fallback: T, data: unknown): T {
  if (isLocaleLeaf(fallback)) return (hasText(data) ? data : fallback) as T
  if (typeof fallback === 'string' || typeof fallback === 'number') {
    return (typeof data === typeof fallback && data !== '' ? data : fallback) as T
  }
  if (Array.isArray(fallback)) {
    const items = Array.isArray(data) ? data : []
    if (fallback.every((item) => isPlainObject(item) && typeof item.key === 'string')) {
      return fallback.map((item) =>
        mergeTexts(item, items.find((d) => isPlainObject(d) && d.key === item.key)),
      ) as T
    }
    const filled = items.filter((d) => hasText(d) || (typeof d === 'string' && d !== ''))
    return (filled.length ? filled : fallback) as T
  }
  if (isPlainObject(fallback)) {
    const source = isPlainObject(data) ? data : {}
    return Object.fromEntries(
      Object.entries(fallback).map(([k, v]) => [k, mergeTexts(v, source[k])]),
    ) as T
  }
  return fallback
}

type Resolved<T> = T extends LocaleLeaf
  ? string
  : T extends readonly (infer U)[]
    ? Resolved<U>[]
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T

/** Picks one locale from every leaf, falling back to Spanish like `t()`. */
export function resolveTexts<T>(tree: T, lang: Lang): Resolved<T> {
  if (isLocaleLeaf(tree)) return (tree[lang] || tree.es || '') as Resolved<T>
  if (Array.isArray(tree)) return tree.map((v) => resolveTexts(v, lang)) as Resolved<T>
  if (isPlainObject(tree)) {
    return Object.fromEntries(
      Object.entries(tree).map(([k, v]) => [k, resolveTexts(v, lang)]),
    ) as Resolved<T>
  }
  return tree as Resolved<T>
}

/** Replaces `{name}` placeholders, e.g. fillTemplate('Hola {item}', { item: 'x' }). */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match)
}
