import type { Metadata } from "next";
import ClonePage from "@/components/ClonePage";
import { Hero } from "@/components/Sections";
import { cloneMetadata, getClonePage } from "@/lib/clone";

const page = getClonePage("")!;

// The app's own hero (feature list on the left, glass card on the right) replaces the live hero;
// everything below it is the cloned live homepage. Same H1 text as the live page.
const HERO_RE = /^\s*<section class="hero hero-clear"[\s\S]*?<\/section>/;
if (!HERO_RE.test(page.html)) throw new Error("Live homepage hero not found — check src/app/(site)/page.tsx");
const body = page.html.replace(HERO_RE, "");

export const metadata: Metadata = cloneMetadata(page);

export default function Home() {
  return (
    <>
      <Hero />
      <ClonePage page={page} path="/" html={body} />
    </>
  );
}
