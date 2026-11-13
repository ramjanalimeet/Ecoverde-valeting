import type { Metadata } from "next";
import { DarkHero, PhotoStrip } from "@/components/PageTemplates";
import { PHOTOS } from "@/data/images";
import { FinalCta, HowItWorks, Reviews, Stats, WhyChoose } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Why Choose Us",
  description: "Genuinely green mobile valeting: low-water techniques, biodegradable products, an electric van and a meticulous finish.",
  alternates: { canonical: "/why-choose-us" },
};

export default function WhyPage() {
  return (
    <>
      <DarkHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Why Choose Us" }]}
        eyebrow="Why Choose Ecoverde"
        title={["Genuinely green —", "not just a label"]}
        intro="Eco isn't a marketing word for us — it's how every job is done. Better for your car's finish, better for your family's health, and better for the planet."
        pill={["Electric van", "· biodegradable products · steam cleaning"]}
        image={PHOTOS.beading.src}
      />
      <WhyChoose />
      <PhotoStrip
        keys={["bmwI3", "foamBrentford", "handWash", "ceramicBeading"]}
        tone="mint"
        eyebrow="Eco In Action"
        title={["Low water, biodegradable,", "no generator"]}
        intro="Snow foam, steam and hand finishing powered by our electric van — kind to your car and to London's air."
      />
      <HowItWorks />
      <Stats />
      <Reviews />
      <FinalCta />
    </>
  );
}
