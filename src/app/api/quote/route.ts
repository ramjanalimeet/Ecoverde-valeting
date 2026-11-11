import { NextResponse } from "next/server";
import { SITE } from "@/data/site";
import { getDB, getEnv, getSetting } from "@/lib/db";
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

  const label = serviceLabel(fields.service);

  // 1) Save the request so it appears in the dashboard (even if email fails).
  let bookingId: number | null = null;
  const db = await getDB();
  if (db) {
    try {
      const res = await db
        .prepare(
          `INSERT INTO bookings (name, phone, address, email, car, pets, service, service_label, message, photos_count)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(fields.name, fields.phone, fields.address, fields.email || null, fields.car, fields.pets || null, fields.service, label, fields.message || null, photos.length)
        .run();
      bookingId = Number(res.meta.last_row_id) || null;
    } catch (e) {
      console.error("[quote] failed to save booking", e);
    }
  }

  // 2) Email the business (with photos attached).
  const apiKey = await getEnv("RESEND_API_KEY");
  const to = (await getSetting("notify_email")) || (await getEnv("QUOTE_TO_EMAIL")) || SITE.email;
  const from = (await getEnv("QUOTE_FROM_EMAIL")) || "Ecoverde Website <quotes@ecoverdevaleting.co.uk>";
  const subject = `New quote request — ${fields.name} (${fields.car}, ${label})`;
  const logEmail = async (status: string, error?: string) => {
    if (!db) return;
    await db
      .prepare("INSERT INTO email_log (booking_id, to_addr, subject, status, error) VALUES (?, ?, ?, ?, ?)")
      .bind(bookingId, to, subject, status, error ?? null)
      .run()
      .catch((e: unknown) => console.error("[quote] email log failed", e));
  };

  const rows: [string, string][] = [
    ["Name", fields.name],
    ["Phone", fields.phone],
    ["Address / postcode", fields.address],
    ["Email", fields.email || "—"],
    ["Car", fields.car],
    ["Pets", fields.pets || "—"],
    ["Service", label],
    ["Message", fields.message || "—"],
    ["Consent", "Agreed to Cancellation & Refund Policy; asked for service within 14 days"],
    ["Photos", photos.length ? `${photos.length} attached` : "None"],
  ];

  let emailed = false;
  if (!apiKey) {
    console.error("[quote] RESEND_API_KEY is not set — notification email skipped.");
    await logEmail("skipped", "RESEND_API_KEY is not set");
  } else {
    try {
      const attachments = await Promise.all(
        photos.map(async (p, i) => ({
          filename: p.name.replace(/[^\w.\-]+/g, "_").slice(-80) || `photo-${i + 1}.jpg`,
          content: Buffer.from(await p.arrayBuffer()).toString("base64"),
        }))
      );
      const site = (await getEnv("NEXT_PUBLIC_SITE_URL")) || SITE.url;
      const link = bookingId ? `<p><a href="${site}/dashboard/bookings/${bookingId}">Open in dashboard</a></p>` : "";
      // Resend HTTP API — works on Cloudflare Workers (no raw SMTP sockets needed).
      const res = await fetch((await getEnv("RESEND_API_URL")) || "https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: fields.email || undefined,
          subject,
          text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
          html: `<h2>New quote request</h2><table cellpadding="6" style="border-collapse:collapse">${rows
            .map(([k, v]) => `<tr><th align="left" valign="top">${esc(k)}</th><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
            .join("")}</table>${link}`,
          attachments: attachments.length ? attachments : undefined,
        }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
      emailed = true;
      await logEmail("sent");
    } catch (e) {
      console.error("[quote] email send failed", e);
      await logEmail("failed", e instanceof Error ? e.message : String(e));
    }
  }

  // Success if the request reached John by at least one route (dashboard or email).
  if (bookingId || emailed) return NextResponse.json({ ok: true, id: bookingId });

  return NextResponse.json(
    {
      ok: false,
      message: "Sorry — we couldn't send your request just now. Please call or WhatsApp us and we'll quote you straight away.",
    },
    { status: 503 }
  );
}
