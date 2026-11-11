import Link from "next/link";
import { PRIMARY_AREAS, SITE, SOCIAL, quoteHref } from "@/data/site";
import { ClockIcon, Logo, MailIcon, PhoneIcon, SocialIcon } from "./Icons";

const SERVICES_LINKS = [
  { label: "Valeting Service", href: quoteHref("mini-full-valet") },
  { label: "Car Detailing", href: quoteHref("supercar-detailing") },
  { label: "Mobile Car Wash", href: quoteHref("premium-wash-shine") },
  { label: "Car Restoration", href: quoteHref("bodywork-respray") },
  { label: "Ceramic Coating", href: quoteHref("ceramic-coating") },
  { label: "Paint Correction", href: quoteHref("paint-correction") },
  { label: "Interior Deep Clean & Steam", href: quoteHref("interior-deep-clean") },
  { label: "Soft-Top Cleaning", href: quoteHref("soft-top-cleaning") },
  { label: "Used Car Valet", href: quoteHref("used-car-valet") },
  { label: "Fleet & Commercial", href: quoteHref("fleet-commercial") },
  { label: "Maintenance Packages", href: quoteHref("maintenance-packages") },
  { label: "Gift Vouchers", href: quoteHref("gift-vouchers") },
  { label: "All Services", href: "/#services" },
];

const COMPANY_LINKS = [
  { label: "About John", href: "/#about" },
  { label: "Why Choose Us", href: "/#why" },
  { label: "Why Eco-Friendly", href: "/#why" },
  { label: "How It Works", href: "/#how" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/#quote" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p>
            West London&apos;s most trusted eco-friendly mobile car valeting &amp; detailing service. Biodegradable
            products, electric van, meticulous results.
          </p>
          {SOCIAL.some((x) => x.href) && (
            <ul className="footer__social">
              {SOCIAL.filter((x) => x.href).map((x) => (
                <li key={x.icon}>
                  <a href={x.href} target="_blank" rel="noopener noreferrer" aria-label={x.label}>
                    <SocialIcon name={x.icon} width={15} height={15} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="footer__title">Services</h2>
          <ul className="footer__links">
            {SERVICES_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="footer__title">Company</h2>
          <ul className="footer__links">
            {COMPANY_LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="footer__title">Service Areas</h2>
          <ul className="footer__links">
            {[...PRIMARY_AREAS].reverse().map((a) => (
              <li key={a.postcode}>
                <Link href="/#areas">
                  {a.name} ({a.postcode})
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="footer__title">Get In Touch</h2>
          <ul className="footer__contact">
            {SITE.phones.map((p) => (
              <li key={p.tel}>
                <PhoneIcon width={18} height={18} />
                <span>
                  <a href={`tel:${p.tel}`}>{p.display}</a>
                  <small>{p.label}</small>
                </span>
              </li>
            ))}
            <li>
              <MailIcon width={18} height={18} />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>
              <ClockIcon width={18} height={18} />
              <span>{SITE.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          <br />
          {SITE.tagline}
        </p>
        <ul className="footer__legal">
          <li>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/cancellation-refund-policy">Cancellation &amp; Refund Policy</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
