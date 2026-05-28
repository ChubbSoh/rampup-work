'use client'

import { useState, useRef } from 'react'
import Script from 'next/script'

const restaurantTypes = [
  { value: 'italian',   label: 'Italian' },
  { value: 'japanese',  label: 'Japanese' },
  { value: 'thai',      label: 'Thai' },
  { value: 'cafe',      label: 'Cafe' },
  { value: 'bar',       label: 'Bar / Rooftop' },
  { value: 'nightlife', label: 'Party / Nightlife' },
  { value: 'hotel',     label: 'Hotel Restaurant' },
  { value: 'other',     label: 'Other' },
]

const mainGoals = [
  { value: 'bookings',         label: 'More bookings' },
  { value: 'delivery',         label: 'More delivery sales' },
  { value: 'content',          label: 'Better content' },
  { value: 'awareness',        label: 'More brand awareness' },
  { value: 'full_marketing',   label: 'Full marketing support' },
]

export default function LeadForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const webhookSent = useRef(false)

  function getCookie(name: string): string | undefined {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
    return match ? decodeURIComponent(match[1]) : undefined
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      const netlifyRes = await fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      })
      if (!netlifyRes.ok) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[Lead] Netlify form submit failed — skipping Lead event', netlifyRes.status)
        }
        setSubmitted(true)
        return
      }
      if (!webhookSent.current) {
        webhookSent.current = true
        const event_id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
        const fbp = getCookie('_fbp')
        const fbc = getCookie('_fbc')
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
          ;(window as any).dataLayer.push({ event: 'lead_form_submit', event_id })
        }
        if (typeof window !== 'undefined' && (window as any).fbq) {
          ;(window as any).fbq('track', 'Lead', {}, { eventID: event_id })
        }
        if (process.env.NODE_ENV !== 'production') {
          console.info('[Lead] fired', { event_id, page_type: 'funnel-restaurant-marketing', fbq: typeof (window as any).fbq === 'function' })
        }
        fetch('/api/lead-relay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:            data.get('name') ?? '',
            restaurant:      data.get('restaurant') ?? '',
            email:           data.get('email') ?? '',
            phone:           data.get('phone') ?? '',
            restaurant_type: data.get('restaurant_type') ?? '',
            main_goal:       data.get('main_goal') ?? '',
            service:         'restaurant_marketing',
            page_path:       window.location.pathname,
            page_url:        window.location.href,
            page_type:       'funnel-restaurant-marketing',
            form_name:       'restaurant_marketing_funnel',
            submitted_at:    new Date().toISOString(),
            source:          'restaurant_marketing',
            site:            'rampupth',
            event_id,
            ...(fbp ? { fbp } : {}), ...(fbc ? { fbc } : {}),
            turnstile_token: data.get('cf-turnstile-response') ?? '',
          }),
        }).catch(() => {})
      }
      setSubmitted(true)
    } catch { setSubmitted(true) }
    finally { setLoading(false) }
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 bg-green-light rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14l6 6 10-10" stroke="#3DBE5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="font-sora font-bold text-xl text-dark mb-2">We&apos;ll be in touch!</h3>
        <p className="font-poppins text-base text-muted">Our team will review your restaurant and reach out within 24 hours.</p>
      </div>
    )
  }

  const inputClass = 'w-full font-poppins text-base bg-white border border-black/[0.1] rounded-xl px-4 py-3 focus:outline-none focus:border-green/50 transition-all'
  const labelClass = 'font-poppins text-sm font-semibold text-body mb-1.5 block'
  const radioClass = 'flex items-center gap-2 cursor-pointer font-poppins text-base text-body'

  return (
    <form
      name="restaurant_marketing_funnel"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <input type="hidden" name="form-name" value="restaurant_marketing_funnel" />
      <input type="hidden" name="source" value="restaurant_marketing" />
      <div hidden><input name="bot-field" /></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Your Name <span className="text-green">*</span></label>
          <input name="name" type="text" required placeholder="John Doe" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Restaurant Name <span className="text-green">*</span></label>
          <input name="restaurant" type="text" required placeholder="e.g. Bacio" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Phone / LINE <span className="text-green">*</span></label>
          <input name="phone" type="text" required placeholder="08X-XXX-XXXX" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email <span className="text-green">*</span></label>
          <input name="email" type="email" required placeholder="you@restaurant.com" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Restaurant Type <span className="text-green">*</span></label>
        <select name="restaurant_type" required className={`${inputClass} appearance-none cursor-pointer`}>
          <option value="">Select type…</option>
          {restaurantTypes.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Main Goal <span className="text-green">*</span></label>
        <div className="flex flex-col gap-2">
          {mainGoals.map(g => (
            <label key={g.value} className={radioClass}>
              <input type="radio" name="main_goal" value={g.value} required className="accent-green w-4 h-4" />
              {g.label}
            </label>
          ))}
        </div>
      </div>

      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-theme="light" />
      )}

      <button type="submit" disabled={loading}
        className="w-full bg-green text-white font-poppins font-bold text-base py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] disabled:opacity-60 uppercase tracking-wide">
        {loading ? 'Sending…' : 'Apply Now'}
      </button>
      <p className="font-poppins text-xs text-faint text-center">
        No commitment. We&apos;ll reach out within 24 hours.
      </p>
    </form>
  )
}
