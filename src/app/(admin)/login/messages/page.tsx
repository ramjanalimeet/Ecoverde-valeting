import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { getDB, type Booking } from "@/lib/db";
import { markMessageRead } from "../actions";
import { DbMissing, fmtDateTime } from "../ui";

export const metadata = { title: "Messages" };

/** Customer messages — the "Anything else?" notes left on quote requests. */
export default async function Messages({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAuth();
  const sp = await searchParams;
  const db = await getDB();
  if (!db) return <DbMissing />;
  const unreadOnly = sp.filter === "unread";
  const rows = await db
    .prepare(
      `SELECT * FROM bookings WHERE message IS NOT NULL AND message != '' ${unreadOnly ? "AND message_read = 0" : ""}
       ORDER BY created_at DESC LIMIT 100`
    )
    .all<Booking>();

  return (
    <>
      <div className="main__head">
        <h1>Messages</h1>
        <span className="main__hello">Notes customers added to their quote request</span>
      </div>
      <div className="toolbar">
        <nav className="tabs">
          <Link href="/login/messages" aria-current={!unreadOnly ? "true" : undefined}>
            All
          </Link>
          <Link href="/login/messages?filter=unread" aria-current={unreadOnly ? "true" : undefined}>
            Unread
          </Link>
        </nav>
      </div>
      <section className="panel">
        {rows.results.length === 0 ? (
          <div className="empty-state">{unreadOnly ? "You're all caught up." : "No messages yet."}</div>
        ) : (
          <ul className="rows">
            {rows.results.map((b) => (
              <li key={b.id} className="panel__body">
                <div className="form-a__row" style={{ justifyContent: "space-between" }}>
                  <Link href={`/login/bookings/${b.id}`} className={`row__main${b.message_read ? "" : " is-unread"}`}>
                    <strong>{b.name}</strong>
                    {b.car} · {b.service_label}
                  </Link>
                  <span className="row__date">{fmtDateTime(b.created_at)}</span>
                </div>
                <p className="msg" style={{ margin: "8px 0" }}>
                  {b.message}
                </p>
                <div className="form-a__row">
                  <a className="abtn abtn--ghost" href={`tel:${b.phone}`}>
                    Call {b.phone}
                  </a>
                  <form action={markMessageRead}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="read" value={b.message_read ? "0" : "1"} />
                    <button className="abtn abtn--ghost" type="submit">
                      Mark as {b.message_read ? "unread" : "read"}
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
