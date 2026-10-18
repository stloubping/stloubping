import { createNotificationHandler, escapeHtml } from "../_shared/email-security.ts";

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


export const handler = createNotificationHandler("equipment", (order) => {
  if (!Array.isArray(order.items) || order.items.length < 1 || order.items.length > 20) throw new Error("Invalid stored items");
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

  return { subject: `Confirmation de votre commande de matériel n° ${shortOrderId}`, html: `
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
          </div>` };
});

Deno.serve(handler);
