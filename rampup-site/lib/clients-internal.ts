// Server-only — never import this from a 'use client' component or public route.
// Provides read/write access to the full clients.json record including internal fields.

import fs from 'fs'
import path from 'path'
import type { ClientRecord, ClientsFile } from './types-internal'

const DATA_PATH = path.join(process.cwd(), 'data', 'clients.json')

export function readClientsFile(): ClientsFile {
  const raw = fs.readFileSync(DATA_PATH, 'utf8')
  return JSON.parse(raw) as ClientsFile
}

export function writeClientsFile(data: ClientsFile): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

export function slugExists(slug: string): boolean {
  const { clients } = readClientsFile()
  return clients.some(c => c.slug === slug)
}

export function appendClient(record: ClientRecord): void {
  const data = readClientsFile()
  data.clients.push(record)
  writeClientsFile(data)
}

export function updateClientBySlug(slug: string, fields: Partial<ClientRecord>): boolean {
  const data = readClientsFile()
  const idx = data.clients.findIndex(c => c.slug === slug)
  if (idx === -1) return false
  data.clients[idx] = { ...data.clients[idx], ...fields }
  writeClientsFile(data)
  return true
}

export function removeClientBySlug(slug: string): boolean {
  const data = readClientsFile()
  const before = data.clients.length
  data.clients = data.clients.filter(c => c.slug !== slug)
  if (data.clients.length === before) return false
  writeClientsFile(data)
  return true
}
