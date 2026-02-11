import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gestion du CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { licence } = await req.json()
    console.log(`[get-player-points] Recherche pour la licence: ${licence}`);

    if (!licence) {
      return new Response(JSON.stringify({ error: 'Numéro de licence requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Utilisation de l'API publique de pongiste.fr (très utilisée par la communauté)
    const response = await fetch(`https://www.pongiste.fr/api/joueur/${licence}`);
    
    if (!response.ok) {
      throw new Error('Joueur non trouvé ou service indisponible');
    }

    const data = await response.json();
    console.log(`[get-player-points] Données reçues:`, data);

    // Extraction des points (le champ varie selon l'API, souvent 'points' ou 'points_mensuels')
    const points = data.points || data.points_mensuels || data.points_officiels;

    return new Response(JSON.stringify({ points, name: `${data.prenom} ${data.nom}`, club: data.club }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error(`[get-player-points] Erreur:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})