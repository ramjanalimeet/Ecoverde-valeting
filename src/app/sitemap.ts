import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/journal", "/privacy-policy", "/cancellation-refund-policy"].map((p) => ({
    url: `${SITE.url}${p}`,
    changeFrequency: p ? "yearly" : "monthly",
    priority: p ? 0.4 : 1,
  }));
}
