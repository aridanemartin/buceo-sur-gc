# Sidemount "terreno de juego" photo carousel

## Goal

Add a photo slider to the "Gran Canaria, «terreno de juego» ideal" section on the
Sidemount page, visually identical to the Home page's "Instalaciones" carousel
(text on one side, fading/looping Swiper carousel on the other).

## Source assets

`public/assets/fotos sidemount/*.JPG` — 14 GoPro photos, 4000×3000px, 4-8MB each,
currently unreferenced anywhere in the code (confirmed via grep and git log).
Because everything under `public/` ships to the build as-is, these already add
~72MB of dead weight to every deploy.

## Changes

### 1. Image assets
- Convert all 14 photos to WebP with `cwebp -q 85 -resize 1600 0` (matches the
  ~1152×864 render size used by the carousel, capped a bit higher for retina).
- Output to a new `public/assets/sidemount/` folder (no space in the path),
  sequentially named (`sidemount-01.webp` … `sidemount-14.webp`).
- Delete the original `public/assets/fotos sidemount/` folder once conversion is
  verified — it's unreferenced and the WebP copies replace it.

### 2. Shared component rename
- `src/components/InstalacionesCarousel.tsx` → `src/components/PhotoCarousel.tsx`
  (component renamed `PhotoCarousel`; props/behavior unchanged).
- `src/components/InstalacionesCarousel.module.css` → `src/components/PhotoCarousel.module.css`.
- Update `HomeView.astro`'s import accordingly.

### 3. Shared grid layout
- Extract `src/styles/HomeInstalaciones.module.css` → `src/styles/TextWithCarousel.module.css`
  (same `.grid`/`.text` rules — generic text-beside-carousel layout).
- `HomeView.astro` and `SidemountView.astro` both import this module for their
  respective sections.

### 4. Data
- New `src/content/data/sidemountGallery.ts`, following the existing
  `wildlifeGallery.ts` convention: exports an array of `/assets/sidemount/*.webp`
  paths.

### 5. i18n
- Add a `sidemount` block to `UiStrings` (`src/i18n/strings.ts`) with `alt`,
  `prev`, `next` keys, localized for `es`/`en`/`fr`/`de`, mirroring the existing
  `home.facilitiesAlt/Prev/Next` pattern.

### 6. View wiring
- In `SidemountView.astro`, the terrain section (`terrainTitle` + `terrain` body)
  becomes a two-column grid: text column (unchanged copy) + `<PhotoCarousel
  images={...} prevLabel={...} nextLabel={...} client:load />`, using the images
  from `sidemountGallery.ts` and the new i18n labels, in the same shape as
  `HomeView.astro`'s Instalaciones section (`images.map(url => ({ url, alt:
  u.sidemount.alt }))`).

## Out of scope
- No changes to carousel behavior/animation (fade effect, autoplay, nav arrows
  stay as-is).
- No changes to the sidemount page copy or other sections.
