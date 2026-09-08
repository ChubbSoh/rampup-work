# Meta lead ads — setup

Two tracks, run in parallel. Track A works today and needs no approval from
anyone. Track B is the Meta bureaucracy, which is slow and mostly waiting.

Written 2026-09-08.

---

## Why instant forms are invisible right now

A Meta instant form is filled inside Facebook. It never touches the website, so
it never reaches `/api/lead-relay`, never reaches the `rampup-lead` webhook, and
never reaches any of the pipeline built in Phases 0–1. Those leads sit in Meta
Leads Center until somebody opens it.

Confirmed 2026-09-08: no Facebook Lead Ads trigger exists in any of the 17 n8n
workflows. Nothing is watching.

---

## Track A — point the ads at the website funnels (works today)

Every website funnel already produces a LINE card, a Sheet row and a CAPI event.
Switching an ad's destination from an instant form to a funnel page needs no app,
no permissions and no review.

The trade is real and worth stating: instant forms usually convert at a higher
rate because there is no page load and the fields are prefilled. Website forms
usually produce better-qualified leads and far better attribution — you get
`gclid`, `fbclid`, UTMs, page path, and the full 32-column row.

### Destination URLs

Use the trailing slash. Without it the site 308-redirects, which costs a hop.

| Funnel | URL |
|---|---|
| Grab offer | `https://rampupth.com/grab-offer/` |
| Restaurant marketing (cold) | `https://rampupth.com/restaurant-marketing/` |
| Restaurant marketing (funnel) | `https://rampupth.com/funnel/restaurant-marketing/` |
| Bacio | `https://rampupth.com/lp/bacio/` |
| Lamaya BKK | `https://rampupth.com/lp/lamaya-bkk/` |
| Okasan | `https://rampupth.com/lp/okasan/` |

### URL parameters

Put this in the **URL parameters** field of the ad (Ads Manager → Ad level →
Tracking), not in the destination URL. It then applies to every ad without
editing each link:

```
utm_source=meta&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
```

Those four are the only UTMs the site captures and the Sheet has columns for.
Adding others (`utm_term`, adset name) will survive into the LINE card and CAPI
but land nowhere in the Sheet, because the Sheets node maps by column name.

Meta appends `fbclid` itself. `lib/tracking.ts` stores it in `sessionStorage`, so
it survives a visitor moving between funnel pages before submitting.

### What you get per lead

LINE card within seconds, a row in `Sheet1`, and a CAPI `Lead` event carrying the
same `event_id` as the browser pixel so the two deduplicate.

---

## Track B — the Meta app, for real instant-form retrieval

### What the docs actually require

Sources: [Retrieving Leads](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving/),
[n8n Facebook Lead Ads credentials](https://docs.n8n.io/integrations/builtin/credentials/facebookleadads/).

Permissions, all five:

- `ads_management` — **not** `ads_read`
- `leads_retrieval`
- `pages_show_list`
- `pages_read_engagement`
- `pages_manage_ads` — **not** `pages_manage_metadata`

Token: a **Page access token**, obtained by a person who can advertise on both
the Page and the ad account. Not a system user token.

**`leads_retrieval` does not appear in any use-case permission screen until it is
requested under App Review → Permissions and Features.** That is why it looks
missing. It is gated, not absent.

### Order of work

1. App → **App Review → Permissions and Features** → request Advanced Access for
   `leads_retrieval` and `pages_manage_ads`. They appear in the use-case screens
   only after this.
2. Add a **privacy policy URL** in App Settings → Basic. Required before Live.
3. Complete **Meta business verification** (Business Settings → Security Centre).
   This is the slow one — allow days, not hours.
4. Switch the app from **Development to Live**.
5. Request Advanced Access for `public_profile` — n8n's trigger needs it.
6. In n8n, create a **Facebook Lead Ads** credential with the app's client ID and
   secret, and authorise as a user who can advertise on the Page.
7. Test with Meta's **Lead Ads Testing Tool** before pointing a live ad at it.

### Then the workflow

A Facebook Lead Ads trigger maps the instant form onto the same normalized shape
as a website lead and feeds the same pipeline, so the LINE card, the Sheet row
and the `lead_id` are identical. Three differences to handle:

- `action_source` is `system_generated`, not `website`.
- There is no browser, so no `fbp`, `fbc` or `event_id`. Match quality rests
  entirely on the hashed phone and email — which is why the `66XXXXXXXXX`
  normalization fixed on 2026-09-08 matters more here, not less.
- `ad_id`, `adset_id` and `campaign_id` arrive natively. That is better
  attribution than the website forms get, and those columns should be added to
  the Sheet when this lands.

Route `form_id → lead_type` from an explicit map in a Code node. An unknown form
id defaults to `sales` and raises a LINE alert rather than guessing — a hiring
form silently routed to sales is worse than a loud unknown.
