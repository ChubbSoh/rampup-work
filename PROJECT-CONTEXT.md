# Restaurant RampUp — Project Context

Context primer for an AI assistant working on this repository.
Written 2026-08-25 against commit `17a02b8`.

---

## 1. What the business is

**Restaurant RampUp** (`rampupth.com`) is a Bangkok-based marketing agency serving restaurants in Thailand. It is not a SaaS product — it is a service business, and this repo is the agency's marketing site plus the internal tooling that runs client delivery.

The service has two pillars, sold as one monthly package:

- **Social media management** — content shoots (photo + video), then Instagram / Facebook / TikTok posting and optimisation. The deliverable is 7 videos, 10 styled menu items, and 18 posts per month.
- **Delivery-platform sales growth** — primarily Grab Food, with Lineman and LINE as add-ons.

**Pricing** (as of 2026-08-10, the last pricing change):

| Item | Price |
|---|---|
| Restaurant RampUp package | ฿59,990 / month |
| Google Map Ads | Included in the base package |
| Website design & build | ฿79,990 one-time |
| Grab sales add-on | ฿9,990 / month |
| Lineman add-on | ฿4,990 / month |
| LINE sales-channel add-on | ฿3,990 / month |

Google Map Ads used to be a ฿5,990/month add-on and was folded into the base package. It must not be presented as a separate paid upsell anywhere on the site.

Ad spend is explicitly excluded from all prices.

## 2. What the software actually does

Three distinct jobs, all in one repo:

**a) Public marketing site.** Bilingual (English + Thai), sells the packages, and showcases client work. The portfolio is the main sales asset — real shoot output from real restaurants.

**b) Lead capture.** Multiple forms across the homepage, contact page, campaign funnels, and per-client landing pages. All leads relay through a single server-side endpoint to an n8n workflow, which emails the team, sends a customer confirmation, and logs to Google Sheets.

**c) Internal ops panel** at `/control`, password-gated. Two buttons that matter: onboard a new client, and trigger a content publish for an existing one. Both just fire n8n webhooks — the web app owns no database.

## 3. Tech stack

- **Next.js 14.2.5**, App Router, TypeScript in `strict` mode, React 18
- **Tailwind CSS 3.4** — design tokens are in `tailwind.config.ts` (brand green `#3DBE5A`, warm grey `#EDEDED` background, Sora headings / Poppins body)
- **Netlify** hosting, `@netlify/plugin-nextjs`, deploy base `rampup-site/`
- **Cloudflare Stream** for video, **Cloudflare Images** for photos, **Cloudflare Turnstile** for CAPTCHA
- **n8n** (`rampupth.app.n8n.cloud`) as the entire backend
- **Google Drive + Google Sheets** as the operational data stores, driven by n8n

No database. No ORM. No test framework. No authentication system beyond one shared password.

## 4. The architecture in one paragraph

`rampup-site/data/clients.json` is the content database. Every portfolio page, the work feed, and the client grid are generated from it at build time. **An n8n automation commits to that file directly on `main`** — commits titled `onboard: add <slug>` and `Auto: <Client> shoot — N photos, M videos` are pipeline output, not human edits. Photos and videos live in Cloudflare and are referenced from that JSON by ID. When n8n commits, Netlify rebuilds, and the new client or shoot appears on the site. The web app is essentially a rendering layer over a JSON file that a workflow engine owns.

Two type shapes exist deliberately: `Client` (public, browser-safe) and `ClientRecord` (internal, adds Google Drive folder IDs). `lib/clients.ts` strips the internal fields and hides any client with no media. Everything that renders must go through it.

Auth is `middleware.ts` checking a `control_auth` cookie, set for 8 hours after a single shared-password exchange.

## 5. Current status

**Live and in production.** The site is deployed at `rampupth.com` and the onboarding automation is actively running — the most recent pipeline commits are from July 2026.

**Development pace has dropped sharply.** 296 commits total, but the distribution tells the story:

| Month | Commits |
|---|---|
| Apr 2026 | 258 |
| May 2026 | 15 |
| Jun 2026 | 8 |
| Jul 2026 | 14 |
| Aug 2026 | 1 |

April was the initial build sprint (the repo starts 2026-04-13). Since then it has been maintenance: a funnel page in late May, a `/grab-offer` landing page in early June, small work-page tweaks in July, and one pricing update on 2026-08-10 — the last commit.

**Client roster: 32 records, but only 17 are visible on the site.** The other 15 are onboarded and have Drive folders but no shoot yet, so `getAllClients()` filters them out. Visible clients span Japanese, Italian, Thai, Korean, Chinese, Western, Mexican, cafe, and nightlife. Shoot dates range 2026-04-16 to 2026-07-23.

Onboarded but not yet shot: `apg-x-sinnic`, `sinnic-suki`, `kaneumi`, `lamaya-khao-yai`, `tanaka`, `mans-table`, `51bakery`, `hanger`, `savoey`, `starita`, `napha`, `brewave-ari`, `aela`, `misono` — plus `gh-test-0994`, which is a leftover test record sitting in production data.

**Routes shipped (19):** homepage, `/work` + `/work/[slug]`, `/grab-sales`, `/social-media`, `/contact`, `/control` + `/control-login`, `/funnel/restaurant-marketing`, `/grab-offer`, and three per-client landing pages (`/lp/okasan`, `/lp/bacio`, `/lp/lamaya-bkk`).

**Thai coverage is partial.** `/th` mirrors the homepage, work, grab-sales, social-media, and contact. The newer campaign pages — the restaurant-marketing funnel, `/grab-offer`, and all `/lp/*` landing pages — are **English only**. There is no i18n framework; `/th` routes are hand-duplicated files reading Thai copy from `lib/translations.ts`.

**Conversion tracking is wired and was deliberately hardened** (commit "Audit and harden Lead event tracking", 2026-05-20). GA4 `G-MXCPYX09G5`, GTM `GTM-NPZTB44L`, and Meta Pixel `915942711203430` all fire, and lead events carry a shared `event_id` so the browser pixel and the server-side CAPI event deduplicate.

## 6. Known debt and rough edges

These are real, present in the code today:

1. **`.mcp.json` is committed at the repo root containing a live n8n Bearer JWT.** It is in git history on GitHub. Should be rotated and removed.
2. **The publish endpoint is unauthenticated.** `/.netlify/functions/publish` is a Netlify function, so it bypasses `middleware.ts` entirely. It validates only that the client slug exists and has a `website_folder_id` — anyone who knows the URL and a slug can trigger a publish. The onboard endpoint, by contrast, *is* cookie-gated.
3. **No tests and no ESLint config.** `npm run lint` prompts interactively on first run because there is no `.eslintrc`. `npm run build` is the only real verification gate.
4. **The `active` field is vestigial.** Across 32 records it is `false` 12 times and absent 20 times — never `true`. Visibility is actually controlled by whether a client has media. Anything reading `active` as a real flag will be wrong.
5. **A stale duplicate `clients.json` sits at the repo root** — 18 clients, older schema (uses `drive_id` instead of `website_folder_id`). The live file is `rampup-site/data/clients.json` with 32. The root copy feeds the legacy static HTML exports and should not be edited.
6. **Legacy artifacts at the repo root**: large standalone `index.html` and `okasan.html` static exports from the pre-Next.js site, plus a nested `rampup-work/` folder of three placeholder files.
7. **`brand.json` is a design spec no code imports.** `tailwind.config.ts` is the actual implementation. The two can drift silently.
8. **Add-on prices are hardcoded in two places** — English strings in `PricingCard.tsx`, Thai strings in `lib/translations.ts` — and must be updated together by hand. Only the main package price and website build price are centralised in `lib/pricing.ts`.
9. **Rate limiting is per-instance in-memory** (5 requests/min) and resets on serverless cold start. This is a deliberate accepted tradeoff, not an oversight.
10. **Immutable year-long cache headers** on images and `/results/*` mean a changed image must get a new filename or Cloudflare ID, or stale bytes are served.

## 7. Things that look broken locally but are not

- **Videos do not appear in local dev** without `CLOUDFLARE_STREAM_CUSTOMER_CODE` set. `streamIframeSrc()` returns `null` and every caller filters nulls out.
- **CAPTCHA is skipped** when `TURNSTILE_SECRET_KEY` is unset — an intentional dev escape hatch in `/api/lead-relay`.
- **Lead submissions silently no-op** without n8n env vars configured.

Copy `rampup-site/.env.local.example` to `.env.local` to fix all three. Only `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is public; every other variable is server-side and must never gain a `NEXT_PUBLIC_` prefix.

## 8. Working on this repo

```bash
cd rampup-site
npm ci
npm run dev     # :3000
npm run build   # the real verification gate — strict TS
```

**Pull before editing `data/clients.json`, and push promptly after.** n8n writes to that file on `main` without warning; long-lived branches touching it will conflict.

**Editing an English page means editing its `/th` twin too.** Nothing enforces this.

**Read `docs/PRICING.md` before changing any price.** It is a maintained checklist of every place a price appears.

See `CLAUDE.md` for the detailed engineering conventions.
