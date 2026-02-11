import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { licence } = await req.json()
    console.log(`[get-player-points] Requête reçue pour la licence: ${licence}`);

    if (!licence) {
      return new Response(JSON.stringify({ error: 'Numéro de licence manquant' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Appel à l'API pongiste.fr
    const apiUrl = `https://www.pongiste.fr/api/joueur/${licence}`;
    console.log(`[get-player-points] Appel de l'API externe: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      console.error(`[get-player-points] Erreur API externe: ${response.status}`);
      throw new Error('Joueur non trouvé sur pongiste.fr');
    }

    const data = await response.json();
    console.log(`[get-player-points] Données reçues avec succès pour ${data.nom}`);

    // On essaie de récupérer les points dans différents champs possibles
    const points = data.points || data.points_mensuels || data.points_officiels || data.classement;

    return new Response(JSON.stringify({ 
      points: points, 
      name: `${data.prenom || ''} ${data.nom || ''}`.trim(), 
      club: data.club 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error(`[get-player-points] Erreur critique:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})