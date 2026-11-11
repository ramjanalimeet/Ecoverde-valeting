import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Journal",
  description: "Car care tips, eco-valeting advice and recent work from Ecoverde Valeting in West London.",
  alternates: { canonical: "/journal" },
};

// Add articles here (or wire up a CMS) — the empty state shows until then.
const POSTS: { slug: string; title: string; excerpt: string; date: string }[] = [];

export default function JournalPage() {
  return (
    <>
      <PageHero
        crumb="Journal"
        eyebrow="Journal"
        title="Car care notes from the driveway"
        intro="Eco-valeting advice, detailing tips and recent jobs from across West London."
      />
      <section className="section">
        <div className="container container--narrow">
          {POSTS.length === 0 ? (
            <div className="empty card">
              <h2>New articles are on the way</h2>
              <p>
                In the meantime, our <Link href="/#faq">FAQ</Link> answers the most common questions — or ask John directly.
              </p>
              <div className="hero__ctas hero__ctas--center">
                <Link className="btn btn--primary" href="/#quote">Get a Free Quote</Link>
                <a className="btn btn--whatsapp" href={whatsappLink("Hi John, I have a question about car care: ")} target="_blank" rel="noopener noreferrer">
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <ul className="posts">
              {POSTS.map((p) => (
                <li key={p.slug} className="card">
                  <time dateTime={p.date}>{p.date}</time>
                  <h2>{p.title}</h2>
                  <p>{p.excerpt}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
