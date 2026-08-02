// Canonical tariff-extra data, sourced from docs/5. Tarifas.docx (docx takes precedence).
export type LocaleValue = Partial<Record<'es' | 'en' | 'fr' | 'de', string>>

const loc = (es: string, en: string, fr: string, de: string): LocaleValue => ({ es, en, fr, de })

export interface TariffExtraSeed {
  _id: string
  _type: 'tariffExtra'
  title: LocaleValue
  description: LocaleValue
  price: number
  unit: LocaleValue
  order: number
}

export const tariffExtrasData: TariffExtraSeed[] = [
  {
    _id: 'tariff-nitrox-32',
    _type: 'tariffExtra',
    title: loc('Nitrox 32', 'Nitrox 32', 'Nitrox 32', 'Nitrox 32'),
    description: loc('', '', '', ''),
    price: 8,
    unit: loc('por botella', 'per tank', 'par bouteille', 'pro Flasche'),
    order: 1,
  },
  {
    _id: 'tariff-bottle-15l',
    _type: 'tariffExtra',
    title: loc('Botellas de 15 L', '15 L tanks', 'Bouteilles de 15 L', '15-L-Flaschen'),
    description: loc('', '', '', ''),
    price: 2,
    unit: loc('por botella', 'per tank', 'par bouteille', 'pro Flasche'),
    order: 2,
  },
  {
    _id: 'tariff-seguro-1-dia',
    _type: 'tariffExtra',
    title: loc(
      'Seguro de buceo 1 día',
      '1-day dive insurance',
      'Assurance plongée 1 jour',
      'Tauchversicherung 1 Tag',
    ),
    description: loc('', '', '', ''),
    price: 8,
    unit: loc('por día', 'per day', 'par jour', 'pro Tag'),
    order: 3,
  },
  {
    _id: 'tariff-seguro-1-semana',
    _type: 'tariffExtra',
    title: loc(
      'Seguro de buceo 1 semana',
      '1-week dive insurance',
      'Assurance plongée 1 semaine',
      'Tauchversicherung 1 Woche',
    ),
    description: loc('', '', '', ''),
    price: 20,
    unit: loc('por semana', 'per week', 'par semaine', 'pro Woche'),
    order: 4,
  },
  {
    _id: 'tariff-seguro-2-semanas',
    _type: 'tariffExtra',
    title: loc(
      'Seguro de buceo 2 semanas',
      '2-week dive insurance',
      'Assurance plongée 2 semaines',
      'Tauchversicherung 2 Wochen',
    ),
    description: loc('', '', '', ''),
    price: 38,
    unit: loc('por 2 semanas', 'per 2 weeks', 'par 2 semaines', 'pro 2 Wochen'),
    order: 5,
  },
  {
    _id: 'tariff-seguro-1-mes',
    _type: 'tariffExtra',
    title: loc(
      'Seguro de buceo 1 mes',
      '1-month dive insurance',
      'Assurance plongée 1 mois',
      'Tauchversicherung 1 Monat',
    ),
    description: loc('', '', '', ''),
    price: 45,
    unit: loc('por mes', 'per month', 'par mois', 'pro Monat'),
    order: 6,
  },
]
