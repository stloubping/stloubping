import { supabase } from "@/integrations/supabase/client";

export interface Player {
  licence: string;
  nom: string;
  prenom: string;
  points: number;
  clast: string;
  cat: string;
  rang?: string;
  valinit?: number;
  valmen?: number;
  progmens?: number;
  progans?: number;
}

const CACHE_KEY = "stloub_club_players_official_v1";

export async function fetchClubPlayers(): Promise<Player[]> {
  // 1. Tenter la récupération en direct depuis la fonction Edge Supabase (Serveur FFTT)
  try {
    const { data, error } = await supabase.functions.invoke('get-club-players');

    if (!error && data?.players && Array.isArray(data.players) && data.players.length > 0) {
      const livePlayers: Player[] = data.players;
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(livePlayers));
      } catch (e) {}
      return livePlayers;
    } else if (error) {
      console.error("[ffttService] Erreur lors de l'appel Supabase get-club-players:", error);
    }
  } catch (err) {
    console.error("[ffttService] Exception lors de la connexion FFTT via Supabase:", err);
  }

  // 2. Si problème réseau intermittent, charger la dernière sauvegarde valide en cache
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  return [];
}