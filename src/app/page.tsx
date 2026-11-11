import { Suspense } from "react";
import Faq from "@/components/Faq";
import Gallery from "@/components/Gallery";
import QuoteForm from "@/components/QuoteForm";
import {
  BrandStrip,
  FinalCta,
  Founder,
  GiftVouchers,
  Hero,
  HowItWorks,
  ReviewSummary,
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
      <ReviewSummary />
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
      <Suspense fallback={null}>
        <QuoteForm />
      </Suspense>
    </>
  );
}
