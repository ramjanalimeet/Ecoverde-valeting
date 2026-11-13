import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDB, type Post } from "@/lib/db";
import PostForm from "../PostForm";
import { DbMissing } from "../../ui";

export const metadata = { title: "Edit post" };

export default async function EditPost({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireAuth();
  const { id } = await params;
  const sp = await searchParams;
  const db = await getDB();
  if (!db) return <DbMissing />;
  const post = await db.prepare("SELECT * FROM posts WHERE id = ?").bind(Number(id)).first<Post>();
  if (!post) notFound();
  return (
    <>
      <Link href="/login/blog" className="back">
        ← All posts
      </Link>
      <div className="main__head">
        <h1>Edit post</h1>
      </div>
      <PostForm post={post} flash={sp} />
    </>
  );
}
