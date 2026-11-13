import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fraunces, hanken } from "./fonts";
import { SITE } from "@/data/site";

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
    images: [{ url: "/images/hero-green-bmw-valeted-west-london-1440.webp", width: 636, height: 656, alt: "Eco-friendly mobile car valeting" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/images/logo.png", apple: "/images/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#0b3326",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${hanken.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
