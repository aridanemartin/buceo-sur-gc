# Bautizos: adopt Courses' row layout, editor-chosen image or video

## Goal

The Bautizos page (`BaptismsView.astro`) currently renders each experience as a
grid card with the YouTube video embedded at the top. Switch it to the same
"row" layout used by Courses (text left, media right, stacks on mobile), and
let the Sanity editor choose per experience whether the media slot shows an
uploaded image or a pasted YouTube link — matching how Courses already lets
editors attach an image per course.

## Content model

`src/sanity/schemaTypes/documents/experience.ts` gains a new optional field:

```ts
defineField({
  name: 'image',
  title: 'Imagen',
  type: 'image',
  options: { accept: 'image/webp' },
  description: 'Se usa solo si no hay vídeo de YouTube. El vídeo tiene prioridad.',
})
```

Placed next to `videoUrl`. Both fields are optional; an experience can have
neither, either, or both.

**Precedence when both are set: video wins.** The image is a fallback for
experiences without a video, not an alternate to switch between.

`src/sanity/queries.ts` — `getExperiences()` extends its GROQ projection to
resolve the image asset URL, mirroring `getCourses()`:

```
*[_type == "experience" && audience == $audience] | order(order asc) {
  ...,
  "image": image.asset->url
}
```

`src/content/data/experiences.ts` — `ExperienceSeed` interface gains
`image?: string` so the local fallback data (used when Sanity is unreachable)
type-checks. Existing seed entries are not required to populate it.

## Layout

The row layout currently lives in `CoursesView.module.css`
(`.list`, `.row`, `.rowBody`, `.rowMedia`, `.rowImage`, `.cardTitle`,
`.cardMeta`, `.cardBody`, `.cardPrice`, plus the mobile stacking rule). Since
Baptisms will use the identical layout, extract it into a shared
`src/styles/rowLayout.module.css` imported by both `CoursesView.astro` and
`BaptismsView.astro`. `CoursesView.module.css` is deleted once its contents
move.

Add one new class to the shared module, `.rowVideo`, so a video fills the
media slot the same way `.rowImage` does today (object-fit: cover equivalent):

```css
.rowVideo {
  position: relative;
  width: 100%;
  height: 100%;
}

.rowVideo iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
```

`.rowMedia` needs `position: relative` added so `.rowVideo`'s absolute
children size against it instead of the row.

## View logic (`BaptismsView.astro`)

Replace the `styles.grid` / `styles.card` / `styles.videoWrapper` markup with
the row markup. Per experience, in `.rowMedia`:

1. `youtubeEmbedUrl(x.videoUrl)` present → render the iframe inside
   `.rowVideo`.
2. Else `x.image` present → render `<img class={rowStyles.rowImage}>`.
3. Else → omit `.rowMedia` entirely; `.rowBody` takes the full row width.

This mirrors how `CoursesView.astro` already conditionally renders
`.rowMedia` based on `c.image`.

Text content (title, meta badges, description, includes/supplements/
conditions, price) is unchanged — only the surrounding markup/classes change
from card to row.

Out of scope: other views that also read `experience` documents
(`DivesView`, `SidemountView`, `RatesView`, `HomeView`) keep their current
layout. The schema/query changes are additive and don't affect them.

## Testing

Manual smoke test only (presentational change):

- Run the dev server, view the Bautizos page, confirm the row layout matches
  Courses (photo/video right, stacks below text on mobile).
- Confirm the existing seed experiences (both currently have `videoUrl`)
  still render their YouTube embeds correctly in the new layout.
- Temporarily set an experience's `image` with no `videoUrl` in local seed
  data to confirm the image path renders, then revert the temporary edit.
