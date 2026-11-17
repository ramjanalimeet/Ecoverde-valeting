import { preload } from "react-dom";
import type { ClonePage as Page } from "@/lib/clone";
import CloneEnhancer from "./CloneEnhancer";

const FONTS = ["/assets/fonts/hanken-latin.woff2", "/assets/fonts/fraunces-latin.woff2", "/assets/fonts/fraunces-italic-latin.woff2"];

/** Renders a page cloned from the live site inside the app's own header/footer. */
export default function ClonePage({ page, path, html = page.html }: { page: Page; path: string; html?: string }) {
  // Same font preload hints as the live pages.
  FONTS.forEach((href) => preload(href, { as: "font", type: "font/woff2", crossOrigin: "" }));
  return (
    <>
      <div className="lv" id="lv-root" dangerouslySetInnerHTML={{ __html: html }} />
      <CloneEnhancer key={path} />
      {page.jsonLd.map((json, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }} />
      ))}
    </>
  );
}
