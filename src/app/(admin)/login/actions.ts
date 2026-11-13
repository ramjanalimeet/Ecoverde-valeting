"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { destroySession, hashPassword, requireAuth, checkPassword } from "@/lib/auth";
import { requireDB, setSetting, STATUSES, type Booking } from "@/lib/db";
import { reviewEmail, reviewUrl, sendEmail } from "@/lib/email";

const now = () => new Date().toISOString();
const str = (f: FormData, k: string, max = 5000) => String(f.get(k) ?? "").trim().slice(0, max);

export async function signOut() {
  await destroySession();
  redirect("/login");
}

/* ------------------------------------------------------------- Bookings */
export async function updateBooking(form: FormData) {
  await requireAuth();
  const id = Number(form.get("id"));
  const status = str(form, "status", 20);
  if (!id || !STATUSES.some((s) => s.value === status)) redirect(`/login/bookings/${id}?error=1`);
  const db = await requireDB();
  await db
    .prepare("UPDATE bookings SET status = ?, notes = ?, updated_at = ? WHERE id = ?")
    .bind(status, str(form, "notes") || null, now(), id)
    .run();
  revalidatePath("/login", "layout");
  redirect(`/login/bookings/${id}?saved=1`);
}

export async function setBookingStatus(form: FormData) {
  await requireAuth();
  const id = Number(form.get("id"));
  const status = str(form, "status", 20);
  if (!id || !STATUSES.some((s) => s.value === status)) return;
  const db = await requireDB();
  await db.prepare("UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?").bind(status, now(), id).run();
  revalidatePath("/login", "layout");
}

/** Mark a booking completed and email the customer a Google review request. */
export async function completeAndRequestReview(form: FormData) {
  await requireAuth();
  const id = Number(form.get("id"));
  const db = await requireDB();
  const b = await db.prepare("SELECT * FROM bookings WHERE id = ?").bind(id).first<Booking>();
  if (!b) redirect("/login/bookings");
  await db.prepare("UPDATE bookings SET status = 'completed', updated_at = ? WHERE id = ?").bind(now(), id).run();
  let result = "noemail";
  if (b.email) {
    const mail = reviewEmail(b.name.trim().split(/\s+/)[0], await reviewUrl());
    result = await sendEmail({ to: b.email, ...mail, bookingId: id });
  }
  revalidatePath("/login", "layout");
  redirect(`/login/bookings/${id}?review=${result}`);
}

export async function deleteBooking(form: FormData) {
  await requireAuth();
  const id = Number(form.get("id"));
  const db = await requireDB();
  await db.prepare("DELETE FROM bookings WHERE id = ?").bind(id).run();
  revalidatePath("/login", "layout");
  redirect("/login/bookings?deleted=1");
}

export async function markMessageRead(form: FormData) {
  await requireAuth();
  const id = Number(form.get("id"));
  const read = form.get("read") === "1" ? 1 : 0;
  const db = await requireDB();
  await db.prepare("UPDATE bookings SET message_read = ? WHERE id = ?").bind(read, id).run();
  revalidatePath("/login", "layout");
}

/* ----------------------------------------------------------------- Blog */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

export async function savePost(form: FormData) {
  await requireAuth();
  const db = await requireDB();
  const id = Number(form.get("id")) || null;
  const title = str(form, "title", 200);
  const slug = slugify(str(form, "slug", 100) || title);
  const excerpt = str(form, "excerpt", 400) || null;
  const body = str(form, "body", 50000);
  const cover = str(form, "cover", 500) || null;
  const status = form.get("status") === "published" ? "published" : "draft";
  if (!title || !slug) redirect(id ? `/login/blog/${id}?error=title` : "/login/blog/new?error=title");

  const clash = await db.prepare("SELECT id FROM posts WHERE slug = ? AND id != ?").bind(slug, id ?? 0).first();
  if (clash) redirect(id ? `/login/blog/${id}?error=slug` : "/login/blog/new?error=slug");

  let postId = id;
  if (id) {
    await db
      .prepare(
        `UPDATE posts SET title = ?, slug = ?, excerpt = ?, body = ?, cover = ?, status = ?, updated_at = ?,
         published_at = CASE WHEN ? = 'published' AND published_at IS NULL THEN ? ELSE published_at END WHERE id = ?`
      )
      .bind(title, slug, excerpt, body, cover, status, now(), status, now(), id)
      .run();
  } else {
    const res = await db
      .prepare("INSERT INTO posts (title, slug, excerpt, body, cover, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(title, slug, excerpt, body, cover, status, status === "published" ? now() : null)
      .run();
    postId = Number(res.meta.last_row_id);
  }
  revalidatePath("/journal", "layout");
  revalidatePath("/login/blog");
  redirect(`/login/blog/${postId}?saved=1`);
}

export async function deletePost(form: FormData) {
  await requireAuth();
  const db = await requireDB();
  await db.prepare("DELETE FROM posts WHERE id = ?").bind(Number(form.get("id"))).run();
  revalidatePath("/journal", "layout");
  redirect("/login/blog?deleted=1");
}

/* ------------------------------------------------------------- Settings */
export async function saveSettings(form: FormData) {
  await requireAuth();
  const email = str(form, "notify_email", 200);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) redirect("/login/settings?error=email");
  await setSetting("notify_email", email);
  await setSetting("owner_name", str(form, "owner_name", 60) || "John");
  redirect("/login/settings?saved=1");
}

export async function changePassword(form: FormData) {
  await requireAuth();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (!(await checkPassword(current))) redirect("/login/settings?error=current");
  if (next.length < 10) redirect("/login/settings?error=short");
  if (next !== confirm) redirect("/login/settings?error=match");
  await setSetting("password_hash", await hashPassword(next));
  // Changing the password invalidates all sessions (including this one).
  await destroySession();
  redirect("/login");
}
