import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getServicePage, type Faq, type ServicePage } from "@/data/pages";
import { HERO_POOL, JOB_KEYS, PHOTOS, pickFor, type PhotoKey } from "@/data/images";
import {
  AREA_BASES,
  PRIMARY_PHONE,
  SERVICE_CATEGORIES,
  SERVICE_GROUPS,
  areaHref,
  quoteHref,
  serviceHref,
  slugify,
  type Area,
} from "@/data/site";
import { ArrowRight, CheckIcon, PhoneIcon, PinIcon, PlusIcon } from "./Icons";
import { FinalCta, HowItWorks, Stats, WhyChoose } from "./Sections";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      <ol>
        {items.map((c, i) =>
          c.href && i < items.length - 1 ? (
            <li key={c.label}>
              <Link href={c.href}>{c.label}</Link>
            </li>
          ) : (
            <li key={c.label} aria-current="page">
              {c.label}
            </li>
          )
        )}
      </ol>
    </nav>
  );
}

/** Dark, photo-backed page hero used by service, area and company pages. */
export function DarkHero({
  crumbs,
  eyebrow,
  title,
  intro,
  pill,
  image,
  service,
  ctas = true,
  updated,
  extra,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: [string, string] | [string, string, string];
  intro: string;
  pill?: [string, string];
  image: string;
  service?: string;
  /** Show the quote / call buttons (default true) */
  ctas?: boolean;
  /** e.g. "November 2026" — shown as "Last updated: …" */
  updated?: string;
  /** Extra paragraph under the intro */
  extra?: string;
}) {
  return (
    <section className="dhero">
      <Image src={image} alt="" fill priority sizes="100vw" className="dhero__bg" />
      <div className="container dhero__inner">
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow eyebrow--light">{eyebrow}</p>
        <h1>
          {title[0]} <em>{title[1]}</em>
          {title[2]}
        </h1>
        <p className="dhero__intro">{intro}</p>
        {extra && <p className="dhero__intro">{extra}</p>}
        {pill && (
          <p className="dhero__pill">
            <strong>{pill[0]}</strong> {pill[1]}
          </p>
        )}
        {updated && <p className="dhero__updated">Last updated: {updated}</p>}
        {ctas && <div className="dhero__ctas">
          <Link className="btn btn--primary" href={quoteHref(service)}>
            Get a Free Quote <ArrowRight width={16} height={16} />
          </Link>
          <a className="btn btn--ghost" href={`tel:${PRIMARY_PHONE.tel}`}>
            <PhoneIcon width={16} height={16} /> Call {PRIMARY_PHONE.display}
          </a>
        </div>}
      </div>
    </section>
  );
}

export function FaqList({ faqs, title = ["Questions &", "answers"], eyebrow = "Good To Know" }: { faqs: Faq[]; title?: [string, string]; eyebrow?: string }) {
  return (
    <section className="section section--soft" aria-labelledby="page-faq-title">
      <div className="container">
        <p className="eyebrow eyebrow--center">{eyebrow}</p>
        <h2 id="page-faq-title" className="center">
          {title[0]} <em>{title[1]}</em>
        </h2>
        <div className="faq">
          {faqs.map((f) => (
            <details key={f.q} className="acc">
              <summary>
                {f.q} <PlusIcon width={16} height={16} />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SplitIntro({ photo, eyebrow, title, children, reverse = false }: { photo: PhotoKey; eyebrow: string; title: [string, string]; children: ReactNode; reverse?: boolean }) {
  const ph = PHOTOS[photo];
  return (
    <section className={`founder page-split${reverse ? " page-split--reverse" : ""}`}>
      <div className="container founder__grid">
        <div className="founder__photo">
          <Image src={ph.src} alt={ph.alt} fill sizes="(max-width: 900px) 100vw, 420px" />
        </div>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>
            {title[0]} <em>{title[1]}</em>
          </h2>
          {children}
        </div>
      </div>
    </section>
  );
}

/** A row of photos with captions; tiles open full size in a new tab. */
export function PhotoStrip({ keys, eyebrow, title, intro, tone = "soft" }: { keys: PhotoKey[]; eyebrow: string; title: [string, string]; intro?: string; tone?: "soft" | "mint" }) {
  if (!keys.length) return null;
  return (
    <section className={`section section--${tone} pstrip`} aria-labelledby={`pstrip-${eyebrow.replace(/\W+/g, "-").toLowerCase()}`}>
      <div className="container">
        <div className="pstrip__head">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id={`pstrip-${eyebrow.replace(/\W+/g, "-").toLowerCase()}`}>
              {title[0]} <em>{title[1]}</em>
            </h2>
          </div>
          {intro && <p className="lead">{intro}</p>}
        </div>
        <ul className={`pstrip__grid pstrip__grid--${keys.length}`}>
          {keys.map((k) => {
            const ph = PHOTOS[k];
            return (
              <li key={k}>
                <figure className="pstrip__item">
                  <span className="pstrip__img">
                    <Image src={ph.src} alt={ph.alt} fill sizes="(max-width: 640px) 50vw, 280px" />
                  </span>
                  <figcaption>{ph.caption}</figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function ServiceCards({ slugs, title, eyebrow }: { slugs: string[]; title: [string, string]; eyebrow: string }) {
  const pages = slugs.map((s) => getServicePage(s)).filter((p): p is ServicePage => !!p);
  if (!pages.length) return null;
  return (
    <section className="section section--mint" aria-labelledby="svc-cards-title">
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="svc-cards-title">
          {title[0]} <em>{title[1]}</em>
        </h2>
        <ul className="services-grid">
          {pages.map((p) => (
            <li key={p.slug} className="scard">
              <Link href={serviceHref(p.slug)} className="scard__media" tabIndex={-1} aria-hidden="true">
                <Image src={PHOTOS[p.hero].src} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px" />
                {p.price && <span className="scard__price">{p.price}</span>}
              </Link>
              <div className="scard__body">
                <h3>
                  <Link href={serviceHref(p.slug)}>{p.name}</Link>
                </h3>
                <p>{p.intro.length > 150 ? `${p.intro.slice(0, 147).replace(/\s+\S*$/, "")}…` : p.intro}</p>
                <Link className="link-arrow" href={serviceHref(p.slug)}>
                  View service <ArrowRight width={14} height={14} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Service page */
export function ServicePageView({ page }: { page: ServicePage }) {
  const cat = SERVICE_CATEGORIES.find((c) => c.slug === page.category);
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, { label: "Services", href: "/services" }];
  if (!page.isCategory && cat) crumbs.push({ label: cat.label, href: serviceHref(cat.slug) });
  crumbs.push({ label: page.name });

  const children = page.isCategory ? SERVICE_GROUPS.filter((g) => g.category === page.slug).flatMap((g) => g.items.map((i) => i.slug)) : [];
  const related = page.isCategory
    ? []
    : SERVICE_GROUPS.flatMap((g) => g.items)
        .map((i) => i.slug)
        .filter((s) => s !== page.slug && getServicePage(s)?.category === page.category)
        .slice(0, 3);

  return (
    <>
      <DarkHero crumbs={crumbs} eyebrow={page.eyebrow} title={page.h1} intro={page.intro} pill={page.pill} image={PHOTOS[page.hero].src} service={page.slug} />

      <SplitIntro photo={page.photo} eyebrow={page.sectionEyebrow} title={page.sectionTitle}>
        {page.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        {(page.price || page.duration) && (
          <ul className="facts">
            {page.price && (
              <li>
                <small>Price</small>
                <strong>{page.price}</strong>
              </li>
            )}
            {page.duration && (
              <li>
                <small>Typical time</small>
                <strong>{page.duration}</strong>
              </li>
            )}
            <li>
              <small>Where</small>
              <strong>Your home or work</strong>
            </li>
          </ul>
        )}
        <Link className="btn btn--primary" href={quoteHref(page.slug)}>
          Book {page.name} <ArrowRight width={16} height={16} />
        </Link>
      </SplitIntro>

      <section className="section section--soft" aria-labelledby="included-title">
        <div className="container">
          <div className="included">
            <div>
              <p className="eyebrow">What&apos;s Included</p>
              <h2 id="included-title">
                Every visit, <em>done properly</em>
              </h2>
              <p className="lead">All with eco-friendly, biodegradable products and our electric, generator-free setup.</p>
            </div>
            <ul className="ticks ticks--grid">
              {page.includes.map((i) => (
                <li key={i}>
                  <CheckIcon width={12} height={12} />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
          {page.packages && (
            <ul className={`packages packages--${page.packages.length}`}>
              {page.packages.map((p) => (
                <li key={p.name} className="package">
                  <h3>{p.name}</h3>
                  {p.meta && <p className="package__meta">{p.meta}</p>}
                  <p>{p.text}</p>
                  <ul className="ticks">
                    {p.items.map((i) => (
                      <li key={i}>
                        <CheckIcon width={12} height={12} />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                  <Link className="link-arrow" href={quoteHref(page.slug)}>
                    Get a quote <ArrowRight width={14} height={14} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <PhotoStrip
        keys={page.gallery}
        tone="mint"
        eyebrow="Recent Work"
        title={[`${page.name}`, "in action"]}
        intro="Real jobs from driveways and offices across West London — fully mobile, eco-friendly, finished by hand."
      />

      {page.isCategory ? (
        <ServiceCards slugs={children} eyebrow={`More ${page.name}`} title={["Specialist", "services"]} />
      ) : (
        <ServiceCards slugs={related} eyebrow="Related Services" title={["You might", "also need"]} />
      )}

      <HowItWorks />
      <FaqList faqs={page.faqs} />
      <FinalCta />
    </>
  );
}

/* ------------------------------------------------------------ Area page */
export function AreaPageView({ area }: { area: Area }) {
  const { base } = area;
  const nearby = base.areas.filter((a) => a !== area.name);
  const otherBase = AREA_BASES.find((b) => b.slug !== base.slug)!;
  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Service Areas", href: "/areas" },
  ];
  if (!area.isBase) crumbs.push({ label: `${base.name} (${base.postcode})`, href: areaHref(base.slug) });
  crumbs.push({ label: area.isBase ? `${area.name} (${base.postcode})` : area.name });

  const intro = area.isBase
    ? `Our ${area.name} (${base.postcode}) base serves drivers across ${base.areas.slice(0, 4).join(", ")} and beyond. Premium, eco-friendly car valeting and detailing at your home or workplace — biodegradable products, an electric van and a meticulous finish, 7 days a week.`
    : `Fully mobile, eco-friendly car valeting and detailing in ${area.name}. We come to your home, office or car park from our ${base.name} (${base.postcode}) base — biodegradable products, an electric van and a meticulous showroom finish, 7 days a week.`;

  const heroKey = pickFor(area.slug, HERO_POOL, 1)[0];
  const jobKeys = pickFor(area.slug, JOB_KEYS, 4);

  const faqs: Faq[] = [
    {
      q: `Do you cover all of ${area.name}?`,
      a: `Yes — we come to homes, offices and car parks across ${area.name}${area.isBase ? ` and the surrounding areas served from our ${base.postcode} base` : ` from our nearby ${base.name} base`}. Not sure if we reach you? Send your postcode and we'll confirm.`,
    },
    {
      q: "Do I need to provide water or power?",
      a: "No. Our electric van carries everything we need, so there's no generator noise and nothing to plug in — ideal for flats, mews streets and offices.",
    },
    {
      q: "How do I get a price?",
      a: "Send a few photos or a short video of your car with the quote form. John will call you with a free, tailored, no-obligation quote.",
    },
  ];

  return (
    <>
      <DarkHero
        crumbs={crumbs}
        eyebrow={`Mobile Car Valeting · ${area.name}`}
        title={["Mobile car valeting in", area.name]}
        intro={intro}
        pill={[`${base.name} (${base.postcode}) base`, "· fully mobile, 7 days a week"]}
        image={PHOTOS[heroKey].src}
      />

      <SplitIntro photo="john" eyebrow={`We Come To You · ${area.name}`} title={["Your driveway, your office —", "we bring everything"]} reverse>
        <p>
          John and the Ecoverde electric van arrive fully self-contained, so there&apos;s nothing to plug in and no generator
          noise — perfect for {area.name}&apos;s residential streets, mews and office car parks.
        </p>
        <p>
          Biodegradable products, low-water techniques and a meticulous hand finish, from a quick wash to ceramic coating.
        </p>
        <Link className="btn btn--primary" href={quoteHref()}>
          Get a Free Quote in {area.name} <ArrowRight width={16} height={16} />
        </Link>
      </SplitIntro>

      <section className="section section--mint" aria-labelledby="area-services-title">
        <div className="container">
          <p className="eyebrow">Services In {area.name}</p>
          <h2 id="area-services-title">
            Everything your car needs, <em>at your door</em>
          </h2>
          <p className="lead">
            Every service is fully mobile and uses eco-friendly products. Prices vary with size and condition, so every quote is
            free and tailored.
          </p>
          <ul className="cat-cards">
            {SERVICE_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={serviceHref(c.slug)} className="cat-card">
                  <span className="cat-card__img">
                    <Image src={c.image} alt="" fill sizes="(max-width: 640px) 50vw, 220px" />
                  </span>
                  <strong>{c.label}</strong>
                  <span>{c.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="chips chips--links" aria-label="Popular services">
            {SERVICE_GROUPS.flatMap((g) => g.items)
              .slice(0, 12)
              .map((s) => (
                <li key={s.slug}>
                  <Link href={serviceHref(s.slug)}>{s.label}</Link>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <WhyChoose />

      <section className="section section--soft" aria-labelledby="nearby-title">
        <div className="container">
          <div className="areas">
            <div>
              <p className="eyebrow">{area.isBase ? "Areas We Cover" : "Nearby Areas"}</p>
              <h2 id="nearby-title">
                {area.isBase ? "Covered from" : "Also near"} <em>{area.isBase ? `${area.name}` : area.name}</em>
              </h2>
              <p>
                <PinIcon width={14} height={14} /> Served from our {base.name} ({base.postcode}) base. We also cover{" "}
                <Link href={areaHref(otherBase.slug)}>
                  {otherBase.name} ({otherBase.postcode})
                </Link>{" "}
                and its surrounding areas.
              </p>
            </div>
            <ul className="chips chips--links" aria-label="Nearby areas">
              {(area.isBase ? base.areas : nearby).map((a) => (
                <li key={a}>
                  <Link href={areaHref(slugify(a))}>{a}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PhotoStrip
        keys={jobKeys}
        eyebrow="Recent Jobs"
        title={["Cars we've", "cared for"]}
        intro={`A few recent valets and details from across West London — the same care we bring to ${area.name}.`}
      />

      <Stats />
      <FaqList faqs={faqs} />
      <FinalCta />
    </>
  );
}
