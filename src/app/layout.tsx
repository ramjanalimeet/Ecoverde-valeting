import type { Metadata, Viewport } from "next";
import "@fontsource-variable/hanken-grotesk";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AREAS, PRIMARY_AREAS, SITE } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Mobile Car Valeting & Detailing West London | Ecoverde",
    template: "%s | Ecoverde Valeting",
  },
  description:
    "Eco-friendly mobile car valeting and detailing across West London. Premium valets, steam cleaning, paint correction and ceramic coating. Get a free quote.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: SITE.name,
    url: "/",
    title: "Mobile Car Valeting & Detailing West London | Ecoverde",
    description:
      "Eco-friendly mobile car valeting and detailing across West London. Biodegradable products, electric van, meticulous results.",
    images: [{ url: "/images/hero-foam-wash.webp", width: 1400, height: 933, alt: "Eco-friendly mobile car valeting" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0b3326",
  width: "device-width",
  initialScale: 1,
};

// Only facts stated on the site — no review/rating markup.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoWash",
  name: SITE.legalName,
  alternateName: SITE.name,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phones[0].tel,
  image: `${SITE.url}/images/hero-foam-wash.webp`,
  description: "Eco-friendly, fully mobile car valeting and detailing service across West London.",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "07:00",
      closes: "20:00",
    },
  ],
  areaServed: [...PRIMARY_AREAS.map((a) => `${a.name} ${a.postcode}`), ...AREAS],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
