import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PHOTOS, type PhotoKey } from "@/data/images";
import { quoteHref } from "@/data/site";
import { ArrowRight, CheckIcon, FeatureIcon, PlusIcon } from "./Icons";

/* Shared content blocks for the About, Why Choose Us and service pages. */

type Title = [string, string] | [string, string, string];
const H = ({ t, as: Tag = "h2", id }: { t: Title; as?: "h2" | "h3"; id?: string }) => (
  <Tag id={id}>
    {t[0]} <em>{t[1]}</em>
    {t[2]}
  </Tag>
);

/** Photo on one side, copy on the other. */
export function MediaSplit({
  photo,
  eyebrow,
  title,
  children,
  reverse = false,
  tone = "mint",
}: {
  photo: PhotoKey;
  eyebrow?: string;
  title: Title;
  children: ReactNode;
  reverse?: boolean;
  tone?: "mint" | "soft" | "glow";
}) {
  const ph = PHOTOS[photo];
  return (
    <section className={`msplit msplit--${tone}${reverse ? " msplit--reverse" : ""}`}>
      <div className="container msplit__grid">
        <div className="msplit__photo">
          <Image src={ph.src} alt={ph.alt} fill sizes="(max-width: 900px) 100vw, 450px" />
        </div>
        <div className="msplit__copy">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <H t={title} />
          {children}
        </div>
      </div>
    </section>
  );
}

/** Green-tick list; items may start with a bold lead-in ("**Lead** rest"). */
export function Checklist({ items }: { items: ReactNode[] }) {
  return (
    <ul className="cklist">
      {items.map((it, i) => (
        <li key={i}>
          <span className="cklist__tick" aria-hidden="true">
            <CheckIcon width={11} height={11} />
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** Centred heading block. */
export function CenterHead({ eyebrow, title, intro, id }: { eyebrow: string; title: Title; intro?: ReactNode; id?: string }) {
  return (
    <div className="chead">
      <p className="eyebrow eyebrow--center">{eyebrow}</p>
      <H t={title} id={id} />
      {intro && <p className="chead__intro">{intro}</p>}
    </div>
  );
}

/** Grid of white cards with an icon tile. */
export function IconCards({ items, link }: { items: { icon: string; title: string; text: string; href?: string; cta?: string }[]; link?: boolean }) {
  return (
    <ul className="icards">
      {items.map((c) => (
        <li key={c.title} className="icard">
          <span className="icard__icon">
            <FeatureIcon name={c.icon} width={18} height={18} />
          </span>
          <h3>{c.title}</h3>
          <p>{c.text}</p>
          {link && c.href && (
            <Link href={c.href} className="icard__link">
              {c.cta ?? "Learn more"} <ArrowRight width={13} height={13} />
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Dark band with a photo fading in on the right. */
export function DarkBand({
  photo = "beading",
  eyebrow,
  title,
  children,
}: {
  photo?: PhotoKey;
  eyebrow: string;
  title: Title;
  children: ReactNode;
}) {
  return (
    <section className="dband">
      <div className="dband__bg" aria-hidden="true">
        <Image src={PHOTOS[photo].src} alt="" fill sizes="60vw" />
      </div>
      <div className="container dband__inner">
        <p className="eyebrow eyebrow--light">{eyebrow}</p>
        <H t={title} />
        {children}
      </div>
    </section>
  );
}

/** Feature items for a dark band (2 columns). */
export function DarkFeatures({ items }: { items: { icon: string; title: string; text: string }[] }) {
  return (
    <ul className="dfeat">
      {items.map((f) => (
        <li key={f.title}>
          <span className="dfeat__icon">
            <FeatureIcon name={f.icon} width={17} height={17} />
          </span>
          <span>
            <strong>{f.title}</strong>
            <small>{f.text}</small>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Rounded dark card with numbered steps. */
export function StepsCard({ eyebrow, title, steps }: { eyebrow: string; title: Title; steps: { title: string; text: string }[] }) {
  return (
    <section className="section section--mint">
      <div className="container">
        <div className="how">
          <p className="eyebrow eyebrow--center eyebrow--light">{eyebrow}</p>
          <H t={title} />
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step__n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Pill badges row (e.g. Licensed & Insured). */
export function Badges({ items }: { items: { icon: string; label: string }[] }) {
  return (
    <ul className="badges">
      {items.map((b) => (
        <li key={b.label}>
          <FeatureIcon name={b.icon} width={14} height={14} /> {b.label}
        </li>
      ))}
    </ul>
  );
}

/** Two-column FAQ accordion block (inline, no section wrapper). */
export function FaqAccordion({ faqs, cols = 1 }: { faqs: { q: string; a: string }[]; cols?: 1 | 2 }) {
  return (
    <div className={`faqacc faqacc--${cols}`}>
      {faqs.map((f) => (
        <details key={f.q} className="acc">
          <summary>
            {f.q}
            <span className="faq__plus" aria-hidden="true">
              <PlusIcon width={14} height={14} />
            </span>
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export const QuoteButton = ({ service, label = "Get a Free Quote" }: { service?: string; label?: string }) => (
  <Link className="btn btn--primary" href={quoteHref(service)}>
    {label} <ArrowRight width={16} height={16} />
  </Link>
);
