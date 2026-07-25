import { supabase } from "@/integrations/supabase/client";

export interface Player {
  idlicence?: string;
  licence: string;
  nom: string;
  prenom: string;
  sexe?: string;
  points: number;
  clast: string;
  cat: string;
  rang?: string;
  valinit?: number;
  valmen?: number;
  progmens?: number;
  progans?: number;
}

const CACHE_KEY = "stloub_club_players_official_v2";

function isValidPlayer(value: unknown): value is Player {
  if (!value || typeof value !== "object") return false;
  const player = value as Partial<Player>;
  return Boolean(player.nom && player.prenom && player.licence);
}

function sortPlayers(players: Player[]): Player[] {
  return [...players].sort(
    (a, b) =>
      Number(b.points || 0) - Number(a.points || 0) ||
      a.nom.localeCompare(b.nom, "fr"),
  );
}

export async function fetchClubPlayers(): Promise<Player[]> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "get-club-players",
      { body: {} },
    );

    if (error) throw error;

    const livePlayers = Array.isArray(data?.players)
      ? data.players.filter(isValidPlayer)
      : [];

    if (livePlayers.length > 0) {
      const sortedPlayers = sortPlayers(livePlayers);
      localStorage.setItem(CACHE_KEY, JSON.stringify(sortedPlayers));
      return sortedPlayers;
    }

    throw new Error("La FFTT n'a renvoyé aucun joueur.");
  } catch (error) {
    console.error("[ffttService] Données FFTT indisponibles :", error);

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const players = JSON.parse(cached);
        if (Array.isArray(players)) {
          const validPlayers = players.filter(isValidPlayer);
          if (validPlayers.length > 0) return sortPlayers(validPlayers);
        }
      }
    } catch (cacheError) {
      console.error("[ffttService] Cache FFTT invalide :", cacheError);
    }

    throw error;
  }
}
