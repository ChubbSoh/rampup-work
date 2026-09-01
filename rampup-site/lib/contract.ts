// Contract details collected by step 03 of the /control onboarding card.
//
// Contains no secrets and is safe to import from a client component — the same
// arrangement as lib/emails.ts. The server re-runs every check in
// app/api/onboard/route.ts: browser validation is a convenience, never the gate.
//
// This module deliberately holds NO contract wording. The website submits
// structured selections; the legal text lives in the Google Docs template that
// n8n copies and fills.

import { isValidEmail, normalizeEmail } from './emails'
import { restaurantRampUp, addOns } from './pricing'

export const CONTRACT_DURATIONS = [3, 6, 12] as const
export type ContractDuration = (typeof CONTRACT_DURATIONS)[number]

export const DEFAULT_DURATION_MONTHS: ContractDuration = 6

export function isContractDuration(v: unknown): v is ContractDuration {
  return (CONTRACT_DURATIONS as readonly number[]).includes(v as number)
}

/** Service keys as they are stored and sent to n8n. */
export interface ContractServices {
  /** Always true — the base package. Not removable in the UI. */
  social_media_marketing: true
  grab: boolean
  line_oa: boolean
  lineman: boolean
}

export interface ContractDetails {
  client_name: string
  company_name: string
  company_address: string
  tax_id: string
  /**
   * Optional. Becomes `contactEmail` on the client's FlowAccount record, so
   * invoices reach the accountant rather than the restaurant's front desk.
   */
  accountant_email: string | null
  /** Optional; null when not supplied. Kept a string — leading zeros matter. */
  branch: string | null
  /** YYYY-MM-DD */
  start_date: string
  duration_months: ContractDuration
  /** YYYY-MM-DD, always derived from start_date + duration_months. */
  end_date: string
  services: ContractServices
  /** THB per month, derived from `services`. See monthlyPrice(). */
  monthly_price: number
}

/**
 * Monthly billing amount for the selected services, in THB.
 *
 * Grab is deliberately EXCLUDED. The contract states that no Grab management
 * fee is charged until the client passes the agreed performance threshold, so
 * billing it from month one would contradict the agreement the client signs.
 * When a client crosses that threshold, add ฿9,990 (`addOns.grab.price`) to
 * their sheet row by hand.
 */
export function monthlyPrice(services: ContractServices): number {
  return (
    restaurantRampUp.price +
    (services.line_oa ? addOns.lineOa.price : 0) +
    (services.lineman ? addOns.lineman.price : 0)
  )
}


// ─── Date maths ───────────────────────────────────────────────────────────────
// All arithmetic is done in UTC. Date.UTC + getUTC* avoids the off-by-one that
// local-timezone parsing of a bare "YYYY-MM-DD" produces east or west of UTC.

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** True only for a well-formed YYYY-MM-DD that names a real calendar day. */
export function isIsoDate(value: string): boolean {
  if (!ISO_DATE_RE.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  const probe = new Date(Date.UTC(y, m - 1, d))
  return (
    probe.getUTCFullYear() === y &&
    probe.getUTCMonth() === m - 1 &&
    probe.getUTCDate() === d
  )
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/**
 * Adds whole months, clamping to the last day of the target month when the
 * source day does not exist there (31 Jan + 1 month is 28/29 Feb, not 3 March).
 */
function addMonths(date: Date, months: number): Date {
  const y = date.getUTCFullYear()
  const m = date.getUTCMonth()
  const d = date.getUTCDate()
  // Day 0 of the following month is the last day of the target month.
  const lastDayOfTarget = new Date(Date.UTC(y, m + months + 1, 0)).getUTCDate()
  return new Date(Date.UTC(y, m + months, Math.min(d, lastDayOfTarget)))
}

/**
 * Inclusive contract end date.
 *
 * The service period runs from start_date through end_date inclusive, so a
 * 6-month contract starting 2026-09-01 ends 2027-02-28 — NOT 2027-03-01.
 * The rule is (start + N months) minus one day, with month-length clamping
 * applied before the subtraction:
 *
 *   2026-09-01 + 6m  -> 2027-03-01 -> 2027-02-28  (short target month)
 *   2028-02-29 + 12m -> 2029-02-28 -> 2029-02-27  (leap-day start, clamped)
 *   2026-01-31 + 6m  -> 2026-07-31 -> 2026-07-30  (end-of-month start)
 *
 * Returns '' for an unusable start date so callers can render an empty state
 * rather than a bogus date.
 */
export function calculateContractEnd(
  startDate: string,
  durationMonths: ContractDuration
): string {
  if (!isIsoDate(startDate)) return ''
  const [y, m, d] = startDate.split('-').map(Number)
  const start = new Date(Date.UTC(y, m - 1, d))
  const end = addMonths(start, durationMonths)
  end.setUTCDate(end.getUTCDate() - 1)
  return toIso(end)
}

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/**
 * The template's branch line is a whole line, not a bare value: it renders as
 * `Branch: 00001`, or collapses to nothing when no branch was supplied — the
 * signature block then closes up with no stray label.
 */
export function formatBranchLine(branch: string | null): string {
  const value = (branch ?? '').trim()
  return value ? `Branch: ${value}` : ''
}

/** '2027-02-28' becomes '28 Feb 2027'. Display only; never the stored value. */
export function formatContractDate(isoDate: string): string {
  if (!isIsoDate(isoDate)) return ''
  const [y, m, d] = isoDate.split('-').map(Number)
  return `${d} ${MONTHS_SHORT[m - 1]} ${y}`
}

// ─── Normalisation ────────────────────────────────────────────────────────────

/**
 * Coerces an untrusted request body fragment into ContractDetails, or reports
 * why it cannot. end_date is always recalculated server-side — a client-sent
 * value is ignored, so a tampered or stale end date can never reach the
 * contract.
 */
export function parseContractDetails(
  input: unknown
): { ok: true; contract: ContractDetails } | { ok: false; error: string } {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, error: 'contract is required' }
  }
  const raw = input as Record<string, unknown>

  const str = (key: string): string =>
    typeof raw[key] === 'string' ? (raw[key] as string).trim() : ''

  const clientName     = str('client_name')
  const companyName    = str('company_name')
  const companyAddress = str('company_address')
  const taxId          = str('tax_id')
  const accountantEmail = str('accountant_email')
  const branch         = str('branch')
  const startDate      = str('start_date')

  const missing = (
    [
      ['company_name', companyName],
      ['company_address', companyAddress],
      ['tax_id', taxId],
      ['start_date', startDate],
    ] as const
  )
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length) {
    return { ok: false, error: `contract: missing required field(s): ${missing.join(', ')}` }
  }
  if (!isIsoDate(startDate)) {
    return { ok: false, error: 'contract.start_date must be a valid YYYY-MM-DD date' }
  }
  // Optional, but a typo here means invoices go nowhere — reject rather than
  // silently file a broken address on the FlowAccount record.
  if (accountantEmail && !isValidEmail(accountantEmail)) {
    return { ok: false, error: `contract.accountant_email is not a valid email: ${accountantEmail}` }
  }

  const duration = raw.duration_months
  if (!isContractDuration(duration)) {
    return {
      ok: false,
      error: `contract.duration_months must be one of ${CONTRACT_DURATIONS.join(', ')}`,
    }
  }

  const rawServices =
    typeof raw.services === 'object' && raw.services !== null
      ? (raw.services as Record<string, unknown>)
      : {}

  const services: ContractServices = {
    // Base package — never optional, never taken from the request body.
    social_media_marketing: true,
    grab:    rawServices.grab === true,
    line_oa: rawServices.line_oa === true,
    lineman: rawServices.lineman === true,
  }

  const contract: ContractDetails = {
    client_name:      clientName,
    company_name:     companyName,
    company_address:  companyAddress,
    tax_id:           taxId,
    accountant_email: accountantEmail ? normalizeEmail(accountantEmail) : null,
    branch:           branch || null,
    start_date:       startDate,
    duration_months:  duration,
    end_date:         calculateContractEnd(startDate, duration),
    services,
    // Derived server-side; a client-sent value is ignored.
    monthly_price:    monthlyPrice(services),
  }

  return { ok: true, contract }
}

/**
 * Flat placeholder-to-value map for the Google Docs template, built here so the
 * mapping lives with the data model rather than inside an n8n expression.
 * agreementDate is the generation date, supplied by the caller.
 *
 * SIMPLE VALUES ONLY. Every entry here is a straight `replaceAllText` in the
 * Docs template. Optional service sections are NOT placeholders — they live
 * fully formatted in the master between {{X_BLOCK_START}} / {{X_BLOCK_END}}
 * markers, and n8n keeps or deletes each block by index based on
 * `contract.services`. Never add clause wording or a block marker to this map:
 * blocks are removed by range deletion, not by text replacement, and putting
 * legal wording here would make the app a second source of truth.
 */
export function contractPlaceholders(
  contract: ContractDetails,
  agreementDate: string
): Record<string, string> {
  return {
    '{{CLIENT_NAME}}':         contract.client_name,
    '{{COMPANY_NAME}}':        contract.company_name,
    '{{COMPANY_ADDRESS}}':     contract.company_address,
    '{{TAX_ID}}':              contract.tax_id,
    '{{BRANCH_LINE}}':         formatBranchLine(contract.branch),
    '{{CONTRACT_START_DATE}}': formatContractDate(contract.start_date),
    '{{CONTRACT_END_DATE}}':   formatContractDate(contract.end_date),
    '{{CONTRACT_MONTHS}}':     String(contract.duration_months),
    '{{AGREEMENT_DATE}}':      formatContractDate(agreementDate),
    // Reserved for future optional-service payment wording. Mapped to '' so the
    // raw token can never survive into a generated contract.
    '{{ADDITIONAL_SERVICE_PAYMENT_TERMS}}': '',
  }
}
