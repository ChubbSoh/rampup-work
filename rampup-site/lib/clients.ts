import clientsData from '@/data/clients.json'
import type { Client } from './types'

// Strip server-only fields before any client data reaches the browser.
// drive_folder and website_folder_id are only needed by server-side functions (netlify/functions/publish.js).
function sanitize({ drive_folder: _, website_folder_id: __, ...rest }: Record<string, unknown>): Client {
  return rest as Client
}

export function getAllClients(): Client[] {
  return (clientsData.clients as Record<string, unknown>[]).map(sanitize)
}

export function getClientBySlug(slug: string): Client | undefined {
  return getAllClients().find((c) => c.slug === slug)
}

export function getAllSlugs(): string[] {
  return getAllClients().map((c) => c.slug)
}
