// Homepage hero and the closing call-to-action band (used on Journal articles).
import Image from "next/image";
import { preload } from "react-dom";
import Link from "next/link";
import type { ReactNode } from "react";
import { PRIMARY_PHONE, REVIEWS, quoteHref, whatsappLink } from "@/data/site";
import { ArrowRight, FeatureIcon, PhoneIcon, StarIcon, WhatsAppIcon } from "./Icons";

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

/* ------------------------------------------------------------------ Hero */
const HERO = {
  src: "/images/hero-green-bmw-valeted-west-london-1440.webp",
  sizes: "100vw",
  srcSet: [720, 960, 1440].map((w) => `/images/hero-green-bmw-valeted-west-london-${w}.webp ${w}w`).join(", "),
  // Phones: the photo sits behind the frosted glass card (which blurs it anyway), so a tiny, pre-blurred
  // 1 KB version is used. It loads instantly and, being low-detail, lets the headline count as LCP.
  phone: "/images/hero-green-bmw-valeted-west-london-phone.webp",
  phoneMedia: "(max-width: 760px)",
};

export function Hero() {
  preload(HERO.phone, { as: "image", media: HERO.phoneMedia, fetchPriority: "high" });
  preload(HERO.src, { as: "image", imageSrcSet: HERO.srcSet, imageSizes: HERO.sizes, media: "(min-width: 761px)", fetchPriority: "high" });
  return (
    <section className="hero" aria-labelledby="hero-title">
      <picture className="hero__photo">
        <source media={HERO.phoneMedia} srcSet={HERO.phone} width={160} height={87} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO.src}
          srcSet={HERO.srcSet}
          sizes={HERO.sizes}
          width={1440}
          height={785}
          alt="Freshly valeted dark green BMW parked on a tree-lined, white stucco street in West London"
          fetchPriority="high"
          decoding="sync"
        />
      </picture>
      <div className="hero__shade" aria-hidden="true" />
      <svg className="hero__waves" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {Array.from({ length: 9 }).map((_, i) => (
          <path
            key={i}
            d={`M-40 ${250 + i * 9} C 120 ${170 + i * 12}, 260 ${330 - i * 6}, 640 ${120 + i * 14}`}
            style={{ animationDelay: `${-i * 1.1}s` }}
          />
        ))}
      </svg>
      <div className="container hero__inner">
        <ul className="hero__features">
          {[
            { icon: "leaf", title: "Eco-Friendly Care", text: "Biodegradable products, kinder to your car and the planet." },
            { icon: "car", title: "We Come to You", text: "Fully mobile service across West London, 7 days a week." },
            { icon: "sparkle", title: "Showroom Results", text: "Professional detailing for a lasting, premium finish." },
          ].map((f) => (
            <li key={f.title}>
              <span className="hero__feature-icon">
                <FeatureIcon name={f.icon} width={24} height={24} />
              </span>
              <span>
                <strong>{f.title}</strong>
                <small>{f.text}</small>
              </span>
            </li>
          ))}
        </ul>
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
              <Image src="/images/west-london-chambers-of-commerce-member.webp" alt="Member of West London Chambers of Commerce" width={152} height={36} loading="eager" />
            </li>
            <li className="hero__tile-logo">
              <Image src="/images/checkatrade-approved-member.webp" alt="Checkatrade approved member" width={120} height={36} loading="eager" />
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

export function FinalCta({
  eyebrow = "Ready When You Are",
  title = "Get your free, no-obligation quote",
  text = "Send a quick photo or video of your car and we'll come back with a tailored quote. Fully mobile, fully eco, across West London — 7 days a week.",
  whatsapp = true,
}: { eyebrow?: string; title?: string; text?: string; whatsapp?: boolean } = {}) {
  return (
    <section className="final-cta" aria-labelledby="final-title">
      <Image src="/images/snow-foam-pre-wash-cta.webp" alt="" fill sizes="100vw" className="final-cta__bg" />
      <div className="container final-cta__inner">
        <Eyebrow center light>
          {eyebrow}
        </Eyebrow>
        <h2 id="final-title">{title}</h2>
        <p>{text}</p>
        <div className="final-cta__actions">
          <Link className="btn btn--white" href={quoteHref()}>
            Get a Free Quote <ArrowRight width={16} height={16} />
          </Link>
          {whatsapp && (
            <a className="btn btn--ghost" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon width={16} height={16} /> Message on WhatsApp
            </a>
          )}
          <a className="btn btn--ghost" href={`tel:${PRIMARY_PHONE.tel}`}>
            <PhoneIcon width={16} height={16} /> Call {PRIMARY_PHONE.display}
          </a>
        </div>
      </div>
    </section>
  );
}
