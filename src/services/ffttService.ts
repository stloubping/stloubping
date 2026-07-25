import { defaultPlayersData } from '@/data/playersData';

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

export async function fetchClubPlayers(): Promise<Player[]> {
  // Retour instantané des 141 licenciés sans blocage réseau ni CORS
  return defaultPlayersData;
}