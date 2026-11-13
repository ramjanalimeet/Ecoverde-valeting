import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { ArrowRight, PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import QuoteModal from "@/components/QuoteModal";
import { ALL_AREAS, PRIMARY_PHONE, SITE, quoteHref, whatsappLink } from "@/data/site";

// Only facts stated on the site — no review/rating markup.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoWash",
  name: SITE.legalName,
  alternateName: SITE.name,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phones[0].tel,
  image: `${SITE.url}/images/hero-green-bmw-valeted-west-london-1440.webp`,
  logo: `${SITE.url}/images/logo.png`,
  description: "Eco-friendly, fully mobile car valeting and detailing service across West London.",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "07:00",
      closes: "20:00",
    },
  ],
  areaServed: ALL_AREAS.map((a) => a.name),
};

/** Public website chrome: header, footer, quote pop-up and WhatsApp button. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <QuoteModal />
      <a className="wa-fab" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
        <WhatsAppIcon width={28} height={28} />
      </a>
      {/* Sticky action bar — phones & tablets only */}
      <nav className="mbar" aria-label="Quick contact">
        <a className="mbar__btn" href={`tel:${PRIMARY_PHONE.tel}`}>
          <PhoneIcon width={18} height={18} />
          <span>Call</span>
        </a>
        <a className="mbar__btn mbar__btn--wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon width={18} height={18} />
          <span>WhatsApp</span>
        </a>
        <Link className="mbar__cta" href={quoteHref()}>
          Get a Free Quote <ArrowRight width={16} height={16} />
        </Link>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
