'use client'

import { useState, useRef } from 'react'
import Script from 'next/script'

/**
 * Qualified-consultation form for the Google Ads landing page.
 *
 * FIELD MAPPING — read before adding fields.
 * The live n8n "Website Lead Flow" begins with a `Normalize Fields` Code node
 * that rebuilds the payload from a FIXED whitelist. Anything outside that list
 * is discarded at the first node, before the Google Sheet. The Sheet node then
 * persists a further-reduced set of 13 columns.
 *
 * So the extra qualification answers are sent BOTH ways:
 *   1. on their own whitelisted keys where one exists (restaurant_type, main_goal)
 *   2. folded into `message`, which IS persisted to the Sheet
 * Nothing a visitor answers is silently lost. Giving position / website /
 * locations / budget their own Sheet columns needs an n8n + Sheet change, which
 * is deliberately out of scope here.
 */

const POSITIONS = [
  'F&B Director', 'Restaurant Owner', 'Restaurant Group',
  'Marketing Director / Manager', 'General Manager', 'Other',
]
const TYPES = [
  'Fine Dining', 'Casual Dining', 'Hotel F&B', 'Bar / Rooftop / Lounge',
  'Restaurant Group', 'Cafe / Bakery', 'Other',
]
const LOCATIONS = ['1', '2–3', '4–10', '10+']
const BUDGETS = ['Under ฿50,000', '฿50,000–฿100,000', '฿100,000–฿200,000', '฿200,000+']
const CHALLENGES = [
  'Brand Awareness', 'Reservations / Guest Acquisition', 'Content Quality',
  'Social Media Management', 'Meta Advertising', 'Google Advertising',
  'Restaurant Launch', 'Hotel F&B Growth', 'Not Sure Yet',
]

const FORM_NAME = 'restaurant_marketing_lp'

export default function LeadForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const sent = useRef(false)
  const started = useRef(false)

  function getCookie(name: string): string | undefined {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
    return m ? decodeURIComponent(m[1]) : undefined
  }

  /** Fires once, the first time the visitor interacts with any field. */
  function onFirstInput() {
    if (started.current) return
    started.current = true
    ;(window as any).dataLayer?.push({ event: 'restaurant_lp_form_start' })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sent.current) return
    setLoading(true)
    const data = new FormData(e.currentTarget)
    const g = (k: string) => String(data.get(k) ?? '').trim()

    // Human-readable digest of every qualification answer, so the Sheet's
    // `message` column carries the full picture even before discrete columns exist.
    const message = [
      ['Position', g('position')],
      ['Website / Instagram', g('website_or_social')],
      ['Restaurant type', g('restaurant_type')],
      ['Locations', g('locations')],
      ['Monthly marketing budget', g('budget')],
      ['Main challenge', g('main_goal')],
    ].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')

    // Best-effort Netlify Forms capture (spam filtering + backup record).
    // Deliberately NOT awaited as a gate: the relay below is the source of truth,
    // so an unregistered form can never cost us the lead.
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
    }).catch(() => {})

    sent.current = true
    const event_id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    const fbp = getCookie('_fbp')
    const fbc = getCookie('_fbc')

    try {
      const res = await fetch('/api/lead-relay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: g('name'),
          restaurant: g('restaurant'),
          email: g('email'),
          phone: g('phone'),
          restaurant_type: g('restaurant_type'),
          main_goal: g('main_goal'),
          service: 'Full-service restaurant marketing',
          message,
          page_path: window.location.pathname,
          page_url: window.location.href,
          page_type: 'lp-restaurant-marketing',
          form_name: FORM_NAME,
          submitted_at: new Date().toISOString(),
          source: 'google_ads',
          site: 'rampupth',
          event_id,
          ...(fbp ? { fbp } : {}),
          ...(fbc ? { fbc } : {}),
          turnstile_token: data.get('cf-turnstile-response') ?? '',
        }),
      })
      if (!res.ok) sent.current = false
    } catch {
      sent.current = false
    }

    // Conversion events fire only after the submission attempt completes.
    // Shared event_id keeps the pixel and the server-side CAPI event deduplicated.
    const dl = (window as any).dataLayer
    dl?.push({ event: 'lead_form_submit', event_id })
    dl?.push({ event: 'restaurant_marketing_lead', event_id, form_name: FORM_NAME })
    ;(window as any).fbq?.('track', 'Lead', {}, { eventID: event_id })
    // GOOGLE ADS CONVERSION INTEGRATION POINT
    // No Google Ads conversion ID exists in this project yet. When one is created,
    // either import `restaurant_marketing_lead` from GA4 as a conversion, or add
    // gtag('event','conversion',{send_to:'AW-XXXXXXXXX/XXXXXXXX'}) on this line.

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-12 px-6" role="status" aria-live="polite">
        <div className="w-14 h-14 bg-[#ECECEC] rounded-full flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M6 14l6 6 10-10" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-sora font-bold text-2xl text-dark mb-2">Thank you — we&apos;ve got it.</h3>
        <p className="font-poppins text-[15px] text-muted max-w-sm mx-auto">
          We&apos;ll review your restaurant and come back within one business day with where
          we think your marketing can improve.
        </p>
      </div>
    )
  }

  const input =
    'w-full font-poppins text-[15px] text-dark bg-white border border-black/[0.12] rounded-xl px-4 py-3 outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-black/10 transition placeholder:text-faint'
  const label = 'font-poppins text-[12px] font-semibold text-body mb-1.5 block tracking-[0.2px]'
  const req = <span className="text-[#8A8A8A]" aria-hidden="true">*</span>

  return (
    <form
      name={FORM_NAME}
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      onInput={onFirstInput}
      className="flex flex-col gap-4"
      noValidate={false}
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p hidden>
        <label>
          Leave this empty
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="rm-restaurant">Restaurant / Brand Name {req}</label>
          <input id="rm-restaurant" name="restaurant" type="text" required autoComplete="organization"
            placeholder="Toh Daeng" className={input} />
        </div>
        <div>
          <label className={label} htmlFor="rm-web">Website or Instagram</label>
          <input id="rm-web" name="website_or_social" type="text" autoComplete="url"
            placeholder="@yourrestaurant" className={input} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="rm-name">Your Name {req}</label>
          <input id="rm-name" name="name" type="text" required autoComplete="name"
            placeholder="Full name" className={input} />
        </div>
        <div>
          <label className={label} htmlFor="rm-position">Position {req}</label>
          <select id="rm-position" name="position" required defaultValue="" className={input}>
            <option value="" disabled>Select…</option>
            {POSITIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="rm-phone">Phone {req}</label>
          <input id="rm-phone" name="phone" type="tel" required autoComplete="tel"
            placeholder="08X-XXX-XXXX" className={input} />
        </div>
        <div>
          <label className={label} htmlFor="rm-email">Email {req}</label>
          <input id="rm-email" name="email" type="email" required autoComplete="email"
            placeholder="you@restaurant.com" className={input} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="rm-type">Restaurant Type {req}</label>
          <select id="rm-type" name="restaurant_type" required defaultValue="" className={input}>
            <option value="" disabled>Select…</option>
            {TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="rm-loc">Number of Locations</label>
          <select id="rm-loc" name="locations" defaultValue="" className={input}>
            <option value="" disabled>Select…</option>
            {LOCATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={label} htmlFor="rm-budget">Current Monthly Marketing Budget</label>
        <select id="rm-budget" name="budget" defaultValue="" className={input}>
          <option value="" disabled>Select…</option>
          {BUDGETS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div>
        <label className={label} htmlFor="rm-goal">Main Marketing Challenge</label>
        <select id="rm-goal" name="main_goal" defaultValue="" className={input}>
          <option value="" disabled>Select…</option>
          {CHALLENGES.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <>
          <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-theme="light" />
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full bg-[#1A1A1A] text-white font-poppins font-bold text-[15px] py-4 rounded-pill hover:bg-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending…' : 'Get Your Marketing Plan'}
      </button>
      <p className="font-poppins text-[12px] text-faint text-center leading-relaxed">
        Full-service packages from ฿59,990/month. We reply within one business day.
      </p>
    </form>
  )
}
