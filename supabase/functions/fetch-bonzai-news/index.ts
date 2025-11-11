import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

// URL publique pour le lien final
const BONZAI_PUBLIC_URL = "https://www.bonzai.pro/saint-loub-ping";

// URL hypothétique de l'API (À REMPLACER PAR L'URL RÉELLE DE L'API BONZAI)
const BONZAI_API_ENDPOINT = "https://api.bonzai.pro/v1/latest-article"; 

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Structure de données de secours si l'appel API échoue
const fallbackArticle = {
    title: "Dernier Article Bonzai : Résultats du Championnat",
    description: "Retrouvez tous les résultats de nos équipes et les analyses de matchs détaillées sur notre page Bonzai.pro. Cliquez pour voir les dernières performances !",
    link: BONZAI_PUBLIC_URL,
    image: "/images/actualites/championnat-equipe-journee-4-phase-1.jpg",
    date: new Date().toISOString().split('T')[0]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  const apiKey = Deno.env.get('BONZAI_API_KEY');

  if (!apiKey) {
    console.error("BONZAI_API_KEY secret is missing. Using fallback data.");
    return new Response(
      JSON.stringify({ latestArticle: fallbackArticle }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  }

  try {
    // TENTATIVE D'APPEL API RÉEL (en supposant un endpoint JSON)
    
    // ATTENTION: L'URL BONZAI_API_ENDPOINT est une supposition. 
    // Si l'URL réelle est différente, cette requête échouera.
    const apiResponse = await fetch(BONZAI_API_ENDPOINT, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`, // Utilisation de la clé API dans l'en-tête
        'Content-Type': 'application/json',
      },
    });

    if (!apiResponse.ok) {
      console.error(`Bonzai API returned status ${apiResponse.status}. Using fallback data.`);
      // Si l'API échoue, nous retournons les données de secours
      return new Response(
        JSON.stringify({ latestArticle: fallbackArticle }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    }
    
    const data = await apiResponse.json();
    
    // ATTENTION: La structure de la réponse JSON est inconnue. 
    // Nous devons mapper les champs de la réponse Bonzai (data) vers notre structure (latestArticle).
    // Si la structure est différente, cela provoquera une erreur.
    const latestArticle = {
        title: data.title || fallbackArticle.title,
        description: data.summary || fallbackArticle.description,
        link: data.url || BONZAI_PUBLIC_URL,
        image: data.imageUrl || fallbackArticle.image,
        date: data.publishedAt || fallbackArticle.date
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
    // En cas d'erreur réseau ou de parsing, nous retournons les données de secours
    return new Response(
      JSON.stringify({ latestArticle: fallbackArticle }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  }
})