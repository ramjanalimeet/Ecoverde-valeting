import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ALL_AREAS,
  AREAS,
  areaHref,
  BRANDS,
  PRIMARY_AREAS,
  PRIMARY_PHONE,
  REVIEWS,
  REVIEW_CARDS,
  SERVICES,
  SITE,
  STATS,
  STEPS,
  WHY,
  quoteHref,
  whatsappLink,
} from "@/data/site";
import Trustindex from "./Trustindex";
import { ArrowRight, CheckIcon, FeatureIcon, GoogleG, InfoIcon, PhoneIcon, PlusIcon, ShieldIcon, StarIcon, WhatsAppIcon } from "./Icons";

export function Stars({ size = 14, className = "stars" }: { size?: number; className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} width={size} height={size} />
      ))}
    </span>
  );
}

export function Eyebrow({ children, center = false, light = false }: { children: ReactNode; center?: boolean; light?: boolean }) {
  return <p className={`eyebrow${center ? " eyebrow--center" : ""}${light ? " eyebrow--light" : ""}`}>{children}</p>;
}

function Leaves({ className }: { className: string }) {
  return (
    <span className={`leaves ${className}`} aria-hidden="true">
      <svg viewBox="0 0 32 32">
        <path d="M27 4C14 4 5 10 5 21c0 3 1 5 2 7 3-7 8-12 14-15-5 4-9 9-11 16 2 1 4 1 6 1 10 0 12-12 11-26z" />
      </svg>
      <svg viewBox="0 0 32 32">
        <path d="M27 4C14 4 5 10 5 21c0 3 1 5 2 7 3-7 8-12 14-15-5 4-9 9-11 16 2 1 4 1 6 1 10 0 12-12 11-26z" />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ Hero */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__photo">
        <Image
          src="/images/hero.webp"
          alt="Freshly valeted dark green BMW on a tree-lined white stucco West London street"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="container hero__inner">
        <div className="hero__card">
          <Eyebrow>West London · Fully Mobile · Eco-Friendly</Eyebrow>
          <h1 id="hero-title">
            Eco-Friendly <em>Mobile Car Valeting &amp; Detailing</em> for West London Drivers
          </h1>
          <p className="hero__lead">
            Ecoverde Valeting brings premium car care to your door: biodegradable products, an electric van, steam
            cleaning and a meticulous showroom finish. We come to you across West London, 7 days a week.
          </p>
          <div className="hero__ctas">
            <Link className="btn btn--primary" href={quoteHref()}>
              Get a Free Quote <ArrowRight width={16} height={16} />
            </Link>
            <a className="btn btn--glass" href={`tel:${PRIMARY_PHONE.tel}`}>
              <PhoneIcon width={16} height={16} /> Call Now
            </a>
            <a className="btn btn--glass" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon width={16} height={16} /> WhatsApp Us
            </a>
          </div>
          <ul className="hero__tiles">
            <li>
              <Stars size={11} />
              <span>
                <strong>
                  {REVIEWS.rating} from {REVIEWS.total} reviews
                </strong>
                <small>Google · Checkatrade · Bark</small>
              </span>
            </li>
            <li>
              <span>
                <strong>8+ years&apos; experience</strong>
                <small>Fully insured &amp; verified</small>
              </span>
            </li>
            <li className="hero__tile-logo">
              <Image src="/images/badge-wlcc.png" alt="Member of West London Chambers of Commerce" width={152} height={36} />
            </li>
            <li className="hero__tile-logo">
              <Image src="/images/badge-checkatrade.png" alt="Checkatrade approved member" width={120} height={36} />
            </li>
          </ul>
        </div>
      </div>
      <a className="hero__scroll" href="#reviews">
        Scroll
        <span aria-hidden="true" />
      </a>
    </section>
  );
}

/* --------------------------------------------------------------- Reviews */
function ReviewCard({ r }: { r: (typeof REVIEW_CARDS)[number] }) {
  return (
    <li className="rcard">
      <div className="rcard__head">
        <span className="rcard__avatar" aria-hidden="true">
          {r.name[0]}
        </span>
        <span className="rcard__who">
          <strong>{r.name}</strong>
          <small>{r.date} · Google</small>
        </span>
        <GoogleG width={18} height={18} />
      </div>
      <Stars size={11} />
      <p>{r.text}</p>
    </li>
  );
}

export function Reviews() {
  const rowA = REVIEW_CARDS.slice(0, 5);
  const rowB = REVIEW_CARDS.slice(5);
  return (
    <section id="reviews" className="reviews" aria-labelledby="reviews-title">
      <div className="container reviews__bar">
        <div className="reviews__score">
          <GoogleG width={34} height={34} />
          <span className="reviews__num">{REVIEWS.rating}</span>
          <span>
            <Stars size={13} />
            <small>
              {REVIEWS.total} verified reviews ·{" "}
              {SITE.reviewsUrl ? (
                <a href={SITE.reviewsUrl} target="_blank" rel="noopener noreferrer">
                  read them all
                </a>
              ) : (
                "read them all below"
              )}
            </small>
          </span>
        </div>
        <ul className="reviews__chips">
          {REVIEWS.breakdown.map((r) => (
            <li key={r.source}>
              <strong>{r.count}</strong> {r.source}
            </li>
          ))}
        </ul>
      </div>

      <div className="marquee" aria-label="Recent Google reviews">
        {[rowA, rowB].map((row, i) => (
          <div key={i} className={`marquee__row${i ? " marquee__row--rev" : ""}`}>
            <ul className="marquee__track">
              {row.map((r) => (
                <ReviewCard key={r.name} r={r} />
              ))}
            </ul>
            <ul className="marquee__track" aria-hidden="true">
              {row.map((r) => (
                <ReviewCard key={r.name} r={r} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container">
        <Eyebrow center>Independently Verified</Eyebrow>
        <h2 id="reviews-title" className="center">
          All <em>{REVIEWS.total}</em> reviews, in one place
        </h2>

        {SITE.trustindexId ? (
          <Trustindex id={SITE.trustindexId} />
        ) : (
          <div className="ti-static">
            <strong>EXCELLENT</strong>
            <Stars size={26} className="stars stars--gold" />
            <span>
              Based on <b>{REVIEWS.total} reviews</b>
            </span>
            <span className="ti-static__brand">
              <CheckIcon width={16} height={16} /> Trustindex
            </span>
          </div>
        )}

        <div className="verified">
          <ShieldIcon width={30} height={30} />
          <p>
            <strong>
              {REVIEWS.rating} from {REVIEWS.total} verified reviews
            </strong>{" "}
            on Trustindex — live across Google, Checkatrade, Bark, Facebook &amp; Yell.
          </p>
          {SITE.reviewsUrl && (
            <a href={SITE.reviewsUrl} target="_blank" rel="noopener noreferrer">
              Read all our reviews →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Brands */
export function BrandStrip() {
  return (
    <section className="brands" aria-labelledby="brands-title">
      <div className="container">
        <p id="brands-title" className="brands__label">
          <span>Proud to work with premium brands</span>
        </p>
        <ul className="brands__list">
          {BRANDS.map((b) => (
            <li key={b.name}>
              <Image src={b.logo} alt={b.name} width={b.w} height={b.h} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Services */
export function Services() {
  return (
    <section id="services" className="section section--mint services" aria-labelledby="services-title">
      <Leaves className="leaves--left" />
      <div className="container">
        <div className="head-row">
          <div>
            <Eyebrow>Our Services</Eyebrow>
            <h2 id="services-title">
              Eco-friendly car valeting &amp; <em>detailing</em> services
            </h2>
            <p className="lead">
              From a mobile car wash and full valet to ceramic coating, paint correction and interior deep cleans — every
              service uses eco-friendly products and the latest equipment. Prices vary with size and condition, so every
              quote is free and tailored.
            </p>
          </div>
          <Link className="btn btn--dark" href={quoteHref()}>
            Get a Tailored Quote
          </Link>
        </div>
        <ul className="services-grid">
          {SERVICES.map((s) => (
            <li key={s.title} className="scard">
              <div className="scard__media">
                <Image src={s.image} alt={s.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px" />
                <span className="scard__price">{s.price}</span>
                <span className="scard__cat">{s.category}</span>
              </div>
              <div className="scard__body">
                <h3>
                  <Link href={`/services/${s.page}`}>{s.title}</Link>
                </h3>
                <p>{s.description}</p>
                <Link className="link-arrow" href={quoteHref(s.formValue)} aria-label={`Book ${s.title}`}>
                  Book this service <ArrowRight width={14} height={14} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- Why */
export function WhyChoose() {
  return (
    <section id="why" className="why" aria-labelledby="why-title">
      <div className="why__bg" aria-hidden="true">
        <Image src="/images/why-bg.webp" alt="" fill sizes="50vw" />
      </div>
      <div className="container why__inner">
        <Eyebrow light>Why West London Drivers Choose Ecoverde</Eyebrow>
        <h2 id="why-title">
          Genuinely green — <em>not</em> just a label
        </h2>
        <p className="lead">
          Eco isn&apos;t a marketing word for us — it&apos;s how every job is done. Better for your car&apos;s finish,
          better for your family&apos;s health, and better for the planet.
        </p>
        <ul className="why__features">
          {WHY.map((f) => (
            <li key={f.title}>
              <span className="why__icon">
                <FeatureIcon name={f.icon} width={18} height={18} />
              </span>
              <div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- How it works */
export function HowItWorks() {
  return (
    <section id="how" className="section section--mint" aria-labelledby="how-title">
      <div className="container">
        <div className="how">
          <Eyebrow center light>
            How It Works
          </Eyebrow>
          <h2 id="how-title" className="center">
            Simple to book. <em>No</em> rigid calendars.
          </h2>
          <p className="lead center">
            Because every car is different, we quote on the job — not a fixed price list. You request a time that suits,
            we confirm and assess, and you only pay once you&apos;re happy with the quote.
          </p>
          <ol className="steps">
            {STEPS.map((s) => (
              <li key={s.n} className="step">
                <span className="step__n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="how__note">
            <InfoIcon width={16} height={16} /> We only quote once we&apos;ve seen the car, so you always know exactly what
            you&apos;re paying for.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Stats */
export function Stats() {
  const split = (v: string) => {
    const m = v.match(/^([\d.]+)(.*)$/);
    return m ? [m[1], m[2]] : [v, ""];
  };
  return (
    <section className="stats" aria-labelledby="stats-title">
      <div className="stats__bg" aria-hidden="true">
        <Image src="/images/stats-bg.webp" alt="" fill sizes="100vw" />
      </div>
      <div className="container">
        <Eyebrow center light>
          Trusted Across West London
        </Eyebrow>
        <h2 id="stats-title" className="center">
          The numbers behind the <em>five stars</em>
        </h2>
        <ul className="stats__grid">
          {STATS.map((s) => {
            const [n, suffix] = split(s.value);
            return (
              <li key={s.label}>
                <strong>
                  {n}
                  <span>{suffix}</span>
                </strong>
                <small>{s.label}</small>
              </li>
            );
          })}
        </ul>
        <ul className="stats__chips">
          {REVIEWS.breakdown.map((r) => (
            <li key={r.source}>
              {r.count} {r.source}
              {r.source === "Google" ? " reviews" : ""}
            </li>
          ))}
          <li>Fully insured · public liability</li>
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Founder */
export function Founder() {
  return (
    <section id="about" className="founder" aria-labelledby="about-title">
      <Leaves className="leaves--right" />
      <div className="container founder__grid">
        <div className="founder__photo">
          <Image
            src="/images/founder.webp"
            alt="John Muriel, founder of Ecoverde, standing beside the Ecoverde electric van"
            fill
            sizes="(max-width: 900px) 100vw, 420px"
          />
        </div>
        <div>
          <Eyebrow>Meet The Founder</Eyebrow>
          <h2 id="about-title">
            Hi, I&apos;m John — a <em>perfectionist</em> with a passion for cars
          </h2>
          <p>
            I started Ecoverde with one belief: your car should look incredible without costing the earth — literally. For
            over 8 years I&apos;ve brought high-end, fully-mobile car care to driveways and offices across West London,
            using eco-friendly products and the latest equipment on everything from daily drivers to supercars and
            classics.
          </p>
          <p>
            I treat every car like my own. That&apos;s why I never quote without seeing the job, always work around your
            budget, and don&apos;t leave until it&apos;s spotless.
          </p>
          <p className="signature">— {SITE.founder}, Founder</p>
          <div className="guarantee">
            <span className="guarantee__icon">
              <ShieldIcon width={18} height={18} />
            </span>
            <div>
              <h3>Satisfaction guaranteed</h3>
              <p>If you&apos;re not completely happy, we make it right. Simple as that.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Areas */
export function ServiceAreas() {
  const chips = [...PRIMARY_AREAS.map((a) => `${a.name} ${a.postcode}`), ...AREAS];
  const hrefFor = (label: string) => {
    const name = label.replace(/\s+[A-Z]{1,2}\d+[A-Z]?$/, "").replace(/ & Green$/, "");
    const hit = ALL_AREAS.find((a) => a.name === name);
    return hit ? areaHref(hit.slug) : "/areas";
  };
  return (
    <section id="areas" className="section section--soft" aria-labelledby="areas-title">
      <div className="container">
        <div className="areas">
          <div>
            <Eyebrow>Service Areas</Eyebrow>
            <h2 id="areas-title">
              Mobile car valeting across <em>West London</em> &amp; beyond
            </h2>
            <p>
              Ecoverde Valeting is a fully mobile, eco-friendly car valeting and detailing service for car owners across
              West London, including busy professionals, families, and luxury and classic car enthusiasts. We come to your
              home or workplace from our bases in Ladbroke Grove (W10) and Brentford (TW8). Not sure if we reach you?{" "}
              <a href={whatsappLink("Hi Ecoverde, do you cover my area? My postcode is: ")} target="_blank" rel="noopener noreferrer">
                Just ask
              </a>
              .
            </p>
          </div>
          <ul className="chips chips--links" aria-label="Areas we cover">
            {chips.map((a) => (
              <li key={a}>
                <Link href={hrefFor(a)}>{a}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- Gift voucher */
export function GiftVouchers() {
  const points = [
    { t: "Sent by email.", d: "Personalised with your message and delivered digitally, so there is nothing to post and nothing to arrive late." },
    { t: "Any service, any area.", d: "Redeemable against any valet or detailing service, anywhere we cover across West London." },
    { t: "Open value from £25.", d: "Put any amount on it, or choose a specific service if you already know what they want." },
  ];
  return (
    <section id="gift-vouchers" className="gift" aria-labelledby="gift-title">
      <div className="container">
        <h2 id="gift-title">Car valeting gift vouchers</h2>
        <p className="lead">
          A gift for someone who loves their car, or for anyone who would rather not spend a Saturday cleaning one. Vouchers
          are personalised, sent by email and redeemable anywhere across our West London coverage. Open value cards start at
          £25.
        </p>
        <ul className="ticks">
          {points.map((p) => (
            <li key={p.t}>
              <CheckIcon width={12} height={12} />
              <span>
                <strong>{p.t}</strong> {p.d}
              </span>
            </li>
          ))}
        </ul>
        <Link className="btn btn--primary" href="/services/gift-vouchers">
          Browse gift vouchers <ArrowRight width={16} height={16} />
        </Link>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Used car */
export function UsedCar() {
  return (
    <section className="section used" aria-labelledby="used-title">
      <div className="container">
        <h2 id="used-title">Just bought a used car?</h2>
        <p className="lead">
          Our Used Car Fresh Start Valet deep cleans and steam sanitises the whole interior, then treats smoke, pet, damp and
          food smells at the source rather than covering them up. Fully mobile across West London, from £189.
        </p>
        <div className="used__qa">
          <details className="acc">
            <summary>
              Why valet a used car after buying it? <PlusIcon width={16} height={16} />
            </summary>
            <p>
              You don&apos;t know how the last owner used it. Seats, carpets, vents and the steering wheel hold dirt, bacteria
              and old smells, so a deep clean and steam sanitisation gives you a hygienic start.
            </p>
          </details>
          <details className="acc">
            <summary>
              How long does it take? <PlusIcon width={16} height={16} />
            </summary>
            <p>Usually 2 to 4 hours, depending on the size of the car and its condition.</p>
          </details>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Final CTA */
export function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="final-title">
      <Image src="/images/cta-bg.webp" alt="" fill sizes="100vw" className="final-cta__bg" />
      <div className="container final-cta__inner">
        <Eyebrow center light>
          Ready When You Are
        </Eyebrow>
        <h2 id="final-title">Get your free, no-obligation quote</h2>
        <p>
          Send a quick photo or video of your car and we&apos;ll come back with a tailored quote. Fully mobile, fully eco,
          across West London — 7 days a week.
        </p>
        <div className="final-cta__actions">
          <Link className="btn btn--white" href={quoteHref()}>
            Get a Free Quote <ArrowRight width={16} height={16} />
          </Link>
          <a className="btn btn--ghost" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon width={16} height={16} /> Message on WhatsApp
          </a>
          <a className="btn btn--ghost" href={`tel:${PRIMARY_PHONE.tel}`}>
            <PhoneIcon width={16} height={16} /> Call {PRIMARY_PHONE.display}
          </a>
        </div>
      </div>
    </section>
  );
}
