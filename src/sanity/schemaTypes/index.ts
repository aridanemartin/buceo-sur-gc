import { centroInfo } from './documents/centroInfo'
import { certifyingAgency } from './documents/certifyingAgency'
import { course } from './documents/course'
import { diveSite } from './documents/diveSite'
import { experience } from './documents/experience'
import { sidemountCourse } from './documents/sidemountCourse'
import { tariffExtra } from './documents/tariffExtra'
import { localeString } from './objects/localeString'
import { localeText } from './objects/localeText'

export const schemaTypes = [
  localeString,
  localeText,
  certifyingAgency,
  course,
  sidemountCourse,
  experience,
  diveSite,
  tariffExtra,
  centroInfo,
]
