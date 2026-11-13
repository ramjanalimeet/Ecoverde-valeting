import type { Metadata } from "next";
import Link from "next/link";
import { DarkHero } from "@/components/PageTemplates";
import { ArrowRight } from "@/components/Icons";
import { whatsappLink } from "@/data/site";
import { getDB, type Post } from "@/lib/db";

export const metadata: Metadata = {
  title: "Journal",
  description: "Car care tips, eco-valeting advice and recent work from Ecoverde Valeting in West London.",
  alternates: { canonical: "/journal" },
};

// Posts are managed in the dashboard (D1), so render on request.
export const dynamic = "force-dynamic";

const fmt = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" }).format(new Date(iso));

export default async function JournalPage() {
  const db = await getDB();
  const posts = db
    ? (await db.prepare("SELECT * FROM posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 60").all<Post>()).results
    : [];

  return (
    <>
      <DarkHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Journal" }]}
        eyebrow="Journal"
        title={["Car care notes from", "the driveway"]}
        intro="Eco-valeting advice, detailing tips and recent jobs from across West London."
        image="/images/bmw-i3-snow-foam-ecoverde-van.webp"
      />
      <section className="section section--mint">
        <div className="container">
          {posts.length === 0 ? (
            <div className="empty card">
              <h2>New articles are on the way</h2>
              <p>
                In the meantime, our <Link href="/#faq">FAQ</Link> answers the most common questions — or ask John directly.
              </p>
              <div className="hero__ctas hero__ctas--center">
                <Link className="btn btn--primary" href="/#quote">
                  Get a Free Quote
                </Link>
                <a className="btn btn--whatsapp" href={whatsappLink("Hi John, I have a question about car care: ")} target="_blank" rel="noopener noreferrer">
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <ul className="services-grid">
              {posts.map((p) => (
                <li key={p.id} className="scard">
                  <Link href={`/journal/${p.slug}`} className="scard__media" tabIndex={-1} aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover || "/images/bmw-i3-snow-foam-ecoverde-van.webp"} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  </Link>
                  <div className="scard__body">
                    <p className="journal__date">{fmt(p.published_at || p.created_at)}</p>
                    <h3>
                      <Link href={`/journal/${p.slug}`}>{p.title}</Link>
                    </h3>
                    {p.excerpt && <p>{p.excerpt}</p>}
                    <Link className="link-arrow" href={`/journal/${p.slug}`}>
                      Read article <ArrowRight width={14} height={14} />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
