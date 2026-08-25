// Signed session token for the /control panel.
//
// WHY THIS EXISTS
// The control cookie used to be the literal string "granted". That value is
// guessable, so anyone could forge the session with a single curl header —
// httpOnly only stops browser JS from reading a cookie, it does nothing to
// stop a non-browser client from sending one. This module replaces that with
// an HMAC-signed, expiring token that cannot be forged without the secret.
//
// Uses Web Crypto (not node:crypto) so it runs unchanged in the Edge runtime
// where middleware.ts executes, and in the Node runtime of route handlers.
//
// The Netlify function at netlify/functions/_control-session.js implements the
// SAME token format with node:crypto, because Netlify Functions are served
// outside the Next.js runtime and cannot import this file.
// KEEP THE TWO IN SYNC — same version tag, same message format, same hash.

export const CONTROL_COOKIE = 'control_auth'

/** Session lifetime, matching the previous cookie maxAge. */
export const SESSION_TTL_SECONDS = 60 * 60 * 8

const VERSION = 'v1'

/**
 * Secret used to sign sessions. Prefers a dedicated secret, but falls back to
 * the control password so existing deployments keep working without having to
 * add a new environment variable first.
 */
function getSecret(): string | null {
  return (
    process.env.CONTROL_SESSION_SECRET ||
    process.env.CONTROL_PANEL_PASSWORD ||
    null
  )
}

async function hmacHex(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Length-independent constant-time comparison. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/**
 * Mints a token of the form `v1.<expiryUnixSeconds>.<hmac>`.
 * Returns null when no secret is configured — callers must fail closed.
 */
export async function createSessionToken(
  ttlSeconds: number = SESSION_TTL_SECONDS
): Promise<string | null> {
  const secret = getSecret()
  if (!secret) return null
  const expiry = Math.floor(Date.now() / 1000) + ttlSeconds
  const payload = `${VERSION}.${expiry}`
  return `${payload}.${await hmacHex(payload, secret)}`
}

/**
 * Verifies signature and expiry. Fails closed on a missing secret, a malformed
 * token, a bad signature, or an expired token.
 *
 * Note: legacy `control_auth=granted` cookies fail here by design. Anyone
 * holding one is redirected to /control-login and simply logs in again.
 */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const secret = getSecret()
  if (!secret || !token) return false

  const parts = token.split('.')
  if (parts.length !== 3) return false

  const [version, expiryRaw, signature] = parts
  if (version !== VERSION) return false

  const expiry = Number(expiryRaw)
  if (!Number.isInteger(expiry) || expiry <= Math.floor(Date.now() / 1000)) return false

  const expected = await hmacHex(`${version}.${expiryRaw}`, secret)
  return safeEqual(signature, expected)
}
