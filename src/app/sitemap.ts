import type { MetadataRoute } from "next";
import { SERVICE_PAGES } from "@/data/pages";
import { ALL_AREAS, SITE } from "@/data/site";
import { getDB } from "@/lib/db";

// Includes Journal posts from the database, so render on request.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const core = ["", "/services", "/areas", "/about", "/why-choose-us", "/contact", "/journal"];
  const legal = ["/privacy-policy", "/cancellation-refund-policy"];
  let posts: { slug: string; updated_at: string }[] = [];
  try {
    const db = await getDB();
    if (db) posts = (await db.prepare("SELECT slug, updated_at FROM posts WHERE status = 'published'").all<{ slug: string; updated_at: string }>()).results;
  } catch {
    /* database unavailable — static pages only */
  }
  return [
    ...core.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "monthly" as const, priority: p ? 0.8 : 1 })),
    ...SERVICE_PAGES.map((p) => ({ url: `${SITE.url}/services/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...ALL_AREAS.map((a) => ({ url: `${SITE.url}/areas/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${SITE.url}/journal/${p.slug}`, lastModified: p.updated_at, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...legal.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
