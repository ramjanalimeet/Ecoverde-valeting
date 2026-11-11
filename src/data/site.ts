// Single source of truth for site content. Verify prices, review counts and
// contact details with the business before publishing — see README.

export const SITE = {
  name: "Ecoverde Valeting",
  legalName: "Ecoverde Valeting & Detailing Service",
  tagline: "Eco-friendly mobile car valeting & detailing · West London",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ecoverdevaleting.co.uk",
  reviewsUrl: process.env.NEXT_PUBLIC_REVIEWS_URL || "",
  trustindexId: process.env.NEXT_PUBLIC_TRUSTINDEX_ID || "",
  email: "info@ecoverdevaleting.co.uk",
  hours: "Mon–Sun 7am–8pm",
  phones: [
    { display: "07495 400369", tel: "+447495400369", label: "Brentford · Call or WhatsApp" },
    { display: "07871 553827", tel: "+447871553827", label: "Ladbroke Grove" },
  ],
  whatsapp: "447495400369",
  founder: "John Muriel",
};

export const PRIMARY_PHONE = SITE.phones[0];

export function whatsappLink(message = "Hi Ecoverde, I'd like a free quote for my car.") {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const REVIEWS = {
  total: "560+",
  rating: "5.0",
  breakdown: [
    { source: "Google", count: 374 },
    { source: "Checkatrade", count: 109 },
    { source: "Bark", count: 40 },
    { source: "Trustindex", count: 40 },
    { source: "Facebook", count: 22 },
    { source: "Yell", count: 14 },
  ],
};

export type MenuService = { label: string; slug: string };

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The four main service categories (cards at the top of the Services menu). */
export const SERVICE_CATEGORIES = [
  {
    slug: "valeting-service",
    label: "Valeting Service",
    blurb: "A full deep clean inside & out — vacuum, steam, shampoo & protect.",
    image: "/images/cat-valeting.webp",
  },
  {
    slug: "car-detailing",
    label: "Car Detailing",
    blurb: "Paint correction, machine polish & ceramic coating for a flawless finish.",
    image: "/images/cat-detailing.webp",
  },
  {
    slug: "mobile-car-wash",
    label: "Mobile Car Wash",
    blurb: "A quick, eco-friendly exterior wash & refresh — we come to you.",
    image: "/images/cat-car-wash.webp",
  },
  {
    slug: "car-restoration",
    label: "Car Restoration",
    blurb: "Alloy refurb, dent & scuff repair and bodywork respray.",
    image: "/images/cat-restoration.webp",
  },
];

/** Link columns under the category cards in the Services menu. */
export const SERVICE_GROUPS: { title: string; category: string; items: MenuService[] }[] = [
  {
    title: "Valeting Extras",
    category: "valeting-service",
    items: [
      { label: "Lease Return Valet", slug: "lease-return-valet" },
      { label: "Pre-Sale Valet", slug: "pre-sale-valet" },
      { label: "Used Car Valet", slug: "used-car-valet" },
      { label: "Maintenance Packages", slug: "maintenance-packages" },
      { label: "Gift Vouchers", slug: "gift-vouchers" },
      { label: "Interior Deep Clean & Steam", slug: "interior-deep-clean" },
      { label: "Mould & Odour Removal", slug: "mould-odour-removal" },
    ],
  },
  {
    title: "Detailing & Protection",
    category: "car-detailing",
    items: [
      { label: "Supercar Detailing", slug: "supercar-detailing" },
      { label: "Classic Car Detailing", slug: "classic-car-detailing" },
      { label: "Leather & Upholstery", slug: "leather-upholstery" },
      { label: "Ceramic Coating", slug: "ceramic-coating" },
      { label: "Paint Correction", slug: "paint-correction" },
      { label: "Soft-Top Cleaning", slug: "soft-top-cleaning" },
    ],
  },
  {
    title: "Restoration & Repair",
    category: "car-restoration",
    items: [
      { label: "Alloy Wheel Refurb", slug: "alloy-wheel-refurb" },
      { label: "Dent Removal & Panel Repair", slug: "dent-removal" },
      { label: "Bumper Scuff & Scratch", slug: "bumper-scuff-repair" },
      { label: "Bodywork & Respray", slug: "bodywork-respray" },
      { label: "Fleet & Commercial", slug: "fleet-commercial" },
    ],
  },
];

/** Every bookable service (categories + individual services) — used by the quote form. */
export const ALL_MENU_SERVICES: MenuService[] = [
  ...SERVICE_CATEGORIES.map((c) => ({ label: c.label, slug: c.slug })),
  ...SERVICE_GROUPS.flatMap((g) => g.items),
];

export const serviceHref = (slug: string) => `/services/${slug}`;

/** Our two bases and the areas each one covers (Service Areas menu + area pages). */
export const AREA_BASES = [
  {
    name: "Ladbroke Grove",
    postcode: "W10",
    slug: "ladbroke-grove",
    areas: [
      "Chelsea", "Kilburn", "Kensal Rise", "Highbury", "Highgate", "Paddington", "Battersea", "Kensington",
      "Maida Vale", "Holland Park", "Notting Hill", "South Kensington", "Queen's Park", "Victoria",
      "St John's Wood", "West Hampstead", "Westminster", "Shepherd's Bush", "Hammersmith", "Fulham",
    ],
  },
  {
    name: "Brentford",
    postcode: "TW8",
    slug: "brentford",
    areas: [
      "Richmond", "Kew", "Chiswick", "Ealing", "Acton", "Hounslow", "Hanwell", "Sheen", "Barnes", "Wimbledon",
      "Teddington", "Wandsworth", "Hampton", "Perivale", "Harrow", "Twickenham", "Uxbridge", "Kingston",
    ],
  },
];

export type Area = { name: string; slug: string; base: (typeof AREA_BASES)[number]; isBase: boolean };
export const ALL_AREAS: Area[] = AREA_BASES.flatMap((b) => [
  { name: b.name, slug: b.slug, base: b, isBase: true },
  ...b.areas.map((n) => ({ name: n, slug: slugify(n), base: b, isBase: false })),
]);
export const areaHref = (slug: string) => `/areas/${slug}`;

/** Link that preselects a service in the quote form. */
export const quoteHref = (slug?: string) => (slug ? `/?service=${slug}#quote` : "/#quote");

export type ServiceCard = {
  title: string;
  price: string;
  category: string;
  description: string;
  image: string;
  alt: string;
  formValue: string;
  /** Service page slug the card title links to. */
  page: string;
};

export const SERVICES: ServiceCard[] = [
  {
    title: "Mini & Full Valets",
    price: "From £109",
    category: "Valeting",
    description:
      "Inside-and-out valets — from a tidy mini valet to our deluxe full valet. Vacuum, steam, deep clean, protect and finish.",
    image: "/images/service-1.webp",
    alt: "Valeter hand-washing a black car with a wash mitt and snow foam",
    formValue: "valeting-service",
    page: "valeting-service",
  },
  {
    title: "Premium & Supercar Detailing",
    price: "From £289",
    category: "Detailing",
    description:
      "Meticulous, multi-stage detailing for classics, supercars and high-end vehicles — the perfectionist's choice.",
    image: "/images/service-2.webp",
    alt: "Black saloon covered in snow foam during a premium detail",
    formValue: "supercar-detailing",
    page: "supercar-detailing",
  },
  {
    title: "Paint Correction & Ceramic",
    price: "From £289",
    category: "Paintwork",
    description:
      "Machine polishing, swirl & scratch removal, paint enhancement and long-lasting ceramic coating protection.",
    image: "/images/service-3.webp",
    alt: "Water beading on freshly protected red paintwork",
    formValue: "paint-correction",
    page: "ceramic-coating",
  },
  {
    title: "Interior Deep Clean & Steam",
    price: "From £189",
    category: "Interior",
    description:
      "Steam sanitisation, stain & odour removal, mould treatment and ozone — a fresh, hygienic, allergy-friendly cabin.",
    image: "/images/service-4.webp",
    alt: "Valeter cleaning a steering wheel and dashboard during an interior deep clean",
    formValue: "interior-deep-clean",
    page: "interior-deep-clean",
  },
  {
    title: "Soft-Top Cleaning & Proofing",
    price: "From £189",
    category: "Specialist",
    description:
      "Convertible roof deep clean, re-colour and re-proofing to keep fabric tops protected from the British weather.",
    image: "/images/service-5.webp",
    alt: "Convertible fabric roof being deep cleaned and reproofed",
    formValue: "soft-top-cleaning",
    page: "soft-top-cleaning",
  },
  {
    title: "Restoration & Refurb",
    price: "Quote on request",
    category: "Restoration",
    description:
      "Alloy wheel refurbishment, dent & scuff repair and bodywork respraying — restore resale value before you sell.",
    image: "/images/service-6.webp",
    alt: "Refurbished Ferrari alloy wheel with red brake caliper",
    formValue: "bodywork-respray",
    page: "car-restoration",
  },
  {
    title: "Lease Return & Post-Purchase Valet",
    price: "From £289",
    category: "Valeting",
    description:
      "Handing a lease back? We deep clean the areas inspectors check to help you avoid end-of-lease charges. Just bought used? A full reset removes the previous owner's dirt, stains & odours.",
    image: "/images/service-7.webp",
    alt: "Car covered in eco-friendly snow foam from a foam sprayer",
    formValue: "lease-return-valet",
    page: "lease-return-valet",
  },
  {
    title: "Mould & Odour Removal",
    price: "Quote on request",
    category: "Interior",
    description:
      "Mould thrives in damp cabins — we remove it at the source with eco-friendly steam sanitisation, stain treatment and ozone for stubborn, deeply embedded odours.",
    image: "/images/service-8.webp",
    alt: "Mouldy car interior before an eco steam clean",
    formValue: "mould-odour-removal",
    page: "mould-odour-removal",
  },
  {
    title: "Machine Polishing & Paint Protection",
    price: "From £189",
    category: "Paintwork",
    description:
      "Single or multi-stage machine polish to lift swirls and restore gloss — finished with wax, sealant or ceramic to lock in the shine.",
    image: "/images/service-9.webp",
    alt: "Machine polisher restoring gloss to red paintwork",
    formValue: "paint-correction",
    page: "paint-correction",
  },
];

export const BRANDS = [
  { name: "IGL Coatings", logo: "/images/brand-igl.png", w: 150, h: 64 },
  { name: "Ecover", logo: "/images/brand-ecover.png", w: 109, h: 64 },
  { name: "Gtechniq", logo: "/images/brand-gtechniq.png", w: 146, h: 64 },
  { name: "Bilt Hamber", logo: "/images/brand-bilt-hamber.png", w: 160, h: 64 },
  { name: "Autoglym", logo: "/images/brand-autoglym.png", w: 70, h: 64 },
];

// Google reviews shown on the homepage (from the live site).
export const REVIEW_CARDS = [
  { name: "Elizabeth Dias", date: "7 Jun 2026", text: "My car looks absolutely spotless — like new! Very professional, punctual, and paid great attention to detail. I highly recommend this company." },
  { name: "Rufus Olins", date: "6 Jun 2026", text: "John did a very good job, was a pleasure to talk to — and went beyond what he had to in order to tackle some light scratches." },
  { name: "Dorian Needs", date: "1 Jun 2026", text: "Outstanding service! I will definitely be using them again and can highly recommend them." },
  { name: "Mikio Ikeda", date: "29 May 2026", text: "My car looked like it belonged in a showroom. The transformation was remarkable." },
  { name: "Paul Rolles", date: "27 May 2026", text: "It looks SPECTACULAR! Superb service, will use again." },
  { name: "Nat Han", date: "15 May 2026", text: "John did an excellent job. Very convenient having a mobile service come to my home." },
  { name: "Ibrahim Busharat", date: "14 May 2026", text: "John came quickly and did the service very well. Friendly and reliable." },
  { name: "Sharon Singh", date: "8 May 2026", text: "He worked tirelessly to extract cigarette smoke odour. Stellar job — highly recommending." },
  { name: "Eugene Miskelly", date: "6 May 2026", text: "John arrived on time and worked neatly to produce an excellent valet service." },
  { name: "Ben Harris", date: "30 Apr 2026", text: "He did an amazing job with my filthy car and got it gleaming. Thoroughly nice dude." },
];

// Social profiles — icons only render for entries with a URL.
export const SOCIAL: { label: string; icon: "facebook" | "instagram" | "x" | "youtube" | "linkedin" | "tiktok"; href: string }[] = [
  { label: "Facebook", icon: "facebook", href: "https://www.facebook.com/EcoverdeValetingServices" },
  { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/ecoverdevaletingservice/" },
  { label: "X (Twitter)", icon: "x", href: "https://x.com/ecoverdevalet" },
  { label: "YouTube", icon: "youtube", href: "https://www.youtube.com/@ecoverdevaletingservice" },
  { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/company/ecoverde-valeting-services/" },
  { label: "TikTok", icon: "tiktok", href: "https://www.tiktok.com/@ecoverdevaleting" },
]

export const WHY = [
  {
    icon: "drop",
    title: "Low-water & waterless techniques",
    text: "Steam and rinseless washing lift dirt with a fraction of the water — no run-off, no waste.",
  },
  {
    icon: "leaf",
    title: "Plant-based, biodegradable products",
    text: "Solvent-free, pH-balanced, non-toxic shampoos and interior cleaners — safe for allergy-sensitive clients.",
  },
  {
    icon: "bolt",
    title: "Electric van — zero generator",
    text: "We arrive fully self-powered and emission-free, so there's no noisy generator on your driveway.",
  },
  {
    icon: "sparkle",
    title: "Meticulous, perfectionist finish",
    text: "Attention to detail on every panel — the high standard that earns 560+ five-star reviews.",
  },
] as const;

export const STEPS = [
  {
    n: "01",
    title: "Request a visit",
    text: "Send a few photos or a short video, choose a time that suits you, and tell us what you need.",
  },
  {
    n: "02",
    title: "Free, tailored quote",
    text: "We assess the size and condition and call you with a no-obligation quote — we work around your budget.",
  },
  {
    n: "03",
    title: "We come to you",
    text: "Our fully-mobile, eco-friendly setup arrives at your home or office — no driving, no waiting rooms.",
  },
  {
    n: "04",
    title: "Spotless & protected",
    text: "Meticulous results, every time. Loved it? Easy reminders keep your car looking its best year-round.",
  },
];

export const STATS = [
  { value: "560+", label: "Verified reviews" },
  { value: "5.0★", label: "Average rating" },
  { value: "8+", label: "Years' experience" },
  { value: "100%", label: "Mobile & eco-friendly" },
];

// Real Ecoverde job photos (cropped from the live site — swap for full-resolution originals when available).
export const GALLERY = [
  { src: "/images/gallery-1.webp", alt: "White Fiat 500 after a full eco valet", caption: "Car interior deep clean after an eco valet in West London", span: "tall" },
  { src: "/images/gallery-2.webp", alt: "Convertible soft-top roof, half cleaned, showing before and after", caption: "Soft-top roof clean before and after in West London", span: "wide" },
  { src: "/images/gallery-3.webp", alt: "Red Porsche Taycan valeted on a residential street beside the Ecoverde van", caption: "Porsche valeted at home by Ecoverde's mobile van", span: "" },
  { src: "/images/gallery-4.webp", alt: "BMW i3 covered in snow foam beside the Ecoverde electric van", caption: "Eco-friendly snow foam car wash beside the Ecoverde van", span: "wide" },
  { src: "/images/gallery-5.webp", alt: "Land Rover Defender being snow-foamed on a driveway", caption: "Exterior car detailing result in West London", span: "" },
  { src: "/images/gallery-6.webp", alt: "Toyota SUV covered in snow foam during a mobile valet", caption: "Mobile car valeting in progress", span: "" },
  { src: "/images/gallery-7.webp", alt: "Car interior covered in mould before a deep clean", caption: "Interior mould removal and deep clean", span: "wide" },
  { src: "/images/gallery-8.webp", alt: "Machine polishing red paintwork to remove scratches", caption: "Paint enhancement and scratch removal", span: "" },
];


export const PRIMARY_AREAS = [
  { name: "Brentford", postcode: "TW8" },
  { name: "Ladbroke Grove", postcode: "W10" },
];

export const AREAS = [
  "Chiswick W4", "Ealing W5", "Hammersmith W6", "Shepherd's Bush W12", "Notting Hill W11",
  "Kensington SW7", "Maida Vale W9", "Kensal Rise & Green", "Acton", "Westminster", "South Kensington",
  "Chelsea", "Fulham", "Barnes", "Richmond", "Twickenham", "West Hampstead", "Kingston", "Greater London",
];

export const MORE_AREAS = [
  "Kilburn", "Highbury", "Highgate", "Paddington", "Battersea", "Holland Park", "Queen's Park", "Victoria",
  "St John's Wood", "Wimbledon", "Teddington", "Wandsworth", "Hampton", "Perivale", "Harrow", "Uxbridge",
  "Sheen", "Hanwell", "Hounslow",
];

export const FAQS = [
  {
    q: "Can a mobile car valeting service come to my home or office?",
    a: "Yes — Ecoverde is a fully mobile service covering West London, including Brentford (TW8), Ladbroke Grove (W10), Chiswick and surrounding areas. We arrive at your home, office car park or outdoor space with all the equipment and eco-friendly products we need.",
  },
  {
    q: "Which mobile car valeting companies use eco-friendly cleaning products?",
    a: "We use biodegradable, non-toxic, pH-balanced products exclusively. We employ low-water and waterless wash techniques, solvent-free formulations that are safe for paintwork, and we responsibly dispose of all waste materials.",
  },
  {
    q: "Where can I find a mobile car valeting service with great reviews nearby?",
    a: "Ecoverde has earned 560+ five-star reviews across Google, Checkatrade, Bark, Facebook and Yell. We're Checkatrade verified and consistently praised for attention to detail, punctuality and professionalism.",
  },
  {
    q: "Do you offer ceramic coating treatments?",
    a: "Yes — we apply professional ceramic coating at your location, creating a hydrophobic layer that repels water, protects against UV damage and lasts for years.",
  },
  {
    q: "Do you include interior deep cleaning and upholstery shampoo?",
    a: "We provide full upholstery shampooing, steam cleaning, leather conditioning, stain and odour removal, vacuuming and glass cleaning — all using eco-friendly solutions.",
  },
  {
    q: "What paint protection options are available?",
    a: "Options include carnauba wax, synthetic paint sealant, ceramic coating, and paint correction to remove swirl marks and oxidisation.",
  },
  {
    q: "Do you offer a quick turnaround for busy schedules?",
    a: "Our express mini valet takes 45–60 minutes; a full valet takes 2–3 hours. We offer flexible time slots including early mornings, daytime and weekends.",
  },
  {
    q: "Can you valet a luxury or classic car?",
    a: "Absolutely. We regularly service luxury brands (BMW, Mercedes-Benz, Audi, Porsche), Range Rover, Tesla and classic vehicles, using paint-safe, hand-application techniques throughout.",
  },
  {
    q: "Do you offer contactless booking and payment?",
    a: "Yes — request a free quote online any time, pay by contactless digital payment, receive confirmations via WhatsApp, and enjoy a full end-to-end contactless service.",
  },
  {
    q: "Do you use steam cleaning technology?",
    a: "We use professional-grade steam cleaning that eliminates bacteria and odours without chemicals, penetrates hard-to-reach areas, and uses minimal water.",
  },
];

export const PET_OPTIONS = ["No pets", "Yes — occasionally", "Yes — regularly (pet hair)"];

export const NAV = [
  { label: "Home", href: "/" },
  {
    label: "About",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Why Choose Us", href: "/why-choose-us" },
    ],
  },
  { label: "Services", mega: "services" as const },
  { label: "Service Areas", mega: "areas" as const },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];
