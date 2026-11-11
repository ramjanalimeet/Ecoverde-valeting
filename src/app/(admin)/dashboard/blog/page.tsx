import Link from "next/link";
import { getDB, type Post } from "@/lib/db";
import { DbMissing, StatusPill, fmtDate } from "../ui";

export const metadata = { title: "Blog" };

export default async function Blog({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const db = await getDB();
  if (!db) return <DbMissing />;
  const posts = await db.prepare("SELECT * FROM posts ORDER BY COALESCE(published_at, updated_at) DESC").all<Post>();

  return (
    <>
      <div className="main__head">
        <h1>Blog</h1>
        <Link className="abtn" href="/dashboard/blog/new">
          + New post
        </Link>
      </div>
      {sp.deleted && <p className="flash">Post deleted.</p>}
      <section className="panel">
        {posts.results.length === 0 ? (
          <div className="empty-state">
            No posts yet. <Link href="/dashboard/blog/new">Write your first post</Link> — it&apos;ll appear on the website&apos;s Journal
            once published.
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {posts.results.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/dashboard/blog/${p.id}`}>{p.title}</Link>
                      <div className="main__hello">/journal/{p.slug}</div>
                    </td>
                    <td>
                      <StatusPill status={p.status} />
                    </td>
                    <td>{fmtDate(p.updated_at)}</td>
                    <td>
                      {p.status === "published" && (
                        <a href={`/journal/${p.slug}`} target="_blank" rel="noopener">
                          View ↗
                        </a>
                      )}
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
