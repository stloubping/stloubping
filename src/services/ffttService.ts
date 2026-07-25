import { supabase } from '@/integrations/supabase/client';

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

const CACHE_KEY = "stloub_club_players_v13";
const CACHE_TIME_KEY = "stloub_club_players_time_v13";
const CACHE_DURATION_MS = 1000 * 60 * 60 * 2; // 2 heures

export async function fetchClubPlayers(): Promise<Player[]> {
  // 1. Vérification du cache local
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cached && cachedTime) {
      const age = Date.now() - parseInt(cachedTime, 10);
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (age > CACHE_DURATION_MS) {
          refreshInBackground();
        }
        return parsed;
      }
    }
  } catch (e) {
    // Erreur de lecture du cache ignorée
  }

  // 2. Chargement depuis l'Edge Function Supabase
  const freshMembers = await loadFreshData();
  if (freshMembers.length > 0) {
    saveToCache(freshMembers);
    return freshMembers;
  }

  return [];
}

async function refreshInBackground() {
  try {
    const freshMembers = await loadFreshData();
    if (freshMembers.length > 0) {
      saveToCache(freshMembers);
    }
  } catch (e) {
    // Erreur ignorée
  }
}

function saveToCache(members: Player[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(members));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
  } catch (e) {
    // Erreur écriture ignorée
  }
}

async function loadFreshData(): Promise<Player[]> {
  try {
    const { data, error } = await supabase.functions.invoke('get-club-players');
    if (!error && data?.players && Array.isArray(data.players) && data.players.length > 0) {
      return data.players;
    }
  } catch (e) {
    console.error("Erreur lors de l'appel Edge Function get-club-players:", e);
  }

  return [];
}