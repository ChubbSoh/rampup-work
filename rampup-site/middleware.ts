import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { CONTROL_COOKIE, verifySessionToken } from '@/lib/control-session'

const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  // CSP omitted — GTM and inline scripts require careful audit before adding
}

function withSecurityHeaders(res: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    res.headers.set(key, value)
  })
  return res
}

// Verifies an HMAC-signed session token. Previously this compared the cookie to
// the literal string 'granted', which any client could send by hand.
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  return verifySessionToken(request.cookies.get(CONTROL_COOKIE)?.value)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── /control: require auth cookie ────────────────────────────────────────
  if (pathname === '/control') {
    if (!(await isAuthenticated(request))) {
      return NextResponse.redirect(new URL('/control-login', request.url))
    }
    return withSecurityHeaders(NextResponse.next())
  }

  // ── /control-login: redirect to /control if already authed ───────────────
  if (pathname === '/control-login') {
    if (await isAuthenticated(request)) {
      return NextResponse.redirect(new URL('/control', request.url))
    }
    return withSecurityHeaders(NextResponse.next())
  }

  // ── /api/onboard: require auth cookie (control panel only) ───────────────
  if (pathname === '/api/onboard') {
    if (request.method !== 'POST') {
      return new NextResponse(null, { status: 405 })
    }
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return withSecurityHeaders(NextResponse.next())
  }

  // ── /api/lead-relay: method guard only (browser-callable by design) ───────
  if (pathname === '/api/lead-relay') {
    if (request.method !== 'POST') {
      return new NextResponse(null, { status: 405 })
    }
    // No CORS wildcard — same-origin browser requests only
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return withSecurityHeaders(NextResponse.next())
  }

  return withSecurityHeaders(NextResponse.next())
}

// NOTE: this matcher only covers Next.js routes. Netlify Functions are served
// at /.netlify/functions/* by Netlify's own runtime and NEVER pass through this
// middleware — they must authenticate themselves. See
// netlify/functions/_control-session.js.
export const config = {
  matcher: [
    '/control',
    '/control-login',
    '/api/onboard',
    '/api/lead-relay',
  ],
}
