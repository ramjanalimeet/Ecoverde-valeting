import { NextResponse } from "next/server";
import { getDB, getEnv } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOT = /bot|crawl|spider|slurp|preview|lighthouse|headless|monitor|curl|wget|python|axios/i;

/** Anonymous, cookieless visitor id: a hash of IP + browser + a server secret (nothing is stored on the device). */
async function visitorId(req: Request) {
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0";
  const ua = req.headers.get("user-agent") || "";
  const salt = (await getEnv("SESSION_SECRET")) || "ecoverde";
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${ip}|${ua}|${salt}`));
  return Buffer.from(buf).toString("hex").slice(0, 20);
}

const clean = (s: unknown, max = 200) => (typeof s === "string" ? s.slice(0, max) : "");

export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") || "";
  if (!ua || BOT.test(ua)) return new NextResponse(null, { status: 204 });
  let body: { t?: string; p?: string; r?: string; id?: number; d?: number };
  try {
    body = JSON.parse(await req.text());
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const db = await getDB();
  if (!db) return new NextResponse(null, { status: 204 });
  const vid = await visitorId(req);
  const path = clean(body.p).split("?")[0] || "/";
  if (path.startsWith("/login") || path.startsWith("/api")) return new NextResponse(null, { status: 204 });

  try {
    if (body.t === "pv") {
      let ref: string | null = null;
      try {
        const host = new URL(clean(body.r, 500)).hostname.replace(/^www\./, "");
        const self = new URL(req.url).hostname.replace(/^www\./, "");
        ref = host && host !== self ? host : null;
      } catch {
        ref = null;
      }
      const res = await db.prepare("INSERT INTO events (vid, type, path, ref) VALUES (?, 'pv', ?, ?)").bind(vid, path, ref).run();
      return NextResponse.json({ id: Number(res.meta.last_row_id) });
    }
    if (body.t === "end" && Number.isInteger(body.id)) {
      const d = Math.max(0, Math.min(Number(body.d) || 0, 30 * 60 * 1000)); // cap at 30 min per page
      await db.prepare("UPDATE events SET dur = ? WHERE id = ? AND vid = ? AND type = 'pv'").bind(d, body.id, vid).run();
      return new NextResponse(null, { status: 204 });
    }
    if (body.t === "wa") {
      await db.prepare("INSERT INTO events (vid, type, path) VALUES (?, 'wa', ?)").bind(vid, path).run();
      return new NextResponse(null, { status: 204 });
    }
  } catch (e) {
    console.error("[track]", e);
  }
  return new NextResponse(null, { status: 204 });
}
