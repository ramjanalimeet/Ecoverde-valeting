import { preload } from "react-dom";
import type { ClonePage as Page } from "@/lib/clone";
import CloneEnhancer from "./CloneEnhancer";

const FONTS = ["/assets/fonts/hanken-latin.woff2", "/assets/fonts/fraunces-latin.woff2", "/assets/fonts/fraunces-italic-latin.woff2"];

/** Renders a page cloned from the live site inside the app's own header/footer. */
export default function ClonePage({ page, path }: { page: Page; path: string }) {
  // Same preload hints as the live pages (fonts everywhere, hero photo on the homepage).
  FONTS.forEach((href) => preload(href, { as: "font", type: "font/woff2", crossOrigin: "" }));
  if (path === "/") {
    preload("/assets/img/hero-clear.webp", {
      as: "image",
      fetchPriority: "high",
      imageSrcSet: "/assets/img/hero-clear-480.webp 480w, /assets/img/hero-clear-828.webp 828w, /assets/img/hero-clear.webp 1440w",
      imageSizes: "100vw",
    });
  }
  return (
    <>
      <div className="lv" id="lv-root" dangerouslySetInnerHTML={{ __html: page.html }} />
      <CloneEnhancer key={path} />
      {page.jsonLd.map((json, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }} />
      ))}
    </>
  );
}
