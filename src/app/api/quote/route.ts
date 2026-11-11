import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { SITE } from "@/data/site";
import { serviceLabel, validatePhotos, validateQuote, type QuoteFields } from "@/lib/quote";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Very small in-memory rate limit (per server instance): 5 requests / 10 min / IP.
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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

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

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("[quote] SMTP is not configured — set SMTP_HOST, SMTP_USER and SMTP_PASS.");
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
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 465),
      secure: (SMTP_SECURE ?? "true") !== "false",
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transport.sendMail({
      from: QUOTE_FROM_EMAIL || SMTP_USER,
      to: QUOTE_TO_EMAIL || SITE.email,
      replyTo: fields.email || undefined,
      subject: `New quote request — ${fields.name} (${fields.car}, ${serviceLabel(fields.service)})`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
      html: `<h2>New quote request</h2><table cellpadding="6" style="border-collapse:collapse">${rows
        .map(([k, v]) => `<tr><th align="left" valign="top">${esc(k)}</th><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
        .join("")}</table>`,
      attachments: await Promise.all(
        photos.map(async (p, i) => ({
          filename: p.name.replace(/[^\w.\-]+/g, "_").slice(-80) || `photo-${i + 1}.jpg`,
          content: Buffer.from(await p.arrayBuffer()),
          contentType: p.type || undefined,
        }))
      ),
    });
  } catch (e) {
    console.error("[quote] sendMail failed", e);
    return NextResponse.json(
      { ok: false, message: "Sorry — we couldn't send your request just now. Please call or WhatsApp us instead." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
