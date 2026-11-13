import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getDB, getEnv, type EmailLog } from "@/lib/db";
import { reviewEmail, reviewUrl } from "@/lib/email";
import { StatusPill, fmtDateTime } from "../ui";

export const metadata = { title: "Emails" };

export default async function Emails() {
  await requireAuth();
  const db = await getDB();
  const preview = reviewEmail("Sarah", await reviewUrl());
  const hasKey = Boolean(await getEnv("RESEND_API_KEY"));
  const log = db ? (await db.prepare("SELECT * FROM email_log ORDER BY created_at DESC LIMIT 50").all<EmailLog>()).results : [];

  return (
    <>
      <div className="main__head">
        <h1>Emails</h1>
        <span className="main__hello">The templates currently in use (preview only)</span>
      </div>
      {!hasKey && (
        <p className="flash flash--err">
          Email sending isn&apos;t switched on yet — add the <code>RESEND_API_KEY</code> secret on the Cloudflare Worker.
        </p>
      )}
      <section className="panel">
        <div className="panel__head">
          <h2>Review request — sent when you click &ldquo;Complete &amp; request review&rdquo;</h2>
        </div>
        <div className="panel__body">
          <div className="email-prev">
            <iframe title="Review request email preview" srcDoc={preview.html} sandbox="" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel__head">
          <h2>Recently sent</h2>
        </div>
        {log.length === 0 ? (
          <div className="empty-state">No emails sent yet.</div>
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
                {log.map((e) => (
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
