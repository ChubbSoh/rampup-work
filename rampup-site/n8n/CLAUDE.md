# n8n workflows

`website-lead-flow.json` is a **real export of the running workflow**, pulled
from the n8n public API on 2026-09-08. Live id `atfktDPwj5ks5nIR`, name
`Website Lead Flow — RampUp`, 14 nodes, active.

## Read this before diagnosing anything from this directory

Until 2026-09-08 this directory held four files describing a 4-node workflow:
webhook → normalize → validate → respond, plus separate email and Sheets files.
**Production never looked like that.** A whole build plan was written on top of
them, and three of its six findings were wrong:

| Claimed from the old exports | Actually running |
|---|---|
| No Meta CAPI node exists | CAPI has been live for months |
| Validate required name AND email AND phone, so phone-only leads 422'd | Validate has always been `name AND (email \|\| phone)` |
| Normalize dropped every tracking field | `event_id`, `fbp`, `fbc`, IP and UA all survived |

The whitelist in Normalize Fields was real, and it did drop fields the site
added later. That was the one true finding of the three.

**So: never diagnose a lead-flow problem from a file in this directory. Pull the
live workflow first.** An export is a photograph, and this one will start
drifting the moment somebody edits in the n8n UI.

## Pulling and patching the live workflow

The n8n MCP server's write tools validate and then fail. Use the public API
directly. The key is in `~/.claude.json` under `mcpServers.n8n-mcp.env`.

```bash
curl -s -H "X-N8N-API-KEY: $N8N_KEY" \
  https://rampupth.app.n8n.cloud/api/v1/workflows/atfktDPwj5ks5nIR -o live.json
```

To patch, edit the node you want and `PUT` back `{name, nodes, connections,
settings}` only — the API rejects read-only fields like `id` and `createdAt`.
Diff every node against the pull afterwards and confirm only the ones you meant
to touch changed; a full-object PUT will happily overwrite the other eleven.

The workflow stays active across a PUT, but check `active` in the response.

## Secrets

**The export is redacted.** `Send to Meta CAPI` carries its access token as a
plaintext `access_token` **query parameter**, which is both a leak into every
log that records URLs and the reason this file cannot be committed verbatim. The
value here is `REDACTED_SEE_N8N_CREDENTIALS`; re-importing this file will
produce a workflow that cannot authenticate to Meta until the token is put back.

Fix properly: move it to an n8n credential or a header, and rotate the exposed
one.

## Meta instant-form leads

These never touch the website, so they never reach this workflow on their own.
`leads_retrieval` is gated behind Meta App Review and is **not requestable** —
verified 2026-09-08 in the Graph API Explorer permission list, where it is absent
from its alphabetical position even with all six of its dependency permissions
attached. n8n ships no OAuth app of its own, so its Facebook Lead Ads node
inherits that wall.

The bridge is a connector that already holds the approval (Make, Zapier,
LeadsBridge), POSTing into the same `rampup-lead` webhook the website uses. The
workflow then treats an instant-form lead like any other: set `source` to
something matching `/lead_ad|meta_lead|instant_form/i` and `Hash PII for CAPI`
switches `action_source` to `system_generated`, because those leads never touched
a browser and claiming `website` is a lie Meta scores against us.

Set `lead_type` per form. There is no `form_id → lead_type` map yet; when one is
added, an unknown form id should default to `sales` and raise an alert rather
than guess.

## The Leads sheet

Document `1X1HvEwae4v-TubdZ0pR2fwcFtWYYdGOF8bwl5nTkxwg`, tab `Sheet1`.

The Sheets node maps with `defineBelow`, so **a mapped column missing from row 1
is dropped silently** — no error, no failed execution. Same shape of failure as
the Normalize whitelist.

The original 13 headers keep their positions so existing rows still line up.
These 19 were appended to the right on 2026-09-08:

```
lead_id	lead_type	grab_revenue	grab_ads	timeline	restaurant_type	main_goal	language	fbclid	gclid	utm_source	utm_medium	utm_campaign	utm_content	event_id	fbp	fbc	client_ip_address	client_user_agent
```

`lead_id` is therefore column N, not column A. Appending was chosen over
inserting so live data was never shifted.

`restaurant_type` and `main_goal` exist in the live workflow but nothing in
`rampup-site` sends them — they predate the current forms.

Campaign / adset / ad columns arrive with Meta lead ads (Phase 2), and
`current_stage` / `owner` / `reject_reason` with LINE routing (Phase 3).

## LINE

`Build LINE lead card` → `Notify Chubb via LINE` push a Flex card for every
valid lead. They hang off `Respond 200 OK` as a **parallel branch**, so a LINE
outage cannot stop the Sheets row or the CAPI event, and vice versa.

**Routing is by `lead_type`:** `sales` → Chubb, `hiring` → Grace. An unset or
unrecognised value falls through to `sales` — a misrouted lead is recoverable,
a silent one is not.

The headline and the `altText` carry whatever identifies the person at a glance:
the **restaurant** for a sales lead, the **applicant's name** for a hiring one,
since applicants have no restaurant. `altText` is the only thing the LINE push
notification shows, so anything not in it is invisible until the card is opened.

Everything that sends a LINE message goes through the gateway relay. See
`LINE-INTEGRATION.md` in `ChubbSoh/rampup-line-gateway` — one `POST` to
`/external/send-push` with an `X-Push-Secret` header, supplied here by the
n8n credential `rampup-line-worker Push Secret` (`tUWwvWVHcfLDeN5r`). Never post
at `rampup-line-worker` directly, and never put a LINE token in a workflow.

**The relay does not retry.** A LINE 429 comes back as HTTP 500, so the node
carries `retryOnFail` with a 5s wait, matching the P&L workflow. It also caps at
5 messages per call and silently truncates beyond that; this sends one.

The recipient id is redacted in the export. Live it is Chubb's LINE user id,
taken from the roster in `RampUp P&L — month on month to LINE`. Grace's id sits
commented out in that same workflow, which is where hiring routing will get it
when Phase 3 lands.
