import { localeList } from './objects/localeList'
import { localeSupplementList } from './objects/localeSupplementList'
import { localeString } from './objects/localeString'
import { localeText, localeTextOptional } from './objects/localeText'
import { supplementItem } from './objects/supplementItem'
import { textMediaSection } from './objects/textMediaSection'
import { baptismsPage } from './pages/baptismsPage'
import { centroInfo } from './pages/centroInfo'
import { certifyingAgency } from './pages/certifyingAgency'
import { contactPage } from './pages/contactPage'
import { coursesPage } from './pages/coursesPage'
import { diveSite } from './pages/diveSite'
import { divesPage } from './pages/divesPage'
import { galleryPage } from './pages/galleryPage'
import { ratesPage } from './pages/ratesPage'
import { sidemountPage } from './pages/sidemountPage'
import { siteSettings } from './pages/siteSettings'
import { baptism } from './products/baptism'
import { course } from './products/course'
import { dive } from './products/dive'
import { sidemountCourse } from './products/sidemountCourse'
import { tariffExtra } from './products/tariffExtra'

export const objectTypes = [
  localeString,
  localeText,
  localeTextOptional,
  localeList,
  supplementItem,
  localeSupplementList,
  textMediaSection,
]

// "Productos": the catalogue. Many documents per type.
export const productTypes = [
  course,
  sidemountCourse,
  baptism,
  dive,
  tariffExtra,
]

// "Contenido": one singleton per page (document _id === type name), in the
// order they appear in the Studio sidebar.
export const pageTypes = [
  siteSettings,
  centroInfo,
  divesPage,
  baptismsPage,
  coursesPage,
  ratesPage,
  sidemountPage,
  galleryPage,
  contactPage,
]

// Content that is a list rather than a singleton, also shown under "Contenido":
// the Galería page's dive sites (inside "Galería") and the certifying agencies
// that courses reference.
export const pageListTypes = [diveSite, certifyingAgency]

export const SINGLETON_TYPES: ReadonlySet<string> = new Set(pageTypes.map((type) => type.name))

export const schemaTypes = [...objectTypes, ...productTypes, ...pageTypes, ...pageListTypes]
