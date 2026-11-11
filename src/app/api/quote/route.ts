import { NextResponse } from "next/server";
import { SITE } from "@/data/site";
import { serviceLabel, validatePhotos, validateQuote, type QuoteFields } from "@/lib/quote";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Light per-isolate rate limit (5 requests / 10 min / IP). For hard limits add a Cloudflare WAF rate-limiting rule on /api/quote.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip =
    req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid submission." }, { status: 400 });
  }

  // Honeypot: pretend success so bots learn nothing, but send nothing.
  if (String(form.get("company") ?? "").trim()) return NextResponse.json({ ok: true });

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many requests — please call or WhatsApp us instead." },
      { status: 429 }
    );
  }

  const str = (k: string) => String(form.get(k) ?? "").trim();
  const fields: QuoteFields = {
    name: str("name"),
    phone: str("phone"),
    address: str("address"),
    email: str("email"),
    car: str("car"),
    pets: str("pets"),
    service: str("service"),
    message: str("message"),
    consent: form.get("consent") === "on",
  };
  const photos = form.getAll("photos").filter((p): p is File => p instanceof File && p.size > 0);

  const errors = { ...validateQuote(fields) };
  const photoErr = validatePhotos(photos);
  if (photoErr) Object.assign(errors, { photos: photoErr });
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors, message: "Please check the highlighted fields." }, { status: 422 });
  }

  const { RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY) {
    console.error("[quote] RESEND_API_KEY is not set — quote emails cannot be sent.");
    return NextResponse.json(
      {
        ok: false,
        message:
          "Online quotes are temporarily unavailable. Please call or WhatsApp us and we'll quote you straight away.",
      },
      { status: 503 }
    );
  }

  const rows: [string, string][] = [
    ["Name", fields.name],
    ["Phone", fields.phone],
    ["Address / postcode", fields.address],
    ["Email", fields.email || "—"],
    ["Car", fields.car],
    ["Pets", fields.pets || "—"],
    ["Service", serviceLabel(fields.service)],
    ["Message", fields.message || "—"],
    ["Consent", "Agreed to Cancellation & Refund Policy; asked for service within 14 days"],
    ["Photos", photos.length ? `${photos.length} attached` : "None"],
  ];

  try {
    const attachments = await Promise.all(
      photos.map(async (p, i) => ({
        filename: p.name.replace(/[^\w.\-]+/g, "_").slice(-80) || `photo-${i + 1}.jpg`,
        content: Buffer.from(await p.arrayBuffer()).toString("base64"),
      }))
    );
    // Resend HTTP API — works on Cloudflare Workers (no raw SMTP sockets needed).
    const res = await fetch(process.env.RESEND_API_URL || "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: QUOTE_FROM_EMAIL || "Ecoverde Website <quotes@ecoverdevaleting.co.uk>",
        to: [QUOTE_TO_EMAIL || SITE.email],
        reply_to: fields.email || undefined,
        subject: `New quote request — ${fields.name} (${fields.car}, ${serviceLabel(fields.service)})`,
        text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
        html: `<h2>New quote request</h2><table cellpadding="6" style="border-collapse:collapse">${rows
          .map(([k, v]) => `<tr><th align="left" valign="top">${esc(k)}</th><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
          .join("")}</table>`,
        attachments: attachments.length ? attachments : undefined,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
  } catch (e) {
    console.error("[quote] email send failed", e);
    return NextResponse.json(
      { ok: false, message: "Sorry — we couldn't send your request just now. Please call or WhatsApp us instead." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
