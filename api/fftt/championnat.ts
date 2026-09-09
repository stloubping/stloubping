import { loadClubTeamRankings } from "./criterium";

type ApiRequest = { method?: string };

type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
};

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Méthode non autorisée", teams: [] });
    return;
  }

  try {
    const teams = await loadClubTeamRankings("championnat");
    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    response.status(200).json({ teams, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("[api/fftt/championnat]", error);
    response.status(500).json({
      error: error instanceof Error ? error.message : "Erreur interne du service FFTT",
      teams: [],
    });
  }
}
