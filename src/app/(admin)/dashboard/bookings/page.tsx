import Link from "next/link";
import { getDB, STATUSES, type Booking } from "@/lib/db";
import { DbMissing, RequestRows } from "../ui";

export const metadata = { title: "Bookings" };

const PAGE = 25;

export default async function Bookings({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const db = await getDB();
  if (!db) return <DbMissing />;

  const status = STATUSES.some((s) => s.value === sp.status) ? sp.status! : "";
  const q = (sp.q ?? "").trim().slice(0, 80);
  const page = Math.max(1, Number(sp.page) || 1);

  const where: string[] = [];
  const binds: unknown[] = [];
  if (status) {
    where.push("status = ?");
    binds.push(status);
  }
  if (q) {
    where.push("(name LIKE ? OR phone LIKE ? OR email LIKE ? OR car LIKE ? OR address LIKE ? OR service_label LIKE ?)");
    binds.push(...Array(6).fill(`%${q}%`));
  }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [rows, total, counts] = await Promise.all([
    db
      .prepare(`SELECT * FROM bookings ${w} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .bind(...binds, PAGE, (page - 1) * PAGE)
      .all<Booking>(),
    db.prepare(`SELECT COUNT(*) AS n FROM bookings ${w}`).bind(...binds).first<{ n: number }>(),
    db.prepare("SELECT status, COUNT(*) AS n FROM bookings GROUP BY status").all<{ status: string; n: number }>(),
  ]);
  const count = (s: string) => counts.results.find((c) => c.status === s)?.n ?? 0;
  const all = counts.results.reduce((a, c) => a + c.n, 0);
  const pages = Math.max(1, Math.ceil((total?.n ?? 0) / PAGE));
  const href = (o: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    const merged = { status, q, ...o };
    Object.entries(merged).forEach(([k, v]) => v && p.set(k, String(v)));
    const s = p.toString();
    return `/dashboard/bookings${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <div className="main__head">
        <h1>Bookings</h1>
      </div>
      {sp.deleted && <p className="flash">Request deleted.</p>}
      <div className="toolbar">
        <nav className="tabs" aria-label="Filter by status">
          <Link href={href({ status: "", page: undefined })} aria-current={!status ? "true" : undefined}>
            All<span>{all}</span>
          </Link>
          {STATUSES.map((s) => (
            <Link key={s.value} href={href({ status: s.value, page: undefined })} aria-current={status === s.value ? "true" : undefined}>
              {s.label}
              <span>{count(s.value)}</span>
            </Link>
          ))}
        </nav>
        <form className="search" action="/dashboard/bookings" role="search">
          {status && <input type="hidden" name="status" value={status} />}
          <input type="search" name="q" defaultValue={q} placeholder="Search name, phone, car, postcode…" aria-label="Search requests" />
          <button className="abtn abtn--ghost" type="submit">
            Search
          </button>
        </form>
      </div>
      <section className="panel">
        <RequestRows items={rows.results} />
      </section>
      {pages > 1 && (
        <div className="form-a__row">
          {page > 1 && (
            <Link className="abtn abtn--ghost" href={href({ page: page - 1 })}>
              ← Newer
            </Link>
          )}
          <span className="main__hello">
            Page {page} of {pages}
          </span>
          {page < pages && (
            <Link className="abtn abtn--ghost" href={href({ page: page + 1 })}>
              Older →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
