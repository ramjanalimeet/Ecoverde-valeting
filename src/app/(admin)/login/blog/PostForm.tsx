import Link from "next/link";
import type { Post } from "@/lib/db";
import { deletePost, savePost } from "../actions";
import { ConfirmSubmit } from "../ui";

const ERR: Record<string, string> = {
  title: "Please add a title.",
  slug: "Another post already uses that URL — change the URL slug.",
};

export default function PostForm({ post, flash }: { post?: Post; flash?: { saved?: string; error?: string } }) {
  return (
    <>
      {flash?.saved && (
        <p className="flash">
          Saved.{" "}
          {post?.status === "published" && (
            <a href={`/journal/${post.slug}`} target="_blank" rel="noopener">
              View on website ↗
            </a>
          )}
        </p>
      )}
      {flash?.error && <p className="flash flash--err">{ERR[flash.error] ?? "Couldn't save."}</p>}
      <div className="detail">
        <section className="panel">
          <form id="post-form" action={savePost} className="panel__body form-a">
            {post && <input type="hidden" name="id" value={post.id} />}
            <label>
              Title
              <input name="title" defaultValue={post?.title} required maxLength={200} placeholder="e.g. How to keep your car clean through winter" />
            </label>
            <label>
              Short summary <span className="hint">(shown on the Journal list and in search results)</span>
              <textarea name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} maxLength={400} />
            </label>
            <label>
              Article
              <span className="hint">Blank line = new paragraph · &quot;## &quot; heading · &quot;- &quot; bullet · **bold** · [link](https://…)</span>
              <textarea name="body" defaultValue={post?.body} rows={18} />
            </label>
          </form>
        </section>
        <div>
          <section className="panel">
            <div className="panel__head">
              <h2>Publish</h2>
            </div>
            <div className="panel__body form-a">
              <label>
                Status
                <select name="status" form="post-form" defaultValue={post?.status ?? "draft"}>
                  <option value="draft">Draft (hidden)</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label>
                URL slug <span className="hint">(/journal/…)</span>
                <input name="slug" form="post-form" defaultValue={post?.slug} placeholder="generated from the title" maxLength={100} />
              </label>
              <label>
                Cover image <span className="hint">(optional — a /images/… path or image URL)</span>
                <input name="cover" form="post-form" defaultValue={post?.cover ?? ""} placeholder="/images/bmw-i3-snow-foam-ecoverde-van.webp" maxLength={500} />
              </label>
              <div className="form-a__row">
                <button className="abtn" type="submit" form="post-form">
                  {post ? "Save changes" : "Create post"}
                </button>
                <Link className="abtn abtn--ghost" href="/login/blog">
                  Cancel
                </Link>
              </div>
            </div>
          </section>
          {post && (
            <form action={deletePost}>
              <input type="hidden" name="id" value={post.id} />
              <ConfirmSubmit className="abtn abtn--danger" message={`Delete "${post.title}"? This can't be undone.`}>
                Delete post
              </ConfirmSubmit>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
