import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.N8N_ONBOARD_WEBHOOK_URL
  const token = process.env.N8N_INTERNAL_WEBHOOK_TOKEN
  if (!webhookUrl || !token) {
    return NextResponse.json(
      { error: 'Server misconfiguration: N8N_ONBOARD_WEBHOOK_URL or N8N_INTERNAL_WEBHOOK_TOKEN not set' },
      { status: 500 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { client_name, slug, cuisine, location, description, cover, photos, videos, active } = body as Record<string, unknown>

  // Required field validation
  if (!client_name || typeof client_name !== 'string') {
    return NextResponse.json({ error: 'client_name is required' }, { status: 400 })
  }
  if (!slug || typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'slug is required and must be lowercase alphanumeric with hyphens' }, { status: 400 })
  }
  if (!cuisine || typeof cuisine !== 'string') {
    return NextResponse.json({ error: 'cuisine is required' }, { status: 400 })
  }
  if (!location || typeof location !== 'string') {
    return NextResponse.json({ error: 'location is required' }, { status: 400 })
  }

  // Build full payload for n8n — n8n owns all persistence (Drive + Sheets + GitHub)
  const payload = {
    client_name:  (client_name as string).trim(),
    slug,
    cuisine:      (cuisine as string).toLowerCase().trim(),
    location:     (location as string).trim(),
    description:  typeof description === 'string' ? description.trim() : '',
    cover:        typeof cover === 'string' ? cover.trim() : '',
    photos:       Array.isArray(photos) ? photos : [],
    videos:       Array.isArray(videos) ? videos : [],
    active:       active === true,
    months:       0,
    last_updated: new Date().toISOString().slice(0, 10),
    page:         `${slug}.html`,
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Token': token,
      },
      body: JSON.stringify(payload),
    })

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '')
      return NextResponse.json(
        { error: `Onboarding pipeline failed (n8n ${upstream.status})`, detail },
        { status: 502 }
      )
    }

    const result = await upstream.json() as Record<string, unknown>
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to reach onboarding pipeline', detail: String(err) },
      { status: 502 }
    )
  }
}
