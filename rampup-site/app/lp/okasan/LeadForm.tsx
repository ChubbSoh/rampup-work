'use client'

import { useState, useRef } from 'react'

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
      await fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      })
      if (!webhookSent.current) {
        webhookSent.current = true
        const event_id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
        const fbp = getCookie('_fbp')
        const fbc = getCookie('_fbc')
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
          ;(window as any).dataLayer.push({ event: 'lead_form_submit', event_id })
        }
        fetch('/api/lead-relay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.get('name') ?? '', restaurant: data.get('restaurant') ?? '',
            email: data.get('email') ?? '', phone: data.get('phone') ?? '',
            grab_revenue: data.get('grab_revenue') ?? '', grab_ads: data.get('grab_ads') ?? '',
            service: data.get('service') ?? '', timeline: data.get('timeline') ?? '',
            page_path: window.location.pathname, page_url: window.location.href,
            page_type: 'funnel-okasan', form_name: 'lead',
            submitted_at: new Date().toISOString(), source: 'meta-ad', site: 'rampupth',
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
      name="lead"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <input type="hidden" name="form-name" value="lead" />
      <input type="hidden" name="source" value="meta-ad" />
      <div hidden><input name="bot-field" /></div>

      <div>
        <label className={labelClass}>Your Name <span className="text-green">*</span></label>
        <input name="name" type="text" required placeholder="John Doe" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Email <span className="text-green">*</span></label>
        <input name="email" type="email" required placeholder="you@restaurant.com" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Phone <span className="text-green">*</span></label>
        <input name="phone" type="tel" required placeholder="08X-XXX-XXXX" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Restaurant Name <span className="text-green">*</span></label>
        <input name="restaurant" type="text" required placeholder="e.g. Okasan Izakaya" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>How much do you make per month on Grab?</label>
        <select name="grab_revenue" className={inputClass}>
          <option value="">Select range…</option>
          <option value="under_100k">Less than ฿100,000</option>
          <option value="100k_300k">฿100,000 – ฿300,000</option>
          <option value="300k_600k">฿300,000 – ฿600,000</option>
          <option value="600k_plus">฿600,000+</option>
          <option value="no_grab">Not on Grab yet</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Are you running Grab Ads?</label>
        <div className="flex gap-6">
          {['Yes', 'No'].map(v => (
            <label key={v} className={radioClass}>
              <input type="radio" name="grab_ads" value={v.toLowerCase()} className="accent-green w-4 h-4" />
              {v}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Which service are you interested in?</label>
        <div className="flex flex-col gap-2">
          {[
            { value: 'social', label: 'Social Media Management' },
            { value: 'both',   label: 'Social Media Management + Grab Sales' },
          ].map(s => (
            <label key={s.value} className={radioClass}>
              <input type="radio" name="service" value={s.value} required className="accent-green w-4 h-4" />
              {s.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>When do you plan to get started?</label>
        <div className="flex flex-col gap-2">
          {[
            { value: 'asap',     label: 'ASAP' },
            { value: '1_month',  label: 'Within 1 month' },
            { value: 'browsing', label: 'Just browsing' },
          ].map(s => (
            <label key={s.value} className={radioClass}>
              <input type="radio" name="timeline" value={s.value} className="accent-green w-4 h-4" />
              {s.label}
            </label>
          ))}
        </div>
      </div>

      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-theme="light" />
      )}

      <button type="submit" disabled={loading}
        className="w-full bg-green text-white font-poppins font-bold text-base py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] disabled:opacity-60 uppercase tracking-wide">
        {loading ? 'Sending…' : 'Get Started Now!'}
      </button>
      <p className="font-poppins text-sm text-muted italic text-center">฿59,990 baht / per month</p>
    </form>
  )
}
