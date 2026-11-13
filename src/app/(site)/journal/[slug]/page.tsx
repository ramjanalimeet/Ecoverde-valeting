import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/PageTemplates";
import { ArrowRight, PhoneIcon } from "@/components/Icons";
import { FinalCta } from "@/components/Sections";
import { PHOTOS, altFor } from "@/data/images";
import { PRIMARY_PHONE, SITE, quoteHref } from "@/data/site";
import { getDB, type Post } from "@/lib/db";
import { RichText, analyse } from "@/lib/richtext";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  const db = await getDB();
  if (!db) return null;
  return db.prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'").bind(slug).first<Post>();
}

const abs = (u: string) => (u.startsWith("http") ? u : `${SITE.url}${u}`);
const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" }).format(new Date(iso));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  const image = post.cover || PHOTOS.heroBmw.src;
  return {
    // Keep titles within ~60 characters for search results
    title: { absolute: post.title.length <= 48 ? `${post.title} | Ecoverde` : post.title },
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: [SITE.founder],
      images: [{ url: image, alt: altFor(image, post.title) }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function JournalPost({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const published = post.published_at || post.created_at;
  const { faqs, headings, words } = analyse(post.body);
  const minutes = Math.max(1, Math.round(words / 220));
  const cover = post.cover;
  const toc = headings.filter((h) => !/^frequently asked|^faq/i.test(h.text));

  const db = await getDB();
  const more = db
    ? (
        await db
          .prepare("SELECT slug, title, excerpt, cover FROM posts WHERE status = 'published' AND slug != ? ORDER BY published_at DESC LIMIT 3")
          .bind(post.slug)
          .all<Pick<Post, "slug" | "title" | "excerpt" | "cover">>()
      ).results
    : [];

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt ?? undefined,
      image: cover ? [abs(cover)] : undefined,
      datePublished: published,
      dateModified: post.updated_at,
      wordCount: words,
      mainEntityOfPage: `${SITE.url}/journal/${post.slug}`,
      author: { "@type": "Person", name: SITE.founder, jobTitle: "Founder", worksFor: { "@type": "Organization", name: SITE.legalName } },
      publisher: { "@type": "Organization", name: SITE.legalName, logo: { "@type": "ImageObject", url: `${SITE.url}/images/logo.png` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE.url}/journal` },
        { "@type": "ListItem", position: 3, name: post.title, item: `${SITE.url}/journal/${post.slug}` },
      ],
    },
  ];
  if (faqs.length)
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });

  return (
    <>
      <article className="article">
        <header className="article__head">
          <div className="container">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal", href: "/journal" }, { label: post.title }]} />
            <p className="eyebrow">
              {fmt(published)} · {minutes} min read
            </p>
            <h1>{post.title}</h1>
            {post.excerpt && <p className="lead">{post.excerpt}</p>}
            <div className="article__byline">
              <Image src={PHOTOS.john.src} alt="" width={44} height={44} />
              <span>
                <strong>By {SITE.founder}</strong>
                <small>Founder, Ecoverde Valeting · 8+ years valeting in West London</small>
              </span>
            </div>
          </div>
        </header>

        {cover && (
          <div className="container">
            <figure className="article__cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt={altFor(cover, post.title)} fetchPriority="high" />
            </figure>
          </div>
        )}

        <div className="container article__layout">
          {toc.length > 2 && (
            <nav className="article__toc" aria-label="In this article">
              <p>In this article</p>
              <ol>
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className="prose article__body">
            <RichText text={post.body} />

            <aside className="article__cta">
              <div>
                <p className="article__cta-title">Want this done at your door?</p>
                <p>Send a photo of your car and John will call with a free, tailored quote — fully mobile across West London, 7 days a week.</p>
              </div>
              <div className="article__cta-actions">
                <Link className="btn btn--primary" href={quoteHref()}>
                  Get a Free Quote <ArrowRight width={16} height={16} />
                </Link>
                <a className="btn btn--outline" href={`tel:${PRIMARY_PHONE.tel}`}>
                  <PhoneIcon width={16} height={16} /> {PRIMARY_PHONE.display}
                </a>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="section section--mint">
          <div className="container">
            <p className="eyebrow">Keep Reading</p>
            <h2>
              More from the <em>Journal</em>
            </h2>
            <ul className="services-grid">
              {more.map((m) => (
                <li key={m.slug} className="scard">
                  <Link href={`/journal/${m.slug}`} className="scard__media" tabIndex={-1} aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.cover || PHOTOS.heroBmw.src} alt="" loading="lazy" className="scard__img" />
                  </Link>
                  <div className="scard__body">
                    <h3>
                      <Link href={`/journal/${m.slug}`}>{m.title}</Link>
                    </h3>
                    {m.excerpt && <p>{m.excerpt}</p>}
                    <Link className="link-arrow" href={`/journal/${m.slug}`}>
                      Read article <ArrowRight width={14} height={14} />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <FinalCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
