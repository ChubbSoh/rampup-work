'use client'

import { useState, useRef } from 'react'

const CLIENT = {
  name: 'Okasan',
  cuisine: 'Yakitori & Izakaya',
  location: 'Bangkok',
  // Cloudflare Stream — iframe.videodelivery.net works without customer subdomain
  videoIds: [
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

// ── Lead form ─────────────────────────────────────────────────────────────────

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
      <p className="font-poppins text-sm text-muted italic text-center">฿49,990 baht / per month</p>
    </form>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OkasanFunnelPage() {
  return (
    <main className="min-h-[100dvh] bg-[#EDEDED]">

      {/* ── 1. HERO + FORM ── */}
      <section id="apply" className="max-w-site mx-auto px-5 md:px-12 pt-10 pb-14 md:pt-16 md:pb-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">
          <div className="flex-1 max-w-xl mb-10 lg:mb-0 text-center lg:text-left">
            <h1 className="font-sora font-extrabold text-[clamp(2rem,5vw,3.4rem)] leading-[1.08] tracking-tight text-dark mb-5">
              Increase Your<br />Dine-In and<br />Grab Sales
            </h1>
            <p className="font-poppins text-lg md:text-xl text-muted leading-relaxed">
              We create content inside your restaurant and use it to increase Grab orders and walk-ins.
            </p>
          </div>
          <div className="w-full lg:w-[460px] shrink-0">
            <div className="bg-white rounded-[24px] shadow-[0_4px_32px_rgba(0,0,0,0.07)] p-7 md:p-10">
              <h2 className="font-sora font-bold text-xl text-dark mb-6">
                Enter Your Info Below To Apply
              </h2>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PLATFORMS ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-10">
        <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-8 text-center">
          We manage these platforms
        </h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {[
            { label: 'Instagram',   src: '/logo-ig.svg' },
            { label: 'Facebook',    src: '/logo-fb.svg' },
            { label: 'TikTok',      src: '/logo-tiktok.svg' },
            { label: 'Grab',        src: '/logo-grab.svg' },
            { label: 'Lineman',     src: '/logo-lineman.svg' },
            { label: 'Google',      src: '/logo-google.svg' },
          ].map(({ label, src }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={label} className="w-10 h-10 object-contain" />
              <span className="font-poppins text-sm font-medium text-body">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. VIDEOS (Cloudflare Stream) ── */}
      <section className="bg-dark py-10">
        <div className="max-w-site mx-auto px-5 md:px-12">
          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-2 text-center">
            We Film Videos That Elevate Your Brand
          </h2>
          <p className="font-poppins text-lg text-white/50 text-center mb-8">
            And Run Effective Ads To Increase Dine-In Sales
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {CLIENT.videoIds.map((id) => (
              <div key={id} className="relative w-full overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: '9/16' }}>
                <iframe
                  src={`https://iframe.videodelivery.net/${id}?muted=true&autoplay=true&loop=true&preload=none`}
                  loading="lazy"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  title="Okasan video"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FEED DESIGN / PHOTOS ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-10">
        <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-2 text-center">
          Feed Design
        </h2>
        <p className="font-poppins text-lg text-muted text-center mb-8">
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

      {/* ── 5. RESULTS ── */}
      <section className="bg-dark py-10">
        <div className="max-w-site mx-auto px-5 md:px-12">
          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-2 text-center">
            Grow your Grab sales with us
          </h2>
          <p className="font-poppins text-lg text-white/50 text-center mb-8">
            See our results in just 1 month
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {results.map((r) => (
              <div key={r.stat} className="bg-white/[0.06] rounded-[20px] p-8 text-center">
                <div className="font-sora font-extrabold text-4xl md:text-5xl text-green mb-2">{r.stat}</div>
                <div className="font-poppins text-base text-white/60">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. INCLUSIONS ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-10">
        <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-2 text-center">
          Grab and Dine-in
        </h2>
        <p className="font-poppins text-lg text-muted text-center mb-8">
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
                <span className="font-poppins text-base text-body">{item}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-black/[0.07] pt-6 text-center">
            <p className="font-sora font-extrabold text-3xl text-dark mb-1">
              ฿49,990 <span className="font-poppins font-normal text-base text-muted">per month for 1 location</span>
            </p>
            <p className="font-poppins text-sm text-muted mb-6">+฿4,995 per additional location</p>
            <a href="#apply"
              className="block w-full bg-green text-white font-poppins font-bold text-base py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] uppercase tracking-wide text-center">
              Get Started Now!
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-dark py-6 text-center">
        <p className="font-poppins text-sm text-white/30">© 2025 Restaurant Ramp Up. All Rights Reserved.</p>
      </footer>

    </main>
  )
}
