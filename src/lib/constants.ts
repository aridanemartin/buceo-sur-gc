// Site-wide constants kept out of Sanity (rarely change, per design spec).
// Values sourced from docs/ (doc 1: socials & contacts; docs 2/3/5/6: booking URLs).

export const SITE = {
  name: 'Buceo Sur',
  fullName: 'Buceo Sur Gran Canaria',
  // Base booking link (used for Bautizos, doc 3).
  bookingUrl: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1',
  // Category-scoped booking links (docs 2/5/6): Inmersiones, Tarifas and Galería.
  bookingUrlDives: 'https://app.bukyapp.com/front/69b143d3c2395a856df8e4c1?categories=69bc71f9c2395a856d5778ac',
  email: 'buceosur.gc@gmail.com',
  phones: [
    { label: 'Anne', href: 'tel:+34651352573', display: '+34 651 35 25 73' },
    { label: 'Yann (instructor)', href: 'tel:+34655989917', display: '+34 655 98 99 17' },
  ],
  address: {
    line1: 'Calle Roger de Lauria, 80',
    line2: '35118 Playa de Arinaga',
    line3: 'Gran Canaria, España',
  },
  social: {
    facebook: 'https://www.facebook.com/BuceoSurGranCanaria/',
    instagram: 'https://www.instagram.com/buceosur/',
    youtube: 'https://www.youtube.com/channel/UCGy03Ag4tR23dXCmf9nll5w/featured',
    youtubeVideo: 'https://youtu.be/R8b97SNYsgM?si=PW8LxHU86SdrwtsW',
    googleReview: 'https://www.google.com/search?q=buceo+sur+gran+canaria',
  },
  // Partner certifications / logos (doc 1 footer + spec: ANMP, SSI, CMAS, Gobierno de Canarias).
  certifications: [
    { name: 'ANMP', logo: '/assets/certs/anmp.jpg' },
    { name: 'CMAS', logo: '/assets/certs/cmas.png' },
    { name: 'SSI', logo: '/assets/certs/ssi.jpg' },
    { name: 'Gobierno de Canarias', logo: '/assets/certs/gobierno.jpg' },
  ],
}
