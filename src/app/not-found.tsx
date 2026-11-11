import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container container--narrow empty">
        <p className="eyebrow">404</p>
        <h1>We couldn&apos;t find that page</h1>
        <p className="lead">It may have moved. Head back home or request your free quote.</p>
        <div className="hero__ctas hero__ctas--center">
          <Link className="btn btn--primary" href="/">Back to home</Link>
          <Link className="btn btn--outline" href="/#quote">Get a Free Quote</Link>
        </div>
      </div>
    </section>
  );
}
