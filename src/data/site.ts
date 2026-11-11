// Single source of truth for site content. Verify prices, review counts and
// contact details with the business before publishing — see README.

export const SITE = {
  name: "Ecoverde Valeting",
  legalName: "Ecoverde Valeting & Detailing Service",
  tagline: "Eco-friendly mobile car valeting & detailing · West London",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ecoverdevaleting.co.uk",
  reviewsUrl: process.env.NEXT_PUBLIC_REVIEWS_URL || "",
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
export type MenuGroup = { title: string; slug: string; items: MenuService[] };

export const SERVICE_MENU: MenuGroup[] = [
  {
    title: "Valeting Service",
    slug: "valeting",
    items: [
      { label: "Mini & Full Valet", slug: "mini-full-valet" },
      { label: "Interior Deep Clean & Steam", slug: "interior-deep-clean" },
      { label: "Mould & Odour Removal", slug: "mould-odour-removal" },
      { label: "Lease Return Valet", slug: "lease-return-valet" },
      { label: "Pre-Sale Valet", slug: "pre-sale-valet" },
      { label: "Used Car Valet", slug: "used-car-valet" },
      { label: "Maintenance Packages", slug: "maintenance-packages" },
      { label: "Gift Vouchers", slug: "gift-vouchers" },
      { label: "Soft-Top Cleaning & Proofing", slug: "soft-top-cleaning" },
      { label: "Fleet & Commercial Valeting", slug: "fleet-commercial" },
    ],
  },
  {
    title: "Car Detailing",
    slug: "detailing",
    items: [
      { label: "Paint Correction & Machine Polishing", slug: "paint-correction" },
      { label: "Ceramic Coating & Paint Protection", slug: "ceramic-coating" },
      { label: "Supercar Detailing", slug: "supercar-detailing" },
      { label: "Classic Car Detailing", slug: "classic-car-detailing" },
      { label: "Leather & Upholstery Detailing", slug: "leather-upholstery" },
    ],
  },
  {
    title: "Mobile Car Wash",
    slug: "car-wash",
    items: [
      { label: "Exterior Basic Wash", slug: "exterior-basic-wash" },
      { label: "Exterior + Interior Wash", slug: "exterior-interior-wash" },
      { label: "Premium Wash & Shine", slug: "premium-wash-shine" },
      { label: "Full Wash & Refresh", slug: "full-wash-refresh" },
    ],
  },
  {
    title: "Car Restoration",
    slug: "restoration",
    items: [
      { label: "Alloy Wheel Refurbishment", slug: "alloy-wheel-refurb" },
      { label: "Dent Removal & Panel Repair", slug: "dent-removal" },
      { label: "Bumper Scuff & Scratch Repair", slug: "bumper-scuff-repair" },
      { label: "Bodywork & Respray", slug: "bodywork-respray" },
      { label: "Faded Paint & Oxidisation Restore", slug: "faded-paint-restore" },
    ],
  },
];

export const ALL_MENU_SERVICES = SERVICE_MENU.flatMap((g) => g.items);

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
};

export const SERVICES: ServiceCard[] = [
  {
    title: "Mini & Full Valets",
    price: "From £109",
    category: "Valeting",
    description:
      "Inside-and-out valets — from a tidy mini valet to our deluxe full valet. Vacuum, steam, deep clean, protect and finish.",
    image: "/images/svc-full-valet.webp",
    alt: "Car being rinsed with a pressure washer during a full valet",
    formValue: "mini-full-valet",
  },
  {
    title: "Premium & Supercar Detailing",
    price: "From £289",
    category: "Detailing",
    description:
      "Meticulous, multi-stage detailing for classics, supercars and high-end vehicles — the perfectionist's choice.",
    image: "/images/svc-supercar.webp",
    alt: "Black Porsche 911 GT3 with a deep gloss finish",
    formValue: "supercar-detailing",
  },
  {
    title: "Paint Correction & Ceramic",
    price: "From £289",
    category: "Paintwork",
    description:
      "Machine polishing, swirl & scratch removal, paint enhancement and long-lasting ceramic coating protection.",
    image: "/images/svc-paint-ceramic.webp",
    alt: "Close-up of glossy corrected red paintwork",
    formValue: "paint-correction",
  },
  {
    title: "Interior Deep Clean & Steam",
    price: "From £189",
    category: "Interior",
    description:
      "Steam sanitisation, stain & odour removal, mould treatment and ozone — a fresh, hygienic, allergy-friendly cabin.",
    image: "/images/svc-interior.webp",
    alt: "Clean black leather seats and steering wheel after an interior deep clean",
    formValue: "interior-deep-clean",
  },
  {
    title: "Soft-Top Cleaning & Proofing",
    price: "From £189",
    category: "Specialist",
    description:
      "Convertible roof deep clean, re-colour and re-proofing to keep fabric tops protected from the British weather.",
    image: "/images/svc-soft-top.webp",
    alt: "Red sports car parked on a London street",
    formValue: "soft-top-cleaning",
  },
  {
    title: "Restoration & Refurb",
    price: "Quote on request",
    category: "Restoration",
    description:
      "Alloy wheel refurbishment, dent & scuff repair and bodywork respraying — restore resale value before you sell.",
    image: "/images/svc-restoration.webp",
    alt: "Technician working on a car during restoration",
    formValue: "bodywork-respray",
  },
  {
    title: "Lease Return & Post-Purchase Valet",
    price: "From £289",
    category: "Valeting",
    description:
      "Handing a lease back? We deep clean the areas inspectors check to help you avoid end-of-lease charges. Just bought used? A full reset removes the previous owner's dirt, stains & odours.",
    image: "/images/svc-lease-return.webp",
    alt: "Black Range Rover Sport parked outside a garage",
    formValue: "lease-return-valet",
  },
  {
    title: "Mould & Odour Removal",
    price: "Quote on request",
    category: "Interior",
    description:
      "Mould thrives in damp cabins — we remove it at the source with eco-friendly steam sanitisation, stain treatment and ozone for stubborn, deeply embedded odours.",
    image: "/images/svc-mould-odour.webp",
    alt: "Clean car dashboard and cabin",
    formValue: "mould-odour-removal",
  },
  {
    title: "Machine Polishing & Paint Protection",
    price: "From £189",
    category: "Paintwork",
    description:
      "Single or multi-stage machine polish to lift swirls and restore gloss — finished with wax, sealant or ceramic to lock in the shine.",
    image: "/images/svc-machine-polish.webp",
    alt: "Grey Mercedes-AMG GT with polished paintwork",
    formValue: "paint-correction",
  },
];

export const BRANDS = ["IGL Coatings", "Ecover", "Gtechniq", "Bilt Hamber", "Autoglym"];

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

// NOTE: stock placeholders — replace with genuine Ecoverde job photos before launch.
export const GALLERY = [
  { src: "/images/gal-1.webp", alt: "White Tesla Model Y after an exterior valet", caption: "Exterior car detailing result in West London" },
  { src: "/images/gal-2.webp", alt: "Black Porsche Panamera on the road after a valet", caption: "Porsche valeted at home by our mobile van" },
  { src: "/images/gal-3.webp", alt: "Red BMW M4 with freshly polished paint", caption: "Paint enhancement and scratch removal" },
  { src: "/images/gal-4.webp", alt: "Mercedes G-Class on a cobbled street", caption: "Eco-friendly snow foam car wash" },
  { src: "/images/gal-5.webp", alt: "Silver BMW M5 after a full valet", caption: "Mobile car valeting in progress" },
  { src: "/images/gal-6.webp", alt: "Black Audi RS saloon after a deep clean", caption: "Car interior deep clean after an eco valet" },
  { src: "/images/gal-7.webp", alt: "Orange classic Volkswagen Beetle", caption: "Classic car detailing" },
  { src: "/images/gal-8.webp", alt: "Orange Lamborghini Huracán in a garage", caption: "Supercar detail and protection" },
];

export const PRIMARY_AREAS = [
  { name: "Brentford", postcode: "TW8" },
  { name: "Ladbroke Grove", postcode: "W10" },
];

export const AREAS = [
  "Chiswick W4", "Ealing W5", "Hammersmith W6", "Shepherd's Bush W12", "Notting Hill W11",
  "Kensington SW7", "Maida Vale W9", "Kensal Rise", "Acton", "Westminster", "South Kensington",
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
      { label: "About Us", href: "/#about" },
      { label: "Why Choose Us", href: "/#why" },
    ],
  },
  { label: "Services", mega: true as const },
  {
    label: "Service Areas",
    children: [
      { label: "Ladbroke Grove (W10)", href: "/#areas" },
      { label: "Brentford (TW8)", href: "/#areas" },
      { label: "All areas we cover", href: "/#areas" },
    ],
  },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/#quote" },
];
