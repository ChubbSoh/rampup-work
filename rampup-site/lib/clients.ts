import clientsData from '@/data/clients.json'
import type { Client } from './types'

// Allowlist of every field on the public Client type.
//
// This used to be a denylist that stripped only drive_folder and
// website_folder_id, which silently leaked drive_folder_id,
// brand_assets_folder_id and active into the browser once the onboarding
// pipeline started writing them. An allowlist cannot drift that way: any
// field the n8n pipeline adds to clients.json in future is excluded by
// default rather than exposed by default.
//
// Typed as Record<keyof Required<Client>, true>, so adding a field to the
// Client interface without listing it here is a compile error.
const PUBLIC_FIELDS: Record<keyof Required<Client>, true> = {
  name: true,
  slug: true,
  cuisine: true,
  location: true,
  description: true,
  months: true,
  cover: true,
  page: true,
  last_updated: true,
  videos: true,
  photos: true,
  feed_design: true,
  monthly_plan: true,
}

const PUBLIC_KEYS = Object.keys(PUBLIC_FIELDS) as Array<keyof Client>

// Server-only fields (drive_folder, drive_folder_id, website_folder_id,
// brand_assets_folder_id, active) are dropped here. netlify/functions/publish.js
// reads data/clients.json directly rather than going through this module, so it
// still sees website_folder_id — the publish flow is unaffected.
function sanitize(record: Record<string, unknown>): Client {
  const out: Record<string, unknown> = {}
  for (const key of PUBLIC_KEYS) {
    if (record[key] !== undefined) out[key] = record[key]
  }
  return out as unknown as Client
}

function hasMedia(c: Record<string, unknown>): boolean {
  const photos = c.photos
  const videos = c.videos
  return (Array.isArray(photos) && photos.length > 0) ||
         (Array.isArray(videos) && videos.length > 0)
}

export function getAllClients(): Client[] {
  return (clientsData.clients as Record<string, unknown>[])
    .filter(hasMedia)
    .map(sanitize)
}

export function getClientBySlug(slug: string): Client | undefined {
  return getAllClients().find((c) => c.slug === slug)
}

export function getAllSlugs(): string[] {
  return getAllClients().map((c) => c.slug)
}
