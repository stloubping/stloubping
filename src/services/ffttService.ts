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

const CACHE_KEY = "stloub_club_players_v19";
const CACHE_TIME_KEY = "stloub_club_players_time_v19";
const CACHE_DURATION_MS = 1000 * 60 * 60 * 2; // 2 heures

export async function fetchClubPlayers(): Promise<Player[]> {
  // Vérification du cache s'il est valide
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cached && cachedTime) {
      const age = Date.now() - parseInt(cachedTime, 10);
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (age < CACHE_DURATION_MS) {
          return parsed;
        }
      }
    }
  } catch (e) {
    // Erreur lecture cache
  }

  // Appel de l'API Smartping via la Supabase Edge Function (côté serveur)
  try {
    const { data, error } = await supabase.functions.invoke('get-club-players');
    if (!error && data?.players && Array.isArray(data.players) && data.players.length > 0) {
      saveToCache(data.players);
      return data.players;
    }
  } catch (err) {
    console.warn("Erreur lors du chargement des joueurs via la fonction Supabase:", err);
  }

  // Si le cache existe (même expiré), l'utiliser
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  // Sinon, retourner la liste de sauvegarde
  return defaultPlayersData;
}

function saveToCache(members: Player[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(members));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
  } catch (e) {}
}