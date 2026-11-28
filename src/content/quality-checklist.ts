import type { ClonePage } from "@/lib/clone";

/**
 * /quality-checklist — standalone page (not a blog post). Copy is from the owner's brief
 * "Ecoverde-Quality-Checklist-Page" (Part 2), unchanged. The FAQ answers in the JSON-LD below
 * must match the visible "Questions about quality" answers word for word.
 * Reviews use the live Trustindex widget only: no review or rating schema on this page.
 */

export const QUALITY_CHECKLIST_PUBLISHED = "2026-11-28";
const UPDATED_LABEL = "28 November 2026";

const BASE = "https://ecoverdevaleting.co.uk";
const URL = `${BASE}/quality-checklist`;
const TITLE = "Our Quality Checklist | Mobile Car Valeting | Ecoverde";
const DESCRIPTION =
  "See the checklist every car is signed off against before I leave. Mobile car valeting & detailing in West London. Anything missed? I come back and fix it.";
const H1 = "Our Quality Checklist: How Every Car Is Signed Off";

const FAQ: { q: string; a: string; html?: string }[] = [
  {
    q: "What happens if you miss something?",
    a: "Tell me during the walk-round and I'll fix it before I leave. If you spot it later, message me within 7 days with a photo and I'll come back and put it right, free of charge.",
  },
  {
    q: "Do you give refunds?",
    a: "I'd always rather come back and fix a problem than refund. Once we've checked the car together and you're happy, the job is complete, because a car can get dirty again straight away. Full details are in my Refund Policy.",
    html: "I'd always rather come back and fix a problem than refund. Once we've checked the car together and you're happy, the job is complete, because a car can get dirty again straight away. Full details are in my <a href=\"/refund-policy\">Refund Policy</a>.",
  },
  {
    q: "Who checks my car?",
    a: "I do. I'm John, the owner, and I do the valet and the sign-off myself.",
  },
  {
    q: "Do you point out damage before you start?",
    a: "Yes. We look round the car together before I start, and I point out existing scratches, chips, dents and stains, so you know what to expect.",
  },
  {
    q: "Is the same checklist used for every car?",
    a: "Yes. Every full valet is checked against the same list, whatever the car. Specialist jobs like lease returns and ceramic coatings get extra checks on top.",
  },
  {
    q: "What areas do you cover?",
    a: "I cover West London from bases in Brentford (TW8) and Ladbroke Grove (W10), including Chiswick, Ealing, Kew, Richmond, Hammersmith, Notting Hill, Kensington and Chelsea.",
  },
];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const ARROW =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>';

/** Responsive <picture> for a photo with pre-built size variants in /assets/img/opt (+ avif). */
function picture(
  name: string,
  ext: string,
  w: number,
  h: number,
  widths: number[],
  alt: string,
  sizes: string,
  extra = 'loading="lazy" decoding="async"',
) {
  const avif = widths.map((x) => `/assets/img/avif/opt/${name}-${x}.avif ${x}w`).join(", ");
  const webp = widths.map((x) => `/assets/img/opt/${name}-${x}.webp ${x}w`).join(", ");
  return `<picture><source type="image/avif" srcset="${avif}" sizes="${sizes}"><img src="/assets/img/${name}.${ext}" alt="${esc(alt)}" width="${w}" height="${h}" srcset="${webp}" sizes="${sizes}" ${extra}></picture>`;
}

/** Single-file photo from the /images library. */
const img = (file: string, w: number, h: number, alt: string) =>
  `<img src="/images/${file}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async">`;

const ticks = (items: string[]) => `<ul class="ticklist">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

function card(title: string, items: string[], opts: { photo?: string; after?: string } = {}) {
  return `<article class="qc-card reveal">${opts.photo ? `<div class="qc-card-img">${opts.photo}</div>` : ""}<div class="qc-card-body"><h3>${title}</h3>${ticks(items)}${opts.after ?? ""}</div></article>`;
}

const html = `<section class="page-hero"><div class="page-hero-bg">${picture(
  "work-2",
  "webp",
  1600,
  719,
  [640, 760, 960, 1200, 1440],
  "Land Rover Defender covered in snow foam during an Ecoverde mobile valet on a driveway",
  "100vw",
  'fetchpriority="high"',
)}</div><div class="wrap">
  <div class="breadcrumb"><a href="/">Home</a><span>/</span>Quality Checklist</div>
  <span class="eyebrow">Our Standards</span>
  <h1>${esc(H1)}</h1>
  <p class="qc-answer">Every Ecoverde valet ends the same way. I check the car against this list, then walk round it with you before I leave. If you spot anything I've missed, I put it right there and then. If you notice something later, tell me within 7 days and I'll come back and fix it free of charge.</p>
</div></section>

<section class="block"><div class="wrap"><div class="split">
  <div class="split-media">${picture(
    "john-view",
    "jpg",
    1200,
    900,
    [480, 640, 800, 1200],
    "John Muriel, owner of Ecoverde Valeting, standing beside his branded Ecoverde van on a West London street",
    "(max-width: 640px) calc(100vw - 40px), 50vw",
  )}</div>
  <div>
    <p class="lead reveal">I'm John, and I run Ecoverde Valeting, an eco-friendly mobile car valeting and detailing service in West London, with bases in Brentford (TW8) and Ladbroke Grove (W10). I do the work myself, so the person who cleans your car is the person who signs it off.</p>
    <p class="lead reveal d1" style="margin-top:14px">I've published this checklist because I think you should know exactly what you're paying for. It's also how I keep my standards the same on the 600th car as on the first.</p>
  </div>
</div></div></section>

<section class="block band-paper" id="sign-off"><div class="wrap"><div class="split flip">
  <div class="split-media">${img(
    "snow-foam-valet-brentford.webp",
    800,
    467,
    "Eco-friendly snow foam being sprayed over a car during a mobile valet in Brentford",
  )}</div>
  <div>
    <h2 class="title reveal">How the sign-off works</h2>
    <ol class="steplist reveal d1">
      <li><span class="stepn">1</span><div><b>Before I start.</b><p>We have a quick look round the car together. I point out any existing scratches, stone chips, dents, worn seats or stains that won't come out fully, so there are no surprises later.</p></div></li>
      <li><span class="stepn">2</span><div><b>During the valet.</b><p>I work through the car in the same order every time, using low-water methods and biodegradable products.</p></div></li>
      <li><span class="stepn">3</span><div><b>My own check.</b><p>When I've finished, I go back over the car with the checklist below, in good light, and redo anything that isn't right.</p></div></li>
      <li><span class="stepn">4</span><div><b>Walk-round with you.</b><p>I show you the finished car. If anything isn't right, I sort it before I leave.</p></div></li>
      <li><span class="stepn">5</span><div><b>7-day put-it-right promise.</b><p>If you notice something I've missed after I've gone, message me within 7 days with a photo and I'll come back and fix it, free.</p></div></li>
    </ol>
  </div>
</div></div></section>

<section class="block" id="checklist"><div class="wrap">
  <div class="section-head reveal" style="margin-bottom:30px"><h2 class="title">The checklist</h2><p class="lead">These are the checks I make on a full valet. Exterior-only and interior-only valets use the matching sections.</p></div>
  <div class="qc-grid">
    ${card(
      "Exterior paintwork",
      [
        "Bodywork washed and rinsed, including lower panels, bumpers and behind the number plates",
        "No dirt, bird droppings, bug marks or tar spots left on the paint",
        "Badges, grilles and emblems cleaned around the edges",
        "Exterior plastic and rubber trim clean, with no white polish marks left behind",
        "Car dried fully, with no water spots or streaks",
        "Protection (wax or sealant) applied evenly, with no smears or residue, where included in your package",
      ],
      { photo: img("hand-wash-mini-full-valet.webp", 800, 534, "Hand-washing the paintwork of a black car with a wash mitt during a mobile valet") },
    )}
    ${card(
      "Wheels and tyres",
      [
        "Wheel faces cleaned and brake dust removed, including around the wheel nuts and centre caps",
        "Wheel arches rinsed clean",
        "Tyres cleaned and dressed evenly, with no sling on the paint",
      ],
      {
        photo: img("menu-alloy-wheel-restoration.webp", 440, 308, "Gloved hands cleaning the face of a multi-spoke alloy wheel"),
        after:
          '<p class="qc-addon"><b>Add-on:</b> deep cleaning the inner barrels (the inside of the wheel, behind the spokes) is available as an extra, at your request. Just ask when you book.</p>',
      },
    )}
    ${card("Glass and mirrors", [
      "Windscreen and all windows clean inside and out, with no streaks or haze",
      "Top edges of the windows cleaned (the strip that hides when the window is up)",
      "Wing mirrors and rear-view mirror clean",
      "Wiper blades wiped",
    ])}
    ${card("Door shuts, sills and openings", [
      "Door shuts and hinges wiped clean on every door",
      "Sills and kick plates clean",
      "Fuel filler flap and cap area cleaned",
      "Boot shut and bonnet edges wiped",
    ])}
    ${card(
      "Interior",
      [
        "Carpets and mats vacuumed, including under the seats and the seat runners",
        "Seats vacuumed, with seams and gaps cleaned; leather cleaned and conditioned where included",
        "Dashboard, centre console, steering wheel and gear lever cleaned and dust-free",
        "Air vents, buttons and switches cleaned with a soft brush",
        "Door cards, door pockets and handles cleaned",
        "Cup holders, storage trays and glovebox (outside) cleaned",
        "Seat belts checked for marks and wiped",
        "Pedals and foot area cleaned",
        "Interior glass and screens cleaned with the right product (no smears on touchscreens)",
        "Car smells fresh, with no product left on surfaces",
      ],
      { photo: img("interior-deep-clean-steering-wheel.webp", 800, 534, "Cleaning the steering wheel and dashboard during an interior valet") },
    )}
    ${card("Boot", [
      "Boot carpet and side panels vacuumed",
      "Boot floor and lip wiped",
      "Spare wheel area cleaned where it can be reached, if included in your package",
    ])}
    ${card(
      "Final check",
      [
        "Seats, mirrors and steering wheel put back where you had them",
        "Your belongings returned to the car (I keep anything I find in a bag for you)",
        "No tools, cloths or products left in or on the car",
        "Car checked from all sides in good light",
        "Walk-round with you completed",
      ],
      { photo: img("porsche-taycan-valet-at-home.webp", 800, 450, "Red Porsche Taycan finished after a valet at the customer's home, with the Ecoverde van behind") },
    )}
  </div>
</div></section>

<section class="block band-paper" id="specialist"><div class="wrap">
  <div class="section-head reveal" style="margin-bottom:30px"><h2 class="title">Extra checks for specialist services</h2></div>
  <div class="qc-grid qc-grid--two">
    ${card("Lease return and pre-sale valets", [
      "Every panel checked for marks that a lease inspector or buyer would notice first",
      "Interior checked for stains, pet hair and odours, with any that can't be fully removed pointed out to you",
      "Before and after photos taken, which I can send you for your records",
    ])}
    ${card("Ceramic coating and paint protection", [
      "Paint fully cleaned and decontaminated before any protection goes on",
      "Coating or sealant applied evenly, with no high spots or smears",
      "Ceramic coatings only applied outdoors in the right weather (dry, still, and out of direct sun), or in your own garage",
      "Aftercare explained, including how long to wait before the first wash",
    ])}
  </div>
</div></section>

<section class="block" id="limits"><div class="wrap narrow">
  <h2 class="title reveal">What a valet can and can't fix</h2>
  <p class="reveal d1">I'd rather be honest up front. A valet makes a car as clean as it can be, but some things need a different service:</p>
  <ul class="qc-fixlist reveal d2">
    <li><b>Scratches and swirl marks:</b> light marks can often be improved with machine polishing or paint correction. Deep scratches through the paint need a repair.</li>
    <li><b>Stone chips and dents:</b> these need a bodywork repair. I can arrange this through my partner garage, with collection and return.</li>
    <li><b>Old stains and worn upholstery:</b> some stains are set in for good. I'll always tell you before I start if something won't come out fully.</li>
  </ul>
  <p class="qc-note reveal d3">If I can't get something right, I'll tell you before I start, not after.</p>
</div></section>

<section class="block band-paper" id="reviews"><div class="wrap">
  <div class="section-head center reveal" style="margin-bottom:26px"><h2 class="title">What my customers say</h2></div>
  <div id="ti-widget" class="ti-embed reveal d1" data-ti-widget="https://cdn.trustindex.io/loader.js?6effddf72c6e965f375f3be470">
    <noscript><a href="https://www.trustindex.io/reviews/www.ecoverdevaleting.co.uk" target="_blank" rel="noopener">Read all our reviews on Trustindex →</a></noscript>
  </div>
  <p class="qc-review-line reveal d2">Over 600 five-star reviews across Google, Checkatrade, Bark, Facebook and Yell.</p>
</div></section>

<section class="block" id="faq"><div class="wrap">
  <div class="section-head reveal" style="margin-bottom:30px"><h2 class="title">Questions about quality</h2></div>
  <div class="qc-faq">
    ${FAQ.map((f, i) => `<div class="qc-faq-item reveal${i % 2 ? " d1" : ""}"><h3>${esc(f.q)}</h3><p>${f.html ?? esc(f.a)}</p></div>`).join("\n    ")}
  </div>
</div></section>

<section class="block band-paper" id="book"><div class="wrap narrow qc-book">
  <h2 class="title reveal">Book your valet</h2>
  <p class="reveal d1">Book online, or call or WhatsApp me:</p>
  <ul class="qc-contact reveal d2">
    <li>Brentford (TW8) and West London: <a href="tel:+447495400369">07495 400369</a> (<a href="https://wa.me/447495400369" target="_blank" rel="noopener">WhatsApp</a>)</li>
    <li>Ladbroke Grove (W10) and Central West London: <a href="tel:+447871553827">07871 553827</a></li>
    <li>Email: <a href="mailto:info@ecoverdevaleting.co.uk">info@ecoverdevaleting.co.uk</a></li>
  </ul>
  <div class="reveal d3" style="margin-top:24px"><button class="btn btn-primary" data-book="">Book online ${ARROW}</button></div>
  <p class="qc-byline reveal d3">Written by <a href="/about">John Muriel</a>, owner of Ecoverde Valeting. Last updated: <time datetime="${QUALITY_CHECKLIST_PUBLISHED}">${UPDATED_LABEL}</time>.</p>
</div></section>`;

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${URL}#webpage`,
      url: URL,
      name: H1,
      description: "The checklist every Ecoverde Valeting car is signed off against, plus a 7-day put-it-right promise.",
      inLanguage: "en-GB",
      isPartOf: { "@id": `${BASE}/#website` },
      about: { "@id": `${BASE}/#organization` },
      publisher: { "@id": `${BASE}/#organization` },
      author: { "@type": "Person", name: "John Muriel", "@id": `${BASE}/about#john-muriel`, url: `${BASE}/about` },
      datePublished: QUALITY_CHECKLIST_PUBLISHED,
      dateModified: QUALITY_CHECKLIST_PUBLISHED,
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

const breadcrumbs = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
    { "@type": "ListItem", position: 2, name: "Quality Checklist", item: URL },
  ],
};

export const QUALITY_CHECKLIST_PAGE: ClonePage = {
  title: TITLE,
  description: DESCRIPTION,
  canonical: URL,
  og: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    image: `${BASE}/assets/img/og-cover.jpg`,
    site_name: "Ecoverde Valeting",
  },
  twitter: { card: "summary_large_image" },
  jsonLd: [JSON.stringify(schema), JSON.stringify(breadcrumbs)],
  html,
};
