export interface CompetitionEvent {
  id: string;
  date: string; // Format ISO YYYY-MM-DD
  endDate?: string;
  title: string;
  category: 'teams' | 'criterium' | 'individual' | 'youth' | 'leisure' | 'club';
  phase?: 'Phase 1' | 'Phase 2';
  location?: string;
  details?: string;
}

export const categoryLabels: Record<CompetitionEvent['category'], { label: string; color: string }> = {
  teams: { label: "Championnat par Équipes", color: "bg-blue-600 text-white" },
  criterium: { label: "Critérium Fédéral", color: "bg-purple-600 text-white" },
  individual: { label: "Finales par Classement", color: "bg-amber-600 text-white" },
  youth: { label: "Compétitions Jeunes", color: "bg-emerald-600 text-white" },
  leisure: { label: "Loisirs", color: "bg-teal-600 text-white" },
  club: { label: "Événements Club", color: "bg-clubPrimary text-white" },
};

export const competitions20262027: CompetitionEvent[] = [
  // --- CRITÉRIUM DE GIRONDE (ADULTES - LICENCES PROMO OU TRADI - COEFF 0,75) ---
  {
    id: "cg-j1",
    date: "2026-09-11",
    title: "Critérium de Gironde - J1",
    category: "criterium",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,75)"
  },
  {
    id: "cg-j2",
    date: "2026-09-25",
    title: "Critérium de Gironde - J2",
    category: "criterium",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,75)"
  },
  {
    id: "cg-j3",
    date: "2026-10-09",
    title: "Critérium de Gironde - J3",
    category: "criterium",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,75)"
  },
  {
    id: "cg-j4",
    date: "2026-11-13",
    title: "Critérium de Gironde - J4",
    category: "criterium",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,75)"
  },
  {
    id: "cg-j5",
    date: "2026-11-27",
    title: "Critérium de Gironde - J5",
    category: "criterium",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,75)"
  },
  {
    id: "cg-j6",
    date: "2026-12-18",
    title: "Critérium de Gironde - J6",
    category: "criterium",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,75)"
  },
  {
    id: "cg-j7",
    date: "2027-01-08",
    title: "Critérium de Gironde - J7",
    category: "criterium",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,75)"
  },
  {
    id: "cg-j8",
    date: "2027-01-28",
    title: "Critérium de Gironde - J8",
    category: "criterium",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,75)"
  },
  {
    id: "cg-j9",
    date: "2027-03-05",
    title: "Critérium de Gironde - J9",
    category: "criterium",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,75)"
  },
  {
    id: "cg-j10",
    date: "2027-03-26",
    title: "Critérium de Gironde - J10",
    category: "criterium",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,75)"
  },
  {
    id: "cg-demis",
    date: "2027-05-14",
    title: "Critérium de Gironde - ½ Finales",
    category: "criterium",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,75)"
  },
  {
    id: "cg-finales",
    date: "2027-06-18",
    title: "Critérium de Gironde - Finales",
    category: "criterium",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,75)"
  },

  // --- TOURNOIS INTERCLUB LOISIRS ADULTES ---
  {
    id: "loisirs-t1",
    date: "2026-10-15",
    title: "Tournoi Interclub Loisirs Adultes - Tour 1",
    category: "leisure",
    location: "Bègles",
    details: "Par équipe de 2 - Licences promotionnelles"
  },
  {
    id: "loisirs-t2",
    date: "2026-12-15",
    title: "Tournoi Interclub Loisirs Adultes - Tour 2",
    category: "leisure",
    location: "Cestas",
    details: "Par équipe de 2 - Licences promotionnelles"
  },
  {
    id: "loisirs-t3",
    date: "2027-02-15",
    title: "Tournoi Interclub Loisirs Adultes - Tour 3",
    category: "leisure",
    location: "CAM Bordeaux",
    details: "Par équipe de 2 - Licences promotionnelles"
  },
  {
    id: "loisirs-t4",
    date: "2027-03-15",
    title: "Tournoi Interclub Loisirs Adultes - Tour 4",
    category: "leisure",
    location: "Villenave d'Ornon",
    details: "Par équipe de 2 - Licences promotionnelles"
  },
  {
    id: "loisirs-t5",
    date: "2027-05-15",
    title: "Tournoi Interclub Loisirs Adultes - Tour 5",
    category: "leisure",
    location: "Talence",
    details: "Par équipe de 2 - Licences promotionnelles"
  },

  // --- TOURNOI GRAND PRIX CONSEIL DÉPARTEMENTAL (JEUNES & FÉMININES - COEFF 0,5) ---
  {
    id: "gp-cd-t1",
    date: "2026-11-28",
    endDate: "2026-11-29",
    title: "Tournoi Grand Prix Conseil Départemental - Tour 1",
    category: "youth",
    location: "Gironde",
    details: "Indiv. jeunes et féminines (licences promo ou tradi - Coeff. 0,5)"
  },
  {
    id: "gp-cd-t2",
    date: "2027-02-13",
    endDate: "2027-02-14",
    title: "Tournoi Grand Prix Conseil Départemental - Tour 2",
    category: "youth",
    location: "Gironde",
    details: "Indiv. jeunes et féminines (licences promo ou tradi - Coeff. 0,5)"
  },
  {
    id: "gp-cd-t3",
    date: "2027-03-06",
    endDate: "2027-03-07",
    title: "Tournoi Grand Prix Conseil Départemental - Tour 3",
    category: "youth",
    location: "Gironde",
    details: "Indiv. jeunes et féminines (licences promo ou tradi - Coeff. 0,5)"
  },
  {
    id: "gp-cd-t4",
    date: "2027-03-27",
    endDate: "2027-03-28",
    title: "Tournoi Grand Prix Conseil Départemental - Tour 4",
    category: "youth",
    location: "Gironde",
    details: "Indiv. jeunes et féminines (licences promo ou tradi - Coeff. 0,5)"
  },
  {
    id: "gp-cd-t5",
    date: "2027-05-15",
    endDate: "2027-05-16",
    title: "Tournoi Grand Prix Conseil Départemental - Tour 5",
    category: "youth",
    location: "Gironde",
    details: "Indiv. jeunes et féminines (licences promo ou tradi - Coeff. 0,5)"
  },

  // --- TITRES INDIVIDUELS JEUNES LOISIRS ---
  {
    id: "titres-jeunes-loisirs-dep",
    date: "2027-06-20",
    title: "Titres Individuels Jeunes Loisirs - Départemental",
    category: "leisure",
    location: "Gironde",
    details: "Indiv jeunes sur sélection (licences promo - Coeff. 0,5)"
  },

  // --- TOP DÉTECTION ---
  {
    id: "top-detection-dep",
    date: "2026-12-13",
    title: "Top Détection - Départemental",
    category: "youth",
    location: "Gironde",
    details: "Licences promotionnelles ou traditionnelles (Coeff. 0,5)"
  },
  {
    id: "top-detection-terr",
    date: "2027-03-27",
    title: "Top Détection - Territorial",
    category: "youth",
    location: "Territoire",
    details: "Passage en licence traditionnelle pour le territorial"
  },
  {
    id: "top-detection-reg",
    date: "2027-05-15",
    endDate: "2027-05-16",
    title: "Top Détection - Régional",
    category: "youth",
    location: "Nouvelle-Aquitaine"
  },

  // --- CHAMPIONNAT PAR ÉQUIPE JEUNES ---
  {
    id: "eq-jeunes-t1",
    date: "2027-03-21",
    title: "Championnat par équipe Jeunes - Tour 1",
    category: "youth",
    location: "Gironde",
    details: "Par équipes de 3 - Licences promo ou tradi (Coeff. 0,5)"
  },
  {
    id: "eq-jeunes-t2",
    date: "2027-05-02",
    title: "Championnat par équipe Jeunes - Tour 2",
    category: "youth",
    location: "Gironde",
    details: "Par équipes de 3 - Licences promo ou tradi (Coeff. 0,5)"
  },
  {
    id: "eq-jeunes-t3",
    date: "2027-06-27",
    title: "Championnat par équipe Jeunes - Tour 3",
    category: "youth",
    location: "Gironde",
    details: "Par équipes de 3 - Licences promo ou tradi (Coeff. 0,5)"
  },

  // --- AUTRES ÉVÉNEMENTS CLUB & CHAMPIONNATS ---
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
    title: "Critérium Fédéral - Tour 1",
    category: "criterium",
    phase: "Phase 1",
    location: "Nationale, Régionale & Départementale",
    details: "Indiv. licences traditionnelles (Coeff. 1,5)"
  },
  {
    id: "club-familles",
    date: "2026-10-16",
    title: "Tournoi des Familles (Vendredi soir)",
    category: "club",
    location: "Salle du club - Saint-Loubès"
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
    title: "Critérium Fédéral - Tour 2",
    category: "criterium",
    phase: "Phase 1",
    location: "Nationale, Régionale & Départementale",
    details: "Indiv. licences traditionnelles (Coeff. 1,5)"
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
    location: "Régional & Départemental"
  },
  {
    id: "club-noel",
    date: "2026-12-19",
    title: "Tournoi de Noël du Club",
    category: "club",
    location: "Salle Jacques-Durieux, Saint-Loubès"
  },
  {
    id: "fpc-dep",
    date: "2027-01-09",
    title: "Finales par Classement - Départemental",
    category: "individual",
    phase: "Phase 2",
    location: "Gironde",
    details: "Indiv. licences traditionnelles (Coeff. 1,25)"
  },
  {
    id: "titres-jeunes-dep",
    date: "2027-01-10",
    title: "Titres Individuels Jeunes - Départemental",
    category: "youth",
    phase: "Phase 2",
    location: "Gironde",
    details: "Licences traditionnelles -11 à -19 ans (Coeff. 1,5)"
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
    title: "Critérium Fédéral - Tour 3",
    category: "criterium",
    phase: "Phase 2",
    location: "Nationale, Régionale & Départementale",
    details: "Indiv. licences traditionnelles (Coeff. 1,5)"
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
    title: "Critérium Fédéral - Tour 4",
    category: "criterium",
    phase: "Phase 2",
    location: "Nationale, Régionale & Départementale",
    details: "Indiv. licences traditionnelles (Coeff. 1,5)"
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
    title: "Finales par Classement - Territorial",
    category: "individual",
    phase: "Phase 2",
    location: "Territoire",
    details: "Indiv. licences traditionnelles (Coeff. 1,25)"
  },
  {
    id: "titres-jeunes-reg",
    date: "2027-04-03",
    endDate: "2027-04-04",
    title: "Titres Individuels Jeunes - Régional",
    category: "youth",
    phase: "Phase 2",
    location: "Nouvelle-Aquitaine",
    details: "Licences traditionnelles -11 à -19 ans (Coeff. 1,5)"
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
    location: "Gymnase de Saint-Loubès"
  },
  {
    id: "fpc-reg",
    date: "2027-04-24",
    title: "Finales par Classement - Régional",
    category: "individual",
    phase: "Phase 2",
    location: "Nouvelle-Aquitaine",
    details: "Indiv. licences traditionnelles (Coeff. 1,25)"
  },
  {
    id: "cf-cadet-benjamin",
    date: "2027-04-30",
    endDate: "2027-05-02",
    title: "Titres Individuels Jeunes - Champ France Cadet/Benjamin",
    category: "youth",
    phase: "Phase 2",
    location: "National",
    details: "Licences traditionnelles -11 à -19 ans (Coeff. 1,5)"
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
  {
    id: "cf-junior-minime",
    date: "2027-06-04",
    endDate: "2027-06-06",
    title: "Titres Individuels Jeunes - Champ France Junior/Minime",
    category: "youth",
    phase: "Phase 2",
    location: "National",
    details: "Licences traditionnelles -11 à -19 ans (Coeff. 1,5)"
  },
  {
    id: "fete-club-2027",
    date: "2027-06-19",
    title: "Fête du Club & Tournoi Interne de Fin de Saison",
    category: "club",
    location: "Club House Saint-Loubès"
  },
  {
    id: "fpc-nat",
    date: "2027-06-26",
    endDate: "2027-06-27",
    title: "Finales par Classement - National",
    category: "individual",
    phase: "Phase 2",
    location: "National",
    details: "Indiv. licences traditionnelles (Coeff. 1,25)"
  }
];