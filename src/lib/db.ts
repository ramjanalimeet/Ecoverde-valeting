import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Minimal typing for the Cloudflare D1 binding we use. */
export interface D1Result<T> {
  results: T[];
  success: boolean;
  meta: { last_row_id?: number; changes?: number };
}
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<D1Result<unknown>>;
}
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result<unknown>[]>;
}

type Env = { DB?: D1Database; [k: string]: unknown };

/** Returns the D1 database, or null when the binding isn't available. */
export async function getDB(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return ((env as Env).DB as D1Database | undefined) ?? null;
  } catch {
    return null;
  }
}

export async function requireDB(): Promise<D1Database> {
  const db = await getDB();
  if (!db) throw new Error("Database binding DB is not configured.");
  return db;
}

/** Reads an env var / secret from the Cloudflare context, falling back to process.env. */
export async function getEnv(name: string): Promise<string | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const v = (env as Env)[name];
    if (typeof v === "string" && v) return v;
  } catch {
    /* not running on Cloudflare */
  }
  return process.env[name] || undefined;
}

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDB();
  if (!db) return null;
  const row = await db.prepare("SELECT value FROM settings WHERE key = ?").bind(key).first<{ value: string }>();
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  const db = await requireDB();
  await db
    .prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
    .bind(key, value)
    .run();
}

export type Booking = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  phone: string;
  address: string;
  email: string | null;
  car: string;
  pets: string | null;
  service: string;
  service_label: string;
  message: string | null;
  photos_count: number;
  status: string;
  notes: string | null;
  message_read: number;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type EmailLog = {
  id: number;
  created_at: string;
  booking_id: number | null;
  to_addr: string;
  subject: string;
  status: string;
  error: string | null;
};

export const STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "booked", label: "Booked" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;
export const statusLabel = (s: string) => STATUSES.find((x) => x.value === s)?.label ?? s;
