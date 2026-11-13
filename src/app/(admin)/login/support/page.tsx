import { requireAuth } from "@/lib/auth";
export const metadata = { title: "Support" };

export default async function Support() {
  await requireAuth();
  return (
    <>
      <div className="main__head">
        <h1>Support</h1>
      </div>
      <div className="grid2">
        <section className="panel">
          <div className="panel__head">
            <h2>Using the dashboard</h2>
          </div>
          <div className="panel__body help">
            <h3>New requests</h3>
            <p>
              Every quote form submission lands in <strong>Bookings</strong> with status <em>New</em>, and an email is sent to
              your notification address. Open a request to call or WhatsApp the customer in one tap.
            </p>
            <h3>Keeping track</h3>
            <ul>
              <li>Move each request through New → Contacted → Quoted → Booked → Completed.</li>
              <li>Use private notes for prices quoted, dates and anything to remember.</li>
              <li>Customer notes from the form appear under <strong>Messages</strong>.</li>
            </ul>
            <h3>Photos</h3>
            <p>Photos customers upload are attached to the notification email for that request.</p>
            <h3>Blog</h3>
            <p>
              Write posts under <strong>Blog</strong>. Leave a post as a draft until it&apos;s ready, then set it to Published —
              it appears on the website&apos;s Journal straight away. Separate paragraphs with a blank line; start a line with{" "}
              <code>## </code> for a heading or <code>- </code> for a bullet.
            </p>
          </div>
        </section>
        <section className="panel">
          <div className="panel__head">
            <h2>Something not working?</h2>
          </div>
          <div className="panel__body help">
            <h3>No notification emails</h3>
            <p>
              Check <strong>Emails</strong>. &ldquo;Skipped&rdquo; means the Resend key isn&apos;t set up; &ldquo;Failed&rdquo; shows the
              reason. Requests are always saved here either way.
            </p>
            <h3>Forgotten password</h3>
            <p>
              If you changed the password in Settings and forgot it, delete the <code>password_hash</code> row from the{" "}
              <code>settings</code> table in Cloudflare D1 (ecoverde-db) — the original password secret then works again.
            </p>
            <h3>Hosting</h3>
            <p>
              The site runs on Cloudflare Workers (worker <code>ecoverde-valeting</code>) with a D1 database{" "}
              <code>ecoverde-db</code>. Logs are under Workers &amp; Pages → ecoverde-valeting → Observability.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
