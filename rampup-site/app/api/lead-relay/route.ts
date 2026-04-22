import { NextRequest, NextResponse } from 'next/server'

// ── Rate limiting ─────────────────────────────────────────────────────────────
// In-memory per-instance store. On serverless this resets per cold start,
// which is acceptable — it stops burst abuse within a single instance lifetime.

const WINDOW_MS = 60_000  // 1 minute
const MAX_PER_WINDOW = 5

const ipTimestamps = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const prev = (ipTimestamps.get(ip) ?? []).filter(t => now - t < WINDOW_MS)
  if (prev.length >= MAX_PER_WINDOW) return false
  ipTimestamps.set(ip, [...prev, now])
  return true
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

// ── Turnstile verification ────────────────────────────────────────────────────

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true  // skip if not configured (dev/local)
  if (!token) return false

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }).toString(),
  })
  const data = await res.json() as { success: boolean }
  return data.success === true
}

// ── Route handlers ────────────────────────────────────────────────────────────

export async function GET() {
  return new NextResponse(null, { status: 405 })
}

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL
  const token = process.env.N8N_INTERNAL_WEBHOOK_TOKEN
  if (!webhookUrl || !token) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  // Rate limit
  const ip = getIp(req)
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { name, email, phone, turnstile_token, ...rest } = body

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Turnstile verification
    const captchaOk = await verifyTurnstile(turnstile_token ?? '')
    if (!captchaOk) {
      return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 403 })
    }

    // Collect server-side signals for Meta CAPI match quality
    const clientIp = ip !== 'unknown' ? ip : undefined
    const userAgent = req.headers.get('user-agent') ?? undefined

    // Forward to n8n — strip turnstile_token, add server-side signals
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Token': token,
      },
      body: JSON.stringify({
        name, email, phone, ...rest,
        ...(clientIp  ? { client_ip_address: clientIp } : {}),
        ...(userAgent ? { client_user_agent: userAgent } : {}),
      }),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
