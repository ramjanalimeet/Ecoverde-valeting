import { getDB, statusLabel } from "@/lib/db";
import { DbMissing } from "../ui";

export const metadata = { title: "Analytics" };

const DAYS = 30;

export default async function Analytics() {
  const db = await getDB();
  if (!db) return <DbMissing />;
  const since = new Date(Date.now() - (DAYS - 1) * 864e5);
  since.setUTCHours(0, 0, 0, 0);

  const [daily, services, statuses, addrs, totals] = await Promise.all([
    db
      .prepare("SELECT substr(created_at, 1, 10) AS d, COUNT(*) AS n FROM bookings WHERE created_at >= ? GROUP BY d")
      .bind(since.toISOString())
      .all<{ d: string; n: number }>(),
    db.prepare("SELECT service_label AS k, COUNT(*) AS n FROM bookings GROUP BY k ORDER BY n DESC LIMIT 10").all<{ k: string; n: number }>(),
    db.prepare("SELECT status AS k, COUNT(*) AS n FROM bookings GROUP BY k ORDER BY n DESC").all<{ k: string; n: number }>(),
    db.prepare("SELECT address FROM bookings ORDER BY created_at DESC LIMIT 1000").all<{ address: string }>(),
    db
      .prepare(
        `SELECT COUNT(*) AS total,
           SUM(CASE WHEN status IN ('booked','completed') THEN 1 ELSE 0 END) AS won,
           SUM(CASE WHEN photos_count > 0 THEN 1 ELSE 0 END) AS photos
         FROM bookings`
      )
      .first<{ total: number; won: number | null; photos: number | null }>(),
  ]);

  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(since.getTime() + i * 864e5).toISOString().slice(0, 10);
    return { d, n: daily.results.find((r) => r.d === d)?.n ?? 0 };
  });
  const max = Math.max(1, ...days.map((d) => d.n));
  const last30 = days.reduce((a, d) => a + d.n, 0);

  // Outward postcode (e.g. "W4", "TW8") from the free-text address
  const areas = new Map<string, number>();
  for (const { address } of addrs.results) {
    const m = address.toUpperCase().match(/\b([A-Z]{1,2}\d[A-Z\d]?)\s*\d[A-Z]{2}\b/) || address.toUpperCase().match(/\b([A-Z]{1,2}\d{1,2}[A-Z]?)\b/);
    const k = m ? m[1] : "Unknown";
    areas.set(k, (areas.get(k) ?? 0) + 1);
  }
  const topAreas = [...areas.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

  const total = totals?.total ?? 0;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  const HBars = ({ items }: { items: [string, number][] }) => {
    const m = Math.max(1, ...items.map(([, n]) => n));
    return items.length ? (
      <ul className="hbars">
        {items.map(([k, n]) => (
          <li key={k}>
            <span title={k}>{k}</span>
            <span className="hbars__track">
              <i style={{ width: `${(n / m) * 100}%` }} />
            </span>
            <span>{n}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="main__hello">No data yet.</p>
    );
  };

  return (
    <>
      <div className="main__head">
        <h1>Analytics</h1>
        <span className="main__hello">Based on quote requests</span>
      </div>
      <div className="stats4">
        <div className="stat">
          <strong>{last30}</strong>
          <span>Requests, last 30 days</span>
        </div>
        <div className="stat">
          <strong>{total}</strong>
          <span>All-time requests</span>
        </div>
        <div className="stat">
          <strong>{pct(totals?.won ?? 0)}%</strong>
          <span>Booked or completed</span>
        </div>
        <div className="stat">
          <strong>{pct(totals?.photos ?? 0)}%</strong>
          <span>Sent photos</span>
        </div>
      </div>
      <section className="panel">
        <div className="panel__head">
          <h2>Requests per day — last {DAYS} days</h2>
        </div>
        <div className="panel__body">
          <div className="bars" role="img" aria-label={`Requests per day over the last ${DAYS} days, peak ${max}`}>
            {days.map((d) => (
              <div key={d.d} style={{ height: `${(d.n / max) * 100}%` }} title={`${d.d}: ${d.n}`} />
            ))}
          </div>
          <div className="bars__axis">
            <span>{days[0].d.slice(5)}</span>
            <span>{days[days.length - 1].d.slice(5)}</span>
          </div>
        </div>
      </section>
      <div className="grid2">
        <section className="panel">
          <div className="panel__head">
            <h2>Most requested services</h2>
          </div>
          <div className="panel__body">
            <HBars items={services.results.map((r) => [r.k, r.n])} />
          </div>
        </section>
        <section className="panel">
          <div className="panel__head">
            <h2>Top postcodes</h2>
          </div>
          <div className="panel__body">
            <HBars items={topAreas} />
          </div>
        </section>
        <section className="panel">
          <div className="panel__head">
            <h2>Pipeline</h2>
          </div>
          <div className="panel__body">
            <HBars items={statuses.results.map((r) => [statusLabel(r.k), r.n])} />
          </div>
        </section>
      </div>
    </>
  );
}
