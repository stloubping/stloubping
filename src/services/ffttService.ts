import { supabase } from '@/integrations/supabase/client';
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
  try {
    const { data, error } = await supabase.functions.invoke('get-club-players');
    if (!error && data?.players && Array.isArray(data.players) && data.players.length > 0) {
      return data.players;
    }
  } catch (err) {
    console.warn("Edge function indisponible, bascule sur la liste de secours.", err);
  }

  return defaultPlayersData;
}