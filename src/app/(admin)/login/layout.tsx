import { isAuthenticated } from "@/lib/auth";
import { getDB } from "@/lib/db";
import Shell from "./Sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Signed out: /login shows the sign-in screen (sub-pages redirect here themselves).
  if (!(await isAuthenticated())) return <>{children}</>;
  const db = await getDB();
  let counts = { newBookings: 0, unread: 0 };
  if (db) {
    const row = await db
      .prepare(
        `SELECT
           SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS newBookings,
           SUM(CASE WHEN message IS NOT NULL AND message != '' AND message_read = 0 THEN 1 ELSE 0 END) AS unread
         FROM bookings`
      )
      .first<{ newBookings: number | null; unread: number | null }>();
    counts = { newBookings: row?.newBookings ?? 0, unread: row?.unread ?? 0 };
  }
  return <Shell counts={counts}>{children}</Shell>;
}
