import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { ArrowRight, PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import QuoteModal from "@/components/QuoteModal";
import Tracker from "@/components/Tracker";
import { quoteHref } from "@/data/site";
import { CallLink, WhatsAppLink } from "@/components/LocalContact";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MobileBarReveal from "@/components/MobileBarReveal";
import ResizeCalm from "@/components/ResizeCalm";
import "../clone.css";
import "../clone-mobile.css";
import "../quality-checklist.css";

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
      <WhatsAppLink className="wa-fab">
        <WhatsAppIcon width={26} height={26} />
        <span>Continue on WhatsApp</span>
      </WhatsAppLink>
      {/* Sticky action bar — phones & tablets only */}
      <nav className="mbar" aria-label="Quick contact">
        <CallLink className="mbar__btn">
          <PhoneIcon width={18} height={18} />
          <span>Call</span>
        </CallLink>
        <WhatsAppLink className="mbar__btn mbar__btn--wa">
          <WhatsAppIcon width={18} height={18} />
          <span>WhatsApp</span>
        </WhatsAppLink>
        <Link className="mbar__cta" href={quoteHref()}>
          Get a Free Quote <ArrowRight width={16} height={16} />
        </Link>
      </nav>
      <GoogleAnalytics />
      <MobileBarReveal />
      <ResizeCalm />
    </>
  );
}
