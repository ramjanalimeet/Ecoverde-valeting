import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description: "Your cancellation rights and our refund policy for Ecoverde Valeting services.",
  alternates: { canonical: "/cancellation-refund-policy" },
};

// TEMPLATE — have the business confirm notice periods and fees before launch (see README).
export default function CancellationPage() {
  return (
    <>
      <PageHero
        crumb="Cancellation & Refund Policy"
        eyebrow="Legal"
        title="Cancellation & Refund Policy"
        intro="Clear, fair terms — and our promise to make it right if you're not happy."
      />
      <section className="section">
        <div className="container container--narrow prose legal">
          <h2>Your 14-day right to cancel</h2>
          <p>
            When you book a service with us away from business premises or online, the Consumer Contracts Regulations 2013
            give you the right to cancel within 14 days of agreeing the booking, without giving a reason.
          </p>

          <h2>If you ask us to start within 14 days</h2>
          <p>
            By ticking the box on our quote form you ask us to carry out your service within the 14-day cancellation period.
            You can still cancel during that period, but if we have already started or completed the work you will pay for the
            service provided up to the point you told us you wanted to cancel. Once the service is fully completed, the right to
            cancel no longer applies.
          </p>

          <h2>How to cancel or reschedule</h2>
          <p>
            Tell us as early as possible by phone or WhatsApp on {SITE.phones[0].display}, or by email at{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We&apos;re always happy to move your appointment to a time that
            suits you better.
          </p>

          <h2>Refunds</h2>
          <p>
            If you cancel within your rights and have paid in advance, we will refund you within 14 days using the same payment
            method, less any amount due for work already carried out.
          </p>

          <h2>Satisfaction guarantee</h2>
          <p>
            If you&apos;re not completely happy with the result, tell us within 48 hours of the service and we will come back to
            put it right at no extra cost. This does not affect your statutory rights.
          </p>

          <h2>Gift vouchers</h2>
          <p>
            Gift vouchers can be cancelled for a full refund within 14 days of purchase if they have not been used. The expiry
            date is shown on each voucher.
          </p>

          <h2>Weather and access</h2>
          <p>
            If severe weather or lack of access means we can&apos;t safely complete the work, we will rearrange at no cost to
            you.
          </p>
        </div>
      </section>
    </>
  );
}
