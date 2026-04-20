// Internal client record — superset of the public Client type.
// Fields here are NEVER passed to browser-facing code directly.
// Public-facing code uses lib/types.ts Client instead.

export interface ClientRecord {
  // ── Identity ─────────────────────────────────────────────────────────────
  name: string
  slug: string
  cuisine: string
  location: string
  description: string

  // ── Internal metadata ─────────────────────────────────────────────────────
  months: number | string
  active: boolean
  last_updated?: string

  // ── Public display ────────────────────────────────────────────────────────
  cover: string
  page: string
  videos?: string[]
  photos?: string[]

  // ── Google Drive folder IDs (server-only) ─────────────────────────────────
  drive_folder?: string          // human-readable folder name (legacy field)
  drive_folder_id?: string       // Google Drive folder ID for client root
  website_folder_id?: string     // Google Drive folder ID for website assets
  brand_assets_folder_id?: string // Google Drive folder ID for brand assets
}

export interface ClientsFile {
  clients: ClientRecord[]
}
