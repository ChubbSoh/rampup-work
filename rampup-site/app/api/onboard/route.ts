import { NextRequest, NextResponse } from 'next/server'
import { slugExists, appendClient } from '@/lib/clients-internal'
import type { ClientRecord } from '@/lib/types-internal'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      client_name,
      slug,
      cuisine,
      location,
      description,
      cover,
      photos,
      videos,
      drive_folder_id,
      website_folder_id,
      brand_assets_folder_id,
      active,
    } = body

    // ── Required field validation ──────────────────────────────────────────
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

    // ── Duplicate slug check ───────────────────────────────────────────────
    if (slugExists(slug)) {
      return NextResponse.json({ error: `Slug "${slug}" already exists` }, { status: 409 })
    }

    // ── Build client record ────────────────────────────────────────────────
    const record: ClientRecord = {
      name:                   client_name.trim(),
      slug,
      cuisine:                cuisine.toLowerCase().trim(),
      location:               location.trim(),
      description:            typeof description === 'string' ? description.trim() : '',
      months:                 0,
      active:                 active === true,
      last_updated:           new Date().toISOString().slice(0, 10),
      cover:                  typeof cover === 'string' ? cover.trim() : '',
      page:                   `${slug}.html`,
      videos:                 Array.isArray(videos) ? videos : [],
      photos:                 Array.isArray(photos) ? photos : [],
      drive_folder_id:        typeof drive_folder_id === 'string' ? drive_folder_id.trim() : undefined,
      website_folder_id:      typeof website_folder_id === 'string' ? website_folder_id.trim() : undefined,
      brand_assets_folder_id: typeof brand_assets_folder_id === 'string' ? brand_assets_folder_id.trim() : undefined,
    }

    // ── Persist to clients.json ────────────────────────────────────────────
    appendClient(record)

    // ── Optionally notify n8n (non-blocking, fail-safe) ───────────────────
    const webhookUrl = process.env.N8N_ONBOARD_WEBHOOK_URL
    const token = process.env.N8N_INTERNAL_WEBHOOK_TOKEN
    if (webhookUrl && token) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Token': token,
        },
        body: JSON.stringify({
          client_name: record.name,
          slug: record.slug,
          cuisine: record.cuisine,
          location: record.location,
          drive_folder_id: record.drive_folder_id,
          website_folder_id: record.website_folder_id,
          brand_assets_folder_id: record.brand_assets_folder_id,
        }),
      }).catch(() => { /* n8n failure does not block client creation */ })
    }

    return NextResponse.json({ ok: true, slug: record.slug })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal error', detail: String(err) },
      { status: 500 }
    )
  }
}
