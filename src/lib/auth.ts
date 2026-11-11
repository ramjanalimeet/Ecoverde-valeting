import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEnv, getSetting } from "./db";

export const SESSION_COOKIE = "ev_session";
const SESSION_DAYS = 14;
const enc = new TextEncoder();

const b64url = (buf: ArrayBuffer | Uint8Array) =>
  Buffer.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** PBKDF2-SHA256 hash, stored as "pbkdf2$<iterations>$<salt>$<hash>". */
export async function hashPassword(password: string, salt?: string, iterations = 100_000) {
  const s = salt ?? b64url(crypto.getRandomValues(new Uint8Array(16)));
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode(s), iterations }, key, 256);
  return ["pbkdf2", iterations, s, b64url(bits)].join("$");
}

async function verifyHash(password: string, stored: string) {
  const [, it, salt] = stored.split("$");
  return safeEqual(await hashPassword(password, salt, Number(it)), stored);
}

/**
 * A password changed in Settings (hashed in D1) wins; otherwise the DASHBOARD_PASSWORD secret.
 */
export async function checkPassword(password: string): Promise<boolean> {
  const stored = await getSetting("password_hash");
  if (stored) return verifyHash(password, stored);
  const envPw = await getEnv("DASHBOARD_PASSWORD");
  if (!envPw) return false;
  return safeEqual(await hmac("pw", password), await hmac("pw", envPw));
}

/** Session key includes the current password version, so changing the password signs everyone out. */
async function sessionKey() {
  const secret = (await getEnv("SESSION_SECRET")) || (await getEnv("DASHBOARD_PASSWORD"));
  if (!secret) throw new Error("SESSION_SECRET is not configured.");
  const version = (await getSetting("password_hash")) ?? "env";
  return `${secret}:${version}`;
}

export async function createSession() {
  const exp = Date.now() + SESSION_DAYS * 864e5;
  const value = `${exp}.${await hmac(await sessionKey(), String(exp))}`;
  (await cookies()).set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return false;
  const [exp, sig] = raw.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  try {
    return safeEqual(sig, await hmac(await sessionKey(), exp));
  } catch {
    return false;
  }
}

/** Call at the top of every dashboard page and server action. */
export async function requireAuth() {
  if (!(await isAuthenticated())) redirect("/login");
}
