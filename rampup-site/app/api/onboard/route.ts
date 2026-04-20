import { NextRequest, NextResponse } from 'next/server'
import { slugExists, appendClient, updateClientBySlug, removeClientBySlug } from '@/lib/clients-internal'
import type { ClientRecord } from '@/lib/types-internal'

interface DriveResult {
  drive_folder_id: string
  website_folder_id: string
  brand_assets_folder_id: string
  drive_url?: string
}

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.N8N_ONBOARD_WEBHOOK_URL
  const token = process.env.N8N_INTERNAL_WEBHOOK_TOKEN
  if (!webhookUrl || !token) {
    return NextResponse.json({ error: 'Server misconfiguration: N8N_ONBOARD_WEBHOOK_URL or N8N_INTERNAL_WEBHOOK_TOKEN not set' }, { status: 500 })
  }

  try {
    const body = await req.json()

    const { client_name, slug, cuisine, location, description, cover, photos, videos, active } = body

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

    // ── Build and persist initial client record (no folder IDs yet) ───────
    const record: ClientRecord = {
      name:        client_name.trim(),
      slug,
      cuisine:     cuisine.toLowerCase().trim(),
      location:    location.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      months:      0,
      active:      active === true,
      last_updated: new Date().toISOString().slice(0, 10),
      cover:       typeof cover === 'string' ? cover.trim() : '',
      page:        `${slug}.html`,
      videos:      Array.isArray(videos) ? videos : [],
      photos:      Array.isArray(photos) ? photos : [],
    }

    appendClient(record)

    // ── Call n8n to create Drive folders (required, blocking) ─────────────
    let driveResult: DriveResult
    try {
      const upstream = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Token': token,
        },
        body: JSON.stringify({
          client_name: record.name,
          slug: record.slug,
        }),
      })

      if (!upstream.ok) {
        throw new Error(`n8n responded with ${upstream.status}`)
      }

      const result = await upstream.json() as Partial<DriveResult>

      if (!result.drive_folder_id || !result.website_folder_id || !result.brand_assets_folder_id) {
        throw new Error('n8n response missing required folder IDs')
      }

      driveResult = result as DriveResult
    } catch (n8nErr) {
      // Rollback — remove the partial client record so no broken entries remain
      removeClientBySlug(slug)
      return NextResponse.json(
        { error: 'Drive folder creation failed — client was not saved', detail: String(n8nErr) },
        { status: 502 }
      )
    }

    // ── Update client record with folder IDs returned from n8n ────────────
    updateClientBySlug(slug, {
      drive_folder_id:        driveResult.drive_folder_id,
      website_folder_id:      driveResult.website_folder_id,
      brand_assets_folder_id: driveResult.brand_assets_folder_id,
    })

    return NextResponse.json({
      ok: true,
      slug: record.slug,
      drive_folder_id:        driveResult.drive_folder_id,
      website_folder_id:      driveResult.website_folder_id,
      brand_assets_folder_id: driveResult.brand_assets_folder_id,
      drive_url:              driveResult.drive_url ?? null,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal error', detail: String(err) },
      { status: 500 }
    )
  }
}
