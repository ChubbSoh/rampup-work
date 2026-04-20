import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.N8N_ONBOARD_WEBHOOK_URL
  const token = process.env.N8N_INTERNAL_WEBHOOK_TOKEN
  if (!webhookUrl || !token) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  try {
    const body = await req.json()

    const { client_name, slug, cuisine, location, drive_folder } = body
    if (!client_name || !slug || !cuisine || !location || !drive_folder) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Token': token,
      },
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
