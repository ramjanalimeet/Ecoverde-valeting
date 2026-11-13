# Ecoverde Valeting — website

Next.js (App Router, TypeScript) rebuild of the Ecoverde Valeting site: eco-friendly mobile car valeting &
detailing across West London.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000 (Next.js dev server)
npm run preview    # builds for Cloudflare and runs it in the real Workers runtime (http://localhost:8787)
```

Node 20.9+ required. For `npm run preview`, copy `.dev.vars.example` to `.dev.vars` first.

## Deploy to Cloudflare (Workers)

The site runs as a Cloudflare Worker using the official [OpenNext adapter](https://opennext.js.org/cloudflare)
(`@opennextjs/cloudflare`). Pages are prerendered and served from Workers Static Assets, and `/api/quote` runs
in the Worker. Config lives in `wrangler.jsonc` and `open-next.config.ts`.

### Option A — Git integration (recommended: deploys on every push)

1. Cloudflare dashboard → **Workers & Pages → Create → Import a repository** → pick this repo.
2. Build settings:
   - **Build command:** `npx opennextjs-cloudflare build`
   - **Deploy command:** `npx opennextjs-cloudflare deploy`
   - **Root directory:** `/`
3. **Build variables** (Settings → Build → Variables): `NEXT_PUBLIC_SITE_URL=https://ecoverdevaleting.co.uk`,
   plus `NEXT_PUBLIC_REVIEWS_URL` / `NEXT_PUBLIC_TRUSTINDEX_ID` if you have them. `NEXT_PUBLIC_*` values are baked
   in at build time, so they must be set here.
4. **Runtime secret** (Settings → Variables and Secrets → Add → type *Secret*): `RESEND_API_KEY`.
   `QUOTE_TO_EMAIL` and `QUOTE_FROM_EMAIL` are already set as plain vars in `wrangler.jsonc`; edit them there.
5. Deploy. The Worker name in `wrangler.jsonc` (`ecoverde-valeting`) must match the project name in the dashboard.

### Option B — from your computer

```bash
npx wrangler login
npx wrangler secret put RESEND_API_KEY
NEXT_PUBLIC_SITE_URL=https://ecoverdevaleting.co.uk npm run deploy
```

### Custom domain

Workers & Pages → `ecoverde-valeting` → **Settings → Domains & Routes → Add → Custom domain** →
`ecoverdevaleting.co.uk` (and `www.`). The domain's DNS must be on the same Cloudflare account. Alternatively,
uncomment `routes` in `wrangler.jsonc`.

### Quote emails (Resend)

Cloudflare Workers can't open raw SMTP connections, so quote emails are sent through the
[Resend](https://resend.com) HTTP API (free tier: 3,000 emails/month):

1. Create a Resend account → **Domains → Add** `ecoverdevaleting.co.uk` → add the DNS records it shows
   (in Cloudflare DNS) → wait for *Verified*.
2. **API Keys → Create** (sending access) → save it as the `RESEND_API_KEY` secret (step 4 above).
3. `QUOTE_FROM_EMAIL` must use the verified domain (default `quotes@ecoverdevaleting.co.uk`).
4. Send a test quote from the live site. Failures appear in Workers → Logs.

Until the key is set, the form returns a clear "call or WhatsApp us" message and never shows a fake success.

### Recommended Cloudflare extras

- **WAF → Rate limiting rule** on `/api/quote` (e.g. 5 requests / 10 min per IP) for hard spam protection.
- Images in `/public` are served as-is (already optimised WebP); `next/image` optimisation is switched off,
  so no Cloudflare Images binding is needed.

## Dashboard (`/login`)

A private bookings dashboard at **`/login`** (not linked from the site, `noindex`). Signed out, `/login` shows the
sign-in screen; signed in, it is the dashboard, with sections at `/login/bookings`, `/login/blog`, etc. Old
`/dashboard/*` links redirect to `/login/*`.

| Section | What it does |
| --- | --- |
| Overview | Totals, last 7 days, new / to action, completed, latest requests |
| Bookings | Every quote request with status filters + search; open one to call/WhatsApp, change status (New → Contacted → Quoted → Booked → Completed / Cancelled) and keep private notes |
| Messages | Customer notes from the form ("Anything else?"), read/unread |
| Emails | Preview of the review-request email (sent from a booking via "Complete & request review") and a log of sent emails |
| Blog | Write, publish or unpublish posts — published posts appear on `/journal` |
| Analytics | Date ranges (7 days–1 year): estimated value from enquiries, WhatsApp clicks, enquiries by service, live booking totals, cookieless website traffic (visitors, page views, time on site, new visitors), visitors over time, top pages, sources, pipeline |
| Settings | Change password |
| Support | How-to and troubleshooting |

**Data:** Cloudflare D1 database `ecoverde-db` (binding `DB`, schema in `migrations/`). Every quote request is
saved there first, so nothing is lost if email delivery fails.

**Review link:** set `GOOGLE_REVIEW_URL` (your Google "write a review" link) on the Worker so review emails point straight to it.

**Secrets on the Worker:** `DASHBOARD_PASSWORD` (the sign-in password) and `SESSION_SECRET` (signs the login
cookie). A password changed in Settings is stored hashed (PBKDF2) in D1 and overrides `DASHBOARD_PASSWORD`;
changing it signs everyone out.

**Journal posts:** the launch articles live in `content/blog/*.md` (front matter + Markdown with tables, images,
call-outs and a `## Frequently asked questions` section that becomes an FAQ accordion and FAQPage schema).
`node scripts/build-blog-seed.mjs` turns them into `migrations/0002_seed_journal.sql`. After seeding, posts are
edited in the dashboard (Blog) — the seed never overwrites existing posts.

**Schema changes:** add a new file in `migrations/` and run
`npx wrangler d1 migrations apply ecoverde-db --remote`.

**Local testing:** `npx wrangler d1 migrations apply ecoverde-db --local`, put `DASHBOARD_PASSWORD` and
`SESSION_SECRET` in `.dev.vars`, then `npm run preview`.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Homepage, matching the live site: glass hero, Google review marquee, Trustindex block, premium brands band, 9 service cards, why eco, how it works, stats, founder, bento before/after gallery (lightbox), service areas, gift vouchers, used-car valet, final CTA, two-column FAQ |
| `/services`, `/services/[slug]` | Services overview, 4 category pages and 18 service pages (content in `src/data/pages.ts`) |
| `/areas`, `/areas/[slug]` | Service areas and 40 area pages (two bases + their areas, from `AREA_BASES` in `src/data/site.ts`) |
| `/about`, `/why-choose-us`, `/contact` | Company pages; `/contact` has the quote form inline |
| `/journal`, `/journal/[slug]` | Blog posts published from the dashboard |
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
- `src/data/images.ts` — photo library: every photo's path, size, alt text and caption. Pages pick photos by key
  (e.g. `"paintRed"`), so alt text stays consistent. Add new photos here.
- `src/lib/quote.ts` — validation shared by the browser and the server.

## Quote form

- Client- and server-side validation, inline errors, honeypot spam trap and a simple per-IP rate limit.
- Photos: up to 6, JPG/PNG/WebP/HEIC, 8 MB each, 24 MB total; sent as email attachments.
- Emails go to `QUOTE_TO_EMAIL` (default `info@ecoverdevaleting.co.uk`) via the Resend API, with photos attached.
- **If `RESEND_API_KEY` isn't set the API returns 503 and the form shows an error with call/WhatsApp fallbacks.
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
- [ ] **Email:** verify the domain in Resend, set `RESEND_API_KEY` on the Worker and send a test quote.
- [ ] **Pet options:** the form's pet options were defined here (`PET_OPTIONS`), not copied from the live
      site, so adjust them if needed.
