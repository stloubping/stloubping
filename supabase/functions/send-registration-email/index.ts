import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts"

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
    console.log("[send-registration-email] Tentative d'envoi pour:", registration.email);

    const GMAIL_USER = Deno.env.get('GMAIL_USER')
    const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD')

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.error("[send-registration-email] Erreur: Secrets GMAIL_USER ou GMAIL_APP_PASSWORD manquants.");
      throw new Error("Identifiants Gmail non configurés dans les secrets Supabase.");
    }

    // Configuration du client Denomailer (plus moderne et compatible)
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: GMAIL_USER,
          password: GMAIL_APP_PASSWORD,
        },
      },
    });

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

    console.log("[send-registration-email] Envoi du message via Denomailer...");
    
    await client.send({
      from: GMAIL_USER,
      to: registration.email,
      subject: "Confirmation d'inscription - Tournoi Saint-Loub'Ping",
      content: `Bonjour ${registration.first_name},\n\nNous avons bien reçu votre inscription pour le tournoi du 11 Avril 2026.\n\nRécapitulatif :\n- Joueur : ${registration.first_name} ${registration.last_name}\n- Club : ${registration.club}\n- Tableaux : ${tableauxLabels}\n\nÀ bientôt !`,
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
          <p style="font-size: 0.8em; color: #999; text-align: center;">Ceci est un message automatique, merci de ne pas y répondre.</p>
        </div>
      `,
    });

    await client.close();
    console.log("[send-registration-email] Email envoyé avec succès.");

    return new Response(JSON.stringify({ success: true }), {
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