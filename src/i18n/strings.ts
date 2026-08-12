import type { Locale } from './locales'

export interface UiStrings {
  nav: {
    home: string
    dives: string
    baptisms: string
    courses: string
    rates: string
    gallery: string
    sidemount: string
    contact: string
  }
  legal: {
    privacy: string
    cancellation: string
    terms: string
  }
  home: {
    dondeEstamos: string
    metaTitle: string
    heroLabel: string
    scrollLabel: string
    whoWeAreEyebrow: string
    certificationsLabel: string
    videoTitle: string
    videoCaption: string
    facilitiesEyebrow: string
    facilitiesTitle: string
    facilitiesAlt: string
    facilitiesPrev: string
    facilitiesNext: string
    aboutEyebrow: string
    teamTitle: string
    statsLabel: string
    ctaTitle: string
  }
  sidemount: {
    alt: string
    prev: string
    next: string
  }
  dives: {
    infoTab: string
    ratesTab: string
  }
  book: string
  ctaButton: string
  ctaNote: string
  footer: {
    country: string
    tagline: string
    servicesTitle: string
    companyTitle: string
    legalTitle: string
    rightsReserved: string
    textsCredit: string
  }
  a11y: {
    mainNav: string
    footerNav: string
    openMenu: string
    closeMenu: string
  }
}

// Message pre-filled into the contact form's textarea when a course/baptism/
// dive has no direct Bukyapp reservationLink — the "Reservar" button on its
// card falls back to /contact?message=... instead of an external booking URL.
const reserveInterestMessages: Record<Locale, (title: string) => string> = {
  es: (title) => `Estoy interesado/a en reservar ${title}.`,
  en: (title) => `I'm interested in reserving ${title}.`,
  fr: (title) => `Je suis intéressé(e) par la réservation de ${title}.`,
  de: (title) => `Ich interessiere mich für die Buchung von ${title}.`,
}

export function reserveInterestMessage(lang: Locale, title: string): string {
  return reserveInterestMessages[lang](title)
}

export const ui: Record<Locale, UiStrings> = {
  es: {
    nav: {
      home: 'Centro de buceo',
      dives: 'Inmersiones',
      baptisms: 'Bautizos',
      courses: 'Cursos',
      rates: 'Tarifas',
      gallery: 'Galería',
      sidemount: 'Sidemount',
      contact: 'Contacto',
    },
    legal: {
      privacy: 'Privacidad',
      cancellation: 'Cancelación',
      terms: 'Condiciones',
    },
    home: {
      dondeEstamos: 'Donde estamos',
      metaTitle: 'Buceo Sur Gran Canaria — Inmersiones en toda la isla',
      heroLabel: 'Portada',
      scrollLabel: 'Ir a la siguiente sección',
      whoWeAreEyebrow: 'Quiénes somos',
      certificationsLabel: 'Certificaciones',
      videoTitle: 'Inmersión en alta definición — Gran Canaria',
      videoCaption: 'Inmersión en alta definición · Gran Canaria',
      facilitiesEyebrow: 'Instalaciones',
      facilitiesTitle: 'Nuestro centro en Playa de Arinaga',
      facilitiesAlt: 'Nuestras instalaciones en Playa de Arinaga',
      facilitiesPrev: 'Foto anterior',
      facilitiesNext: 'Foto siguiente',
      aboutEyebrow: 'Sobre nosotros',
      teamTitle: 'El equipo',
      statsLabel: 'Estadísticas',
      ctaTitle: 'Reserva tu inmersión',
    },
    sidemount: {
      alt: 'Buceo sidemount en Gran Canaria',
      prev: 'Foto anterior',
      next: 'Foto siguiente',
    },
    dives: {
      infoTab: 'Información',
      ratesTab: 'Inmersiones',
    },
    book: 'Reservar',
    ctaButton: 'RESERVA YA',
    ctaNote: 'Serás redirigido a nuestra página de reservas.',
    footer: {
      country: 'España',
      tagline: 'Inmersiones en toda la isla — todo el año',
      servicesTitle: 'Servicios',
      companyTitle: 'Empresa',
      legalTitle: 'Avisos legales',
      rightsReserved: 'Todos los derechos reservados.',
      textsCredit: 'Textos: Anne Debroise · Fotos: Juan Antonio / DR',
    },
    a11y: {
      mainNav: 'Navegación principal',
      footerNav: 'Navegación del pie de página',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
    },
  },
  en: {
    nav: {
      home: 'Dive Center',
      dives: 'Dives',
      baptisms: 'Discover Diving',
      courses: 'Courses',
      rates: 'Rates',
      gallery: 'Gallery',
      sidemount: 'Sidemount',
      contact: 'Contact',
    },
    legal: {
      privacy: 'Privacy',
      cancellation: 'Cancellation',
      terms: 'Terms',
    },
    home: {
      dondeEstamos: 'Where we are',
      metaTitle: 'Buceo Sur Gran Canaria — Dives all over the island',
      heroLabel: 'Hero',
      scrollLabel: 'Go to the next section',
      whoWeAreEyebrow: 'Who we are',
      certificationsLabel: 'Certifications',
      videoTitle: 'High-definition dive — Gran Canaria',
      videoCaption: 'High-definition dive · Gran Canaria',
      facilitiesEyebrow: 'Facilities',
      facilitiesTitle: 'Our center in Playa de Arinaga',
      facilitiesAlt: 'Our facilities in Playa de Arinaga',
      facilitiesPrev: 'Previous photo',
      facilitiesNext: 'Next photo',
      aboutEyebrow: 'About us',
      teamTitle: 'The team',
      statsLabel: 'Statistics',
      ctaTitle: 'Book your dive',
    },
    sidemount: {
      alt: 'Sidemount diving in Gran Canaria',
      prev: 'Previous photo',
      next: 'Next photo',
    },
    dives: {
      infoTab: 'Information',
      ratesTab: 'Dives',
    },
    book: 'Book now',
    ctaButton: 'BOOK NOW',
    ctaNote: "You'll be redirected to our booking page.",
    footer: {
      country: 'Spain',
      tagline: 'Dives all over the island — all year round',
      servicesTitle: 'Services',
      companyTitle: 'Company',
      legalTitle: 'Legal',
      rightsReserved: 'All rights reserved.',
      textsCredit: 'Texts: Anne Debroise · Photos: Juan Antonio / DR',
    },
    a11y: {
      mainNav: 'Main navigation',
      footerNav: 'Footer navigation',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
  },
  fr: {
    nav: {
      home: 'Centre de plongée',
      dives: 'Plongées',
      baptisms: 'Baptêmes',
      courses: 'Formations',
      rates: 'Tarifs',
      gallery: 'Galerie',
      sidemount: 'Sidemount',
      contact: 'Contact',
    },
    legal: {
      privacy: 'Confidentialité',
      cancellation: 'Annulation',
      terms: 'Conditions',
    },
    home: {
      dondeEstamos: 'Où nous sommes',
      metaTitle: 'Buceo Sur Gran Canaria — Plongées sur toute l’île',
      heroLabel: 'Accueil',
      scrollLabel: 'Aller à la section suivante',
      whoWeAreEyebrow: 'Qui sommes-nous',
      certificationsLabel: 'Certifications',
      videoTitle: 'Plongée en haute définition — Gran Canaria',
      videoCaption: 'Plongée en haute définition · Gran Canaria',
      facilitiesEyebrow: 'Installations',
      facilitiesTitle: 'Notre centre à Playa de Arinaga',
      facilitiesAlt: 'Nos installations à Playa de Arinaga',
      facilitiesPrev: 'Photo précédente',
      facilitiesNext: 'Photo suivante',
      aboutEyebrow: 'À propos de nous',
      teamTitle: 'L’équipe',
      statsLabel: 'Statistiques',
      ctaTitle: 'Réservez votre plongée',
    },
    sidemount: {
      alt: 'Plongée sidemount à Gran Canaria',
      prev: 'Photo précédente',
      next: 'Photo suivante',
    },
    dives: {
      infoTab: 'Informations',
      ratesTab: 'Plongées',
    },
    book: 'Réserver',
    ctaButton: 'RÉSERVEZ MAINTENANT',
    ctaNote: 'Vous serez redirigé vers notre page de réservation.',
    footer: {
      country: 'Espagne',
      tagline: 'Plongées sur toute l’île — toute l’année',
      servicesTitle: 'Services',
      companyTitle: 'Le centre',
      legalTitle: 'Mentions légales',
      rightsReserved: 'Tous droits réservés.',
      textsCredit: 'Textes : Anne Debroise · Photos : Juan Antonio / DR',
    },
    a11y: {
      mainNav: 'Navigation principale',
      footerNav: 'Navigation du pied de page',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
    },
  },
  de: {
    nav: {
      home: 'Tauchcenter',
      dives: 'Tauchgänge',
      baptisms: 'Schnuppertauchen',
      courses: 'Kurse',
      rates: 'Preise',
      gallery: 'Galerie',
      sidemount: 'Sidemount',
      contact: 'Kontakt',
    },
    legal: {
      privacy: 'Datenschutz',
      cancellation: 'Stornierung',
      terms: 'Bedingungen',
    },
    home: {
      dondeEstamos: 'Wo wir sind',
      metaTitle: 'Buceo Sur Gran Canaria — Tauchgänge auf der ganzen Insel',
      heroLabel: 'Startbereich',
      scrollLabel: 'Zum nächsten Abschnitt',
      whoWeAreEyebrow: 'Über uns',
      certificationsLabel: 'Zertifizierungen',
      videoTitle: 'Tauchgang in HD — Gran Canaria',
      videoCaption: 'Tauchgang in HD · Gran Canaria',
      facilitiesEyebrow: 'Einrichtungen',
      facilitiesTitle: 'Unser Center in Playa de Arinaga',
      facilitiesAlt: 'Unsere Einrichtungen in Playa de Arinaga',
      facilitiesPrev: 'Vorheriges Foto',
      facilitiesNext: 'Nächstes Foto',
      aboutEyebrow: 'Über das Team',
      teamTitle: 'Das Team',
      statsLabel: 'Statistiken',
      ctaTitle: 'Buche deinen Tauchgang',
    },
    sidemount: {
      alt: 'Sidemount-Tauchen auf Gran Canaria',
      prev: 'Vorheriges Foto',
      next: 'Nächstes Foto',
    },
    dives: {
      infoTab: 'Information',
      ratesTab: 'Tauchgänge',
    },
    book: 'Jetzt buchen',
    ctaButton: 'JETZT BUCHEN',
    ctaNote: 'Sie werden zu unserer Buchungsseite weitergeleitet.',
    footer: {
      country: 'Spanien',
      tagline: 'Tauchgänge auf der ganzen Insel — das ganze Jahr über',
      servicesTitle: 'Leistungen',
      companyTitle: 'Unternehmen',
      legalTitle: 'Rechtliches',
      rightsReserved: 'Alle Rechte vorbehalten.',
      textsCredit: 'Texte: Anne Debroise · Fotos: Juan Antonio / DR',
    },
    a11y: {
      mainNav: 'Hauptnavigation',
      footerNav: 'Fußzeilen-Navigation',
      openMenu: 'Menü öffnen',
      closeMenu: 'Menü schließen',
    },
  },
}
