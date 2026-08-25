// Node/CommonJS twin of lib/control-session.ts.
//
// Netlify Functions are served by Netlify's own runtime at /.netlify/functions/*,
// completely outside the Next.js request pipeline. That means middleware.ts never
// runs for them and they cannot import from the Next module graph, so this file
// re-implements the identical token format with node:crypto.
//
// KEEP IN SYNC WITH lib/control-session.ts — same VERSION, same message format
// (`v1.<expiry>`), same SHA-256 HMAC, same secret resolution order.

const crypto = require('crypto')

const CONTROL_COOKIE = 'control_auth'
const VERSION = 'v1'

function getSecret() {
  return (
    process.env.CONTROL_SESSION_SECRET ||
    process.env.CONTROL_PANEL_PASSWORD ||
    null
  )
}

function hmacHex(message, secret) {
  return crypto.createHmac('sha256', secret).update(message).digest('hex')
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a), 'utf8')
  const bufB = Buffer.from(String(b), 'utf8')
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

/** Reads one cookie out of a raw Cookie header. */
function readCookie(cookieHeader, name) {
  if (!cookieHeader) return undefined
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    if (part.slice(0, idx).trim() === name) {
      return decodeURIComponent(part.slice(idx + 1).trim())
    }
  }
  return undefined
}

/** Mirror of verifySessionToken() in lib/control-session.ts. Fails closed. */
function verifySessionToken(token) {
  const secret = getSecret()
  if (!secret || !token) return false

  const parts = String(token).split('.')
  if (parts.length !== 3) return false

  const [version, expiryRaw, signature] = parts
  if (version !== VERSION) return false

  const expiry = Number(expiryRaw)
  if (!Number.isInteger(expiry) || expiry <= Math.floor(Date.now() / 1000)) return false

  return safeEqual(signature, hmacHex(`${version}.${expiryRaw}`, secret))
}

/**
 * Authenticates an inbound Netlify Function request.
 *
 * Two accepted paths:
 *  1. A signed control-panel session cookie (how the browser calls it today).
 *  2. X-Internal-Token matching N8N_INTERNAL_WEBHOOK_TOKEN — the same shared
 *     secret already used for outbound calls to n8n. This gives server-to-server
 *     callers a supported way in without a browser session. Nothing uses it
 *     today; it exists so automation never needs the auth removed again.
 *
 * Returns { ok: true } or { ok: false, statusCode, message }.
 */
function authenticate(event) {
  const headers = event.headers || {}

  const internalToken = headers['x-internal-token'] || headers['X-Internal-Token']
  const expectedInternal = process.env.N8N_INTERNAL_WEBHOOK_TOKEN
  if (internalToken && expectedInternal && safeEqual(internalToken, expectedInternal)) {
    return { ok: true, via: 'internal_token' }
  }

  const cookieHeader = headers.cookie || headers.Cookie
  if (verifySessionToken(readCookie(cookieHeader, CONTROL_COOKIE))) {
    return { ok: true, via: 'control_session' }
  }

  if (!getSecret() && !expectedInternal) {
    return {
      ok: false,
      statusCode: 500,
      message: 'Server misconfiguration: no CONTROL_SESSION_SECRET / CONTROL_PANEL_PASSWORD / N8N_INTERNAL_WEBHOOK_TOKEN configured',
    }
  }

  return { ok: false, statusCode: 401, message: 'Unauthorized' }
}

module.exports = { authenticate, verifySessionToken, readCookie, CONTROL_COOKIE }
