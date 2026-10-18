import { createNotificationHandler, escapeHtml } from "../_shared/email-security.ts";

const tableauxLabels: Record<string, string> = {
  t1: "500-799 (8h30)", t2: "500-1399 (9h30)", t3: "500-999 (10h30)",
  t4: "500-1599 (11h30)", t5: "500-1199 (13h30)", t6: "500-Non Num FR (14h30)",
  d1: "Doubles <2800 Pts (16h00)",
};

export const handler = createNotificationHandler("tournament", (registration) => {
  const selected = Array.isArray(registration.selected_tableaux) ? registration.selected_tableaux : [];
  const tableauxLabelsText = selected.map((id) => escapeHtml(tableauxLabels[String(id)] || id)).join(", ");
  return {
    subject: "Confirmation d'inscription - Tournoi Saint-Loub'Ping",
    html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #000; padding: 30px 20px; text-align: center;">
              <h1 style="color: #e11d48; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">St Loub'Ping</h1>
              <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">Club de Tennis de Table de Saint-Loubès</p>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #111827; margin-top: 0;">Confirmation d'inscription</h2>
              <p>Bonjour <strong>${escapeHtml(registration.first_name)}</strong>,</p>
              <p>Nous avons le plaisir de vous confirmer votre inscription pour notre tournoi régional qui se déroulera le <strong>samedi 11 avril 2026</strong> au gymnase de Saint-Loubès.</p>
              
              <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #fee2e2;">
                <h3 style="color: #e11d48; margin-top: 0; font-size: 16px;">Récapitulatif de votre engagement :</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;">Joueur :</td>
                    <td style="padding: 5px 0; font-weight: bold;">${escapeHtml(registration.first_name)} ${escapeHtml(registration.last_name)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;">Club :</td>
                    <td style="padding: 5px 0; font-weight: bold;">${escapeHtml(registration.club)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280;">Points :</td>
                    <td style="padding: 5px 0; font-weight: bold;">${escapeHtml(registration.points || '500')} pts</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280; vertical-align: top;">Tableaux :</td>
                    <td style="padding: 5px 0; font-weight: bold;">${tableauxLabelsText}</td>
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
        `
  };
});

Deno.serve(handler);
