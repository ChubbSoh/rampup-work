# n8n workflows

These JSON files are **exports, not live configuration.** The running workflows
are on `rampupth.app.n8n.cloud` and are updated by hand. Editing a file here
changes nothing until it is imported.

Two consequences:

- These files may have drifted from what's live. Before diagnosing a lead-flow
  problem from this directory, say so and ask for a fresh export.
- When asked to fix a workflow, produce importable JSON, not prose instructions.
  Keep node IDs and connection structure intact so the import doesn't orphan
  credentials.

`documentId` values may be placeholders (`YOUR_GOOGLE_SHEET_ID_HERE`) rather
than real sheet IDs. Never assume the export tells you which sheet is live.

Credentials are never in these exports. Don't add them.

## The Leads sheet header row

The Sheets node maps with `defineBelow`, so **every mapped column must already
exist as a header in the sheet** or the value is dropped without an error. Paste
this as row 1, in this order:

```
lead_id	submitted_at	lead_type	source	site	form_name	page_type	page_path	page_url	name	restaurant	email	phone	service	message	grab_revenue	grab_ads	timeline	language	fbclid	gclid	utm_source	utm_medium	utm_campaign	utm_content	event_id	fbp	fbc	client_ip_address	client_user_agent
```

`lead_id` stays in column A — it is the join key for the `LeadEvents` tab.

`event_id`, `fbp`, `fbc`, `client_ip_address` and `client_user_agent` are the
Meta CAPI match signals. They only arrive if Normalize Fields passes them
through; a whitelist there empties all five at once.

Campaign / adset / ad columns arrive with Meta lead ads (Phase 2), and
`current_stage` / `owner` / `reject_reason` with LINE routing (Phase 3).
