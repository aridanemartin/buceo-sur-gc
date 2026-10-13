// Canonical fallback for the page-content singletons in Sanity ("Páginas web").
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

const uiTree = transpose(ui)
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

// Stored on the existing centroInfo singleton (field `homeTexts`).
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

export const divesPageTexts = {
  introTitle: divesPageContent.introTitle,
  introSubtitle: divesPageContent.introSubtitle,
  infoTab: uiTree.dives.infoTab,
  ratesTab: uiTree.dives.ratesTab,
  intro: divesPageContent.intro,
  siteChoiceTitle: divesPageContent.siteChoiceTitle,
  siteChoice: divesPageContent.siteChoice,
  refresherTitle: divesPageContent.refresherTitle,
  refresher: divesPageContent.refresher,
  scheduleTitle: divesPageContent.scheduleTitle,
  schedule: divesPageContent.schedule,
  bookingTitle: divesPageContent.bookingTitle,
  booking: divesPageContent.booking,
  docsTitle: divesPageContent.docsTitle,
  docs: divesPageContent.docs,
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
  ctaTitle: transpose(ratesCtaTitleByLocale),
}

export const sidemountPageTexts = {
  eyebrow: same('Sidemount'),
  introTitle: sidemountPageContent.introTitle,
  motto: sidemountPageContent.motto,
  intro: sidemountPageContent.intro,
  terrainTitle: sidemountPageContent.terrainTitle,
  terrain: sidemountPageContent.terrain,
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
