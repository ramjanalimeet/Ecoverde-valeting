import Faq from "@/components/Faq";
import Gallery from "@/components/Gallery";
import {
  BrandStrip,
  FinalCta,
  Founder,
  GiftVouchers,
  Hero,
  HowItWorks,
  Reviews,
  ServiceAreas,
  Services,
  Stats,
  UsedCar,
  WhyChoose,
} from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Reviews />
      <BrandStrip />
      <Services />
      <WhyChoose />
      <HowItWorks />
      <Stats />
      <Founder />
      <Gallery />
      <ServiceAreas />
      <GiftVouchers />
      <UsedCar />
      <FinalCta />
      <Faq />
    </>
  );
}
