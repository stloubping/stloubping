import { supabase } from '@/integrations/supabase/client';

export interface Player {
  licence: string;
  nom: string;
  prenom: string;
  points: number;
  clast: string;
  cat: string;
  rang?: string;
  source?: string;
}

const CACHE_KEY = "stloub_club_members_cache_v3";

export async function fetchClubPlayers(): Promise<Player[]> {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        refreshClubMembersInBackground();
        return parsed;
      }
    }
  } catch (e) {
    // Ignorer les erreurs de cache
  }

  try {
    const { data, error } = await supabase.functions.invoke('get-club-members');
    if (!error && data?.members && Array.isArray(data.members) && data.members.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data.members));
      return data.members;
    }
  } catch (e) {
    console.error("Erreur lors de la récupération des membres via l'Edge Function Supabase:", e);
  }

  return [];
}

async function refreshClubMembersInBackground() {
  try {
    const { data, error } = await supabase.functions.invoke('get-club-members');
    if (!error && data?.members && Array.isArray(data.members) && data.members.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data.members));
    }
  } catch (e) {
    // Erreur silencieuse en arrière-plan
  }
}