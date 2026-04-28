'use client'

import { useState, useEffect } from 'react'
// useState is used by OnboardSection, PublishSection; useEffect by OnboardSection
import clientsData from '@/data/clients.json'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClientEntry {
  name: string
  slug: string
  cuisine: string
  location: string
  shoots?: { date: string }[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CUISINES = [
  'japanese', 'italian', 'korean', 'western',
  'nightlife', 'cafe', 'thai', 'chinese',
]

const CUISINE_COLORS: Record<string, string> = {
  japanese:  'bg-[#E8F8ED] text-[#3DBE5A]',
  italian:   'bg-orange-50 text-orange-600',
  korean:    'bg-purple-50 text-purple-600',
  western:   'bg-blue-50 text-blue-600',
  nightlife: 'bg-indigo-50 text-indigo-600',
  cafe:      'bg-amber-50 text-amber-700',
  thai:      'bg-yellow-50 text-yellow-700',
  chinese:   'bg-rose-50 text-rose-600',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function CuisineTag({ cuisine }: { cuisine: string }) {
  const cls = CUISINE_COLORS[cuisine.toLowerCase()] ?? 'bg-[#E0E0E0] text-[#3D3D3D]'
  return (
    <span className={`inline-block font-poppins text-[10px] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded-full ${cls}`}>
      {cuisine}
    </span>
  )
}

type Status = { type: 'idle' } | { type: 'loading' } | { type: 'success'; msg: string } | { type: 'error'; msg: string }

function StatusBadge({ status }: { status: Status }) {
  if (status.type === 'idle') return null
  if (status.type === 'loading') {
    return (
      <div className="flex items-center gap-2 text-[#888888] font-poppins text-sm">
        <svg className="animate-spin w-4 h-4 text-[#3DBE5A]" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        Working…
      </div>
    )
  }
  if (status.type === 'success') {
    return (
      <p className="font-poppins text-sm text-[#3DBE5A] font-medium">✓ {status.msg}</p>
    )
  }
  return (
    <p className="font-poppins text-sm text-red-500">✕ {status.msg}</p>
  )
}

// ─── Section card wrapper ──────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm px-6 py-6 space-y-5">
      <h2 className="font-sora font-bold text-[17px] text-[#2D2D2D] tracking-tight">{title}</h2>
      {children}
    </div>
  )
}

// ─── Input / Select primitives ─────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-poppins text-[12px] font-semibold text-[#888888] uppercase tracking-[1px]">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full font-poppins text-sm text-[#2D2D2D] bg-[#F7F7F7] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:border-[#3DBE5A] focus:ring-2 focus:ring-[#3DBE5A]/20 transition placeholder:text-[#AAAAAA]'

// ─── Section 1: Onboard New Client ────────────────────────────────────────────

function OnboardSection() {
  const [name, setName]           = useState('')
  const [slug, setSlug]           = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [cuisine, setCuisine]     = useState(CUISINES[0])
  const [location, setLocation]   = useState('Bangkok')
  const [driveFolder, setDriveFolder] = useState('')
  const [status, setStatus]       = useState<Status>({ type: 'idle' })

  // Auto-generate slug from name unless user has manually edited it
  useEffect(() => {
    if (!slugEdited) setSlug(slugify(name))
  }, [name, slugEdited])

  function handleSlugChange(v: string) {
    setSlugEdited(true)
    setSlug(v)
  }

  function reset() {
    setName('')
    setSlug('')
    setSlugEdited(false)
    setCuisine(CUISINES[0])
    setLocation('Bangkok')
    setDriveFolder('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus({ type: 'loading' })
    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: name,
          slug,
          cuisine,
          location,
          drive_folder: driveFolder,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Request failed')
      setStatus({ type: 'success', msg: 'Client created successfully' })
      reset()
    } catch (err) {
      setStatus({ type: 'error', msg: String(err instanceof Error ? err.message : err) })
    }
  }

  return (
    <Card title="Onboard New Client">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Client Name">
            <input
              className={inputCls}
              placeholder="e.g. Okasan Bangkok"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </Field>

          <Field label="Slug">
            <input
              className={inputCls}
              placeholder="okasan-bangkok"
              value={slug}
              onChange={e => handleSlugChange(e.target.value)}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Cuisine">
            <select
              className={inputCls}
              value={cuisine}
              onChange={e => setCuisine(e.target.value)}
            >
              {CUISINES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </Field>

          <Field label="Location">
            <input
              className={inputCls}
              placeholder="Bangkok"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
            />
          </Field>
        </div>

        <Field label="Google Drive Folder Name">
          <input
            className={inputCls}
            placeholder="e.g. Okasan or BACIO"
            value={driveFolder}
            onChange={e => setDriveFolder(e.target.value)}
            required
          />
        </Field>

        <div className="flex items-center justify-between pt-1 gap-4">
          <StatusBadge status={status} />
          <button
            type="submit"
            disabled={status.type === 'loading'}
            className="ml-auto shrink-0 bg-[#3DBE5A] text-white font-poppins font-semibold text-sm px-6 py-2.5 rounded-full hover:brightness-105 transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Client
          </button>
        </div>
      </form>
    </Card>
  )
}

// ─── Section 2: Publish Client Content ───────────────────────────────────────

function PublishSection() {
  const clients = clientsData.clients as ClientEntry[]
  const [clientSlug, setClientSlug] = useState(clients[0]?.slug ?? '')
  const [status, setStatus] = useState<Status>({ type: 'idle' })

  const selectedClient = clients.find(c => c.slug === clientSlug)

  function reset() {
    setClientSlug(clients[0]?.slug ?? '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus({ type: 'loading' })
    try {
      const res = await fetch('/.netlify/functions/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_slug: clientSlug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Request failed')
      setStatus({ type: 'success', msg: 'Publishing started — check Telegram for updates' })
      reset()
    } catch (err) {
      setStatus({ type: 'error', msg: String(err instanceof Error ? err.message : err) })
    }
  }

  return (
    <Card title="Publish Client Content">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Client">
          <select
            className={inputCls}
            value={clientSlug}
            onChange={e => setClientSlug(e.target.value)}
          >
            {clients.map(c => (
              <option key={c.slug} value={c.slug}>
                {c.name} — {c.cuisine}
              </option>
            ))}
          </select>
          {selectedClient && (
            <div className="mt-1.5 flex items-center gap-2">
              <CuisineTag cuisine={selectedClient.cuisine} />
              <span className="font-poppins text-[11px] text-[#AAAAAA]">{selectedClient.location}</span>
            </div>
          )}
        </Field>

        <div className="flex items-center justify-between pt-1 gap-4">
          <StatusBadge status={status} />
          <button
            type="submit"
            disabled={status.type === 'loading'}
            className="ml-auto shrink-0 bg-[#3DBE5A] text-white font-poppins font-semibold text-sm px-6 py-2.5 rounded-full hover:brightness-105 transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publish Content
          </button>
        </div>
      </form>
    </Card>
  )
}

// ─── Section 3: Client Status ─────────────────────────────────────────────────

function StatusSection() {
  const clients = clientsData.clients as ClientEntry[]

  return (
    <Card title="Client Status">
      <div className="divide-y divide-black/[0.05]">
        {clients.map(c => (
          <div key={c.slug} className="flex items-center justify-between py-3 gap-3">
            <div className="min-w-0">
              <p className="font-poppins text-sm font-semibold text-[#2D2D2D] truncate">{c.name}</p>
              <p className="font-poppins text-[11px] text-[#AAAAAA]">
                {c.shoots?.length ?? 0} shoot{(c.shoots?.length ?? 0) !== 1 ? 's' : ''}
              </p>
            </div>
            <CuisineTag cuisine={c.cuisine} />
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ControlPage() {
  return (
    <div className="min-h-[100dvh] bg-[#EDEDED]">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-5 pt-10 pb-6 flex items-start justify-between">
        <div>
          <p className="font-poppins text-[11px] font-bold text-[#3DBE5A] uppercase tracking-[2px] mb-1">
            RampUp
          </p>
          <h1 className="font-sora font-extrabold text-3xl text-[#2D2D2D] tracking-tight">
            Control Panel
          </h1>
          <p className="font-poppins text-sm text-[#888888] mt-1">Agency use only.</p>
        </div>
        <form method="POST" action="/api/control-logout">
          <button
            type="submit"
            className="font-poppins text-xs text-[#888888] hover:text-[#2D2D2D] transition mt-2"
          >
            Sign out
          </button>
        </form>
      </div>

      {/* Sections */}
      <div className="max-w-2xl mx-auto px-5 pb-20 space-y-6">
        <OnboardSection />
        <PublishSection />
      </div>
    </div>
  )
}
