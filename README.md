# Ecoverde Valeting — website

Next.js (App Router, TypeScript) rebuild of the Ecoverde Valeting site: eco-friendly mobile car valeting &
detailing across West London.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in SMTP details
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Node 20.9+ required. Deploys as-is to Vercel or any Node host (`npm run build && npm start`).

## Pages

| Route | What it is |
| --- | --- |
| `/` | Homepage, matching the live site: glass hero, Google review marquee, Trustindex block, premium brands band, 9 service cards, why eco, how it works, stats, founder, bento before/after gallery (lightbox), service areas, gift vouchers, used-car valet, final CTA, two-column FAQ |
| `/journal` | Journal (empty state until articles are added in `src/app/journal/page.tsx`) |
| `/privacy-policy` | Privacy policy |
| `/cancellation-refund-policy` | Cancellation & refund policy (linked from the form's consent box) |
| `/api/quote` | Quote form endpoint (POST, multipart) |
| `/sitemap.xml`, `/robots.txt` | Generated |

The quote form is a pop-up (`src/components/QuoteModal.tsx`) available on every page. Any link to `#quote`
(Book Now, Get a Free Quote, Contact, every service card / menu / footer link) opens it, and `?service=<slug>#quote`
preselects that service. Deep links like `/?service=ceramic-coating#quote` open it on load.

## Where things live

- `src/data/site.ts` — **all content**: phone numbers, WhatsApp, email, hours, reviews, services, menu, areas,
  FAQs, gallery. Edit here and the header, footer, cards, form and JSON-LD all update.
- `src/app/globals.css` — design tokens (`:root`) and all styles. Fraunces (serif headings, green italic
  accents) + Hanken Grotesk (body), brand greens/teal gradient sampled from the live site.
- `src/components/` — `Header` (dropdowns, services mega menu, mobile drawer), `Footer`, `Sections`
  (homepage sections), `Gallery`, `Faq`, `QuoteModal`, `Trustindex`, `Icons` (incl. logo).
- `src/lib/quote.ts` — validation shared by the browser and the server.

## Quote form

- Client- and server-side validation, inline errors, honeypot spam trap and a simple per-IP rate limit.
- Photos: up to 6, JPG/PNG/WebP/HEIC, 8 MB each, 24 MB total; sent as email attachments.
- Emails go to `QUOTE_TO_EMAIL` (default `info@ecoverdevaleting.co.uk`) via SMTP (see `.env.example`).
- **If SMTP isn't configured the API returns 503 and the form shows an error with call/WhatsApp fallbacks.
  It never shows a fake success.**
- On success it shows "Thanks, {name}! Your request is in." with a "Continue on WhatsApp" button.

## Before going live — checklist

- [ ] **Photos:** `public/images/` holds the real Ecoverde photos, logos and badges, cropped from a screenshot of
      the live site, so they're low resolution (about 280–640px wide), and the service photos had their baked-in
      price/category labels removed. Replace them with the full-resolution originals, keeping the same filenames.
- [ ] **Social links:** fill in `SOCIAL` in `src/data/site.ts`; footer icons only appear for entries with a URL.
- [ ] **Trustindex:** set `NEXT_PUBLIC_TRUSTINDEX_ID` to show the live review carousel (a static "Excellent"
      summary shows until then).
- [ ] **Legal pages:** privacy and cancellation texts are sensible UK templates. Get the business to confirm
      them, especially the retention periods, 48-hour guarantee window and voucher terms.
- [ ] **Facts:** check prices, review counts, phone numbers and the areas list against the live site.
- [ ] **Reviews link:** set `NEXT_PUBLIC_REVIEWS_URL` to the verified Trustindex page. The button stays
      hidden until it's set.
- [ ] **SMTP:** set the `SMTP_*` variables on the host and send a test quote.
- [ ] **Pet options:** the form's pet options were defined here (`PET_OPTIONS`), not copied from the live
      site, so adjust them if needed.
