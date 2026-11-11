import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AreaPageView } from "@/components/PageTemplates";
import { ALL_AREAS } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_AREAS.map((a) => ({ slug: a.slug }));
}

const find = (slug: string) => ALL_AREAS.find((a) => a.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const area = find(slug);
  if (!area) return {};
  return {
    title: `Mobile Car Valeting ${area.name}${area.isBase ? ` ${area.base.postcode}` : ""}`,
    description: `Eco-friendly mobile car valeting and detailing in ${area.name}. We come to your home or office from our ${area.base.name} base, 7 days a week. Get a free quote.`,
    alternates: { canonical: `/areas/${area.slug}` },
  };
}

export default async function AreaRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = find(slug);
  if (!area) notFound();
  return <AreaPageView area={area} />;
}
