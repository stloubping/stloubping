import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BonzaiArticle {
  title: string;
  description: string;
  link: string;
  image: string;
  date: string;
}

interface BonzaiResponse {
  latestArticle: BonzaiArticle;
}

const fetchBonzaiNews = async (): Promise<BonzaiArticle> => {
  // Note: Replace 'svwsqioytvvpqbxpekwm' with your actual Supabase Project ID if hardcoding is necessary, 
  // but generally, the client should handle the base URL.
  const { data, error } = await supabase.functions.invoke<BonzaiResponse>('fetch-bonzai-news', {
    method: 'GET',
  });

  if (error) {
    console.error("Error invoking Bonzai Edge Function:", error);
    throw new Error(error.message || "Erreur lors de la récupération des actualités Bonzai.");
  }

  if (!data || !data.latestArticle) {
    throw new Error("Format de réponse Bonzai inattendu.");
  }

  return data.latestArticle;
};

export function useBonzaiNews() {
  return useQuery<BonzaiArticle, Error>({
    queryKey: ['bonzaiNews'],
    queryFn: fetchBonzaiNews,
    staleTime: 1000 * 60 * 5, // Cache pendant 5 minutes
  });
}