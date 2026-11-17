// Clones every page of the live site (https://ecoverdevaleting.co.uk) into this app:
//   1. downloads sitemap.xml, every page in it, the stylesheet, main.js and every referenced asset
//      into .clone-cache/ (git-ignored), and copies images/fonts to public/assets/
//   2. writes src/content/clone/{pages,sitemap,reviews}.json — each page's <main> body plus its
//      <head> SEO (title, description, keywords, canonical, Open Graph, Twitter, JSON-LD)
//   3. writes src/app/clone.css — the live stylesheet scoped to .lv so it cannot affect the
//      app's own header and footer
// The live header, footer and quote modal are NOT cloned; the app keeps its own.
//
// Usage: node scripts/clone-live-site.mjs            (needs network access to the live site)
//        node scripts/clone-live-site.mjs --offline  (re-run the conversion on .clone-cache only)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import postcss from "postcss";
import sharp from "sharp";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIVE = path.join(REPO, ".clone-cache");
const ORIGIN = "https://ecoverdevaleting.co.uk";

async function get(url, file) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

if (!process.argv.includes("--offline")) {
  fs.mkdirSync(path.join(LIVE, "html"), { recursive: true });
  await get(`${ORIGIN}/sitemap.xml`, path.join(LIVE, "sitemap.xml"));
  const urls = [...fs.readFileSync(path.join(LIVE, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  fs.writeFileSync(path.join(LIVE, "urls.txt"), urls.join("\n") + "\n");
  for (const u of urls) {
    const slug = u.replace(ORIGIN + "/", "") || "index";
    await get(u, path.join(LIVE, "html", slug + ".html"));
    process.stdout.write(".");
  }
  console.log(`\n${urls.length} pages`);
  for (const p of ["assets/css/style.css", "assets/js/main.js"]) await get(`${ORIGIN}/${p}`, path.join(LIVE, "site", p));
  const text = [
    ...fs.readdirSync(path.join(LIVE, "html")).map((f) => fs.readFileSync(path.join(LIVE, "html", f), "utf8")),
    fs.readFileSync(path.join(LIVE, "site/assets/css/style.css"), "utf8").replace(/\.\.\/(fonts|img)\//g, "assets/$1/"),
  ].join("\n");
  const assets = [...new Set([...text.matchAll(/assets\/img\/[\w./-]+/g)].map((m) => m[0]))];
  for (const a of assets) {
    const dest = path.join(REPO, "public", a);
    if (fs.existsSync(dest)) continue;
    try {
      await get(`${ORIGIN}/${a}`, dest);
    } catch (e) {
      console.warn("asset failed:", e.message);
    }
  }
  console.log(`${assets.length} assets checked`);
}

const LIVE_ORIGIN = ORIGIN;
const slugs = fs
  .readFileSync(path.join(LIVE, "urls.txt"), "utf8")
  .trim()
  .split("\n")
  .map((u) => u.replace(LIVE_ORIGIN + "/", ""));
const slugSet = new Set(slugs);

// Reviews the live main.js injects into the review marquee (filled client-side by CloneEnhancer).
const mainJs = fs.readFileSync(path.join(LIVE, "site/assets/js/main.js"), "utf8");
const REVIEWS = [...mainJs.match(/var REVIEWS = \[([\s\S]*?)\n  \];/)[1].matchAll(/\{ n: '([^']*)', d: '([^']*)', t: "([^"]*)" \}/g)].map(
  ([, n, d, t]) => ({ n, d, t }),
);
if (REVIEWS.length < 10) throw new Error("could not read the review list from main.js");
const GICON = mainJs.match(/var GICON = '([^']*)';/)[1];
const toAbsAsset = (v) => v.replace(/(^|[\s,(])(\.\/)?assets\//g, "$1/assets/");
const fixHref = (v) => {
  if (!v) return v;
  if (/^(https?:|tel:|mailto:|#|\/|data:|javascript:|sms:)/i.test(v)) {
    if (v.startsWith(LIVE_ORIGIN)) return v.slice(LIVE_ORIGIN.length) || "/";
    return v;
  }
  if (/^(\.\/)?assets\//.test(v)) return toAbsAsset(v);
  const m = v.match(/^([^#?]*)(.*)$/);
  let p = m[1].replace(/^\.\//, "").replace(/\.(html|php)$/, "");
  if (p === "index" || p === "") return "/" + m[2];
  if (!slugSet.has(p)) console.warn("unknown internal link:", v);
  return "/" + p + m[2];
};
const toPath = (u) => (u && u.startsWith(LIVE_ORIGIN) ? u.slice(LIVE_ORIGIN.length) || "/" : u);

const sizeCache = new Map();
async function imageSize(file) {
  if (!sizeCache.has(file)) {
    sizeCache.set(file, fs.existsSync(file) ? await sharp(file).metadata().then((m) => ({ width: m.width, height: m.height })) : null);
  }
  return sizeCache.get(file);
}

// Writes public/assets/img/opt/<name>-<w>.webp for each width smaller than the original and returns a
// srcset, or null when the image is already small. Existing files are reused.
const variantCache = new Map();
async function responsiveVariants(src, widths, quality) {
  const key = src + widths.join();
  if (variantCache.has(key)) return variantCache.get(key);
  const file = path.join(REPO, "public", src);
  const size = await imageSize(file);
  let result = null;
  if (size && size.width > widths[0]) {
    const base = path.basename(src).replace(/\.[a-z0-9]+$/i, "");
    const dir = path.dirname(src).replace(/^\/assets\/img/, "");
    const entries = [];
    // Non-WebP originals (JPG/PNG) also get a full-width WebP copy, so no browser downloads the JPG.
    const list = widths.filter((w) => w < size.width);
    const isWebp = /\.webp$/i.test(src);
    if (!isWebp) list.push(size.width);
    for (const w of list) {
      const rel = `/assets/img/opt${dir}/${base}-${w}.webp`;
      const out = path.join(REPO, "public", rel);
      if (!fs.existsSync(out)) {
        fs.mkdirSync(path.dirname(out), { recursive: true });
        await sharp(file).resize({ width: w }).webp({ quality, effort: 6 }).toFile(out);
      }
      entries.push(`${rel} ${w}w`);
    }
    if (isWebp) entries.push(`${src} ${size.width}w`);
    result = entries.join(", ");
  }
  variantCache.set(key, result);
  return result;
}

const pages = {};
for (const slug of slugs) {
  const file = path.join(LIVE, "html", (slug || "index") + ".html");
  const $ = cheerio.load(fs.readFileSync(file, "utf8"), { decodeEntities: false });
  const meta = (sel) => $(sel).attr("content");
  const head = {
    title: $("head > title").first().text().trim(),
    description: meta('meta[name="description"]'),
    keywords: meta('meta[name="keywords"]'),
    canonical: toPath($('link[rel="canonical"]').attr("href")),
    og: {},
    twitter: {},
  };
  $('meta[property^="og:"]').each((_, el) => (head.og[$(el).attr("property").slice(3)] = $(el).attr("content")));
  $('meta[name^="twitter:"]').each((_, el) => (head.twitter[$(el).attr("name").slice(8)] = $(el).attr("content")));
  const jsonLd = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).html().trim();
    JSON.parse(raw); // must be valid
    jsonLd.push(JSON.stringify(JSON.parse(raw)));
  });

  const mains = $("main");
  if (mains.length !== 1) throw new Error(`${slug}: ${mains.length} <main>`);
  const main = mains.first();

  // strip comments
  main.find("*").addBack().contents().filter((_, n) => n.type === "comment").remove();
  // links + assets
  main.find("[href]").each((_, el) => $(el).attr("href", fixHref($(el).attr("href"))));
  main.find("[data-inc-page]").each((_, el) => $(el).attr("data-inc-page", fixHref($(el).attr("data-inc-page"))));
  for (const a of ["src", "data-src", "poster"]) main.find(`[${a}]`).each((_, el) => $(el).attr(a, toAbsAsset($(el).attr(a))));
  for (const a of ["srcset", "data-srcset", "imagesrcset"]) main.find(`[${a}]`).each((_, el) => $(el).attr(a, toAbsAsset($(el).attr(a))));
  // width/height on every local image so the browser reserves its space (no layout shift)
  for (const el of main.find("img[src^='/assets/']").toArray()) {
    if ($(el).attr("width") && $(el).attr("height")) continue;
    const size = await imageSize(path.join(REPO, "public", $(el).attr("src")));
    if (size) $(el).attr("width", String(size.width)).attr("height", String(size.height));
  }
  // Responsive, compressed WebP copies for large images that have no srcset. The original file stays
  // as src (same URL as the live site); browsers pick the smallest copy that fits.
  for (const el of main.find("img[src^='/assets/']:not([srcset])").toArray()) {
    const src = $(el).attr("src");
    const isBackdrop = $(el).closest(".page-hero-bg, .imgband-bg, .hero-bg").length > 0;
    const variants = await responsiveVariants(src, isBackdrop ? [640, 760, 960, 1440] : [480, 640, 800, 1200], isBackdrop ? 38 : 64);
    if (!variants) continue;
    $(el).attr("srcset", variants).attr("sizes", isBackdrop ? "100vw" : "(max-width: 640px) calc(100vw - 40px), 50vw");
  }
  // Above the fold: the first content image in the first two sections (often the LCP element on
  // phones) loads straight away with high priority instead of waiting for lazy-load.
  const firstImg = main
    .children("section")
    .slice(0, 2)
    .find("img")
    .toArray()
    .find((el) => !$(el).closest(".page-hero-bg, .imgband-bg, .hero-bg").length);
  if (firstImg) $(firstImg).removeAttr("loading").attr("fetchpriority", "high");
  main.find("[style]").each((_, el) => $(el).attr("style", $(el).attr("style").replace(/url\((['"]?)(\.\/)?assets\//g, "url($1/assets/")));
  // the repo's quote pop-up is <dialog id="quote">; keep ids unique
  main.find("#quote").attr("id", "quote-cta");
  // the app footer links to /#how; the live section is #process
  if (slug === "") main.find("#process").before('<span id="how" aria-hidden="true"></span>');
  // the review marquee is filled client-side from src/content/clone/reviews (as on the live site)

  let html = main.html().trim().replace(/\n\s*\n+/g, "\n");
  if (/\bassets\//.test(html.replace(/\/assets\//g, ""))) console.warn(slug, "has unrewritten asset path");
  pages[slug] = { ...head, jsonLd, html };
}

const outDir = path.join(REPO, "src/content/clone");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "pages.json"), JSON.stringify(pages));
const sm = fs.readFileSync(path.join(LIVE, "sitemap.xml"), "utf8");
const sitemap = [...sm.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
  const g = (t) => (m[1].match(new RegExp(`<${t}>([^<]*)</${t}>`)) || [])[1];
  return { path: toPath(g("loc")), lastmod: g("lastmod"), changefreq: g("changefreq"), priority: Number(g("priority")) };
});
fs.writeFileSync(path.join(outDir, "sitemap.json"), JSON.stringify(sitemap, null, 1));
fs.writeFileSync(path.join(outDir, "reviews.json"), JSON.stringify({ reviews: REVIEWS, gicon: GICON }));
console.log("pages:", Object.keys(pages).length, "bytes:", fs.statSync(path.join(outDir, "pages.json")).size);

// ---------- CSS: scope the live stylesheet to .lv so it cannot touch the Next.js header/footer ----------
const css = fs.readFileSync(path.join(LIVE, "site/assets/css/style.css"), "utf8");
const root = postcss.parse(css);
const kf = new Set();
root.walkAtRules("keyframes", (r) => {
  kf.add(r.params);
  r.params = "lv-" + r.params;
});
root.walkDecls(/^(animation|animation-name)$/, (d) => {
  d.value = d.value.replace(/[A-Za-z_][\w-]*/g, (w) => (kf.has(w) ? "lv-" + w : w));
});
root.walkDecls((d) => {
  if (d.value.includes("../fonts/")) d.value = d.value.replace(/\.\.\/fonts\//g, "/assets/fonts/");
  if (d.value.includes("../img/")) d.value = d.value.replace(/\.\.\/img\//g, "/assets/img/");
});
// Next's CSS minifier keeps only the -webkit- form when both are present, which Chromium ignores;
// keep the standard property and let the build add any prefixes it needs.
root.walkDecls("-webkit-backdrop-filter", (d) => {
  if (d.parent.some((x) => x.type === "decl" && x.prop === "backdrop-filter")) d.remove();
  else d.prop = "backdrop-filter";
});
// Live CSS references custom properties it never defines (so they resolve to nothing there);
// the app defines some of the same names globally, so reset them inside .lv.
const defined = new Set(), used = new Set();
root.walkDecls((d) => {
  if (d.prop.startsWith("--")) defined.add(d.prop);
  for (const m of d.value.matchAll(/var\((--[\w-]+)/g)) used.add(m[1]);
});
const undefinedVars = [...used].filter((v) => !defined.has(v));
// Fonts: the live site uses the same families (Fraunces, Hanken Grotesk) as the app, so point the
// cloned CSS at the app's self-hosted next/font files instead of downloading a second copy.
root.walkAtRules("font-face", (r) => r.remove());
root.walkDecls((d) => {
  d.value = d.value
    .replace(/(['"])Fraunces\1/g, "var(--font-fraunces)")
    .replace(/(['"])Hanken Grotesk\1/g, "var(--font-hanken)");
});
const scopeSel = (s) => {
  s = s.trim();
  if (/^html\b/.test(s)) return null;
  if (/^body\.(nav-open|modal-open)\b/.test(s)) return null;
  if (s === ":root" || s === "body") return ".lv";
  if (/^body::?(before|after)$/.test(s)) return ".lv" + s.slice(4);
  if (/^body\b/.test(s)) return ".lv" + s.slice(4);
  return ".lv " + s;
};
root.walkRules((rule) => {
  if (rule.parent && rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
  const sels = rule.selectors.map(scopeSel).filter(Boolean);
  if (!sels.length) rule.remove();
  else rule.selectors = sels;
});
// Adjustments so the live page bodies sit correctly inside the app's chrome:
// - the live header is sticky (94px in flow) and heroes pull up under it with margin-top:-94px;
//   the app header is fixed (out of flow), so the heroes start at the top already.
// - the live body inherits the browser's 16px; the app's body is 15px.
// - content in the first two sections is visible straight away (no scroll-reveal fade), so the first
//   screen does not wait for JavaScript.
// - images now carry width/height attributes (no layout shift); keep their aspect ratio when CSS
//   narrows them (rules that set an explicit height are more specific and still win).
const overrides = `
.lv{font-size:16px${undefinedVars.map((v) => `;${v}:initial`).join("")}}
.lv .hero,.lv .page-hero{margin-top:0}
.lv img{height:auto}
.lv > section:nth-of-type(-n+2) .reveal{opacity:1;transform:none;transition:none}
`;
// Drop rules that cannot match anything: every class/id they need must appear in some cloned page
// (or be one CloneEnhancer adds at runtime). Keeps the render-blocking stylesheet small.
const present = new Set([
  // added by src/components/CloneEnhancer.tsx at runtime
  "in", "open", "bookable", "rcard", "rc-top", "av", "who", "stars", "gicon", "ti-placeholder",
  "modal", "inc-modal", "modal-backdrop", "modal-card", "modal-x", "modal-body", "modal-head", "eyebrow",
  "inc-content", "inc-actions", "btn", "btn-primary", "btn-ghost", "inc-fullpage", "inc-quote",
  "lv", "lv-home", "lv-inner", "#incModal", "#incTitle", "#incContent", "#lv-root",
]);
for (const p of Object.values(pages)) {
  for (const m of p.html.matchAll(/class="([^"]*)"/g)) m[1].split(/\s+/).forEach((c) => c && present.add(c));
  for (const m of p.html.matchAll(/id="([^"]*)"/g)) present.add("#" + m[1]);
}
const canMatch = (sel) => {
  const bare = sel.replace(/:(not|where|is|has)\((?:[^()]|\([^()]*\))*\)/g, "");
  for (const m of bare.matchAll(/([.#])(-?[_a-zA-Z][\w-]*)/g)) {
    if (!present.has(m[1] === "." ? m[2] : "#" + m[2])) return false;
  }
  return true;
};
let dropped = 0;
root.walkRules((rule) => {
  if (rule.parent?.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
  const keep = rule.selectors.filter(canMatch);
  dropped += rule.selectors.length - keep.length;
  if (!keep.length) rule.remove();
  else rule.selectors = keep;
});
root.walkAtRules((r) => {
  if (r.nodes && r.nodes.length === 0) r.remove();
});
console.log("unused selectors dropped:", dropped);

const cssOut =
  "/* Generated by scripts/clone-live-site.mjs from the live ecoverdevaleting.co.uk stylesheet, scoped to .lv (page content only). Do not edit by hand. */\n" +
  root.toResult().css + overrides;
fs.writeFileSync(path.join(REPO, "src/app/clone.css"), cssOut);
console.log("undefined vars reset:", undefinedVars.join(" "));
console.log("css bytes:", cssOut.length, "keyframes:", [...kf].join(","));
