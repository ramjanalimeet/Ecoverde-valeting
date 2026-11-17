import type { Metadata } from "next";
import pages from "@/content/clone/pages.json";

/**
 * Pages cloned from the live ecoverdevaleting.co.uk site: same URL, same <head> SEO
 * (title, description, canonical, Open Graph, Twitter, JSON-LD) and the same page body.
 * Regenerate with `node scripts/clone-live-site.mjs` (see README).
 */
export type ClonePage = {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  og: Record<string, string>;
  twitter: Record<string, string>;
  jsonLd: string[];
  html: string;
};

/**
 * Accessibility: some live pages skip heading levels (e.g. an <h4> card title straight after an <h2>).
 * Keep the tags (the live CSS styles them by tag) and give skipped headings the correct aria-level.
 * Every page body follows an <h1> (the page or homepage hero), so the outline starts at level 1.
 */
function fixHeadingOrder(html: string): string {
  let prevTag = 1; // tag level of the previous heading
  let prevEff = 1; // its effective (announced) level
  return html.replace(/<h([1-6])(\s[^>]*)?>/g, (tag, lvl: string, attrs = "") => {
    const level = Number(lvl);
    let eff: number;
    if (level === prevTag) eff = prevEff; // sibling of the previous heading
    else if (level > prevTag) eff = Math.min(level, prevEff + 1); // one level deeper at most
    else eff = Math.min(level, prevEff); // back up the outline
    prevTag = level;
    prevEff = eff;
    return eff === level ? tag : `<h${level}${attrs} aria-level="${eff}">`;
  });
}

const PAGES = Object.fromEntries(
  Object.entries(pages as Record<string, ClonePage>).map(([slug, p]) => [slug, { ...p, html: fixHeadingOrder(p.html) }]),
);

/** Slug without leading slash; "" is the homepage. */
export const CLONE_SLUGS = Object.keys(PAGES);

export const getClonePage = (slug: string): ClonePage | undefined =>
  Object.prototype.hasOwnProperty.call(PAGES, slug) ? PAGES[slug] : undefined;

const LIVE = "https://ecoverdevaleting.co.uk";
/** Absolute live URLs become root-relative so they resolve against metadataBase (SITE.url). */
const rel = (u?: string) => (u && u.startsWith(LIVE) ? u.slice(LIVE.length) || "/" : u);

export function cloneMetadata(page: ClonePage): Metadata {
  const { og, twitter } = page;
  const image = og.image
    ? [
        {
          url: rel(og.image)!,
          ...(og["image:width"] ? { width: Number(og["image:width"]) } : {}),
          ...(og["image:height"] ? { height: Number(og["image:height"]) } : {}),
          ...(og["image:alt"] ? { alt: og["image:alt"] } : {}),
          ...(og["image:type"] ? { type: og["image:type"] } : {}),
        },
      ]
    : undefined;
  return {
    title: { absolute: page.title },
    description: page.description,
    ...(page.keywords ? { keywords: page.keywords } : {}),
    alternates: { canonical: rel(page.canonical) },
    openGraph: {
      type: (og.type as "website" | "article") || "website",
      title: og.title,
      description: og.description,
      url: rel(og.url),
      siteName: og.site_name,
      locale: "en_GB",
      images: image,
    },
    twitter: {
      card: (twitter.card as "summary_large_image") || "summary_large_image",
      ...(twitter.title ? { title: twitter.title } : {}),
      ...(twitter.description ? { description: twitter.description } : {}),
      ...(twitter.image
        ? { images: [{ url: rel(twitter.image)!, ...(twitter["image:alt"] ? { alt: twitter["image:alt"] } : {}) }] }
        : {}),
    },
  };
}
