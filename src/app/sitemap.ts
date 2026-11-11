import type { MetadataRoute } from "next";
import { SERVICE_PAGES } from "@/data/pages";
import { ALL_AREAS, SITE } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const core = ["", "/services", "/areas", "/about", "/why-choose-us", "/contact", "/journal"];
  const legal = ["/privacy-policy", "/cancellation-refund-policy"];
  return [
    ...core.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "monthly" as const, priority: p ? 0.8 : 1 })),
    ...SERVICE_PAGES.map((p) => ({ url: `${SITE.url}/services/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...ALL_AREAS.map((a) => ({ url: `${SITE.url}/areas/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...legal.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
