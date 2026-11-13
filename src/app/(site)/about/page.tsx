import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import { DarkHero, PhotoStrip } from "@/components/PageTemplates";
import { PHOTOS } from "@/data/images";
import { FinalCta, Founder, Reviews, Stats } from "@/components/Sections";

export const metadata: Metadata = {
  title: "About Us — Meet John",
  description: "Ecoverde Valeting was founded by John Muriel: 8+ years of premium, eco-friendly mobile car care across West London.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <DarkHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        eyebrow="About Ecoverde"
        title={["Premium car care,", "without costing the earth"]}
        intro="Ecoverde Valeting is a fully mobile, eco-friendly car valeting and detailing service founded by John Muriel. For over 8 years we've cared for everything from daily drivers to supercars and classics across West London."
        pill={["5.0 from 560+ reviews", "· fully insured & verified"]}
        image={PHOTOS.defender.src}
      />
      <Founder />
      <PhotoStrip
        keys={["jobPolishBmw", "jobMr2", "jobTesla", "bmwI3"]}
        eyebrow="On The Job"
        title={["Hands-on,", "every time"]}
        intro="John and the team at work on driveways and kerbsides across West London."
      />
      <Stats />
      <Reviews />
      <Gallery />
      <FinalCta />
    </>
  );
}
