'use client'

import { useState, useRef } from 'react'
import Script from 'next/script'

/**
 * Four-field lead form for cold Google Ads traffic.
 *
 * FIELD MAPPING — read before adding fields.
 * The live n8n "Website Lead Flow" starts with a `Normalize Fields` Code node
 * that rebuilds the payload from a FIXED whitelist; anything outside it is
 * dropped before the Google Sheet. Three of the four fields have a dedicated
 * persisted column:
 *   Name            -> name
 *   Phone Number    -> phone
 *   Restaurant Name -> restaurant
 * LINE ID / WhatsApp has no column of its own, so it goes into `message`,
 * which IS persisted and also appears in the owner notification.
 *
 * EMAIL IS NO LONGER COLLECTED, and that is safe by design:
 *   - /api/lead-relay requires name plus EITHER email OR phone
 *   - n8n's "Validate Required Fields" checks {{ $json.email || $json.phone }}
 *   - n8n's "Has Email?" branch skips the customer confirmation email when
 *     there is none and continues straight to the Sheet
 * Meta CAPI still matches on the hashed phone.
 */

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

    // LINE / WhatsApp has no dedicated persisted column, so it rides in
    // `message` rather than being silently dropped at Normalize Fields.
    const contactHandle = g('line_whatsapp')
    const message = contactHandle ? `LINE / WhatsApp: ${contactHandle}` : ''

    // Best-effort Netlify Forms capture (spam filtering + backup record).
    // Deliberately not awaited as a gate — the relay below is the source of
    // truth, so an unregistered form can never cost us the lead.
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
          phone: g('phone'),
          restaurant: g('restaurant'),
          message,
          service: 'Full-service restaurant marketing',
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
    'w-full font-poppins text-[16px] text-dark bg-white border border-black/[0.12] rounded-xl px-4 py-3.5 outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-black/10 transition placeholder:text-faint'
  const label = 'font-poppins text-[12px] font-semibold text-body mb-1.5 block tracking-[0.2px]'

  return (
    <form
      name={FORM_NAME}
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      onInput={onFirstInput}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p hidden>
        <label>
          Leave this empty
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div>
        <label className={label} htmlFor="rm-name">Name</label>
        <input
          id="rm-name" name="name" type="text" required autoComplete="name"
          placeholder="Your name" className={input}
        />
      </div>

      <div>
        <label className={label} htmlFor="rm-phone">Phone Number</label>
        {/* Deliberately no pattern/minLength — Thai, +66 and international
            numbers with spaces or hyphens must all pass. n8n only trims. */}
        <input
          id="rm-phone" name="phone" type="tel" required autoComplete="tel"
          inputMode="tel" placeholder="08X-XXX-XXXX" className={input}
        />
      </div>

      <div>
        <label className={label} htmlFor="rm-line">LINE ID / WhatsApp</label>
        {/* One field on purpose — the lead supplies whichever they use. */}
        <input
          id="rm-line" name="line_whatsapp" type="text" required
          placeholder="LINE ID or WhatsApp number" className={input}
        />
      </div>

      <div>
        <label className={label} htmlFor="rm-restaurant">Restaurant Name</label>
        <input
          id="rm-restaurant" name="restaurant" type="text" required autoComplete="organization"
          placeholder="Restaurant or brand name" className={input}
        />
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
        className="mt-1 w-full bg-[#1A1A1A] text-white font-poppins font-bold text-[15px] py-4 rounded-pill hover:bg-dark transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
      >
        {loading ? 'Sending…' : 'Get Your Marketing Plan'}
      </button>
      <p className="font-poppins text-[12px] text-faint text-center leading-relaxed">
        Full-service packages from ฿59,990/month. We reply within one business day.
      </p>
    </form>
  )
}
