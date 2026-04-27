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

const services = [
  { value: 'social', label: 'Social Media Management' },
  { value: 'both',   label: 'Social Media Management + Grab Growth' },
]

function InlineLeadForm() {
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
            name:         data.get('name')       ?? '',
            restaurant:   data.get('restaurant') ?? '',
            email:        data.get('email')       ?? '',
            phone:        data.get('phone')       ?? '',
            service:      data.get('service')     ?? '',
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
      <div className="text-center py-8">
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
      <input type="hidden" name="source" value="meta-ad" />
      <div hidden><input name="bot-field" /></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-poppins text-xs font-semibold text-body">Your Name <span className="text-green">*</span></label>
          <input name="name" type="text" required placeholder="Khun Somchai"
            className="font-poppins text-sm bg-[#F5F5F5] border border-black/[0.08] rounded-xl px-4 py-3 placeholder-faint focus:outline-none focus:border-green/40 focus:bg-white transition-all" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-poppins text-xs font-semibold text-body">Phone <span className="text-green">*</span></label>
          <input name="phone" type="tel" required placeholder="08X-XXX-XXXX"
            className="font-poppins text-sm bg-[#F5F5F5] border border-black/[0.08] rounded-xl px-4 py-3 placeholder-faint focus:outline-none focus:border-green/40 focus:bg-white transition-all" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-poppins text-xs font-semibold text-body">Email <span className="text-green">*</span></label>
        <input name="email" type="email" required placeholder="you@restaurant.com"
          className="font-poppins text-sm bg-[#F5F5F5] border border-black/[0.08] rounded-xl px-4 py-3 placeholder-faint focus:outline-none focus:border-green/40 focus:bg-white transition-all" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-poppins text-xs font-semibold text-body">Restaurant Name <span className="text-green">*</span></label>
        <input name="restaurant" type="text" required placeholder="e.g. Okasan Izakaya"
          className="font-poppins text-sm bg-[#F5F5F5] border border-black/[0.08] rounded-xl px-4 py-3 placeholder-faint focus:outline-none focus:border-green/40 focus:bg-white transition-all" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-poppins text-xs font-semibold text-body">I&apos;m interested in <span className="text-green">*</span></label>
        <div className="flex flex-col gap-2">
          {services.map((s) => (
            <label key={s.value} className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="service" value={s.value} required className="accent-green w-4 h-4" />
              <span className="font-poppins text-sm text-body group-hover:text-dark transition-colors">{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-theme="light" />
      )}

      <button type="submit" disabled={loading}
        className="mt-2 bg-green text-white font-poppins font-semibold text-sm px-6 py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] disabled:opacity-60">
        {loading ? 'Sending...' : 'Apply Today →'}
      </button>
      <p className="font-poppins text-xs text-faint text-center">No commitment. We&apos;ll contact you within 24 hours.</p>
    </form>
  )
}

function VideoEmbed({ src, label }: { src: string; label: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-dark" style={{ aspectRatio: '9/16' }}>
      <iframe src={src} loading="lazy" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowFullScreen className="absolute inset-0 w-full h-full" title={label} />
    </div>
  )
}

export default function OkasanFunnelPage() {
  const videoSrcs = CLIENT.videos
    .map(id => streamIframeSrc(id, { muted: true, autoplay: true, loop: true }))
    .filter((s): s is string => s !== null)

  return (
    <main className="min-h-[100dvh] bg-[#EDEDED] pb-28">

      {/* ── Hero cover ── */}
      <div className="relative w-full h-[55vw] max-h-[420px] min-h-[240px] overflow-hidden bg-dark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CLIENT.cover} alt={CLIENT.name} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Logo top-left */}
        <div className="absolute top-4 left-4 md:top-6 md:left-8">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-rampup-accent.svg" alt="RampUp" className="h-7 w-auto object-contain" />
          </Link>
        </div>
        {/* Client name bottom */}
        <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
          <p className="font-poppins text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">{CLIENT.cuisine} · {CLIENT.location}</p>
          <h1 className="font-sora font-extrabold text-4xl md:text-5xl text-white tracking-tight">{CLIENT.name}</h1>
        </div>
      </div>

      {/* ── Social proof bar ── */}
      <div className="bg-dark py-4 px-5 flex flex-wrap justify-center gap-6 md:gap-10">
        {[
          { value: '18+', label: 'Restaurants' },
          { value: '3x',  label: 'Avg Grab Growth' },
          { value: '10M+', label: 'Content Views' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="font-sora font-extrabold text-xl text-green">{s.value}</div>
            <div className="font-poppins text-[10px] text-white/50 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="max-w-5xl mx-auto px-5 md:px-12">

        {/* Videos */}
        {videoSrcs.length > 0 && (
          <section className="pt-10 pb-8">
            <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-4">Content We Made</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {videoSrcs.map((src, i) => (
                <VideoEmbed key={src} src={src} label={`Reel ${i + 1}`} />
              ))}
            </div>
          </section>
        )}

        {/* Photos */}
        {CLIENT.photos.length > 0 && (
          <section className="py-8">
            <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-4">Photography</p>
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

        {/* Lead form */}
        <section id="apply" className="py-10">
          <div className="max-w-xl mx-auto bg-white rounded-[24px] shadow-[0_4px_32px_rgba(0,0,0,0.08)] p-7 md:p-10">
            <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-2">Free Audit</p>
            <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-2">
              Want results like this<br />for your restaurant?
            </h2>
            <p className="font-poppins text-sm text-muted mb-6">
              We&apos;ll review your Grab store and social media — no commitment. Reply within 24 hours.
            </p>
            <InlineLeadForm />
          </div>
        </section>
      </div>

      {/* ── Sticky bottom CTA ── */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-black/[0.08] px-5 py-4 flex items-center justify-between gap-4 md:hidden">
        <div>
          <p className="font-sora font-bold text-sm text-dark leading-tight">Like what you see?</p>
          <p className="font-poppins text-xs text-muted">Apply — no commitment.</p>
        </div>
        <a
          href="#apply"
          className="shrink-0 bg-green text-white font-poppins font-semibold text-sm px-6 py-3 rounded-pill hover:brightness-105 transition-all active:scale-[0.98]"
        >
          Apply Now →
        </a>
      </div>
    </main>
  )
}
