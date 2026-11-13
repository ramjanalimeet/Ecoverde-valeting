import Image from "next/image";
import Link from "next/link";
import { Checklist, CenterHead, FaqAccordion, MediaSplit, QuoteButton } from "./Blocks";
import { ArrowRight, ClockIcon } from "./Icons";
import IncludedDialog, { type IncludedGroup } from "./IncludedDialog";
import { DarkHero } from "./PageTemplates";
import { FinalCta } from "./Sections";
import { PHOTOS, type PhotoKey } from "@/data/images";
import { SERVICE_CATEGORIES, quoteHref, serviceHref } from "@/data/site";

export const VALET_PACKAGES: {
  name: string;
  price: string;
  photo: PhotoKey;
  time: string;
  intro: string;
  detail?: { q: string; a: string };
  includes: IncludedGroup[];
  more?: { label: string; href: string };
  service: string;
  faqs: { q: string; a: string }[];
}[] = [
  {
    name: "Mini Valet",
    price: "From £109",
    photo: "menuInterior",
    time: "Up to 90 mins",
    intro: "We understand not every car needs a full valet — if you keep yours in good shape, a light refresh brings back that spotless look. Perfect for regularly maintained vehicles.",
    includes: [{ title: "Exterior care", items: ["Full pressure wash of the exterior to safely remove dirt and grime", "Wheel arches thoroughly cleaned", "Tyres and wheel trims washed and scrubbed", "Door and boot shuts cleaned", "Hand shampoo wash with safe, premium methods", "Tyres dressed with a professional satin finish", "Exterior windows cleaned and polished streak-free", "All rubbish removed for a fresh finish"] }, { title: "Interior care", items: ["Detailed vacuum of the entire interior and boot", "Seats, upholstery & carpets vacuumed clean", "Floor mats scrubbed and cleaned", "Interior plastics professionally cleaned", "Dashboard and centre console carefully detailed", "Interior windows cleaned and polished clear"] }],
    service: "valeting-service",
    faqs: [
      { q: "How long does a Mini Valet take?", a: "Around 60–90 minutes for most cars, depending on size and how much attention the interior needs." },
      { q: "Is the Mini Valet a deep clean?", a: "No — it's a thorough refresh for cars that are cleaned regularly. If your car needs stains, odours or upholstery tackled, the Deluxe Full Valet or Interior Deep Clean is the better choice." },
      { q: "Do you come to me?", a: "Yes. We're fully mobile across West London and bring our own water and power, so we can valet your car at home, at work or on the street." },
    ],
  },
  {
    name: "Deluxe Full Valet",
    price: "From £189",
    photo: "fiat",
    time: "Up to 2 hrs",
    intro: "Our deluxe deep clean — inside and out — for when the car needs a complete reset.",
    detail: {
      q: "When should I choose a Deluxe Full Valet instead of a Mini Valet?",
      a: "If your car needs more than a routine clean, our Deluxe Full Valet provides a thorough interior and exterior deep clean at your home or workplace in West London. Starting from £189, this service is designed for drivers who want to refresh their vehicle's appearance and tackle accumulated dirt. The service typically takes up to 2 hours, although larger or heavily soiled vehicles may require additional time. If you're unsure which package suits your car, send us a photo for a free, personalised recommendation.",
    },
    includes: [{ title: "Exterior care", items: ["Everything in the Mini Valet exterior", "pH-neutral snow foam pre-wash and two-bucket hand wash", "Wheels deep cleaned, inside and out", "Door shuts, sills and fuel flap cleaned", "Wax or sealant applied to protect the paintwork", "Plastics and trims dressed"] }, { title: "Interior care", items: ["Everything in the Mini Valet interior", "Steam clean & sanitise vents, seams and cup holders", "Upholstery and carpets shampooed", "Leather cleaned and conditioned", "Boot and seat rails fully cleaned", "Door cards and pockets detailed"] }],
    service: "valeting-service",
    faqs: [
      { q: "How long does a Deluxe Full Valet take?", a: "Up to 2 hours for most cars. Larger or heavily soiled vehicles can take longer, which is why we quote from photos first." },
      { q: "Do I need to provide water or electricity?", a: "No. Our electric van carries everything we need — no hoses from your house and no generator noise." },
      { q: "Will this service remove all stains and odours?", a: "Most everyday stains and smells come out with shampoo and steam. Deeply set stains, smoke or mould may need our Interior Deep Clean Valet, and we'll tell you honestly before we start." },
      { q: "How often should I book a Deluxe Full Valet?", a: "Every 3–6 months suits most drivers, with Mini Valets or washes in between. Our maintenance packages can schedule this for you." },
    ],
  },
  {
    name: "Interior Deep Clean Valet",
    price: "From £189",
    photo: "interiorWheel",
    time: "2–4 hrs",
    intro: "When a standard valet isn't enough — months of build-up, stubborn stains or lingering odours. A full interior reset with steam, shampoo & sanitising.",
    includes: [{ title: "Interior care", items: ["Full vacuum including boot and under seats", "Steam sanitisation of every surface", "Seats and carpets shampooed with hot-water extraction", "Stain treatment on fabrics and carpets", "Odour treatment — ozone on request", "Leather cleaned, conditioned and protected", "Headlining spot-cleaned", "Interior glass streak-free"] }, { title: "Optional extras", items: ["Exterior hand wash", "Mould treatment for damp cabins"] }],
    service: "interior-deep-clean",
    faqs: [
      { q: "Will this service clean the whole interior?", a: "Yes — seats, carpets, mats, door cards, dashboard, vents, headlining spot-cleaning, boot and glass, all steam sanitised." },
      { q: "How long does it take?", a: "Usually 2–4 hours depending on the size of the car and its condition, plus drying time for shampooed fabrics." },
      { q: "Does it include exterior cleaning?", a: "It's an interior-focused service. You can add an exterior hand wash, or choose the Extreme Full Plus Valet for both." },
    ],
  },
  {
    name: "Extreme Full Plus Valet",
    price: "From £239",
    photo: "defender",
    time: "Up to 4 hrs",
    intro: "An even more thorough, bespoke clean & detail of your exterior & interior. More than a clean — protect your car's value, including leather care and spray-on wax.",
    includes: [{ title: "Exterior care", items: ["Everything in the Deluxe Full Valet exterior", "Iron fallout and tar removal", "Clay bar decontamination where needed", "Engine bay wipe-down", "Spray-on wax for extra gloss and protection", "Tyres, trims and exterior plastics dressed"] }, { title: "Interior care", items: ["Everything in the Deluxe Full Valet interior", "Leather deep clean, condition and protect", "Extra attention to vents, seams and switchgear", "Odour treatment", "Interior protectant on plastics"] }],
    service: "valeting-service",
    faqs: [
      { q: "Who is this service for?", a: "Drivers who want more than a full valet — cars that haven't been cleaned in a long time, enthusiasts who want a detailed finish, or anyone preparing the car for something special." },
      { q: "How long does it take?", a: "Up to 4 hours for most cars. We'll confirm timing when we quote from your photos." },
      { q: "Is it the same as a detail?", a: "It's our most complete valet. Paint correction and ceramic coating are separate detailing services that can be added on." },
    ],
  },
  {
    name: "Post-Purchase / Pre-Sale Valet",
    price: "From £289",
    photo: "ctaFoam",
    time: "3–5 hrs",
    intro: "Start fresh with a professionally cleaned vehicle — showroom-ready before you buy, sell or hand back a lease. A complete reset, inside and out.",
    includes: [{ title: "Exterior care", items: ["Full exterior wash and decontamination", "Gloss enhancement for listing photos and viewings", "Wheels, arches and tyres deep cleaned", "Door shuts, sills and boot shuts detailed"] }, { title: "Interior care", items: ["Interior deep clean, steam and shampoo", "Smoke, pet, damp and food odour treatment", "Boot, door cards and seat rails detailed", "Advice on minor repairs before sale or handback"] }],
    more: { label: "Pre-Sale details", href: "/services/pre-sale-valet" },
    service: "pre-sale-valet",
    faqs: [
      { q: "Why book a Post-Purchase Valet?", a: "You don't know how the last owner used the car. A full reset removes their dirt, bacteria and smells so you start fresh and hygienic." },
      { q: "How long does it take?", a: "Usually 3–5 hours, depending on the size and condition of the car." },
    ],
  },
  {
    name: "Soft-Top Decontamination & Proofing",
    price: "From £189",
    photo: "softTop",
    time: "Around 2 hrs",
    intro: "A full decontamination of your convertible roof. A deep extraction clean lifts ingrained dirt, algae and mould out of the fabric, then a premium proofer protects it against rain, UV and future staining.",
    includes: [{ title: "Roof care", items: ["Hand deep clean of the fabric roof", "Moss, algae and mould treatment", "Extraction to lift ingrained dirt", "Premium reproofing against rain and UV", "Rear window and seals cleaned"] }],
    more: { label: "Soft-Top details", href: "/services/soft-top-cleaning" },
    service: "soft-top-cleaning",
    faqs: [
      { q: "How often does a soft top need reproofing?", a: "Most roofs benefit from a deep clean twice a year and reproofing about once a year — more often if the car is parked outside." },
      { q: "Is it safe for mohair and canvas roofs?", a: "Yes. We clean by hand with products suited to the fabric and never use a pressure washer on the roof, which can damage seams." },
    ],
  },
];

const RELATED = [
  { label: "Lease Return Valet", href: "/services/lease-return-valet" },
  { label: "Ultimate Pre-Sale Valet", href: "/services/pre-sale-valet" },
  { label: "Monthly Valeting Plans", href: "/services/maintenance-packages" },
  { label: "Interior Deep Clean, Steam & Mould", href: "/services/mould-odour-removal" },
  { label: "Soft-Top Cleaning & Proofing", href: "/services/soft-top-cleaning" },
  { label: "Fleet & Commercial Valeting", href: "/services/fleet-commercial" },
];

export default function ValetingPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: VALET_PACKAGES.flatMap((p) => [...(p.detail ? [p.detail] : []), ...p.faqs]).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <DarkHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Valeting Service" }]}
        eyebrow="Valeting Service"
        title={["Mobile car", "valeting", ", brought to your door"]}
        intro="A thorough deep clean inside and out — from a quick refresh to our deluxe full valet. Fully mobile across West London, using eco-friendly products only."
        pill={["From £109", "· free tailored quote"]}
        updated="November 2026"
        image={PHOTOS.interiorWheel.src}
        service="valeting-service"
      />

      <MediaSplit photo="handWash" eyebrow="What's Included" title={["A spotless finish,", "inside & out"]} tone="soft">
        <h3 className="msplit__q">What does a professional mobile car valet include?</h3>
        <p>
          At Ecoverde Valeting, we bring professional car cleaning directly to your home or workplace across West London. Our
          valeting services include exterior hand washing, wheel cleaning, interior vacuuming, steam sanitisation and specialist
          treatments depending on your chosen package. We use biodegradable cleaning products and professional equipment to give
          your vehicle a thorough, hygienic clean without requiring a trip to the car wash. Prices start from £109 for a Mini
          Valet, with free quotations tailored to your vehicle.
        </p>
        <p>
          Professional mobile car valeting across West London, with Mini Valets starting from £109 and taking approximately 60–90
          minutes, Deluxe Full Valets from £189 taking up to 2 hours, and Extreme Full Plus Valets from £239 taking approximately
          3–4 hours. Every service uses biodegradable cleaning products and professional equipment. Prices reviewed: November 2026.
        </p>
        <Checklist
          items={[
            "Exterior hand wash, wheels, tyres & glass",
            "Full interior vacuum, steam clean & sanitise",
            "Upholstery & carpet shampoo, leather conditioning",
            "Stain & odour removal, mould treatment",
            "Wax or sealant finish to protect the paintwork",
          ]}
        />
        <QuoteButton service="valeting-service" />
      </MediaSplit>

      <section className="section section--soft" aria-labelledby="packages-title">
        <div className="container">
          <CenterHead
            eyebrow="Valet Packages"
            title={["Choose your", "level of clean"]}
            id="packages-title"
            intro="Prices are a guide and depend on your car's size and condition — every quote is free and tailored."
          />
          <div className="vpacks">
            {VALET_PACKAGES.map((p) => {
              const ph = PHOTOS[p.photo];
              return (
                <article key={p.name} className="vpack">
                  <div className="vpack__card">
                    <div className="vpack__img">
                      <Image src={ph.src} alt={ph.alt} fill sizes="(max-width: 900px) 100vw, 380px" />
                      <span className="scard__price">{p.price}</span>
                    </div>
                    <div className="vpack__body">
                      <h3>{p.name}</h3>
                      {p.detail ? (
                        <>
                          <p className="vpack__q">{p.detail.q}</p>
                          <p>{p.detail.a}</p>
                        </>
                      ) : (
                        <p>{p.intro}</p>
                      )}
                      <p className="vpack__time">
                        <ClockIcon width={13} height={13} /> {p.time}
                      </p>
                      <Link className="btn btn--primary btn--block btn--sm" href={quoteHref(p.service)}>
                        Get a Free Quote
                      </Link>
                      <IncludedDialog name={p.name} groups={p.includes} quoteHref={quoteHref(p.service)} />
                      {p.more && (
                        <Link className="vpack__more" href={p.more.href}>
                          {p.more.label} <ArrowRight width={13} height={13} />
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="vpack__faqs">
                    <h3 className="vpack__faqtitle">
                      {p.name} — FAQs
                    </h3>
                    <FaqAccordion faqs={p.faqs} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--glow" aria-labelledby="other-title">
        <div className="container">
          <CenterHead eyebrow="Explore More" title={["Other", "services"]} id="other-title" />
          <ul className="services-grid">
            {SERVICE_CATEGORIES.filter((c) => c.slug !== "valeting-service").map((c) => (
              <li key={c.slug} className="scard">
                <Link href={serviceHref(c.slug)} className="scard__media" tabIndex={-1} aria-hidden="true">
                  <Image src={c.image} alt="" fill sizes="(max-width: 640px) 100vw, 300px" />
                </Link>
                <div className="scard__body">
                  <h3>
                    <Link href={serviceHref(c.slug)}>{c.label}</Link>
                  </h3>
                  <p>{c.blurb}</p>
                  <Link className="link-arrow" href={serviceHref(c.slug)}>
                    View service <ArrowRight width={14} height={14} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          <div className="related-chips">
            <p className="eyebrow">Specialist Services</p>
            <h2>
              Related <em>specialist</em> services
            </h2>
            <ul className="chips chips--links">
              {RELATED.map((r) => (
                <li key={r.label}>
                  <Link href={r.href}>{r.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section used" aria-labelledby="used2-title">
        <div className="container">
          <h2 id="used2-title">Just bought a used car?</h2>
          <p className="lead">
            Our Used Car Fresh Start Valet deep cleans and steam sanitises the whole interior, then treats smoke, pet, damp and food
            smells at the source rather than covering them up. Fully mobile across West London, from £189.
          </p>
          <FaqAccordion
            cols={2}
            faqs={[
              {
                q: "Why valet a used car after buying it?",
                a: "You don't know how the last owner used it. Seats, carpets, vents and the steering wheel hold dirt, bacteria and old smells, so a deep clean and steam sanitisation gives you a hygienic start.",
              },
              { q: "How long does it take?", a: "Usually 2 to 4 hours, depending on the size of the car and its condition." },
            ]}
          />
        </div>
      </section>

      <section className="maint-note">
        <div className="container">
          <p>
            If you would rather not book each valet one at a time, our{" "}
            <Link href="/services/maintenance-packages">maintenance packages</Link> cover regular visits on a set schedule, from £75
            a month.
          </p>
        </div>
      </section>

      <FinalCta
        title="Book your eco valet today"
        text="Send a quick photo of your car for a free, tailored quote. Fully mobile across West London, 7 days a week."
        whatsapp={false}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
