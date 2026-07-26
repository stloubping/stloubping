import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const profileLabels: Record<string, string> = {
  enfant: "Enfant",
  adolescent: "Adolescent",
  "adulte-loisir": "Adulte loisir",
  competiteur: "Compétiteur",
}

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")

const isEmail = (value: unknown) =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const request = await req.json()
    const resendApiKey = Deno.env.get("RESEND_API_KEY")

    if (!resendApiKey) {
      throw new Error("Clé API Resend non configurée.")
    }

    if (
      !["trial", "pre_registration"].includes(request.request_type) ||
      !request.first_name ||
      !request.age ||
      !request.profile ||
      !request.phone ||
      !isEmail(request.email)
    ) {
      return new Response(JSON.stringify({ error: "Données invalides ou incomplètes." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const isPreRegistration = request.request_type === "pre_registration"
    const requestLabel = isPreRegistration ? "Préinscription" : "Séance d’essai gratuite"
    const subject = isPreRegistration
      ? `Nouvelle préinscription — ${request.first_name}`
      : `Nouvelle demande d’essai gratuit — ${request.first_name}`

    const details = [
      ["Demande", requestLabel],
      ["Prénom", request.first_name],
      ["Âge", `${request.age} ans`],
      ["Profil", profileLabels[request.profile] || request.profile],
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

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "St Loub'Ping <contact@saintloubping.fr>",
        to: ["saintloubping@laposte.net"],
        reply_to: request.email,
        subject,
        html: `
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
          </div>`,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l’envoi de l’e-mail.")
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue"
    console.error(`[trial-request-email] ${message}`)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
