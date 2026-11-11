import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/PageTemplates";
import { FinalCta } from "@/components/Sections";
import { SITE } from "@/data/site";
import { getDB, type Post } from "@/lib/db";
import { RichText } from "@/lib/richtext";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  const db = await getDB();
  if (!db) return null;
  return db.prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'").bind(slug).first<Post>();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt ?? undefined, images: post.cover ? [{ url: post.cover }] : undefined },
  };
}

export default async function JournalPost({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" }).format(
    new Date(post.published_at || post.created_at)
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: SITE.founder },
    publisher: { "@type": "Organization", name: SITE.legalName, logo: `${SITE.url}/images/logo.png` },
  };
  return (
    <>
      <article className="article">
        <div className="container container--narrow">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal", href: "/journal" }, { label: post.title }]} />
          <p className="eyebrow">{date}</p>
          <h1>{post.title}</h1>
          {post.excerpt && <p className="lead">{post.excerpt}</p>}
          {post.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="article__cover" src={post.cover} alt="" />
          )}
          <div className="prose article__body">
            <RichText text={post.body} />
          </div>
          <p>
            <Link href="/journal">← More from the Journal</Link>
          </p>
        </div>
      </article>
      <FinalCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
