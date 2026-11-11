import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { WhatsAppIcon } from "@/components/Icons";
import QuoteModal from "@/components/QuoteModal";
import { ALL_AREAS, SITE, whatsappLink } from "@/data/site";

// Only facts stated on the site — no review/rating markup.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoWash",
  name: SITE.legalName,
  alternateName: SITE.name,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phones[0].tel,
  image: `${SITE.url}/images/hero.webp`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
