// Canonical dive-site data for the Galería page.
// doc 6 (galeria de los sitios) says to reproduce exactly the content of the old live page;
// Spanish descriptions below are the real text from that page (translated to en/fr/de).
export type LocaleValue = Partial<Record<'es' | 'en' | 'fr' | 'de', string>>

const loc = (es: string, en: string, fr: string, de: string): LocaleValue => ({ es, en, fr, de })

export interface DiveSiteSeed {
  _id: string
  _type: 'diveSite'
  name: LocaleValue
  depthRange: string
  levelTag: LocaleValue
  description: LocaleValue
  images: string[]
  youtubeUrl?: string
  order: number
}

export const diveSitesData: DiveSiteSeed[] = [
  {
    _id: 'site-el-cabron',
    _type: 'diveSite',
    name: loc('Reserva marina El Cabrón - Arinaga', 'El Cabrón marine reserve - Arinaga', 'Réserve marine El Cabrón - Arinaga', 'Meeresschutzgebiet El Cabrón - Arinaga'),
    depthRange: '5-30 m',
    levelTag: loc('Todos los niveles', 'All levels', 'Tous niveaux', 'Alle Levels'),
    description: loc(
      'Son 8 inmersiones diferentes para todos los niveles. La reserva se encuentra al lado del centro, así que es nuestra zona preferida. Conocemos cada rincón y cada pez. Es una reserva, encontrarás las inmersiones más espectaculares de la isla y las más ricas en fauna variada. Imprescindible para los amantes de las cuevas, pero no exclusivamente. Todos los días se ve diferente, ¡es imposible cansarse! Si sólo tienes que bucear en un lugar de la isla, entonces es en la zona de Cabrón.',
      'There are 8 different dives for all levels. The reserve is right next to the centre, so it is our favourite area. We know every corner and every fish. It is a reserve: you will find the most spectacular dives on the island and the richest in varied wildlife. Essential for cave lovers, but not only. Every day it looks different — you can never get tired of it! If you only have to dive in one place on the island, then it is in the Cabrón area.',
      'Ce sont 8 plongées différentes pour tous les niveaux. La réserve se trouve à côté du centre, c’est donc notre zone préférée. Nous connaissons chaque recoin et chaque poisson. C’est une réserve : vous y trouverez les plongées les plus spectaculaires de l’île et les plus riches en faune variée. Indispensable pour les amateurs de grottes, mais pas seulement. Chaque jour c’est différent, on ne s’en lasse pas ! Si vous ne devez plonger qu’à un seul endroit de l’île, c’est dans la zone de Cabrón.',
      'Es gibt 8 verschiedene Tauchgänge für alle Levels. Das Schutzgebiet liegt direkt neben dem Zentrum, daher ist es unser Lieblingsgebiet. Wir kennen jede Ecke und jeden Fisch. Es ist ein Schutzgebiet: Hier finden Sie die spektakulärsten Tauchgänge der Insel und die reichste Vielfalt an Lebewesen. Unverzichtbar für Höhlenliebhaber, aber nicht nur. Jeden Tag sieht es anders aus – man kann sich nicht sattsehen! Wenn Sie nur an einem Ort der Insel tauchen können, dann in der Zone von Cabrón.',
    ),
    images: [],
    youtubeUrl: 'https://www.youtube-nocookie.com/embed/3ZaJwr3My3Y',
    order: 1,
  },
  {
    _id: 'site-risco-verde',
    _type: 'diveSite',
    name: loc('Risco Verde - Arinaga', 'Risco Verde - Arinaga', 'Risco Verde - Arinaga', 'Risco Verde - Arinaga'),
    depthRange: '6-20 m',
    levelTag: loc('Todos los niveles', 'All levels', 'Tous niveaux', 'Alle Levels'),
    description: loc(
      'Para todos los niveles entre 6 y 20 m. Uno de los sitios más conocidos de la isla, a 500 m del club. Realizamos en particular nuestros bautizos y formaciones en las zonas de poca profundidad. También es un sitio muy apreciado por los fotógrafos y buceadores por su luminosidad y la diversidad de su fauna.',
      'For all levels between 6 and 20 m. One of the best-known sites on the island, 500 m from the club. We run our baptisms and courses in the shallow areas in particular. It is also a site much appreciated by photographers and divers for its luminosity and the diversity of its wildlife.',
      'Pour tous les niveaux entre 6 et 20 m. L’un des sites les plus connus de l’île, à 500 m du club. Nous y effectuons notamment nos baptêmes et nos formations dans les zones de faible profondeur. C’est aussi un site très apprécié des photographes et des plongeurs pour sa luminosité et la diversité de sa faune.',
      'Für alle Levels zwischen 6 und 20 m. Eine der bekanntesten Stellen der Insel, 500 m vom Club entfernt. Wir machen dort besonders unsere Schnuppertauchgänge und Kurse in den flachen Bereichen. Auch bei Fotografen und Tauchern beliebt wegen des Lichts und der Artenvielfalt.',
    ),
    images: [],
    order: 2,
  },
  {
    _id: 'site-tufia',
    _type: 'diveSite',
    name: loc('Tufia', 'Tufia', 'Tufia', 'Tufia'),
    depthRange: '10-22 m',
    levelTag: loc('Todos los niveles', 'All levels', 'Tous niveaux', 'Alle Levels'),
    description: loc(
      'Para todos los niveles entre 10 y 22 m. Otro lugar encantador, lejos del turismo industrial, pero muy apreciado por los residentes. Ahí encuentras cuevas, frecuentemente bancos de roncadores y toda la fauna habitual de las aguas canarias. Algunos incluso han visto tiburones martillo… Excepcional y poco frecuente, pero es la magia del mar.',
      'For all levels between 10 and 22 m. Another charming spot, far from industrial tourism but much appreciated by residents. There you find caves, often schools of grunts and all the usual wildlife of Canarian waters. Some have even seen hammerhead sharks… Exceptional and rare, but that is the magic of the sea.',
      'Pour tous les niveaux entre 10 et 22 m. Un autre endroit charmant, loin du tourisme industriel, mais très apprécié des résidents. On y trouve des grottes, souvent des bancs de gorettes et toute la faune habituelle des eaux canariennes. Certains ont même vu des requins-marteaux… Exceptionnel et rare, mais c’est la magie de la mer.',
      'Für alle Levels zwischen 10 und 22 m. Ein weiterer charmanter Ort, fernab vom industriellen Tourismus, aber bei Einheimischen sehr beliebt. Es gibt Höhlen, oft Schwärme von Grunzern und die übliche Tierwelt der kanarischen Gewässer. Manche haben sogar Hammerhaie gesehen… Außergewöhnlich und selten, aber das ist die Magie des Meeres.',
    ),
    images: [],
    order: 3,
  },
  {
    _id: 'site-sardina-del-norte',
    _type: 'diveSite',
    name: loc('Sardina del Norte', 'Sardina del Norte', 'Sardina del Norte', 'Sardina del Norte'),
    depthRange: '10-18 m',
    levelTag: loc('Todos los niveles', 'All levels', 'Tous niveaux', 'Alle Levels'),
    description: loc(
      'Todos los niveles entre 10 y 18 m. Un pequeño pueblo de pescadores en la zona más auténtica de Gran Canaria. A los gourmets les encanta comer en el puerto después de las inmersiones. Es el segundo sitio favorito de los buceadores residentes, muy popular entre los fotógrafos. Es famoso por su enorme banco de barracudas y sus angelotes.',
      'All levels between 10 and 18 m. A small fishing village in the most authentic part of Gran Canaria. Food lovers enjoy eating at the harbour after their dives. It is the second favourite site of resident divers and very popular with photographers. It is famous for its huge school of barracudas and its angel sharks.',
      'Tous les niveaux entre 10 et 18 m. Un petit village de pêcheurs dans la zone la plus authentique de Grande Canarie. Les gourmets adorent manger au port après les plongées. C’est le deuxième site favori des plongeurs résidents, très prisé des photographes. Il est célèbre pour son énorme banc de barracudas et ses anges de mer.',
      'Alle Levels zwischen 10 und 18 m. Ein kleines Fischerdorf in der authentischsten Gegend Gran Canarias. Feinschmecker lieben das Essen im Hafen nach den Tauchgängen. Es ist der zweitbeliebteste Ort der ansässigen Taucher und bei Fotografen sehr beliebt. Berühmt für seinen riesigen Barrakuda-Schwarm und seine Engelhaie.',
    ),
    images: [],
    order: 4,
  },
  {
    _id: 'site-pasito-blanco',
    _type: 'diveSite',
    name: loc('Pasito Blanco', 'Pasito Blanco', 'Pasito Blanco', 'Pasito Blanco'),
    depthRange: '15-22 m',
    levelTag: loc('Todos los niveles', 'All levels', 'Tous niveaux', 'Alle Levels'),
    description: loc(
      'Todos los niveles entre 15 y 22 m. El sitio favorito del jefe en el sur. Un gran arrecife depositado milagrosamente en un fondo arenoso blanco ultraluminoso que atrae a toda la fauna de los alrededores, al que accedemos en barco desde el puerto de Mogán. No es raro encontrarse con docenas de rayas. Un gran Diodon muy tímido se esconde en una cueva: será su desafío encontrarlo.',
      'All levels between 15 and 22 m. The boss’s favourite site in the south. A large reef miraculously resting on an ultra-bright white sandy bottom that attracts all the surrounding wildlife, accessed by boat from Mogán harbour. It is not rare to come across dozens of rays. A very shy large porcupine fish hides in a cave: your challenge will be to find it.',
      'Tous les niveaux entre 15 et 22 m. Le site préféré du patron dans le sud. Un grand récif déposé miraculeusement sur un fond sableux blanc ultra-lumineux qui attire toute la faune des alentours, auquel nous accédons en bateau depuis le port de Mogán. Il n’est pas rare de croiser des dizaines de raies. Un gros poisson porc-épic très timide se cache dans une grotte : votre défi sera de le trouver.',
      'Alle Levels zwischen 15 und 22 m. Der Lieblingsplatz des Chefs im Süden. Ein großes Riff, das wie durch ein Wunder auf einem ultraleuchtend weißen Sandgrund liegt und alle umliegenden Tiere anzieht. Wir erreichen es per Boot vom Hafen Mogán. Dutzende Rochen sind keine Seltenheit. Ein sehr scheuer großer Igelfisch versteckt sich in einer Höhle: Ihre Herausforderung ist es, ihn zu finden.',
    ),
    images: [],
    order: 5,
  },
  {
    _id: 'site-cermona',
    _type: 'diveSite',
    name: loc('Pecio de Mogán «Cermona»', 'Mogán wreck “Cermona”', 'Épave de Mogán « Cermona »', 'Wrack von Mogán „Cermona“'),
    depthRange: '15-20 m',
    levelTag: loc('Todos los niveles', 'All levels', 'Tous niveaux', 'Alle Levels'),
    description: loc(
      'Todos los niveles entre 15 y 20 m. Una increíble concentración de vida: enormes bancos de barracudas y a menudo rayas y morenas que se esconden en los rincones de los restos del barco… Y la oportunidad única de cruzar un verdadero submarino amarillo, como en la canción de los Beatles.',
      'All levels between 15 and 20 m. An incredible concentration of life: huge schools of barracudas and often rays and moray eels hiding in the corners of the wreck… And the unique opportunity to cross a real yellow submarine, like in the Beatles song.',
      'Tous les niveaux entre 15 et 20 m. Une concentration de vie incroyable : d’énormes bancs de barracudas et souvent des raies et des murènes cachées dans les recoins de l’épave… Et l’occasion unique de croiser un vrai sous-marin jaune, comme dans la chanson des Beatles.',
      'Alle Levels zwischen 15 und 20 m. Eine unglaubliche Konzentration an Leben: riesige Barrakuda-Schwärme und oft Rochen und Muränen, die sich in den Ecken des Wracks verstecken… Und die einmalige Gelegenheit, ein echtes gelbes U-Boot zu überqueren, wie im Beatles-Song.',
    ),
    images: [],
    order: 6,
  },
  {
    _id: 'site-arona',
    _type: 'diveSite',
    name: loc('Pecio profundo «Arona»', 'Deep wreck “Arona”', 'Épave profonde « Arona »', 'Tiefes Wrack „Arona“'),
    depthRange: '25-40 m',
    levelTag: loc('Avanzado', 'Advanced', 'Avancé', 'Fortgeschritten'),
    description: loc(
      'Entre 25 y 40 m, nivel avanzado, Nitrox obligatorio. Sólo para buceadores confirmados, con especialidad profundo y con nitrox, y cuando las condiciones del mar lo permiten. Sin duda el pecio más espectacular de las aguas canarias.',
      'Between 25 and 40 m, advanced level, Nitrox mandatory. Only for confirmed divers with a deep speciality and Nitrox, and when sea conditions allow. Without doubt the most spectacular wreck in Canarian waters.',
      'Entre 25 et 40 m, niveau avancé, Nitrox obligatoire. Réservé aux plongeurs confirmés, avec la spécialité profonde et le nitrox, et quand les conditions de mer le permettent. Sans doute l’épave la plus spectaculaire des eaux canariennes.',
      'Zwischen 25 und 40 m, Fortgeschrittene, Nitrox Pflicht. Nur für bestätigte Taucher mit Tiefenspezialisierung und Nitrox und wenn die Seebedingungen es erlauben. Zweifellos das spektakulärste Wrack der kanarischen Gewässer.',
    ),
    images: [],
    order: 7,
  },
  {
    _id: 'site-caleta-de-abajo',
    _type: 'diveSite',
    name: loc('Caleta de Abajo', 'Caleta de Abajo', 'Caleta de Abajo', 'Caleta de Abajo'),
    depthRange: '5-15 m',
    levelTag: loc('Iniciación', 'Beginner-friendly', 'Débutant', 'Anfängerfreundlich'),
    description: loc(
      'Uno de nuestros sitios favoritos, sólo cuando las condiciones meteorológicas son muy favorables.',
      'One of our favourite sites, only when weather conditions are very favourable.',
      'L’un de nos sites préférés, uniquement lorsque les conditions météorologiques sont très favorables.',
      'Einer unserer Lieblingsplätze, nur bei sehr günstigen Wetterbedingungen.',
    ),
    images: [],
    order: 8,
  },
  {
    _id: 'site-comotu',
    _type: 'diveSite',
    name: loc('Pecio «Comotu»', '“Comotu” wreck', 'Épave « Comotu »', 'Wrack „Comotu“'),
    depthRange: '30 m',
    levelTag: loc('Avanzado', 'Advanced', 'Avancé', 'Fortgeschritten'),
    description: loc(
      'Pequeño naufragio lleno de vida a una profundidad de 30 m. Siempre hay enormes bancos de roncadores y barracudas gigantes. Sobre un fondo arenoso es frecuente encontrar tiburones angelotes, rayas mantelinas o rayas.',
      'A small wreck full of life at a depth of 30 m. There are always huge schools of grunts and giant barracudas. On the sandy bottom you will often find angel sharks, devil rays or rays.',
      'Petite épave pleine de vie à 30 m de profondeur. On y trouve toujours d’énormes bancs de gorettes et des barracudas géants. Sur le fond sableux, on rencontre fréquemment des anges de mer, des raies mantelina ou des raies.',
      'Ein kleines Wrack voller Leben in 30 m Tiefe. Es gibt immer riesige Schwärme von Grunzern und riesige Barrakudas. Auf dem sandigen Grund findet man häufig Engelhaie, Teufelsrochen oder Rochen.',
    ),
    images: [],
    order: 9,
  },
]
