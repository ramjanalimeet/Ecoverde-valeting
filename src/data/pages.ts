import type { PhotoKey } from "./images";

// Content for the service + category pages (/services/[slug]).
// Prices/durations only where the business already publishes them; everything else is "free tailored quote".
// Have the business review this copy before launch (see README).

export type Faq = { q: string; a: string };
export type Package = { name: string; meta?: string; text: string; items: string[] };

export type ServicePage = {
  slug: string;
  name: string;
  /** Category slug this belongs to (for breadcrumbs / related). Categories point to themselves. */
  category: string;
  isCategory?: boolean;
  h1: [string, string]; // plain text, italic green accent
  eyebrow: string;
  intro: string;
  pill: [string, string]; // highlighted, rest
  hero: PhotoKey;
  photo: PhotoKey;
  /** "Recent work" photo strip on the page */
  gallery: PhotoKey[];
  sectionEyebrow: string;
  sectionTitle: [string, string];
  body: string[];
  includes: string[];
  price?: string;
  duration?: string;
  packages?: Package[];
  faqs: Faq[];
};

const ecoFaq: Faq = {
  q: "Is it really eco-friendly?",
  a: "Yes. We use biodegradable, pH-balanced products, low-water and steam techniques, and arrive in an electric van with no generator — so there's no run-off, fumes or noise on your driveway.",
};
const mobileFaq: Faq = {
  q: "Do I need to provide water or power?",
  a: "No. Our setup is fully self-contained, so we just need safe access to the car at your home, office or car park anywhere across West London.",
};
const quoteFaq: Faq = {
  q: "How much does it cost?",
  a: "Every car is different, so we give a free, tailored quote once we've seen photos or a short video of the car — you only book once you're happy with the price.",
};

export const SERVICE_PAGES: ServicePage[] = [
  /* ------------------------------------------------------------ Categories */
  {
    slug: "valeting-service",
    name: "Valeting Service",
    category: "valeting-service",
    isCategory: true,
    h1: ["Mobile car", "valeting"],
    eyebrow: "Valeting Service · West London",
    intro:
      "In the UK, a valet means a thorough deep clean — inside and out. From a tidy mini valet to our deluxe full valet, we vacuum, steam, shampoo, protect and finish your car at your home or workplace.",
    pill: ["From £109", "· mini & full valets, fully mobile"],
    hero: "handWash",
    photo: "fiat",
    gallery: ["bmwI3", "jobAudiA4", "jobCivic", "interiorWheel"],
    sectionEyebrow: "Inside & Out",
    sectionTitle: ["A proper clean,", "not a quick wipe"],
    body: [
      "Our valets are hand-finished from start to end with eco-friendly, biodegradable products. Steam lifts grime from vents, seams and carpets without harsh chemicals, while a pH-neutral snow foam and two-bucket wash protect your paintwork.",
      "Choose a mini valet to keep a well-kept car fresh, or a full valet when it needs a real reset. Not sure which? Send us a photo and we'll recommend the right level.",
    ],
    includes: [
      "Snow foam pre-wash & two-bucket hand wash",
      "Wheels, arches & tyres cleaned and dressed",
      "Full vacuum including boot & seat rails",
      "Steam clean of dash, vents, door cards & cup holders",
      "Interior & exterior glass streak-free",
      "Paint protection finish",
    ],
    packages: [
      {
        name: "Mini Valet",
        meta: "From £109 · 45–60 minutes",
        text: "A tidy-up inside and out for cars that are cleaned regularly.",
        items: ["Exterior hand wash & dry", "Wheels & tyres", "Interior vacuum", "Wipe-down of dash & surfaces", "Glass inside & out"],
      },
      {
        name: "Full Valet",
        meta: "Free tailored quote · 2–3 hours",
        text: "Our deluxe deep clean for when the car needs a complete reset.",
        items: ["Everything in the mini valet", "Steam clean & sanitise", "Upholstery shampoo", "Leather clean & condition", "Paint protection"],
      },
    ],
    duration: "45 minutes – 3 hours",
    price: "From £109",
    faqs: [
      { q: "What's the difference between a mini and full valet?", a: "A mini valet is a thorough tidy-up for well-kept cars (45–60 minutes). A full valet adds steam sanitisation, upholstery shampoo and leather care for a complete reset (2–3 hours)." },
      mobileFaq,
      ecoFaq,
    ],
  },
  {
    slug: "car-detailing",
    name: "Car Detailing",
    category: "car-detailing",
    isCategory: true,
    h1: ["Car", "detailing"],
    eyebrow: "Car Detailing · West London",
    intro:
      "Detailing goes beyond cleaning: we correct, enhance and protect. Machine polishing, paint correction and ceramic coating for a flawless, long-lasting finish — on daily drivers, supercars and classics.",
    pill: ["From £289", "· premium & supercar detailing"],
    hero: "snowFoamBlack",
    photo: "paintRed",
    gallery: ["jobBluePaint", "jobPorsche718", "jobSupercar", "ceramicBeading"],
    sectionEyebrow: "The Perfectionist's Choice",
    sectionTitle: ["Paintwork that", "looks better than new"],
    body: [
      "Every detail starts with a careful decontamination wash, then we inspect the paint under light to plan the right level of correction. Swirls, haze and light scratches are machine-polished away before we lock in the gloss with your choice of wax, sealant or ceramic coating.",
      "We use professional products from brands including Gtechniq, IGL Coatings and Bilt Hamber, applied by hand at your home or workplace.",
    ],
    includes: [
      "Snow foam, two-bucket wash & decontamination",
      "Iron fallout & tar removal, clay bar treatment",
      "Paint inspection under detailing lights",
      "Single or multi-stage machine polish",
      "Wax, sealant or ceramic protection",
      "Wheels, trim & glass finished",
    ],
    price: "From £289",
    faqs: [
      { q: "What's the difference between valeting and detailing?", a: "Valeting is a thorough clean. Detailing goes further — correcting paint defects like swirls and scratches and adding long-lasting protection such as a ceramic coating." },
      quoteFaq,
      ecoFaq,
    ],
  },
  {
    slug: "mobile-car-wash",
    name: "Mobile Car Wash",
    category: "mobile-car-wash",
    isCategory: true,
    h1: ["Mobile car", "wash"],
    eyebrow: "Mobile Car Wash · West London",
    intro:
      "A quick, eco-friendly wash and refresh at your door — no queues, no drive-through brushes scratching your paint. Low-water techniques and biodegradable products, 7 days a week.",
    pill: ["Free tailored quote", "· we come to you"],
    hero: "ctaFoam",
    photo: "bmwI3",
    gallery: ["defender", "toyota4x4", "foamBrentford", "handWash"],
    sectionEyebrow: "Wash Packages",
    sectionTitle: ["Four ways to", "keep it clean"],
    body: [
      "Our mobile washes are perfect between valets, or whenever the car needs to look its best quickly. Everything is done by hand with soft wash mitts and pH-neutral snow foam, so your paint stays swirl-free.",
    ],
    includes: [
      "pH-neutral snow foam pre-wash",
      "Two-bucket hand wash with soft mitts",
      "Wheels & tyres cleaned",
      "Microfibre dry for a spot-free finish",
      "No water or power needed from you",
    ],
    packages: [
      { name: "Exterior Basic Wash", text: "A fast, safe exterior clean.", items: ["Snow foam & hand wash", "Wheels & tyres", "Hand dry"] },
      { name: "Exterior + Interior Wash", text: "Clean outside and a tidy inside.", items: ["Exterior basic wash", "Interior vacuum", "Dash & glass wipe"] },
      { name: "Premium Wash & Shine", text: "Extra gloss and protection.", items: ["Exterior + interior wash", "Tyre dressing", "Spray sealant for shine"] },
      { name: "Full Wash & Refresh", text: "Our most complete wash.", items: ["Premium wash & shine", "Door shuts & sills", "Mats cleaned & interior refreshed"] },
    ],
    faqs: [mobileFaq, quoteFaq, ecoFaq],
  },
  {
    slug: "car-restoration",
    name: "Car Restoration",
    category: "car-restoration",
    isCategory: true,
    h1: ["Car", "restoration"],
    eyebrow: "Car Restoration · West London",
    intro:
      "Alloy wheel refurbishment, dent and scuff repair, bodywork respray and faded paint restoration — bring tired bodywork back and protect your car's resale value before you sell or hand it back.",
    pill: ["Quote on request", "· repairs assessed from your photos"],
    hero: "ferrariWheel",
    photo: "menuWheel",
    gallery: ["paintRed", "jobBluePaint", "job300zx", "jobAudiHatch"],
    sectionEyebrow: "Restore & Repair",
    sectionTitle: ["Small repairs,", "big difference"],
    body: [
      "Kerbed alloys, car-park dents, bumper scuffs and oxidised paint all knock value off a car. We assess each repair from your photos and recommend the most cost-effective fix, whether that's a smart repair or a full respray of the panel.",
      "Many repairs can be done at your home or workplace; where a job needs a controlled environment we'll tell you upfront.",
    ],
    includes: [
      "Alloy wheel refurbishment",
      "Dent removal & panel repair",
      "Bumper scuff & scratch repair",
      "Bodywork & respray",
      "Faded paint & oxidisation restore",
      "Colour-matched finish",
    ],
    faqs: [
      { q: "How do you quote for repairs?", a: "Send clear photos of the damage from a few angles. We'll recommend the right repair and give you a free, no-obligation quote." },
      mobileFaq,
      ecoFaq,
    ],
  },

  /* ------------------------------------------------------- Valeting extras */
  {
    slug: "lease-return-valet",
    name: "Lease Return Valet",
    category: "valeting-service",
    h1: ["Lease return", "valet"],
    eyebrow: "Lease Return Valet · West London",
    intro:
      "Handing your car back? A lease return valet is a thorough deep clean focused on exactly the areas leasing companies inspect — helping you avoid unexpected cleaning and condition charges. Fully mobile, and timed to your handover date.",
    pill: ["Free tailored quote", "· book 1–3 days before handback"],
    hero: "foamBrentford",
    photo: "fiat",
    gallery: ["interiorWheel", "jobAudiA4", "bmwI3", "jobAudiHatch"],
    sectionEyebrow: "Handback-Ready",
    sectionTitle: ["Return your lease with", "confidence"],
    body: [
      "Inspectors look closely at seats, carpets, boot linings, wheels and paintwork. We deep clean and steam every one of those areas, remove stains and odours, and leave the car presentation-ready for inspection.",
      "If we spot kerbed alloys or light scuffs, we'll let you know — small repairs before handback usually cost far less than end-of-lease charges.",
    ],
    includes: [
      "Full exterior wash, decontamination & dry",
      "Wheels, arches & tyres deep cleaned",
      "Seats & carpets shampooed, stains treated",
      "Boot, door cards & seat rails steam cleaned",
      "Odour treatment for pet, smoke or food smells",
      "Advice on minor repairs before inspection",
    ],
    price: "From £289",
    faqs: [
      { q: "When should I book?", a: "Ideally 1–3 days before your handback, so the car is at its best on inspection day." },
      quoteFaq,
      mobileFaq,
    ],
  },
  {
    slug: "pre-sale-valet",
    name: "Pre-Sale Valet",
    category: "valeting-service",
    h1: ["Pre-sale", "valet"],
    eyebrow: "Pre-Sale Valet · West London",
    intro:
      "First impressions sell cars. A pre-sale valet makes your car look cared-for in photos and on viewings — helping it sell faster and for a better price.",
    pill: ["Free tailored quote", "· ready for photos & viewings"],
    hero: "taycan",
    photo: "jobAudiHatch",
    gallery: ["defender", "jobPorsche718", "jobCivic", "jobBluePaint"],
    sectionEyebrow: "Sell It Faster",
    sectionTitle: ["Make buyers", "want it"],
    body: [
      "We clean everything a buyer looks at — paintwork, wheels, glass, seats, carpets and the boot — and remove the smells that put buyers off. A gloss enhancement makes the paint pop in listing photos.",
      "Pair it with an alloy refurb or scuff repair to remove the small flaws buyers use to haggle down the price.",
    ],
    includes: [
      "Exterior wash, decontamination & gloss enhancement",
      "Wheels & tyres cleaned and dressed",
      "Interior deep clean & steam",
      "Stain & odour treatment",
      "Engine bay wipe-down on request",
      "Glass inside & out",
    ],
    faqs: [quoteFaq, mobileFaq, ecoFaq],
  },
  {
    slug: "used-car-valet",
    name: "Used Car Valet",
    category: "valeting-service",
    h1: ["Used car fresh-start", "valet"],
    eyebrow: "Used Car Valet · West London",
    intro:
      "Just bought a used car? Our Used Car Fresh Start Valet deep cleans and steam sanitises the whole interior, then treats smoke, pet, damp and food smells at the source rather than covering them up.",
    pill: ["From £189", "· usually 2–4 hours"],
    hero: "interiorWheel",
    photo: "toyota4x4",
    gallery: ["mould", "menuInterior", "jobMr2", "jobAudiA4"],
    sectionEyebrow: "A Hygienic Start",
    sectionTitle: ["Make it", "yours"],
    body: [
      "You don't know how the last owner used it. Seats, carpets, vents and the steering wheel hold dirt, bacteria and old smells, so a deep clean and steam sanitisation gives you a hygienic start.",
      "Usually 2 to 4 hours, depending on the size of the car and its condition — fully mobile across West London.",
    ],
    includes: [
      "Steam sanitisation of every touch point",
      "Seats & carpets shampooed",
      "Vents, seams & seat rails deep cleaned",
      "Smoke, pet, damp & food odour treatment",
      "Exterior wash & protection",
      "Glass inside & out",
    ],
    price: "From £189",
    duration: "2–4 hours",
    faqs: [
      { q: "How long does it take?", a: "Usually 2 to 4 hours, depending on the size of the car and its condition." },
      mobileFaq,
      ecoFaq,
    ],
  },
  {
    slug: "maintenance-packages",
    name: "Maintenance Packages",
    category: "valeting-service",
    h1: ["Maintenance", "packages"],
    eyebrow: "Maintenance Packages · West London",
    intro:
      "Keep your car looking its best all year round with regular visits on a schedule that suits you — weekly, fortnightly or monthly. Easy reminders, no rebooking hassle.",
    pill: ["Free tailored quote", "· weekly, fortnightly or monthly"],
    hero: "bmwI3",
    photo: "handWash",
    gallery: ["jobAudiA4", "jobTesla", "defender", "jobCivic"],
    sectionEyebrow: "Always Looking Its Best",
    sectionTitle: ["Clean cars,", "zero effort"],
    body: [
      "Regular maintenance washes protect your paint and interior, and make every future valet quicker. We'll agree a visit frequency and level of clean that fits your car and budget, then simply turn up.",
      "Ideal for busy professionals, families and anyone with a coating or protection they want to keep performing.",
    ],
    includes: [
      "Scheduled visits at home or work",
      "Safe hand wash & dry",
      "Interior vacuum & wipe-down",
      "Top-up of paint protection",
      "Reminders before each visit",
    ],
    faqs: [quoteFaq, mobileFaq, ecoFaq],
  },
  {
    slug: "gift-vouchers",
    name: "Gift Vouchers",
    category: "valeting-service",
    h1: ["Car valeting gift", "vouchers"],
    eyebrow: "Gift Vouchers · West London",
    intro:
      "A gift for someone who loves their car, or for anyone who would rather not spend a Saturday cleaning one. Vouchers are personalised, sent by email and redeemable anywhere across our West London coverage.",
    pill: ["From £25", "· open value or a specific service"],
    hero: "heroBmw",
    photo: "taycan",
    gallery: ["jobPorsche911", "jobPorsche718", "jobSupercar", "jobCivic"],
    sectionEyebrow: "The Perfect Gift",
    sectionTitle: ["Give the gift of a", "spotless car"],
    body: [
      "Choose an open value from £25 or a specific service if you already know what they want. Tell us your message and we'll email a personalised voucher — nothing to post and nothing to arrive late.",
    ],
    includes: [
      "Sent by email, personalised with your message",
      "Redeemable against any valet or detailing service",
      "Any area we cover across West London",
      "Open value from £25",
    ],
    price: "From £25",
    faqs: [
      { q: "How do I buy a voucher?", a: "Request a voucher using the form — tell us the value or service and your message, and we'll send payment details and the personalised voucher by email." },
      ecoFaq,
    ],
  },
  {
    slug: "interior-deep-clean",
    name: "Interior Deep Clean & Steam",
    category: "valeting-service",
    h1: ["Interior deep clean &", "steam"],
    eyebrow: "Interior Deep Clean · West London",
    intro:
      "Steam sanitisation, stain and odour removal, mould treatment and ozone — a fresh, hygienic, allergy-friendly cabin without harsh chemicals.",
    pill: ["From £189", "· allergy-friendly steam clean"],
    hero: "interiorWheel",
    photo: "menuInterior",
    gallery: ["mould", "fiat", "jobMr2"],
    sectionEyebrow: "Fresh & Hygienic",
    sectionTitle: ["A cabin you'll", "love sitting in"],
    body: [
      "Professional steam reaches into vents, seams and fabrics to lift dirt and kill bacteria using just a little water. We shampoo seats and carpets, treat stains, and clean and condition leather.",
      "Ideal for families, pet owners and anyone with allergies — everything we use is non-toxic and solvent-free.",
    ],
    includes: [
      "Full vacuum including boot & under seats",
      "Steam sanitisation of all surfaces",
      "Seat & carpet shampoo, stain removal",
      "Leather clean & condition",
      "Odour treatment, ozone on request",
      "Glass inside streak-free",
    ],
    price: "From £189",
    faqs: [
      { q: "Is steam cleaning safe for leather and electronics?", a: "Yes — we control steam carefully and use dedicated leather cleaners and conditioners, keeping moisture away from screens and electronics." },
      mobileFaq,
      ecoFaq,
    ],
  },
  {
    slug: "mould-odour-removal",
    name: "Mould & Odour Removal",
    category: "valeting-service",
    h1: ["Mould & odour", "removal"],
    eyebrow: "Mould & Odour Removal · West London",
    intro:
      "Mould thrives in damp cabins — we remove it at the source with eco-friendly steam sanitisation, stain treatment and ozone for stubborn, deeply embedded odours.",
    pill: ["Quote on request", "· send us a photo"],
    hero: "mould",
    photo: "interiorWheel",
    gallery: ["menuInterior", "toyota4x4", "fiat"],
    sectionEyebrow: "Removed At The Source",
    sectionTitle: ["Not masked —", "eliminated"],
    body: [
      "Air fresheners only cover smells. We find where mould and odours live — carpets, underlay, seat foam, headlining and vents — then steam, extract and treat them, finishing with an ozone treatment where needed.",
      "We'll also point out likely causes of damp, such as blocked drains or failed seals, so it doesn't come back.",
    ],
    includes: [
      "Mould treatment & steam sanitisation",
      "Carpet & upholstery extraction",
      "Smoke, pet & damp odour treatment",
      "Ozone treatment for embedded smells",
      "Advice on the source of damp",
    ],
    faqs: [quoteFaq, mobileFaq, ecoFaq],
  },

  /* ------------------------------------------------- Detailing & protection */
  {
    slug: "supercar-detailing",
    name: "Supercar Detailing",
    category: "car-detailing",
    h1: ["Supercar", "detailing"],
    eyebrow: "Supercar Detailing · West London",
    intro:
      "Meticulous, multi-stage detailing for supercars and high-end vehicles — the perfectionist's choice. Paint-safe, hand-applied techniques throughout, at your home or garage.",
    pill: ["From £289", "· paint-safe, hand-finished"],
    hero: "snowFoamBlack",
    photo: "taycan",
    gallery: ["jobSupercar", "jobPorsche718", "jobPorsche911", "ferrariWheel"],
    sectionEyebrow: "Concours-Level Care",
    sectionTitle: ["For cars that deserve", "the best"],
    body: [
      "Supercars need specialist care: soft paint, complex aero and delicate finishes. We take our time, using dedicated mitts, wheel brushes and pH-neutral products, and inspect every panel under detailing lights.",
      "Add paint correction and a ceramic coating for a deeper gloss and easier cleaning between visits.",
    ],
    includes: [
      "Snow foam, two-bucket & decontamination wash",
      "Wheels off-car clean on request",
      "Paint inspection under lights",
      "Machine polish & gloss enhancement",
      "Ceramic, sealant or wax protection",
      "Interior leather & Alcantara care",
    ],
    price: "From £289",
    faqs: [quoteFaq, mobileFaq, ecoFaq],
  },
  {
    slug: "classic-car-detailing",
    name: "Classic Car Detailing",
    category: "car-detailing",
    h1: ["Classic car", "detailing"],
    eyebrow: "Classic Car Detailing · West London",
    intro:
      "Gentle, specialist detailing for classic and vintage cars — preserving original paint, chrome and interiors with careful hand techniques and products safe for older finishes.",
    pill: ["Free tailored quote", "· original finishes preserved"],
    hero: "beading",
    photo: "job300zx",
    gallery: ["jobMr2", "jobPorsche911", "jobSubaru", "jobBluePaint"],
    sectionEyebrow: "Preserve The Original",
    sectionTitle: ["Treated with", "respect"],
    body: [
      "Older paint, single-stage finishes and chrome need a lighter touch. We test before we polish, use the least aggressive method that works, and protect with waxes suited to classic finishes.",
      "Interiors get the same care — leather is cleaned and fed, and carpets are cleaned without soaking.",
    ],
    includes: [
      "Gentle hand wash & decontamination",
      "Test-spot paint enhancement",
      "Chrome & brightwork polished",
      "Classic-safe wax protection",
      "Leather & interior care",
    ],
    faqs: [quoteFaq, mobileFaq, ecoFaq],
  },
  {
    slug: "leather-upholstery",
    name: "Leather & Upholstery",
    category: "car-detailing",
    h1: ["Leather &", "upholstery"],
    eyebrow: "Leather & Upholstery Detailing · West London",
    intro:
      "Deep clean, condition and protect leather, fabric and Alcantara — removing ingrained dirt, stains and odours, and keeping seats soft and crack-free.",
    pill: ["Free tailored quote", "· leather, fabric & Alcantara"],
    hero: "interiorWheel",
    photo: "menuInterior",
    gallery: ["mould", "fiat", "jobPorsche911"],
    sectionEyebrow: "Soft, Clean & Protected",
    sectionTitle: ["Seats that feel", "like new"],
    body: [
      "Leather looks shiny when it's dirty and matt when it's clean. We gently agitate and lift grime from the grain, then condition and add a protective coating that resists dye transfer and spills.",
      "Fabric seats and carpets are shampooed and extracted to remove stains and odours from deep inside.",
    ],
    includes: [
      "Leather deep clean & conditioning",
      "Fabric shampoo & hot extraction",
      "Alcantara cleaning",
      "Stain & odour treatment",
      "Protective coating for leather",
    ],
    faqs: [quoteFaq, mobileFaq, ecoFaq],
  },
  {
    slug: "ceramic-coating",
    name: "Ceramic Coating",
    category: "car-detailing",
    h1: ["Ceramic coating &", "paint protection"],
    eyebrow: "Ceramic Coating · West London",
    intro:
      "A professional ceramic coating applied at your location creates a hard, hydrophobic layer that repels water and dirt, protects against UV and keeps your car glossy for years.",
    pill: ["From £289", "· applied at your home or office"],
    hero: "ceramicBeading",
    photo: "jobBluePaint",
    gallery: ["snowFoamBlack", "paintRed", "jobTesla", "jobAudiHatch"],
    sectionEyebrow: "Long-Lasting Protection",
    sectionTitle: ["Gloss that", "lasts"],
    body: [
      "A coating is only as good as the paint underneath, so we wash, decontaminate and polish first. The coating is then applied panel by panel and left to cure, bonding to the paint for durable protection.",
      "Coated cars are much easier to clean — dirt and water simply slide off — and we can maintain the coating on our maintenance packages.",
    ],
    includes: [
      "Decontamination wash & clay",
      "Paint correction / enhancement polish",
      "Panel wipe for a clean bond",
      "Professional ceramic coating",
      "Wheels & glass coating on request",
      "Aftercare advice",
    ],
    price: "From £289",
    faqs: [
      { q: "How long does a ceramic coating last?", a: "Depending on the product chosen and how the car is maintained, a professional coating lasts for years — far longer than a wax or sealant." },
      quoteFaq,
      mobileFaq,
    ],
  },
  {
    slug: "paint-correction",
    name: "Paint Correction",
    category: "car-detailing",
    h1: ["Paint correction &", "machine polishing"],
    eyebrow: "Paint Correction · West London",
    intro:
      "Single or multi-stage machine polishing to lift swirls, haze and light scratches and restore deep gloss — finished with wax, sealant or ceramic to lock in the shine.",
    pill: ["From £189", "· single or multi-stage"],
    hero: "paintRed",
    photo: "jobPolishBmw",
    gallery: ["jobBluePaint", "jobTesla", "ceramicBeading", "jobSupercar"],
    sectionEyebrow: "Swirl-Free Gloss",
    sectionTitle: ["Bring back the", "shine"],
    body: [
      "Most swirl marks come from automatic car washes and poor drying. We measure and inspect the paint, then choose the right pads and compounds to remove defects while keeping as much clear coat as possible.",
      "The result is sharper reflections, deeper colour and paint that's ready for long-term protection.",
    ],
    includes: [
      "Decontamination wash & clay",
      "Paint inspection under detailing lights",
      "Single or multi-stage machine polish",
      "Swirl, haze & light scratch removal",
      "Wax, sealant or ceramic finish",
    ],
    price: "From £189",
    faqs: [
      { q: "Can you remove all scratches?", a: "Swirls and light scratches usually polish out completely. Deeper scratches that go through the clear coat can be improved, or repaired with our scratch repair service." },
      quoteFaq,
      mobileFaq,
    ],
  },
  {
    slug: "soft-top-cleaning",
    name: "Soft-Top Cleaning",
    category: "car-detailing",
    h1: ["Soft-top cleaning &", "proofing"],
    eyebrow: "Soft-Top Cleaning · West London",
    intro:
      "Convertible roof deep clean, re-colour and re-proofing to keep fabric tops protected from the British weather — and looking as good as the rest of the car.",
    pill: ["From £189", "· clean, re-colour & reproof"],
    hero: "softTop",
    photo: "softTopBA",
    gallery: ["jobPorsche911", "jobPorsche718", "ceramicBeading"],
    sectionEyebrow: "Protected From The Weather",
    sectionTitle: ["A roof that", "repels rain"],
    body: [
      "Fabric roofs trap dirt, moss and algae, and lose their water repellency over time. We deep clean the fabric by hand, treat green growth, and apply a dedicated proofer so water beads off again.",
      "Faded black roofs can be re-coloured for an even, rich finish.",
    ],
    includes: [
      "Hand deep clean of the fabric roof",
      "Moss & algae treatment",
      "Re-colour for faded roofs",
      "Fabric reproofing",
      "Rear window & seals cleaned",
    ],
    price: "From £189",
    faqs: [quoteFaq, mobileFaq, ecoFaq],
  },

  /* --------------------------------------------------- Restoration & repair */
  {
    slug: "alloy-wheel-refurb",
    name: "Alloy Wheel Refurb",
    category: "car-restoration",
    h1: ["Alloy wheel", "refurbishment"],
    eyebrow: "Alloy Wheel Refurb · West London",
    intro:
      "Kerbed, scuffed or corroded alloys repaired and refinished to a factory look — one of the quickest ways to lift a car's appearance and resale value.",
    pill: ["Quote on request", "· send photos of each wheel"],
    hero: "ferrariWheel",
    photo: "menuWheel",
    gallery: ["jobAudiHatch", "jobCivic", "jobSubaru"],
    sectionEyebrow: "Like-New Wheels",
    sectionTitle: ["Kerb damage,", "gone"],
    body: [
      "We repair kerb rash and scuffs, colour-match the finish and seal the wheel. Diamond-cut and heavily damaged wheels are assessed individually so you know the right option upfront.",
    ],
    includes: ["Kerb rash & scuff repair", "Colour-matched refinish", "Lacquer & sealing", "Tyres cleaned & dressed"],
    faqs: [quoteFaq, mobileFaq],
  },
  {
    slug: "dent-removal",
    name: "Dent Removal & Panel Repair",
    category: "car-restoration",
    h1: ["Dent removal &", "panel repair"],
    eyebrow: "Dent Removal · West London",
    intro:
      "Car-park dings, small dents and creases repaired — often without the need for paint — restoring smooth, straight panels.",
    pill: ["Quote on request", "· assessed from your photos"],
    hero: "beading",
    photo: "paintRed",
    gallery: ["jobAudiA4", "jobAudiHatch", "jobSubaru"],
    sectionEyebrow: "Smooth Panels",
    sectionTitle: ["Dents that", "disappear"],
    body: [
      "Many small dents can be massaged out from behind the panel so the original paint stays intact. Where the paint is damaged, we repair and blend the area for an invisible finish.",
    ],
    includes: ["Small dent & ding removal", "Crease repair", "Paint-matched panel repair", "Polish & protection finish"],
    faqs: [quoteFaq, mobileFaq],
  },
  {
    slug: "bumper-scuff-repair",
    name: "Bumper Scuff & Scratch",
    category: "car-restoration",
    h1: ["Bumper scuff &", "scratch repair"],
    eyebrow: "Bumper Scuff Repair · West London",
    intro:
      "Parking scuffs, scrapes and scratches on bumpers and panels repaired and colour-matched — a smart repair that costs far less than a new bumper.",
    pill: ["Quote on request", "· smart repair, colour-matched"],
    hero: "paintRed",
    photo: "jobPolishBmw",
    gallery: ["jobCivic", "jobAudiHatch", "jobBluePaint"],
    sectionEyebrow: "Smart Repair",
    sectionTitle: ["Scuffs out,", "value back"],
    body: [
      "We prepare the damaged area, fill and smooth it, then colour-match and blend the paint so the repair is invisible. Ideal before selling or returning a lease car.",
    ],
    includes: ["Scuff & scrape repair", "Scratch filling & smoothing", "Colour-matched paint & blend", "Lacquer & polish"],
    faqs: [quoteFaq, mobileFaq],
  },
  {
    slug: "bodywork-respray",
    name: "Bodywork & Respray",
    category: "car-restoration",
    h1: ["Bodywork &", "respray"],
    eyebrow: "Bodywork & Respray · West London",
    intro:
      "Panel resprays and bodywork repairs, plus restoration of faded and oxidised paint — bringing tired bodywork back to a deep, even finish.",
    pill: ["Quote on request", "· panels, fades & oxidisation"],
    hero: "beading",
    photo: "paintRed",
    gallery: ["jobBluePaint", "job300zx", "jobSubaru"],
    sectionEyebrow: "Even, Deep Colour",
    sectionTitle: ["Bodywork brought", "back to life"],
    body: [
      "From a single panel to multiple areas, we repair, prepare and respray with colour-matched paint. Faded or oxidised paint can often be restored by machine polishing alone — we'll always recommend the least invasive fix.",
    ],
    includes: ["Panel preparation & respray", "Colour matching", "Faded paint & oxidisation restore", "Polish & protection finish"],
    faqs: [quoteFaq, mobileFaq],
  },
  {
    slug: "fleet-commercial",
    name: "Fleet & Commercial",
    category: "car-restoration",
    h1: ["Fleet & commercial", "valeting"],
    eyebrow: "Fleet & Commercial · West London",
    intro:
      "Regular, eco-friendly valeting for company cars, vans and fleets — on-site at your premises, scheduled around your working day, with one simple invoice.",
    pill: ["Free tailored quote", "· on-site at your premises"],
    hero: "bmwI3",
    photo: "toyota4x4",
    gallery: ["defender", "foamBrentford", "handWash"],
    sectionEyebrow: "Keep Your Fleet Presentable",
    sectionTitle: ["Clean vehicles,", "no downtime"],
    body: [
      "Your vehicles represent your business. We clean them where they're parked, so there's no time lost driving to a car wash, and our electric, generator-free setup is quiet enough for any site.",
      "Ideal for company car schemes, dealerships, rental fleets and van operators — talk to us about a schedule that fits.",
    ],
    includes: ["On-site visits at your premises", "Scheduled washes & valets", "Interior hygiene cleans", "Single monthly invoice", "Eco-friendly, low-water process"],
    faqs: [quoteFaq, mobileFaq, ecoFaq],
  },
];

export const getServicePage = (slug: string) => SERVICE_PAGES.find((p) => p.slug === slug);
