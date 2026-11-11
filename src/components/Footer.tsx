import Link from "next/link";
import { AREA_BASES, PRIMARY_PHONE, REVIEWS, SITE, SOCIAL, areaHref, quoteHref, slugify, whatsappLink } from "@/data/site";
import { ArrowRight, ClockIcon, Logo, MailIcon, PhoneIcon, SocialIcon, StarIcon, WhatsAppIcon } from "./Icons";

const SERVICES_LINKS = [
  { label: "Valeting Service", href: "/services/valeting-service" },
  { label: "Car Detailing", href: "/services/car-detailing" },
  { label: "Mobile Car Wash", href: "/services/mobile-car-wash" },
  { label: "Car Restoration", href: "/services/car-restoration" },
  { label: "Ceramic Coating", href: "/services/ceramic-coating" },
  { label: "Paint Correction", href: "/services/paint-correction" },
  { label: "Interior Deep Clean", href: "/services/interior-deep-clean" },
  { label: "Gift Vouchers", href: "/services/gift-vouchers" },
];

const COMPANY_LINKS = [
  { label: "About John", href: "/about" },
  { label: "Why Choose Us", href: "/why-choose-us" },
  { label: "How It Works", href: "/#how" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

const POPULAR_AREAS = ["Chiswick", "Notting Hill", "Kensington", "Ealing", "Richmond"];

function Column({ title, links, more }: { title: string; links: { label: string; href: string }[]; more?: { label: string; href: string } }) {
  return (
    <nav className="ft__col" aria-label={title}>
      <h2 className="ft__title">{title}</h2>
      <ul className="ft__links">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
        {more && (
          <li>
            <Link href={more.href} className="ft__more">
              {more.label} <ArrowRight width={13} height={13} />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const areaLinks = [
    ...AREA_BASES.map((a) => ({ label: `${a.name} (${a.postcode})`, href: areaHref(a.slug) })),
    ...POPULAR_AREAS.map((a) => ({ label: a, href: areaHref(slugify(a)) })),
  ];

  return (
    <footer className="ft">
      <div className="ft__wrap">
        {/* CTA band */}
        <div className="ft__cta">
          <div>
            <p className="ft__cta-kicker">Ready when you are</p>
            <p className="ft__cta-title">
              Get your car <em>spotless</em> — we come to you.
            </p>
          </div>
          <div className="ft__cta-actions">
            <Link className="btn btn--white" href={quoteHref()}>
              Get a Free Quote <ArrowRight width={16} height={16} />
            </Link>
            <a className="btn btn--ghost" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon width={16} height={16} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="ft__grid">
          {/* Brand */}
          <div className="ft__brand">
            <Link href="/" aria-label="Ecoverde Valeting — home">
              <Logo light />
            </Link>
            <p>
              West London&apos;s most trusted eco-friendly mobile car valeting &amp; detailing service. Biodegradable products,
              electric van, meticulous results.
            </p>
            <p className="ft__rating">
              <span className="ft__stars" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} width={13} height={13} />
                ))}
              </span>
              <span>
                <strong>{REVIEWS.rating}</strong> from {REVIEWS.total} reviews
              </span>
            </p>
            <p className="ft__follow">Follow us</p>
            <ul className="ft__social">
              {SOCIAL.filter((x) => x.href).map((x) => (
                <li key={x.icon}>
                  <a href={x.href} target="_blank" rel="noopener noreferrer" aria-label={`Ecoverde on ${x.label}`} title={x.label}>
                    <SocialIcon name={x.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <Column title="Services" links={SERVICES_LINKS} more={{ label: "All services", href: "/services" }} />
          <Column title="Company" links={COMPANY_LINKS} />
          <Column title="Service Areas" links={areaLinks} more={{ label: "All areas", href: "/areas" }} />

          {/* Contact */}
          <div className="ft__col">
            <h2 className="ft__title">Get In Touch</h2>
            <ul className="ft__contact">
              {SITE.phones.map((p) => (
                <li key={p.tel}>
                  <span className="ft__icon">
                    <PhoneIcon width={15} height={15} />
                  </span>
                  <span>
                    <a href={`tel:${p.tel}`}>{p.display}</a>
                    <small>{p.label}</small>
                  </span>
                </li>
              ))}
              <li>
                <span className="ft__icon">
                  <MailIcon width={15} height={15} />
                </span>
                <span>
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                  <small>Quotes &amp; questions</small>
                </span>
              </li>
              <li>
                <span className="ft__icon">
                  <ClockIcon width={15} height={15} />
                </span>
                <span>
                  <strong>{SITE.hours}</strong>
                  <small>7 days a week</small>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="ft__bottom">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <ul className="ft__legal">
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/cancellation-refund-policy">Cancellation &amp; Refund Policy</Link>
            </li>
            <li>
              <a href={`tel:${PRIMARY_PHONE.tel}`}>Call {PRIMARY_PHONE.display}</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
