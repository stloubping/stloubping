export interface NewsItem {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  link: string;
  image: string;
}

export const allNewsItems: NewsItem[] = [
  // 1️⃣ Annonce de la nouvelle saison 2026-2027 (Toujours en première position)
  {
    id: 701,
    title: "Saison 2026-2027 : Ouverture des Inscriptions & Adhésions !",
    date: "Juillet 2026",
    location: "St Loub Ping - Saint-Loubès",
    description: "La nouvelle saison 2026-2027 se prépare ! Retrouvez nos nouveaux tarifs, le planning complet des entraînements ainsi que tous les formulaires téléchargeables. Rejoignez-nous pour une nouvelle année de tennis de table dans la convivialité et la passion !",
    link: "/adhesions",
    image: "/images/adhesions/tarifs-2026-2027.jpg",
  },
  // 2️⃣ Convocation Assemblée Générale 2026
  {
    id: 901,
    title: "Convocation Assemblée Générale",
    date: "Samedi 29 Août 2026",
    location: "Salle du club - Saint-Loubès",
    description: "L'ensemble des adhérents, dirigeants et parents du club St Loub Ping est convoqué à l'Assemblée Générale Ordinaire du club qui se tiendra le Samedi 29 Août 2026. Retrouvez et téléchargez le document officiel de convocation ci-dessous.",
    link: "/documents/actualites/Convocation-AG-2026.pdf",
    image: "/images/actualites/convocation-ag-2026.png",
  },
  // 3️⃣ Dernier stage de la saison 2025-2026
  {
    id: 801,
    title: "Retour sur le dernier stage de la saison 2025-2026 !",
    date: "Juillet 2026",
    location: "Salle du club - Saint-Loubès",
    description: "La semaine dernière s'est déroulé le dernier stage de la saison 2025-2026, 21 joueurs y ont participé sur un ou plusieurs jours avec la moitié issu du groupe jeunes compétiteurs et l'autre moitié des différents groupes loisirs.\n\nAu programme, du travail technique et tactique sur les matinées avec notamment beaucoup de panier de balles, des jeux de société sur les pauses déjeuners, un exercice physique par équipes en début d'après-midi suivi de différentes formules compétitives.\n\nLa journée du jeudi après-midi a permis ainsi par exemple de réaliser une compétition sur multi-tables (ultimate, z-ping, mini-table, camion, fleuve ...) et le vendredi le stage s'est terminé avec le traditionnel match en 11 manches gagnantes suivi d'un goûter partagé avec l'ensemble des stagiaires pour clôturer cette saison.\n\nNous souhaitons à tous nos joueurs un très bel été, de quoi se reposer et revenir en pleine forme à la rentrée.",
    link: "#",
    image: "/images/actualites/stage-fin-saison-2026-1.jpg",
  },
  // 4️⃣ Résultats du tournoi 2026
  {
    id: 301,
    title: "Résultats du tournoi 2026 – Découvrez les vainqueurs",
    date: "12 Avril 2026",
    location: "Gymnase de Saint-Loubès",
    description: "Félicitations aux champions de chaque tableau ! Retrouvez le palmarès complet et les temps forts de la finale.",
    link: "/tournoi/2026/resultats",
    image: "/images/tournoi/2026/photo-2.jpg",
  },
  // 5️⃣ Galerie photos du tournoi 2026
  {
    id: 302,
    title: "Galerie photos du tournoi 2026 – Revivez les meilleurs moments",
    date: "13 Avril 2026",
    location: "Salle du club",
    description: "Plus de 30 clichés capturant l’énergie et l’émotion du tournoi. Cliquez pour agrandir chaque photo.",
    link: "/tournoi/2026/photos",
    image: "/images/tournoi/2026/galerie-cover.jpg",
  },
  // 6️⃣ Diplômes jeunes
  {
    id: 501,
    title: "Une soixantaine de jeunes pongistes médaillés",
    date: "12 Mars 2026",
    location: "Salle Jacques-Durieux, Saint-Loubès",
    description: "Philippe Roux, président du St-Loub' Ping, a remis les diplômes aux jeunes du club. Ce programme de progression, dirigé par l'entraîneur Pierre-Louis Stevance, a vu 49 jeunes réussir les tests de la balle blanche et 13 ceux de la balle orange. Une belle récompense pour l'investissement de nos futurs champions !",
    link: "#",
    image: "/images/actualites/jeunes-medailles.jpg",
  },
  // 7️⃣ Maillot officiel
  {
    id: 401,
    title: "Le Maillot Officiel est Arrivé !",
    date: "Disponible maintenant",
    location: "Boutique du Club",
    description: "Représentez fièrement le St Loub Ping ! Le nouveau maillot officiel est disponible à la commande. Découvrez les tailles et les modalités d'achat sur notre page Boutique.",
    link: "/boutique",
    image: "/images/boutique/maillot-club-officiel.png",
  },
  // 8️⃣ Stage de Noël
  {
    id: 101,
    title: "Stage de Noël pour les Jeunes",
    date: "22, 23 et 24 Décembre 2025",
    location: "Salle du club",
    description: "Un stage intensif pour les jeunes compétiteurs souhaitant améliorer leur technique et leur stratégie avant les fêtes. Encadrement par nos meilleurs entraîneurs.",
    link: "/adhesions",
    image: "/images/actualites/stage-de-noel.jpg",
  },
  // --- ARCHIVES ---
  {
    id: 201,
    title: "Tournoi de Noël des Jeunes",
    date: "20 Décembre 2025",
    location: "Salle du club",
    description: "Le Saint Loub’ping a organisé son traditionnel tournoi de Noël. Comme chaque année, cette compétition amicale a réuni nos jeunes licenciés pour un moment de sport et de partage.",
    link: "#",
    image: "/images/actualites/bordeauxrivedroite-5abc395193ac4b90ab4842d2eea90891-104939-ph0.avif",
  },
  {
    id: 202,
    title: "Le club de tennis de table loubésien a organisé sa compétition amicale annuelle",
    date: "20 Décembre 2023",
    location: "Salle Jacques-Durieux, Saint-Loubès",
    description: "Samedi 20 décembre, le club de tennis de table loubésien, le Saint Loub’ping qui compte 132 licenciés, a organisé le tournoi de Noël des jeunes. Comme chaque année, au premier jour des vacances, cette compétition...",
    link: "#",
    image: "/images/actualites/bordeauxrivedroite-5abc395193ac4b90ab4842d2eea90891-104939-ph0.avif",
  },
  {
    id: 203,
    title: "Championnats de France par équipes 2024",
    date: "15 Mai 2024",
    location: "Palais des Sports, Paris",
    description: "Nos équipes se sont brillamment illustrées lors des Championnats de France, atteignant des sommets inattendus et montrant un esprit d'équipe exemplaire. Une performance mémorable pour le club !",
    link: "#",
    image: "/images/actualites/jeunes-medailles.jpg",
  },
  {
    id: 204,
    title: "Stage d'été intensif pour les jeunes",
    date: "01 Juillet 2024",
    location: "Complexe Sportif Municipal",
    description: "Un stage d'été intensif est organisé pour les jeunes licenciés, encadré par nos meilleurs entraîneurs. Au programme : perfectionnement technique, matchs amicaux et préparation physique.",
    link: "#",
    image: "/images/actualites/stage-de-noel.jpg",
  },
  {
    id: 205,
    title: "Soirée de Gala Annuelle du Club",
    date: "20 Septembre 2024",
    location: "Salle des Fêtes Communale",
    description: "Venez célébrer une année riche en succès et en émotions lors de notre soirée de gala annuelle. Remise des prix, dîner et animations sont au programme pour tous les membres et leurs familles.",
    link: "#",
    image: "/images/actualites/bordeauxrivedroite-5abc395193ac4b90ab4842d2eea90891-104939-ph0.avif",
  },
  {
    id: 206,
    title: "Nouveaux équipements pour la saison",
    date: "10 Août 2024",
    location: "Club House",
    description: "Le club est fier d'annoncer l'acquisition de nouvelles tables, robots d'entraînement et balles pour la prochaine saison. Venez découvrir nos installations améliorées dès la rentrée !",
    link: "#",
    image: "/images/boutique/maillot-club-officiel.png",
  },
];