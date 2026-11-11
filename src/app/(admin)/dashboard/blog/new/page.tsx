import Link from "next/link";
import PostForm from "../PostForm";

export const metadata = { title: "New post" };

export default async function NewPost({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <>
      <Link href="/dashboard/blog" className="back">
        ← All posts
      </Link>
      <div className="main__head">
        <h1>New post</h1>
      </div>
      <PostForm flash={sp} />
    </>
  );
}
