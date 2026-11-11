import Image from "next/image";
import Link from "next/link";
import {
  AREAS,
  BRANDS,
  MORE_AREAS,
  PRIMARY_AREAS,
  PRIMARY_PHONE,
  REVIEWS,
  SERVICES,
  SITE,
  STATS,
  STEPS,
  WHY,
  quoteHref,
  whatsappLink,
} from "@/data/site";
import { ArrowRight, CheckIcon, FeatureIcon, PhoneIcon, PinIcon, ShieldIcon, StarIcon, WhatsAppIcon } from "./Icons";

function Stars({ size = 18 }: { size?: number }) {
  return (
    <span className="stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} width={size} height={size} />
      ))}
    </span>
  );
}

function SectionHead({ eyebrow, title, intro, center = false, id }: { eyebrow: string; title: string; intro?: string; center?: boolean; id?: string }) {
  return (
    <div className={`section-head${center ? " section-head--center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {intro && <p className="lead">{intro}</p>}
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--pill">West London · Fully Mobile · Eco-Friendly</p>
          <h1 id="hero-title">Eco-Friendly Mobile Car Valeting &amp; Detailing for West London Drivers</h1>
          <p className="hero__lead">
            Ecoverde Valeting brings premium car care to your door: biodegradable products, an electric van, steam
            cleaning and a meticulous showroom finish. We come to you across West London, 7 days a week.
          </p>
          <div className="hero__ctas">
            <Link className="btn btn--primary btn--lg" href={quoteHref()}>
              Get a Free Quote <ArrowRight width={18} height={18} />
            </Link>
            <a className="btn btn--outline btn--lg" href={`tel:${PRIMARY_PHONE.tel}`}>
              <PhoneIcon width={18} height={18} /> Call Now
            </a>
            <a className="btn btn--whatsapp btn--lg" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon width={18} height={18} /> WhatsApp Us
            </a>
          </div>
          <p className="hero__rating">
            <Stars />
            <span>
              <strong>{REVIEWS.rating}</strong> from {REVIEWS.total} reviews — Google · Checkatrade · Bark
            </span>
          </p>
          <ul className="hero__trust">
            <li>
              <CheckIcon width={18} height={18} /> 8+ years&apos; experience
            </li>
            <li>
              <ShieldIcon width={18} height={18} /> Fully insured &amp; verified
            </li>
          </ul>
        </div>
        <div className="hero__media">
          <Image
            src="/images/hero-foam-wash.webp"
            alt="Valeter hand-washing a black car with eco-friendly snow foam"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          <div className="hero__badge">
            <FeatureIcon name="leaf" width={22} height={22} />
            <span>
              <strong>100% eco</strong>
              <small>Biodegradable · low-water</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReviewSummary() {
  return (
    <section id="reviews" className="reviews" aria-labelledby="reviews-title">
      <div className="container reviews__card">
        <div className="reviews__head">
          <p className="badge">
            <ShieldIcon width={16} height={16} /> Independently Verified
          </p>
          <h2 id="reviews-title">All {REVIEWS.total} reviews, in one place</h2>
          <p className="reviews__score">
            <Stars size={22} /> <strong>{REVIEWS.rating}</strong> average rating
          </p>
        </div>
        <ul className="reviews__list">
          {REVIEWS.breakdown.map((r) => (
            <li key={r.source}>
              <strong>{r.count}</strong>
              <span>{r.source}</span>
            </li>
          ))}
        </ul>
        {SITE.reviewsUrl && (
          <a className="btn btn--outline" href={SITE.reviewsUrl} target="_blank" rel="noopener noreferrer">
            Read all our reviews on Trustindex <ArrowRight width={18} height={18} />
          </a>
        )}
      </div>
    </section>
  );
}

export function BrandStrip() {
  return (
    <section className="brands" aria-label="Professional product brands we use">
      <div className="container">
        <p className="brands__label">Trusted professional products</p>
        <ul className="brands__list">
          {BRANDS.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head-row">
          <SectionHead
            id="services-title"
            eyebrow="Our Services"
            title="Eco-friendly car valeting & detailing services"
            intro="From a mobile car wash and full valet to ceramic coating, paint correction and interior deep cleans — every service uses eco-friendly products and the latest equipment. Prices vary with size and condition, so every quote is free and tailored."
          />
          <Link className="btn btn--primary" href={quoteHref()}>
            Get a Tailored Quote
          </Link>
        </div>
        <ul className="services-grid">
          {SERVICES.map((s) => (
            <li key={s.title} className="service-card">
              <div className="service-card__media">
                <Image src={s.image} alt={s.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <span className="service-card__price">{s.price}</span>
              </div>
              <div className="service-card__body">
                <p className="service-card__cat">{s.category}</p>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <Link className="link-arrow" href={quoteHref(s.formValue)} aria-label={`Book ${s.title}`}>
                  Book this service <ArrowRight width={16} height={16} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function WhyChoose() {
  return (
    <section id="why" className="section section--muted" aria-labelledby="why-title">
      <div className="container split">
        <div>
          <SectionHead
            id="why-title"
            eyebrow="Why West London Drivers Choose Ecoverde"
            title="Genuinely green — not just a label"
            intro="Eco isn't a marketing word for us — it's how every job is done. Better for your car's finish, better for your family's health, and better for the planet."
          />
          <ul className="features">
            {WHY.map((f) => (
              <li key={f.title} className="feature">
                <span className="feature__icon">
                  <FeatureIcon name={f.icon} width={22} height={22} />
                </span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="split__media">
          <Image
            src="/images/eco-electric.webp"
            alt="Electric vehicle charging — Ecoverde runs a fully electric, generator-free setup"
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
          />
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="section" aria-labelledby="how-title">
      <div className="container">
        <SectionHead
          id="how-title"
          center
          eyebrow="How It Works"
          title="Simple to book. No rigid calendars."
          intro="Because every car is different, we quote on the job — not a fixed price list. You request a time that suits, we confirm and assess, and you only pay once you're happy with the quote."
        />
        <ol className="steps">
          {STEPS.map((s) => (
            <li key={s.n} className="step">
              <span className="step__n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="how__note">
          <div className="how__media">
            <Image src="/images/protected-finish.webp" alt="Glossy, freshly protected paintwork on a BMW" fill sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div className="how__note-copy">
            <ShieldIcon width={28} height={28} />
            <p>We only quote once we&apos;ve seen the car, so you always know exactly what you&apos;re paying for.</p>
            <Link className="btn btn--primary" href={quoteHref()}>
              Request a Visit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <section className="stats" aria-labelledby="stats-title">
      <div className="container">
        <SectionHead id="stats-title" center eyebrow="Trusted Across West London" title="The numbers behind the five stars" />
        <ul className="stats__grid">
          {STATS.map((s) => (
            <li key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
        <p className="stats__line">
          {REVIEWS.breakdown.map((r, i) => (
            <span key={r.source}>
              {i > 0 && " · "}
              {r.count} {r.source}
              {r.source === "Google" ? " reviews" : ""}
            </span>
          ))}
        </p>
        <p className="stats__insured">
          <ShieldIcon width={18} height={18} /> Fully insured · public liability
        </p>
      </div>
    </section>
  );
}

export function Founder() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container split split--reverse">
        <div className="split__media split__media--tall">
          <Image src="/images/founder-driveway.webp" alt="Porsche 911 on a driveway after a mobile valet" fill sizes="(max-width: 900px) 100vw, 45vw" />
        </div>
        <div>
          <SectionHead id="about-title" eyebrow="Meet The Founder" title="Hi, I'm John — a perfectionist with a passion for cars" />
          <div className="prose">
            <p>
              I started Ecoverde with one belief: your car should look incredible without costing the earth —
              literally. For over 8 years I&apos;ve brought high-end, fully-mobile car care to driveways and offices
              across West London, using eco-friendly products and the latest equipment on everything from daily
              drivers to supercars and classics.
            </p>
            <p>
              I treat every car like my own. That&apos;s why I never quote without seeing the job, always work around
              your budget, and don&apos;t leave until it&apos;s spotless.
            </p>
            <p className="signature">— {SITE.founder}, Founder</p>
          </div>
          <div className="guarantee">
            <ShieldIcon width={26} height={26} />
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

export function ServiceAreas() {
  return (
    <section id="areas" className="section section--muted" aria-labelledby="areas-title">
      <div className="container">
        <SectionHead
          id="areas-title"
          eyebrow="Service Areas"
          title="Mobile car valeting across West London & beyond"
          intro="Ecoverde Valeting is a fully mobile, eco-friendly car valeting and detailing service for car owners across West London, including busy professionals, families, and luxury and classic car enthusiasts. We come to your home or workplace from our bases in Ladbroke Grove (W10) and Brentford (TW8). Not sure if we reach you? Just ask."
        />
        <ul className="bases">
          {PRIMARY_AREAS.map((a) => (
            <li key={a.postcode} className="base">
              <PinIcon width={22} height={22} />
              <span>
                <strong>{a.name}</strong> {a.postcode}
              </span>
              <small>Base</small>
            </li>
          ))}
        </ul>
        <ul className="chips" aria-label="Areas we cover">
          {AREAS.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <details className="more-areas">
          <summary>Show more areas we cover</summary>
          <ul className="chips chips--light">
            {MORE_AREAS.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </details>
        <p className="areas__ask">
          Not on the list?{" "}
          <a href={whatsappLink("Hi Ecoverde, do you cover my area? My postcode is: ")} target="_blank" rel="noopener noreferrer">
            Message us on WhatsApp
          </a>{" "}
          — we probably reach you.
        </p>
      </div>
    </section>
  );
}

export function GiftVouchers() {
  const points = [
    { t: "Sent by email.", d: "Personalised with your message and delivered digitally, so there is nothing to post and nothing to arrive late." },
    { t: "Any service, any area.", d: "Redeemable against any valet or detailing service, anywhere we cover across West London." },
    { t: "Open value from £25.", d: "Put any amount on it, or choose a specific service if you already know what they want." },
  ];
  return (
    <section id="gift-vouchers" className="section" aria-labelledby="gift-title">
      <div className="container split">
        <div>
          <p className="eyebrow">Gift Vouchers</p>
          <h2 id="gift-title">Car valeting gift vouchers</h2>
          <p className="lead">
            A gift for someone who loves their car, or for anyone who would rather not spend a Saturday cleaning one.
            Vouchers are personalised, sent by email and redeemable anywhere across our West London coverage. Open value
            cards start at £25.
          </p>
          <ul className="ticks">
            {points.map((p) => (
              <li key={p.t}>
                <CheckIcon width={20} height={20} />
                <span>
                  <strong>{p.t}</strong> {p.d}
                </span>
              </li>
            ))}
          </ul>
          <Link className="btn btn--primary" href={quoteHref("gift-vouchers")}>
            Browse gift vouchers
          </Link>
        </div>
        <div className="split__media">
          <Image src="/images/gift-voucher.webp" alt="Freshly detailed blue sports car — the perfect gift for a car lover" fill sizes="(max-width: 900px) 100vw, 45vw" />
        </div>
      </div>
    </section>
  );
}

export function UsedCar() {
  return (
    <section className="section section--strong" aria-labelledby="used-title">
      <div className="container split split--reverse">
        <div className="split__media">
          <Image src="/images/used-car.webp" alt="Used hatchback ready for a fresh-start valet" fill sizes="(max-width: 900px) 100vw, 45vw" />
        </div>
        <div>
          <p className="eyebrow">Used Car Fresh Start Valet</p>
          <h2 id="used-title">Just bought a used car?</h2>
          <p className="lead">
            Our Used Car Fresh Start Valet deep cleans and steam sanitises the whole interior, then treats smoke, pet, damp
            and food smells at the source rather than covering them up. Fully mobile across West London, from £189.
          </p>
          <div className="qa">
            <h3>Why valet a used car after buying it?</h3>
            <p>
              You don&apos;t know how the last owner used it. Seats, carpets, vents and the steering wheel hold dirt,
              bacteria and old smells, so a deep clean and steam sanitisation gives you a hygienic start.
            </p>
            <h3>How long does it take?</h3>
            <p>Usually 2 to 4 hours, depending on the size of the car and its condition.</p>
          </div>
          <Link className="btn btn--primary" href={quoteHref("used-car-valet")}>
            Get a used car valet quote
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="final-title">
      <Image src="/images/cta-bg.webp" alt="" fill sizes="100vw" className="final-cta__bg" />
      <div className="container final-cta__inner">
        <p className="eyebrow eyebrow--light">Ready When You Are</p>
        <h2 id="final-title">Get your free, no-obligation quote</h2>
        <p>
          Send a quick photo or video of your car and we&apos;ll come back with a tailored quote. Fully mobile, fully eco,
          across West London — 7 days a week.
        </p>
        <div className="hero__ctas hero__ctas--center">
          <Link className="btn btn--light btn--lg" href={quoteHref()}>
            Get a Free Quote
          </Link>
          <a className="btn btn--whatsapp btn--lg" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon width={18} height={18} /> Message on WhatsApp
          </a>
          <a className="btn btn--ghost-light btn--lg" href={`tel:${PRIMARY_PHONE.tel}`}>
            <PhoneIcon width={18} height={18} /> Call {PRIMARY_PHONE.display}
          </a>
        </div>
      </div>
    </section>
  );
}

export { SectionHead, Stars };
