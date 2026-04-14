import clientsData from '@/data/clients.json'
import type { Client } from './types'

export function getAllClients(): Client[] {
  return clientsData.clients as Client[]
}

export function getClientBySlug(slug: string): Client | undefined {
  return getAllClients().find((c) => c.slug === slug)
}

export function getAllSlugs(): string[] {
  return getAllClients().map((c) => c.slug)
}
