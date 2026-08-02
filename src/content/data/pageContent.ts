// Canonical page-level copy, sourced from the docx documents (docx takes precedence).
// doc 2: Inmersiones intro/organisation; doc 3: Bautizos intro; doc 7: Sidemount intro; doc 6: Galería intro.
export type LocaleValue = Partial<Record<'es' | 'en' | 'fr' | 'de', string>>

const loc = (es: string, en: string, fr: string, de: string): LocaleValue => ({ es, en, fr, de })

export const divesPageContent = {
  introTitle: loc(
    'Buceo en Gran Canaria con Buceo Sur',
    'Diving in Gran Canaria with Buceo Sur',
    'Plongée à Grande Canarie avec Buceo Sur',
    'Tauchen auf Gran Canaria mit Buceo Sur',
  ),
  introSubtitle: loc(
    'Explora el océano con seguridad y pasión',
    'Explore the ocean with safety and passion',
    'Explorez l’océan avec sécurité et passion',
    'Entdecke den Ozean mit Sicherheit und Leidenschaft',
  ),
  intro: loc(
    'Gran Canaria ofrece buceo todo el año, aguas templadas, fondos volcánicos, pecios hundidos y una biodiversidad sorprendente, ideal para principiantes y buceadores certificados. Nuestro centro está ubicado cerca del área marina protegida «El Cabrón», nuestro lugar de buceo favorito, pero buceamos por toda la isla para ofrecer una experiencia diversa adaptada a las condiciones climáticas del día. Ofrecemos atención personalizada y siempre organizamos nuestras inmersiones en grupos reducidos.',
    'Gran Canaria offers year-round diving, temperate waters, volcanic bottoms, sunken wrecks and surprising biodiversity, ideal for beginners and certified divers. Our centre is located near the protected marine area “El Cabrón”, our favourite dive spot, but we dive all over the island to offer a diverse experience adapted to the day’s weather conditions. We offer personal attention and always organise our dives in small groups.',
    'Grande Canarie offre une plongée toute l’année, des eaux tempérées, des fonds volcaniques, des épaves englouties et une biodiversité surprenante, idéale pour les débutants et les plongeurs certifiés. Notre centre est situé près de l’aire marine protégée « El Cabrón », notre site de plongée préféré, mais nous plongeons sur toute l’île pour offrir une expérience variée adaptée aux conditions climatiques du jour. Nous offrons une attention personnalisée et organisons toujours nos plongées en petits groupes.',
    'Gran Canaria bietet ganzjährig Tauchen, gemäßigte Gewässer, vulkanische Böden, gesunkene Wracks und eine überraschende Artenvielfalt, ideal für Anfänger und zertifizierte Taucher. Unser Zentrum liegt nahe des Meeresschutzgebiets „El Cabrón“, unserem Lieblingstauchplatz, aber wir tauchen auf der ganzen Insel, um ein vielfältiges Erlebnis zu bieten, das an die Wetterbedingungen des Tages angepasst ist. Wir bieten persönliche Betreuung und organisieren unsere Tauchgänge immer in kleinen Gruppen.',
  ),
  siteChoiceTitle: loc(
    '¿En qué lugar exacto serán las inmersiones?',
    'Where exactly will the dives take place?',
    'Où exactement auront lieu les plongées ?',
    'Wo genau finden die Tauchgänge statt?',
  ),
  siteChoice: loc(
    'No es posible elegir el lugar de buceo al hacer la reserva; esta decisión es responsabilidad del director técnico. Vientos, mareas, condiciones meteorológicas diurnas y el nivel de habilidad y experiencia de los buceadores: combinamos todos estos factores para determinar la mejor experiencia posible.',
    'It is not possible to choose the dive site when booking; this decision is the responsibility of the technical director. Winds, tides, daily weather conditions and the skill and experience level of the divers: we combine all these factors to determine the best possible experience.',
    'Il n’est pas possible de choisir le site de plongée lors de la réservation ; cette décision relève du directeur technique. Vents, marées, conditions météorologiques du jour et niveau de compétence et d’expérience des plongeurs : nous combinons tous ces facteurs pour déterminer la meilleure expérience possible.',
    'Es ist nicht möglich, den Tauchplatz bei der Buchung zu wählen; diese Entscheidung obliegt dem technischen Leiter. Winde, Gezeiten, Wetterbedingungen des Tages und das Können sowie die Erfahrung der Taucher: Wir kombinieren all diese Faktoren, um das bestmögliche Erlebnis zu bestimmen.',
  ),
  refresherTitle: loc('¿Repaso?', 'Refresher?', 'Remise à niveau ?', 'Auffrischung?'),
  refresher: loc(
    'Si tu única experiencia son las inmersiones de tu curso y no has buceado desde hace más de un año, reserva una sesión de repaso antes de unirte a las inmersiones guiadas en un grupo de buceadores certificados. También, si tienes poca experiencia (menos de 10 inmersiones fuera del curso) y no has buceado durante más de 2 años, reserva una sesión de repaso. Contacta con nosotros.',
    'If your only experience is your course dives and you have not dived for more than a year, book a refresher session before joining guided dives in a group of certified divers. Also, if you have little experience (fewer than 10 dives outside the course) and have not dived for more than 2 years, book a refresher session. Contact us.',
    'Si votre seule expérience sont les plongées de votre formation et que vous n’avez pas plongé depuis plus d’un an, réservez une séance de remise à niveau avant de rejoindre les plongées encadrées dans un groupe de plongeurs certifiés. Aussi, si vous avez peu d’expérience (moins de 10 plongées hors formation) et que vous n’avez pas plongé depuis plus de 2 ans, réservez une séance de remise à niveau. Contactez-nous.',
    'Wenn Ihre einzige Erfahrung die Tauchgänge Ihres Kurses sind und Sie seit mehr als einem Jahr nicht mehr getaucht haben, buchen Sie eine Auffrischungssitzung, bevor Sie sich begleiteten Tauchgängen in einer Gruppe zertifizierter Taucher anschließen. Auch bei wenig Erfahrung (weniger als 10 Tauchgänge außerhalb des Kurses) und mehr als 2 Jahren ohne Tauchen: Buchen Sie eine Auffrischungssitzung. Kontaktieren Sie uns.',
  ),
  scheduleTitle: loc(
    'Organización general y horarios provisionales',
    'General organisation and provisional schedules',
    'Organisation générale et horaires provisoires',
    'Allgemeine Organisation und vorläufige Zeiten',
  ),
  schedule: loc(
    'Por lo general, quedamos en el centro a las 8:30 de la mañana. Si, debido a las condiciones climáticas, tenemos que planificar visitas a lugares lejanos, es posible que modifiquemos ligeramente el horario y nos pondremos en contacto contigo directamente para informarte.',
    'As a rule, we meet at the centre at 8:30 in the morning. If, due to weather conditions, we have to plan trips to distant sites, we may slightly modify the schedule and will contact you directly to inform you.',
    'En règle générale, nous nous retrouvons au centre à 8 h 30 du matin. Si, en raison des conditions climatiques, nous devons planifier des visites sur des sites éloignés, il est possible que nous modifiions légèrement l’horaire et nous vous contacterons directement pour vous informer.',
    'In der Regel treffen wir uns um 8:30 Uhr morgens im Zentrum. Wenn wir wegen der Wetterbedingungen Besuche an weiter entfernten Orten planen müssen, können wir den Zeitplan leicht ändern und werden Sie direkt kontaktieren, um Sie zu informieren.',
  ),
  bookingTitle: loc(
    'Reservar con antelación beneficia a todos',
    'Booking in advance benefits everyone',
    'Réserver à l’avance profite à tous',
    'Rechtzeitige Buchung kommt allen zugute',
  ),
  booking: loc(
    'Para su comodidad, seguridad y la calidad de sus inmersiones, siempre limitamos el número de buceadores por instructor. Por consiguiente, durante la temporada alta y las vacaciones escolares, a menudo tenemos que rechazar solicitudes cuando no tenemos plazas disponibles. Le recomendamos reservar con antelación para garantizar su plaza. Reservar con antelación también nos ayuda a planificar y organizar sus inmersiones y cursos de forma óptima: podemos elegir los mejores puntos de buceo según el nivel y las condiciones meteorológicas, y agrupar a buceadores con niveles de experiencia similares.',
    'For your comfort, safety and the quality of your dives, we always limit the number of divers per instructor. Therefore, during high season and school holidays, we often have to decline requests when no places are available. We recommend booking in advance to guarantee your spot. Booking in advance also helps us plan and organise your dives and courses optimally: we can choose the best dive sites according to level and weather conditions, and group divers with similar experience levels.',
    'Pour votre confort, votre sécurité et la qualité de vos plongées, nous limitons toujours le nombre de plongeurs par instructeur. Par conséquent, en haute saison et pendant les vacances scolaires, nous devons souvent refuser des demandes faute de places disponibles. Nous vous recommandons de réserver à l’avance pour garantir votre place. Réserver à l’avance nous aide aussi à planifier et organiser vos plongées et formations de manière optimale : nous pouvons choisir les meilleurs sites selon le niveau et les conditions météo, et regrouper les plongeurs de niveaux similaires.',
    'Für Ihren Komfort, Ihre Sicherheit und die Qualität Ihrer Tauchgänge begrenzen wir immer die Anzahl der Taucher pro Ausbilder. Daher müssen wir in der Hochsaison und in den Schulferien oft Anfragen ablehnen, wenn keine Plätze verfügbar sind. Wir empfehlen, rechtzeitig zu buchen, um Ihren Platz zu sichern. Rechtzeitiges Buchen hilft uns auch, Ihre Tauchgänge und Kurse optimal zu planen: Wir können die besten Tauchplätze je nach Level und Wetterlage wählen und Taucher mit ähnlicher Erfahrung gruppieren.',
  ),
  docsTitle: loc(
    'Documentación obligatoria y requisitos',
    'Mandatory documentation and requirements',
    'Documentation obligatoire et conditions',
    'Pflichtdokumente und Voraussetzungen',
  ),
  docs: loc(
    'Todos los buceadores certificados deben tener: una tarjeta de certificación que acredite su nivel; un certificado médico (en papel o escaneado) con una antigüedad inferior a 2 años (si es necesario, se puede obtener en la Clínica Isla del Sol) o una declaración médica según lo estipulado en el Real Decreto 550/2020, de 27/06/2020; y un seguro de buceo. Si no dispone de uno, puede contratar una póliza diaria, semanal o anual directamente en el centro de buceo.',
    'All certified divers must have: a certification card proving their level; a medical certificate (paper or scanned) less than 2 years old (if needed, it can be obtained at Clínica Isla del Sol) or a medical declaration as stipulated in Royal Decree 550/2020 of 27/06/2020; and dive insurance. If you do not have one, you can take out a daily, weekly or annual policy directly at the dive centre.',
    'Tous les plongeurs certifiés doivent avoir : une carte de certification attestant de leur niveau ; un certificat médical (papier ou scanné) de moins de 2 ans (si nécessaire, il peut être obtenu à la Clínica Isla del Sol) ou une déclaration médicale comme le stipule le décret royal 550/2020 du 27/06/2020 ; et une assurance plongée. Si vous n’en avez pas, vous pouvez souscrire une police journalière, hebdomadaire ou annuelle directement au centre de plongée.',
    'Alle zertifizierten Taucher müssen Folgendes haben: eine Zertifizierungskarte, die ihr Level belegt; ein ärztliches Attest (Papier oder gescannt), das nicht älter als 2 Jahre ist (falls nötig, erhältlich in der Clínica Isla del Sol) oder eine ärztliche Erklärung gemäß Königlichem Dekret 550/2020 vom 27.06.2020; und eine Tauchversicherung. Falls Sie keine haben, können Sie eine Tages-, Wochen- oder Jahrespolice direkt im Tauchzentrum abschließen.',
  ),
}

export const baptismsPageContent = {
  introTitle: loc(
    'Buceo para principiantes sin certificación',
    'Diving for beginners without certification',
    'Plongée pour débutants sans certification',
    'Tauchen für Anfänger ohne Zertifizierung',
  ),
  intro: loc(
    '¿Tienes ganas de descubrir el mundo submarino pero no tienes formación? ¡El bautismo es para ti! Te proponemos 2 tipos de iniciación.',
    'Do you want to discover the underwater world but have no training? The baptism is for you! We offer 2 types of initiation.',
    'Envie de découvrir le monde sous-marin sans formation ? Le baptême est fait pour vous ! Nous proposons 2 types d’initiation.',
    'Möchten Sie die Unterwasserwelt entdecken, haben aber keine Ausbildung? Das Schnuppertauchen ist für Sie! Wir bieten 2 Arten der Einführung an.',
  ),
}

export const sidemountPageContent = {
  introTitle: loc(
    'Bucear en configuración sidemount en Canarias',
    'Sidemount diving in the Canaries',
    'Plonger en configuration sidemount aux Canaries',
    'Sidemount-Tauchen auf den Kanaren',
  ),
  motto: loc(
    'Que lo disfrutes, bucea de forma diferente, bucea Sidemount.',
    'Enjoy it, dive differently, dive Sidemount.',
    'Profitez-en, plongez autrement, plongez en Sidemount.',
    'Viel Spaß, tauche anders, tauche Sidemount.',
  ),
  intro: loc(
    'La configuración sidemount o montaje lateral ofrece una alternativa al montaje clásico de las botellas en la espalda. Aparte de la seguridad, la comodidad y la mayor cantidad de aire disponible, la configuración sidemount ofrece una sensación de libertad y fluidez de desplazamiento: una mejor hidrodinámica para más placer y nuevas sensaciones.',
    'Sidemount or side-mount configuration offers an alternative to the classic back-mounted tank setup. Apart from safety, comfort and more available air, sidemount offers a feeling of freedom and fluid movement: better hydrodynamics for more pleasure and new sensations.',
    'La configuration sidemount ou montage latéral offre une alternative au montage classique des bouteilles dans le dos. Outre la sécurité, le confort et la plus grande quantité d’air disponible, la configuration sidemount offre une sensation de liberté et de fluidité de déplacement : une meilleure hydrodynamique pour plus de plaisir et de nouvelles sensations.',
    'Die Sidemount- oder Seitenmontage-Konfiguration bietet eine Alternative zur klassischen Rückenmontage der Flaschen. Neben Sicherheit, Komfort und mehr verfügbarer Luft bietet Sidemount ein Gefühl von Freiheit und flüssiger Bewegung: bessere Hydrodynamik für mehr Vergnügen und neue Empfindungen.',
  ),
  terrainTitle: loc(
    'Gran Canaria, «terreno de juego» ideal',
    'Gran Canaria, the ideal playground',
    'Grande Canarie, un « terrain de jeu » idéal',
    'Gran Canaria, der ideale Spielplatz',
  ),
  terrain: loc(
    'Los fondos marinos de Gran Canaria, con sus numerosos pecios hundidos y sus relieves torturados por el volcanismo, ofrecen un espacio lúdico e ideal para el aprendizaje y la práctica del buceo en sidemount. Buceamos en toda la isla y encontrarás cuevas, túneles, arcos y chimeneas, así como pecios con penetración. Juntarás técnica, diversión y seguridad.',
    'Gran Canaria’s seabed, with its many sunken wrecks and reliefs sculpted by volcanism, offers a playful and ideal space for learning and practising sidemount diving. We dive all over the island and you will find caves, tunnels, arches and chimneys, as well as penetrable wrecks. You will combine technique, fun and safety.',
    'Les fonds marins de Grande Canarie, avec leurs nombreuses épaves englouties et leurs reliefs tourmentés par le volcanisme, offrent un espace ludique et idéal pour l’apprentissage et la pratique de la plongée en sidemount. Nous plongeons sur toute l’île et vous trouverez grottes, tunnels, arches et cheminées, ainsi que des épaves pénétrables. Vous allierez technique, plaisir et sécurité.',
    'Der Meeresboden Gran Canarias mit seinen vielen gesunkenen Wracks und den vom Vulkanismus geformten Reliefs bietet einen spielerischen und idealen Raum zum Lernen und Üben des Sidemount-Tauchens. Wir tauchen auf der ganzen Insel und Sie finden Höhlen, Tunnel, Bögen und Schornsteine sowie begehbare Wracks. Sie verbinden Technik, Spaß und Sicherheit.',
  ),
  videoUrl: 'https://youtu.be/VcV43eZU-GA?si=V9Qxb7fbtL5_eLYo',
  courseTitle: loc(
    'Curso de buceo Sidemount (montaje lateral)',
    'Sidemount diving course (side mount)',
    'Cours de plongée Sidemount (montage latéral)',
    'Sidemount-Tauchkurs (Seitenmontage)',
  ),
  courseRequirementsTitle: loc('Requisitos', 'Requirements', 'Conditions', 'Voraussetzungen'),
  courseRequirements: loc(
    'CMAS 1* u Open Water + mínimo de 30 inmersiones registradas. Certificado médico.',
    'CMAS 1* or Open Water + minimum 30 logged dives. Medical certificate.',
    'CMAS 1* ou Open Water + minimum 30 plongées enregistrées. Certificat médical.',
    'CMAS 1* oder Open Water + mindestens 30 protokollierte Tauchgänge. Ärztliches Attest.',
  ),
  courseIncludesTitle: loc('Incluido', 'Included', 'Inclus', 'Inklusive'),
  courseIncludes: loc(
    'Equipo sidemount, kit digital E-learning SSI, 4 inmersiones de curso, certificación SSI Recreational Sidemount. Duración: 2-3 días.',
    'Sidemount equipment, SSI digital e-learning kit, 4 course dives, SSI Recreational Sidemount certification. Duration: 2-3 days.',
    'Équipement sidemount, kit numérique E-learning SSI, 4 plongées de formation, certification SSI Recreational Sidemount. Durée : 2-3 jours.',
    'Sidemount-Ausrüstung, digitales SSI-E-Learning-Kit, 4 Kurstauchgänge, SSI-Recreational-Sidemount-Zertifizierung. Dauer: 2-3 Tage.',
  ),
}

export const galleryPageContent = {
  introTitle: loc(
    'Imágenes de los sitios de buceo en Gran Canaria',
    'Images of the dive sites in Gran Canaria',
    'Images des sites de plongée à Grande Canarie',
    'Bilder der Tauchplätze auf Gran Canaria',
  ),
  intro: loc(
    'Aunque no somos fotógrafos profesionales, estas imágenes te darán una buena idea de lo que podrás descubrir con nosotros. Y recuerda: ¡a través de tu máscara será aún mejor!',
    'Although we are not professional photographers, these images will give you a good idea of what you can discover with us. And remember: through your mask it will be even better!',
    'Bien que nous ne soyons pas des photographes professionnels, ces images vous donneront une bonne idée de ce que vous pourrez découvrir avec nous. Et rappelez-vous : à travers votre masque, ce sera encore mieux !',
    'Auch wenn wir keine professionellen Fotografen sind, geben Ihnen diese Bilder einen guten Eindruck davon, was Sie mit uns entdecken können. Und denken Sie daran: Durch Ihre Maske wird es noch besser!',
  ),
}
