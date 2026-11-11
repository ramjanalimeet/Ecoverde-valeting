"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkPassword, createSession } from "@/lib/auth";

// Light per-isolate brute-force protection: 8 attempts / 15 min / IP.
const attempts = new Map<string, number[]>();

export async function login(_prev: { error?: string } | undefined, form: FormData): Promise<{ error?: string }> {
  const h = await headers();
  const ip = h.get("cf-connecting-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < 15 * 60 * 1000);
  if (recent.length >= 8) return { error: "Too many attempts. Please wait 15 minutes and try again." };

  const password = String(form.get("password") ?? "");
  let ok = false;
  try {
    ok = password.length > 0 && (await checkPassword(password));
  } catch {
    return { error: "Sign-in isn't configured yet (missing DASHBOARD_PASSWORD)." };
  }
  if (!ok) {
    recent.push(now);
    attempts.set(ip, recent);
    await new Promise((r) => setTimeout(r, 400));
    return { error: "That password isn't right." };
  }
  attempts.delete(ip);
  await createSession();
  redirect("/dashboard");
}
