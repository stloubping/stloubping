import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gestion du pre-flight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const registration = await req.json()
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    if (!RESEND_API_KEY) {
      console.error("[registration-email] Erreur: Secret RESEND_API_KEY manquant.");
      throw new Error("Clé API Resend non configurée.");
    }

    console.log("[registration-email] Envoi de l'email via Resend pour:", registration.email);

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

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "St Loub'Ping <onboarding@resend.dev>",
        to: [registration.email],
        subject: "Confirmation d'inscription - Tournoi Saint-Loub'Ping",
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #e11d48; margin: 0;">St Loub'Ping</h1>
              <p style="color: #666; font-style: italic;">Confirmation d'inscription</p>
            </div>
            <p>Bonjour <strong>${registration.first_name}</strong>,</p>
            <p>Nous avons bien reçu votre inscription pour le tournoi régional du <strong>11 Avril 2026</strong>.</p>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e11d48;">
              <p style="margin: 5px 0;"><strong>Tableaux :</strong> ${tableauxLabels}</p>
              <p style="margin: 5px 0;"><strong>Club :</strong> ${registration.club}</p>
              <p style="margin: 5px 0;"><strong>Points :</strong> ${registration.points || '500'}</p>
            </div>
            <p style="font-size: 0.9em; color: #666;">Le règlement de votre inscription s'effectuera sur place le jour du tournoi.</p>
            <p>À très bientôt dans notre salle !</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 0.8em; color: #999; text-align: center;">Ceci est un message automatique envoyé via Resend.</p>
          </div>
        `,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("[registration-email] Erreur API Resend:", data);
      throw new Error(data.message || "Erreur lors de l'envoi via Resend");
    }

    console.log("[registration-email] Email envoyé avec succès via Resend ID:", data.id);

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error(`[registration-email] Erreur critique : ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})