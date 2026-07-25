import { supabase } from "@/integrations/supabase/client";
import { defaultPlayersData } from "@/data/playersData";

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

const CACHE_KEY = "stloub_club_players_v23";

export async function fetchClubPlayers(): Promise<Player[]> {
  // 1. Si disponible en cache local, affichage immédiat
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Mise à jour en arrière-plan
        updateBackgroundCache();
        return parsed;
      }
    }
  } catch (e) {}

  // 2. Appel du backend Supabase (qui fait la requête serveur FFTT sans problème de CORS)
  try {
    const { data, error } = await supabase.functions.invoke('get-club-players');
    if (!error && data?.players && Array.isArray(data.players) && data.players.length > 0) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data.players));
      } catch (e) {}
      return data.players;
    }
  } catch (e) {
    console.warn("Délai ou erreur Supabase, bascule sur les données du club:", e);
  }

  // 3. Fallback immédiat et garanti
  return defaultPlayersData;
}

async function updateBackgroundCache() {
  try {
    const { data } = await supabase.functions.invoke('get-club-players');
    if (data?.players && Array.isArray(data.players) && data.players.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data.players));
    }
  } catch (e) {}
}