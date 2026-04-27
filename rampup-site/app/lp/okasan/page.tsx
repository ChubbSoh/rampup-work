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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OkasanFunnelPage() {
  return (
    <main className="min-h-[100dvh] bg-[#EDEDED]">

      {/* ── 1. HERO + FORM ── */}
      <section id="apply" className="max-w-site mx-auto px-5 md:px-12 pt-10 pb-6 md:pt-16 md:pb-8">
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
      <section className="max-w-site mx-auto px-5 md:px-12 pt-4 pb-8">
        <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-8 text-center">
          We manage these platforms
        </h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {([
            {
              label: 'Instagram',
              svg: (
                <svg viewBox="0 0 450 450" className="w-10 h-10">
                  <defs>
                    <radialGradient id="ig-g" cx="30%" cy="107%" r="150%">
                      <stop offset="0%" stopColor="#fdf497"/>
                      <stop offset="5%" stopColor="#fdf497"/>
                      <stop offset="45%" stopColor="#fd5949"/>
                      <stop offset="60%" stopColor="#d6249f"/>
                      <stop offset="90%" stopColor="#285AEB"/>
                    </radialGradient>
                  </defs>
                  <rect width="450" height="450" rx="100" fill="url(#ig-g)"/>
                  <rect x="135" y="135" width="180" height="180" rx="50" fill="none" stroke="white" strokeWidth="22"/>
                  <circle cx="225" cy="225" r="55" fill="none" stroke="white" strokeWidth="22"/>
                  <circle cx="300" cy="150" r="14" fill="white"/>
                </svg>
              ),
            },
            {
              label: 'Facebook',
              svg: (
                <svg viewBox="0 0 450 450" className="w-10 h-10">
                  <circle cx="225" cy="225" r="225" fill="#1877F2"/>
                  <path d="M313 225c0-48.6-39.4-88-88-88s-88 39.4-88 88c0 43.9 32.1 80.3 74.1 87V253.4h-22.3V225h22.3v-19.4c0-22 13.1-34.1 33.1-34.1 9.6 0 19.6 1.7 19.6 1.7v21.6H252c-10.9 0-14.3 6.8-14.3 13.7V225h24.3l-3.9 28.4H237.7V312C279.9 305.3 313 268.9 313 225z" fill="white"/>
                </svg>
              ),
            },
            {
              label: 'TikTok',
              svg: (
                <svg viewBox="0 0 450 450" className="w-10 h-10">
                  <circle cx="225" cy="225" r="225" fill="#010101"/>
                  <path d="M297 148.4a72.2 72.2 0 01-56.3-63.4H195v153.8a43.2 43.2 0 01-43.2 37.3 43.2 43.2 0 01-43.2-43.2 43.2 43.2 0 0143.2-43.2c4.2 0 8.1.6 11.8 1.7v-47a90 90 0 00-11.8-.8 90 90 0 00-90 90 90 90 0 0090 90 90 90 0 0090-90V189.1a122.4 122.4 0 0071.5 22.8v-46.4a72.4 72.4 0 01-15.3-17.1h-.1z" fill="white"/>
                </svg>
              ),
            },
            {
              label: 'Grab',
              svg: (
                <svg viewBox="66 66 318 318" className="w-10 h-10">
                  <defs><clipPath id="grab-clip"><path d="M66 66h318v318H66z"/></clipPath></defs>
                  <g clipPath="url(#grab-clip)">
                    <path fill="#289245" d="M383.824219 303.25C383.824219 305.054688 383.746094 308.738281 383.671875 311.667969C383.445312 318.734375 382.847656 327.980469 382.019531 332.1875C380.667969 338.5 378.789062 344.4375 376.308594 349.398438C373.226562 355.261719 369.46875 360.523438 364.957031 365.03125C360.375 369.542969 355.113281 373.375 349.324219 376.382812C344.363281 378.863281 338.277344 380.890625 331.960938 382.167969C327.828125 383.070312 318.660156 383.523438 311.59375 383.824219C308.738281 383.972656 304.90625 383.972656 303.175781 383.972656L146.542969 383.972656C144.816406 383.972656 141.058594 383.898438 138.125 383.746094C131.0625 383.523438 121.816406 382.921875 117.609375 382.019531C111.292969 380.742188 105.433594 378.789062 100.472656 376.308594C94.609375 373.300781 89.421875 369.46875 84.839844 364.957031C80.253906 360.449219 76.570312 355.261719 73.5625 349.398438C71.007812 344.4375 69.054688 338.351562 67.777344 332.113281C67.027344 327.980469 66.347656 318.808594 66.199219 311.667969C66.125 308.738281 66.046875 304.980469 66.046875 303.25L66.125 146.695312C66.125 144.964844 66.125 141.207031 66.199219 138.277344C66.425781 131.136719 67.027344 121.890625 67.851562 117.757812C69.128906 111.371094 71.085938 105.507812 73.5625 100.546875C76.570312 94.757812 80.480469 89.421875 84.988281 84.914062C89.5 80.402344 94.757812 76.570312 100.546875 73.640625C105.507812 71.085938 111.519531 69.207031 117.984375 67.925781C122.042969 67.101562 131.210938 66.574219 138.351562 66.273438C141.058594 66.125 144.890625 66.125 146.621094 66.125L303.175781 66.125C304.980469 66.125 308.738281 66.199219 311.59375 66.273438C318.808594 66.5 327.980469 67.101562 332.1875 68.003906C338.425781 69.207031 344.4375 71.160156 349.324219 73.714844C355.261719 76.722656 360.523438 80.554688 365.03125 85.0625C369.542969 89.648438 373.300781 94.910156 376.382812 100.773438C378.9375 105.734375 380.890625 111.671875 382.167969 117.984375C382.996094 122.191406 383.597656 131.285156 383.824219 138.351562C383.972656 141.359375 384.046875 145.042969 384.046875 146.769531Z" fillRule="evenodd"/>
                  </g>
                  <path fill="#ffffff" d="M300.019531 201.484375L300.019531 170.070312L306.484375 170.070312L306.484375 197.050781C304.753906 197.953125 302.351562 199.605469 300.019531 201.484375M288.820312 210.957031C290.851562 208.550781 292.953125 206.144531 295.285156 204.191406L295.285156 170.070312L288.820312 170.070312ZM214.261719 235.832031C214.261719 244.328125 217.644531 252.21875 223.65625 258.304688C229.746094 264.320312 237.636719 267.703125 246.054688 267.703125C249.664062 267.703125 253.347656 266.875 255.828125 265.671875L255.828125 259.285156C252.746094 260.5625 249.136719 261.238281 246.054688 261.238281C232.226562 261.238281 220.652344 249.664062 220.652344 235.910156L220.652344 230.121094C220.652344 216.367188 232.226562 204.792969 246.054688 204.792969C252.820312 204.792969 259.359375 207.421875 264.019531 212.160156C268.828125 216.894531 271.382812 223.28125 271.382812 230.121094L271.382812 267.703125L277.921875 267.703125L277.921875 228.917969C277.472656 220.726562 273.941406 212.984375 268.003906 207.273438C261.914062 201.484375 254.246094 198.40625 246.054688 198.40625C237.636719 198.40625 229.671875 201.710938 223.65625 207.722656C217.644531 213.8125 214.261719 221.703125 214.261719 230.121094ZM310.691406 220.425781C313.546875 217.496094 317.382812 215.839844 321.066406 215.839844C329.105469 215.839844 335.195312 222.003906 335.195312 229.972656L335.195312 235.757812C335.195312 243.726562 329.03125 249.886719 321.066406 249.886719C317.230469 249.886719 313.472656 247.785156 310.617188 243.949219C308.0625 240.570312 306.332031 235.984375 306.109375 231.925781L300.921875 238.3125C301.898438 243.125 304.453125 247.710938 308.0625 251.089844C311.820312 254.472656 316.40625 256.351562 321.066406 256.351562C332.414062 256.351562 341.734375 247.109375 341.734375 235.683594L341.734375 229.894531C341.734375 224.484375 339.554688 219.375 335.570312 215.390625C331.664062 211.480469 326.476562 209.300781 321.066406 209.300781C317.683594 209.300781 312.269531 210.503906 305.808594 216.292969L305.730469 216.367188C304.078125 218.097656 300.019531 222.078125 297.464844 224.9375C293.332031 229.445312 287.316406 236.359375 282.207031 243.199219L282.207031 253.195312C287.917969 245.828125 291.226562 241.847656 296.5625 235.683594C301.371094 230.195312 307.308594 223.355469 310.691406 220.425781M158.496094 208.324219L158.496094 200.660156C152.707031 197.503906 146.320312 196.148438 137.902344 196.148438C129.332031 196.148438 121.140625 199.230469 114.902344 205.019531C108.738281 210.730469 105.28125 218.320312 105.28125 226.289062L105.28125 228.316406C105.28125 245.003906 118.585938 258.457031 134.96875 258.457031C148.347656 258.457031 153.835938 254.097656 155.1875 252.746094L155.1875 233.355469L133.390625 233.355469L133.390625 239.816406L149.175781 239.816406L149.175781 249.511719L149.101562 249.511719C146.996094 250.339844 142.785156 251.992188 134.894531 251.992188C128.65625 251.992188 122.792969 249.511719 118.433594 245.152344C114 240.71875 111.519531 234.707031 111.519531 228.316406L111.519531 226.289062C111.519531 213.359375 123.546875 202.539062 137.75 202.539062C147.671875 202.613281 153.535156 204.265625 158.496094 208.324219M205.46875 215.917969C207.875 215.917969 209.980469 216.292969 211.632812 217.042969C212.460938 215.089844 213.210938 213.4375 214.414062 211.40625C212.683594 210.128906 208.550781 209.378906 205.394531 209.378906C193.667969 209.378906 184.726562 218.246094 184.726562 230.046875L184.726562 267.625L191.1875 267.625L191.1875 230.046875C191.265625 221.703125 197.050781 215.917969 205.46875 215.917969M94.007812 226.363281L94.007812 228.394531C94.007812 239.589844 98.292969 249.886719 105.957031 257.707031C113.550781 265.445312 123.847656 269.65625 134.894531 269.65625C143.761719 269.65625 151.578125 267.703125 158.117188 263.644531C163.605469 260.484375 166.085938 257.179688 166.234375 256.878906L166.234375 222.230469L133.390625 222.230469L133.390625 228.695312L159.921875 228.695312L159.921875 254.925781C156.765625 258.003906 149.476562 263.265625 134.96875 263.265625C125.574219 263.265625 116.78125 259.734375 110.46875 253.195312C104.003906 246.65625 100.472656 237.863281 100.472656 228.46875L100.472656 226.4375C100.472656 217.417969 104.53125 208.550781 111.519531 201.9375C118.660156 195.171875 128.054688 191.488281 137.902344 191.488281C147.070312 191.488281 153.457031 192.917969 158.496094 196L158.496094 188.707031C153.160156 186.453125 146.769531 185.402344 137.902344 185.402344C114.152344 185.402344 94.007812 204.191406 94.007812 226.363281M266.648438 267.625L266.648438 230.046875C266.648438 218.472656 257.628906 209.378906 246.054688 209.378906C240.71875 209.378906 235.53125 211.558594 231.550781 215.464844C227.640625 219.449219 225.460938 224.558594 225.460938 229.972656L225.460938 235.757812C225.460938 246.957031 234.933594 256.425781 246.054688 256.425781C249.136719 256.425781 253.347656 255.601562 255.828125 253.496094L255.828125 246.730469C253.269531 248.761719 249.664062 249.886719 246.054688 249.886719C238.164062 249.886719 231.851562 243.726562 231.851562 235.757812L231.851562 229.972656C231.851562 221.929688 238.089844 215.839844 246.054688 215.839844C254.023438 215.839844 260.261719 222.003906 260.261719 229.972656L260.261719 267.550781L266.648438 267.550781ZM205.46875 204.71875C209.828125 204.71875 213.585938 205.621094 217.042969 207.574219C218.621094 205.542969 220.351562 203.964844 221.554688 202.6875C217.945312 199.90625 211.78125 198.328125 205.542969 198.328125C196.601562 198.328125 188.40625 201.484375 182.695312 207.347656C176.910156 213.210938 173.675781 221.175781 173.675781 230.121094L173.675781 267.703125L180.214844 267.703125L180.214844 230.121094C180.140625 215.089844 190.511719 204.71875 205.46875 204.71875M343.460938 207.648438C337.449219 201.5625 329.40625 198.328125 321.066406 198.328125C314.902344 198.328125 308.8125 200.507812 305.429688 202.761719C298.441406 207.421875 292.578125 212.535156 282.28125 225.914062L282.28125 235.53125C291.152344 224.035156 299.417969 215.089844 305.808594 210.054688C309.941406 206.746094 315.804688 204.644531 321.140625 204.644531C334.894531 204.644531 346.46875 216.21875 346.46875 229.972656L346.46875 235.757812C346.46875 242.597656 343.839844 248.910156 338.953125 253.648438C334.140625 258.53125 327.828125 261.085938 321.066406 261.085938C309.789062 261.085938 299.792969 253.347656 297.164062 242.75L292.578125 248.160156C295.886719 259.359375 307.835938 267.550781 321.066406 267.550781C329.484375 267.550781 337.449219 264.242188 343.460938 258.15625C349.550781 252.144531 352.855469 244.175781 352.855469 235.683594L352.855469 229.894531C352.855469 221.628906 349.550781 213.738281 343.460938 207.648438"/>
                </svg>
              ),
            },
            {
              label: 'Lineman',
              svg: (
                <svg viewBox="63 59 319 320" className="w-10 h-10">
                  <path fill="#48b061" d="M83.332031 84.273438C83.640625 83.960938 83.953125 83.652344 84.261719 83.34375C86.585938 82.722656 88.136719 81.328125 88.757812 78.847656C89.066406 78.539062 89.53125 78.226562 89.839844 77.917969C90.152344 77.761719 90.304688 77.453125 90.617188 77.296875C90.769531 76.988281 90.925781 76.832031 91.234375 76.832031C93.40625 76.988281 94.800781 75.28125 96.195312 74.351562C108.28125 66.136719 121.453125 60.867188 136.175781 60.867188C193.667969 60.867188 251.3125 60.867188 308.804688 60.710938C322.90625 60.710938 335.613281 64.742188 347.234375 72.183594C368.15625 85.511719 378.847656 105.195312 381.792969 129.53125C381.792969 189.207031 381.792969 248.882812 381.792969 308.402344C380.398438 318.789062 378.074219 328.707031 372.804688 338.007812C371.253906 340.796875 368.464844 343.277344 368.464844 346.996094C368.464844 347.152344 368.3125 347.460938 368.15625 347.460938C366.296875 347.617188 365.367188 349.011719 364.28125 350.253906C350.335938 367.148438 332.359375 376.757812 310.355469 376.757812C251.933594 377.066406 193.511719 376.914062 134.933594 376.914062C131.0625 376.914062 127.1875 376.757812 123.46875 375.828125C108.28125 371.644531 94.488281 364.824219 83.640625 352.886719C81.9375 351.027344 81.316406 348.238281 78.375 347.773438L78.683594 347.460938L78.375 347.773438C78.839844 344.984375 76.359375 343.585938 75.121094 341.726562C66.285156 328.085938 64.273438 312.742188 64.425781 297.085938C64.738281 242.371094 63.652344 187.8125 65.046875 133.097656C65.355469 118.371094 69.695312 105.507812 77.445312 93.261719C79.457031 90.316406 83.332031 88.457031 83.332031 84.273438"/>
                  <path fill="#ffffff" d="M176.777344 210.597656C175.226562 210.597656 174.605469 209.203125 173.675781 208.273438C164.378906 199.128906 155.234375 189.671875 145.9375 180.527344C144.078125 178.667969 142.375 176.1875 139.738281 174.949219C139.585938 175.414062 139.273438 175.722656 139.273438 176.03125C139.273438 213.078125 139.121094 250.121094 139.273438 287.167969C139.273438 294.917969 145.78125 301.894531 153.53125 303.441406C164.6875 305.613281 172.746094 299.722656 176.3125 287.011719C176.621094 287.941406 177.085938 288.71875 177.859375 290.734375C177.859375 264.382812 177.859375 239.117188 177.859375 213.851562C178.015625 212.613281 177.859375 211.371094 176.777344 210.597656M139.273438 152.628906C139.121094 158.050781 141.289062 162.546875 145.007812 166.265625C170.113281 191.378906 195.371094 216.488281 220.320312 241.753906C222.800781 244.234375 223.882812 243.457031 225.898438 241.441406C234.886719 232.296875 244.03125 223.308594 253.019531 214.316406C269.132812 198.199219 285.25 182.234375 301.210938 165.957031C309.113281 158.050781 308.648438 146.273438 300.589844 138.988281C292.6875 132.011719 282.152344 132.789062 273.9375 141.003906C257.976562 156.96875 241.859375 172.933594 226.054688 189.050781C223.882812 191.378906 222.488281 191.6875 220.164062 189.050781C215.671875 184.09375 210.710938 179.597656 206.0625 174.792969C194.441406 163.167969 182.972656 151.542969 171.351562 140.074219C165.308594 134.183594 158.179688 132.476562 150.433594 135.730469C143.304688 138.832031 139.585938 144.566406 139.273438 152.628906M306.324219 175.257812C305.394531 175.101562 304.929688 175.878906 304.464844 176.34375C293.464844 187.191406 282.617188 198.199219 271.613281 209.046875C270.21875 210.441406 269.910156 211.992188 269.910156 213.851562C269.910156 237.414062 269.910156 260.816406 269.910156 284.378906C269.910156 288.097656 270.527344 291.816406 272.542969 295.074219C277.191406 302.359375 285.558594 305.613281 293.773438 303.132812C301.519531 300.808594 306.636719 293.988281 306.636719 285.308594C306.636719 249.65625 306.636719 213.851562 306.636719 178.203125C306.789062 177.273438 307.101562 176.1875 306.324219 175.257812"/>
                </svg>
              ),
            },
            {
              label: 'Google',
              svg: (
                <svg viewBox="0 0 450 450" className="w-10 h-10">
                  <path d="M434.3 225c0-14.8-1.3-29.1-3.8-42.9H225v81.2h117.1c-5 27.1-20.4 50.1-43.4 65.5v54.5h70.2C408 342.2 434.3 288.2 434.3 225z" fill="#4285F4"/>
                  <path d="M225 450c58.5 0 107.6-19.4 143.4-52.7l-70.2-54.5c-19.4 13-44.2 20.7-73.2 20.7-56.3 0-103.9-38-121-89.1H31.8v56.3C67.4 399.4 141.5 450 225 450z" fill="#34A853"/>
                  <path d="M104 274.4a136.3 136.3 0 010-98.8v-56.3H31.8A225 225 0 000 225c0 36.3 8.7 70.6 24 100.7L104 274.4z" fill="#FBBC05"/>
                  <path d="M225 89.7c31.7 0 60.2 10.9 82.6 32.3l62-62C331.6 22.1 282.5 0 225 0 141.5 0 67.4 50.6 31.8 124.3l72.2 56.3C121.1 127.7 168.7 89.7 225 89.7z" fill="#EA4335"/>
                </svg>
              ),
            },
          ] as { label: string; svg: React.ReactNode }[]).map(({ label, svg }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              {svg}
              <span className="font-poppins text-sm font-medium text-body">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. VIDEOS (Cloudflare Stream) ── */}
      <section className="bg-black py-10">
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
      <section className="bg-black py-10">
        <div className="max-w-site mx-auto px-5 md:px-12">
          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-2 text-center">
            Grow your Grab sales with us
          </h2>
          <p className="font-poppins text-lg text-white/50 text-center mb-3">
            Actual revenue growth from restaurants we work with
          </p>
          <div
            className="flex gap-5 md:grid md:grid-cols-2 md:gap-5"
            style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[
              { before: '฿665K', after: '฿1.25M', timeframe: '2 months', growth: '1.9x growth', monthly: '+฿295K / month', beforeImg: '/results/proof-1-after.jpg', afterImg: '/results/proof-1-before.jpg' },
              { before: '฿300K', after: '฿628K',  timeframe: '2 months', growth: '2.1x growth', monthly: '+฿328K / month', beforeImg: '/results/proof-2-before.jpg', afterImg: '/results/proof-2-after.jpg' },
              { before: '฿127K', after: '฿249K',  timeframe: '4 months', growth: '2x growth',   monthly: '+฿122K / month', beforeImg: '/results/proof-3-before.jpg', afterImg: '/results/proof-3-after.jpg' },
              { before: '฿431K', after: '฿814K',  timeframe: '5 months', growth: '1.9x growth', monthly: '+฿383K / month', beforeImg: '/results/proof-4-before.jpg', afterImg: '/results/proof-4-after.jpg' },
            ].map((card) => (
              <div
                key={card.before}
                className="shrink-0 w-[80vw] md:w-auto bg-[#F5F5F5] rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5"
                style={{ scrollSnapAlign: 'start' }}
              >
                <p className="font-sora font-bold text-[17px] text-dark leading-tight mb-0.5">
                  {card.before} → {card.after}
                </p>
                <p className="font-poppins text-[11px] text-muted/70 mb-4">Results achieved in {card.timeframe}</p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {([
                    { label: 'BEFORE' as const, src: card.beforeImg },
                    { label: 'AFTER'  as const, src: card.afterImg  },
                  ]).map(({ label, src }) => (
                    <div key={label} className="relative rounded-[12px] overflow-hidden bg-[#E4E4E4]" style={{ aspectRatio: '9/16' }}>
                      {src && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt={label} className="absolute inset-0 w-full h-full object-cover object-top" />
                      )}
                      <div className="absolute inset-x-0 top-0 h-[20%] z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }} />
                      <div className="absolute inset-x-0 bottom-0 h-[20%] z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.85) 0%, transparent 100%)', maskImage: 'linear-gradient(to top, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)' }} />
                      <span className={`absolute top-2 left-2 font-poppins text-[10px] font-bold px-2 py-1 rounded-full text-white z-10 ${label === 'BEFORE' ? 'bg-[#9E9E9E]' : 'bg-[#3DBE5A]'}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="font-sora font-extrabold text-2xl text-green mb-0.5">{card.growth}</p>
                <p className="font-poppins text-sm font-semibold text-dark mb-0.5">{card.monthly}</p>
                <p className="font-poppins text-[11px] text-muted/70">Average monthly increase in revenue</p>
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
              ฿59,990 <span className="font-poppins font-normal text-base text-muted">per month for 1 location</span>
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
      <footer className="bg-white py-6 text-center border-t border-black/[0.06]">
        <p className="font-poppins text-sm text-muted">© 2025 Restaurant Ramp Up. All Rights Reserved.</p>
      </footer>

    </main>
  )
}
