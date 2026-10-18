import { createNotificationHandler, escapeHtml } from "../_shared/email-security.ts";

const profileLabels: Record<string, string> = {
  enfant: "Enfant", adolescent: "Adolescent", "adulte-loisir": "Adulte loisir", competiteur: "Compétiteur",
};

export const handler = createNotificationHandler("trial", (request) => {
    const isPreRegistration = request.request_type === "pre_registration"
    const requestLabel = isPreRegistration ? "Préinscription" : "Séance d’essai gratuite"
    const subject = isPreRegistration
      ? `Nouvelle préinscription — ${request.first_name}`
      : `Nouvelle demande d’essai gratuit — ${request.first_name}`

    const details = [
      ["Demande", requestLabel],
      ["Prénom", request.first_name],
      ["Âge", `${request.age} ans`],
      ["Profil", profileLabels[String(request.profile)] || request.profile],
      ["Niveau", request.level || "Non renseigné"],
      ["Téléphone", request.phone],
      ["E-mail", request.email],
      ...(request.slot_label ? [["Créneau", request.slot_label]] : []),
      ...(request.licence_type
        ? [["Licence souhaitée", request.licence_type === "competition" ? "Compétition" : "Loisir"]]
        : []),
    ]

    const detailsHtml = details
      .map(
        ([label, value]) => `
          <tr>
            <td style="padding:8px 12px;color:#6b7280;border-bottom:1px solid #f1f5f9;">${escapeHtml(label)}</td>
            <td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #f1f5f9;">${escapeHtml(value)}</td>
          </tr>`,
      )
      .join("")


  return { subject, html: `
          <div style="font-family:Arial,sans-serif;color:#111827;max-width:640px;margin:0 auto;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
            <div style="background:#111827;padding:24px 28px;">
              <div style="color:#e11d48;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">St Loub'Ping</div>
              <h1 style="color:#fff;font-size:24px;margin:8px 0 0;">${escapeHtml(subject)}</h1>
            </div>
            <div style="padding:26px 28px;background:#fff;">
              <p style="margin-top:0;line-height:1.6;">Une nouvelle demande vient d’être enregistrée depuis le site du club.</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px;margin:20px 0;">${detailsHtml}</table>
              <p style="margin:22px 0 0;font-size:13px;color:#6b7280;">Vous pouvez répondre directement à cet e-mail pour contacter ${escapeHtml(request.first_name)}.</p>
            </div>
          </div>` };
});

Deno.serve(handler);
