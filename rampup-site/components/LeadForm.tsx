'use client'

import { useState, useRef } from 'react'

const services = [
  { value: 'social', label: 'Social Media Management' },
  { value: 'both', label: 'Social Media Management + Grab Growth' },
]

export default function LeadForm({ compact = false }: { compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const webhookSent = useRef(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // Netlify forms — POST to / with form-name
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      await fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      })

      // Fire internal relay after successful Netlify submit — non-blocking
      if (!webhookSent.current) {
        webhookSent.current = true
        const path = window.location.pathname.replace(/\/$/, '')
        const pageTypeMap: Record<string, string> = {
          '':              'homepage',
          '/social-media': 'social-media',
          '/grab-sales':   'grab-sales',
          '/contact':      'contact',
        }
        const page_type = pageTypeMap[path] ?? 'other'
        const event_id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

        const payload = {
          name:         data.get('name')        ?? '',
          restaurant:   data.get('restaurant')  ?? '',
          email:        data.get('email')        ?? '',
          phone:        data.get('phone')        ?? '',
          service:      data.get('service')      ?? '',
          message:      data.get('message')      ?? '',
          page_path:    window.location.pathname,
          page_url:     window.location.href,
          page_type,
          form_name:    'lead',
          submitted_at: new Date().toISOString(),
          source:       'website',
          site:         'rampupth',
          event_id,
        }

        // Push to GTM dataLayer for browser-side Pixel deduplication
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
          ;(window as any).dataLayer.push({
            event:    'lead_form_submit',
            event_id,
          })
        }

        fetch('/api/lead-relay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {/* relay failure — silent, Netlify is source of truth */})
      }

      setSubmitted(true)
    } catch {
      // fail silently — still show success to not block user
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-green-light rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14l6 6 10-10" stroke="#3DBE5A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="font-sora font-bold text-lg text-dark mb-2">We&apos;ll be in touch!</h3>
        <p className="font-poppins text-sm text-muted">
          Our team will review your restaurant and reach out within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form
      name="lead"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="form-name" value="lead" />
      <div hidden><input name="bot-field" /></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-poppins text-xs font-semibold text-body">
            Your Name <span className="text-green">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Khun Somchai"
            className="font-poppins text-sm bg-[#EDEDED] border border-black/[0.08] rounded-xl px-4 py-3 placeholder-faint focus:outline-none focus:border-green/40 focus:bg-white transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-poppins text-xs font-semibold text-body">
            Phone <span className="text-green">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            required
            placeholder="08X-XXX-XXXX"
            className="font-poppins text-sm bg-[#EDEDED] border border-black/[0.08] rounded-xl px-4 py-3 placeholder-faint focus:outline-none focus:border-green/40 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-poppins text-xs font-semibold text-body">
          Email <span className="text-green">*</span>
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@restaurant.com"
          className="font-poppins text-sm bg-[#EDEDED] border border-black/[0.08] rounded-xl px-4 py-3 placeholder-faint focus:outline-none focus:border-green/40 focus:bg-white transition-all"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-poppins text-xs font-semibold text-body">
          Restaurant Name <span className="text-green">*</span>
        </label>
        <input
          name="restaurant"
          type="text"
          required
          placeholder="e.g. Okasan Izakaya"
          className="font-poppins text-sm bg-[#EDEDED] border border-black/[0.08] rounded-xl px-4 py-3 placeholder-faint focus:outline-none focus:border-green/40 focus:bg-white transition-all"
        />
      </div>

      {!compact && (
        <div className="flex flex-col gap-1.5">
          <label className="font-poppins text-xs font-semibold text-body">
            Current Grab Monthly Revenue (฿)
          </label>
          <select
            name="grab_revenue"
            className="font-poppins text-sm bg-[#EDEDED] border border-black/[0.08] rounded-xl px-4 py-3 text-body focus:outline-none focus:border-green/40 focus:bg-white transition-all appearance-none cursor-pointer"
          >
            <option value="">Select range...</option>
            <option value="under_30k">Under ฿30,000</option>
            <option value="30k_100k">฿30,000 – ฿100,000</option>
            <option value="100k_300k">฿100,000 – ฿300,000</option>
            <option value="300k_plus">฿300,000+</option>
            <option value="no_grab">Not on Grab yet</option>
          </select>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-poppins text-xs font-semibold text-body">
          I&apos;m interested in <span className="text-green">*</span>
        </label>
        <div className="flex flex-col gap-2">
          {services.map((s) => (
            <label key={s.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="service"
                value={s.value}
                required
                className="accent-green w-4 h-4"
              />
              <span className="font-poppins text-sm text-body group-hover:text-dark transition-colors">
                {s.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-green text-white font-poppins font-semibold text-sm px-6 py-3.5 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'Apply Today →'}
      </button>

      <p className="font-poppins text-xs text-faint text-center">
        No commitment. We&apos;ll contact you within 24 hours.
      </p>
    </form>
  )
}
