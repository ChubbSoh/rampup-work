'use client'

import { useRef, useState } from 'react'
import Script from 'next/script'
import { th, type Lang } from '@/lib/translations'
import { postLead } from '@/lib/lead-relay-client'
import { readTrackingParams, useTrackingParams } from '@/lib/tracking'
import { restaurantRampUp, formatTHB } from '@/lib/pricing'
import {
  GRAB_REVENUE_OPTIONS,
  TIMELINE_OPTIONS,
  websiteLeadForm,
  type LeadFormConfig,
  type LeadFormField,
  type LeadFormOption,
} from '@/lib/lead-forms'

const ERROR_MESSAGE =
  'Something went wrong sending your details. Please try again, or message us on LINE.'

/** page_type for the bilingual website form, derived from the path. */
const PAGE_TYPE_BY_PATH: Record<string, string> = {
  '': 'homepage',
  '/social-media': 'social-media',
  '/grab-sales': 'grab-sales',
  '/contact': 'contact',
  '/th': 'homepage-th',
  '/th/social-media': 'social-media-th',
  '/th/grab-sales': 'grab-sales-th',
  '/th/contact': 'contact-th',
}

const VARIANTS = {
  /** Homepage / pricing card: grey inset inputs, two-column grid, inline button. */
  panel: {
    form: 'flex flex-col gap-4',
    layout: 'grid' as const,
    label: 'font-poppins text-xs font-semibold text-body',
    field: 'flex flex-col gap-1.5',
    input:
      'font-poppins text-sm bg-[#EDEDED] border border-black/[0.08] rounded-xl px-4 py-3 placeholder-faint focus:outline-none focus:border-green/40 focus:bg-white transition-all',
    radioRow: 'font-poppins text-sm text-body group-hover:text-dark transition-colors',
    button:
      'mt-2 bg-green text-white font-poppins font-semibold text-sm px-6 py-3.5 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] disabled:opacity-60',
    footer: 'font-poppins text-xs text-faint text-center',
    success: 'text-center py-6',
    successHeading: 'font-sora font-bold text-lg text-dark mb-2',
    successBody: 'font-poppins text-sm text-muted',
    tick: '#3DBE5A',
    tickBg: 'bg-green-light',
  },
  /** Funnel and /lp pages: white inputs, single column, full-width green button. */
  stacked: {
    form: 'flex flex-col gap-5',
    layout: 'stack' as const,
    label: 'font-poppins text-sm font-semibold text-body mb-1.5 block',
    field: '',
    input:
      'w-full font-poppins text-base bg-white border border-black/[0.1] rounded-xl px-4 py-3 focus:outline-none focus:border-green/50 transition-all',
    radioRow: 'font-poppins text-base text-body',
    button:
      'w-full bg-green text-white font-poppins font-bold text-base py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] disabled:opacity-60 uppercase tracking-wide',
    footer: 'font-poppins text-sm text-muted italic text-center',
    success: 'text-center py-10',
    successHeading: 'font-sora font-bold text-xl text-dark mb-2',
    successBody: 'font-poppins text-base text-muted',
    tick: '#3DBE5A',
    tickBg: 'bg-green-light',
  },
  /** /restaurant-marketing: black button, focus rings, autofill hints. */
  dark: {
    form: 'flex flex-col gap-4',
    layout: 'stack' as const,
    label: 'font-poppins text-[12px] font-semibold text-body mb-1.5 block tracking-[0.2px]',
    field: '',
    input:
      'w-full font-poppins text-[15px] text-dark bg-white border border-black/[0.12] rounded-xl px-4 py-3.5 outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-black/10 transition placeholder:text-faint',
    radioRow: 'font-poppins text-[15px] text-body',
    button:
      'mt-1 w-full bg-[#1A1A1A] text-white font-poppins font-bold text-[15px] py-4 rounded-pill hover:bg-dark transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2',
    footer: 'font-poppins text-[12px] text-faint text-center leading-relaxed',
    success: 'text-center py-12 px-6',
    successHeading: 'font-sora font-bold text-[24px] text-dark mb-2',
    successBody: 'font-poppins text-[15px] text-muted max-w-sm mx-auto',
    tick: '#1A1A1A',
    tickBg: 'bg-[#ECECEC]',
  },
}

const INPUT_TYPE: Partial<Record<LeadFormField, string>> = {
  email: 'email',
  phone: 'tel',
}

const AUTOCOMPLETE: Partial<Record<LeadFormField, string>> = {
  name: 'name',
  email: 'email',
  phone: 'tel',
  restaurant: 'organization',
}

export default function LeadForm({
  config = websiteLeadForm,
  compact = false,
  lang = 'en',
}: {
  config?: LeadFormConfig
  compact?: boolean
  lang?: Lang
}) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sent = useRef(false)
  const started = useRef(false)

  // Captures fbclid / gclid / UTMs on mount so they survive navigation between
  // funnel pages before submit. Read back synchronously at submit time.
  useTrackingParams()

  const v = VARIANTS[config.variant]
  const isTh = Boolean(config.i18n) && lang === 'th'
  const t = th.leadForm
  const relayGated = config.gate === 'relay'
  const netlifyFormName = config.netlifyFormName ?? config.formName

  function getCookie(name: string): string | undefined {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
    return match ? decodeURIComponent(match[1]) : undefined
  }

  function onFirstInput() {
    if (!config.formStartEvent || started.current) return
    started.current = true
    ;(window as any).dataLayer?.push({ event: config.formStartEvent })
  }

  const visibleFields = config.fields.filter(
    f => !(compact && config.compactHides?.includes(f)),
  )
  const isRequired = (f: LeadFormField) => Boolean(config.required?.includes(f))

  function labelFor(f: LeadFormField): string {
    if (isTh) {
      const thai: Partial<Record<LeadFormField, string>> = {
        name: t.nameLabel,
        phone: t.phoneLabel,
        email: t.emailLabel,
        restaurant: t.restaurantLabel,
        grab_revenue: t.grabRevenueLabel,
        grab_ads: t.grabAdsLabel,
        service: t.serviceLabel,
        timeline: t.timelineLabel,
      }
      const label = thai[f]
      if (label) return label
    }
    return config.labels?.[f] ?? f
  }

  function placeholderFor(f: LeadFormField): string | undefined {
    if (isTh) {
      if (f === 'name') return t.namePlaceholder
      if (f === 'restaurant') return t.restaurantPlaceholder
    }
    return config.placeholders?.[f]
  }

  function optionsFor(f: LeadFormField): LeadFormOption[] {
    if (f === 'service') return isTh ? t.services : (config.serviceOptions ?? [])
    if (f === 'timeline') return isTh ? t.timelineOptions : TIMELINE_OPTIONS
    if (f === 'grab_revenue') return isTh ? t.grabRevenueOptions : GRAB_REVENUE_OPTIONS
    if (f === 'grab_ads') {
      return [
        { value: 'yes', label: isTh ? t.grabAdsYes : 'Yes' },
        { value: 'no', label: isTh ? t.grabAdsNo : 'No' },
      ]
    }
    return []
  }

  function buildPayload(data: FormData) {
    const get = (k: string) => String(data.get(k) ?? '').trim()

    const page_type =
      config.pageType === 'auto'
        ? (PAGE_TYPE_BY_PATH[window.location.pathname.replace(/\/$/, '')] ?? 'other')
        : config.pageType

    // LINE / WhatsApp has no persisted column of its own, so it rides in
    // `message` rather than being dropped downstream.
    const handle = get('line_whatsapp')
    const message = handle ? `LINE / WhatsApp: ${handle}` : get('message')

    const fbp = getCookie('_fbp')
    const fbc = getCookie('_fbc')

    return {
      name: get('name'),
      email: get('email'),
      phone: get('phone'),
      restaurant: get('restaurant'),
      grab_revenue: get('grab_revenue'),
      grab_ads: get('grab_ads'),
      service: config.serviceValue ?? get('service'),
      timeline: get('timeline'),
      message,
      page_path: window.location.pathname,
      page_url: window.location.href,
      page_type,
      lead_type: config.leadType,
      form_name: config.formName,
      submitted_at: new Date().toISOString(),
      source: config.source,
      site: 'rampupth',
      ...(config.i18n ? { language: lang } : {}),
      ...readTrackingParams(),
      ...(fbp ? { fbp } : {}),
      ...(fbc ? { fbc } : {}),
    }
  }

  function fireConversionEvents(event_id: string) {
    const dl = (window as any).dataLayer
    dl?.push({ event: 'lead_form_submit', event_id })
    for (const name of config.extraSubmitEvents ?? []) {
      dl?.push({ event: name, event_id, form_name: config.formName })
    }
    // Shared event_id keeps the pixel and the server-side CAPI event
    // deduplicated. Changing how it is generated breaks dedup.
    ;(window as any).fbq?.('track', 'Lead', {}, { eventID: event_id })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sent.current) return
    setError(null)
    setLoading(true)

    const data = new FormData(e.currentTarget)
    const event_id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    const netlifyBody = new URLSearchParams(data as unknown as Record<string, string>).toString()
    const netlifyAction = config.netlifyAction ?? window.location.pathname

    const payload = {
      ...buildPayload(data),
      event_id,
      turnstile_token: data.get('cf-turnstile-response') ?? '',
    }

    if (relayGated) {
      // Netlify is a best-effort backup here, deliberately not awaited — an
      // unregistered form can never cost the lead. The relay is the truth.
      fetch(netlifyAction, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: netlifyBody,
      }).catch(() => {})

      sent.current = true
      const relay = await postLead(payload)
      setLoading(false)

      if (!relay.ok) {
        // Re-open for a retry. Conversion events are deliberately NOT fired on
        // a failed attempt — a retry mints a fresh event_id, so firing here too
        // would double-count the Lead in Meta and GA4.
        sent.current = false
        setError(ERROR_MESSAGE)
        return
      }

      fireConversionEvents(event_id)
      setSubmitted(true)
      return
    }

    // Netlify-gated: Netlify holds the lead, so it gates everything after it.
    try {
      const netlifyRes = await fetch(netlifyAction, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: netlifyBody,
      })

      if (!netlifyRes.ok) {
        // The lead is genuinely gone. Never show a success screen.
        console.error('[Lead] Netlify form submit failed', netlifyRes.status)
        setError(ERROR_MESSAGE)
        return
      }

      sent.current = true
      fireConversionEvents(event_id)

      // The lead is already captured, so a relay failure costs the Sheet row
      // and the notification emails, not the lead. postLead() logs it and
      // pushes lead_relay_failed to dataLayer.
      void postLead(payload)

      setSubmitted(true)
    } catch (err) {
      console.error('[Lead] submit failed', err)
      setError(ERROR_MESSAGE)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className={v.success} role="status" aria-live="polite">
        <div
          className={`w-14 h-14 ${v.tickBg} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path
              d="M6 14l6 6 10-10"
              stroke={v.tick}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className={v.successHeading}>
          {isTh ? t.successHeading : config.copy.successHeading}
        </h3>
        <p className={v.successBody}>{isTh ? t.successBody : config.copy.successBody}</p>
      </div>
    )
  }

  function renderField(f: LeadFormField) {
    const required = isRequired(f)
    const id = `lf-${config.formName}-${f}`
    const mark =
      config.showRequiredMarks && required ? <span className="text-green"> *</span> : null
    const label = (
      <label className={v.label} htmlFor={id}>
        {labelFor(f)}
        {mark}
      </label>
    )

    if (f === 'grab_revenue') {
      return (
        <div key={f} className={v.field}>
          {label}
          <select id={id} name={f} required={required} className={`${v.input} cursor-pointer`}>
            <option value="">{isTh ? t.grabRevenueDefault : 'Select range…'}</option>
            {optionsFor(f).map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )
    }

    if (f === 'grab_ads' || f === 'service' || f === 'timeline') {
      const inline = f === 'grab_ads'
      return (
        <div key={f} className={v.field || 'flex flex-col gap-2'}>
          {label}
          <div className={inline ? 'flex gap-6' : 'flex flex-col gap-2'}>
            {optionsFor(f).map(o => (
              <label key={o.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name={f}
                  value={o.value}
                  required={required}
                  className="accent-green w-4 h-4"
                />
                <span className={v.radioRow}>{o.label}</span>
              </label>
            ))}
          </div>
        </div>
      )
    }

    if (f === 'message') {
      return (
        <div key={f} className={v.field}>
          {label}
          <textarea
            id={id}
            name={f}
            required={required}
            rows={3}
            placeholder={placeholderFor(f)}
            className={v.input}
          />
        </div>
      )
    }

    return (
      <div key={f} className={v.field}>
        {label}
        <input
          id={id}
          name={f}
          type={INPUT_TYPE[f] ?? 'text'}
          required={required}
          autoComplete={AUTOCOMPLETE[f]}
          {...(f === 'phone' ? { inputMode: 'tel' as const } : {})}
          placeholder={placeholderFor(f)}
          className={v.input}
        />
      </div>
    )
  }

  // The panel variant pairs fields into a two-column grid; a trailing odd field
  // spans full width rather than sitting in a half-width column.
  function renderFields() {
    if (v.layout === 'stack') return visibleFields.map(renderField)

    const rows: LeadFormField[][] = []
    for (let i = 0; i < visibleFields.length; i += 2) {
      rows.push(visibleFields.slice(i, i + 2))
    }
    return rows.map((row, i) =>
      row.length === 2 ? (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {row.map(renderField)}
        </div>
      ) : (
        renderField(row[0])
      ),
    )
  }

  const footer =
    config.copy.footer === 'price'
      ? `฿${formatTHB(restaurantRampUp.price)} baht / per month`
      : config.copy.footer === 'price-sentence'
        ? `Full-service packages from ฿${formatTHB(restaurantRampUp.price)}/month. We reply within one business day.`
        : config.copy.footer

  return (
    <form
      name={netlifyFormName}
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      {...(config.formStartEvent ? { onInput: onFirstInput } : {})}
      className={v.form}
    >
      <input type="hidden" name="form-name" value={netlifyFormName} />
      <input type="hidden" name="source" value={config.source} />
      {config.i18n && <input type="hidden" name="language" value={lang} />}
      <p hidden>
        <label>
          Leave this empty
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      {renderFields()}

      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <>
          <div
            className="cf-turnstile"
            data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            data-theme="light"
          />
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="lazyOnload"
          />
        </>
      )}

      {error && (
        <p role="alert" className="font-poppins text-sm text-red-600 text-center">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className={v.button}>
        {loading
          ? isTh
            ? t.submitting
            : config.copy.submitting
          : isTh
            ? t.submitButton
            : config.copy.submit}
      </button>

      {footer && <p className={v.footer}>{footer}</p>}
    </form>
  )
}
