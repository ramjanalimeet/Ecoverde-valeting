import type { Metadata } from "next";
import Link from "next/link";
import { CenterHead, Checklist, DarkBand, DarkFeatures, FaqAccordion, MediaSplit } from "@/components/Blocks";
import { ArrowRight, ShieldIcon } from "@/components/Icons";
import { DarkHero } from "@/components/PageTemplates";
import { FinalCta } from "@/components/Sections";
import { PHOTOS } from "@/data/images";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us — Eco-Friendly Car Care Since 2017",
  description:
    "Founded by John Muriel, Ecoverde brings high-end, fully mobile, eco-friendly valeting and detailing to West London from Ladbroke Grove and Brentford.",
  alternates: { canonical: "/about" },
};

const FAQS = [
  {
    q: "Who is Ecoverde Valeting?",
    a: "Ecoverde Valeting is a fully mobile, eco-friendly car valeting and detailing service for West London, founded by John Muriel. We come to your home or workplace and use biodegradable products, steam cleaning and an electric van.",
  },
  {
    q: "Where is Ecoverde based and which areas do you cover?",
    a: "We work from two bases — Ladbroke Grove (W10) and Brentford (TW8) — and cover West London and beyond, including Chiswick, Ealing, Notting Hill, Kensington, Hammersmith, Fulham, Chelsea and Richmond.",
  },
  {
    q: "What makes Ecoverde eco-friendly?",
    a: "We use biodegradable, solvent-free and non-toxic products, low-water and waterless techniques, steam cleaning, and an electric van with no generator — so there is no run-off, no fumes and no noise on your driveway.",
  },
  {
    q: "Is Ecoverde a mobile service — do you come to me?",
    a: "Yes. We are 100% mobile and bring everything we need, including water and power, to your home, office or car park anywhere across West London, 7 days a week.",
  },
  {
    q: "How experienced and trusted is Ecoverde?",
    a: "We have been valeting cars across West London since 2017, are fully insured with public liability cover, Checkatrade verified, and rated 5.0 from 560+ reviews across Google, Checkatrade, Bark, Facebook and Yell.",
  },
  {
    q: "Who founded Ecoverde?",
    a: "John Muriel founded Ecoverde with one belief: your car should look incredible without costing the earth. You deal with John directly, not a call centre.",
  },
  {
    q: "How do I book Ecoverde?",
    a: "Request a free quote online, send photos on WhatsApp or call 07495 400369. John will confirm a tailored price and a time that suits you.",
  },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <DarkHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        eyebrow="Our Story"
        title={["Eco-friendly car care,", "perfected", " over 8 years"]}
        intro="Founded by John Muriel, Ecoverde brings high-end, fully mobile valeting and detailing to West London — without costing the earth."
        extra="Ecoverde Valeting is a fully mobile, eco-friendly car valeting and detailing service for car owners across West London, including busy professionals, families, and luxury and classic car enthusiasts. We come to your home or workplace from our bases in Ladbroke Grove (W10) and Brentford (TW8)."
        image={PHOTOS.toyota4x4.src}
        ctas={false}
      />

      <MediaSplit photo="john" title={["Hi, I'm John — a", "perfectionist", " with a passion for cars"]} tone="soft">
        <p>
          I started Ecoverde with one belief: your car should look incredible without costing the earth — literally. For over 8
          years I&apos;ve brought high-end, fully-mobile car care to driveways and offices across West London, using eco-friendly
          products and the latest equipment on everything from daily drivers to supercars and classics.
        </p>
        <p>
          I treat every car like my own. That&apos;s why I never quote without seeing the job, always work around your budget,
          and don&apos;t leave until it&apos;s spotless.
        </p>
        <p className="msplit__sign">— {SITE.founder}, Founder</p>
      </MediaSplit>

      <DarkBand eyebrow="Our Mission" title={["Better for your car. Better for the", "planet", "."]}>
        <p className="dband__lead">
          Eco isn&apos;t a marketing word for us — it&apos;s how every single job is done. We believe a flawless finish and
          genuine environmental care can go hand in hand.
        </p>
        <DarkFeatures
          items={[
            { icon: "drop", title: "Low-water & waterless", text: "Steam and rinseless washing use a fraction of the water — no run-off, no waste." },
            { icon: "leaf", title: "Plant-based products", text: "Biodegradable, solvent-free and non-toxic — safe for allergy-sensitive clients." },
            { icon: "bolt", title: "Electric van", text: "We arrive fully self-powered and emission-free — no noisy generator on your drive." },
            { icon: "sparkle", title: "Meticulous finish", text: "Attention to detail on every panel — the standard behind 560+ five-star reviews." },
          ]}
        />
      </DarkBand>

      <MediaSplit photo="snowFoamBlack" eyebrow="Why Choose Ecoverde" title={["The details that make the", "difference"]} reverse tone="glow">
        <Checklist
          items={[
            <>
              <strong>100% mobile</strong> — we come to your home or office anywhere in West London.
            </>,
            <>
              <strong>5.0 from 560+ reviews</strong> across Google, Checkatrade, Bark, Facebook &amp; Yell.
            </>,
            <>
              <strong>Fully insured</strong> with public liability cover and Checkatrade verified.
            </>,
            <>
              <strong>Luxury &amp; classic specialists</strong> — BMW, Mercedes, Porsche, Range Rover, Tesla &amp; more.
            </>,
            <>
              <strong>Satisfaction guaranteed</strong> — if you&apos;re not happy, we make it right.
            </>,
          ]}
        />
        <div className="trustbox">
          <span className="trustbox__icon">
            <ShieldIcon width={18} height={18} />
          </span>
          <span>
            <strong>Trusted since 2017</strong>
            <small>Over 8 years serving West London drivers, one spotless car at a time.</small>
          </span>
        </div>
        <Link className="btn btn--primary" href="/why-choose-us">
          Learn more — why choose Ecoverde <ArrowRight width={16} height={16} />
        </Link>
      </MediaSplit>

      <section className="section section--soft" aria-labelledby="about-faq">
        <div className="container">
          <CenterHead eyebrow="FAQs" title={["Frequently asked", "questions"]} id="about-faq" />
          <FaqAccordion faqs={FAQS} cols={2} />
        </div>
      </section>

      <FinalCta
        title="Let's get your car looking its best"
        text="Send a quick photo or video and we'll come back with a free, tailored quote. Fully mobile, fully eco, across West London — 7 days a week."
        whatsapp={false}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
