// Canonical home-page content, sourced from docs/1. El centro de buceo.md.
export type LocaleValue = Partial<Record<'es' | 'en' | 'fr' | 'de', string>>

const loc = (es: string, en: string, fr: string, de: string): LocaleValue => ({ es, en, fr, de })

export const centroInfoData = {
  _id: 'centroInfo',
  _type: 'centroInfo',
  heroImage: '/assets/colorful-background.webp',
  intro: loc(
    'Buceo Sur es una pequeña empresa familiar con licencia oficial del Gobierno de Canarias. Venta directa, sin intermediarios, con instructores certificados y muy experimentados. Buceamos por toda la isla para ofrecer las mejores inmersiones según tu nivel de experiencia y las condiciones meteorológicas. Atención personalizada y grupos reducidos siempre.',
    'Buceo Sur is a small family business with an official licence from the Government of the Canary Islands. Direct sales, no middlemen, with highly experienced certified instructors. We dive all over the island to offer the best dives according to your experience level and the weather conditions. Always personal attention and small groups.',
    "Buceo Sur est une petite entreprise familiale titulaire d'une licence officielle du gouvernement des Canaries. Vente directe, sans intermédiaires, avec des instructeurs certifiés et très expérimentés. Nous plongeons sur toute l'île pour offrir les meilleures plongées selon votre niveau d'expérience et les conditions météorologiques. Toujours une attention personnalisée et des groupes réduits.",
    'Buceo Sur ist ein kleines Familienunternehmen mit offizieller Lizenz der Kanarischen Regierung. Direktverkauf, ohne Zwischenhändler, mit zertifizierten und sehr erfahrenen Ausbildern. Wir tauchen auf der ganzen Insel, um die besten Tauchgänge je nach Erfahrungsgrad und Wetterlage anzubieten. Immer persönliche Betreuung und kleine Gruppen.',
  ),
  history: loc(
    'Yann, un francés enamorado de las Islas Canarias desde hace 15 años, formado en Francia, las Antillas Francesas, Nueva Caledonia y Córcega. En 2014 se instaló en Canarias para vivir de su afición y en 2015 se hizo cargo del club de buceo "Buceo Sur". Como él dice: somos profesionales con la obligación de brindar servicios de calidad con total seguridad, pero sobre todo mantenemos la pasión y te esperamos con una gran sonrisa y el deseo de compartir buenos momentos.',
    'Yann, a Frenchman in love with the Canary Islands for 15 years, trained in France, the French West Indies, New Caledonia and Corsica. He settled in the Canaries in 2014 to live from his passion and took over the "Buceo Sur" dive club in 2015. As he puts it: we are professionals bound to deliver quality services with total safety, but above all we keep the passion and welcome you with a big smile and the wish to share great moments.',
    "Yann, un Français amoureux des îles Canaries depuis 15 ans, formé en France, aux Antilles françaises, en Nouvelle-Calédonie et en Corse. Il s'installe aux Canaries en 2014 pour vivre de sa passion et reprend le club de plongée « Buceo Sur » en 2015. Comme il le dit : nous sommes des professionnels avec l'obligation d'offrir des services de qualité en toute sécurité, mais surtout nous gardons la passion et nous vous attendons avec un grand sourire et l'envie de partager de bons moments.",
    'Yann, ein Franzose, der die Kanarischen Inseln seit 15 Jahren liebt, ausgebildet in Frankreich, den französischen Antillen, Neukaledonien und Korsika. 2014 ließ er sich auf den Kanaren nieder, um von seiner Leidenschaft zu leben, und 2015 übernahm er den Tauchclub "Buceo Sur". Wie er sagt: Wir sind Profis, die Qualität und absolute Sicherheit schulden, aber vor allem bewahren wir die Leidenschaft und empfangen Sie mit einem großen Lächeln und der Freude, schöne Momente zu teilen.',
  ),
  installations: loc(
    'Nuestras instalaciones se encuentran en Playa de Arinaga, un pequeño balneario ideal para familias, alejado del turismo de masas, en la costa este a 15 km del aeropuerto. Disponemos de 200 m² de cómodas instalaciones: duchas de agua caliente, aseos, compresor, sala de formación y taller de reparaciones. El equipamiento está en buen estado, con mantenimiento regular y se renueva periódicamente.',
    'Our facilities are in Playa de Arinaga, a small seaside resort ideal for families, away from mass tourism, on the east coast 15 km from the airport. We have 200 m² of comfortable facilities: hot water showers, toilets, compressor, training room and repair workshop. Equipment is kept in good condition with regular maintenance and is periodically renewed.',
    "Nos installations se trouvent à Playa de Arinaga, une petite station balnéaire idéale pour les familles, loin du tourisme de masse, sur la côte est à 15 km de l'aéroport. Nous disposons de 200 m² d'installations confortables : douches d'eau chaude, sanitaires, compresseur, salle de formation et atelier de réparation. Le matériel est bien entretenu, avec un suivi régulier, et renouvelé périodiquement.",
    'Unsere Einrichtungen befinden sich in Playa de Arinaga, einem kleinen, familienfreundlichen Badeort abseits des Massentourismus, an der Ostküste, 15 km vom Flughafen entfernt. Wir verfügen über 200 m² komfortable Räumlichkeiten: Warmwasserduschen, Toiletten, Kompressor, Schulungsraum und Reparaturwerkstatt. Die Ausrüstung ist in gutem Zustand, wird regelmäßig gewartet und periodisch erneuert.',
  ),
  installationsImages: [
    '/assets/local.webp',
    '/assets/local-grupo.webp',
    '/assets/local-zona-humeda.webp',
  ],
  staff: [
    {
      _key: 'staff-yann',
      name: 'Yann',
      role: loc(
        'Instructor y director técnico',
        'Instructor and technical director',
        'Instructeur et directeur technique',
        'Ausbilder und technischer Leiter',
      ),
      bio: loc(
        'Francés enamorado de Canarias desde hace 15 años. Formado en Francia, las Antillas Francesas, Nueva Caledonia y Córcega. En 2014 se instaló en Canarias y en 2015 se hizo cargo de "Buceo Sur". Instructor DEJEPS reconocido por el Estado francés, PADI MSDT y assistant instructor trainer de SSI.',
        'Frenchman in love with the Canaries for 15 years. Trained in France, the French West Indies, New Caledonia and Corsica. Settled in the Canaries in 2014 and took over "Buceo Sur" in 2015. DEJEPS instructor recognised by the French State, PADI MSDT and SSI assistant instructor trainer.',
        "Français amoureux des Canaries depuis 15 ans. Formé en France, aux Antilles françaises, en Nouvelle-Calédonie et en Corse. Installé aux Canaries en 2014, il reprend « Buceo Sur » en 2015. Instructeur DEJEPS reconnu par l'État français, PADI MSDT et assistant instructor trainer SSI.",
        'Franzose, seit 15 Jahren mit den Kanaren verbunden. Ausgebildet in Frankreich, den französischen Antillen, Neukaledonien und Korsika. Lebt seit 2014 auf den Kanaren und übernahm 2015 "Buceo Sur". DEJEPS-Ausbilder (vom französischen Staat anerkannt), PADI MSDT und SSI Assistant Instructor Trainer.',
      ),
      languages: loc(
        'Español, inglés, francés',
        'Spanish, English, French',
        'Espagnol, anglais, français',
        'Spanisch, Englisch, Französisch',
      ),
    },
    {
      _key: 'staff-anne',
      name: 'Anne',
      role: loc('Atención al cliente', 'Customer care', 'Accueil client', 'Kundenbetreuung'),
      bio: loc(
        'Responde a tus peticiones mientras Yann está en el agua, siempre con amabilidad y precisión. No es una IA, así que piensa de verdad, pero también duerme y no siempre está disponible al instante: deja de responder a las peticiones del día siguiente después de las 19:00.',
        'She answers your requests while Yann is in the water, always with kindness and precision. She is not an AI, so she truly thinks, but she also sleeps and is not always instantly available: she stops answering next-day requests after 7pm.',
        "Elle répond à vos demandes pendant que Yann est dans l'eau, toujours avec gentillesse et précision. Ce n'est pas une IA, elle pense donc vraiment, mais elle dort aussi et n'est pas toujours disponible instantanément : elle cesse de répondre aux demandes du lendemain après 19 h.",
        'Sie beantwortet Ihre Anfragen, während Yann im Wasser ist, immer freundlich und präzise. Sie ist keine KI, sie denkt wirklich nach, aber sie schläft auch und ist nicht immer sofort verfügbar: Nach 19 Uhr beantwortet sie keine Anfragen mehr für den nächsten Tag.',
      ),
      languages: loc(
        'Español, inglés, francés',
        'Spanish, English, French',
        'Espagnol, anglais, français',
        'Spanisch, Englisch, Französisch',
      ),
    },
    {
      _key: 'staff-kike',
      name: 'Kike',
      role: loc(
        'Instructor de buceo',
        'Dive instructor',
        'Instructeur de plongée',
        'Tauchausbilder',
      ),
      bio: loc(
        'Instructor en la isla desde hace 30 años, conoce cada rincón. Tiene un talento especial para encontrar caballitos de mar y tiburones ángel. Un auténtico canario, nacido en la isla. Instructor CMAS, PADI y SSI; solo es verdaderamente feliz bajo el agua.',
        'A dive instructor on the island for 30 years, he knows every corner. He has a special talent for finding seahorses and angel sharks. A true Canarian, born on the island. CMAS, PADI and SSI instructor; truly happy only underwater.',
        "Instructeur de plongée sur l'île depuis 30 ans, il connaît chaque recoin. Il a un talent particulier pour trouver chevaux de mer et anges de mer. Un authentique canarien, né sur l'île. Instructeur CMAS, PADI et SSI ; il n'est vraiment heureux que sous l'eau.",
        'Seit 30 Jahren Tauchausbilder auf der Insel, kennt er jede Ecke. Er hat ein besonderes Talent, Seepferdchen und Engelhaie zu finden. Ein echter Kanarier, auf der Insel geboren. CMAS-, PADI- und SSI-Ausbilder; nur unter Wasser ist er wirklich glücklich.',
      ),
      languages: loc(
        'Español, inglés, alemán',
        'Spanish, English, German',
        'Espagnol, anglais, allemand',
        'Spanisch, Englisch, Deutsch',
      ),
    },
  ],
  stats: [
    {
      _key: 'years',
      value: '20+',
      label: loc(
        'Años de experiencia',
        'Years of experience',
        "Ans d'expérience",
        'Jahre Erfahrung',
      ),
    },
    {
      _key: 'sites',
      value: '50+',
      label: loc('Galería (Puntos de inmersión)', 'Dive sites', 'Sites de plongée', 'Tauchplätze'),
    },
    {
      _key: 'temp',
      value: '22°C',
      label: loc(
        'Temperatura media',
        'Average water temp',
        'Température moyenne',
        'Durchschnittstemperatur',
      ),
    },
    {
      _key: 'months',
      value: '12',
      label: loc('Meses al año', 'Months a year', 'Mois par an', 'Monate im Jahr'),
    },
  ],
  certifications: [
    { _key: 'anmp', name: 'ANMP' },
    { _key: 'cmas', name: 'CMAS' },
    { _key: 'ssi', name: 'SSI' },
    { _key: 'canarias', name: 'Gobierno de Canarias' },
  ],
}
