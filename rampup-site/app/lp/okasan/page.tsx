'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { streamIframeSrc } from '@/lib/stream'

const CLIENT = {
  name: 'Okasan',
  cuisine: 'Yakitori & Izakaya',
  location: 'Bangkok',
  cover: 'https://imagedelivery.net/vLx1XbY5KfOkLsw5dmceXw/0fb118a5-8f3f-4962-b0b6-27a3aac9fd00/public',
  videos: [
    'f70a623c8453f1d41fc9776ecd499220',
    '78ce9ad58ba04d1140377b11eb0decc1',
    'a5843d1d2fd3dbb6f7938dbe44ddcb3c',
    '7cbb690a5910a91797886fde9e2a0b27',
    'b2b656ad61e8b70aca2c8ded5330efb4',
    'e3a967e8b50ccdc784c81c9d42b00018',
  ],
  photos: [
    'https://imagedelivery.net/vLx1XbY5KfOkLsw5dmceXw/0fb118a5-8f3f-4962-b0b6-27a3aac9fd00/public',
    'https://imagedelivery.net/vLx1XbY5KfOkLsw5dmceXw/727d76f8-e377-4806-113f-dca0d20fce00/public',
    'https://imagedelivery.net/vLx1XbY5KfOkLsw5dmceXw/8a68c6ae-b22a-4e97-5129-23c053f8f600/public',
    'https://imagedelivery.net/vLx1XbY5KfOkLsw5dmceXw/e1ae9fb8-3685-441c-aa60-675aeb38bc00/public',
    'https://imagedelivery.net/vLx1XbY5KfOkLsw5dmceXw/d27dfab8-a4a3-4ca4-2614-5ec77a4f4900/public',
    'https://imagedelivery.net/vLx1XbY5KfOkLsw5dmceXw/b7bb3148-1b63-4fe4-6b8d-7eac700c0c00/public',
  ],
}

const results = [
  { stat: '+54.64%', label: 'Increase in Gross Sales' },
  { stat: '+31.12%', label: 'Increase in Gross Sales' },
  { stat: '+31.62%', label: 'Increase in Gross Sales' },
]

const inclusions = [
  '7 Reels / 11 Photos',
  '4–5 posts per week',
  '2 Dine-in Ad Campaigns',
  'Content Management for Instagram, Facebook, TikTok',
  'Ad Management',
  '10–15 Menu photos',
]

// ── Inline lead form ──────────────────────────────────────────────────────────

function LeadForm() {
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
            name:         data.get('name')        ?? '',
            restaurant:   data.get('restaurant')  ?? '',
            email:        data.get('email')        ?? '',
            phone:        data.get('phone')        ?? '',
            grab_revenue: data.get('grab_revenue') ?? '',
            grab_ads:     data.get('grab_ads')     ?? '',
            service:      data.get('service')      ?? '',
            timeline:     data.get('timeline')     ?? '',
            page_path:    window.location.pathname,
            page_url:     window.location.href,
            page_type:    'funnel-okasan',
            form_name:    'lead',
            submitted_at: new Date().toISOString(),
            source:       'meta-ad',
            site:         'rampupth',
            event_id,
            ...(fbp ? { fbp } : {}),
            ...(fbc ? { fbc } : {}),
            turnstile_token: data.get('cf-turnstile-response') ?? '',
          }),
        }).catch(() => {})
      }
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
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
        <p className="font-poppins text-sm text-muted">Our team will review your restaurant and reach out within 24 hours.</p>
      </div>
    )
  }

  const inputClass = 'w-full font-poppins text-sm bg-white border border-black/[0.1] rounded-xl px-4 py-3 focus:outline-none focus:border-green/50 transition-all'
  const labelClass = 'font-poppins text-xs font-semibold text-body mb-1.5 block'

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

      {/* Grab revenue */}
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

      {/* Running Grab Ads */}
      <div>
        <label className={labelClass}>Are you running Grab Ads?</label>
        <div className="flex gap-4">
          {['Yes', 'No'].map(v => (
            <label key={v} className="flex items-center gap-2 cursor-pointer font-poppins text-sm text-body">
              <input type="radio" name="grab_ads" value={v.toLowerCase()} className="accent-green w-4 h-4" />
              {v}
            </label>
          ))}
        </div>
      </div>

      {/* Service */}
      <div>
        <label className={labelClass}>Which service are you interested in?</label>
        <div className="flex flex-col gap-2">
          {[
            { value: 'grab',   label: 'Only Grab' },
            { value: 'social', label: 'Social Media Management' },
            { value: 'both',   label: 'Both' },
          ].map(s => (
            <label key={s.value} className="flex items-center gap-2 cursor-pointer font-poppins text-sm text-body">
              <input type="radio" name="service" value={s.value} required className="accent-green w-4 h-4" />
              {s.label}
            </label>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label className={labelClass}>When do you plan to get started?</label>
        <div className="flex flex-col gap-2">
          {[
            { value: 'asap',      label: 'ASAP' },
            { value: '1_month',   label: 'Within 1 month' },
            { value: 'browsing',  label: 'Just browsing' },
          ].map(s => (
            <label key={s.value} className="flex items-center gap-2 cursor-pointer font-poppins text-sm text-body">
              <input type="radio" name="timeline" value={s.value} className="accent-green w-4 h-4" />
              {s.label}
            </label>
          ))}
        </div>
      </div>

      {/* Contact fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Your Name <span className="text-green">*</span></label>
          <input name="name" type="text" required placeholder="Khun Somchai" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Phone <span className="text-green">*</span></label>
          <input name="phone" type="tel" required placeholder="08X-XXX-XXXX" className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Email <span className="text-green">*</span></label>
        <input name="email" type="email" required placeholder="you@restaurant.com" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Restaurant Name <span className="text-green">*</span></label>
        <input name="restaurant" type="text" required placeholder="e.g. Okasan Izakaya" className={inputClass} />
      </div>

      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-theme="light" />
      )}

      <button type="submit" disabled={loading}
        className="w-full bg-green text-white font-poppins font-bold text-base py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] disabled:opacity-60 uppercase tracking-wide">
        {loading ? 'Sending…' : 'Get Started Now!'}
      </button>
    </form>
  )
}

// ── Video embed ───────────────────────────────────────────────────────────────

function VideoEmbed({ src }: { src: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-dark" style={{ aspectRatio: '9/16' }}>
      <iframe src={src} loading="lazy" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowFullScreen className="absolute inset-0 w-full h-full" title="Reel" />
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OkasanFunnelPage() {
  const videoSrcs = CLIENT.videos
    .map(id => streamIframeSrc(id, { muted: true, autoplay: true, loop: true }))
    .filter((s): s is string => s !== null)

  return (
    <main className="min-h-[100dvh] bg-[#EDEDED]">

      {/* ── 1. HERO ── */}
      <section className="bg-dark text-white">
        <div className="max-w-site mx-auto px-5 md:px-12 pt-8 pb-12 md:pt-12 md:pb-16 flex flex-col items-center text-center">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-rampup-accent.svg" alt="RampUp" className="h-8 w-auto object-contain mb-8" />
          </Link>
          <h1 className="font-sora font-extrabold text-[clamp(2rem,6vw,3.6rem)] leading-[1.08] tracking-tight mb-4">
            Restaurant Ramp Up —<br />2X Your Dine-in Sales
          </h1>
          <p className="font-poppins text-base md:text-lg text-white/70 max-w-xl mb-3">
            Increase Your Dine-In and Grab Sales
          </p>
          <p className="font-poppins text-sm text-white/50 max-w-lg">
            We create content inside your restaurant and use it to increase Grab orders and walk-ins.
          </p>
        </div>
      </section>

      {/* ── 2. FORM ── */}
      <section id="apply" className="max-w-site mx-auto px-5 md:px-12 py-14">
        <div className="max-w-xl mx-auto">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3 text-center">Apply</p>
          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-8 text-center">
            Enter Your Info Below To Apply
          </h2>
          <div className="bg-white rounded-[24px] shadow-[0_4px_32px_rgba(0,0,0,0.07)] p-7 md:p-10">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ── 3. TAGLINE + PRICE ── */}
      <section className="bg-dark py-12">
        <div className="max-w-site mx-auto px-5 md:px-12 text-center">
          <p className="font-sora font-extrabold text-2xl md:text-3xl text-green uppercase tracking-tight mb-4">
            Grow your dine-in and Grab sales with us!
          </p>
          <p className="font-sora font-extrabold text-4xl md:text-5xl text-white">
            ฿49,990 <span className="font-poppins font-normal text-xl text-white/50">/ Month</span>
          </p>
        </div>
      </section>

      {/* ── 4. PLATFORMS ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-14">
        <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3 text-center">Platforms</p>
        <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-10 text-center">
          Get Seen On These Platforms
        </h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-14">
          {[
            {
              label: 'Instagram',
              icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
            },
            {
              label: 'Facebook',
              icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>,
            },
            {
              label: 'TikTok',
              icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z"/></svg>,
            },
            {
              label: 'Grab',
              icon: (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/logo-grab.png" alt="Grab" className="w-10 h-10 object-contain" />
              ),
            },
          ].map(({ label, icon }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <div className="text-dark">{icon}</div>
              <span className="font-poppins text-sm font-medium text-body">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. VIDEOS ── */}
      {videoSrcs.length > 0 && (
        <section className="bg-dark py-14">
          <div className="max-w-site mx-auto px-5 md:px-12">
            <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3 text-center">Content</p>
            <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-2 text-center">
              We Film Videos That Elevate Your Brand
            </h2>
            <p className="font-poppins text-sm text-white/50 text-center mb-10">
              And Run Effective Ads To Increase Dine-In Sales
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {videoSrcs.map((src, i) => (
                <VideoEmbed key={i} src={src} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. FEED DESIGN / PHOTOS ── */}
      {CLIENT.photos.length > 0 && (
        <section className="max-w-site mx-auto px-5 md:px-12 py-14">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3 text-center">Photography</p>
          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-2 text-center">
            Feed Design
          </h2>
          <p className="font-poppins text-sm text-muted text-center mb-10">
            We create beautiful feeds that reflect your brand
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {CLIENT.photos.map((photo, i) => (
              <div key={i} className="rounded-2xl overflow-hidden aspect-square bg-[#E0E0E0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt={`${CLIENT.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 7. RESULTS ── */}
      <section className="bg-dark py-14">
        <div className="max-w-site mx-auto px-5 md:px-12">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3 text-center">Proof</p>
          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-2 text-center">
            Grow your Grab sales with us
          </h2>
          <p className="font-poppins text-sm text-white/50 text-center mb-10">
            See our results in just 1 month
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {results.map((r) => (
              <div key={r.stat} className="bg-white/[0.06] rounded-[20px] p-8 text-center">
                <div className="font-sora font-extrabold text-4xl md:text-5xl text-green mb-2">{r.stat}</div>
                <div className="font-poppins text-sm text-white/60">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. INCLUSIONS ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-14">
        <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3 text-center">What&apos;s Included</p>
        <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-2 text-center">
          Grab and Dine-in
        </h2>
        <p className="font-poppins text-sm text-muted text-center mb-10">
          Get more dine-in customers from Facebook, Instagram, and TikTok
        </p>
        <div className="max-w-lg mx-auto bg-white rounded-[24px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-8">
          <ul className="flex flex-col gap-4 mb-8">
            {inclusions.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-[3px] w-5 h-5 rounded-full bg-[#E8F8ED] flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5 3.5-4" stroke="#3DBE5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="font-poppins text-sm text-body">{item}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-black/[0.07] pt-6 text-center">
            <p className="font-sora font-extrabold text-3xl text-dark mb-1">
              ฿49,990 <span className="font-poppins font-normal text-base text-muted">per month for 1 location</span>
            </p>
            <p className="font-poppins text-xs text-muted mb-6">+฿4,995 per additional location</p>
            <a href="#apply"
              className="block w-full bg-green text-white font-poppins font-bold text-base py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] uppercase tracking-wide text-center">
              Get Started Now!
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-dark py-6 text-center">
        <p className="font-poppins text-xs text-white/30">© 2025 Restaurant Ramp Up. All Rights Reserved.</p>
      </footer>

      {/* ── Sticky mobile CTA ── */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-black/[0.08] px-5 py-4 flex items-center justify-between gap-4 md:hidden">
        <div>
          <p className="font-sora font-bold text-sm text-dark leading-tight">Like what you see?</p>
          <p className="font-poppins text-xs text-muted">No commitment. Apply in 2 minutes.</p>
        </div>
        <a href="#apply"
          className="shrink-0 bg-green text-white font-poppins font-bold text-sm px-6 py-3 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] uppercase">
          Apply Now →
        </a>
      </div>

    </main>
  )
}
