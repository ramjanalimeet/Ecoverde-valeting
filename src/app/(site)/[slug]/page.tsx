import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClonePage from "@/components/ClonePage";
import { CLONE_SLUGS, cloneMetadata, getClonePage } from "@/lib/clone";
import { SITE, locationPhone, waNumber } from "@/data/site";

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
  const path = `/${slug}`;
  // Location pages: every call/WhatsApp link in the body goes to that location's own number.
  const local = locationPhone(path);
  const html = local ? localiseContacts(page.html, local.tel) : page.html;
  return <ClonePage page={page} path={path} html={html} />;
}

/** Point any other base's tel:/wa.me links at this location's number (display text already matches). */
function localiseContacts(html: string, tel: string) {
  const digits = tel.replace(/\D/g, "");
  return SITE.phones
    .filter((p) => p.tel !== tel)
    .reduce((h, p) => {
      const other = waNumber(p);
      return h.replaceAll(`wa.me/${other}`, `wa.me/${digits}`).replaceAll(`tel:${p.tel}`, `tel:${tel}`);
    }, html);
}
