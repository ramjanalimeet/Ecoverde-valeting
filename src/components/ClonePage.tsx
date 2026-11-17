import type { ClonePage as Page } from "@/lib/clone";
import CloneEnhancer from "./CloneEnhancer";

/** Renders a page cloned from the live site inside the app's own header/footer. */
export default function ClonePage({ page, path, html = page.html }: { page: Page; path: string; html?: string }) {
  // One wrapper element per page: Next.js scrolls the first element of a new page into view, and a
  // single top-level node keeps that unambiguous (no landing half-way down after navigation).
  return (
    <div className="clone-page">
      <div className={`lv ${path === "/" ? "lv-home" : "lv-inner"}`} id="lv-root" dangerouslySetInnerHTML={{ __html: html }} />
      <CloneEnhancer key={path} />
      {page.jsonLd.map((json, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }} />
      ))}
    </div>
  );
}
