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
    if (!licence) throw new Error('Numéro de licence manquant');

    console.log(`[get-player-points] Requête pour la licence : ${licence}`);

    // Utilisation d'une API publique fiable pour les données FFTT
    const response = await fetch(`https://www.pongiste.fr/api/joueur/${licence}`);
    
    if (!response.ok) {
      console.error(`[get-player-points] Joueur non trouvé pour ${licence}`);
      return new Response(JSON.stringify({ error: 'Joueur non trouvé' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json();
    
    // On formate les données pour qu'elles soient prêtes pour le formulaire
    const result = {
      points: data.points || data.points_mensuels || "500",
      first_name: data.prenom || "",
      last_name: data.nom || "",
      club: data.club || ""
    };

    console.log(`[get-player-points] Succès pour ${result.first_name} ${result.last_name}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error(`[get-player-points] Erreur critique : ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})