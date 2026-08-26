'use client'

import { useState, useEffect } from 'react'
// useState is used by OnboardSection, PublishSection; useEffect by OnboardSection
import {
  dedupeKey,
  isValidEmail,
  normalizeEmail,
  splitEmailInput,
} from '@/lib/emails'

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * The ONLY client shape that crosses into the browser bundle.
 *
 * app/control/page.tsx is a Server Component that reads data/clients.json and
 * maps each record down to these fields before passing them in. Importing the
 * raw JSON here instead would inline all 31 records — including
 * drive_folder_id, brand_assets_folder_id and website_folder_id — into the
 * public /_next/static chunk for this route, which is downloadable without
 * authenticating into /control.
 *
 * Do not add internal fields here, and do not import data/clients.json from
 * this file.
 */
export interface ControlClient {
  name: string
  slug: string
  cuisine: string
  location: string
  /**
   * Never populated: no record in clients.json has a `shoots` key, so this is
   * always undefined and StatusSection renders "0 shoots". Kept so that
   * component continues to compile and behave exactly as it does today.
   */
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

type Status =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; msg: string }
  | { type: 'warning'; msg: string; details: string[] }
  | { type: 'error'; msg: string }

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
  if (status.type === 'warning') {
    // Partial success: the client WAS created. Amber, not red — and the failed
    // addresses are listed so they can be fixed by hand.
    return (
      <div className="font-poppins text-sm text-amber-700">
        <p className="font-medium">⚠ {status.msg}</p>
        <ul className="mt-1 space-y-0.5 text-[12px] text-amber-800/80">
          {status.details.map((d) => (
            <li key={d} className="break-all">• {d}</li>
          ))}
        </ul>
      </div>
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

// Divider + heading for a section INSIDE a card. Onboarding is one process, so
// it lives in one card with internal steps rather than several sibling cards.
function SectionLabel({ step, title, hint }: { step: number; title: string; hint?: string }) {
  return (
    <div className="pt-2 first:pt-0">
      <div className="flex items-baseline gap-2">
        <span className="font-poppins text-[10px] font-bold text-[#3DBE5A] tabular-nums">
          {String(step).padStart(2, '0')}
        </span>
        <h3 className="font-sora font-bold text-[13px] text-[#2D2D2D] tracking-tight">{title}</h3>
      </div>
      {hint && <p className="font-poppins text-[11px] text-[#AAAAAA] mt-0.5">{hint}</p>}
      <div className="h-px bg-black/[0.06] mt-2.5" />
    </div>
  )
}

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

// ─── Email chip input ─────────────────────────────────────────────────────────
// Plain React — no new dependency. Reuses the CuisineTag pill vocabulary so the
// chips match the existing visual language.

function EmailChips({
  values,
  onChange,
  placeholder,
  blockedKeys = [],
  blockedHint = 'Already in the other list',
}: {
  values: string[]
  onChange: (next: string[]) => void
  placeholder: string
  /** dedupeKey()s that must not be accepted (used to keep the two lists disjoint). */
  blockedKeys?: string[]
  blockedHint?: string
}) {
  const [draft, setDraft] = useState('')

  function commit(raw: string) {
    const parts = splitEmailInput(raw)
    if (!parts.length) return
    const existing = new Set(values.map(dedupeKey))
    const blocked = new Set(blockedKeys)
    const next = [...values]
    for (const part of parts) {
      const email = normalizeEmail(part)
      const key = dedupeKey(email)
      if (existing.has(key) || blocked.has(key)) continue
      existing.add(key)
      next.push(email)
    }
    onChange(next)
    setDraft('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      if (draft.trim()) {
        e.preventDefault()
        commit(draft)
      }
      return
    }
    if (e.key === 'Backspace' && !draft && values.length) {
      onChange(values.slice(0, -1))
    }
  }

  const duplicateOfOther = draft.trim() && blockedKeys.includes(dedupeKey(draft))

  return (
    <div>
      <div className="w-full bg-[#F7F7F7] border border-black/[0.08] rounded-xl px-3 py-2.5 focus-within:border-[#3DBE5A] focus-within:ring-2 focus-within:ring-[#3DBE5A]/20 transition">
        <div className="flex flex-wrap gap-1.5">
          {values.map((email) => {
            const ok = isValidEmail(email)
            return (
              <span
                key={email}
                className={`inline-flex items-center gap-1.5 font-poppins text-[11px] font-medium px-2.5 py-1 rounded-full ${
                  ok
                    ? 'bg-[#E8F8ED] text-[#2D8F44]'
                    : 'bg-red-50 text-red-600 ring-1 ring-red-200'
                }`}
              >
                {!ok && <span aria-hidden>⚠</span>}
                <span className="break-all">{email}</span>
                <button
                  type="button"
                  onClick={() => onChange(values.filter((v) => v !== email))}
                  className="opacity-50 hover:opacity-100 transition"
                  aria-label={`Remove ${email}`}
                >
                  ✕
                </button>
              </span>
            )
          })}
          <input
            className="flex-1 min-w-[190px] bg-transparent font-poppins text-sm text-[#2D2D2D] outline-none py-1 placeholder:text-[#AAAAAA]"
            placeholder={values.length ? '' : placeholder}
            value={draft}
            onChange={(e) => {
              // A paste containing separators commits immediately.
              if (/[\s,;]/.test(e.target.value)) commit(e.target.value)
              else setDraft(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => draft.trim() && commit(draft)}
          />
        </div>
      </div>
      {duplicateOfOther && (
        <p className="font-poppins text-[11px] text-red-500 mt-1">{blockedHint}</p>
      )}
    </div>
  )
}

// ─── Section 1: Onboard New Client ────────────────────────────────────────────

function OnboardSection({ defaultTeamEmails }: { defaultTeamEmails: string[] }) {
  const [name, setName]           = useState('')
  const [slug, setSlug]           = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [cuisine, setCuisine]     = useState(CUISINES[0])
  const [location, setLocation]   = useState('Bangkok')
  const [driveFolder, setDriveFolder] = useState('')
  const [teamEmails, setTeamEmails]     = useState<string[]>(defaultTeamEmails)
  const [clientEmails, setClientEmails] = useState<string[]>([])
  const [status, setStatus]       = useState<Status>({ type: 'idle' })

  const invalidEmails = [...teamEmails, ...clientEmails].filter((e) => !isValidEmail(e))
  const teamKeys   = teamEmails.map(dedupeKey)
  const clientKeys = clientEmails.map(dedupeKey)

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
    setTeamEmails(defaultTeamEmails)
    setClientEmails([])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (invalidEmails.length) {
      setStatus({ type: 'error', msg: `Fix ${invalidEmails.length} invalid email address(es) first` })
      return
    }
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
          team_emails: teamEmails,
          client_emails: clientEmails,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Request failed')
      // Onboarding can succeed while individual Drive shares fail. Surface those
      // instead of reporting a clean success.
      const warnings: string[] = Array.isArray(data.warnings) ? data.warnings : []
      if (warnings.length) {
        setStatus({
          type: 'warning',
          msg: 'Client created, but some Drive invitations failed',
          details: warnings,
        })
      } else {
        setStatus({ type: 'success', msg: 'Client created successfully' })
      }
      reset()
    } catch (err) {
      setStatus({ type: 'error', msg: String(err instanceof Error ? err.message : err) })
    }
  }

  return (
    // One form spanning two Cards so Drive Access submits with the existing
    // onboarding fields in a single request. space-y-6 matches the gap the page
    // container previously applied between sections.
    <form onSubmit={handleSubmit}>
      <Card title="Onboard New Client">
        <div className="space-y-4">
        <SectionLabel step={1} title="Client Info" />
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
          <SectionLabel
            step={2}
            title="Drive Access"
            hint="Applied to the Shared Drive created for this client."
          />

          <Field label="Team Access">
            <EmailChips
              values={teamEmails}
              onChange={setTeamEmails}
              placeholder="add a RampUp address…"
              blockedKeys={clientKeys}
              blockedHint="Already in Client Access"
            />
            <p className="font-poppins text-[11px] text-[#AAAAAA]">
              {teamEmails.length} member{teamEmails.length === 1 ? '' : 's'} · fileOrganizer · no email sent
            </p>
          </Field>

          <Field label="Client Access">
            <EmailChips
              values={clientEmails}
              onChange={setClientEmails}
              placeholder="client@restaurant.com"
              blockedKeys={teamKeys}
              blockedHint="Already in Team Access"
            />
            <p className="font-poppins text-[11px] text-[#AAAAAA]">
              {clientEmails.length
                ? `${clientEmails.length} recipient${clientEmails.length === 1 ? '' : 's'} · writer · invitation email sent`
                : 'Optional · writer · invitation email sent'}
            </p>
          </Field>

          {invalidEmails.length > 0 && (
            <p className="font-poppins text-[12px] text-red-500">
              {invalidEmails.length} invalid address{invalidEmails.length === 1 ? '' : 'es'} — remove or correct before submitting.
            </p>
          )}

          <div className="flex items-center justify-between pt-1 gap-4">
            <StatusBadge status={status} />
            <button
              type="submit"
              disabled={status.type === 'loading' || invalidEmails.length > 0}
              className="ml-auto shrink-0 bg-[#3DBE5A] text-white font-poppins font-semibold text-sm px-6 py-2.5 rounded-full hover:brightness-105 transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status.type === 'loading' ? 'Creating…' : 'Create Client'}
            </button>
          </div>
        </div>
      </Card>
    </form>
  )
}

// ─── Section 2: Publish Client Content ───────────────────────────────────────

function PublishSection({ clients }: { clients: ControlClient[] }) {
  const [clientSlug, setClientSlug] = useState(clients[0]?.slug ?? '')
  const [status, setStatus] = useState<Status>({ type: 'idle' })

  const selectedClient = clients.find(c => c.slug === clientSlug)

  function reset() {
    setClientSlug(clients[0]?.slug ?? '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedClient) {
      setStatus({ type: 'error', msg: 'No client selected' })
      return
    }
    setStatus({ type: 'loading' })
    try {
      const res = await fetch('/.netlify/functions/publish', {
        method: 'POST',
        // Explicit: the function authenticates via the control_auth cookie.
        // This is the fetch default, but stating it prevents a future refactor
        // from silently dropping the session and 401-ing every publish.
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish_content',
          client_slug: clientSlug,
          client_name: selectedClient.name,
          source: 'control_panel',
          requested_at: new Date().toISOString(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Request failed')
      if (!data.success) throw new Error(data.message ?? 'Publish workflow did not confirm success')
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
// Defined but not rendered, exactly as before this file was split out.

function StatusSection({ clients }: { clients: ControlClient[] }) {
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

// ─── Interactive sections ─────────────────────────────────────────────────────

export default function ControlPanelClient({
  clients,
  defaultTeamEmails,
}: {
  clients: ControlClient[]
  defaultTeamEmails: string[]
}) {
  return (
    <>
      <OnboardSection defaultTeamEmails={defaultTeamEmails} />
      <PublishSection clients={clients} />
    </>
  )
}
