// Central photo library: one place for every photo's path, size and alt text,
// so the same image is described the same way on every page.

export type Photo = { src: string; alt: string; w: number; h: number; caption: string };

const p = (file: string, w: number, h: number, alt: string, caption: string): Photo => ({ src: `/images/${file}`, w, h, alt, caption });

export const PHOTOS = {
  heroBmw: p("hero-green-bmw-valeted-west-london-1440.webp", 1440, 785, "Freshly valeted dark green BMW parked on a tree-lined, white stucco street in West London", "Green BMW after a full valet"),

  menuInterior: p("menu-valeting-clean-car-interior.webp", 440, 308, "Spotless luxury car interior with leather seats and wood trim after a valet", "Clean luxury interior"),
  menuPolish: p("menu-car-detailing-machine-polish.webp", 440, 308, "Machine polisher bringing a deep gloss to dark blue paintwork", "Machine polish to a deep gloss"),
  menuRinse: p("menu-mobile-car-wash-pressure-rinse.webp", 440, 308, "Pressure rinse lifting snow foam off a blue car during a mobile car wash", "Mobile wash rinse"),
  menuWheel: p("menu-alloy-wheel-restoration.webp", 440, 308, "Gloved hands cleaning a refurbished multi-spoke alloy wheel", "Alloy wheel restoration"),

  handWash: p("hand-wash-mini-full-valet.webp", 800, 534, "Ecoverde valeter hand-washing a black car with a sheepskin wash mitt during a mobile valet", "Hand wash during a full valet"),
  snowFoamBlack: p("premium-detailing-snow-foam-black-car.webp", 800, 534, "Black saloon covered in pH-neutral snow foam during a premium detail", "Snow foam pre-wash"),
  ceramicBeading: p("ceramic-coating-water-beading-red-paint.webp", 800, 534, "Water beading on red paintwork after a ceramic coating", "Ceramic coating beading"),
  interiorWheel: p("interior-deep-clean-steering-wheel.webp", 800, 534, "Valeter cleaning the steering wheel and dashboard during an interior deep clean", "Interior deep clean"),
  softTop: p("soft-top-convertible-roof-cleaning.webp", 686, 386, "Gloved hand cleaning a convertible fabric soft-top roof on a red sports car", "Soft-top roof clean"),
  ferrariWheel: p("alloy-wheel-refurbishment-ferrari.webp", 800, 535, "Refurbished Ferrari alloy wheel with a red brake caliper", "Ferrari alloy wheel"),
  foamBrentford: p("snow-foam-valet-brentford.webp", 800, 467, "Valeter spraying eco-friendly snow foam over a car in Brentford", "Snow foam valet in Brentford"),
  mould: p("mould-car-interior-before-cleaning.webp", 800, 534, "Mould-covered car seats and dashboard before an eco steam clean", "Mould before the steam clean"),
  paintRed: p("machine-polish-paint-correction-red-car.webp", 900, 651, "Machine polisher restoring gloss to red paintwork during paint correction", "Paint correction on red paint"),

  vacuumSeat: p("interior-vacuum-seat-clean.webp", 424, 351, "Ecoverde valeter vacuuming a fabric car seat during an interior clean", "Interior vacuum"),

  ecoBand: p("eco-snow-foam-wash-4x4.webp", 1200, 670, "Valeter applying eco-friendly snow foam to a 4x4 with a hand sprayer", "Eco snow foam wash"),
  beading: p("water-beading-blue-paintwork.webp", 1400, 1046, "Water beading on freshly protected dark blue paintwork", "Protected blue paintwork"),
  ctaFoam: p("snow-foam-pre-wash-cta.webp", 1400, 782, "Snow foam being sprayed over a car before a hand wash", "Snow foam pre-wash"),
  john: p("john-muriel-founder-ecoverde-van.webp", 800, 584, "John Muriel, founder of Ecoverde Valeting, standing beside the branded Ecoverde valeting van", "John and the Ecoverde van"),

  fiat: p("fiat-500-eco-valet-driveway.webp", 540, 1200, "White Fiat 500 gleaming on a gravel driveway after a full eco valet", "Fiat 500 after an eco valet"),
  softTopBA: p("soft-top-roof-before-after.webp", 800, 601, "Convertible soft-top roof half cleaned, showing the before and after", "Soft-top before & after"),
  taycan: p("porsche-taycan-valet-at-home.webp", 800, 450, "Red Porsche Taycan valeted on a residential street beside the Ecoverde van", "Porsche Taycan valeted at home"),
  bmwI3: p("bmw-i3-snow-foam-ecoverde-van.webp", 800, 360, "BMW i3 covered in snow foam beside the Ecoverde electric van", "BMW i3 snow foam wash"),
  defender: p("land-rover-defender-snow-foam.webp", 1000, 449, "Land Rover Defender being snow-foamed on a driveway beside the Ecoverde van", "Defender snow foam wash"),
  toyota4x4: p("toyota-4x4-mobile-valet-snow-foam.webp", 1000, 450, "Toyota 4x4 covered in snow foam during a mobile valet on the street", "4x4 mobile valet"),

  jobCivic: p("job-honda-civic-type-r-valet.webp", 512, 288, "Yellow Honda Civic Type R after a mobile valet outside a West London home", "Honda Civic Type R valet"),
  jobPolishBmw: p("job-machine-polishing-silver-bmw.webp", 384, 512, "Ecoverde valeter machine polishing the rear of a silver BMW hatchback", "Machine polish on a BMW"),
  jobPorsche718: p("job-red-porsche-718-detail.webp", 384, 512, "Red Porsche 718 gleaming after a full detail on a West London street", "Porsche 718 detail"),
  jobAudiA4: p("job-audi-a4-avant-valet.webp", 512, 384, "Grey Audi A4 Avant estate after a full valet on a residential driveway", "Audi A4 Avant full valet"),
  jobAudiHatch: p("job-audi-hatchback-full-valet.webp", 512, 384, "Blue-grey Audi hatchback with fresh gloss after a full valet on a block-paved driveway", "Audi hatchback full valet"),
  jobSubaru: p("job-subaru-impreza-sti-detail.webp", 512, 384, "Blue Subaru Impreza WRX STI with rear wing after an exterior detail", "Subaru Impreza STI detail"),
  jobTesla: p("job-tesla-model-s-detailing.webp", 512, 384, "Detailer polishing the side of a dark blue Tesla Model S at the kerbside", "Tesla Model S detailing"),
  jobMr2: p("job-toyota-mr2-classic-valet.webp", 384, 512, "Silver classic Toyota MR2 after a valet, with the Ecoverde valeter beside it", "Classic Toyota MR2 valet"),
  job300zx: p("job-nissan-300zx-classic-detail.webp", 384, 512, "Red classic Nissan 300ZX freshly detailed on a block-paved drive", "Nissan 300ZX classic detail"),
  jobBluePaint: p("job-blue-paint-gloss-finish.webp", 512, 384, "Mirror-like reflections in deep blue paintwork after machine polishing", "Mirror gloss finish"),
  jobSupercar: p("job-yellow-supercar-hand-finish.webp", 512, 282, "Gloved hand wiping down the yellow bodywork of a supercar with a microfibre cloth", "Supercar hand finish"),
  jobPorsche911: p("job-black-porsche-911-cabriolet.webp", 384, 512, "Black Porsche 911 Cabriolet valeted on a white stucco street in West London", "Porsche 911 Cabriolet valet"),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

const BY_SRC = new Map(Object.values(PHOTOS).map((x) => [x.src, x]));
/** Alt text for any library image path (falls back to the given text). */
export const altFor = (src: string, fallback = "") => BY_SRC.get(src)?.alt ?? fallback;

/** Wide, high-resolution photos that work as full-width page heroes. */
export const HERO_POOL: PhotoKey[] = ["heroBmw", "ctaFoam", "ecoBand", "defender", "toyota4x4", "bmwI3", "taycan", "beading"];

/** Real customer jobs. */
export const JOB_KEYS: PhotoKey[] = [
  "jobCivic", "jobPolishBmw", "jobPorsche718", "jobAudiA4", "jobAudiHatch", "jobSubaru",
  "jobTesla", "jobMr2", "job300zx", "jobBluePaint", "jobSupercar", "jobPorsche911",
];

/** Stable pick based on a string (e.g. an area slug), so each page always shows the same photos. */
export function pickFor(seed: string, pool: PhotoKey[], n: number): PhotoKey[] {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const out: PhotoKey[] = [];
  for (let i = 0; out.length < Math.min(n, pool.length) && i < pool.length * 3; i++) {
    const k = pool[(h + i * 7) % pool.length];
    if (!out.includes(k)) out.push(k);
  }
  return out;
}
