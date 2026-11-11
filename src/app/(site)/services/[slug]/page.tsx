import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageView } from "@/components/PageTemplates";
import { SERVICE_PAGES, getServicePage } from "@/data/pages";
import { SITE } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};
  return {
    title: `${page.name} West London`,
    description: page.intro.slice(0, 158),
    alternates: { canonical: `/services/${page.slug}` },
    openGraph: { title: `${page.name} West London | ${SITE.name}`, description: page.intro.slice(0, 158), images: [{ url: page.hero }] },
  };
}

export default async function ServiceRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.name,
    description: page.intro,
    areaServed: "West London",
    provider: { "@type": "AutoWash", name: SITE.legalName, url: SITE.url, telephone: SITE.phones[0].tel },
  };
  return (
    <>
      <ServicePageView page={page} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
