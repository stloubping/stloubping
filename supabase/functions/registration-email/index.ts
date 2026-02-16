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
    const registration = await req.json()
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    if (!RESEND_API_KEY) {
      console.error("[registration-email] Erreur: Secret RESEND_API_KEY manquant.");
      throw new Error("Clé API Resend non configurée.");
    }

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

    console.log("[registration-email] Envoi de l'email officiel pour:", registration.email);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "St Loub'Ping <contact@saintloubping.fr>",
        to: [registration.email],
        reply_to: "saintloubping@laposte.net",
        subject: "Confirmation d'inscription - Tournoi Saint-Loub'Ping",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #000; padding: 30px 20px; text-align: center;">
              <h1 style="color: #e11d48; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">St Loub'Ping</h1>
              <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">Club de Tennis de Table de Saint-Loubès</p>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #111827; margin-top: 0;">Confirmation d'inscription</h2>
              <p>Bonjour <strong>${registration.first_name}</strong>,</p>
              <p>Nous avons le plaisir de vous confirmer votre inscription pour notre tournoi régional qui se déroulera le <strong>samedi 11 avril 2026</strong> au gymnase de Saint-Loubès.</p>
              
              <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #fee2e2;">
                <h3 style="color: #e11d48; margin-top: 0; font-size: 16px;">Récapitulatif de votre engagement :</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;">Joueur :</td>
                    <td style="padding: 5px 0; font-weight: bold;">${registration.first_name} ${registration.last_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;">Club :</td>
                    <td style="padding: 5px 0; font-weight: bold;">${registration.club}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;">Points :</td>
                    <td style="padding: 5px 0; font-weight: bold;">${registration.points || '500'} pts</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280; vertical-align: top;">Tableaux :</td>
                    <td style="padding: 5px 0; font-weight: bold;">${tableauxLabels}</td>
                  </tr>
                </table>
              </div>
              
              <p style="font-size: 14px; line-height: 1.6;">
                <strong>Informations importantes :</strong><br>
                • Le pointage s'effectue 30 minutes avant le début de chaque tableau.<br>
                • Le règlement de votre inscription se fera sur place le jour du tournoi.<br>
                • Une buvette et une restauration seront disponibles toute la journée.
              </p>
              
              <p style="margin-top: 30px;">Sportivement,<br><strong>L'équipe du St Loub'Ping</strong></p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                Impasse Max Linder, 33450 Saint-Loubès<br>
                Contact : saintloubping@laposte.net | 07 62 27 56 96
              </p>
            </div>
          </div>
        `,
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Erreur Resend");

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error(`[registration-email] Erreur : ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})