import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DarkHero } from "@/components/PageTemplates";
import { FinalCta, HowItWorks } from "@/components/Sections";
import { SERVICE_CATEGORIES, SERVICE_GROUPS, serviceHref } from "@/data/site";

export const metadata: Metadata = {
  title: "Car Valeting & Detailing Services",
  description: "Eco-friendly mobile valeting, detailing, car wash and restoration services across West London. Free, tailored quotes.",
  alternates: { canonical: "/services" },
};

export default function ServicesIndex() {
  return (
    <>
      <DarkHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        eyebrow="Our Services · West London"
        title={["Eco-friendly car care,", "your way"]}
        intro="In the UK, a “valet” means a thorough deep clean — here's the full range, all fully mobile. From a quick wash to ceramic coating and bodywork repair, every service uses eco-friendly products and comes to your door."
        pill={["Free tailored quote", "· prices vary with size & condition"]}
        image="/images/service-1.webp"
      />
      <section className="section section--mint">
        <div className="container">
          <ul className="cat-cards">
            {SERVICE_CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={serviceHref(c.slug)} className="cat-card">
                  <span className="cat-card__img">
                    <Image src={c.image} alt="" fill sizes="(max-width: 640px) 50vw, 220px" />
                  </span>
                  <strong>{c.label}</strong>
                  <span>{c.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="link-groups">
            {SERVICE_GROUPS.map((g) => (
              <div key={g.title}>
                <h2 className="link-groups__title">{g.title}</h2>
                <ul>
                  {g.items.map((s) => (
                    <li key={s.slug}>
                      <Link href={serviceHref(s.slug)}>{s.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <HowItWorks />
      <FinalCta />
    </>
  );
}
