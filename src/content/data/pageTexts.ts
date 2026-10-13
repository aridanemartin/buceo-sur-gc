// Canonical fallback for the page-content singletons in Sanity ("Contenido").
// Each export has exactly the shape of its Sanity document (see
// src/sanity/schemaTypes/pages): every leaf is a `{ es, en, fr, de }` object.
// The texts are not duplicated here — they are transposed from the existing
// per-locale sources, so the site renders identically with or without Sanity.
//
// Imports use explicit `.ts` extensions because scripts/seed-pages.mjs loads
// this module with Node's native type stripping.
import { reserveInterestMessages, reserveInterestSubjects, ui } from '../../i18n/strings.ts'
import { transpose } from '../../sanity/pageTexts.ts'
import {
  baptismsCtaTitleByLocale,
  cardLabelsByLocale,
  contactCtaTitleByLocale,
  contactTextsByLocale,
  courseCategoryLabelsByLocale,
  coursesCtaByLocale,
  coursesIntroParagraphsByLocale,
  coursesSpecialtyParagraphsByLocale,
  divesCtaTitleByLocale,
  ratesCtaTitleByLocale,
  ratesExtrasTitleByLocale,
  ratesSubtitleByLocale,
  sidemountCtaByLocale,
} from './pageCopyByLocale.ts'
import {
  baptismsPageContent,
  divesPageContent,
  galleryPageContent,
  sidemountPageContent,
} from './pageContent.ts'
import { sidemountGalleryImages } from './sidemountGallery.ts'

const uiTree = transpose(ui)
const empty = { es: '', en: '', fr: '', de: '' }
const same = (text: string) => ({ es: text, en: text, fr: text, de: text })
const perLocale = (fn: (l: 'es' | 'en' | 'fr' | 'de') => string) =>
  ({ es: fn('es'), en: fn('en'), fr: fn('fr'), de: fn('de') })

export const siteSettingsTexts = {
  nav: uiTree.nav,
  legal: uiTree.legal,
  book: uiTree.book,
  ctaButton: uiTree.ctaButton,
  ctaNote: uiTree.ctaNote,
  footer: uiTree.footer,
  cardLabels: transpose(cardLabelsByLocale),
  // Prefilled email when a product has no booking link; "{item}" is replaced
  // by the course/dive title.
  reserveInterestSubject: perLocale((l) => reserveInterestSubjects[l]('{item}')),
  reserveInterest: perLocale((l) => reserveInterestMessages[l]('{item}')),
}

// Stored as top-level fields of the existing centroInfo singleton.
export const homeTexts = {
  whoWeAreEyebrow: uiTree.home.whoWeAreEyebrow,
  aboutTitle: same('Buceo Sur Gran Canaria'),
  videoCaption: uiTree.home.videoCaption,
  facilitiesEyebrow: uiTree.home.facilitiesEyebrow,
  facilitiesTitle: uiTree.home.facilitiesTitle,
  aboutEyebrow: uiTree.home.aboutEyebrow,
  teamTitle: uiTree.home.teamTitle,
  ctaTitle: uiTree.home.ctaTitle,
}

// A "text + image" block (Studio: textMediaSection). `key` ties it to its slot
// in the view; `media` decides which media input the Studio shows.
type Media = 'none' | 'image' | 'carousel' | 'video'
const section = (key: string, media: Media, fields: Record<string, unknown>) => ({
  key,
  media,
  ...fields,
})
const image = (src: string, width: number, height: number) => ({
  image: src,
  imageWidth: width,
  imageHeight: height,
})

export const divesPageTexts = {
  introTitle: divesPageContent.introTitle,
  introSubtitle: divesPageContent.introSubtitle,
  infoTab: uiTree.dives.infoTab,
  ratesTab: uiTree.dives.ratesTab,
  sections: [
    section('intro', 'none', { eyebrow: uiTree.nav.dives, body: divesPageContent.intro }),
    section('siteChoice', 'image', {
      title: divesPageContent.siteChoiceTitle,
      body: divesPageContent.siteChoice,
      ...image('/assets/maps/mapa.sitio.buceo.isla.webp', 800, 717),
    }),
    section('refresher', 'image', {
      title: divesPageContent.refresherTitle,
      body: divesPageContent.refresher,
      ...image('/assets/refresh.webp', 1536, 1024),
    }),
    section('schedule', 'image', {
      title: divesPageContent.scheduleTitle,
      body: divesPageContent.schedule,
      ...image('/assets/calendar-dive.webp', 1536, 1024),
    }),
    section('booking', 'image', {
      title: divesPageContent.bookingTitle,
      body: divesPageContent.booking,
      ...image('/assets/reservar.webp', 1672, 941),
    }),
    section('docs', 'image', {
      title: divesPageContent.docsTitle,
      body: divesPageContent.docs,
      ...image('/assets/documentation/scuba-license.webp', 1000, 532),
    }),
  ],
  ctaTitle: transpose(divesCtaTitleByLocale),
}

export const baptismsPageTexts = {
  introTitle: baptismsPageContent.introTitle,
  intro: baptismsPageContent.intro,
  ctaTitle: transpose(baptismsCtaTitleByLocale),
}

export const coursesPageTexts = {
  title: {
    es: 'Cursos de buceo',
    en: 'Diving courses',
    fr: 'Formations de plongée',
    de: 'Tauchkurse',
  },
  // "{agencies}" is replaced by the list of certifying agencies (e.g. "SSI y CMAS").
  subtitle: {
    es: 'Cursos {agencies} para todos los niveles en Gran Canaria.',
    en: '{agencies} courses for all levels in Gran Canaria.',
    fr: 'Formations {agencies} pour tous les niveaux à Grande Canarie.',
    de: '{agencies} Kurse für alle Level auf Gran Canaria.',
  },
  // Used when there are no courses (and therefore no agencies) to list.
  subtitleNoAgencies: {
    es: 'Cursos de buceo para todos los niveles en Gran Canaria.',
    en: 'Diving courses for all levels in Gran Canaria.',
    fr: 'Formations de plongée pour tous les niveaux à Grande Canarie.',
    de: 'Tauchkurse für alle Level auf Gran Canaria.',
  },
  beginnersTitle: {
    es: 'Formación para principiantes',
    en: 'Beginner courses',
    fr: 'Formations pour débutants',
    de: 'Kurse für Anfänger',
  },
  introParagraphs: transpose(coursesIntroParagraphsByLocale),
  advancedTitle: {
    es: 'Formación avanzada y especializada',
    en: 'Advanced & specialty courses',
    fr: 'Formations avancées et spécialisées',
    de: 'Fortgeschrittenen- und Spezialkurse',
  },
  specialtyParagraphs: transpose(coursesSpecialtyParagraphsByLocale),
  categoryLabels: transpose(courseCategoryLabelsByLocale),
  ctaTitle: transpose(coursesCtaByLocale).title,
}

export const ratesPageTexts = {
  subtitle: transpose(ratesSubtitleByLocale),
  extrasTitle: transpose(ratesExtrasTitleByLocale),
  // Optional text under each category heading (one paragraph per line). No
  // code fallback: an editor emptying it in the Studio hides it. The initial
  // copy is written to Sanity once, from `seedOnlyTexts` below.
  baptismsDescription: empty,
  divesDescription: empty,
  coursesDescription: empty,
  extrasDescription: empty,
  ctaTitle: transpose(ratesCtaTitleByLocale),
}

export const sidemountPageTexts = {
  eyebrow: same('Sidemount'),
  introTitle: sidemountPageContent.introTitle,
  motto: sidemountPageContent.motto,
  sections: [
    section('intro', 'video', {
      title: uiTree.nav.sidemount,
      body: sidemountPageContent.intro,
      videoUrl: sidemountPageContent.videoUrl,
    }),
    section('terrain', 'carousel', {
      eyebrow: same('Sidemount'),
      title: sidemountPageContent.terrainTitle,
      body: sidemountPageContent.terrain,
      images: sidemountGalleryImages,
    }),
  ],
  courseTitle: sidemountPageContent.courseTitle,
  courseRequirementsTitle: sidemountPageContent.courseRequirementsTitle,
  courseRequirements: sidemountPageContent.courseRequirements,
  courseIncludesTitle: sidemountPageContent.courseIncludesTitle,
  courseIncludes: sidemountPageContent.courseIncludes,
  ctaTitle: transpose(sidemountCtaByLocale).title,
}

export const galleryPageTexts = {
  introTitle: galleryPageContent.introTitle,
  intro: galleryPageContent.intro,
}

export const contactPageTexts = {
  ...transpose(contactTextsByLocale),
  ctaTitle: transpose(contactCtaTitleByLocale),
}

/**
 * Initial values for optional fields, written by scripts/seed-pages.mjs when
 * missing but never used as a rendering fallback. (An editor who empties one
 * should not re-run the seed, or it comes back.)
 */
export const seedOnlyTexts = {
  ratesPage: {
    baptismsDescription: {
      es: 'Para principiantes sin certificación.',
      en: 'For beginners without certification.',
      fr: 'Pour débutants sans certification.',
      de: 'Für Anfänger ohne Zertifizierung.',
    },
    divesDescription: {
      es: 'Nivel mínimo: Open Water o Nivel 1 CMAS (con validación en aguas abiertas). En el caso de Scuba diver 12 o Nivel 1 obtenido en piscina sin experiencia en el medio natural: consúltenos.\nRequisitos: Certificado médico o cuestionario médico, carnet de buceo, seguro de buceo',
      en: 'Minimum level: Open Water or CMAS Level 1 (with open-water validation). For Scuba Diver 12 or a Level 1 obtained in a pool with no experience in open water: please contact us.\nRequirements: Medical certificate or medical questionnaire, diving card, dive insurance',
      fr: 'Niveau minimum : Open Water ou Niveau 1 CMAS (avec validation en milieu naturel). Pour les Scuba Diver 12 ou Niveau 1 obtenu en piscine sans expérience en milieu naturel : consultez-nous.\nConditions : Certificat médical ou questionnaire médical, carte de plongée, assurance plongée',
      de: 'Mindestniveau: Open Water oder CMAS Level 1 (mit Validierung im Freiwasser). Bei Scuba Diver 12 oder einem im Schwimmbad erworbenen Level 1 ohne Erfahrung im Freiwasser: Bitte kontaktieren Sie uns.\nVoraussetzungen: Ärztliches Attest oder medizinischer Fragebogen, Tauchausweis, Tauchversicherung',
    },
  },
}

/** Sanity singleton type → fallback texts (also what scripts/seed-pages.mjs writes). */
export const pageTextsByType = {
  siteSettings: siteSettingsTexts,
  divesPage: divesPageTexts,
  baptismsPage: baptismsPageTexts,
  coursesPage: coursesPageTexts,
  ratesPage: ratesPageTexts,
  sidemountPage: sidemountPageTexts,
  galleryPage: galleryPageTexts,
  contactPage: contactPageTexts,
}
