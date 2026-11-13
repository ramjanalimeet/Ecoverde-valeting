import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { getDB, getEnv, getSetting, type EmailLog } from "@/lib/db";
import { SITE } from "@/data/site";
import { DbMissing, StatusPill, fmtDateTime } from "../ui";

export const metadata = { title: "Emails" };

export default async function Emails() {
  await requireAuth();
  const db = await getDB();
  if (!db) return <DbMissing />;
  const [rows, stats] = await Promise.all([
    db.prepare("SELECT * FROM email_log ORDER BY created_at DESC LIMIT 100").all<EmailLog>(),
    db.prepare("SELECT status, COUNT(*) AS n FROM email_log GROUP BY status").all<{ status: string; n: number }>(),
  ]);
  const n = (s: string) => stats.results.find((x) => x.status === s)?.n ?? 0;
  const hasKey = Boolean(await getEnv("RESEND_API_KEY"));
  const to = (await getSetting("notify_email")) || (await getEnv("QUOTE_TO_EMAIL")) || SITE.email;

  return (
    <>
      <div className="main__head">
        <h1>Emails</h1>
        <span className="main__hello">Notifications sent to {to}</span>
      </div>
      {!hasKey && (
        <p className="flash flash--err">
          Email delivery isn&apos;t set up yet — add the <code>RESEND_API_KEY</code> secret on the Cloudflare Worker. Requests are
          still saved here in the dashboard.
        </p>
      )}
      <div className="stats4">
        <div className="stat">
          <strong>{n("sent")}</strong>
          <span>Sent</span>
        </div>
        <div className="stat">
          <strong>{n("failed")}</strong>
          <span>Failed</span>
        </div>
        <div className="stat">
          <strong>{n("skipped")}</strong>
          <span>Skipped (not set up)</span>
        </div>
        <div className="stat">
          <strong>{hasKey ? "On" : "Off"}</strong>
          <span>Email delivery</span>
        </div>
      </div>
      <section className="panel">
        {rows.results.length === 0 ? (
          <div className="empty-state">No emails yet.</div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Subject</th>
                  <th>To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.results.map((e) => (
                  <tr key={e.id}>
                    <td>{fmtDateTime(e.created_at)}</td>
                    <td>
                      {e.booking_id ? <Link href={`/login/bookings/${e.booking_id}`}>{e.subject}</Link> : e.subject}
                      {e.error && <div className="main__hello">{e.error}</div>}
                    </td>
                    <td>{e.to_addr}</td>
                    <td>
                      <StatusPill status={e.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
