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

const PAGES = pages as Record<string, ClonePage>;

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
