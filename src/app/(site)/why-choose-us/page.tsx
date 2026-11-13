import type { Metadata } from "next";
import Link from "next/link";
import { Badges, CenterHead, Checklist, DarkBand, IconCards, MediaSplit, StepsCard } from "@/components/Blocks";
import { DarkHero } from "@/components/PageTemplates";
import { FinalCta } from "@/components/Sections";
import { PHOTOS } from "@/data/images";

export const metadata: Metadata = {
  title: "Why Choose Ecoverde — Mobile Car Detailing London",
  description:
    "Why West London drivers choose Ecoverde: 8+ years' experience, 560+ five-star reviews, fully insured, eco-friendly products and showroom results at your door.",
  alternates: { canonical: "/why-choose-us" },
};

export default function WhyPage() {
  return (
    <>
      <DarkHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Why Choose Us" }]}
        eyebrow="Why Choose Us"
        title={["Why choose Ecoverde for mobile car detailing & valeting", "in London"]}
        intro="Looking for a trusted mobile car detailing & valeting service in London? Ecoverde delivers showroom results at your doorstep using eco-friendly methods and meticulous processes."
        image={PHOTOS.bmwI3.src}
        ctas={false}
      />

      <section className="section section--soft why-intro" aria-labelledby="why-intro">
        <div className="container">
          <Badges
            items={[
              { icon: "shield", label: "Licensed & Insured" },
              { icon: "sparkle", label: "Detailing Experts" },
              { icon: "award", label: "Certified Installers" },
            ]}
          />
          <CenterHead
            eyebrow="Trusted Across West London"
            title={["Showroom results,", "at your doorstep"]}
            id="why-intro"
            intro="With 8+ years of experience, thousands of vehicles restored, and hundreds of 5-star reviews, London drivers rely on us for paint perfection and hygienic interiors — backed by Checkatrade verification and full insurance for your peace of mind."
          />
        </div>
      </section>

      <MediaSplit photo="john" eyebrow="Experience" title={["Experience you can", "see and feel"]} tone="glow">
        <p>
          At Ecoverde Valeting, we bring years of hands-on experience in professional mobile car valeting and detailing across
          Ladbroke Grove, Brentford and West London. We&apos;ve worked on everything from high-end vehicles to family cars —
          always delivering showroom-quality results.
        </p>
        <p>
          Our experience isn&apos;t just about cleaning cars; it&apos;s about protecting your investment and restoring pride in
          your vehicle. We combine eco-friendly products, advanced detailing tools and first-class craftsmanship to create the
          kind of finish that genuine expertise delivers.
        </p>
      </MediaSplit>

      <MediaSplit photo="vacuumSeat" eyebrow="Local Authority" title={["Authority in local", "mobile car care"]} reverse tone="soft">
        <p>
          We&apos;re not a distant franchise — we&apos;re your local West London experts, proudly serving the communities of
          Ladbroke Grove, Brentford, Shepherd&apos;s Bush, Hammersmith and beyond. Our reputation has grown through:
        </p>
        <Checklist
          items={[
            <>
              <strong>Verified Google Business Profile reviews</strong> from real West London customers.
            </>,
            <>
              <strong>Long-standing partnerships</strong> with local dealerships and private owners.
            </>,
            <>
              <strong>Mentions in local business directories</strong> and West London service listings.
            </>,
          ]}
        />
        <p>
          When people in West London search &ldquo;best mobile car valeting near me&rdquo;, Ecoverde stands out as a trusted,
          authoritative provider because of our verified local presence and reputation for reliability.
        </p>
      </MediaSplit>

      <section className="section section--soft" aria-labelledby="why-promise">
        <div className="container">
          <CenterHead
            eyebrow="Our Local Service Promise"
            title={["Smarter car care for", "West London life"]}
            id="why-promise"
            intro="We understand that West London's mix of urban traffic, tight parking and unpredictable weather demands a smarter approach to car care. That's why we bring the full valet service directly to your door — whether you're parked on a side street in Ladbroke Grove, outside a townhouse in Brentford, or managing a fleet in Chiswick or Kensington."
          />
          <IconCards
            items={[
              { icon: "van", title: "Fully Mobile Setup", text: "We arrive with our own power and water — nothing needed from you." },
              { icon: "clock", title: "Punctual & Efficient", text: "Punctual arrival and efficient completion, planned around your day." },
              { icon: "sparkle", title: "Professional-Grade Kit", text: "Professional-grade equipment and materials on every single job." },
              { icon: "thumb", title: "Satisfaction Guarantee", text: "A satisfaction guarantee on every booking — we don't leave until you're happy." },
            ]}
          />
        </div>
      </section>

      <DarkBand eyebrow="Trustworthy, Transparent & Eco-Friendly" title={["No hidden fees. No shortcuts.", "No chemical waste."]}>
        <p className="dband__lead">
          Our name — Ecoverde — represents more than clean cars. It&apos;s our promise to deliver eco-responsible detailing
          without compromising quality. We use biodegradable, non-abrasive products and conserve water through efficient mobile
          systems, helping to protect both your vehicle&apos;s finish and the environment. Just honest work, transparent pricing
          and exceptional care — the values that earn customer loyalty.
        </p>
      </DarkBand>

      <MediaSplit photo="paintRed" eyebrow="Expertise" title={["Expertise built on precision", "and passion"]} tone="mint">
        <p>Every Ecoverde technician is trained to the highest industry standards in mobile car valeting and detailing. We specialise in:</p>
        <Checklist
          items={[
            <>
              <strong>Paint correction and ceramic protection</strong> for a flawless, lasting finish.
            </>,
            <>
              <strong>Interior deep cleaning and sanitisation</strong> for a hygienic, fresh cabin.
            </>,
            <>
              <strong>Eco-friendly waterless valeting</strong> options that save hundreds of litres per wash.
            </>,
            <>
              <strong>Premium waxing and polishing</strong> techniques used on prestige and classic cars.
            </>,
          ]}
        />
        <p>
          Our attention to detail and consistent results demonstrate true expertise — skill and technical mastery proven through
          consistent, verifiable outcomes.
        </p>
      </MediaSplit>

      <section className="section section--glow" aria-labelledby="why-diff">
        <div className="container">
          <CenterHead
            eyebrow="What Makes Us Different"
            title={["We don't just clean cars —", "we care for them"]}
            id="why-diff"
            intro="Unlike quick-wash operations, our service stands out because:"
          />
          <IconCards
            items={[
              { icon: "leaf", title: "Eco-Conscious Detailing", text: "We deliver eco-conscious detailing at your doorstep — biodegradable products, low-water methods." },
              { icon: "star", title: "Locally Trusted", text: "We're locally trusted with verified five-star reviews across Google, Checkatrade and more." },
              { icon: "heart", title: "A Personal Touch", text: "We combine technical precision with a personal touch — you deal with John, not a call centre." },
            ]}
          />
        </div>
      </section>

      <StepsCard
        eyebrow="How Our Mobile Service Works"
        title={["Simple, transparent,", "done right"]}
        steps={[
          { title: "Book & share details", text: "Tell us about your vehicle, your location and what you need — online or on WhatsApp." },
          { title: "On-site assessment", text: "We assess your car in person and agree a tailored service plan and price with you." },
          { title: "Precision detailing", text: "Meticulous work with pro-grade, eco-friendly products — at your home or office." },
          { title: "Walkthrough & aftercare", text: "A final walkthrough plus aftercare tips so that showroom gloss lasts and lasts." },
        ]}
      />

      <section className="section section--soft" aria-labelledby="why-packages">
        <div className="container">
          <CenterHead eyebrow="Clear, Value-Focused Packages" title={["A package for every car", "and budget"]} id="why-packages" />
          <IconCards
            link
            items={[
              { icon: "refresh", title: "Maintenance Valet", text: "A fast refresh for regularly cared-for vehicles — keep it pristine between deep cleans.", href: "/services/maintenance-packages", cta: "Explore valeting" },
              { icon: "drop", title: "Full Valet + Interior Deep Clean", text: "Complete interior hygiene and exterior enhancement, inside and out.", href: "/services/interior-deep-clean", cta: "Explore deep clean" },
              { icon: "shield", title: "Correction & Ceramic Protection", text: "Multi-stage polish plus a durable ceramic coating for a truly lasting finish.", href: "/services/ceramic-coating", cta: "Explore ceramic coating" },
            ]}
          />
          <p className="chead__intro chead__intro--after">
            Through our commitment to detail and always providing our customers with a quality service, we have earned an
            incredible reputation. Many of our customers come back to us time and time again — <Link href="/#reviews">check out our reviews</Link> and see why.
          </p>
        </div>
      </section>

      <FinalCta
        eyebrow={'Ready for that "new car" feeling?'}
        title="Book your eco-friendly detail today"
        text="Send a quick photo of your car for a free, tailored quote. Fully mobile across West London, 7 days a week."
      />
    </>
  );
}
