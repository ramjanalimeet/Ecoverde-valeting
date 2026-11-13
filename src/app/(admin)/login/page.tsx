import Link from "next/link";
import { getDB, getSetting, type Booking } from "@/lib/db";
import { DbMissing, RequestRows } from "./ui";
import LoginScreen from "./LoginScreen";
import { isAuthenticated } from "@/lib/auth";

export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginOrOverview() {
  if (!(await isAuthenticated())) return <LoginScreen />;
  const db = await getDB();
  const owner = (await getSetting("owner_name")) || "John";
  if (!db) return <DbMissing />;

  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
  const [stats, latest] = await Promise.all([
    db
      .prepare(
        `SELECT COUNT(*) AS total,
           SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS week,
           SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS fresh,
           SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS done
         FROM bookings`
      )
      .bind(weekAgo)
      .first<{ total: number; week: number | null; fresh: number | null; done: number | null }>(),
    db.prepare("SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5").all<Booking>(),
  ]);

  return (
    <>
      <div className="main__head">
        <h1>Overview</h1>
        <span className="main__hello">Welcome back, {owner} 👋</span>
      </div>
      <div className="stats4">
        <div className="stat">
          <strong>{stats?.total ?? 0}</strong>
          <span>Total requests</span>
        </div>
        <div className="stat">
          <strong>{stats?.week ?? 0}</strong>
          <span>Last 7 days</span>
        </div>
        <div className="stat">
          <strong>{stats?.fresh ?? 0}</strong>
          <span>New / to action</span>
        </div>
        <div className="stat">
          <strong>{stats?.done ?? 0}</strong>
          <span>Completed</span>
        </div>
      </div>
      <section className="panel">
        <div className="panel__head">
          <h2>Latest requests</h2>
          <Link href="/login/bookings">View all →</Link>
        </div>
        <RequestRows items={latest.results} />
      </section>
    </>
  );
}
