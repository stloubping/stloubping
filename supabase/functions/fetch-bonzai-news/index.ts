import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const BONZAI_URL = "https://www.bonzai.pro/saint-loub-ping";
// Note: If an API key is needed, it should be passed via a Supabase secret and accessed via Deno.env.get('YOUR_SECRET_NAME')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Fetch the content from the external URL
    const response = await fetch(BONZAI_URL, {
      method: 'GET',
      headers: {
        // Mimic a browser request
        'User-Agent': 'Mozilla/5.0 (compatible; BonzaiFetcher/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Bonzai data: ${response.statusText}`);
    }

    // --- Placeholder Logic (returning a relevant mock structure) ---
    
    const mockArticle = {
        title: "Dernier Article Bonzai : Résultats du Championnat",
        description: "Retrouvez tous les résultats de nos équipes et les analyses de matchs détaillées sur notre page Bonzai.pro. Cliquez pour voir les dernières performances !",
        link: BONZAI_URL,
        image: "/images/actualites/championnat-equipe-journee-4-phase-1.jpg", // Utilisation d'une image existante pour un meilleur rendu
        date: new Date().toISOString().split('T')[0]
    };

    return new Response(
      JSON.stringify({ latestArticle: mockArticle }),
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