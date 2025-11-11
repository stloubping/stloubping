import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

// URL publique pour le lien final
const BONZAI_PUBLIC_URL = "https://www.bonzai.pro/saint-loub-ping";

// URL hypothétique de l'API (à remplacer si vous avez l'URL réelle)
const BONZAI_API_ENDPOINT = "https://api.bonzai.pro/v1/latest-article"; 

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  const apiKey = Deno.env.get('BONZAI_API_KEY');

  if (!apiKey) {
    console.error("BONZAI_API_KEY secret is missing.");
    // Fallback to static data if key is missing, but log error
  }

  try {
    // --- Simulation de l'appel API sécurisé ---
    
    // Dans un scénario réel, nous ferions ceci:
    /*
    const apiResponse = await fetch(BONZAI_API_ENDPOINT, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`, // Ou selon le format requis par Bonzai
        'Content-Type': 'application/json',
      },
    });

    if (!apiResponse.ok) {
      throw new Error(`Failed to fetch Bonzai API: ${apiResponse.statusText}`);
    }
    
    const data = await apiResponse.json();
    
    // Assurez-vous que la structure correspond à BonzaiArticle
    const latestArticle = {
        title: data.title,
        description: data.summary,
        link: data.url,
        image: data.imageUrl,
        date: data.publishedAt
    };
    */

    // --- Remplacement par des données statiques pertinentes en attendant l'URL API réelle ---
    
    const latestArticle = {
        title: "Dernier Article Bonzai : Résultats du Championnat",
        description: "Retrouvez tous les résultats de nos équipes et les analyses de matchs détaillées sur notre page Bonzai.pro. Cliquez pour voir les dernières performances !",
        link: BONZAI_PUBLIC_URL,
        image: "/images/actualites/championnat-equipe-journee-4-phase-1.jpg",
        date: new Date().toISOString().split('T')[0]
    };

    return new Response(
      JSON.stringify({ latestArticle }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error("Bonzai fetch error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})