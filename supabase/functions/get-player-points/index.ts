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
    console.log("[get-player-points] Tentative de récupération pour la licence:", licence);

    if (!licence) {
      console.error("[get-player-points] Erreur: Licence manquante dans la requête");
      return new Response(JSON.stringify({ error: 'Licence manquante' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Appel à l'API pongiste.fr
    const apiUrl = `https://www.pongiste.fr/api/joueur/${licence}`;
    console.log("[get-player-points] Appel API externe:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: { 
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.warn(`[get-player-points] Joueur non trouvé ou API indisponible (Status: ${response.status})`);
      return new Response(JSON.stringify({ error: 'Joueur non trouvé' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json();
    console.log("[get-player-points] Données reçues avec succès pour:", data.nom);
    
    // Extraction des points (plusieurs champs possibles selon l'API)
    const points = data.points || data.points_mensuels || data.points_officiels || data.classement || "500";
    const club = data.club || "Non renseigné";
    const fullName = `${data.prenom || ''} ${data.nom || ''}`.trim();

    return new Response(JSON.stringify({ 
      points: points.toString(), 
      name: fullName, 
      club: club 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("[get-player-points] Erreur critique lors de l'exécution:", error.message);
    return new Response(JSON.stringify({ error: "Erreur serveur interne" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})