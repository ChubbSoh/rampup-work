# Marketing System — Build Plan

Target repo: `ChubbSoh/rampup-work` (app lives in `rampup-site/`).
Save this as `docs/MARKETING-SYSTEM-PLAN.md`.

> **Caveat:** findings below come from the n8n JSON exports committed at
> `rampup-site/n8n/`. The live workflows on `rampupth.app.n8n.cloud` may have
> drifted from these files. Verify each finding in n8n before fixing.

---

## What's broken today

### 1. n8n destroys every tracking field (this is the CAPI bug)

`components/LeadForm.tsx` does the hard part correctly — it generates a shared
`event_id`, reads the `_fbp` / `_fbc` cookies, fires
`fbq('track','Lead',{},{eventID})`, and posts all three to `/api/lead-relay`.
`app/api/lead-relay/route.ts` then adds `client_ip_address` and
`client_user_agent`.

Then `lead-workflow-part1.json` → **Normalize Fields** rebuilds the payload from
a fixed whitelist:

```
name, email, phone, restaurant, service, message,
page_path, page_url, page_type, form_name, submitted_at, source, site
```

`event_id`, `fbp`, `fbc`, `client_ip_address` and `client_user_agent` are not on
that list, so they are silently dropped at the first node. Nothing downstream can
ever see them.

### 2. There is no CAPI node

The four committed workflows contain: webhook → normalize → validate → respond,
confirmation email, internal email, Sheets append. No HTTP Request node posting
to `graph.facebook.com`. So the pixel fires and nothing server-side does — which
means there is no dedup problem yet, because there is no second event.

### 3. Grab-offer leads are being rejected and lost

`lead-workflow-part1.json` → **Validate Required Fields** uses combinator `and`
across name, email **and** phone. `app/grab-offer/LeadForm.tsx` sends
`email: ''` by design (phone/LINE only funnel).

Every grab-offer lead therefore returns 422 and is dropped. The form's fetch ends
in `.catch(() => {})` and the UI shows success regardless, so this fails silently
on both ends. `CLAUDE.md` already documents the intended rule — "name plus
*either* email or phone" — the workflow just doesn't implement it.

**Check the Sheet against Meta's lead count for the grab-offer campaign. The gap
is your loss.**

### 4. No `fbclid` / `gclid` / UTM capture anywhere

A grep across the whole site returns nothing. Consequences:

- "What ad worked best" is unanswerable for **Google Ads** — no `gclid` means no
  offline conversion import, ever.
- For Meta, `_fbc` only exists if the visitor arrived with `fbclid` in the URL on
  that browser. Direct/organic/returning visitors have nothing.

### 5. Seven LeadForm files

`components/LeadForm.tsx` (316 lines) plus six local copies (150–210 lines each).
They have already drifted — `grab-offer` lacks the `dataLayer` push the funnel
variant has. Every fix has to be made seven times, so it won't be.

### 6. Sheets node has a placeholder document ID

`documentId` is `YOUR_GOOGLE_SHEET_ID_HERE` and `sheetName` is `Sheet1`. Confirm
the live workflow points at a real sheet.

---

## Target architecture

```
Meta lead ad ──┐
               ├─→ n8n webhook ─→ enrich ─→ Sheets(Leads) ─→ LINE push (buttons)
website form ──┘                              │
                                              ↓
                          LINE button tap ─→ Sheets(LeadEvents)
                                              │
                                    ┌─────────┼──────────┐
                                    ↓         ↓          ↓
                              Meta CAPI  Google OCI  follow-up
```

State lives in Google Sheets, consistent with Collections. Three tabs:

**`Leads`** — one row per lead, mutable `current_stage`
```
lead_id, created_at, lead_type, source, site, form_name, page_type, page_path,
name, restaurant, email, phone, service, message,
campaign_id, campaign_name, adset_id, adset_name, ad_id, ad_name,
fbclid, gclid, utm_source, utm_medium, utm_campaign, utm_content,
event_id, fbp, fbc, client_ip_address, client_user_agent,
current_stage, owner, reject_reason
```

**`LeadEvents`** — append-only, one row per stage change. Every metric derives
from here.
```
event_row_id, lead_id, stage, timestamp, actor, note
```
Stages: `new → contacted → quoted → accepted | rejected`

**`AdSpend`** — daily pull from Meta + Google Ads APIs
```
date, platform, campaign_id, campaign_name, adset_id, ad_id, ad_name,
spend, impressions, clicks, platform_reported_leads
```

`lead_id` format: `L-{YYYYMMDD}-{6 random chars}`. Generated in n8n, written back
in the webhook response, and used as the CAPI `event_id` suffix so every system
shares one key.

---

## Phases

### Phase 0 — Stop the bleeding (do first, ~1 hour)

1. In n8n, change **Validate Required Fields** to: `name` notEmpty AND (`email`
   notEmpty OR `phone` notEmpty). n8n's IF node needs a nested group or a Code
   node — a Code node is simpler and more readable.
2. In **Normalize Fields**, stop whitelisting. Keep the cleaning, but spread the
   rest through:
   ```js
   const normalized = { ...raw, name: clean(raw.name), email: clean(raw.email).toLowerCase(), ... }
   ```
3. Remove `.catch(() => {})` from the LeadForm submit handlers, or at minimum
   log the failure — a silent success screen on a 422 is how #3 stayed hidden.
4. Confirm the Sheets node points at a real document ID.

**Do not start Phase 1 until you've reconciled the Sheet row count against Meta's
reported lead count for the last 30 days.**

### Phase 1 — One capture path

1. Delete the six local `LeadForm.tsx` copies. Extend
   `components/LeadForm.tsx` to take a config prop:
   ```ts
   type LeadFormConfig = {
     leadType: 'sales' | 'hiring'
     formName: string
     pageType: string
     fields: Array<'restaurant' | 'email' | 'phone' | 'grab_revenue' | 'message' | 'service'>
     requireEmail?: boolean
   }
   ```
2. Add a `useTrackingParams()` hook that on mount reads `fbclid`, `gclid`,
   `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` from the URL and
   persists them to `sessionStorage` (so they survive navigation from landing
   page to a different funnel page before submit). Include them in the payload.
3. Add `lead_type` to every payload. Website funnels are `sales`; a hiring page
   sets `hiring`.
4. Keep `event_id`, `fbp`, `fbc` exactly as they are — that logic is already
   right.

### Phase 2 — Meta lead ads into the same pipe

Meta lead ads are separate forms/campaigns, so routing is a field check, not a
classifier.

1. n8n: Facebook Lead Ads trigger → map to the same normalized shape.
2. Set `lead_type` from `form_id`. Keep an explicit `form_id → lead_type` map in
   a Code node; unknown IDs default to `sales` and raise a LINE alert rather than
   guessing.
3. Meta lead ads give you `ad_id`, `adset_id`, `campaign_id` natively — write
   them straight to the Leads columns.
4. Set `source: 'meta_lead_ad'` and `action_source: 'system_generated'`.

### Phase 3 — LINE routing with action buttons

1. Sales → your LINE. Hiring → Grace. Reuse the existing LINE OA + Messaging API
   worker (`rampup-line-worker` on Cloud Run) rather than a new channel.
2. Push a Flex Message: name, restaurant, phone, source, ad name, and four
   postback buttons — **Contacted / Quoted / Accept / Reject**.
3. Postback data: `action=stage&lead_id=L-...&stage=contacted`.
4. Handler appends to `LeadEvents` and updates `current_stage` in `Leads`.
5. Reject triggers a follow-up prompt for a reason (quick-reply chips: price,
   location, timing, not a fit, no response).

This is the whole touchpoint-tracking mechanism. Since you work by phone and
personal LINE, nothing else can see those contacts — the tap is the record. If
you won't tap consistently, cut touch points from the report rather than ship a
metric you don't trust.

### Phase 4 — Tracking done properly

**Meta CAPI**, as an n8n HTTP Request node to
`https://graph.facebook.com/v21.0/{PIXEL_ID}/events`:

- Fire `Lead` on lead creation with the **same `event_id`** the browser used.
  That's what makes dedup work.
- `user_data`: SHA256 of normalized `em`, `ph`, `fn`; plus raw `fbp`, `fbc`,
  `client_ip_address`, `client_user_agent` (these four are **not** hashed).
- Normalization before hashing: lowercase, trim, strip punctuation. Thai phones
  must be `66812345678` — not `081-234-5678`, not `0812345678`.
- `event_time` in **seconds**, not milliseconds. Meta rejects events older than
  7 days.
- `action_source`: `website` for site forms, `system_generated` for lead ads.
- Strip `test_event_code` before going live — with it present, events show in
  Test Events and never count in reporting.

**Then the part that actually matters:** on Accept, send a second event
(`Purchase` or a custom `QualifiedLead`) keyed to the same lead. For Meta lead
ads use the CRM lead event with `lead_id`. This is what moves optimization off
form-fill volume and onto real clients — worth more than every dashboard in this
plan.

**Google Ads offline conversion import:** upload `gclid` + conversion time +
value on Accept. Without the Phase 1 `gclid` capture this is impossible, which is
why Phase 1 comes first.

Add an Event Match Quality check to the monthly report. Below ~5 means user_data
is thin.

### Phase 5 — Follow-up + accept/reject

- Instant: confirmation email (exists) plus a LINE auto-reply where you have the
  user ID.
- T+1 day, no `contacted` event → nudge you in LINE, not the lead.
- T+3, T+7 days, still no stage change → templated follow-up to the lead.
- Accept → onboarding sequence (the `/api/onboard` route already exists — wire
  it to this rather than rebuild).
- Reject → polite templated message. Recommend a generic decline with a warm
  door-open line; specific reasons invite negotiation and cost you time. Log the
  real reason internally.

### Phase 6 — Monthly report

n8n cron on the 1st, pushed to LINE + written to a Sheet tab:

- Spend, leads, cost per lead — by platform, campaign, ad
- **Cost per accepted client** — the only number that decides budget
- Top 3 ads by accepted clients (not by leads)
- Avg touch points to accept vs to reject
- Avg days: lead → contacted, contacted → accepted
- Funnel page conversion rate (`page_type` → accept rate)
- Rejection reasons, counted
- Event Match Quality + CAPI dedup rate

---

## Funnel content consistency

Already half-solved: `lib/pricing.ts` + `PricingCard.tsx` centralize the package
and website-build prices, and `docs/PRICING.md` documents it. Three leaks remain:

1. Add-on prices (Grab ฿9,990 / Lineman ฿4,990 / LINE ฿3,990) are hardcoded
   strings in `PricingCard.tsx` **and** duplicated in Thai in `lib/translations.ts`.
2. Root `index.html` and `okasan.html` are static and can't read `pricing.ts`.
3. Nothing connects `pricing.ts` to FlowAccount invoice line items, so a price
   change still needs a manual invoice update.

Fix in that order:

1. Make `PricingCard.tsx` and `translations.ts` read `addOns` from `pricing.ts`.
   Thai strings should interpolate the number, not restate it.
2. Either delete the root static HTML or add a build-time check that fails if a
   price string in them disagrees with `pricing.ts`.
3. Have the onboarding/invoice flow read `pricing.ts` (or a generated
   `pricing.json`) instead of its own constants.

Do **not** move pricing into a Google Sheet. It's already typed, version-
controlled, and reviewed through PRs — a Sheet would be a downgrade. The Sheet is
the right surface for lead data, not for code constants.

One guardrail: never change a price on a page with live ad campaigns pointing at
it without updating the ad copy in the same session. Mismatched price between ad
and landing page gets flagged by Meta.

---

## Order of work

| Phase | Unblocks | Rough size |
|---|---|---|
| 0 — validation + passthrough | everything | 1 hour |
| 1 — one form, tracking params | 2, 4 | half day |
| 2 — Meta lead ads in | 3 | half day |
| 3 — LINE buttons + LeadEvents | 5, 6 | 1 day |
| 4 — CAPI + offline conversions | better ad spend | 1 day |
| 5 — follow-up + accept/reject | — | 1 day |
| 6 — monthly report | — | half day |

Phase 0 and Phase 4's qualified-lead feedback are the two highest-value items.
Everything else is reporting.

---

## Verification notes — 2026-09-03

Every finding above was checked against the repo at the time this file was
committed. All six are **confirmed**, with two corrections:

**Correction to #3 — grab-offer leads are not lost, they are downgraded.**
Every LeadForm posts to Netlify Forms *first* and only calls `/api/lead-relay`
if Netlify returned OK (`components/LeadForm.tsx` comments this as "Netlify is
source of truth"). So a grab-offer lead is captured by Netlify Forms and then
422s at n8n. What is actually lost is the Sheets row, the confirmation email to
the lead, and the internal notification email — not the contact details.
**Reconcile Netlify Forms against the Sheet, not Meta against the Sheet.**

**Correction to #5 — grab-offer does have the `dataLayer` push.**
`app/grab-offer/LeadForm.tsx:39-41` pushes
`{ event: 'lead_form_submit', event_id }`, identical to the funnel variant. The
real drift across the seven files is elsewhere:

- `app/restaurant-marketing/LeadForm.tsx` is the outlier — it fires an extra
  `restaurant_lp_form_start` event, an extra `restaurant_marketing_lead`
  dataLayer push, and uses optional-chaining (`fbq?.`) rather than the `if
  (window.fbq)` guard the other six use.
- `components/LeadForm.tsx` is the only one sending `language`, `grab_ads`,
  `timeline`, and a `page_type` derived from a path lookup map.
- The four funnel/lp copies are near-identical 189–197 line clones.

Confirmed as written: #1 (Normalize whitelist drops `event_id`, `fbp`, `fbc`,
`client_ip_address`, `client_user_agent`), #2 (no `graph.facebook.com` reference
anywhere in the repo), #4 (zero matches for `fbclid`, `gclid`, or any `utm_*`),
#6 (`documentId` is literally `YOUR_GOOGLE_SHEET_ID_HERE`, `sheetName` is
`Sheet1`).

`app/api/lead-relay/route.ts` is correct and needs no change — it already
enforces name + (email OR phone) and adds the two server-side signals. The bug
is entirely on the n8n side.
