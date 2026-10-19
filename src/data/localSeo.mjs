export const localPagePath = '/tennis-de-table-rives-de-la-laurence';
export const localTowns = ['Saint-Loubès', 'Saint-Sulpice-et-Cameyrac', 'Sainte-Eulalie', 'Montussan', 'Yvrac', 'Beychac-et-Caillau'];
export const clubAddress = 'Impasse Max Linder, 33450 Saint-Loubès, France';
export const localHeading = 'Tennis de table à Saint-Loubès, pour les Rives de la Laurence';
export const localIntro = 'Vous habitez Saint-Loubès, Saint-Sulpice-et-Cameyrac, Sainte-Eulalie, Montussan, Yvrac ou Beychac-et-Caillau ? Saint-Loub’Ping vous accueille à Saint-Loubès pour jouer au tennis de table, du premier échange à la compétition.';
export const localFaqs = [
  { question: 'Faut-il habiter Saint-Loubès pour rejoindre le club ?', answer: 'Non. Le club accueille aussi les habitants de Saint-Sulpice-et-Cameyrac, Sainte-Eulalie, Montussan, Yvrac, Beychac-et-Caillau et des autres communes voisines. Tous les entraînements du club ont lieu à Saint-Loubès.' },
  { question: 'Peut-on commencer le ping sans avoir déjà joué en club ?', answer: 'Oui. Enfants, adolescents et adultes peuvent découvrir le tennis de table. Réservez une séance d’essai gratuite pour nous indiquer votre âge et votre niveau et trouver un créneau adapté.' },
  { question: 'Où se déroulent les entraînements ?', answer: 'La salle du club se trouve impasse Max Linder, 33450 Saint-Loubès. Consultez le planning des entraînements avant de venir : les créneaux dépendent de l’âge et du groupe.' },
  { question: 'Comment connaître les horaires et les tarifs ?', answer: 'La page Horaires présente le planning des entraînements. La page Adhésions regroupe les tarifs et les documents à télécharger. Vous pouvez aussi contacter le club au 06 88 46 68 59.' },
];
export const localMetadata = {
  '/': { title: 'Tennis de table à Saint-Loubès — Saint-Loub’Ping', description: 'Tennis de table à Saint-Loubès : enfants, adultes, loisir et compétition. Ouvert aux habitants des Rives de la Laurence. Réservez un essai gratuit.' },
  [localPagePath]: { title: 'Tennis de table · Rives de la Laurence — Saint-Loub’Ping', description: 'Club à Saint-Loubès, près de Saint-Sulpice-et-Cameyrac, Sainte-Eulalie, Montussan, Yvrac et Beychac-et-Caillau. Horaires, accès et essai gratuit.' },
  '/essai-gratuit': { title: 'Essai gratuit de tennis de table à Saint-Loubès — Saint-Loub’Ping', description: 'Enfant, ado ou adulte : essayez le ping à Saint-Loubès. Club ouvert aux habitants des Rives de la Laurence. Demandez votre séance d’essai gratuite.' },
  '/adhesions': { title: 'Inscription tennis de table à Saint-Loubès — Saint-Loub’Ping', description: 'Tarifs et inscription au club de tennis de table à Saint-Loubès. Jeunes, adultes, loisir et compétition : rejoignez Saint-Loub’Ping.' },
  '/horaires': { title: 'Horaires tennis de table à Saint-Loubès — Saint-Loub’Ping', description: 'Consultez les horaires des entraînements de tennis de table à Saint-Loubès : jeunes, adultes loisir et compétition, saison 2026–2027.' },
  '/contact': { title: 'Salle de tennis de table à Saint-Loubès : accès et contact', description: 'Contactez Saint-Loub’Ping : salle impasse Max Linder, 33450 Saint-Loubès. Téléphone, adresse et accès depuis les communes des Rives de la Laurence.' },
};
export const directionsFrom = (town) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${town}, Gironde, France`)}&destination=${encodeURIComponent(clubAddress)}`;
export const clubStructuredData = {
  '@context': 'https://schema.org',
  '@type': ['SportsActivityLocation', 'SportsClub'],
  '@id': 'https://www.saintloubping.fr/#club',
  name: 'Saint-Loub’Ping',
  alternateName: 'Saint Loub Ping',
  url: 'https://www.saintloubping.fr/',
  description: 'Club de tennis de table situé à Saint-Loubès en Gironde, accueillant les enfants et les adultes des Rives de la Laurence, en loisir et en compétition.',
  sport: 'Tennis de table',
  telephone: '+33688466859',
  email: 'saintloubping@laposte.net',
  logo: 'https://www.saintloubping.fr/images/logo/telecharge.jpg',
  image: 'https://www.saintloubping.fr/images/hero/club-training.jpg',
  address: { '@type': 'PostalAddress', streetAddress: 'Impasse Max Linder', postalCode: '33450', addressLocality: 'Saint-Loubès', addressRegion: 'Gironde', addressCountry: 'FR' },
  areaServed: localTowns.map((name) => ({ '@type': 'City', name })),
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clubAddress)}`,
  sameAs: ['https://www.facebook.com/people/Saint-LoubPing/100085857905183/'],
};
