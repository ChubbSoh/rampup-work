// Email normalisation/validation shared by the /control UI and /api/onboard.
//
// Contains no secrets and is safe to import from a client component. The server
// re-runs the same checks: browser validation is a convenience, never the gate.

/**
 * Deliberately conservative. Not RFC 5322 — that is unenforceable in a regex —
 * but enough to catch the realistic typo cases (missing @, missing TLD, spaces)
 * before we hand an address to the Google Drive API.
 */
const EMAIL_RE = /^[^\s@,;]+@[^\s@,;]+\.[A-Za-z]{2,}$/

/** Trims and lowercases the domain only; local-parts are case-sensitive per spec. */
export function normalizeEmail(raw: string): string {
  const trimmed = raw.trim()
  const at = trimmed.lastIndexOf('@')
  if (at === -1) return trimmed
  return trimmed.slice(0, at) + '@' + trimmed.slice(at + 1).toLowerCase()
}

export function isValidEmail(raw: string): boolean {
  return EMAIL_RE.test(normalizeEmail(raw))
}

/** Key used for case-insensitive duplicate detection across both lists. */
export function dedupeKey(raw: string): string {
  return normalizeEmail(raw).toLowerCase()
}

/** Splits a pasted blob on comma, semicolon, whitespace and newlines. */
export function splitEmailInput(raw: string): string[] {
  return raw
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Normalises a list: trims, dedupes case-insensitively, preserves input order.
 * Does NOT drop invalid addresses — callers decide whether to reject or report.
 */
export function normalizeEmailList(list: unknown): string[] {
  if (!Array.isArray(list)) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const entry of list) {
    if (typeof entry !== 'string') continue
    const email = normalizeEmail(entry)
    if (!email) continue
    const key = dedupeKey(email)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(email)
  }
  return out
}
