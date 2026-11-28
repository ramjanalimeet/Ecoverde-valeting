import type { MetadataRoute } from "next";
import live from "@/content/clone/sitemap.json";
import { SITE } from "@/data/site";
import { getDB } from "@/lib/db";
import { QUALITY_CHECKLIST_PUBLISHED } from "@/content/quality-checklist";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

// Includes Journal posts from the database, so render on request.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: { slug: string; updated_at: string }[] = [];
  try {
    const db = await getDB();
    if (db) posts = (await db.prepare("SELECT slug, updated_at FROM posts WHERE status = 'published'").all<{ slug: string; updated_at: string }>()).results;
  } catch {
    /* database unavailable — static pages only */
  }
  return [
    // Every URL from the live site's sitemap, with its lastmod / changefreq / priority.
    ...live.map((u) => ({
      url: `${SITE.url}${u.path === "/" ? "/" : u.path}`,
      lastModified: u.lastmod,
      changeFrequency: u.changefreq as Freq,
      priority: u.priority,
    })),
    // Pages written for this site (kept out of sitemap.json, which a live-site re-sync overwrites).
    { url: `${SITE.url}/quality-checklist`, lastModified: QUALITY_CHECKLIST_PUBLISHED, changeFrequency: "monthly" as const, priority: 0.7 },
    // Articles published from the dashboard.
    ...posts.map((p) => ({ url: `${SITE.url}/journal/${p.slug}`, lastModified: p.updated_at, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
