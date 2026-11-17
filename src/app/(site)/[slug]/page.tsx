import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClonePage from "@/components/ClonePage";
import { CLONE_SLUGS, cloneMetadata, getClonePage } from "@/lib/clone";

// Every page from the live site, at the same root-level URL. Anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return CLONE_SLUGS.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getClonePage((await params).slug);
  return page ? cloneMetadata(page) : {};
}

export default async function LivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getClonePage(slug);
  if (!page) notFound();
  return <ClonePage page={page} path={`/${slug}`} />;
}
