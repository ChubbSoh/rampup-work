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
