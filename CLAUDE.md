# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All app commands run from `rampup-site/`, not the repo root.

```bash
cd rampup-site
npm ci          # required on a fresh clone — node_modules is gitignored
npm run dev     # next dev on :3000
npm run build   # next build
npm run start   # serve a production build
npm run lint    # next lint
```

There is no test framework in this repo — no test runner, no test files, no CI config. Verify changes with `npm run build` (catches type errors, since `tsconfig` is `strict`) and by exercising the page in `npm run dev`.

`npm run lint` has no ESLint config checked in, so the first run prompts interactively to create one. Prefer `npm run build` for automated verification.

## Deployment

Netlify, configured in `rampup-site/netlify.toml` with `base = "rampup-site"` and the `@netlify/plugin-nextjs` plugin. Static asset routes (`/results/*`, images, fonts, `/_next/static/*`) get immutable year-long cache headers, so **changed images must get a new filename or Cloudflare Images ID** — overwriting in place will serve stale bytes.

## Architecture

### `data/clients.json` is the content database — and it is machine-owned

`rampup-site/data/clients.json` (32 clients) is the single source of truth for every portfolio page, the work feed, and the client grid. Nothing is fetched at runtime; pages read it at build time.

**An n8n automation commits directly to this file on the `main` branch.** Commits titled `onboard: add <slug>` and `Auto: <Client> shoot — N photos, M videos` are pipeline output, not hand edits. Before editing this file, pull; after editing, push promptly. Long-lived branches that touch it will conflict.

The record type is split deliberately across two files:

- `lib/types.ts` → `Client` — the **public** shape, safe to send to the browser.
- `lib/types-internal.ts` → `ClientRecord` — a superset adding `active` plus Google Drive folder IDs (`drive_folder_id`, `website_folder_id`, `brand_assets_folder_id`).

`lib/clients.ts` is the only public read path. Its `sanitize()` strips the Drive fields, and `getAllClients()` filters out clients with no photos and no videos (so a client onboarded but not yet shot stays invisible). **Always go through `getAllClients()` / `getClientBySlug()` for anything that renders** — importing `data/clients.json` directly leaks internal fields into the client bundle.

`lib/clients-internal.ts` does `fs` read/write of the full record and is server-only. It must never be imported from a `'use client'` component.

### Media is external, referenced by ID

- **Video** — Cloudflare Stream. `clients.json` stores bare video IDs; `lib/stream.ts` builds the iframe URL from `CLOUDFLARE_STREAM_CUSTOMER_CODE`. It returns `null` when the env var is missing, and every caller filters nulls — so **videos silently disappear in local dev without a `.env.local`**. That's expected, not a bug.
- **Images** — Cloudflare Images, stored as full `imagedelivery.net` URLs. `next.config.js` sets `images.unoptimized: true`, so Next's optimizer is bypassed entirely.

### Lead capture flow

`components/LeadForm.tsx` is the shared form; several pages have their own local `LeadForm.tsx` variant (`app/grab-offer/`, `app/funnel/restaurant-marketing/`, `app/lp/*/`) with different fields for different campaigns.

The path is: form → `POST /api/lead-relay` → n8n webhook. The browser never sees the webhook URL.

`app/api/lead-relay/route.ts` handles, in order: in-memory per-IP rate limit (5/min, resets on cold start — deliberate), Cloudflare Turnstile verification (**skipped entirely when `TURNSTILE_SECRET_KEY` is unset**, so local dev works), then forwards to n8n with `X-Internal-Token`, adding `client_ip_address` and `client_user_agent` for Meta CAPI match quality.

Validation requires a name plus *either* email or phone — some funnels collect phone/LINE only. Don't tighten this to require email.

Conversion tracking uses a shared `event_id` generated client-side and pushed to **both** `dataLayer` and `fbq('track','Lead', {}, {eventID})`, then sent to n8n so the server-side CAPI event deduplicates against the pixel event. Changing `event_id` generation breaks that dedup.

### Control panel

`/control` is an internal ops UI, password-gated. `middleware.ts` is the whole auth layer — it checks a `control_auth` cookie and guards `/control`, `/control-login`, and `/api/onboard`, plus applies security headers site-wide. Auth is a single shared password (`CONTROL_PANEL_PASSWORD`) exchanged for an 8-hour httpOnly cookie by `/api/control-login`.

The panel triggers two pipelines, both of which just relay to n8n — **this app owns no persistence**:

- **Onboard** → `POST /api/onboard` → n8n. n8n owns all writes (Drive folders, Drive sharing, the
  Google Docs contract, the FlowAccount contact, Sheets, and the GitHub commit to `clients.json`).
  **A full onboard takes ~25-35 seconds, and Netlify kills a function at 10.** The panel therefore
  reports failure — "Failed to reach onboarding pipeline", or a JSON parse error when Netlify
  returns an HTML error page — even when the run completely succeeds. **That message is not a
  verdict.** Check the n8n execution log before concluding anything failed.
- **Publish** → `POST /.netlify/functions/publish` → n8n. Note this one is a **Netlify function, not a Next route**, so it does not pass through `middleware.ts` and must authenticate itself. It does: `netlify/functions/_control-session.js` re-implements the same signed-token format as `lib/control-session.ts` with `node:crypto`, and `authenticate()` accepts either a valid `control_auth` cookie or an `X-Internal-Token` matching `N8N_INTERNAL_WEBHOOK_TOKEN`, failing closed otherwise. **Keep the two session modules in sync** — same version tag, message format and hash. It then validates that the slug exists and has a `website_folder_id`.

#### Onboarding is one form with three steps

`app/control/page.tsx` is a Server Component that maps `clients.json` down to four public
fields and reads `DEFAULT_TEAM_EMAILS` server-side; `ControlPanelClient.tsx` is the browser
half. Do not import `data/clients.json` or `lib/team-emails.ts` from the client component —
that inlines Drive IDs and staff addresses into a publicly downloadable `/_next/static` chunk.

`OnboardSection` renders **one `<form>` spanning one card** with three internal
`SectionLabel` steps — 01 Client Info, 02 Drive Access, 03 Contract Details — and a single
`Create Client` submit. There is deliberately no wizard, no tabs, and no second page: one
submission carries client info, Drive access, and contract details together.

Step 03 feeds contract generation. `lib/contract.ts` holds the shared logic — it is imported
by **both** the client component and the route, so like `lib/emails.ts` it must stay free of
secrets and server-only imports. It owns:

- `calculateContractEnd()` — the end date is **derived, never entered**. The service period is
  inclusive, so the rule is `(start + N months) − 1 day` with month-length clamping applied
  first: 2026-09-01 + 6 months is **2027-02-28**, not 2027-03-01. All arithmetic is `Date.UTC`
  based; parsing a bare `YYYY-MM-DD` as local time shifts the day either side of UTC.
- `parseContractDetails()` — the server re-validates everything and **recalculates `end_date`**,
  ignoring the value the browser sent. `social_media_marketing` is hardcoded `true` and never
  read from the request body; it is typed as the literal `true` so a contract without it will
  not compile.
- `contractPlaceholders()` — maps the record onto the Google Docs `{{TOKENS}}`. **Simple values
  only.** Optional service sections are not placeholders; see the block markers below.
- `monthlyPrice()` — derives the sheet's PRICE column from the service selection.
  **Grab is deliberately excluded**: the contract states no Grab fee is charged until the client
  passes a performance threshold, so billing it from month one would contradict what they sign.
  Add `addOns.grab.price` by hand when a client crosses it.

Tax ID and branch are **strings throughout**. Never `Number()` them — leading zeros are real.
`accountant_email` is optional but validated when present — it becomes `contactEmail` on the
client's FlowAccount record, and a typo there fails silently at invoicing time.

**No contract wording lives in this repo.** The site submits structured service selections;
the legal text lives in the Google Docs template n8n copies. Do not move clause text into React.

The onboard payload to n8n therefore carries, on top of the client record fields:
`drive_folder`, `team_emails`, `client_emails`, `contract` (structured), and
`contract_placeholders` (the same data pre-mapped to `{{TOKENS}}` so n8n's `replaceAllText`
needs no expression logic). n8n's "Merge and Encode" builds the `clients.json` record
field-by-field and ignores unknown keys, so none of these reach public client data.

### What the n8n onboarding workflow does with that payload

`RampUp Client Onboard` (`8FzY05RJnU8UPpet`) runs 38 nodes in one linear chain. The order is
deliberate — this is the sequence, and the reasons it is this sequence:

```
Receive Onboard → Prepare Variables → Check Slug        ← fails here if duplicate
  → Create Shared Drive (named from drive_folder)       ← + Year/WEBSITE/feed-design/
  → Build Response Data                                    monthly-plan/Brand Assets
  → Build Access Items → … → Share Drive Permission     ← team + client emails
  → Copy Contract Template → … → Contract Result        ← Google Docs
  → Get FlowAccount Token → Create FlowAccount Contact
  → Fetch clients.json → Merge and Encode → Commit to GitHub
  → Shape Clients Row → Append to Clients → … → Append to SHOOT Tab
  → Return Folder IDs
```

- **The slug check runs first, before anything is created.** It used to live inside
  `Merge and Encode`, late in the chain, where a duplicate slug aborted *after* a Shared Drive
  had been created, shared with the whole team, and a contract generated.
- **Sheets run last.** They are bookkeeping; a Google Sheets 429 must not be able to truncate an
  onboard that has already made a Drive. All four Sheets nodes carry `retryOnFail` (3×3s),
  `onError: continueRegularOutput` **and `alwaysOutputData`** — the last one matters, because a
  node emitting zero items silently ends the branch and n8n still reports the run as *success*.
- **Every step after the Drive is non-fatal** and reports into one `warnings[]` array, which the
  control panel renders as an amber partial success.

**The optional service sections are handled by block markers, not text replacement.** The master
template contains each service's clause fully formatted between `{{GRAB_BLOCK_START}}` /
`{{GRAB_BLOCK_END}}` (likewise `LINE_OA`, `LINEMAN`, `GRAB_CONFIDENTIALITY`). `Compute Contract
Edits` keeps or deletes each block **by index range**, which is what preserves headings, bold and
bullets — `replaceAllText` cannot insert formatted multi-paragraph content. Two rules that code
depends on: deletions are ordered **descending by `startIndex`** (deleting low indexes shifts
everything below), and **all deletions precede any `replaceAllText`** (replacement changes
document length and invalidates ranges computed from the snapshot). Markers are found by
flattening the document into one string with an index map, because Docs routinely splits a
marker across several `textRun`s.

**FlowAccount** (`POST /v1/contacts`) files the client for invoicing. `contactType` and
`contactGroup` are the **string** `"3"`, copied off an existing correct record — the SDK docs
describe them as ints, which is wrong. `contactCode` is the client name and becomes the sheet's
CONTACT ID; the returned `id` becomes FLOWACCOUNT_CONTACT_ID. FlowAccount answers **HTTP 200 with
`status: false`** on a rejected write, so success is checked on `status === true` plus an `id`,
never on the status code.

The client id/secret sit in the token node's body parameters rather than a credential. This is
not laziness: n8n corrupts a form-urlencoded body when merging a Custom Auth credential,
FlowAccount ignores query-string credentials and rejects HTTP Basic, n8n's generic OAuth2
credential never performs the client-credentials exchange, and n8n Variables are unlicensed on
this plan. The token node also needs `specifyBody: "keypair"` — without it n8n ignores
`bodyParameters` entirely and posts an empty body, which FlowAccount reports as `invalid_client`.

**The webhook node must keep its `Internal Webhook Token` header-auth credential.** Editing this
workflow through the API has silently dropped it before, leaving `/webhook/onboard` open to
anyone who knew the URL. After any workflow edit, confirm an unauthenticated POST returns 403.

### Bilingual routing

English lives at `/`, Thai at `/th/*` as parallel duplicated route files. There is no i18n framework and no locale middleware.

Thai copy is centralised in `lib/translations.ts` (`export const th`). English copy is inline in each page/component. Shared components (`Nav`, `Footer`, `LeadForm`, `PricingCard`) take a `Lang` prop and switch internally; `Nav` derives `isTh` from `usePathname()`.

**A change to an English page needs the same change to its `/th` twin.** Nothing enforces this.

### Pricing

Read `docs/PRICING.md` before touching any price — it is the maintained checklist for this.

`lib/pricing.ts` holds the package price and website build price; `components/PricingCard.tsx` is the only component that renders them. Add-on prices (Grab ฿9,990, Lineman ฿4,990, LINE ฿3,990) are still hardcoded strings in `PricingCard.tsx` **and** duplicated in Thai in `lib/translations.ts` — those two must be updated together by hand.

Google Map Ads is bundled into the base package and must not be presented as a paid add-on. It may still appear as a service we manage.

## Environment

Copy `rampup-site/.env.local.example` to `.env.local`. Only `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is public; everything else (n8n webhook URLs, `N8N_INTERNAL_WEBHOOK_TOKEN`, `CONTROL_PANEL_PASSWORD`, Cloudflare Stream keys) is server-only and must never gain a `NEXT_PUBLIC_` prefix.

The app degrades gracefully without these: no Stream code means no videos, no Turnstile secret means CAPTCHA is skipped.

## Legacy files at the repo root

The root of this repo is **not** the app. It holds pre-Next.js artifacts that are still committed:

- `index.html`, `okasan.html` — large standalone static exports of the old portfolio site.
- `clients.json` (root) — a **stale** copy with 18 clients and a different schema. The live data is `rampup-site/data/clients.json` with 32. Do not edit or read the root copy.
- `rampup-work/` — a nested folder of three barebones placeholder files, committed upstream.
- `brand.json` — a design-token spec document. **No code imports it.** The implementation is `rampup-site/tailwind.config.ts`; if you change brand colors or fonts, change the Tailwind config, and update `brand.json` only to keep the spec honest.

## Note on `.mcp.json`

`.mcp.json` is committed at the repo root and contains a hardcoded n8n Bearer token. Treat it as a live credential — do not copy it into logs, issues, or new files.
