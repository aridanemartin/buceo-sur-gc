import { defineField } from 'sanity'

// Field builders for the "Páginas web" singletons. Field names must match the
// fallback shape in src/content/data/pageTexts.ts — the frontend merges the
// two leaf by leaf (src/sanity/pageTexts.ts).

type Extra = { description?: string; fieldset?: string; group?: string }

/** Short localized text: titles, labels, buttons. */
export const str = (name: string, title: string, extra: Extra = {}) =>
  defineField({ name, title, type: 'localeString', ...extra })

/** Long localized text: paragraphs. */
export const txt = (name: string, title: string, extra: Extra = {}) =>
  defineField({ name, title, type: 'localeText', ...extra })

/** A list of paragraphs; editors can add, remove and reorder them. */
export const paragraphs = (name: string, title: string, extra: Extra = {}) =>
  defineField({ name, title, type: 'array', of: [{ type: 'localeText' }], ...extra })

/** A group of related texts stored as one nested object (e.g. footer, nav). */
export const group = (
  name: string,
  title: string,
  fields: ReturnType<typeof defineField>[],
  description?: string,
) =>
  defineField({
    name,
    title,
    description,
    type: 'object',
    options: { collapsible: true, collapsed: true },
    fields,
  })

export const section = (name: string, title: string) => ({
  name,
  title,
  options: { collapsible: true, collapsed: false },
})
