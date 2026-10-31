import { trainingSchedule } from './trainingSchedule.mjs';
import { izonMetadata, izonPagePath } from './izonSeo.mjs';

export const localPagePath = '/tennis-de-table-rives-de-la-laurence';
export const localTowns = ['Saint-Loubès', 'Saint-Sulpice-et-Cameyrac', 'Sainte-Eulalie', 'Montussan', 'Yvrac', 'Beychac-et-Caillau'];
export const clubAddress = 'Impasse Max Linder, 33450 Saint-Loubès, France';
export const localHeading = 'Tennis de table et ping-pong près de chez vous';
export const localIntro = 'Vous habitez Saint-Loubès, Saint-Sulpice-et-Cameyrac, Sainte-Eulalie, Montussan, Yvrac ou Beychac-et-Caillau ? Saint-Loub’Ping vous accueille à Saint-Loubès pour jouer au tennis de table, du premier échange à la compétition.';
export const localTownGuides = [
  { town: 'Saint-Loubès', id: 'saint-loubes', heading: 'Jouer au tennis de table à Saint-Loubès', text: 'La salle de Saint-Loub’Ping se trouve impasse Max Linder, 33450 Saint-Loubès. Pour une première séance, choisissez votre groupe selon votre âge et votre pratique : découverte, loisir ou compétition.', tip: 'Pour un enfant de 7 à 10 ans, consultez les créneaux du mercredi après-midi et du samedi matin.' },
  { town: 'Saint-Sulpice-et-Cameyrac', id: 'saint-sulpice-et-cameyrac', heading: 'Le ping-pong près de Saint-Sulpice-et-Cameyrac', text: 'Vous recherchez une activité de raquette pour vous ou votre enfant ? Le club accueille les habitants de Saint-Sulpice-et-Cameyrac dans sa salle de Saint-Loubès. Préparez votre itinéraire avant de réserver votre essai.', tip: 'Les adolescents disposent de créneaux loisirs le mercredi et le jeudi ; les groupes compétition ont leurs propres horaires.' },
  { town: 'Sainte-Eulalie', id: 'sainte-eulalie', heading: 'Le tennis de table près de Sainte-Eulalie', text: 'Débuter le ping, reprendre après une pause ou jouer régulièrement : les habitants de Sainte-Eulalie peuvent rejoindre les groupes du club à Saint-Loubès. La séance d’essai permet de trouver un groupe adapté à votre niveau.', tip: 'Pour une pratique adulte sans compétition, le groupe loisirs se retrouve le jeudi soir.' },
  { town: 'Montussan', id: 'montussan', heading: 'Découvrir le ping-pong près de Montussan', text: 'Vous habitez Montussan et cherchez un sport pour votre enfant ? Retrouvez à Saint-Loubès des groupes jeunes, du loisir au perfectionnement. Indiquez son âge et son expérience lors de la demande d’essai pour être orienté vers le bon créneau.', tip: 'Le samedi matin propose un groupe loisirs 7–10 ans, suivi du groupe jeunes perfectionnement.' },
  { town: 'Yvrac', id: 'yvrac', heading: 'Rejoindre un club de tennis de table près d’Yvrac', text: 'Vous comparez les possibilités de pratique autour d’Yvrac ? Saint-Loub’Ping propose à Saint-Loubès des groupes jeunes et adultes, en loisir comme en compétition. Consultez les horaires et les formules d’adhésion avant de faire votre choix.', tip: 'Pour reprendre en loisir ou envisager la compétition, contactez le club afin de choisir le groupe correspondant à votre projet.' },
  { town: 'Beychac-et-Caillau', id: 'beychac-et-caillau', heading: 'Le ping-pong près de Beychac-et-Caillau', text: 'Les habitants de Beychac-et-Caillau sont les bienvenus au club de Saint-Loubès. Préparez votre déplacement vers la salle impasse Max Linder et repérez un créneau compatible avec votre emploi du temps.', tip: 'Jeunes et adultes ont des groupes distincts. Une demande d’essai suffit pour préciser votre âge, votre niveau et vos disponibilités.' },
];
const localProfileDefinitions = [
  { id: 'enfants', title: 'Enfants · loisirs 7–10 ans', description: 'Découvrir le ping-pong et apprendre les premiers gestes dans un groupe de son âge.', labels: ['Loisirs 7–10 ans'] },
  { id: 'adolescents', title: 'Jeunes · loisirs 11–16 ans', description: 'Jouer, progresser et partager une activité avec d’autres jeunes.', labels: ['Loisirs 11–16 ans'] },
  { id: 'perfectionnement', title: 'Jeunes · perfectionnement', description: 'Poursuivre l’apprentissage dans un groupe de niveau, après orientation par l’entraîneur.', labels: ['Jeunes perfectionnement'] },
  { id: 'adultes-loisir', title: 'Adultes · loisir', description: 'Débuter ou reprendre le tennis de table pour le plaisir, sans objectif de compétition.', labels: ['Adultes loisirs'] },
  { id: 'competition', title: 'Jeunes et adultes · compétition', description: 'S’entraîner pour les rencontres. Le club vous oriente selon votre âge, votre niveau et votre projet.', labels: ['Jeunes compétitions', 'Adultes compétitions'] },
  { id: 'libre', title: 'Adhérents · entraînement libre', description: 'Créneaux de pratique libre pour les adhérents. Pour un premier essai, contactez le club avant de venir.', labels: ['Entraînement libre'] },
];
export const localTrainingProfiles = localProfileDefinitions.map(profile => ({
  ...profile,
  slots: trainingSchedule.flatMap(({ day, slots }) => slots.filter(slot => profile.labels.includes(slot.label)).map(slot => ({ day, time: slot.time, label: slot.label }))),
}));
export const localFaqs = [
  { question: 'Tennis de table ou ping-pong : peut-on venir simplement pour le loisir ?', answer: 'Oui. Le ping-pong et le tennis de table désignent le même sport ; au club, vous pouvez pratiquer en loisir ou en compétition. Les créneaux dépendent de votre âge et de votre groupe, pas de votre commune de résidence.' },
  { question: 'Comment demander un essai depuis une commune voisine ?', answer: 'Utilisez le formulaire Essai gratuit et indiquez votre âge, votre niveau et vos disponibilités. Le club vous orientera vers un créneau adapté. Toutes les séances ont lieu impasse Max Linder à Saint-Loubès, et non dans les communes voisines.' },
  { question: 'Faut-il habiter Saint-Loubès pour rejoindre le club ?', answer: 'Non. Le club accueille aussi les habitants de Saint-Sulpice-et-Cameyrac, Sainte-Eulalie, Montussan, Yvrac, Beychac-et-Caillau et des autres communes voisines. Tous les entraînements du club ont lieu à Saint-Loubès.' },
  { question: 'Peut-on commencer le ping sans avoir déjà joué en club ?', answer: 'Oui. Enfants, adolescents et adultes peuvent découvrir le tennis de table. Réservez une séance d’essai gratuite pour nous indiquer votre âge et votre niveau et trouver un créneau adapté.' },
  { question: 'Où se déroulent les entraînements ?', answer: 'La salle du club se trouve impasse Max Linder, 33450 Saint-Loubès. Consultez le planning des entraînements avant de venir : les créneaux dépendent de l’âge et du groupe.' },
  { question: 'Comment connaître les horaires et les tarifs ?', answer: 'La page Horaires présente le planning des entraînements. La page Adhésions regroupe les tarifs et les documents à télécharger. Vous pouvez aussi contacter le club au 06 88 46 68 59.' },
];
export const localMetadata = {
  [izonPagePath]: izonMetadata,
  '/': { title: 'Tennis de table à Saint-Loubès — Saint-Loub’Ping', description: 'Tennis de table à Saint-Loubès : enfants, adultes, loisir et compétition. Ouvert aux habitants des Rives de la Laurence. Réservez un essai gratuit.' },
  [localPagePath]: { title: 'Tennis de table et ping-pong · Rives de la Laurence — Saint-Loub’Ping', description: 'Tennis de table et ping-pong à Saint-Loubès : accès depuis les six communes des Rives de la Laurence, créneaux enfants et adultes, essai gratuit.' },
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
