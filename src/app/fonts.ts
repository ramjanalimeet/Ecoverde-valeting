import localFont from "next/font/local";

// Self-hosted, preloaded, with size-adjusted fallbacks (no text jump on load).
export const hanken = localFont({
  src: "../fonts/hanken-grotesk-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-hanken",
  adjustFontFallback: "Arial",
});

export const fraunces = localFont({
  src: [
    { path: "../fonts/fraunces-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../fonts/fraunces-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-fraunces",
  adjustFontFallback: "Times New Roman",
});
