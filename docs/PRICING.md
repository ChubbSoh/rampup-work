# Pricing — start here

**When Restaurant RampUp pricing changes, check this file first.**

## Where the price is controlled

The Restaurant RampUp package price is centralized in
[`rampup-site/lib/pricing.ts`](../rampup-site/lib/pricing.ts):

```ts
export const restaurantRampUp = {
  price: 59990,               // THB / month
  billingPeriod: 'month',
  includesGoogleMapAds: true,
}

export const websiteBuild = {
  price: 79990,                // THB, one-time
  billing: 'one-time',
}
```

[`components/PricingCard.tsx`](../rampup-site/components/PricingCard.tsx) is the
**single** pricing UI component, imported by every page that shows pricing
(home, `/social-media`, `/grab-sales`, `/contact`, and their `/th/...`
equivalents). It reads `restaurantRampUp.price` / `websiteBuild.price` via the
`formatTHB()` helper instead of hardcoding a number, so **changing the number
in `lib/pricing.ts` updates every page automatically** — no per-page edits
needed.

## Current pricing (as of 2026-08-10)

| Item | Price |
|---|---|
| Restaurant RampUp package | **฿59,990 / month** |
| Google Map Ads | **Included** in the package (not sold separately) |
| Website design & build | ฿79,990 (one-time) |
| Grab sales add-on | ฿9,990 / month |
| Lineman add-on | ฿4,990 / month |
| LINE sales-channel add-on | ฿3,990 / month |

Google Map Ads used to be a ฿5,990/month add-on. It was folded into the base
package and removed from the add-ons list in both `PricingCard.tsx` (English)
and `lib/translations.ts` (`th.pricing.addons`, Thai). Google Maps still
appears elsewhere on the site as a **platform we manage as part of the
service** (e.g. the social-media platforms list, `Google Maps search ads`
copy in the funnel page) — that's legitimate service description, not a
paid upsell, and should stay.

## Where to look whenever pricing changes

1. **`rampup-site/lib/pricing.ts`** — change the number here first.
2. **`rampup-site/components/PricingCard.tsx`** — the only place the price is
   rendered; also holds the add-ons list and included-features list. Update
   wording here if a feature moves in/out of the base package.
3. **`rampup-site/lib/translations.ts`** — Thai copy for `pricing.items` and
   `pricing.addons` (the English fallbacks live inline in `PricingCard.tsx`).
   Keep these two in sync manually — they're not derived from each other.
4. Repo-wide search for stray hardcoded prices (see command below) — should
   turn up nothing outside the two files above.

### Search pattern for future audits

```bash
# From the repo root — find any THB price-looking numbers or "add-on"/"upsell" wording
grep -rniE "([0-9]{1,3}[,. ]?[0-9]{3})\s*(thb|บาท|฿)?|google\s*map(s)?\s*ads?" \
  --include='*.ts' --include='*.tsx' --include='*.html' --include='*.json' \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git .
```

Then manually confirm any hit is either (a) a different, unrelated price
(e.g. Grab/Lineman add-ons, website build fee, base64 image data producing
false-positive digit matches in static HTML exports), or (b) legitimate
Google Maps service description rather than a separate paid upsell.

## Pages that still contain manually entered prices

- `rampup-site/components/PricingCard.tsx` — English add-on prices
  (`฿9,990`, `฿4,990`, `฿3,990`) and `lib/translations.ts` Thai equivalents
  are still hardcoded strings, not pulled from `lib/pricing.ts`. Only the
  main package price and website build price were centralized per this
  task's scope; if these smaller add-ons start changing often too, consider
  moving them into `lib/pricing.ts` as well.
- Static exported pages at the repo root (`index.html`, `okasan.html`,
  `rampup-work/index.html`, `rampup-work/okasan.html`) are generated
  client-shoot/portfolio pages and do not display package pricing — nothing
  to maintain there for pricing purposes.
- There is no CMS/JSON-LD/structured-data pricing anywhere in the repo as of
  this writing (verified via the search pattern above).
