import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gestion du CORS pour les requêtes depuis le navigateur
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const registration = await req.json()
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    console.log(`[send-registration-email] Tentative d'envoi pour : ${registration.email}`);

    if (!RESEND_API_KEY) {
      console.error("[send-registration-email] Erreur : RESEND_API_KEY n'est pas configurée.");
      return new Response(JSON.stringify({ error: "Service d'email non configuré" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Formatage de la liste des tableaux pour l'email
    const tableauxLabels = registration.selected_tableaux.map((t: string) => {
      switch (t) {
        case 't1': return '500-799 (8h30)';
        case 't2': return '500-1399 (9h30)';
        case 't3': return '500-999 (10h30)';
        case 't4': return '500-1599 (11h30)';
        case 't5': return '500-1199 (13h30)';
        case 't6': return '500-Non Num FR (14h30)';
        case 'd1': return 'Doubles <2800 Pts (16h00)';
        default: return t;
      }
    }).join(', ');

    // Envoi via l'API Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'St Loub Ping <tournoi@stloubping.fr>',
        to: [registration.email],
        subject: 'Confirmation d\'inscription - Tournoi Saint-Loub\'Ping',
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h1 style="color: #e11d48;">Confirmation d'inscription</h1>
            <p>Bonjour <strong>${registration.first_name}</strong>,</p>
            <p>Nous avons bien reçu votre inscription pour le tournoi régional du 11 Avril 2026.</p>
            <div style="background-color: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; font-size: 18px;">Récapitulatif de votre inscription :</h2>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Joueur :</strong> ${registration.first_name} ${registration.last_name}</li>
                <li><strong>Licence :</strong> ${registration.licence_number}</li>
                <li><strong>Points :</strong> ${registration.points}</li>
                <li><strong>Club :</strong> ${registration.club}</li>
                <li><strong>Tableaux :</strong> ${tableauxLabels}</li>
                ${registration.doubles_partner ? `<li><strong>Partenaire de double :</strong> ${registration.doubles_partner}</li>` : ''}
              </ul>
            </div>
            <p>Le règlement s'effectuera sur place le jour du tournoi.</p>
            <p>À très bientôt à la salle Jacques-Durieux !</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666;">Ceci est un message automatique, merci de ne pas y répondre.</p>
          </div>
        `,
      }),
    })

    const data = await res.json()
    console.log(`[send-registration-email] Email envoyé avec succès à ${registration.email}`);
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error(`[send-registration-email] Erreur critique : ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})