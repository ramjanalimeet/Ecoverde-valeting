import type { Metadata } from "next";
import Link from "next/link";
import { DarkHero } from "@/components/PageTemplates";
import { FinalCta } from "@/components/Sections";
import { AREA_BASES, areaHref, slugify } from "@/data/site";
import { ArrowRight } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Service Areas — Mobile Car Valeting West London",
  description: "Mobile car valeting across West London from our Ladbroke Grove (W10) and Brentford (TW8) bases. Find your area.",
  alternates: { canonical: "/areas" },
};

export default function AreasIndex() {
  return (
    <>
      <DarkHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Service Areas" }]}
        eyebrow="Service Areas"
        title={["Mobile car valeting", "across West London"]}
        intro="Fully mobile — choose your area and we'll come to you, 7 days a week, from our bases in Ladbroke Grove (W10) and Brentford (TW8). Not sure if we reach you? Just ask."
        image="/images/hero.webp"
      />
      <section className="section section--mint">
        <div className="container">
          <div className="bases-grid">
            {AREA_BASES.map((b) => (
              <div key={b.slug} className="base-card">
                <Link href={areaHref(b.slug)} className="mega__base">
                  {b.name} ({b.postcode}) <ArrowRight width={16} height={16} />
                </Link>
                <ul className="mega__areas">
                  {b.areas.map((a) => (
                    <li key={a}>
                      <Link href={areaHref(slugify(a))}>{a}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
