import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getDB, statusLabel } from "@/lib/db";
import { OPTION_FLOOR_PRICE, QUOTE_OPTIONS, optionFor } from "@/lib/quote";
import { DbMissing } from "../ui";

export const metadata = { title: "Analytics" };

const RANGES = [
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "3m", label: "3 months", days: 91 },
  { key: "6m", label: "6 months", days: 182 },
  { key: "1y", label: "1 year", days: 365 },
] as const;

const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;
const fmtDur = (ms: number) => {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
};
const day = (d: Date) => d.toISOString().slice(0, 10);

export default async function Analytics({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAuth();
  const sp = await searchParams;
  const db = await getDB();
  if (!db) return <DbMissing />;

  const range = RANGES.find((r) => r.key === sp.range) ?? RANGES[1];
  const since = new Date(Date.now() - (range.days - 1) * 864e5);
  since.setUTCHours(0, 0, 0, 0);
  const sinceIso = since.toISOString();
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();

  // Group the visitors chart by day / week / month depending on the range
  const bucket = range.days <= 31 ? "day" : range.days <= 91 ? "week" : "month";
  const bucketSql =
    bucket === "day" ? "substr(ts, 1, 10)" : bucket === "week" ? "strftime('%Y-%W', ts)" : "substr(ts, 1, 7)";

  const [byService, wa, totals, traffic, avgVisit, newVisitors, series, pages, sources, statuses] = await Promise.all([
    db.prepare("SELECT service, COUNT(*) AS n FROM bookings WHERE created_at >= ? GROUP BY service").bind(sinceIso).all<{ service: string; n: number }>(),
    db.prepare("SELECT COUNT(DISTINCT vid) AS n FROM events WHERE type = 'wa' AND ts >= ?").bind(sinceIso).first<{ n: number }>(),
    db
      .prepare(
        `SELECT COUNT(*) AS total,
           SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS month,
           SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS week,
           SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS done
         FROM bookings`
      )
      .bind(monthStart.toISOString(), weekAgo)
      .first<{ total: number; month: number | null; week: number | null; done: number | null }>(),
    db
      .prepare("SELECT COUNT(DISTINCT vid) AS visitors, COUNT(*) AS views FROM events WHERE type = 'pv' AND ts >= ?")
      .bind(sinceIso)
      .first<{ visitors: number; views: number }>(),
    // Average time on site = average per visitor per day of total time on pages
    db
      .prepare(
        `SELECT AVG(t) AS avg FROM (SELECT SUM(dur) AS t FROM events WHERE type = 'pv' AND ts >= ? AND dur > 0 GROUP BY vid, substr(ts, 1, 10))`
      )
      .bind(sinceIso)
      .first<{ avg: number | null }>(),
    db
      .prepare(`SELECT COUNT(*) AS n FROM (SELECT vid, MIN(ts) AS first FROM events WHERE type = 'pv' GROUP BY vid) WHERE first >= ?`)
      .bind(sinceIso)
      .first<{ n: number }>(),
    db
      .prepare(`SELECT ${bucketSql} AS b, COUNT(DISTINCT vid) AS v, COUNT(*) AS pv FROM events WHERE type = 'pv' AND ts >= ? GROUP BY b ORDER BY b`)
      .bind(sinceIso)
      .all<{ b: string; v: number; pv: number }>(),
    db
      .prepare("SELECT path AS k, COUNT(*) AS n FROM events WHERE type = 'pv' AND ts >= ? GROUP BY path ORDER BY n DESC LIMIT 8")
      .bind(sinceIso)
      .all<{ k: string; n: number }>(),
    db
      .prepare("SELECT COALESCE(ref, 'Direct') AS k, COUNT(DISTINCT vid) AS n FROM events WHERE type = 'pv' AND ts >= ? GROUP BY k ORDER BY n DESC LIMIT 8")
      .bind(sinceIso)
      .all<{ k: string; n: number }>(),
    db.prepare("SELECT status AS k, COUNT(*) AS n FROM bookings WHERE created_at >= ? GROUP BY k ORDER BY n DESC").bind(sinceIso).all<{ k: string; n: number }>(),
  ]);

  // Value from enquiries: each enquiry valued at the lowest price of the service chosen
  const svc = new Map<string, number>();
  for (const r of byService.results) {
    const o = optionFor(r.service);
    svc.set(o, (svc.get(o) ?? 0) + r.n);
  }
  const rows = [...svc.entries()]
    .map(([o, n]) => ({
      label: QUOTE_OPTIONS.find((x) => x.value === o)?.label ?? o,
      n,
      value: n * (OPTION_FLOOR_PRICE[o] ?? 109),
    }))
    .sort((a, b) => b.value - a.value);
  const enquiries = rows.reduce((a, r) => a + r.n, 0);
  const value = rows.reduce((a, r) => a + r.value, 0);

  // Fill every bucket so the chart has no gaps
  const buckets: { b: string; label: string; v: number }[] = [];
  if (bucket === "day") {
    for (let i = 0; i < range.days; i++) {
      const d = day(new Date(since.getTime() + i * 864e5));
      buckets.push({ b: d, label: d.slice(5), v: series.results.find((s) => s.b === d)?.v ?? 0 });
    }
  } else {
    for (const s of series.results) buckets.push({ b: s.b, label: s.b, v: s.v });
  }
  const max = Math.max(1, ...buckets.map((b) => b.v));
  const hasTraffic = (traffic?.views ?? 0) > 0;

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
      <div className="main__head an-head">
        <div>
          <h1>Analytics</h1>
          <span className="main__hello">Website &amp; booking insights</span>
        </div>
        <nav className="seg" aria-label="Date range">
          {RANGES.map((r) => (
            <Link key={r.key} href={`/login/analytics?range=${r.key}`} aria-current={r.key === range.key ? "true" : undefined}>
              {r.label}
            </Link>
          ))}
        </nav>
      </div>

      <h2 className="an-title">
        Value from your website <span className="tag">last {range.label}</span>
      </h2>
      <div className="an-value">
        <div className="stat stat--tall">
          <strong>{gbp(value)}</strong>
          <span>Est. value from enquiries</span>
        </div>
        <div className="stat stat--tall">
          <strong>{wa?.n ?? 0}</strong>
          <span>WhatsApp clicks</span>
        </div>
        <div className="stat an-svc">
          <p className="an-svc__title">Enquiries by service</p>
          {rows.length ? (
            <ul>
              {rows.map((r) => (
                <li key={r.label}>
                  <span>
                    {r.label} <small>× {r.n}</small>
                  </span>
                  <b>{gbp(r.value)}</b>
                </li>
              ))}
            </ul>
          ) : (
            <p className="main__hello">No enquiries in this period.</p>
          )}
        </div>
      </div>
      <p className="an-note">
        A conservative floor: each of your <strong>{enquiries}</strong> booking-form enquiries valued at the <strong>lowest</strong> price of the
        service they chose. It shows sales the website likely generated as warm leads — not confirmed revenue. WhatsApp clicks are counted once per
        visitor.
      </p>

      <h2 className="an-title">From your bookings (live)</h2>
      <div className="stats4">
        <div className="stat">
          <strong>{totals?.total ?? 0}</strong>
          <span>Total requests</span>
        </div>
        <div className="stat">
          <strong>{totals?.month ?? 0}</strong>
          <span>This month</span>
        </div>
        <div className="stat">
          <strong>{totals?.week ?? 0}</strong>
          <span>Last 7 days</span>
        </div>
        <div className="stat">
          <strong>{totals?.done ?? 0}</strong>
          <span>Completed</span>
        </div>
      </div>

      <h2 className="an-title">
        Website traffic <span className="tag">Live · last {range.label}</span>
      </h2>
      <div className="stats4">
        <div className="stat">
          <strong>{traffic?.visitors ?? 0}</strong>
          <span>Visitors</span>
        </div>
        <div className="stat">
          <strong>{traffic?.views ?? 0}</strong>
          <span>Page views</span>
        </div>
        <div className="stat">
          <strong>{fmtDur(avgVisit?.avg ?? 0)}</strong>
          <span>Avg. time on site</span>
        </div>
        <div className="stat">
          <strong>{newVisitors?.n ?? 0}</strong>
          <span>New visitors</span>
        </div>
      </div>

      <section className="panel">
        <div className="panel__head">
          <h2>Visitors over time</h2>
          <span className="main__hello">per {bucket}</span>
        </div>
        <div className="panel__body">
          {hasTraffic ? (
            <>
              <div className="bars" role="img" aria-label={`Visitors per ${bucket}, peak ${max}`}>
                {buckets.map((b) => (
                  <div key={b.b} style={{ height: `${(b.v / max) * 100}%` }} title={`${b.label}: ${b.v} visitors`} />
                ))}
              </div>
              <div className="bars__axis">
                <span>{buckets[0]?.label}</span>
                <span>{buckets[buckets.length - 1]?.label}</span>
              </div>
            </>
          ) : (
            <p className="main__hello">Traffic tracking has just started — visitor numbers will appear here as people use the website.</p>
          )}
        </div>
      </section>

      <div className="grid2">
        <section className="panel">
          <div className="panel__head">
            <h2>Top pages</h2>
          </div>
          <div className="panel__body">
            <HBars items={pages.results.map((r) => [r.k, r.n])} />
          </div>
        </section>
        <section className="panel">
          <div className="panel__head">
            <h2>Where visitors come from</h2>
          </div>
          <div className="panel__body">
            <HBars items={sources.results.map((r) => [r.k, r.n])} />
          </div>
        </section>
        <section className="panel">
          <div className="panel__head">
            <h2>Booking pipeline</h2>
          </div>
          <div className="panel__body">
            <HBars items={statuses.results.map((r) => [statusLabel(r.k), r.n])} />
          </div>
        </section>
      </div>
    </>
  );
}
