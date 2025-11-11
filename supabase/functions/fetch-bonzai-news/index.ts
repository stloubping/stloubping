import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

// URL publique pour le lien final
const BONZAI_PUBLIC_URL = "https://www.bonzai.pro/saint-loub-ping";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Structure de données statiques (fallback)
const latestArticle = {
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
  
  // Note: La clé API n'est pas utilisée ici car nous n'avons pas l'URL de l'API structurée.
  // Nous retournons des données statiques pour assurer le fonctionnement de la carte.

  try {
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