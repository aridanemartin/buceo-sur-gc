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
  book: string
  footer: {
    servicesTitle: string
    companyTitle: string
    legalTitle: string
    rightsReserved: string
    textsCredit: string
  }
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
    book: 'Reservar',
    footer: {
      servicesTitle: 'Servicios',
      companyTitle: 'Empresa',
      legalTitle: 'Avisos legales',
      rightsReserved: 'Todos los derechos reservados.',
      textsCredit: 'Textos: Anne Debroise · Fotos: Juan Antonio / DR',
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
    book: 'Book now',
    footer: {
      servicesTitle: 'Services',
      companyTitle: 'Company',
      legalTitle: 'Legal',
      rightsReserved: 'All rights reserved.',
      textsCredit: 'Texts: Anne Debroise · Photos: Juan Antonio / DR',
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
    book: 'Réserver',
    footer: {
      servicesTitle: 'Services',
      companyTitle: 'Le centre',
      legalTitle: 'Mentions légales',
      rightsReserved: 'Tous droits réservés.',
      textsCredit: 'Textes : Anne Debroise · Photos : Juan Antonio / DR',
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
    book: 'Jetzt buchen',
    footer: {
      servicesTitle: 'Leistungen',
      companyTitle: 'Unternehmen',
      legalTitle: 'Rechtliches',
      rightsReserved: 'Alle Rechte vorbehalten.',
      textsCredit: 'Texte: Anne Debroise · Fotos: Juan Antonio / DR',
    },
  },
}
