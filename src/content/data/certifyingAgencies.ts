// Canonical certifying agency data — the 4 agencies previously hardcoded as
// course.agency's options list (SSI/CMAS/PADI/FSGT). Powers the seed script;
// logos/websites are filled in later via Sanity Studio.
export interface CertifyingAgencySeed {
  _id: string
  _type: 'certifyingAgency'
  name: string
}

export const certifyingAgenciesData: CertifyingAgencySeed[] = [
  { _id: 'certifying-agency-ssi', _type: 'certifyingAgency', name: 'SSI' },
  { _id: 'certifying-agency-cmas', _type: 'certifyingAgency', name: 'CMAS' },
  { _id: 'certifying-agency-padi', _type: 'certifyingAgency', name: 'PADI' },
  { _id: 'certifying-agency-fsgt', _type: 'certifyingAgency', name: 'FSGT' },
]

// Maps the old string values (still used by src/content/data/courses.ts and
// by any course document not yet migrated) to the matching document _id.
export const agencyIdByName: Record<string, string> = Object.fromEntries(
  certifyingAgenciesData.map((a) => [a.name, a._id]),
)
