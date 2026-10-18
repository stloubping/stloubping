export type NotificationKind = "tournament" | "trial" | "equipment";
export type EmailRecord = Record<string, unknown>;
export type RenderedEmail = { subject: string; html: string; replyTo?: string };

type Dependencies = {
  fetch: typeof fetch;
  env: (key: string) => string | undefined;
};

const CLUB_EMAIL = "saintloubping@laposte.net";
const ALLOWED_ORIGINS = new Set([
  "https://www.saintloubping.fr", "https://saintloubping.fr",
  "http://localhost:5173", "http://localhost:5174", "http://localhost:8080",
  "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:8080",
]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isEmail = (value: unknown): value is string =>
  typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const escapeHtml = (value: unknown) =>
  String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

export function createNotificationHandler(
  kind: NotificationKind,
  render: (record: EmailRecord) => RenderedEmail,
  dependencies?: Dependencies,
) {
  const callFetch = dependencies?.fetch ?? fetch;
  const env = dependencies?.env ?? ((key: string) => Deno.env.get(key));

  return async (req: Request): Promise<Response> => {
    const origin = req.headers.get("origin");
    const headers = {
      "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://www.saintloubping.fr",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Vary": "Origin",
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    };
    const respond = (status: number, body: unknown, extra?: Record<string, string>) =>
      new Response(JSON.stringify(body), { status, headers: { ...headers, ...extra } });

    if (origin && !ALLOWED_ORIGINS.has(origin)) return respond(403, { error: "Origine non autorisée." });
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (req.method !== "POST") return respond(405, { error: "Méthode non autorisée." }, { Allow: "POST, OPTIONS" });
    if (!req.headers.get("content-type")?.includes("application/json")) return respond(415, { error: "Format JSON requis." });
    if (Number(req.headers.get("content-length") || 0) > 16384) return respond(413, { error: "Demande trop volumineuse." });

    let input: Record<string, unknown>;
    try {
      const text = await req.text();
      if (text.length > 16384) return respond(413, { error: "Demande trop volumineuse." });
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid");
      input = parsed;
    } catch {
      return respond(400, { error: "Demande invalide." });
    }

    let recordId = input.registration_id ?? input.request_id ?? input.order_id;
    if (recordId !== undefined && (typeof recordId !== "string" || !UUID.test(recordId))) {
      return respond(400, { error: "Identifiant invalide." });
    }
    const hasLegacyIdentity = isEmail(input.email) &&
      typeof input.first_name === "string" && input.first_name.length > 0 && input.first_name.length <= 100 &&
      ((kind === "tournament" && typeof input.last_name === "string" && input.last_name.length > 0 && input.last_name.length <= 100) ||
        (kind === "trial" && ["trial", "pre_registration"].includes(String(input.request_type))));
    if (!recordId && !hasLegacyIdentity) return respond(400, { error: "Identifiant de demande requis." });

    const supabaseUrl = env("SUPABASE_URL");
    const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
    const resendKey = env("RESEND_API_KEY");
    if (!supabaseUrl || !serviceKey || !resendKey) {
      console.error("[club-email] Configuration serveur incomplète.");
      return respond(503, { error: "Service temporairement indisponible." });
    }
    const serverHeaders = { "Content-Type": "application/json", apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };
    const rpc = async (name: string, body: unknown) => {
      const response = await callFetch(`${supabaseUrl}/rest/v1/rpc/${name}`, {
        method: "POST", headers: serverHeaders, body: JSON.stringify(body), signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error("Database operation failed");
      return response.json();
    };

    let token: string | undefined;
    let providerAccepted = false;
    const finish = async (status: "sent" | "failed") => {
      const query = new URLSearchParams({
        notification_kind: `eq.${kind}`, record_id: `eq.${recordId}`,
        claim_token: `eq.${token}`, status: "eq.sending",
      });
      const response = await callFetch(`${supabaseUrl}/rest/v1/email_notification_deliveries?${query}`, {
        method: "PATCH",
        headers: { ...serverHeaders, Prefer: "return=representation" },
        body: JSON.stringify({ status, lease_until: null, ...(status === "sent" ? { sent_at: new Date().toISOString() } : {}) }),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error("Delivery acknowledgement failed");
      const rows = await response.json();
      if (!Array.isArray(rows) || rows.length !== 1) throw new Error("Delivery lease no longer owned");
    };

    try {
      // Older browser tabs submit fields: match an already queued, recent DB record.
      // No body field is ever used as the outgoing recipient or message content.
      if (!recordId) {
        recordId = await rpc("find_recent_club_email_record", {
          p_kind: kind, p_email: input.email, p_first_name: input.first_name,
          p_last_name: input.last_name ?? null, p_request_type: input.request_type ?? null,
        });
        if (typeof recordId !== "string" || !UUID.test(recordId)) return respond(404, { error: "Demande introuvable." });
      }
      const claim = await rpc("claim_club_email_notification", { p_kind: kind, p_record_id: recordId });
      if (claim.status === "already_sent") return respond(200, { success: true, already_sent: true });
      if (claim.status === "busy") return respond(202, { success: true, pending: true });
      if (claim.status === "rate_limited") return respond(429, { error: "Veuillez réessayer plus tard." }, { "Retry-After": "60" });
      if (claim.status !== "claimed") return respond(404, { error: "Demande introuvable ou expirée." });
      if (!UUID.test(claim.claim_token) || !claim.record || typeof claim.record !== "object") throw new Error("Invalid claim");
      token = claim.claim_token;
      const record: EmailRecord = claim.record;
      if (!isEmail(record.email)) throw new Error("Invalid stored recipient");
      const rendered = render(record);
      const response = await callFetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", Authorization: `Bearer ${resendKey}`,
          "Idempotency-Key": `club-${kind}-${recordId}`,
        },
        body: JSON.stringify({
          from: "St Loub'Ping <contact@saintloubping.fr>",
          to: [kind === "trial" ? CLUB_EMAIL : record.email],
          ...(kind === "equipment" ? { bcc: [CLUB_EMAIL] } : {}),
          reply_to: kind === "trial" ? record.email : CLUB_EMAIL,
          subject: rendered.subject.replace(/[\r\n]/g, " ").slice(0, 200),
          html: rendered.html,
        }),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) {
        // Keep the same idempotency key, lease and payload for any retry.
        // Do not leak provider error bodies, API keys or customer data.
        throw new Error("Email provider did not accept the request");
      }
      providerAccepted = true;
      await finish("sent");
      return respond(200, { success: true });
    } catch {
      if (token && !providerAccepted) {
        try { await finish("failed"); } catch { /* The lease expires safely after two minutes. */ }
      }
      console.error(`[club-email] Échec de notification (${kind}).`);
      return respond(503, { error: "L’envoi de l’e-mail n’a pas pu être confirmé. Votre demande reste enregistrée." });
    }
  };
}
