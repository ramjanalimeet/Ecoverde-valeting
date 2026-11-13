import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/PageTemplates";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";
import Image from "next/image";
import QuoteForm from "@/components/QuoteForm";
import { PHOTOS } from "@/data/images";
import { AREA_BASES, SITE, whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us & Free Quote",
  description: "Call, WhatsApp or request a free, no-obligation quote for mobile car valeting across West London.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="contact">
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
        <div className="contact__grid">
          <div className="contact__info">
            <p className="eyebrow">Get In Touch</p>
            <h1>
              Let&apos;s get your car <em>spotless</em>
            </h1>
            <p className="lead">
              Send a quick photo or video of your car and we&apos;ll come back with a tailored quote. Fully mobile, fully eco,
              across West London — 7 days a week.
            </p>
            <ul className="contact__list">
              {SITE.phones.map((p) => (
                <li key={p.tel}>
                  <span className="contact__icon">
                    <PhoneIcon width={18} height={18} />
                  </span>
                  <span>
                    <a href={`tel:${p.tel}`}>{p.display}</a>
                    <small>{p.label}</small>
                  </span>
                </li>
              ))}
              <li>
                <span className="contact__icon">
                  <WhatsAppIcon width={18} height={18} />
                </span>
                <span>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                    Message on WhatsApp
                  </a>
                  <small>Fastest way to send photos</small>
                </span>
              </li>
              <li>
                <span className="contact__icon">
                  <MailIcon width={18} height={18} />
                </span>
                <span>
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                  <small>Quotes &amp; general questions</small>
                </span>
              </li>
              <li>
                <span className="contact__icon">
                  <ClockIcon width={18} height={18} />
                </span>
                <span>
                  <strong>{SITE.hours}</strong>
                  <small>7 days a week</small>
                </span>
              </li>
              <li>
                <span className="contact__icon">
                  <PinIcon width={18} height={18} />
                </span>
                <span>
                  <strong>{AREA_BASES.map((b) => `${b.name} (${b.postcode})`).join(" · ")}</strong>
                  <small>Our bases — we come to you across West London</small>
                </span>
              </li>
            </ul>
            <figure className="contact__photo">
              <Image src={PHOTOS.john.src} alt={PHOTOS.john.alt} width={PHOTOS.john.w} height={PHOTOS.john.h} sizes="(max-width: 900px) 100vw, 520px" />
              <figcaption>
                <strong>John Muriel</strong> — founder. You&apos;ll speak to John directly about your quote.
              </figcaption>
            </figure>
          </div>
          <div className="contact__form">
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}
