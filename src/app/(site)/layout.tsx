import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { ArrowRight, PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import QuoteModal from "@/components/QuoteModal";
import Tracker from "@/components/Tracker";
import { PRIMARY_PHONE, quoteHref, whatsappLink } from "@/data/site";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "../clone.css";

// Structured data (Organization, Service, FAQPage, BreadcrumbList…) comes per page from the live site — see src/lib/clone.ts.

/** Public website chrome: header, footer, quote pop-up and WhatsApp button. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <QuoteModal />
      <Tracker />
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
      <GoogleAnalytics />
    </>
  );
}
