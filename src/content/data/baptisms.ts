// Canonical baptism data (bautizos).
// Sourced from docs/3. Bautizos.md and docs/5. Tarifas.md.
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

export interface BaptismSeed {
  _id: string
  _type: 'baptism'
  title: LocaleValue
  description: LocaleValue
  duration: LocaleValue
  depthLimit?: number | null
  price?: number | null
  includes: LocaleListValue
  supplements: LocaleSupplementListValue
  // Rendered as the "Requisitos" check-list card (same as courses).
  requirements?: LocaleListValue
  // Direct link to the bookable product in Bukyapp. Left undefined for
  // baptisms Bukyapp doesn't sell online — BaptismsView falls back to a
  // contact-form link with a prefilled "interested in X" message.
  reservationLink?: string
  videoUrl?: string
  image?: string
  order: number
}

export const baptismsData: BaptismSeed[] = [
  {
    _id: 'experience-bautismo',
    _type: 'baptism',
    title: loc('El Bautismo', 'Discover Scuba Diving', 'Le Baptême', 'Schnuppertauchen'),
    description: loc(
      'Tu primera inmersión en el mar, sin experiencia previa. Una vez equipado, bucearás en una zona protegida pero llena de vida submarina: abre los ojos, tu instructor se encarga de todo. Por tu seguridad, dedicamos UN INSTRUCTOR POR BAUTIZO.',
      'Your first dive in the sea, no previous experience needed. Once equipped, you will dive in a protected area full of underwater life: open your eyes, your instructor takes care of everything. For your safety, we dedicate ONE INSTRUCTOR PER DISCOVER DIVE.',
      'Votre première plongée en mer, sans expérience préalable. Une fois équipé, vous plongerez dans une zone protégée mais pleine de vie sous-marine : ouvrez les yeux, votre instructeur s’occupe de tout. Pour votre sécurité, nous dédions UN INSTRUCTEUR PAR BAPTÊME.',
      'Ihr erster Tauchgang im Meer, ohne Vorkenntnisse. Ausgerüstet tauchen Sie in einem geschützten, aber lebendigen Gebiet: Augen auf, Ihr Ausbilder kümmert sich um alles. Für Ihre Sicherheit: EIN AUSBILDER PRO SCHNUPPERTAUCHGANG.',
    ),
    duration: loc(
      '1 inmersión / 2,5 h',
      '1 dive / 2.5 h',
      '1 plongée / 2,5 h',
      '1 Tauchgang / 2,5 Std.',
    ),
    depthLimit: 6,
    price: 80,
    includes: locList(
      [
        '1 inmersión en mar abierto, todo el equipo necesario y el seguro obligatorio',
        'Vamos a Risco Verde, ideal para principiantes con gran diversidad de vida',
      ],
      [
        '1 open water dive, all necessary equipment and mandatory insurance',
        'We go to Risco Verde, ideal for beginners with great marine-life diversity',
      ],
      [
        '1 plongée en mer ouverte, tout l’équipement nécessaire et l’assurance obligatoire',
        'Nous allons à Risco Verde, idéal pour les débutants avec une grande diversité de vie',
      ],
      [
        '1 Freiwassertauchgang, die gesamte notwendige Ausrüstung und die Pflichtversicherung',
        'Wir gehen nach Risco Verde, ideal für Anfänger mit großer Artenvielfalt',
      ],
    ),
    supplements: locSupplements(
      [{ label: 'Clip de vídeo', price: '25 €' }],
      [{ label: 'Video clip', price: '€25' }],
      [{ label: 'Clip vidéo', price: '25 €' }],
      [{ label: 'Videoclip', price: '25 €' }],
    ),
    requirements: locList(
      [
        'Más de 12 años',
        'Saber nadar',
        'Apto para bucear (certificado médico o cuestionario médico cumplimentado sin contraindicaciones)',
        'No tener vuelo el mismo día',
      ],
      [
        'Over 12 years old',
        'Able to swim',
        'Fit to dive (medical certificate or completed medical questionnaire with no contraindications)',
        'No flight the same day',
      ],
      [
        'Plus de 12 ans',
        'Savoir nager',
        'Apte à plonger (certificat médical ou questionnaire médical rempli sans contre-indication)',
        'Ne pas prendre l’avion le jour même',
      ],
      [
        'Über 12 Jahre alt',
        'Schwimmfähig',
        'Tauglich zum Tauchen (ärztliches Attest oder ausgefüllter medizinischer Fragebogen ohne Gegenanzeigen)',
        'Kein Flug am selben Tag',
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69b1475740d7e94c0efbc158',
    videoUrl: 'https://youtu.be/gGARKaie1_s?si=Du0qrp7Z883ECPks',
    order: 1,
  },
  {
    _id: 'experience-ssi-basic-diver',
    _type: 'baptism',
    title: loc(
      'Curso Iniciación Básico (SSI Basic Diver)',
      'Basic Initiation Course (SSI Basic Diver)',
      'Cours d’initiation basique (SSI Basic Diver)',
      'Grundkurs (SSI Basic Diver)',
    ),
    description: loc(
      'En una piscina natural al lado de la playa aprenderás los gestos básicos del buceo (comunicación, vaciar la máscara, manejar el chaleco…). Luego pondrás todo en práctica en una inmersión más profunda en aguas abiertas. UN INSTRUCTOR POR 2 BUCEADORES.',
      'In a natural pool next to the beach you will learn the basic skills of diving (communication, clearing your mask, managing your BCD…). Then you will put everything into practice on a deeper open water dive. ONE INSTRUCTOR PER 2 DIVERS.',
      'Dans une piscine naturelle à côté de la plage, vous apprendrez les gestes de base de la plongée (communication, vider le masque, gérer le gilet…). Ensuite, vous mettrez tout en pratique lors d’une plongée plus profonde en mer ouverte. UN INSTRUCTEUR POUR 2 PLONGEURS.',
      'In einem natürlichen Pool am Strand lernen Sie die Grundtechniken des Tauchens (Kommunikation, Maske ausblasen, Jacket bedienen…). Danach setzen Sie alles bei einem tieferen Freiwassertauchgang um. EIN AUSBILDER PRO 2 TAUCHER.',
    ),
    duration: loc(
      '2 inmersiones + teoría / 4 h',
      '2 dives + theory / 4 h',
      '2 plongées + théorie / 4 h',
      '2 Tauchgänge + Theorie / 4 Std.',
    ),
    depthLimit: 8,
    price: 120,
    includes: locList(
      [
        '1 inmersión técnica en piscina natural (Zoco-Negro, máx. 3 m)',
        '1 inmersión en mar abierto (Risco Verde, máx. 8 m)',
        'Teoría online SSI Basic Diver',
        'Carnet de buceo SSI Basic Diver',
        'Equipo de buceo',
        'Seguro de buceo y todo lo necesario',
      ],
      [
        '1 technical dive in a natural pool (Zoco-Negro, max. 3 m)',
        '1 open water dive (Risco Verde, max. 8 m)',
        'SSI Basic Diver online theory',
        'SSI Basic Diver certification card',
        'Diving equipment',
        'Dive insurance and everything needed',
      ],
      [
        '1 plongée technique en piscine naturelle (Zoco-Negro, max. 3 m)',
        '1 plongée en mer ouverte (Risco Verde, max. 8 m)',
        'Théorie en ligne SSI Basic Diver',
        'Carte de plongée SSI Basic Diver',
        'Équipement de plongée',
        'Assurance plongée et tout le nécessaire',
      ],
      [
        '1 technischer Tauchgang im Naturpool (Zoco-Negro, max. 3 m)',
        '1 Freiwassertauchgang (Risco Verde, max. 8 m)',
        'SSI-Basic-Diver-Online-Theorie',
        'SSI-Basic-Diver-Karte',
        'Tauchausrüstung',
        'Tauchversicherung und alles Notwendige',
      ],
    ),
    supplements: locSupplements(
      [{ label: 'Clip de vídeo', price: '25 €' }],
      [{ label: 'Video clip', price: '€25' }],
      [{ label: 'Clip vidéo', price: '25 €' }],
      [{ label: 'Videoclip', price: '25 €' }],
    ),
    requirements: locList(
      [
        'Más de 12 años',
        'Saber nadar',
        'Apto para bucear (certificado médico o cuestionario médico cumplimentado sin contraindicaciones)',
        'No tener vuelo el mismo día',
      ],
      [
        'Over 12 years old',
        'Able to swim',
        'Fit to dive (medical certificate or completed medical questionnaire with no contraindications)',
        'No flight the same day',
      ],
      [
        'Plus de 12 ans',
        'Savoir nager',
        'Apte à plonger (certificat médical ou questionnaire médical rempli sans contre-indication)',
        'Ne pas prendre l’avion le jour même',
      ],
      [
        'Über 12 Jahre alt',
        'Schwimmfähig',
        'Tauglich zum Tauchen (ärztliches Attest oder ausgefüllter medizinischer Fragebogen ohne Gegenanzeigen)',
        'Kein Flug am selben Tag',
      ],
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69b4566e40d7e94c0e14704a',
    videoUrl: 'https://youtu.be/j-qIyqbd0Z8?si=Kow4g7EBo5Uy4Vee',
    order: 2,
  },
]
