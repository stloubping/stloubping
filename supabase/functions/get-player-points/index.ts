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
    if (!licence) throw new Error('Licence manquante');

    console.log(`[get-player-points] Recherche pour : ${licence}`);

    // Appel direct à l'API pongiste
    const response = await fetch(`https://www.pongiste.fr/api/joueur/${licence}`);
    
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Non trouvé' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json();
    return new Response(JSON.stringify({ 
      points: data.points || data.points_mensuels || "500", 
      name: `${data.prenom} ${data.nom}`, 
      club: data.club 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})