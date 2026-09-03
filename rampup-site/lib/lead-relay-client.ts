'use client'

/**
 * Client-side wrapper around POST /api/lead-relay.
 *
 * Exists because the relay used to be called with `.catch(() => {})`, so a
 * failure downstream (n8n 422'ing every phone-only lead, for one) was invisible
 * on both ends. Every failure now logs unconditionally and pushes a
 * `lead_relay_failed` dataLayer event so it surfaces in GTM.
 *
 * The caller decides what the visitor sees. That depends on which system is the
 * source of truth for that form:
 *   - Netlify-gated forms (most of them) already have the lead when this runs,
 *     so a relay failure costs notifications, not the lead — keep the success
 *     screen and rely on the logging here.
 *   - app/restaurant-marketing is relay-gated (Netlify is fire-and-forget), so
 *     a relay failure there means the lead may be gone — show an error.
 */

export type RelayResult =
  | { ok: true; lead_id?: string }
  | { ok: false; status: number; reason: string }

export async function postLead(
  payload: Record<string, unknown>,
): Promise<RelayResult> {
  const event_id = payload.event_id as string | undefined

  function report(status: number, reason: string) {
    // Unconditional — not gated on NODE_ENV. A silent production failure here
    // is exactly the bug this wrapper exists to prevent.
    console.error('[Lead] relay failed', { status, reason, event_id })
    ;(window as any).dataLayer?.push({
      event: 'lead_relay_failed',
      status,
      reason,
      event_id,
    })
  }

  try {
    const res = await fetch('/api/lead-relay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      let reason = res.statusText || 'request failed'
      try {
        const body = await res.json()
        reason = body?.error ?? body?.reason ?? reason
      } catch {
        /* non-JSON body — keep statusText */
      }
      report(res.status, reason)
      return { ok: false, status: res.status, reason }
    }

    let lead_id: string | undefined
    try {
      lead_id = (await res.json())?.lead_id
    } catch {
      /* 200 with no/!JSON body is still a success */
    }
    return { ok: true, lead_id }
  } catch (err) {
    report(0, err instanceof Error ? err.message : 'network error')
    return { ok: false, status: 0, reason: 'network error' }
  }
}
