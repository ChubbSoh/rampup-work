import { NextRequest, NextResponse } from 'next/server'

const N8N_ONBOARD_URL = 'https://rampupth.app.n8n.cloud/webhook/onboard'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { client_name, slug, cuisine, location, drive_folder } = body
    if (!client_name || !slug || !cuisine || !location || !drive_folder) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const upstream = await fetch(N8N_ONBOARD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_name, slug, cuisine, location, drive_folder }),
    })

    const text = await upstream.text()
    let data: unknown
    try { data = JSON.parse(text) } catch { data = { message: text } }

    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Upstream error', detail: data },
        { status: upstream.status }
      )
    }

    return NextResponse.json({ ok: true, detail: data })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal error', detail: String(err) },
      { status: 500 }
    )
  }
}
