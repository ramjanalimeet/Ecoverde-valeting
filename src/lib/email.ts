import { PRIMARY_PHONE, SITE } from "@/data/site";
import { getDB, getEnv } from "./db";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Where "Leave us a Google review" points. Set GOOGLE_REVIEW_URL on the Worker to your Google "write a review" link. */
export async function reviewUrl() {
  return (await getEnv("GOOGLE_REVIEW_URL")) || "https://www.google.com/search?q=Ecoverde+Valeting+Service+reviews";
}

/** The review-request email (HTML + text). Also used for the dashboard preview. */
export function reviewEmail(firstName: string, url: string) {
  const name = esc(firstName || "there");
  const site = SITE.url.replace(/^https?:\/\//, "");
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f7f5;font-family:Arial,Helvetica,sans-serif;color:#1b2a24">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:460px;margin:0 auto;background:#fff;border:1px solid #e1ebe5;border-radius:14px;overflow:hidden">
<tr><td style="padding:22px 22px;background:#0e4a35;background:linear-gradient(110deg,#0e4a35,#1b7a54);color:#fff;font-size:20px;font-weight:bold">ecoverde Valeting</td></tr>
<tr><td style="padding:24px 22px 8px;font-size:14px;line-height:1.6">
<p style="margin:0 0 14px">Hi ${name},</p>
<p style="margin:0 0 14px">Thank you for choosing <strong>Ecoverde Valeting</strong> — it was a pleasure taking care of your car. We hope you're delighted with the results!</p>
<p style="margin:0 0 20px">If you have a moment, a quick Google review would mean the world to us and helps other drivers find an eco-friendly valet they can trust.</p>
<p style="margin:0 0 24px"><a href="${esc(url)}" style="display:inline-block;padding:12px 20px;border-radius:8px;background:#1b7a54;color:#fff;text-decoration:none;font-weight:bold">Leave us a Google review &#9733;</a></p>
<p style="margin:0">Thanks again,<br><strong>John — Ecoverde Valeting</strong></p>
</td></tr>
<tr><td style="padding:14px 22px 22px;font-size:11px;color:#6a7f75">${esc(PRIMARY_PHONE.display)} · ${esc(site)}</td></tr>
</table></body></html>`;
  const text = `Hi ${firstName || "there"},

Thank you for choosing Ecoverde Valeting — it was a pleasure taking care of your car. We hope you're delighted with the results!

If you have a moment, a quick Google review would mean the world to us and helps other drivers find an eco-friendly valet they can trust:
${url}

Thanks again,
John — Ecoverde Valeting
${PRIMARY_PHONE.display} · ${site}`;
  return { subject: "Thank you from Ecoverde Valeting — how did we do?", html, text };
}

/** Send via Resend and record it in the email log. Returns "sent" | "skipped" | "failed". */
export async function sendEmail(opts: { to: string; subject: string; html: string; text: string; replyTo?: string; bookingId?: number | null }) {
  const db = await getDB();
  const key = await getEnv("RESEND_API_KEY");
  const from = (await getEnv("QUOTE_FROM_EMAIL")) || "Ecoverde Website <quotes@ecoverdevaleting.co.uk>";
  const log = async (status: string, error?: string) =>
    db
      ?.prepare("INSERT INTO email_log (booking_id, to_addr, subject, status, error) VALUES (?, ?, ?, ?, ?)")
      .bind(opts.bookingId ?? null, opts.to, opts.subject, status, error ?? null)
      .run()
      .catch(() => {});
  if (!key) {
    await log("skipped", "RESEND_API_KEY is not set");
    return "skipped" as const;
  }
  try {
    const res = await fetch((await getEnv("RESEND_API_URL")) || "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [opts.to], reply_to: opts.replyTo || SITE.email, subject: opts.subject, html: opts.html, text: opts.text }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
    await log("sent");
    return "sent" as const;
  } catch (e) {
    await log("failed", e instanceof Error ? e.message : String(e));
    return "failed" as const;
  }
}
