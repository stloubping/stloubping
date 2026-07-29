import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

type OrderItem = {
  reference?: unknown
  designation?: unknown
  quantity?: unknown
  color?: unknown
  thickness?: unknown
  handle?: unknown
  size?: unknown
  shoe_size?: unknown
  option?: unknown
  unit_price?: unknown
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

const formatPrice = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value)

const optionalDetails = (item: OrderItem) =>
  [
    ["Couleur", item.color],
    ["Épaisseur", item.thickness],
    ["Manche", item.handle],
    ["Taille", item.size],
    ["Pointure", item.shoe_size],
    ["Autre précision", item.option],
  ]
    .filter(([, value]) => typeof value === "string" && value.trim())
    .map(([label, value]) => `<span style="display:inline-block;margin:3px 8px 3px 0;color:#4b5563;"><strong>${escapeHtml(label)} :</strong> ${escapeHtml(value)}</span>`)
    .join("")

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const request = await req.json()
    const resendApiKey = Deno.env.get("RESEND_API_KEY")
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!resendApiKey || !supabaseUrl || !serviceRoleKey) {
      throw new Error("Configuration serveur incomplète.")
    }

    if (typeof request.order_id !== "string" || !request.order_id) {
      return new Response(JSON.stringify({ error: "Numéro de commande invalide." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const orderResponse = await fetch(
      `${supabaseUrl}/rest/v1/equipment_orders?id=eq.${encodeURIComponent(request.order_id)}&select=id,first_name,last_name,email,items,notes`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    )

    if (!orderResponse.ok) {
      throw new Error("Impossible de vérifier la commande enregistrée.")
    }

    const [order] = await orderResponse.json()
    if (
      !order ||
      !order.first_name ||
      !order.last_name ||
      !isEmail(order.email) ||
      !Array.isArray(order.items) ||
      order.items.length < 1 ||
      order.items.length > 20
    ) {
      return new Response(JSON.stringify({ error: "Commande introuvable ou incomplète." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }
    const items = order.items as OrderItem[]
    const estimatedTotal = items.reduce((total, item) => {
      const price = Number(item.unit_price)
      const quantity = Number(item.quantity)
      return total + (
        Number.isFinite(price) && Number.isFinite(quantity)
          ? price * quantity
          : 0
      )
    }, 0)

    const itemsHtml = items
      .map((item, index) => {
        const price = Number(item.unit_price)
        const quantity = Number(item.quantity) || 1
        const lineTotal = Number.isFinite(price) ? price * quantity : null

        return `
          <div style="padding:16px 0;border-bottom:1px solid #e5e7eb;">
            <div style="font-weight:700;color:#111827;">${index + 1}. ${escapeHtml(item.designation)}</div>
            <div style="margin-top:5px;font-size:14px;color:#6b7280;">
              Référence ${escapeHtml(item.reference)} · Quantité ${escapeHtml(quantity)}
              ${lineTotal === null ? "" : ` · ${escapeHtml(formatPrice(lineTotal))}`}
            </div>
            <div style="margin-top:6px;font-size:13px;">${optionalDetails(item)}</div>
          </div>`
      })
      .join("")

    const shortOrderId = String(order.id).split("-")[0].toUpperCase()
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "St Loub'Ping <contact@saintloubping.fr>",
        to: [order.email],
        bcc: ["saintloubping@laposte.net"],
        reply_to: "saintloubping@laposte.net",
        subject: `Confirmation de votre commande de matériel n° ${shortOrderId}`,
        html: `
          <div style="font-family:Arial,sans-serif;color:#111827;max-width:640px;margin:0 auto;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
            <div style="background:#111827;padding:24px 28px;">
              <div style="color:#e11d48;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">St Loub'Ping</div>
              <h1 style="color:#fff;font-size:24px;margin:8px 0 0;">Commande de matériel reçue</h1>
            </div>
            <div style="padding:26px 28px;background:#fff;">
              <p style="margin-top:0;line-height:1.6;">Bonjour <strong>${escapeHtml(order.first_name)}</strong>,</p>
              <p style="line-height:1.6;">Nous avons bien reçu votre demande de matériel Wack Sport. Le club vérifiera la disponibilité, les éventuelles remises et le montant définitif avant de vous recontacter.</p>
              <div style="margin:22px 0;padding:14px 16px;background:#f9fafb;border-radius:8px;"><strong>Commande n° ${escapeHtml(shortOrderId)}</strong></div>
              <div>${itemsHtml}</div>
              <div style="margin-top:22px;padding:18px;background:#111827;color:#fff;border-radius:10px;">
                <div style="font-size:13px;color:#d1d5db;">Total indicatif</div>
                <div style="margin-top:4px;font-size:26px;font-weight:800;color:#e11d48;">${escapeHtml(formatPrice(estimatedTotal))}</div>
              </div>
              ${order.notes ? `<p style="margin-top:20px;font-size:14px;"><strong>Remarque :</strong> ${escapeHtml(order.notes)}</p>` : ""}
              <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6b7280;">Ce message confirme uniquement la réception de votre demande. Il ne constitue pas encore une validation définitive de la commande.</p>
            </div>
            <div style="background:#f9fafb;padding:18px 28px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="font-size:12px;color:#6b7280;margin:0;">St Loub'Ping · saintloubping@laposte.net · 07 62 27 56 96</p>
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
    console.error(`[equipment-order-email] ${message}`)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
