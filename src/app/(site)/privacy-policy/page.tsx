import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Ecoverde Valeting collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

// TEMPLATE — have the business review this text before launch (see README).
export default function PrivacyPage() {
  return (
    <>
      <PageHero crumb="Privacy Policy" eyebrow="Legal" title="Privacy Policy" intro="How we collect, use and protect your personal information." />
      <section className="section">
        <div className="container container--narrow prose legal">
          <h2>Who we are</h2>
          <p>
            {SITE.legalName} (&ldquo;Ecoverde&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) provides mobile car valeting and
            detailing across West London. We are the controller of the personal information you give us. You can contact us
            at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or on {SITE.phones[0].display}.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>Contact details you provide: name, phone number, email address and the address or postcode where you want the service.</li>
            <li>Vehicle details: make, model, condition, whether pets travel in it, and any photos you upload.</li>
            <li>Messages you send us through the website, by phone, WhatsApp or email.</li>
            <li>Basic technical data needed to run the website securely (for example, IP address in server logs).</li>
          </ul>

          <h2>How we use it</h2>
          <ul>
            <li>To prepare your quote, arrange your appointment and carry out the service (performance of a contract).</li>
            <li>To contact you about your booking, including by phone, SMS, WhatsApp or email.</li>
            <li>To keep records for accounting, tax and insurance purposes (legal obligation).</li>
            <li>To send optional maintenance reminders, only where you have asked for them — you can opt out at any time.</li>
          </ul>
          <p>We do not sell your information, and we do not use it for unrelated marketing.</p>

          <h2>Who we share it with</h2>
          <p>
            Only with service providers who help us run the business — for example our email and website hosting providers,
            messaging services such as WhatsApp, payment providers and our accountant — and only as far as needed. Some
            providers may process data outside the UK under appropriate safeguards.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Quote requests that don&apos;t lead to a booking are deleted within 12 months. Customer and invoice records are kept
            for as long as required by law (normally six years). Photos are deleted once they are no longer needed for your job.
          </p>

          <h2>Your rights</h2>
          <p>
            Under UK data protection law you can ask to access, correct or delete your data, restrict or object to how we use
            it, and ask for a copy in a portable format. Email us to make a request. If you are unhappy with how we handle your
            data you can complain to the Information Commissioner&apos;s Office (ico.org.uk).
          </p>

          <h2>Cookies</h2>
          <p>
            This website uses only the cookies strictly necessary for it to work. If we add analytics or marketing cookies in
            future we will ask for your consent first.
          </p>

          <h2>Changes</h2>
          <p>We may update this policy from time to time. The current version is always published on this page.</p>
        </div>
      </section>
    </>
  );
}
