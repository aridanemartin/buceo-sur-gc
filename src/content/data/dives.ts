// Canonical dive data (inmersiones).
// Sourced from docs/2. inmersiones.md and docs/5. Tarifas.md.
export type LocaleValue = Partial<Record<'es' | 'en' | 'fr' | 'de', string>>
export type LocaleListValue = Partial<Record<'es' | 'en' | 'fr' | 'de', string[]>>

// A "Suplementos" row: concept + price as separate fields (so the front end
// can color them differently), instead of one "Concepto: precio" string.
export interface SupplementItem {
  label: string
  price: string
}
export type LocaleSupplementListValue = Partial<Record<'es' | 'en' | 'fr' | 'de', SupplementItem[]>>

const loc = (es: string, en: string, fr: string, de: string): LocaleValue => ({ es, en, fr, de })

// "Incluye" is rendered as a <ul><li> list, so each locale carries an array
// of short items instead of one prose string.
const locList = (es: string[], en: string[], fr: string[], de: string[]): LocaleListValue => ({
  es,
  en,
  fr,
  de,
})

const locSupplements = (
  es: SupplementItem[],
  en: SupplementItem[],
  fr: SupplementItem[],
  de: SupplementItem[],
): LocaleSupplementListValue => ({ es, en, fr, de })

export interface DiveSeed {
  _id: string
  _type: 'dive'
  title: LocaleValue
  isPackage?: boolean
  description: LocaleValue
  duration: LocaleValue
  depthLimit?: number | null
  price?: number | null
  includes: LocaleListValue
  supplements: LocaleSupplementListValue
  // Rendered as the "Requisitos" check-list card (same as courses).
  requirements?: LocaleListValue
  // Direct link to the bookable product in Bukyapp. Left undefined for
  // dives Bukyapp doesn't sell online — DivesView falls back to a
  // contact-form link with a prefilled "interested in X" message.
  reservationLink?: string
  videoUrl?: string
  image?: string
  order: number
}

export const divesData: DiveSeed[] = [
  {
    _id: 'experience-single-dive',
    _type: 'dive',
    title: loc('1 x Inmersión', '1 x Dive', '1 x Plongée', '1 x Tauchgang'),
    description: loc(
      'Una inmersión guiada por la tarde (zona Risco, Tufia, Cabrón o Sardina).',
      'A guided afternoon dive (Risco, Tufia, Cabrón or Sardina area).',
      'Une plongée encadrée l’après-midi (zone Risco, Tufia, Cabrón ou Sardina).',
      'Ein begleiteter Nachmittagstauchgang (Zone Risco, Tufia, Cabrón oder Sardina).',
    ),
    duration: loc(
      '1 inmersión (tarde)',
      '1 dive (afternoon)',
      '1 plongée (après-midi)',
      '1 Tauchgang (nachmittags)',
    ),
    depthLimit: null,
    price: 50,
    includes: locList(
      ['1 inmersión guiada', 'Plomos y botella incluidos'],
      ['1 guided dive', 'Weights and tank included'],
      ['1 plongée encadrée', 'Plombs et bouteille inclus'],
      ['1 begleiteter Tauchgang', 'Gewichte und Flasche inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico', price: '+10 €' },
        { label: 'Equipo completo (con ordenador)', price: '+15 €' },
      ],
      [
        { label: 'Basic equipment', price: '+€10' },
        { label: 'Full equipment (with computer)', price: '+€15' },
      ],
      [
        { label: 'Équipement de base', price: '+10 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+15 €' },
      ],
      [
        { label: 'Grundausrüstung', price: '+10 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+15 €' },
      ],
    ),
    requirements: locList(
      ['Mínimo 2 participantes'],
      ['Minimum 2 participants'],
      ['Minimum 2 participants'],
      ['Mindestens 2 Teilnehmer'],
    ),
    order: 3,
  },
  {
    _id: 'experience-double-dive',
    _type: 'dive',
    title: loc(
      'Doble Inmersión (1 día)',
      'Double Dive (1 day)',
      'Double Plongée (1 jour)',
      'Doppeltauchgang (1 Tag)',
    ),
    description: loc(
      'Dos inmersiones guiadas en un día (zona Risco, Tufia, Cabrón o Sardina).',
      'Two guided dives in one day (Risco, Tufia, Cabrón or Sardina area).',
      'Deux plongées encadrées en une journée (zone Risco, Tufia, Cabrón ou Sardina).',
      'Zwei begleitete Tauchgänge an einem Tag (Zone Risco, Tufia, Cabrón oder Sardina).',
    ),
    duration: loc(
      '2 inmersiones / 1 día',
      '2 dives / 1 day',
      '2 plongées / 1 jour',
      '2 Tauchgänge / 1 Tag',
    ),
    depthLimit: null,
    price: 75,
    includes: locList(
      ['2 inmersiones guiadas', 'Plomos y botellas incluidos'],
      ['2 guided dives', 'Weights and tanks included'],
      ['2 plongées encadrées', 'Plombs et bouteilles inclus'],
      ['2 begleitete Tauchgänge', 'Gewichte und Flaschen inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Barco (zona sur)', price: '+20 €' },
        { label: 'Equipo básico', price: '+20 €' },
        { label: 'Equipo completo (con ordenador)', price: '+25 €' },
      ],
      [
        { label: 'Boat (south zone)', price: '+€20' },
        { label: 'Basic equipment', price: '+€20' },
        { label: 'Full equipment (with computer)', price: '+€25' },
      ],
      [
        { label: 'Bateau (zone sud)', price: '+20 €' },
        { label: 'Équipement de base', price: '+20 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+25 €' },
      ],
      [
        { label: 'Boot (Südzone)', price: '+20 €' },
        { label: 'Grundausrüstung', price: '+20 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+25 €' },
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69b4584afc967e7d1fa9b887',
    order: 4,
  },
  {
    _id: 'experience-bono-4',
    _type: 'dive',
    title: loc(
      'Bono 4 Inmersiones (2 días)',
      '4-Dive Package (2 days)',
      'Pack 4 plongées (2 jours)',
      '4er-Tauchpaket (2 Tage)',
    ),
    description: loc(
      'Cuatro inmersiones guiadas en 2 días (zona Risco, Tufia, Cabrón o Sardina).',
      'Four guided dives over 2 days (Risco, Tufia, Cabrón or Sardina area).',
      'Quatre plongées encadrées sur 2 jours (zone Risco, Tufia, Cabrón ou Sardina).',
      'Vier begleitete Tauchgänge an 2 Tagen (Zone Risco, Tufia, Cabrón oder Sardina).',
    ),
    duration: loc(
      '4 inmersiones / 2 días',
      '4 dives / 2 days',
      '4 plongées / 2 jours',
      '4 Tauchgänge / 2 Tage',
    ),
    isPackage: true,
    depthLimit: null,
    price: 140,
    includes: locList(
      ['4 inmersiones guiadas', 'Plomos y botellas incluidos'],
      ['4 guided dives', 'Weights and tanks included'],
      ['4 plongées encadrées', 'Plombs et bouteilles inclus'],
      ['4 begleitete Tauchgänge', 'Gewichte und Flaschen inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Barco (zona sur)', price: '+20 €/día' },
        { label: 'Equipo básico', price: '+40 €' },
        { label: 'Equipo completo (con ordenador)', price: '+50 €' },
      ],
      [
        { label: 'Boat (south zone)', price: '+€20/day' },
        { label: 'Basic equipment', price: '+€40' },
        { label: 'Full equipment (with computer)', price: '+€50' },
      ],
      [
        { label: 'Bateau (zone sud)', price: '+20 €/jour' },
        { label: 'Équipement de base', price: '+40 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+50 €' },
      ],
      [
        { label: 'Boot (Südzone)', price: '+20 €/Tag' },
        { label: 'Grundausrüstung', price: '+40 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+50 €' },
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69b45d2cc2395a856d17a423',
    order: 5,
  },
  {
    _id: 'experience-bono-6',
    _type: 'dive',
    title: loc(
      'Bono 6 Inmersiones (3 días)',
      '6-Dive Package (3 days)',
      'Pack 6 plongées (3 jours)',
      '6er-Tauchpaket (3 Tage)',
    ),
    description: loc(
      'Seis inmersiones guiadas en total (4 en zona Risco, Tufia, Cabrón o Sardina + 2 en zona barco sur).',
      'Six guided dives in total (4 in the Risco, Tufia, Cabrón or Sardina area + 2 in the southern boat area).',
      'Six plongées encadrées au total (4 en zone Risco, Tufia, Cabrón ou Sardina + 2 en zone bateau sud).',
      'Sechs begleitete Tauchgänge insgesamt (4 in der Zone Risco, Tufia, Cabrón oder Sardina + 2 in der südlichen Bootszone).',
    ),
    duration: loc(
      '6 inmersiones / 3 días',
      '6 dives / 3 days',
      '6 plongées / 3 jours',
      '6 Tauchgänge / 3 Tage',
    ),
    isPackage: true,
    depthLimit: null,
    price: 230,
    includes: locList(
      ['6 inmersiones guiadas', 'Plomos y botellas incluidos'],
      ['6 guided dives', 'Weights and tanks included'],
      ['6 plongées encadrées', 'Plombs et bouteilles inclus'],
      ['6 begleitete Tauchgänge', 'Gewichte und Flaschen inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico', price: '+60 €' },
        { label: 'Equipo completo (con ordenador)', price: '+75 €' },
      ],
      [
        { label: 'Basic equipment', price: '+€60' },
        { label: 'Full equipment (with computer)', price: '+€75' },
      ],
      [
        { label: 'Équipement de base', price: '+60 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+75 €' },
      ],
      [
        { label: 'Grundausrüstung', price: '+60 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+75 €' },
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69e68a2cbe8564dc8a68eafe',
    order: 6,
  },
  {
    _id: 'experience-bono-8',
    _type: 'dive',
    title: loc(
      'Bono 8 Inmersiones (4 días)',
      '8-Dive Package (4 days)',
      'Pack 8 plongées (4 jours)',
      '8er-Tauchpaket (4 Tage)',
    ),
    description: loc(
      'Ocho inmersiones guiadas en total (6 en zona Risco, Tufia, Cabrón o Sardina + 2 en zona barco sur).',
      'Eight guided dives in total (6 in the Risco, Tufia, Cabrón or Sardina area + 2 in the southern boat area).',
      'Huit plongées encadrées au total (6 en zone Risco, Tufia, Cabrón ou Sardina + 2 en zone bateau sud).',
      'Acht begleitete Tauchgänge insgesamt (6 in der Zone Risco, Tufia, Cabrón oder Sardina + 2 in der südlichen Bootszone).',
    ),
    duration: loc(
      '8 inmersiones / 4 días',
      '8 dives / 4 days',
      '8 plongées / 4 jours',
      '8 Tauchgänge / 4 Tage',
    ),
    isPackage: true,
    depthLimit: null,
    price: 300,
    includes: locList(
      ['8 inmersiones guiadas', 'Plomos y botellas incluidos'],
      ['8 guided dives', 'Weights and tanks included'],
      ['8 plongées encadrées', 'Plombs et bouteilles inclus'],
      ['8 begleitete Tauchgänge', 'Gewichte und Flaschen inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico', price: '+80 €' },
        { label: 'Equipo completo (con ordenador)', price: '+100 €' },
      ],
      [
        { label: 'Basic equipment', price: '+€80' },
        { label: 'Full equipment (with computer)', price: '+€100' },
      ],
      [
        { label: 'Équipement de base', price: '+80 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+100 €' },
      ],
      [
        { label: 'Grundausrüstung', price: '+80 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+100 €' },
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69c1c12f5595aad44548a94e',
    order: 7,
  },
  {
    _id: 'experience-bono-10',
    _type: 'dive',
    title: loc(
      'Bono 10 Inmersiones (5 días)',
      '10-Dive Package (5 days)',
      'Pack 10 plongées (5 jours)',
      '10er-Tauchpaket (5 Tage)',
    ),
    description: loc(
      'Diez inmersiones guiadas en total (8 en zona Risco, Tufia, Cabrón o Sardina + 2 en zona barco sur).',
      'Ten guided dives in total (8 in the Risco, Tufia, Cabrón or Sardina area + 2 in the southern boat area).',
      'Dix plongées encadrées au total (8 en zone Risco, Tufia, Cabrón ou Sardina + 2 en zone bateau sud).',
      'Zehn begleitete Tauchgänge insgesamt (8 in der Zone Risco, Tufia, Cabrón oder Sardina + 2 in der südlichen Bootszone).',
    ),
    duration: loc(
      '10 inmersiones / 5 días',
      '10 dives / 5 days',
      '10 plongées / 5 jours',
      '10 Tauchgänge / 5 Tage',
    ),
    isPackage: true,
    depthLimit: null,
    price: 390,
    includes: locList(
      ['10 inmersiones guiadas', 'Plomos y botellas incluidos'],
      ['10 guided dives', 'Weights and tanks included'],
      ['10 plongées encadrées', 'Plombs et bouteilles inclus'],
      ['10 begleitete Tauchgänge', 'Gewichte und Flaschen inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico', price: '+100 €' },
        { label: 'Equipo completo (con ordenador)', price: '+120 €' },
      ],
      [
        { label: 'Basic equipment', price: '+€100' },
        { label: 'Full equipment (with computer)', price: '+€120' },
      ],
      [
        { label: 'Équipement de base', price: '+100 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+120 €' },
      ],
      [
        { label: 'Grundausrüstung', price: '+100 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+120 €' },
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/6a4d3d9d73dd28bfee51c9e5',
    order: 8,
  },
  {
    _id: 'experience-night-dive',
    _type: 'dive',
    title: loc('Inmersión Nocturna', 'Night Dive', 'Plongée de nuit', 'Nachttauchgang'),
    description: loc(
      'Una inmersión guiada nocturna para descubrir la fauna que sale después del atardecer.',
      'A guided night dive to discover the wildlife that comes out after sunset.',
      'Une plongée encadrée de nuit pour découvrir la faune qui sort après le coucher du soleil.',
      'Ein begleiteter Nachttauchgang, um die Tierwelt zu entdecken, die nach Sonnenuntergang aktiv wird.',
    ),
    duration: loc('1 inmersión nocturna', '1 night dive', '1 plongée de nuit', '1 Nachttauchgang'),
    depthLimit: null,
    price: 70,
    includes: locList(
      ['1 inmersión guiada nocturna', 'Plomos y botellas incluidos'],
      ['1 guided night dive', 'Weights and tank included'],
      ['1 plongée encadrée de nuit', 'Plombs et bouteille inclus'],
      ['1 begleiteter Nachttauchgang', 'Gewichte und Flasche inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Linterna', price: '+5 €' },
        { label: 'Equipo básico', price: '+10 €' },
        { label: 'Equipo completo (con ordenador)', price: '+25 €' },
      ],
      [
        { label: 'Torch', price: '+€5' },
        { label: 'Basic equipment', price: '+€10' },
        { label: 'Full equipment (with computer)', price: '+€25' },
      ],
      [
        { label: 'Lampe', price: '+5 €' },
        { label: 'Équipement de base', price: '+10 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+25 €' },
      ],
      [
        { label: 'Lampe', price: '+5 €' },
        { label: 'Grundausrüstung', price: '+10 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+25 €' },
      ],
    ),
    requirements: locList(
      ['Mínimo 2 participantes'],
      ['Minimum 2 participants'],
      ['Minimum 2 participants'],
      ['Mindestens 2 Teilnehmer'],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69e90e2b3875045b1ac20e68',
    order: 9,
  },
  {
    _id: 'experience-refresher',
    _type: 'dive',
    title: loc(
      'Inmersión de Repaso',
      'Refresher Dive',
      'Plongée de remise à niveau',
      'Auffrischungstauchgang',
    ),
    description: loc(
      'Una inmersión técnica de repaso para recuperar confianza y técnica antes de volver a bucear con normalidad.',
      'A technical refresher dive to rebuild confidence and skills before diving normally again.',
      'Une plongée technique de remise à niveau pour retrouver confiance et technique avant de replonger normalement.',
      'Ein technischer Auffrischungstauchgang, um Vertrauen und Technik wiederzugewinnen, bevor Sie wieder normal tauchen.',
    ),
    duration: loc(
      '1 inmersión de repaso',
      '1 refresher dive',
      '1 plongée de remise à niveau',
      '1 Auffrischungstauchgang',
    ),
    depthLimit: null,
    price: 80,
    includes: locList(
      ['1 inmersión técnica de repaso', 'Plomos y botella incluidos', 'Equipo básico incluido'],
      ['1 technical refresher dive', 'Weights and tank included', 'Basic equipment included'],
      [
        '1 plongée technique de remise à niveau',
        'Plombs et bouteille inclus',
        'Équipement de base inclus',
      ],
      [
        '1 technischer Auffrischungstauchgang',
        'Gewichte und Flasche inklusive',
        'Grundausrüstung inklusive',
      ],
    ),
    supplements: locSupplements(
      [{ label: 'Buceo adicional (mismo día)', price: '+40 €' }],
      [{ label: 'Additional dive (same day)', price: '+€40' }],
      [{ label: 'Plongée supplémentaire (même jour)', price: '+40 €' }],
      [{ label: 'Zusätzlicher Tauchgang (gleicher Tag)', price: '+40 €' }],
    ),
    requirements: locList(
      [
        'Máximo 2 buceadores por instructor',
        'Si tu última inmersión fue hace más de un año y has realizado menos de 10 inmersiones, te recomendamos un curso de actualización',
      ],
      [
        'Maximum 2 divers per instructor',
        'If your last dive was over a year ago and you have fewer than 10 dives, we recommend a refresher course',
      ],
      [
        'Maximum 2 plongeurs par instructeur',
        'Si votre dernière plongée date de plus d’un an et que vous avez moins de 10 plongées, nous recommandons un cours de remise à niveau',
      ],
      [
        'Maximal 2 Taucher pro Ausbilder',
        'Wenn Ihr letzter Tauchgang mehr als ein Jahr zurückliegt und Sie weniger als 10 Tauchgänge haben, empfehlen wir einen Auffrischungskurs',
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69e8b0339fad86498df4112b',
    order: 10,
  },
  {
    _id: 'experience-technical-training',
    _type: 'dive',
    title: loc(
      'Inmersión de Formación Técnica',
      'Technical Training Dive',
      'Plongée de formation technique',
      'Technischer Ausbildungstauchgang',
    ),
    description: loc(
      'Una inmersión técnica de curso para la validación de N1 sin agua abierta.',
      'A technical course dive for N1 validation without open water.',
      'Une plongée technique de formation pour la validation du N1 sans eau ouverte.',
      'Ein technischer Ausbildungstauchgang zur N1-Validierung ohne Freiwasser.',
    ),
    duration: loc(
      '1 inmersión técnica',
      '1 technical dive',
      '1 plongée technique',
      '1 technischer Tauchgang',
    ),
    depthLimit: null,
    price: 70,
    includes: locList(
      ['1 inmersión técnica de curso (validación de N1 sin agua abierta)'],
      ['1 technical course dive (N1 validation without open water)'],
      ['1 plongée technique de formation (validation N1 sans eau ouverte)'],
      ['1 technischer Ausbildungstauchgang (N1-Validierung ohne Freiwasser)'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico', price: '+10 €' },
        { label: 'Equipo completo (con ordenador)', price: '+15 €' },
      ],
      [
        { label: 'Basic equipment', price: '+€10' },
        { label: 'Full equipment (with computer)', price: '+€15' },
      ],
      [
        { label: 'Équipement de base', price: '+10 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+15 €' },
      ],
      [
        { label: 'Grundausrüstung', price: '+10 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+15 €' },
      ],
    ),
    requirements: locList(
      ['Máximo 2 buceadores por instructor'],
      ['Maximum 2 divers per instructor'],
      ['Maximum 2 plongeurs par instructeur'],
      ['Maximal 2 Taucher pro Ausbilder'],
    ),
    order: 11,
  },
  {
    _id: 'experience-deep-wreck',
    _type: 'dive',
    title: loc(
      'Inmersión Doble Especial Pecio Profundo (zona norte)',
      'Special Deep Wreck Double Dive (north zone)',
      'Double plongée spéciale épave profonde (zone nord)',
      'Spezieller Tieftauchgang Wrack (Nordzone)',
    ),
    description: loc(
      'Dos inmersiones guiadas en la zona norte (pecio coreano, Arona…).',
      'Two guided dives in the north zone (Korean wreck, Arona…).',
      'Deux plongées encadrées en zone nord (épave coréenne, Arona…).',
      'Zwei begleitete Tauchgänge in der Nordzone (koreanisches Wrack, Arona…).',
    ),
    duration: loc(
      '2 inmersiones guiadas',
      '2 guided dives',
      '2 plongées encadrées',
      '2 begleitete Tauchgänge',
    ),
    depthLimit: null,
    price: 115,
    includes: locList(
      ['2 inmersiones guiadas zona norte', 'Botellas, plomos y Nitrox incluidos'],
      ['2 guided dives in the north zone', 'Tanks, weights and Nitrox included'],
      ['2 plongées encadrées zone nord', 'Bouteilles, plombs et Nitrox inclus'],
      ['2 begleitete Tauchgänge Nordzone', 'Flaschen, Gewichte und Nitrox inklusive'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico', price: '+20 €' },
        { label: 'Equipo completo (con ordenador)', price: '+25 €' },
      ],
      [
        { label: 'Basic equipment', price: '+€20' },
        { label: 'Full equipment (with computer)', price: '+€25' },
      ],
      [
        { label: 'Équipement de base', price: '+20 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+25 €' },
      ],
      [
        { label: 'Grundausrüstung', price: '+20 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+25 €' },
      ],
    ),
    requirements: locList(
      ['Mínimo 4 participantes y condiciones meteorológicas muy favorables, con aprobación previa del director técnico'],
      ['Minimum 4 participants and very favourable weather conditions, subject to prior approval of the technical director'],
      ['Minimum 4 participants et conditions météo très favorables, avec approbation préalable du directeur technique'],
      ['Mindestens 4 Teilnehmer und sehr günstige Wetterbedingungen, mit vorheriger Genehmigung des technischen Leiters'],
    ),
    order: 12,
  },
]
