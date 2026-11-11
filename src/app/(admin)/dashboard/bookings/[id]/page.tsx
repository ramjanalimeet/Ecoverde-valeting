import Link from "next/link";
import { notFound } from "next/navigation";
import { getDB, STATUSES, statusLabel, type Booking, type EmailLog } from "@/lib/db";
import { deleteBooking, markMessageRead, updateBooking } from "../../actions";
import { ConfirmSubmit, DbMissing, StatusPill, fmtDateTime } from "../../ui";

export const metadata = { title: "Request" };

const waNumber = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("44") ? d : d.startsWith("0") ? `44${d.slice(1)}` : d;
};

export default async function BookingDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const db = await getDB();
  if (!db) return <DbMissing />;
  const b = await db.prepare("SELECT * FROM bookings WHERE id = ?").bind(Number(id)).first<Booking>();
  if (!b) notFound();
  const emails = await db.prepare("SELECT * FROM email_log WHERE booking_id = ? ORDER BY created_at DESC").bind(b.id).all<EmailLog>();

  // Opening a request marks its message as read.
  if (b.message && !b.message_read) await db.prepare("UPDATE bookings SET message_read = 1 WHERE id = ?").bind(b.id).run();

  const first = b.name.split(/\s+/)[0];
  const wa = `https://wa.me/${waNumber(b.phone)}?text=${encodeURIComponent(
    `Hi ${first}, it's John from Ecoverde Valeting about your ${b.service_label.toLowerCase()} request for your ${b.car}.`
  )}`;

  return (
    <>
      <Link href="/dashboard/bookings" className="back">
        ← All bookings
      </Link>
      <div className="main__head">
        <h1>{b.name}</h1>
        <StatusPill status={b.status} label={statusLabel(b.status)} />
      </div>
      {sp.saved && <p className="flash">Saved.</p>}
      {sp.error && <p className="flash flash--err">Couldn&apos;t save — please try again.</p>}

      <div className="detail">
        <section className="panel">
          <div className="panel__head">
            <h2>Request details</h2>
            <span className="main__hello">#{b.id} · {fmtDateTime(b.created_at)}</span>
          </div>
          <div className="panel__body">
            <dl className="kv">
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${b.phone}`}>{b.phone}</a>
              </dd>
              <dt>Email</dt>
              <dd>{b.email ? <a href={`mailto:${b.email}`}>{b.email}</a> : "—"}</dd>
              <dt>Address / postcode</dt>
              <dd>
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(b.address)}`} target="_blank" rel="noopener noreferrer">
                  {b.address}
                </a>
              </dd>
              <dt>Car</dt>
              <dd>{b.car}</dd>
              <dt>Service</dt>
              <dd>{b.service_label}</dd>
              <dt>Pets</dt>
              <dd>{b.pets || "—"}</dd>
              <dt>Photos</dt>
              <dd>{b.photos_count ? `${b.photos_count} — attached to the notification email` : "None"}</dd>
            </dl>
            {b.message && (
              <>
                <p className="main__hello" style={{ margin: "14px 0 6px" }}>
                  Message
                </p>
                <p className="msg">{b.message}</p>
              </>
            )}
            <div className="quick">
              <a className="abtn" href={`tel:${b.phone}`}>
                Call {first}
              </a>
              <a className="abtn abtn--wa" href={wa} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              {b.email && (
                <a className="abtn abtn--ghost" href={`mailto:${b.email}?subject=${encodeURIComponent("Your Ecoverde Valeting quote")}`}>
                  Email
                </a>
              )}
            </div>
          </div>
        </section>

        <div>
          <section className="panel">
            <div className="panel__head">
              <h2>Status &amp; notes</h2>
            </div>
            <form action={updateBooking} className="panel__body form-a">
              <input type="hidden" name="id" value={b.id} />
              <label>
                Status
                <select name="status" defaultValue={b.status}>
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Private notes <span className="hint">(quote given, booking date, anything to remember)</span>
                <textarea name="notes" defaultValue={b.notes ?? ""} rows={5} />
              </label>
              <div className="form-a__row">
                <button className="abtn" type="submit">
                  Save
                </button>
                <span className="main__hello">Last updated {fmtDateTime(b.updated_at)}</span>
              </div>
            </form>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2>Notification email</h2>
            </div>
            <div className="panel__body">
              {emails.results.length ? (
                emails.results.map((e) => (
                  <p key={e.id} className="main__hello">
                    <StatusPill status={e.status} /> {fmtDateTime(e.created_at)} → {e.to_addr}
                    {e.error ? ` — ${e.error}` : ""}
                  </p>
                ))
              ) : (
                <p className="main__hello">No email recorded.</p>
              )}
            </div>
          </section>

          <div className="form-a__row">
            {b.message && (
              <form action={markMessageRead}>
                <input type="hidden" name="id" value={b.id} />
                <input type="hidden" name="read" value="0" />
                <button className="abtn abtn--ghost" type="submit">
                  Mark message unread
                </button>
              </form>
            )}
            <form action={deleteBooking}>
              <input type="hidden" name="id" value={b.id} />
              <ConfirmSubmit className="abtn abtn--danger" message={`Delete the request from ${b.name}? This can't be undone.`}>
                Delete request
              </ConfirmSubmit>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
