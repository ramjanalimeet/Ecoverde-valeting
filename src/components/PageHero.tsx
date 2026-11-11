import Link from "next/link";

export default function PageHero({ eyebrow, title, intro, crumb }: { eyebrow: string; title: string; intro?: string; crumb: string }) {
  return (
    <section className="page-hero">
      <div className="container container--narrow">
        <nav aria-label="Breadcrumb" className="crumbs">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-current="page">{crumb}</li>
          </ol>
        </nav>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {intro && <p className="lead">{intro}</p>}
      </div>
    </section>
  );
}
