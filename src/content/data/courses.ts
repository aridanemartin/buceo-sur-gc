// Canonical course data, sourced from docs/5. Tarifas.md.
// All prices, durations, dive counts and supplements come directly from that document.
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

export interface CourseSeed {
  _id: string
  _type: 'course'
  title: LocaleValue
  agency: string
  category: string
  image?: string
  summary: LocaleValue
  // Rendered as a check-mark list inside its own card, parallel to "includes".
  requirements: LocaleListValue
  depthLimit?: number | null
  duration: LocaleValue
  minAge?: number | null
  price?: number | null
  includes: LocaleListValue
  supplements: LocaleSupplementListValue
  groupDiscount?: LocaleValue
  // Direct link to the bookable product in Bukyapp. Left undefined for
  // courses Bukyapp doesn't sell online — CoursesView falls back to a
  // contact-form link with a prefilled "interested in X" message.
  reservationLink?: string
  order: number
}

export const coursesData: CourseSeed[] = [
  // ---------- SSI Para Principiantes ----------
  {
    _id: 'course-scuba-diver',
    _type: 'course',
    title: loc(
      'Scuba Diver - 12 m',
      'Scuba Diver - 12 m',
      'Scuba Diver - 12 m',
      'Scuba Diver - 12 m',
    ),
    agency: 'SSI',
    category: 'recreational',
    summary: loc(
      'Iniciación a la autonomía bajo supervisión, hasta 12 m de profundidad.',
      'Introduction to supervised autonomous diving, down to 12 m.',
      "Initiation à l'autonomie encadrée, jusqu'à 12 m.",
      'Einstieg in das begleitete autonome Tauchen bis 12 m.',
    ),
    requirements: locList(
      ['Certificado médico o cuestionario médico sin contraindicaciones', 'No volar el mismo día'],
      ['Medical certificate or medical questionnaire without contraindications', 'No flying the same day'],
      ['Certificat médical ou questionnaire médical sans contre-indication', 'Ne pas voler le jour même'],
      ['Ärztliches Attest oder medizinischer Fragebogen ohne Gegenanzeigen', 'Am selben Tag nicht fliegen'],
    ),
    depthLimit: 12,
    duration: loc('2 días', '2 days', '2 jours', '2 Tage'),
    minAge: 12,
    price: 290,
    includes: locList(
      ['3 inmersiones de curso', 'equipos y seguro de buceo', 'kit E-learning SSI y carnet digital'],
      ['3 course dives', 'equipment and dive insurance', 'SSI e-learning kit and digital certification card'],
      [
        '3 plongées de formation',
        'équipement et assurance plongée',
        'kit e-learning SSI et carte numérique',
      ],
      ['3 Kurs-Tauchgänge', 'Ausrüstung und Tauchversicherung', 'SSI-E-Learning-Kit und digitale Karte'],
    ),
    supplements: locSupplements(
      [
        { label: 'Clip de vídeo', price: '25 €' },
        { label: 'Buceo adicional', price: '40 €' },
      ],
      [
        { label: 'Video clip', price: '€25' },
        { label: 'Additional dive', price: '€40' },
      ],
      [
        { label: 'Clip vidéo', price: '25 €' },
        { label: 'Plongée supplémentaire', price: '40 €' },
      ],
      [
        { label: 'Videoclip', price: '25 €' },
        { label: 'Zusätzlicher Tauchgang', price: '40 €' },
      ],
    ),
    groupDiscount: loc(
      'Máximo 1 instructor por 3 estudiantes.',
      'Maximum 1 instructor per 3 students.',
      'Maximum 1 instructeur pour 3 élèves.',
      'Maximal 1 Ausbilder pro 3 Schüler.',
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69c27a375595aad4454bc062',
    order: 1,
  },
  {
    _id: 'course-open-water',
    _type: 'course',
    title: loc(
      'Open Water Diver - 18 m',
      'Open Water Diver - 18 m',
      'Open Water Diver - 18 m',
      'Open Water Diver - 18 m',
    ),
    agency: 'SSI',
    category: 'recreational',
    summary: loc(
      'La certificación de buceo autónomo más reconocida internacionalmente, hasta 18 m.',
      'The most widely recognised autonomous diving certification, down to 18 m.',
      "La certification de plongée autonome la plus reconnue à l'international, jusqu'à 18 m.",
      'Die international anerkannteste Zertifizierung für selbstständiges Tauchen bis 18 m.',
    ),
    requirements: locList(
      ['Certificado médico o cuestionario médico sin contraindicaciones', 'No volar el mismo día'],
      ['Medical certificate or medical questionnaire without contraindications', 'No flying the same day'],
      ['Certificat médical ou questionnaire médical sans contre-indication', 'Ne pas voler le jour même'],
      ['Ärztliches Attest oder medizinischer Fragebogen ohne Gegenanzeigen', 'Am selben Tag nicht fliegen'],
    ),
    depthLimit: 18,
    duration: loc('3 días', '3 days', '3 jours', '3 Tage'),
    minAge: 12,
    price: 470,
    includes: locList(
      ['6 inmersiones de curso', 'equipos y seguro de buceo', 'kit E-learning SSI y carnet digital'],
      ['6 course dives', 'equipment and dive insurance', 'SSI e-learning kit and digital certification card'],
      [
        '6 plongées de formation',
        'équipement et assurance plongée',
        'kit e-learning SSI et carte numérique',
      ],
      ['6 Kurs-Tauchgänge', 'Ausrüstung und Tauchversicherung', 'SSI-E-Learning-Kit und digitale Karte'],
    ),
    supplements: locSupplements(
      [
        { label: 'Clip de vídeo', price: '25 €' },
        { label: 'Buceo doble adicional', price: '80 €' },
      ],
      [
        { label: 'Video clip', price: '€25' },
        { label: 'Additional double dive', price: '€80' },
      ],
      [
        { label: 'Clip vidéo', price: '25 €' },
        { label: 'Plongée double supplémentaire', price: '80 €' },
      ],
      [
        { label: 'Videoclip', price: '25 €' },
        { label: 'Zusätzlicher Doppeltauchgang', price: '80 €' },
      ],
    ),
    groupDiscount: loc(
      'Máximo 1 instructor por 3 estudiantes.',
      'Maximum 1 instructor per 3 students.',
      'Maximum 1 instructeur pour 3 élèves.',
      'Maximal 1 Ausbilder pro 3 Schüler.',
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/69b45e24c2395a856d17af85',
    order: 2,
  },
  // ---------- SSI Especialidades y avanzado ----------
  {
    _id: 'course-advanced-open-water',
    _type: 'course',
    title: loc(
      'Advanced Open Water Diver - 30 m',
      'Advanced Open Water Diver - 30 m',
      'Advanced Open Water Diver - 30 m',
      'Advanced Open Water Diver - 30 m',
    ),
    agency: 'SSI',
    category: 'recreational',
    summary: loc(
      'Amplía tu autonomía hasta 30 m explorando tres especialidades a tu elección.',
      'Extend your range down to 30 m while exploring three specialties of your choice.',
      "Étendez votre autonomie jusqu'à 30 m en explorant trois spécialités de votre choix.",
      'Erweitern Sie Ihre Tauchtiefe bis 30 m mit drei Spezialgebieten Ihrer Wahl.',
    ),
    requirements: locList(
      ['Certificado médico o cuestionario médico', 'Certificación Open Water', '10 inmersiones registradas'],
      ['Medical certificate or questionnaire', 'Open Water certification', '10 logged dives'],
      ['Certificat médical ou questionnaire', 'Certification Open Water', '10 plongées enregistrées'],
      ['Ärztliches Attest oder Fragebogen', 'Open-Water-Zertifizierung', '10 protokollierte Tauchgänge'],
    ),
    depthLimit: 30,
    duration: loc('3 días', '3 days', '3 jours', '3 Tage'),
    minAge: 12,
    price: 290,
    includes: locList(
      ['5 inmersiones de curso', 'kit E-learning SSI y carnet digital'],
      ['5 course dives', 'SSI e-learning kit and digital certification card'],
      ['5 plongées de formation', 'kit e-learning SSI et carte numérique'],
      ['5 Kurs-Tauchgänge', 'SSI-E-Learning-Kit und digitale Karte'],
    ),
    supplements: locSupplements(
      [
        { label: 'Buceo adicional', price: '40 €' },
        { label: 'Equipos', price: '40 €' },
        { label: 'Seguro', price: '20 €' },
      ],
      [
        { label: 'Additional dive', price: '€40' },
        { label: 'Equipment', price: '€40' },
        { label: 'Insurance', price: '€20' },
      ],
      [
        { label: 'Plongée supplémentaire', price: '40 €' },
        { label: 'Équipement', price: '40 €' },
        { label: 'Assurance', price: '20 €' },
      ],
      [
        { label: 'Zusätzlicher Tauchgang', price: '40 €' },
        { label: 'Ausrüstung', price: '40 €' },
        { label: 'Versicherung', price: '20 €' },
      ],
    ),
    groupDiscount: loc('', '', '', ''),
    order: 3,
  },
  {
    _id: 'course-deep-diving',
    _type: 'course',
    title: loc(
      'Especialidad Buceo Profundo - hasta 40 m',
      'Deep Diving Specialty - up to 40 m',
      'Spécialité Plongée profonde - jusqu’à 40 m',
      'Deep-Diving-Spezialkurs - bis 40 m',
    ),
    agency: 'SSI',
    category: 'specialty',
    summary: loc(
      'Tres inmersiones de curso hasta 40 m sin paradas de descompresión.',
      'Three course dives down to 40 m with no decompression stops.',
      'Trois plongées de formation jusqu’à 40 m sans paliers de décompression.',
      'Drei Kurs-Tauchgänge bis 40 m ohne Dekompressionsstopps.',
    ),
    requirements: locList(
      ['Open Water', '15 inmersiones recomendadas'],
      ['Open Water', '15 dives recommended'],
      ['Open Water', '15 plongées recommandées'],
      ['Open Water', '15 Tauchgänge empfohlen'],
    ),
    depthLimit: 40,
    duration: loc('2 días', '2 days', '2 jours', '2 Tage'),
    minAge: 12,
    price: 290,
    includes: locList(
      ['3 inmersiones de curso', 'kit E-learning SSI y carnet digital'],
      ['3 course dives', 'SSI e-learning kit and digital certification card'],
      ['3 plongées de formation', 'kit e-learning SSI et carte numérique'],
      ['3 Kurs-Tauchgänge', 'SSI-E-Learning-Kit und digitale Karte'],
    ),
    supplements: locSupplements(
      [
        { label: 'Buceo adicional', price: '40 €' },
        { label: 'Equipo básico (sin ordenador)', price: '+30 €' },
        { label: 'Equipo completo (con ordenador)', price: '+40 €' },
      ],
      [
        { label: 'Additional dive', price: '€40' },
        { label: 'Basic equipment (no computer)', price: '+€30' },
        { label: 'Full equipment (with computer)', price: '+€40' },
      ],
      [
        { label: 'Plongée supplémentaire', price: '40 €' },
        { label: 'Équipement de base (sans ordinateur)', price: '+30 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+40 €' },
      ],
      [
        { label: 'Zusätzlicher Tauchgang', price: '40 €' },
        { label: 'Grundausrüstung (ohne Computer)', price: '+30 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+40 €' },
      ],
    ),
    groupDiscount: loc('', '', '', ''),
    order: 4,
  },
  {
    _id: 'course-nitrox',
    _type: 'course',
    title: loc(
      'Especialidad Nitrox 32',
      'Nitrox 32 Specialty',
      'Spécialité Nitrox 32',
      'Nitrox-32-Spezialkurs',
    ),
    agency: 'SSI',
    category: 'specialty',
    summary: loc(
      'Aprende a bucear con aire enriquecido al 32% y amplía tu margen de seguridad.',
      'Learn to dive with 32% enriched air and widen your safety margin.',
      "Apprenez à plonger à l'air enrichi à 32 % et élargissez votre marge de sécurité.",
      'Tauchen mit 32 % angereicherter Luft lernen und die Sicherheitsmarge vergrößern.',
    ),
    requirements: locList(
      ['Certificación Open Water'],
      ['Open Water certification'],
      ['Certification Open Water'],
      ['Open-Water-Zertifizierung'],
    ),
    depthLimit: null,
    duration: loc('1 día', '1 day', '1 jour', '1 Tag'),
    minAge: 12,
    price: 160,
    includes: locList(
      ['2 inmersiones de curso', 'kit E-learning SSI y carnet digital'],
      ['2 course dives', 'SSI e-learning kit and digital certification card'],
      ['2 plongées de formation', 'kit e-learning SSI et carte numérique'],
      ['2 Kurs-Tauchgänge', 'SSI-E-Learning-Kit und digitale Karte'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico (sin ordenador)', price: '+20 €' },
        { label: 'Equipo completo (con ordenador)', price: '+25 €' },
        { label: 'Seguro 1 día', price: '8 €' },
      ],
      [
        { label: 'Basic equipment (no computer)', price: '+€20' },
        { label: 'Full equipment (with computer)', price: '+€25' },
        { label: '1-day insurance', price: '€8' },
      ],
      [
        { label: 'Équipement de base (sans ordinateur)', price: '+20 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+25 €' },
        { label: 'Assurance 1 jour', price: '8 €' },
      ],
      [
        { label: 'Grundausrüstung (ohne Computer)', price: '+20 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+25 €' },
        { label: 'Versicherung 1 Tag', price: '8 €' },
      ],
    ),
    groupDiscount: loc('', '', '', ''),
    order: 5,
  },
  {
    _id: 'course-deco',
    _type: 'course',
    title: loc(
      'Especialidad Buceo con Descompresión',
      'Decompression Diving Specialty',
      'Spécialité Plongée avec décompression',
      'Dekompressions-Spezialkurs',
    ),
    agency: 'SSI',
    category: 'specialty',
    summary: loc(
      'Cuatro inmersiones de curso hasta 40 m con gestión de la descompresión.',
      'Four course dives down to 40 m with decompression management.',
      'Quatre plongées de formation jusqu’à 40 m avec gestion de la décompression.',
      'Vier Kurs-Tauchgänge bis 40 m mit Dekompressionsmanagement.',
    ),
    requirements: locList(
      ['Open Water avanzado', '24 inmersiones registradas', 'Especialidad Buceo Profundo'],
      ['Advanced Open Water', '24 logged dives', 'Deep Diving specialty'],
      ['Open Water avancé', '24 plongées enregistrées', 'Spécialité Plongée profonde'],
      ['Advanced Open Water', '24 protokollierte Tauchgänge', 'Deep-Diving-Spezialkurs'],
    ),
    depthLimit: 40,
    duration: loc('3 días', '3 days', '3 jours', '3 Tage'),
    minAge: 16,
    price: 460,
    includes: locList(
      ['4 inmersiones de curso', 'kit E-learning SSI y carnet digital'],
      ['4 course dives', 'SSI e-learning kit and digital certification card'],
      ['4 plongées de formation', 'kit e-learning SSI et carte numérique'],
      ['4 Kurs-Tauchgänge', 'SSI-E-Learning-Kit und digitale Karte'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico (sin ordenador)', price: '+20 €' },
        { label: 'Equipo completo (con ordenador)', price: '+25 €' },
        { label: 'Seguro 1 semana', price: '20 €' },
      ],
      [
        { label: 'Basic equipment (no computer)', price: '+€20' },
        { label: 'Full equipment (with computer)', price: '+€25' },
        { label: '1-week insurance', price: '€20' },
      ],
      [
        { label: 'Équipement de base (sans ordinateur)', price: '+20 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+25 €' },
        { label: 'Assurance 1 semaine', price: '20 €' },
      ],
      [
        { label: 'Grundausrüstung (ohne Computer)', price: '+20 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+25 €' },
        { label: 'Versicherung 1 Woche', price: '20 €' },
      ],
    ),
    groupDiscount: loc('', '', '', ''),
    order: 6,
  },
  {
    _id: 'course-navigation',
    _type: 'course',
    title: loc(
      'Especialidad Orientación',
      'Navigation Specialty',
      'Spécialité Orientation',
      'Navigations-Spezialkurs',
    ),
    agency: 'SSI',
    category: 'specialty',
    summary: loc(
      'Tres inmersiones de curso para dominar la orientación natural y con brújula.',
      'Three course dives to master natural and compass navigation.',
      'Trois plongées de formation pour maîtriser l’orientation naturelle et au compas.',
      'Drei Kurs-Tauchgänge zur natürlichen und Kompass-Navigation.',
    ),
    requirements: locList(
      ['Certificación Open Water'],
      ['Open Water certification'],
      ['Certification Open Water'],
      ['Open-Water-Zertifizierung'],
    ),
    depthLimit: 40,
    duration: loc('2 días', '2 days', '2 jours', '2 Tage'),
    minAge: 12,
    price: 260,
    includes: locList(
      ['3 inmersiones de curso', 'kit E-learning SSI y carnet digital'],
      ['3 course dives', 'SSI e-learning kit and digital certification card'],
      ['3 plongées de formation', 'kit e-learning SSI et carte numérique'],
      ['3 Kurs-Tauchgänge', 'SSI-E-Learning-Kit und digitale Karte'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico (sin ordenador)', price: '+40 €' },
        { label: 'Equipo completo (con ordenador)', price: '+50 €' },
        { label: 'Seguro 2 días', price: '16 €' },
      ],
      [
        { label: 'Basic equipment (no computer)', price: '+€40' },
        { label: 'Full equipment (with computer)', price: '+€50' },
        { label: '2-day insurance', price: '€16' },
      ],
      [
        { label: 'Équipement de base (sans ordinateur)', price: '+40 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+50 €' },
        { label: 'Assurance 2 jours', price: '16 €' },
      ],
      [
        { label: 'Grundausrüstung (ohne Computer)', price: '+40 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+50 €' },
        { label: 'Versicherung 2 Tage', price: '16 €' },
      ],
    ),
    groupDiscount: loc('', '', '', ''),
    order: 7,
  },
  {
    _id: 'course-rescue',
    _type: 'course',
    title: loc(
      'Especialidad Rescate “Stress and Rescue”',
      'Rescue Specialty “Stress and Rescue”',
      'Spécialité Sauvetage « Stress and Rescue »',
      'Rettungs-Spezialkurs “Stress and Rescue”',
    ),
    agency: 'SSI',
    category: 'specialty',
    summary: loc(
      'Cuatro inmersiones de curso centradas en la prevención del estrés y el rescate.',
      'Four course dives focused on stress prevention and rescue.',
      'Quatre plongées de formation axées sur la prévention du stress et le sauvetage.',
      'Vier Kurs-Tauchgänge zur Stressprävention und Rettung.',
    ),
    requirements: locList(
      ['Certificación Open Water'],
      ['Open Water certification'],
      ['Certification Open Water'],
      ['Open-Water-Zertifizierung'],
    ),
    depthLimit: null,
    duration: loc('2 días', '2 days', '2 jours', '2 Tage'),
    minAge: 12,
    price: 350,
    includes: locList(
      ['4 inmersiones de curso', 'kit E-learning SSI y carnet digital'],
      ['4 course dives', 'SSI e-learning kit and digital certification card'],
      ['4 plongées de formation', 'kit e-learning SSI et carte numérique'],
      ['4 Kurs-Tauchgänge', 'SSI-E-Learning-Kit und digitale Karte'],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico (sin ordenador)', price: '+40 €' },
        { label: 'Equipo completo (con ordenador)', price: '+50 €' },
        { label: 'Seguro 2 días', price: '16 €' },
      ],
      [
        { label: 'Basic equipment (no computer)', price: '+€40' },
        { label: 'Full equipment (with computer)', price: '+€50' },
        { label: '2-day insurance', price: '€16' },
      ],
      [
        { label: 'Équipement de base (sans ordinateur)', price: '+40 €' },
        { label: 'Équipement complet (avec ordinateur)', price: '+50 €' },
        { label: 'Assurance 2 jours', price: '16 €' },
      ],
      [
        { label: 'Grundausrüstung (ohne Computer)', price: '+40 €' },
        { label: 'Komplettausrüstung (mit Computer)', price: '+50 €' },
        { label: 'Versicherung 2 Tage', price: '16 €' },
      ],
    ),
    groupDiscount: loc('', '', '', ''),
    order: 8,
  },
  {
    _id: 'course-react-right',
    _type: 'course',
    title: loc(
      'Especialidad Primeros Auxilios “React Right”',
      'First Aid Specialty “React Right”',
      'Spécialité Premiers secours « React Right »',
      'Erste-Hilfe-Spezialkurs “React Right”',
    ),
    agency: 'SSI',
    category: 'specialty',
    summary: loc(
      'Taller de rescate y primeros auxilios sin inmersión.',
      'Rescue and first aid workshop without diving.',
      'Atelier de sauvetage et de premiers secours sans plongée.',
      'Rettungs- und Erste-Hilfe-Workshop ohne Tauchen.',
    ),
    requirements: locList(['Ninguno.'], ['None.'], ['Aucun.'], ['Keine.']),
    depthLimit: null,
    duration: loc('1 día', '1 day', '1 jour', '1 Tag'),
    minAge: 12,
    price: 140,
    includes: locList(
      ['Prácticas sin buceo', 'taller de rescate'],
      ['No-dive practical session', 'rescue workshop'],
      ['Exercices sans plongée', 'atelier de sauvetage'],
      ['Übungen ohne Tauchen', 'Rettungsworkshop'],
    ),
    supplements: locSupplements([], [], [], []),
    groupDiscount: loc('', '', '', ''),
    order: 9,
  },
  // ---------- CMAS Para Principiantes (Ecole de plongée Française) ----------
  {
    _id: 'course-pe12',
    _type: 'course',
    title: loc(
      'Buzo supervisado 12 m (PE12)',
      'Supervised Diver 12 m (PE12)',
      'Plongeur encadré 12 m (PE12)',
      'Begleiteter Taucher 12 m (PE12)',
    ),
    agency: 'CMAS',
    category: 'recreational',
    summary: loc(
      'Iniciación CMAS bajo supervisión, hasta 12 m. Cursos reconocidos internacionalmente por la CMAS.',
      'CMAS initiation under supervision, down to 12 m. Courses recognised internationally by CMAS.',
      'Initiation CMAS encadrée, jusqu’à 12 m. Formations reconnues internationalement par la CMAS.',
      'CMAS-Einstieg unter Aufsicht bis 12 m. International von der CMAS anerkannte Kurse.',
    ),
    requirements: locList(
      ['Certificado médico o cuestionario médico sin contraindicaciones', 'No volar el mismo día'],
      ['Medical certificate or medical questionnaire without contraindications', 'No flying the same day'],
      ['Certificat médical ou questionnaire médical sans contre-indication', 'Ne pas voler le jour même'],
      ['Ärztliches Attest oder medizinischer Fragebogen ohne Gegenanzeigen', 'Am selben Tag nicht fliegen'],
    ),
    depthLimit: 12,
    duration: loc('2 días', '2 days', '2 jours', '2 Tage'),
    minAge: 12,
    price: 260,
    includes: locList(
      [
        '3 inmersiones de curso',
        'equipos y seguro de buceo',
        'formación teórica presencial (2 h) y carnet digital',
      ],
      [
        '3 course dives',
        'equipment and dive insurance',
        'classroom theory (2 h) and digital certification card',
      ],
      [
        '3 plongées de formation',
        'équipement et assurance plongée',
        'formation théorique en présentiel (2 h) et carte numérique',
      ],
      [
        '3 Kurs-Tauchgänge',
        'Ausrüstung und Tauchversicherung',
        'Präsenztheorie (2 Std.) und digitale Karte',
      ],
    ),
    supplements: locSupplements(
      [
        { label: 'Clip de vídeo', price: '25 €' },
        { label: 'Buceo adicional', price: '40 €' },
      ],
      [
        { label: 'Video clip', price: '€25' },
        { label: 'Additional dive', price: '€40' },
      ],
      [
        { label: 'Clip vidéo', price: '25 €' },
        { label: 'Plongée supplémentaire', price: '40 €' },
      ],
      [
        { label: 'Videoclip', price: '25 €' },
        { label: 'Zusätzlicher Tauchgang', price: '40 €' },
      ],
    ),
    groupDiscount: loc(
      'Máximo 1 instructor por 3 estudiantes.',
      'Maximum 1 instructor per 3 students.',
      'Maximum 1 instructeur pour 3 élèves.',
      'Maximal 1 Ausbilder pro 3 Schüler.',
    ),
    order: 10,
  },
  {
    _id: 'course-pe20',
    _type: 'course',
    title: loc(
      'Nivel 1 - Buzo supervisado 20 m (PE20)',
      'Level 1 - Supervised Diver 20 m (PE20)',
      'Niveau 1 - Plongeur encadré 20 m (PE20)',
      'Niveau 1 - Begleiteter Taucher 20 m (PE20)',
    ),
    agency: 'CMAS',
    category: 'recreational',
    summary: loc(
      'Primera certificación CMAS que permite bucear hasta 20 m con supervisión.',
      'First CMAS certification allowing supervised diving down to 20 m.',
      'Première certification CMAS permettant de plonger jusqu’à 20 m encadré.',
      'Erste CMAS-Zertifizierung für begleitetes Tauchen bis 20 m.',
    ),
    requirements: locList(
      ['Certificado médico o cuestionario médico sin contraindicaciones', 'No volar el mismo día'],
      ['Medical certificate or medical questionnaire without contraindications', 'No flying the same day'],
      ['Certificat médical ou questionnaire médical sans contre-indication', 'Ne pas voler le jour même'],
      ['Ärztliches Attest oder medizinischer Fragebogen ohne Gegenanzeigen', 'Am selben Tag nicht fliegen'],
    ),
    depthLimit: 20,
    duration: loc('3 días', '3 days', '3 jours', '3 Tage'),
    minAge: 12,
    price: 420,
    includes: locList(
      [
        '5 inmersiones de curso',
        'equipos y seguro de buceo',
        'formación teórica presencial (4 h) y carnet digital',
      ],
      [
        '5 course dives',
        'equipment and dive insurance',
        'classroom theory (4 h) and digital certification card',
      ],
      [
        '5 plongées de formation',
        'équipement et assurance plongée',
        'formation théorique en présentiel (4 h) et carte numérique',
      ],
      [
        '5 Kurs-Tauchgänge',
        'Ausrüstung und Tauchversicherung',
        'Präsenztheorie (4 Std.) und digitale Karte',
      ],
    ),
    supplements: locSupplements(
      [
        { label: 'Clip de vídeo', price: '25 €' },
        { label: 'Buceo doble adicional', price: '80 €' },
      ],
      [
        { label: 'Video clip', price: '€25' },
        { label: 'Additional double dive', price: '€80' },
      ],
      [
        { label: 'Clip vidéo', price: '25 €' },
        { label: 'Plongée double supplémentaire', price: '80 €' },
      ],
      [
        { label: 'Videoclip', price: '25 €' },
        { label: 'Zusätzlicher Doppeltauchgang', price: '80 €' },
      ],
    ),
    groupDiscount: loc(
      'Máximo 1 instructor por 3 estudiantes.',
      'Maximum 1 instructor per 3 students.',
      'Maximum 1 instructeur pour 3 élèves.',
      'Maximal 1 Ausbilder pro 3 Schüler.',
    ),
    reservationLink: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1/product/6a312c66a0cc4a3ec72bbc0c',
    order: 11,
  },
  // ---------- CMAS Avanzado ----------
  {
    _id: 'course-pa20',
    _type: 'course',
    title: loc(
      'Buzo autónomo de 20 m (PA20)',
      'Autonomous Diver 20 m (PA20)',
      'Plongeur autonome 20 m (PA20)',
      'Autonomer Taucher 20 m (PA20)',
    ),
    agency: 'CMAS',
    category: 'technical',
    summary: loc(
      'Buceo autónomo en binomio o grupo reducido, hasta 20 m.',
      'Autonomous diving in pairs or small groups, down to 20 m.',
      'Plongée autonome en binôme ou petit groupe, jusqu’à 20 m.',
      'Selbstständiges Tauchen zu zweit oder in kleiner Gruppe bis 20 m.',
    ),
    requirements: locList(
      ['Nivel 1 (PE20)', '20 inmersiones de experiencia adicionales', 'Certificado médico obligatorio'],
      ['Level 1 (PE20)', '20 additional logged dives', 'Medical certificate required'],
      ['Niveau 1 (PE20)', '20 plongées d’expérience supplémentaires', 'Certificat médical obligatoire'],
      ['Niveau 1 (PE20)', '20 zusätzliche protokollierte Tauchgänge', 'Ärztliches Attest erforderlich'],
    ),
    depthLimit: 20,
    duration: loc('3 días', '3 days', '3 jours', '3 Tage'),
    minAge: 16,
    price: 360,
    includes: locList(
      [
        '6 inmersiones de curso',
        'equipos y seguro de buceo',
        'formación teórica presencial (2 h) y carnet digital',
      ],
      [
        '6 course dives',
        'equipment and dive insurance',
        'classroom theory (2 h) and digital certification card',
      ],
      [
        '6 plongées de formation',
        'équipement et assurance plongée',
        'formation théorique en présentiel (2 h) et carte numérique',
      ],
      [
        '6 Kurs-Tauchgänge',
        'Ausrüstung und Tauchversicherung',
        'Präsenztheorie (2 Std.) und digitale Karte',
      ],
    ),
    supplements: locSupplements(
      [
        { label: 'Buceo adicional', price: '40 €' },
        { label: 'Equipo básico', price: '+60 €' },
        { label: 'Equipo completo', price: '+75 €' },
        { label: 'Seguro semana', price: '20 €' },
      ],
      [
        { label: 'Additional dive', price: '€40' },
        { label: 'Basic equipment', price: '+€60' },
        { label: 'Full equipment', price: '+€75' },
        { label: 'Weekly insurance', price: '€20' },
      ],
      [
        { label: 'Plongée supplémentaire', price: '40 €' },
        { label: 'Équipement de base', price: '+60 €' },
        { label: 'Équipement complet', price: '+75 €' },
        { label: 'Assurance semaine', price: '20 €' },
      ],
      [
        { label: 'Zusätzlicher Tauchgang', price: '40 €' },
        { label: 'Grundausrüstung', price: '+60 €' },
        { label: 'Komplettausrüstung', price: '+75 €' },
        { label: 'Versicherung Woche', price: '20 €' },
      ],
    ),
    groupDiscount: loc(
      'Máximo 2 estudiantes por sesión.',
      'Maximum 2 students per session.',
      'Maximum 2 élèves par session.',
      'Maximal 2 Schüler pro Sitzung.',
    ),
    order: 12,
  },
  {
    _id: 'course-pe40',
    _type: 'course',
    title: loc(
      'Buzo supervisado de 40 m (PE40)',
      'Supervised Diver 40 m (PE40)',
      'Plongeur encadré 40 m (PE40)',
      'Begleiteter Taucher 40 m (PE40)',
    ),
    agency: 'CMAS',
    category: 'technical',
    summary: loc(
      'Inmersiones guiadas hasta 40 m, con formación teórica específica.',
      'Guided dives down to 40 m, with specific classroom training.',
      'Plongées encadrées jusqu’à 40 m, avec formation théorique spécifique.',
      'Begleitete Tauchgänge bis 40 m mit spezifischer Theorieausbildung.',
    ),
    requirements: locList(
      ['Nivel 1 (PE20)', '20 inmersiones de experiencia adicionales', 'Certificado médico obligatorio'],
      ['Level 1 (PE20)', '20 additional logged dives', 'Medical certificate required'],
      ['Niveau 1 (PE20)', '20 plongées d’expérience supplémentaires', 'Certificat médical obligatoire'],
      ['Niveau 1 (PE20)', '20 zusätzliche protokollierte Tauchgänge', 'Ärztliches Attest erforderlich'],
    ),
    depthLimit: 40,
    duration: loc('2 días', '2 days', '2 jours', '2 Tage'),
    minAge: 16,
    price: 260,
    includes: locList(
      ['4 inmersiones de curso', 'formación teórica presencial (2 h) y carnet digital'],
      ['4 course dives', 'classroom theory (2 h) and digital certification card'],
      ['4 plongées de formation', 'formation théorique en présentiel (2 h) et carte numérique'],
      ['4 Kurs-Tauchgänge', 'Präsenztheorie (2 Std.) und digitale Karte'],
    ),
    supplements: locSupplements(
      [
        { label: 'Buceo adicional', price: '40 €' },
        { label: 'Equipo básico', price: '+40 €' },
        { label: 'Equipo completo', price: '+50 €' },
        { label: 'Seguro 2 días', price: '16 €' },
      ],
      [
        { label: 'Additional dive', price: '€40' },
        { label: 'Basic equipment', price: '+€40' },
        { label: 'Full equipment', price: '+€50' },
        { label: '2-day insurance', price: '€16' },
      ],
      [
        { label: 'Plongée supplémentaire', price: '40 €' },
        { label: 'Équipement de base', price: '+40 €' },
        { label: 'Équipement complet', price: '+50 €' },
        { label: 'Assurance 2 jours', price: '16 €' },
      ],
      [
        { label: 'Zusätzlicher Tauchgang', price: '40 €' },
        { label: 'Grundausrüstung', price: '+40 €' },
        { label: 'Komplettausrüstung', price: '+50 €' },
        { label: 'Versicherung 2 Tage', price: '16 €' },
      ],
    ),
    groupDiscount: loc(
      'Máximo 2 estudiantes por sesión.',
      'Maximum 2 students per session.',
      'Maximum 2 élèves par session.',
      'Maximal 2 Schüler pro Sitzung.',
    ),
    order: 13,
  },
  {
    _id: 'course-niveau-2',
    _type: 'course',
    title: loc(
      'Nivel 2 - CMAS 2* (PE40 + PA20)',
      'Level 2 - CMAS 2* (PE40 + PA20)',
      'Niveau 2 - CMAS 2* (PE40 + PA20)',
      'Niveau 2 - CMAS 2* (PE40 + PA20)',
    ),
    agency: 'CMAS',
    category: 'technical',
    summary: loc(
      'Combina el buceo autónomo a 20 m con la exploración supervisada hasta 40 m.',
      'Combines autonomous diving to 20 m with supervised exploration down to 40 m.',
      'Combine la plongée autonome à 20 m et l’exploration encadrée jusqu’à 40 m.',
      'Kombiniert autonomes Tauchen bis 20 m mit begleiteter Erkundung bis 40 m.',
    ),
    requirements: locList(
      ['Nivel 1 (PE20)', '20 inmersiones de experiencia adicionales', 'Certificado médico obligatorio'],
      ['Level 1 (PE20)', '20 additional logged dives', 'Medical certificate required'],
      ['Niveau 1 (PE20)', '20 plongées d’expérience supplémentaires', 'Certificat médical obligatoire'],
      ['Niveau 1 (PE20)', '20 zusätzliche protokollierte Tauchgänge', 'Ärztliches Attest erforderlich'],
    ),
    depthLimit: 40,
    duration: loc('5 días', '5 days', '5 jours', '5 Tage'),
    minAge: 16,
    price: 620,
    includes: locList(
      [
        '10 inmersiones de curso',
        'equipos y seguro de buceo',
        'formación teórica presencial (4 h) y carnet digital',
      ],
      [
        '10 course dives',
        'equipment and dive insurance',
        'classroom theory (4 h) and digital certification card',
      ],
      [
        '10 plongées de formation',
        'équipement et assurance plongée',
        'formation théorique en présentiel (4 h) et carte numérique',
      ],
      [
        '10 Kurs-Tauchgänge',
        'Ausrüstung und Tauchversicherung',
        'Präsenztheorie (4 Std.) und digitale Karte',
      ],
    ),
    supplements: locSupplements(
      [
        { label: 'Equipo básico', price: '+80 €' },
        { label: 'Equipo completo', price: '+100 €' },
        { label: 'Seguro semana', price: '20 €' },
      ],
      [
        { label: 'Basic equipment', price: '+€80' },
        { label: 'Full equipment', price: '+€100' },
        { label: 'Weekly insurance', price: '€20' },
      ],
      [
        { label: 'Équipement de base', price: '+80 €' },
        { label: 'Équipement complet', price: '+100 €' },
        { label: 'Assurance semaine', price: '20 €' },
      ],
      [
        { label: 'Grundausrüstung', price: '+80 €' },
        { label: 'Komplettausrüstung', price: '+100 €' },
        { label: 'Versicherung Woche', price: '20 €' },
      ],
    ),
    groupDiscount: loc(
      'Máximo 2 estudiantes por sesión.',
      'Maximum 2 students per session.',
      'Maximum 2 élèves par session.',
      'Maximal 2 Schüler pro Sitzung.',
    ),
    order: 14,
  },
]

export const courseBundlesData: CourseSeed[] = [
  {
    _id: 'course-pack-2-specialties',
    _type: 'course',
    title: loc(
      'Paquete 2 Especialidades - Nitrox + Profundo',
      '2-Specialty Package - Nitrox + Deep',
      'Pack 2 spécialités - Nitrox + Profonde',
      'Paket 2 Spezialkurse - Nitrox + Tiefe',
    ),
    agency: 'SSI',
    category: 'specialty',
    summary: loc(
      'Dos especialidades combinadas: Nitrox 32 y Buceo Profundo.',
      'Two combined specialties: Nitrox 32 and Deep Diving.',
      'Deux spécialités combinées : Nitrox 32 et Plongée profonde.',
      'Zwei kombinierte Spezialkurse: Nitrox 32 und Tiefe.',
    ),
    requirements: locList(
      ['Certificación Open Water'],
      ['Open Water certification'],
      ['Certification Open Water'],
      ['Open-Water-Zertifizierung'],
    ),
    depthLimit: 40,
    duration: loc(
      '3 inmersiones de curso / 2 días',
      '3 course dives / 2 days',
      '3 plongées de formation / 2 jours',
      '3 Kurs-Tauchgänge / 2 Tage',
    ),
    minAge: 12,
    price: 350,
    includes: locList(
      ['3 inmersiones de curso', '2 kits E-learning SSI y carnets digitales'],
      ['3 course dives', '2 SSI e-learning kits and digital certification cards'],
      ['3 plongées de formation', '2 kits e-learning SSI et cartes numériques'],
      ['3 Kurs-Tauchgänge', '2 SSI-E-Learning-Kits und digitale Karten'],
    ),
    supplements: locSupplements(
      [
        { label: 'Buceo adicional', price: '40 €' },
        { label: 'Equipo básico', price: '+30 €' },
        { label: 'Equipo completo', price: '+40 €' },
        { label: 'Seguro 2 días', price: '16 €' },
      ],
      [
        { label: 'Additional dive', price: '€40' },
        { label: 'Basic equipment', price: '+€30' },
        { label: 'Full equipment', price: '+€40' },
        { label: '2-day insurance', price: '€16' },
      ],
      [
        { label: 'Plongée supplémentaire', price: '40 €' },
        { label: 'Équipement de base', price: '+30 €' },
        { label: 'Équipement complet', price: '+40 €' },
        { label: 'Assurance 2 jours', price: '16 €' },
      ],
      [
        { label: 'Zusätzlicher Tauchgang', price: '40 €' },
        { label: 'Grundausrüstung', price: '+30 €' },
        { label: 'Komplettausrüstung', price: '+40 €' },
        { label: 'Versicherung 2 Tage', price: '16 €' },
      ],
    ),
    groupDiscount: loc('', '', '', ''),
    order: 17,
  },
  {
    _id: 'course-pack-3-specialties',
    _type: 'course',
    title: loc(
      'Pack 3 Especialidades - Nitrox + Profundo + Descompresión',
      '3-Specialty Pack - Nitrox + Deep + Decompression',
      'Pack 3 spécialités - Nitrox + Profonde + Décompression',
      'Paket 3 Spezialkurse - Nitrox + Tiefe + Dekompression',
    ),
    agency: 'SSI',
    category: 'specialty',
    summary: loc(
      'Tres especialidades combinadas: Nitrox 32, Buceo Profundo y Descompresión.',
      'Three combined specialties: Nitrox 32, Deep Diving and Decompression.',
      'Trois spécialités combinées : Nitrox 32, Plongée profonde et Décompression.',
      'Drei kombinierte Spezialkurse: Nitrox 32, Tiefe und Dekompression.',
    ),
    requirements: locList(
      ['Certificación Open Water'],
      ['Open Water certification'],
      ['Certification Open Water'],
      ['Open-Water-Zertifizierung'],
    ),
    depthLimit: 40,
    duration: loc(
      '7 inmersiones de curso / 2 días',
      '7 course dives / 2 days',
      '7 plongées de formation / 2 jours',
      '7 Kurs-Tauchgänge / 2 Tage',
    ),
    minAge: 16,
    price: 700,
    includes: locList(
      ['7 inmersiones de curso', '3 kits E-learning SSI y carnets digitales'],
      ['7 course dives', '3 SSI e-learning kits and digital certification cards'],
      ['7 plongées de formation', '3 kits e-learning SSI et cartes numériques'],
      ['7 Kurs-Tauchgänge', '3 SSI-E-Learning-Kits und digitale Karten'],
    ),
    supplements: locSupplements(
      [
        { label: 'Buceo adicional', price: '40 €' },
        { label: 'Equipo básico', price: '+60 €' },
        { label: 'Equipo completo', price: '+75 €' },
        { label: 'Seguro semana', price: '20 €' },
      ],
      [
        { label: 'Additional dive', price: '€40' },
        { label: 'Basic equipment', price: '+€60' },
        { label: 'Full equipment', price: '+€75' },
        { label: 'Weekly insurance', price: '€20' },
      ],
      [
        { label: 'Plongée supplémentaire', price: '40 €' },
        { label: 'Équipement de base', price: '+60 €' },
        { label: 'Équipement complet', price: '+75 €' },
        { label: 'Assurance semaine', price: '20 €' },
      ],
      [
        { label: 'Zusätzlicher Tauchgang', price: '40 €' },
        { label: 'Grundausrüstung', price: '+60 €' },
        { label: 'Komplettausrüstung', price: '+75 €' },
        { label: 'Versicherung Woche', price: '20 €' },
      ],
    ),
    groupDiscount: loc('', '', '', ''),
    order: 18,
  },
]

export const allCoursesData: CourseSeed[] = [...coursesData, ...courseBundlesData]
