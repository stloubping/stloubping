export interface CompetitionEvent {
  id: string;
  date: string; // Format ISO YYYY-MM-DD
  endDate?: string;
  title: string;
  category: 'teams' | 'criterium' | 'individual' | 'youth' | 'club';
  phase?: 'Phase 1' | 'Phase 2';
  location?: string;
  details?: string;
}

export const categoryLabels: Record<CompetitionEvent['category'], { label: string; color: string }> = {
  teams: { label: "Championnat par Équipes", color: "bg-blue-600 text-white" },
  criterium: { label: "Critérium Fédéral", color: "bg-purple-600 text-white" },
  individual: { label: "Titres & Indivs", color: "bg-amber-600 text-white" },
  youth: { label: "Compétitions Jeunes", color: "bg-emerald-600 text-white" },
  club: { label: "Événements Club", color: "bg-clubPrimary text-white" },
};

export const competitions20262027: CompetitionEvent[] = [
  // --- SEPTEMBRE 2026 ---
  {
    id: "sep-forum",
    date: "2026-09-05",
    title: "Forum des Associations & Portes Ouvertes",
    category: "club",
    location: "Saint-Loubès",
    details: "Inscriptions, renseignements et démonstrations."
  },
  {
    id: "p1-j1",
    date: "2026-09-19",
    endDate: "2026-09-20",
    title: "Championnat par Équipes - Journée 1",
    category: "teams",
    phase: "Phase 1",
    location: "Régional & Départemental",
    details: "1ère journée du championnat par équipes Séniors."
  },
  {
    id: "p1-jeunes-j1",
    date: "2026-09-26",
    endDate: "2026-09-27",
    title: "Championnat Jeunes - Journée 1",
    category: "youth",
    phase: "Phase 1",
    location: "Gironde",
    details: "1ère journée du championnat Jeunes par équipes."
  },

  // --- OCTOBRE 2026 ---
  {
    id: "p1-j2",
    date: "2026-10-03",
    endDate: "2026-10-04",
    title: "Championnat par Équipes - Journée 2",
    category: "teams",
    phase: "Phase 1",
    location: "Régional & Départemental"
  },
  {
    id: "p1-crit1",
    date: "2026-10-10",
    endDate: "2026-10-11",
    title: "Critérium Fédéral - 1er Tour",
    category: "criterium",
    phase: "Phase 1",
    location: "Nationale, Régionale & Départementale",
    details: "Épreuve individuelle de référence pour toutes les catégories."
  },
  {
    id: "p1-j3",
    date: "2026-10-17",
    endDate: "2026-10-18",
    title: "Championnat par Équipes - Journée 3",
    category: "teams",
    phase: "Phase 1",
    location: "Régional & Départemental"
  },
  {
    id: "p1-jeunes-j2",
    date: "2026-10-24",
    endDate: "2026-10-25",
    title: "Championnat Jeunes - Journée 2",
    category: "youth",
    phase: "Phase 1",
    location: "Gironde"
  },

  // --- NOVEMBRE 2026 ---
  {
    id: "p1-j4",
    date: "2026-11-07",
    endDate: "2026-11-08",
    title: "Championnat par Équipes - Journée 4",
    category: "teams",
    phase: "Phase 1",
    location: "Régional & Départemental"
  },
  {
    id: "p1-jeunes-j3",
    date: "2026-11-14",
    endDate: "2026-11-15",
    title: "Championnat Jeunes - Journée 3",
    category: "youth",
    phase: "Phase 1",
    location: "Gironde"
  },
  {
    id: "p1-j5",
    date: "2026-11-21",
    endDate: "2026-11-22",
    title: "Championnat par Équipes - Journée 5",
    category: "teams",
    phase: "Phase 1",
    location: "Régional & Départemental"
  },
  {
    id: "p1-crit2",
    date: "2026-11-28",
    endDate: "2026-11-29",
    title: "Critérium Fédéral - 2ème Tour",
    category: "criterium",
    phase: "Phase 1",
    location: "Nationale, Régionale & Départementale"
  },

  // --- DÉCEMBRE 2026 ---
  {
    id: "p1-j6",
    date: "2026-12-05",
    endDate: "2026-12-06",
    title: "Championnat par Équipes - Journée 6",
    category: "teams",
    phase: "Phase 1",
    location: "Régional & Départemental"
  },
  {
    id: "p1-j7",
    date: "2026-12-12",
    endDate: "2026-12-13",
    title: "Championnat par Équipes - Journée 7",
    category: "teams",
    phase: "Phase 1",
    location: "Régional & Départemental",
    details: "Dernière journée décisive de la Phase 1."
  },
  {
    id: "p1-noel",
    date: "2026-12-19",
    title: "Tournoi de Noël du Club & Stage Jeunes",
    category: "club",
    location: "Salle Jacques-Durieux, Saint-Loubès",
    details: "Compétition amicale festive pour tous les adhérents."
  },

  // --- PHASE 2 (DATES OFFICIELLES CORRIGÉES) ---
  {
    id: "p2-jeunes-j1",
    date: "2027-01-09",
    endDate: "2027-01-10",
    title: "Championnat Jeunes - Journée 1 (Phase 2)",
    category: "youth",
    phase: "Phase 2",
    location: "Gironde"
  },
  {
    id: "p2-j1",
    date: "2027-01-16",
    endDate: "2027-01-17",
    title: "Championnat par Équipes - Journée 1 (Phase 2)",
    category: "teams",
    phase: "Phase 2",
    location: "Régional & Départemental",
    details: "1ère journée de la Phase 2 du championnat par équipes."
  },
  {
    id: "p2-j2",
    date: "2027-01-23",
    endDate: "2027-01-24",
    title: "Championnat par Équipes - Journée 2 (Phase 2)",
    category: "teams",
    phase: "Phase 2",
    location: "Régional & Départemental"
  },
  {
    id: "p2-crit3",
    date: "2027-01-30",
    endDate: "2027-01-31",
    title: "Critérium Fédéral - 3ème Tour",
    category: "criterium",
    phase: "Phase 2",
    location: "Nationale, Régionale & Départementale"
  },
  {
    id: "p2-j3",
    date: "2027-02-06",
    endDate: "2027-02-07",
    title: "Championnat par Équipes - Journée 3 (Phase 2)",
    category: "teams",
    phase: "Phase 2",
    location: "Régional & Départemental"
  },
  {
    id: "p2-crit4",
    date: "2027-03-06",
    endDate: "2027-03-07",
    title: "Critérium Fédéral - 4ème Tour",
    category: "criterium",
    phase: "Phase 2",
    location: "Nationale, Régionale & Départementale"
  },
  {
    id: "p2-j4",
    date: "2027-03-13",
    endDate: "2027-03-14",
    title: "Championnat par Équipes - Journée 4 (Phase 2)",
    category: "teams",
    phase: "Phase 2",
    location: "Régional & Départemental"
  },
  {
    id: "ppp-2027",
    date: "2027-03-27",
    endDate: "2027-03-28",
    title: "Premier Pas Pongiste & Découverte",
    category: "youth",
    location: "Saint-Loubès",
    details: "Animation découverte pour les débutants et écoles."
  },
  {
    id: "p2-j5",
    date: "2027-04-10",
    endDate: "2027-04-11",
    title: "Championnat par Équipes - Journée 5 (Phase 2)",
    category: "teams",
    phase: "Phase 2",
    location: "Régional & Départemental"
  },
  {
    id: "tournoi-stloubes-2027",
    date: "2027-04-24",
    endDate: "2027-04-25",
    title: "Grand Tournoi Régional de Saint-Loubès 2027",
    category: "club",
    location: "Gymnase de Saint-Loubès",
    details: "Grand évènement annuel homologué avec 7 tableaux et petite restauration."
  },
  {
    id: "p2-j6",
    date: "2027-05-22",
    endDate: "2027-05-23",
    title: "Championnat par Équipes - Journée 6 (Phase 2)",
    category: "teams",
    phase: "Phase 2",
    location: "Régional & Départemental"
  },
  {
    id: "p2-j7",
    date: "2027-05-29",
    endDate: "2027-05-30",
    title: "Championnat par Équipes - Journée 7 (Phase 2)",
    category: "teams",
    phase: "Phase 2",
    location: "Régional & Départemental",
    details: "Dernière journée officielle de Phase 2."
  },
  {
    id: "p2-titres-dep",
    date: "2027-06-05",
    endDate: "2027-06-06",
    title: "Titres Départementaux par Équipes",
    category: "individual",
    phase: "Phase 2",
    location: "Gironde"
  },
  {
    id: "p2-titres-reg",
    date: "2027-06-12",
    endDate: "2027-06-13",
    title: "Titres Régionaux par Équipes",
    category: "individual",
    phase: "Phase 2",
    location: "Nouvelle-Aquitaine"
  },
  {
    id: "fete-club-2027",
    date: "2027-06-19",
    title: "Fête du Club & Assemblée Générale St Loub Ping",
    category: "club",
    location: "Club House Saint-Loubès",
    details: "Bilan de la saison, récompenses des jeunes et repas convivial."
  }
];