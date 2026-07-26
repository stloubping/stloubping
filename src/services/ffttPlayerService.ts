export interface PlayerProfile {
  idlicence: string;
  licence: string;
  nom: string;
  prenom: string;
  sexe: string;
  category: string;
  licenceType: string;
  clubNumber: string;
  clubName: string;
  points: number;
  previousPoints: number;
  initialPoints: number;
  monthlyProgress: number;
  annualProgress: number;
  officialRanking: string;
  globalRank: string;
  previousGlobalRank: string;
  regionalRank: string;
  departmentRank: string;
  officialPoints: number;
  proposedRanking: string;
  echelon: string;
  nationalPlace: string;
  nationality: string;
  mutationDate: string;
  umpireGrade: string;
  refereeGrade: string;
  coachGrade: string;
}

export interface PlayerMatch {
  id: string;
  date: string;
  opponentName: string;
  opponentLicence: string;
  opponentSex: string;
  opponentRanking: number;
  result: string;
  event: string;
  championshipCode: string;
  round: string;
  pointsDelta: number;
  coefficient: number;
  forfeit: boolean;
}

export interface PlayerRankingHistory {
  season: string;
  phase: string;
  points: number;
  echelon: string;
  place: string;
}

export interface PlayerSummary {
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  pointsBalance: number;
  bestWin: {
    opponentName: string;
    opponentRanking: number;
    date: string;
  } | null;
}

export interface PlayerDetails {
  player: PlayerProfile;
  summary: PlayerSummary;
  matches: PlayerMatch[];
  history: PlayerRankingHistory[];
  updatedAt: string;
}

export async function fetchPlayerDetails(
  licence: string,
): Promise<PlayerDetails> {
  const response = await fetch(
    `/api/fftt/player?licence=${encodeURIComponent(licence)}`,
    {
      headers: { Accept: "application/json" },
    },
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "La fiche FFTT est indisponible.");
  }

  return data as PlayerDetails;
}
