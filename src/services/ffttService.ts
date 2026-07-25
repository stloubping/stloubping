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

const CACHE_KEY = "stloub_club_players_v25";

export async function fetchClubPlayers(): Promise<Player[]> {
  // 1. Si disponible en cache local, renvoie le cache immédiatement
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  // 2. Sinon, renvoie immédiatement les 48 joueurs officiels du club (Triés par points)
  const sortedDefault = [...defaultPlayersData].sort((a, b) => b.points - a.points);
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(sortedDefault));
  } catch (e) {}

  return sortedDefault;
}