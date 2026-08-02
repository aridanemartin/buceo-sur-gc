# Bautizos Row Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Bautizos page use the same row layout as Courses, and let Sanity editors choose per experience between an uploaded image or a pasted YouTube link.

**Architecture:** Add an optional `image` field to the `experience` Sanity schema alongside the existing `videoUrl`, resolve it in `getExperiences()`, extract the Courses row-layout CSS into a shared module, and rewrite `BaptismsView.astro`'s markup from card/grid to row, picking video over image when both are set.

**Tech Stack:** Astro (`.astro` views), CSS Modules, Sanity (schema + GROQ), no test runner configured in this repo — verification is `astro build`/`astro check`, `oxlint`, and manual smoke test via `astro dev`.

## Global Constraints

- Video takes precedence over image when an experience has both set (per approved design spec).
- Other views reading `experience` documents (`DivesView`, `SidemountView`, `RatesView`, `HomeView`) are out of scope — keep their current layout untouched.
- Image field mirrors `course.image`: `type: 'image'`, `options: { accept: 'image/webp' }`.
- Design spec: `docs/superpowers/specs/2026-08-02-bautizos-row-layout-design.md`.

---

### Task 1: Add `image` field to the experience schema

**Files:**
- Modify: `src/sanity/schemaTypes/documents/experience.ts:22`

**Interfaces:**
- Produces: `experience` documents may now carry an `image` field (Sanity `image` type, same shape as `course.image`).

- [ ] **Step 1: Add the field**

In `src/sanity/schemaTypes/documents/experience.ts`, insert a new field right after the `videoUrl` field (currently line 22: `defineField({ name: 'videoUrl', title: 'Vídeo de YouTube', type: 'url' }),`):

```ts
    defineField({ name: 'videoUrl', title: 'Vídeo de YouTube', type: 'url' }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { accept: 'image/webp' },
      description: 'Se usa solo si no hay vídeo de YouTube. El vídeo tiene prioridad.',
    }),
    defineField({ name: 'order', title: 'Orden', type: 'number' }),
```

(The `order` field already exists right after `videoUrl` — just make sure `image` is inserted between `videoUrl` and `order`, not appended after `order`.)

- [ ] **Step 2: Verify the schema file is valid TypeScript**

Run: `cd /Users/aridanemartin/workspace/buceo-sur-gc && npx tsc --noEmit -p .`
Expected: no new errors referencing `experience.ts`.

- [ ] **Step 3: Commit**

```bash
cd /Users/aridanemartin/workspace/buceo-sur-gc
git add src/sanity/schemaTypes/documents/experience.ts
git commit -m "feat(sanity): add optional image field to experience schema

Lets editors attach an image per experience as a fallback for
experiences without a YouTube video."
```

---

### Task 2: Resolve `image` in `getExperiences()` and extend the fallback type

**Files:**
- Modify: `src/sanity/queries.ts:60-72`
- Modify: `src/content/data/experiences.ts:7-21`

**Interfaces:**
- Consumes: nothing from Task 1 at the type level (Sanity documents are untyped `any` in this codebase).
- Produces: `getExperiences(audience)` return items now may include `image: string` (resolved asset URL) in addition to the existing fields (`title`, `audience`, `description`, `duration`, `depthLimit`, `price`, `includes`, `supplements`, `groupDiscount`, `videoUrl`, `order`).

- [ ] **Step 1: Extend the GROQ projection**

In `src/sanity/queries.ts`, replace the `getExperiences` function body:

```ts
export async function getExperiences(audience: 'beginner' | 'certified') {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "experience" && audience == $audience] | order(order asc)`,
      { audience },
    )
    return Array.isArray(data) && data.length > 0
      ? data
      : experiencesData.filter((e) => e.audience === audience)
  } catch {
    return experiencesData.filter((e) => e.audience === audience)
  }
}
```

with:

```ts
export async function getExperiences(audience: 'beginner' | 'certified') {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "experience" && audience == $audience] | order(order asc) { ..., "image": image.asset->url }`,
      { audience },
    )
    return Array.isArray(data) && data.length > 0
      ? data
      : experiencesData.filter((e) => e.audience === audience)
  } catch {
    return experiencesData.filter((e) => e.audience === audience)
  }
}
```

- [ ] **Step 2: Add `image` to the fallback seed type**

In `src/content/data/experiences.ts`, in the `ExperienceSeed` interface, add a field right after `videoUrl?: string`:

```ts
  videoUrl?: string
  image?: string
  order: number
```

- [ ] **Step 3: Verify types still check**

Run: `cd /Users/aridanemartin/workspace/buceo-sur-gc && npx tsc --noEmit -p .`
Expected: no new errors referencing `queries.ts` or `experiences.ts`.

- [ ] **Step 4: Commit**

```bash
cd /Users/aridanemartin/workspace/buceo-sur-gc
git add src/sanity/queries.ts src/content/data/experiences.ts
git commit -m "feat(sanity): resolve experience image URL in getExperiences

Mirrors getCourses' image.asset->url projection so BaptismsView can
render an uploaded image as a fallback when there's no video."
```

---

### Task 3: Extract the row layout into a shared CSS module

**Files:**
- Create: `src/styles/rowLayout.module.css`
- Delete: `src/views/CoursesView.module.css`
- Modify: `src/views/CoursesView.astro:12` (import) and all `courseStyles.` usages (lines 103, 107-128)

**Interfaces:**
- Produces: `rowLayout.module.css` exports the classes `.list`, `.row`, `.rowBody`, `.rowMedia`, `.rowImage`, `.rowVideo`, `.cardTitle`, `.cardMeta`, `.cardBody`, `.cardPrice` — used by both `CoursesView.astro` and (in Task 4) `BaptismsView.astro`.

- [ ] **Step 1: Create the shared module**

Create `src/styles/rowLayout.module.css` with the full current contents of `src/views/CoursesView.module.css`, plus a new `.rowVideo` rule and `position: relative` added to `.rowMedia`:

```css
/* Row layout: full-width rows with media (image or video) on the right
   (media on top on mobile). Shared by Courses and Bautizos. */

.list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 40px;
}

.row {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(2, 62, 138, 0.06);
  display: flex;
  overflow: hidden;
  transition:
    transform var(--transition),
    box-shadow var(--transition);
}

.row:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.rowBody {
  flex: 1 1 60%;
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.rowMedia {
  flex: 0 0 40%;
  min-height: 220px;
  position: relative;
}

.rowImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.rowVideo {
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

.cardTitle {
  font-size: 1.25rem;
  color: var(--color-dark);
  font-family: var(--font-heading);
}

.cardMeta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
}

.cardMeta li {
  background: var(--color-ocean-50);
  color: var(--color-ocean-800);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 100px;
}

.cardBody {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.7;
}

.cardPrice {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.3rem;
  color: var(--color-ocean-700);
}

@media (max-width: 768px) {
  .row {
    flex-direction: column;
  }

  .rowMedia {
    flex-basis: auto;
    min-height: 200px;
    order: -1;
  }

  .rowBody {
    padding: 24px;
  }
}
```

- [ ] **Step 2: Delete the old module**

```bash
cd /Users/aridanemartin/workspace/buceo-sur-gc
git rm src/views/CoursesView.module.css
```

- [ ] **Step 3: Point `CoursesView.astro` at the shared module**

In `src/views/CoursesView.astro`, change the import (currently line 12):

```ts
import courseStyles from './CoursesView.module.css'
```

to:

```ts
import rowStyles from '../styles/rowLayout.module.css'
```

Then replace every `courseStyles.` reference in the template (lines 103, 107, 108, 109, 110, 117, 118, 119, 120, 121, 124, 125) with `rowStyles.`. There is no behavior change — it's a rename of the imported identifier.

- [ ] **Step 4: Verify the Courses page still builds and looks right**

Run: `cd /Users/aridanemartin/workspace/buceo-sur-gc && npx astro check`
Expected: no errors.

Run: `cd /Users/aridanemartin/workspace/buceo-sur-gc && npm run dev` (in background), then open `/es/cursos` (or the courses route for your locale) in a browser and confirm the row layout still renders exactly as before (photo on the right, stacking on mobile). Stop the dev server after checking.

- [ ] **Step 5: Commit**

```bash
cd /Users/aridanemartin/workspace/buceo-sur-gc
git add -A
git commit -m "refactor(views): extract Courses row layout into shared CSS module

CoursesView.module.css becomes src/styles/rowLayout.module.css so
BaptismsView can reuse the same layout instead of importing another
view's stylesheet."
```

---

### Task 4: Rewrite `BaptismsView.astro` to use the row layout

**Files:**
- Modify: `src/views/BaptismsView.astro`

**Interfaces:**
- Consumes: `rowStyles` from `../styles/rowLayout.module.css` (Task 3): `.list`, `.row`, `.rowBody`, `.rowMedia`, `.rowImage`, `.rowVideo`, `.cardTitle`, `.cardMeta`, `.cardBody`, `.cardPrice`. Consumes `x.image` (string URL, optional) from `getExperiences()` (Task 2).
- Produces: Bautizos page renders experiences as rows instead of cards.

- [ ] **Step 1: Update imports**

In `src/views/BaptismsView.astro`, add the shared styles import next to the existing `styles` import (line 13: `import styles from '../styles/viewCommon.module.css'`):

```ts
import styles from '../styles/viewCommon.module.css'
import rowStyles from '../styles/rowLayout.module.css'
```

Keep the `styles` import — `viewCommon.module.css` is still used for `.pageHeader`, `.pageHeaderInner`, `.pageEyebrow`, `.pageTitle`, `.pageSubtitle`, `.section`, `.container`, `.sectionEyebrow`.

- [ ] **Step 2: Replace the experiences grid with the row list**

Replace the entire `<!-- Beginner experiences -->` section (current lines 115-168) with:

```astro
    <!-- Beginner experiences -->
    <section class={styles.section}>
      <div class={styles.container}>
        <p class={styles.sectionEyebrow}>{u.nav.baptisms}</p>
        <div class={rowStyles.list}>
          {
            experiences.map((x: any) => {
              const embedUrl = youtubeEmbedUrl(x.videoUrl)
              return (
                <article class={rowStyles.row}>
                  <div class={rowStyles.rowBody}>
                    <h3 class={rowStyles.cardTitle}>{t(x.title, lang)}</h3>
                    <ul class={rowStyles.cardMeta}>
                      {t(x.duration, lang) ? <li>{t(x.duration, lang)}</li> : null}
                      {depthBadge(x.depthLimit) ? (
                        <li>{depthBadge(x.depthLimit)}</li>
                      ) : null}
                    </ul>
                    <p class={rowStyles.cardBody}>{t(x.description, lang)}</p>
                    {t(x.includes, lang) ? (
                      <p class={rowStyles.cardBody}>
                        <strong>{l.includes}: </strong>
                        {t(x.includes, lang)}
                      </p>
                    ) : null}
                    {t(x.supplements, lang) ? (
                      <p class={rowStyles.cardBody}>
                        <strong>{l.supplements}: </strong>
                        {t(x.supplements, lang)}
                      </p>
                    ) : null}
                    {t(x.groupDiscount, lang) ? (
                      <p class={rowStyles.cardBody}>
                        <strong>{l.conditions}: </strong>
                        {t(x.groupDiscount, lang)}
                      </p>
                    ) : null}
                    {priceOf(x) ? (
                      <p class={rowStyles.cardPrice}>{priceOf(x)}</p>
                    ) : null}
                  </div>
                  {embedUrl ? (
                    <div class={rowStyles.rowMedia}>
                      <div class={rowStyles.rowVideo}>
                        <iframe
                          src={embedUrl}
                          title={t(x.title, lang)}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : x.image ? (
                    <div class={rowStyles.rowMedia}>
                      <img class={rowStyles.rowImage} src={x.image} alt={t(x.title, lang)} loading="lazy" />
                    </div>
                  ) : null}
                </article>
              )
            })
          }
        </div>
      </div>
    </section>
```

Note the precedence: `embedUrl` (video) is checked first; `x.image` is only used in the `else` branch. This is what implements "video wins."

- [ ] **Step 3: Verify the page builds**

Run: `cd /Users/aridanemartin/workspace/buceo-sur-gc && npx astro check`
Expected: no errors.

- [ ] **Step 4: Manual smoke test — video path (existing data)**

Run: `cd /Users/aridanemartin/workspace/buceo-sur-gc && npm run dev` (in background). Open the Bautizos route (e.g. `/es/bautizos`) in a browser. Confirm:
- Both seed experiences ("El Bautismo", "Curso Iniciación Básico") render as rows with the YouTube video on the right (top on mobile width), matching the Courses page's row layout.
- Text content (title, badges, description, includes/supplements/conditions, price) is unchanged from before.

- [ ] **Step 5: Manual smoke test — image path (temporary local data)**

Temporarily edit `src/content/data/experiences.ts`: on the `experience-ssi-basic-diver` entry, comment out or remove the `videoUrl` line and add `image: 'https://placehold.co/800x600.webp',` in its place. Reload the Bautizos page in the browser and confirm that row now shows the placeholder image instead of a video, sized/cropped the same way Courses' images are. Then revert this temporary edit exactly (restore the original `videoUrl` line, remove the temporary `image` line) — do not commit it.

Stop the dev server after checking.

- [ ] **Step 6: Commit**

```bash
cd /Users/aridanemartin/workspace/buceo-sur-gc
git add src/views/BaptismsView.astro
git commit -m "feat(bautizos): switch to Courses' row layout

Reuses the shared row layout so Bautizos matches Courses visually,
and lets each experience show either its YouTube video or an
uploaded image (video takes precedence when both are set)."
```

---

### Task 5: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Run the linter**

Run: `cd /Users/aridanemartin/workspace/buceo-sur-gc && npm run lint`
Expected: no new errors in the touched files.

- [ ] **Step 2: Full type check**

Run: `cd /Users/aridanemartin/workspace/buceo-sur-gc && npx astro check`
Expected: no errors.

- [ ] **Step 3: Production build**

Run: `cd /Users/aridanemartin/workspace/buceo-sur-gc && npm run build`
Expected: build succeeds.

- [ ] **Step 4: Confirm git status is clean except intended commits**

Run: `cd /Users/aridanemartin/workspace/buceo-sur-gc && git status --short && git log --oneline -6`
Expected: working tree clean, and the 4 feature commits from Tasks 1-4 present on top of prior history.
