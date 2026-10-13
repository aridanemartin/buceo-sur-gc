// Page copy that used to live inline in src/views/*View.astro, moved here verbatim
// (same per-locale shape it had in the views). src/content/data/pageTexts.ts
// transposes it into the Sanity singleton shape; edit the copy in the Studio.

export const cardLabelsByLocale = {
  es: {
    includes: 'Incluye',
    supplements: 'Suplementos / opciones',
    requirements: 'Requisitos',
    depth: 'máx.',
    packageBadge: 'Bono / Pack',
  },
  en: {
    includes: 'Includes',
    supplements: 'Supplements / options',
    requirements: 'Requirements',
    depth: 'max',
    packageBadge: 'Package',
  },
  fr: {
    includes: 'Inclut',
    supplements: 'Suppléments / options',
    requirements: 'Conditions',
    depth: 'max',
    packageBadge: 'Forfait',
  },
  de: {
    includes: 'Inklusive',
    supplements: 'Zuschläge / Optionen',
    requirements: 'Voraussetzungen',
    depth: 'max.',
    packageBadge: 'Paket',
  },
}

export const divesCtaTitleByLocale = {
  es: '¿Listo para tu próxima inmersión?',
  en: 'Ready for your next dive?',
  fr: 'Prêt pour votre prochaine plongée ?',
  de: 'Bereit für deinen nächsten Tauchgang?',
}

export const baptismsCtaTitleByLocale = {
  es: '¿Listo para descubrir el mundo submarino?',
  en: 'Ready to discover the underwater world?',
  fr: 'Prêt à découvrir le monde sous-marin ?',
  de: 'Bereit, die Unterwasserwelt zu entdecken?',
}

export const courseCategoryLabelsByLocale = {
  es: {
    recreational: "Recreativo",
    specialty: "Especialidad",
    technical: "Técnico",
  },
  en: {
    recreational: "Recreational",
    specialty: "Specialty",
    technical: "Technical",
  },
  fr: {
    recreational: "Loisirs",
    specialty: "Spécialité",
    technical: "Technique",
  },
  de: {
    recreational: "Freizeit",
    specialty: "Spezialkurs",
    technical: "Technisch",
  },
}

export const coursesCtaByLocale = {
  es: {
    title: "Reserva tu curso de buceo",
  },
  en: {
    title: "Book your diving course",
  },
  fr: {
    title: "Réservez votre formation de plongée",
  },
  de: {
    title: "Buchen Sie Ihren Tauchkurs",
  },
}

export const coursesIntroParagraphsByLocale = {
  es: [
    "Proponemos formaciones de las 2 mayores escuelas internacionales (SSI y CMAS/ANMP), que te darán titulaciones reconocidas en el mundo entero. Ambas siguen las normativas europeas y la diferencia está en el material digital que te proporcionan para la parte teórica del aprendizaje.",
    "Sin embargo, creemos que la parte más importante del aprendizaje está en el agua, y que tus habilidades siempre serán más importantes que el logo de tu tarjeta.",
    "Impartimos clase todo el año, siempre en grupos reducidos: de 1 a 3 alumnos máximo por instructor.",
  ],
  en: [
    "We offer training from the two largest international schools (SSI and CMAS/ANMP), which award qualifications recognised all over the world. Both follow European standards, and the difference lies in the digital materials they provide for the theoretical part of your learning.",
    "However, we believe the most important part of learning happens in the water, and that your skills will always matter more than the logo on your card.",
    "We teach all year round, always in small groups: 1 to 3 students maximum per instructor.",
  ],
  fr: [
    "Nous proposons des formations des deux plus grandes écoles internationales (SSI et CMAS/ANMP), qui vous délivreront des certifications reconnues dans le monde entier. Toutes deux suivent les normes européennes, et la différence réside dans le matériel pédagogique numérique qu'elles fournissent pour la partie théorique de l'apprentissage.",
    "Cependant, nous sommes convaincus que la partie la plus importante de l'apprentissage se fait dans l'eau, et que vos compétences compteront toujours plus que le logo de votre carte.",
    "Nous enseignons toute l'année, toujours en petits groupes : de 1 à 3 élèves maximum par instructeur.",
  ],
  de: [
    "Wir bieten Ausbildungen der zwei größten internationalen Tauchschulen (SSI und CMAS/ANMP) an, die dir weltweit anerkannte Zertifizierungen verleihen. Beide folgen den europäischen Richtlinien, und der Unterschied liegt im digitalen Material, das sie für den theoretischen Teil der Ausbildung bereitstellen.",
    "Wir sind jedoch überzeugt, dass der wichtigste Teil des Lernens im Wasser stattfindet und dass deine Fähigkeiten immer wichtiger sein werden als das Logo auf deiner Karte.",
    "Wir unterrichten das ganze Jahr über, immer in kleinen Gruppen: maximal 1 bis 3 Schüler pro Ausbilder.",
  ],
}

export const coursesSpecialtyParagraphsByLocale = {
  es: [
    "Una selección de especialidades deliberadamente limitada.",
    "Hemos optado intencionalmente por limitar nuestra gama de especialidades y reconocemos que vamos en contra de las tendencias de la industria del buceo y de las principales agencias de formación.",
    "Creemos que la mejora de las habilidades de un buceador se logra, con mayor frecuencia, acumulando experiencias de buceo diversas, en lugar de simplemente obtener certificaciones y tarjetas.",
    "Nuestro enfoque se basa siempre en «qué formación es realmente útil para tu progreso, según tu nivel de habilidad y tus objetivos», en lugar de «cuáles son las oportunidades de venta».",
    "Los consejos de tu instructor sobre el lastre, la posición corporal o el uso de válvulas de purga suelen ser tan efectivos como la formación especializada en control de flotabilidad.",
    "No, no necesitas una especialidad de buceo en pecios para bucear en pecios adecuados a tu nivel de habilidad. Si acabas de comprar un ordenador de buceo, lee el manual del fabricante y repasa tu curso de aguas abiertas; no necesitas realizar el curso de especialidad de ordenador. En resumen, ofrecemos las especialidades que consideramos verdaderamente útiles y relevantes; esta es nuestra «libre voluntad» basada en nuestra experiencia. No somos vendedores de kits.",
  ],
  en: [
    "A deliberately limited selection of specialties.",
    "We have intentionally chosen to limit our range of specialties, and we recognise that we are going against the trends in the diving industry and among the major training agencies.",
    "We believe a diver's skills improve most often by accumulating diverse diving experiences, rather than simply collecting certifications and cards.",
    "Our approach is always based on “which training is genuinely useful for your progress, given your skill level and your goals”, rather than on “what are the sales opportunities”.",
    "Your instructor's advice on weighting, body position or dump-valve use is often just as effective as specialist buoyancy-control training.",
    "No, you don't need a wreck-diving specialty to dive wrecks suited to your skill level. If you have just bought a dive computer, read the manufacturer's manual and review your open water course; you don't need to take the computer specialty course. In short, we offer the specialties we consider truly useful and relevant; this is our “free will” based on our experience. We are not kit sellers.",
  ],
  fr: [
    "Une sélection de spécialités délibérément limitée.",
    "Nous avons délibérément choisi de limiter notre gamme de spécialités, et nous reconnaissons aller à l'encontre des tendances de l'industrie de la plongée et des principales agences de formation.",
    "Nous pensons que l'amélioration des compétences d'un plongeur passe le plus souvent par l'accumulation d'expériences de plongée variées, plutôt que par la simple obtention de certifications et de cartes.",
    "Notre approche repose toujours sur « quelle formation est réellement utile à votre progression, selon votre niveau et vos objectifs », plutôt que sur « quelles sont les opportunités de vente ».",
    "Les conseils de votre instructeur sur le lestage, la position du corps ou l'utilisation des purges sont souvent aussi efficaces qu'une formation spécialisée en contrôle de flottabilité.",
    "Non, vous n'avez pas besoin d'une spécialité plongée sur épaves pour plonger sur des épaves adaptées à votre niveau. Si vous venez d'acheter un ordinateur de plongée, lisez le manuel du fabricant et révisez votre cours en eau libre ; vous n'avez pas besoin de suivre le cours de spécialité ordinateur. En résumé, nous proposons les spécialités que nous jugeons réellement utiles et pertinentes ; c'est notre « libre arbitre » fondé sur notre expérience. Nous ne sommes pas vendeurs de packages.",
  ],
  de: [
    "Eine bewusst begrenzte Auswahl an Spezialkursen.",
    "Wir haben uns bewusst dafür entschieden, unser Angebot an Spezialkursen zu begrenzen, und uns ist klar, dass wir damit gegen den Trend in der Tauchindustrie und bei den großen Ausbildungsorganisationen handeln.",
    "Wir sind davon überzeugt, dass sich die Fähigkeiten eines Tauchers meist durch vielfältige Tauch-Erfahrungen verbessern, statt durch das bloße Sammeln von Zertifizierungen und Karten.",
    "Unser Ansatz orientiert sich immer an der Frage „Welche Ausbildung ist wirklich nützlich für deinen Fortschritt, gemessen an deinem Können und deinen Zielen?“ statt an der Frage „Wo gibt es Verkaufschancen?“",
    "Die Tipps deines Ausbilders zu Blei, Körperhaltung oder dem Umgang mit Auslassventilen sind oft genauso wirksam wie ein spezieller Kurs zur Tarierungskontrolle.",
    "Nein, du brauchst keinen Wracktauch-Spezialkurs, um an Wracks zu tauchen, die deinem Können entsprechen. Wenn du gerade einen Tauchcomputer gekauft hast, lies das Handbuch des Herstellers und wiederhole deinen Open-Water-Kurs; du musst nicht den Spezialkurs für Tauchcomputer belegen. Kurz gesagt: Wir bieten die Spezialkurse an, die wir für wirklich sinnvoll und relevant halten; das ist unser „freier Wille“, der auf unserer Erfahrung beruht. Wir sind keine Verkäufer von Paketen.",
  ],
}

export const ratesSubtitleByLocale = {
  es: 'Consulta la tarifa completa de nuestras actividades: bautizos, inmersiones guiadas, cursos y suplementos.',
  en: 'Browse the full rate card for our activities: discover dives, guided dives, courses and extras.',
  fr: 'Consultez l’ensemble de nos tarifs : baptêmes, plongées encadrées, formations et suppléments.',
  de: 'Alle Tarife im Überblick: Schnuppertauchen, begleitete Tauchgänge, Kurse und Zusatzleistungen.',
}

export const ratesExtrasTitleByLocale = {
  es: 'Extras',
  en: 'Extras',
  fr: 'Suppléments',
  de: 'Extras',
}

export const ratesCtaTitleByLocale = {
  es: '¿Listo para tu próxima inmersión?',
  en: 'Ready for your next dive?',
  fr: 'Prêt pour votre prochaine plongée ?',
  de: 'Bereit für deinen nächsten Tauchgang?',
}

export const sidemountCtaByLocale = {
  es: {
    title: 'Reserva tu bautismo Sidemount',
  },
  en: {
    title: 'Book your Sidemount discover dive',
  },
  fr: {
    title: 'Réservez votre baptême Sidemount',
  },
  de: {
    title: 'Buchen Sie Ihr Sidemount-Schnuppertauchen',
  },
}

export const contactTextsByLocale = {
  es: {
    eyebrow: 'Contacto',
    title: 'Ponte en contacto con nosotros',
    subtitle:
      '¿Tienes alguna duda sobre inmersiones, bautizos o cursos? Escríbenos o llámanos, estaremos encantados de ayudarte.',
    contactTitle: 'Información de contacto',
    emailLabel: 'Email',
    phonesLabel: 'Teléfonos',
    primaryNote: 'reservas y consultas',
    secondaryRole: 'Instructor · solo temas de formación e inmersiones técnicas',
    addressLabel: 'Dirección',
    socialTitle: 'Síguenos',
    mapTitle: 'Donde estamos',
  },
  en: {
    eyebrow: 'Contact',
    title: 'Get in touch with us',
    subtitle:
      'Any questions about dives, discover scuba diving or courses? Write to us or call us — we will be happy to help.',
    contactTitle: 'Contact information',
    emailLabel: 'Email',
    phonesLabel: 'Phones',
    primaryNote: 'bookings and enquiries',
    secondaryRole: 'Instructor · training and technical dives only',
    addressLabel: 'Address',
    socialTitle: 'Follow us',
    mapTitle: 'Where we are',
  },
  fr: {
    eyebrow: 'Contact',
    title: 'Contactez-nous',
    subtitle:
      'Une question sur les plongées, les baptêmes ou les formations ? Écrivez-nous ou appelez-nous, nous serons ravis de vous aider.',
    contactTitle: 'Coordonnées',
    emailLabel: 'E-mail',
    phonesLabel: 'Téléphones',
    primaryNote: 'réservations et renseignements',
    secondaryRole: 'Instructeur · uniquement formations et plongées techniques',
    addressLabel: 'Adresse',
    socialTitle: 'Suivez-nous',
    mapTitle: 'Où nous sommes',
  },
  de: {
    eyebrow: 'Kontakt',
    title: 'Kontaktieren Sie uns',
    subtitle:
      'Fragen zu Tauchgängen, Schnuppertauchen oder Kursen? Schreiben Sie uns oder rufen Sie uns an – wir helfen Ihnen gerne.',
    contactTitle: 'Kontaktinformationen',
    emailLabel: 'E-Mail',
    phonesLabel: 'Telefon',
    primaryNote: 'Buchungen und Anfragen',
    secondaryRole: 'Tauchlehrer · nur Ausbildung und technische Tauchgänge',
    addressLabel: 'Adresse',
    socialTitle: 'Folgen Sie uns',
    mapTitle: 'Wo wir sind',
  },
}

export const contactCtaTitleByLocale = {
  es: '¿Listo para reservar tu próxima inmersión?',
  en: 'Ready to book your next dive?',
  fr: 'Prêt à réserver votre prochaine plongée ?',
  de: 'Bereit, deinen nächsten Tauchgang zu buchen?',
}
