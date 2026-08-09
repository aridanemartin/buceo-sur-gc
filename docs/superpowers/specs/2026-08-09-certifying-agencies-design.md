# Manage "Entidades certificadoras" (certifying agencies)

## Goal

Give the Studio a proper CRUD section for the diving certification bodies
(SSI, CMAS, PADI, FSGT) referenced by courses, instead of a hardcoded string
list on `course.agency`. Deleting an agency must be blocked while any
**published** course still references it.

## Current state

- `course.agency` is a `string` field with a static `options.list`:
  `['SSI', 'CMAS', 'PADI', 'FSGT']` (`src/sanity/schemaTypes/documents/course.ts`).
- Production dataset (`3rasdmh3` / `production`) has 18 published `course`
  documents; distinct `agency` values in use today are `SSI` and `CMAS` only
  (`PADI`/`FSGT` are unused).
- `agency` is consumed as a plain string in several places: `CoursesView.astro`
  (grouping + section heading + anchor id via `.toLowerCase()`),
  `SidemountView.astro` (meta badge text), `CourseCard`'s `meta` prop, and the
  fallback data file `src/content/data/courses.ts` (`agency: string`).

## Changes

### 1. New document type: `certifyingAgency`

`src/sanity/schemaTypes/documents/certifyingAgency.ts`:
- `name` (string, required) — e.g. "SSI"
- `logo` (image, `options.accept: 'image/webp'`, optional) — matches the
  webp-only convention used elsewhere in the schema
- `website` (url, optional)
- `preview`: title = `name`, media = `logo`

Registered in `src/sanity/schemaTypes/index.ts`. No `structure.ts` changes —
it gets a default list item alongside the other document types.

### 2. `course.agency` becomes a reference

`course.agency` changes from `type: 'string'` (with `options.list`) to
`type: 'reference'`, `to: [{ type: 'certifyingAgency' }]`. The course
`preview.select`/`prepare` needs `agency` swapped for `agency.name` (or a
GROQ-projected value) since it's no longer a plain string on the document.

### 3. Delete protection

In `sanity.config.ts`, add a `document.actions` resolver that, only when
`context.schemaType === 'certifyingAgency'`, replaces the built-in `delete`
action with a wrapped version
(`src/sanity/actions/protectDeleteWhenReferenced.ts` or similar):

- On render, queries (via `useClient` + `useState`/`useEffect`):
  ```groq
  count(*[_type == "course" && !(_id in path("drafts.**")) && references($id)])
  ```
  where `$id` is the agency's published id (strip a `drafts.` prefix if
  present).
- While the query is in flight, the action stays disabled (avoids a race
  where delete could fire before the check resolves).
- count > 0 → action stays disabled, with a title/tooltip explaining it's
  used by N published course(s).
- count == 0 → delegates to the original `delete` action, preserving
  Sanity's normal confirm dialog and behavior.

No other actions (publish, unpublish, duplicate, discard draft) are touched,
and no other document type is affected.

### 4. Production data migration

One-off script (Sanity client, using `SANITY_API_TOKEN` from `.env`), run
against the live `production` dataset as part of this change:

1. Create 4 `certifyingAgency` documents: SSI, CMAS, PADI, FSGT (`name` only
   — no logos/websites, since no assets are available yet; can be filled in
   via Studio afterward).
2. Patch all 18 existing `course` documents: replace the string `agency`
   value with a `reference` to the matching new document.
3. Verify: recount, spot-check a couple of patched documents, confirm no
   course is left with a string `agency`.

### 5. Frontend query changes

`src/sanity/queries.ts`:
- `getCourses()` / `getCoursesByTag()`: project `"agency": agency->name` so
  every existing consumer that treats `c.agency` as a string keeps working
  unchanged (`CourseCard`, `SidemountView.astro`, the grouping/anchor-id logic
  in `CoursesView.astro`, and the `courses.ts` fallback shape).
- New `getCertifyingAgencies()`: `*[_type == "certifyingAgency"] { name, "logo": logo.asset->url, website }`,
  with fallback to `[]` if Sanity is unreachable/empty (no dedicated fallback
  data file needed — logo is a progressive enhancement, see below).

`CoursesView.astro`: additionally calls `getCertifyingAgencies()`, matches
entries by `name` against each `group.agency`, and renders the logo (if
present) beside the group's `<h2>` heading, optionally wrapped in a link to
`website` if present. Renders nothing extra when there's no matching entity
or no logo — today's plain-text heading is the fallback.

No changes to `SidemountView.astro`, `CourseCard`, or
`src/content/data/courses.ts` — they keep consuming `agency` as a string.

## Out of scope

- No UI changes beyond the agency logo next to the `CoursesView` section
  heading.
- No changes to the unrelated `centroInfo.certifications` array (partner
  logos shown elsewhere on the site) — that's a separate, pre-existing field.
- No bulk/multi-select delete handling beyond what Sanity's default UI
  already provides (protection is per-document via the action).
