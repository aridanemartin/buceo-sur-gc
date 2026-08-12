import { centroInfo } from './documents/centroInfo'
import { certifyingAgency } from './documents/certifyingAgency'
import { course } from './documents/course'
import { diveSite } from './documents/diveSite'
import { experience } from './documents/experience'
import { sidemountCourse } from './documents/sidemountCourse'
import { tariffExtra } from './documents/tariffExtra'
import { localeList } from './objects/localeList'
import { localeSupplementList } from './objects/localeSupplementList'
import { localeString } from './objects/localeString'
import { localeStringOptional } from './objects/localeStringOptional'
import { localeText } from './objects/localeText'
import { supplementItem } from './objects/supplementItem'

export const schemaTypes = [
  localeString,
  localeStringOptional,
  localeText,
  localeList,
  supplementItem,
  localeSupplementList,
  certifyingAgency,
  course,
  sidemountCourse,
  experience,
  diveSite,
  tariffExtra,
  centroInfo,
]
