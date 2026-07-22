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
    details: "Présentation des activités du club et inscriptions."
  },
  {
    id: "p1-j1",
    date: "2026-09-19",
    endDate: "2026-09-20",
    title: "Championnat par Équipes - Journée 1",
    category: "teams",
    phase: "Phase 1",
    location: "Régional & Départemental"
  },
  {
    id: "p1-jeunes-j1",
    date: "2026-09-26",
    endDate: "2026-09-27",
    title: "Championnat Jeunes par Équipes - Journée 1",
    category: "youth",
    phase: "Phase 1",
    location: "Gironde"
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
    details: "Indiv. Licences traditionnelles (Matchs comptabilisés Coeff. 1,5)"
  },
  {
    id: "club-familles",
    date: "2026-10-16",
    title: "Tournoi des Familles (Vendredi soir)",
    category: "club",
    location: "Salle du club - Saint-Loubès",
    details: "Soirée conviviale par paires parent/enfant."
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
    id: "p1-crit2",
    date: "2026-11-14",
    endDate: "2026-11-15",
    title: "Critérium Fédéral - 2ème Tour",
    category: "criterium",
    phase: "Phase 1",
    location: "Nationale, Régionale & Départementale",
    details: "Indiv. Licences traditionnelles (Matchs comptabilisés Coeff. 1,5)"
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
    details: "Dernière journée de la Phase 1."
  },
  {
    id: "club-noel",
    date: "2026-12-19",
    title: "Tournoi de Noël du Club",
    category: "club",
    location: "Salle Jacques-Durieux, Saint-Loubès",
    details: "Tournoi interne et fête de fin d'année du club."
  },

  // --- JANVIER 2027 ---
  {
    id: "fpc-dep",
    date: "2027-01-09",
    title: "Finales par Classement - Échelon Départemental",
    category: "individual",
    phase: "Phase 2",
    location: "Gironde",
    details: "Indiv. Licences traditionnelles"
  },
  {
    id: "titres-jeunes-dep",
    date: "2027-01-10",
    title: "Titres Individuels Jeunes - Échelon Départemental",
    category: "youth",
    phase: "Phase 2",
    location: "Gironde",
    details: "Licences traditionnelles -11 à -19 ans (Coeff. 1,25)"
  },
  {
    id: "p2-j1",
    date: "2027-01-16",
    endDate: "2027-01-17",
    title: "Championnat par Équipes - Journée 1 (Phase 2)",
    category: "teams",
    phase: "Phase 2",
    location: "Régional & Départemental"
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
    location: "Nationale, Régionale & Départementale",
    details: "Indiv. Licences traditionnelles (Matchs comptabilisés Coeff. 1,5)"
  },

  // --- FÉVRIER 2027 ---
  {
    id: "p2-j3",
    date: "2027-02-06",
    endDate: "2027-02-07",
    title: "Championnat par Équipes - Journée 3 (Phase 2)",
    category: "teams",
    phase: "Phase 2",
    location: "Régional & Départemental"
  },

  // --- MARS 2027 ---
  {
    id: "p2-crit4",
    date: "2027-03-06",
    endDate: "2027-03-07",
    title: "Critérium Fédéral - 4ème Tour",
    category: "criterium",
    phase: "Phase 2",
    location: "Nationale, Régionale & Départementale",
    details: "Indiv. Licences traditionnelles (Matchs comptabilisés Coeff. 1,5)"
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
    id: "fpc-terr",
    date: "2027-03-20",
    title: "Finales par Classement - Échelon Territorial",
    category: "individual",
    phase: "Phase 2",
    location: "Territoire",
    details: "Indiv. Licences traditionnelles"
  },
  {
    id: "indiv-promo-t1",
    date: "2027-03-21",
    title: "Indiv. Jeunes & Féminines - Tour 1",
    category: "youth",
    phase: "Phase 2",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,5)"
  },

  // --- AVRIL 2027 ---
  {
    id: "titres-jeunes-reg",
    date: "2027-04-03",
    endDate: "2027-04-04",
    title: "Titres Individuels Jeunes - Échelon Régional",
    category: "youth",
    phase: "Phase 2",
    location: "Nouvelle-Aquitaine",
    details: "Licences traditionnelles -11 à -19 ans (Coeff. 1,25)"
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
    date: "2027-04-17",
    title: "Grand Tournoi Régional de Saint-Loubès 2027",
    category: "club",
    location: "Gymnase de Saint-Loubès",
    details: "Tournoi régional annuel homologué par le club."
  },
  {
    id: "fpc-reg",
    date: "2027-04-24",
    title: "Finales par Classement - Échelon Régional",
    category: "individual",
    phase: "Phase 2",
    location: "Nouvelle-Aquitaine",
    details: "Indiv. Licences traditionnelles"
  },
  {
    id: "cf-cadet-benjamin",
    date: "2027-04-30",
    endDate: "2027-05-02",
    title: "Championnat de France Cadet / Benjamin",
    category: "youth",
    phase: "Phase 2",
    location: "National",
    details: "Titres Individuels Jeunes"
  },

  // --- MAI 2027 ---
  {
    id: "indiv-promo-t2",
    date: "2027-05-02",
    title: "Indiv. Jeunes & Féminines - Tour 2",
    category: "youth",
    phase: "Phase 2",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,5)"
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
    location: "Régional & Départemental"
  },

  // --- JUIN 2027 ---
  {
    id: "cf-junior-minime",
    date: "2027-06-04",
    endDate: "2027-06-06",
    title: "Championnat de France Junior / Minime",
    category: "youth",
    phase: "Phase 2",
    location: "National",
    details: "Titres Individuels Jeunes"
  },
  {
    id: "fete-club-2027",
    date: "2027-06-19",
    title: "Fête du Club & Tournoi Interne de Fin de Saison",
    category: "club",
    location: "Club House Saint-Loubès",
    details: "Bilan, remise des diplômes, tournoi interne et repas du club."
  },
  {
    id: "fpc-nat",
    date: "2027-06-26",
    endDate: "2027-06-27",
    title: "Finales par Classement - Échelon National",
    category: "individual",
    phase: "Phase 2",
    location: "National",
    details: "Indiv. Licences traditionnelles"
  },
  {
    id: "indiv-promo-t3",
    date: "2027-06-27",
    title: "Indiv. Jeunes & Féminines - Tour 3",
    category: "youth",
    phase: "Phase 2",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,5)"
  }
];