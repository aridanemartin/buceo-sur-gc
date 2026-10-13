import { localeList } from './objects/localeList'
import { localeSupplementList } from './objects/localeSupplementList'
import { localeString } from './objects/localeString'
import { localeText } from './objects/localeText'
import { supplementItem } from './objects/supplementItem'
import { textMediaSection } from './objects/textMediaSection'
import { baptismsPage } from './pages/baptismsPage'
import { centroInfo } from './pages/centroInfo'
import { contactPage } from './pages/contactPage'
import { coursesPage } from './pages/coursesPage'
import { divesPage } from './pages/divesPage'
import { galleryPage } from './pages/galleryPage'
import { ratesPage } from './pages/ratesPage'
import { sidemountPage } from './pages/sidemountPage'
import { siteSettings } from './pages/siteSettings'
import { baptism } from './products/baptism'
import { certifyingAgency } from './products/certifyingAgency'
import { course } from './products/course'
import { dive } from './products/dive'
import { diveSite } from './products/diveSite'
import { sidemountCourse } from './products/sidemountCourse'
import { tariffExtra } from './products/tariffExtra'

export const objectTypes = [
  localeString,
  localeText,
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
  diveSite,
  certifyingAgency,
]

// "Páginas web": one singleton per page (document _id === type name), in the
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

export const SINGLETON_TYPES: ReadonlySet<string> = new Set(pageTypes.map((type) => type.name))

export const schemaTypes = [...objectTypes, ...productTypes, ...pageTypes]
