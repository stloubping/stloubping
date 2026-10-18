const assert = {
  equal(actual: unknown, expected: unknown) {
    if (!Object.is(actual, expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  },
  deepEqual(actual: unknown, expected: unknown) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error("Values differ");
  },
  ok(value: unknown) {
    if (!value) throw new Error("Assertion failed");
  },
};
import { createNotificationHandler, escapeHtml, type NotificationKind } from "./email-security.ts";

const ID = "00000000-0000-4000-8000-000000000001";
const TOKEN = "00000000-0000-4000-8000-000000000002";
const record = { id: ID, email: "stored@example.invalid", first_name: '<b>Stored</b>' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json" },
});
function request(body: unknown, extra: Record<string, string> = {}) {
  return new Request("https://functions.example.invalid/test", {
    method: "POST", headers: { "Content-Type": "application/json", ...extra },
    body: JSON.stringify(body),
  });
}
function setup(options: { status?: string; kind?: NotificationKind; providerFails?: boolean; legacyId?: string | null } = {}) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fetchMock: typeof fetch = async (input, init) => {
    const url = String(input);
    calls.push({ url, init });
    if (url.includes("find_recent_club_email_record")) return json(options.legacyId ?? null);
    if (url.includes("claim_club_email_notification")) return json({
      status: options.status ?? "claimed", claim_token: TOKEN, record,
    });
    if (url === "https://api.resend.com/emails") return json({ id: "mock-message" }, options.providerFails ? 502 : 200);
    if (url.includes("email_notification_deliveries")) return json([{}]);
    throw new Error("Unexpected network request");
  };
  const handler = createNotificationHandler(options.kind ?? "tournament", (row) => ({
    subject: "Confirmation\r\nInjected",
    html: `<p>${escapeHtml(row.first_name)}</p>`,
  }), { fetch: fetchMock, env: (key) => ({
    SUPABASE_URL: "https://db.example.invalid", SUPABASE_SERVICE_ROLE_KEY: "mock-service-key",
    RESEND_API_KEY: "mock-resend-key",
  } as Record<string, string>)[key] });
  return { handler, calls };
}

Deno.test("reject arbitrary recipient payload without a stored identity", async () => {
  const { handler, calls } = setup();
  assert.equal((await handler(request({ email: "arbitrary@example.invalid" }))).status, 400);
  assert.equal(calls.length, 0);
});
Deno.test("unknown legacy registration never sends email", async () => {
  const { handler, calls } = setup();
  assert.equal((await handler(request({ email: "arbitrary@example.invalid", first_name: "Unknown", last_name: "Unknown" }))).status, 404);
  assert.equal(calls.length, 1);
  assert.ok(calls[0].url.includes("find_recent_club_email_record"));
});
Deno.test("unknown record never sends email", async () => {
  const { handler, calls } = setup({ status: "not_found" });
  assert.equal((await handler(request({ registration_id: ID }))).status, 404);
  assert.equal(calls.length, 1);
});
Deno.test("recipient and HTML come only from stored record", async () => {
  const { handler, calls } = setup();
  assert.equal((await handler(request({ registration_id: ID, email: "attacker@example.invalid", first_name: "Attacker" }))).status, 200);
  const email = calls.find((call) => call.url === "https://api.resend.com/emails")!;
  const payload = JSON.parse(String(email.init?.body));
  assert.deepEqual(payload.to, ["stored@example.invalid"]);
  assert.equal(payload.reply_to, "saintloubping@laposte.net");
  assert.equal(payload.html, "<p>&lt;b&gt;Stored&lt;/b&gt;</p>");
  assert.ok(!/[\r\n]/.test(payload.subject));
  assert.equal((email.init?.headers as Record<string, string>)["Idempotency-Key"], `club-tournament-${ID}`);
  const acknowledgement = calls.find((call) => call.init?.method === "PATCH")!;
  assert.ok(acknowledgement.url.includes(TOKEN));
  assert.equal(JSON.parse(String(acknowledgement.init?.body)).status, "sent");
});
Deno.test("already sent notification is not sent a second time", async () => {
  const { handler, calls } = setup({ status: "already_sent" });
  assert.equal((await handler(request({ registration_id: ID }))).status, 200);
  assert.equal(calls.length, 1);
});
Deno.test("in-flight duplicate is not sent concurrently", async () => {
  const { handler, calls } = setup({ status: "busy" });
  assert.equal((await handler(request({ registration_id: ID }))).status, 202);
  assert.equal(calls.length, 1);
});
Deno.test("database quota rejects without calling provider", async () => {
  const { handler, calls } = setup({ status: "rate_limited" });
  const response = await handler(request({ registration_id: ID }));
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "60");
  assert.equal(calls.length, 1);
});
Deno.test("trial notification has fixed club recipient and stored reply address", async () => {
  const { handler, calls } = setup({ kind: "trial" });
  assert.equal((await handler(request({ request_id: ID, email: "attacker@example.invalid" }))).status, 200);
  const email = calls.find((call) => call.url === "https://api.resend.com/emails")!;
  const payload = JSON.parse(String(email.init?.body));
  assert.deepEqual(payload.to, ["saintloubping@laposte.net"]);
  assert.equal(payload.reply_to, "stored@example.invalid");
});
Deno.test("equipment confirmation copies club and cannot change recipient", async () => {
  const { handler, calls } = setup({ kind: "equipment" });
  assert.equal((await handler(request({ order_id: ID, email: "attacker@example.invalid" }))).status, 200);
  const email = calls.find((call) => call.url === "https://api.resend.com/emails")!;
  const payload = JSON.parse(String(email.init?.body));
  assert.deepEqual(payload.to, ["stored@example.invalid"]);
  assert.deepEqual(payload.bcc, ["saintloubping@laposte.net"]);
});
Deno.test("provider failure records a failed attempt and returns no secrets", async () => {
  const { handler, calls } = setup({ providerFails: true });
  const response = await handler(request({ registration_id: ID }));
  assert.equal(response.status, 503);
  assert.ok(!(await response.text()).includes("mock-resend-key"));
  const acknowledgement = calls.find((call) => call.init?.method === "PATCH")!;
  assert.equal(JSON.parse(String(acknowledgement.init?.body)).status, "failed");
});
Deno.test("unknown origins are refused without database calls", async () => {
  const { handler, calls } = setup();
  assert.equal((await handler(request({ registration_id: ID }, { Origin: "https://untrusted.example.invalid" }))).status, 403);
  assert.equal(calls.length, 0);
});
Deno.test("invalid IDs are rejected before claiming", async () => {
  const { handler, calls } = setup();
  assert.equal((await handler(request({ registration_id: "not-a-uuid" }))).status, 400);
  assert.equal(calls.length, 0);
});
Deno.test("unsupported method and malformed JSON cannot dispatch", async () => {
  const { handler, calls } = setup();
  assert.equal((await handler(new Request("https://example.invalid"))).status, 405);
  assert.equal((await handler(request(null))).status, 400);
  assert.equal((await handler(request([]))).status, 400);
  assert.equal(calls.length, 0);
});
Deno.test("HTML characters are escaped", () => {
  assert.equal(escapeHtml('<a href="x">&\'</a>'), "&lt;a href=&quot;x&quot;&gt;&amp;&#039;&lt;/a&gt;");
});
