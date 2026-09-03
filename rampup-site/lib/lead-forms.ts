/**
 * Configuration for the single shared <LeadForm />.
 *
 * Seven near-duplicate LeadForm.tsx files used to live under app/ and drift from
 * each other. Everything that actually differed between them is expressed here;
 * the behaviour itself lives only in components/LeadForm.tsx.
 *
 * Adding a field here is not enough on its own. It must also survive the
 * Normalize Fields node in n8n and be mapped in the Sheets node — see the "Lead
 * capture flow" section of CLAUDE.md.
 */

export type LeadFormField =
  | 'name'
  | 'email'
  | 'phone'
  | 'restaurant'
  | 'line_whatsapp'
  | 'grab_revenue'
  | 'grab_ads'
  | 'service'
  | 'timeline'
  | 'message'

export type LeadFormOption = { value: string; label: string }

/**
 * Grab monthly revenue bands. Standardised — an earlier variant on the website
 * form used 30k/100k/300k bands while every funnel used these, so the column
 * mixed two scales and could not be grouped. Changing these values again
 * fragments the history a second time; don't, without a migration.
 */
export const GRAB_REVENUE_OPTIONS: LeadFormOption[] = [
  { value: 'under_100k', label: 'Less than ฿100,000' },
  { value: '100k_300k', label: '฿100,000 – ฿300,000' },
  { value: '300k_600k', label: '฿300,000 – ฿600,000' },
  { value: '600k_plus', label: '฿600,000+' },
  { value: 'no_grab', label: 'Not on Grab yet' },
]

export const TIMELINE_OPTIONS: LeadFormOption[] = [
  { value: 'asap', label: 'ASAP' },
  { value: '1_month', label: 'Within 1 month' },
  { value: 'browsing', label: 'Just browsing' },
]

export type LeadFormConfig = {
  /** Routes the lead in n8n and in LINE. Website funnels are sales. */
  leadType: 'sales' | 'hiring'

  /** Goes out as `form_name` in the lead payload. */
  formName: string

  /**
   * The `name=` on the Netlify form. Defaults to formName. Kept separate
   * because the /lp/* pages post into the shared `lead` bucket while sending a
   * distinct form_name to n8n — changing either detaches historical
   * submissions from their Netlify form.
   */
  netlifyFormName?: string

  /** `page_type` in the payload. 'auto' derives it from the path lookup map. */
  pageType: string | 'auto'

  /** `source` in the payload. */
  source: string

  /** Rendered in this order. */
  fields: LeadFormField[]

  /** Subset of `fields` marked required. */
  required?: LeadFormField[]

  /** Hidden when the component is rendered with `compact`. */
  compactHides?: LeadFormField[]

  /**
   * 'netlify' (default) — post to Netlify first and only call the relay if it
   *   succeeded. Netlify is the source of truth, so a relay failure keeps the
   *   success screen: the lead is safe, only the Sheet row and emails are lost.
   * 'relay' — the Netlify post is fire-and-forget and the relay is the source
   *   of truth, so a relay failure shows an error and re-opens the form.
   */
  gate?: 'netlify' | 'relay'

  /** Netlify POST target. Defaults to the current pathname. */
  netlifyAction?: string

  /** Sent as `service` when 'service' is not a rendered field. */
  serviceValue?: string

  serviceOptions?: LeadFormOption[]

  /** Visual treatment. See VARIANTS in components/LeadForm.tsx. */
  variant: 'panel' | 'stacked' | 'dark'

  /** Show a green asterisk beside required labels. */
  showRequiredMarks?: boolean

  /** Use the Thai translations when `lang="th"`. Only the website form is bilingual. */
  i18n?: boolean

  /** Pushed to dataLayer the first time the visitor touches any field. */
  formStartEvent?: string

  /** Pushed alongside the standard `lead_form_submit` event on success. */
  extraSubmitEvents?: string[]

  labels?: Partial<Record<LeadFormField, string>>
  placeholders?: Partial<Record<LeadFormField, string>>

  copy: {
    submit: string
    submitting: string
    successHeading: string
    successBody: string
    /**
     * Small print under the button. The two `price*` tokens render from
     * lib/pricing rather than hardcoding a number into copy.
     */
    footer?: string | 'price' | 'price-sentence'
  }
}

const SERVICE_OPTIONS_GRAB_SALES: LeadFormOption[] = [
  { value: 'social', label: 'Social Media Management' },
  { value: 'both', label: 'Social Media Management + Grab Sales' },
]

/** Homepage, /th, /contact, and the pricing card. The only bilingual form. */
export const websiteLeadForm: LeadFormConfig = {
  leadType: 'sales',
  formName: 'lead',
  pageType: 'auto',
  source: 'website',
  fields: ['name', 'phone', 'email', 'restaurant', 'grab_revenue', 'grab_ads', 'service', 'timeline'],
  required: ['name', 'phone', 'email', 'restaurant', 'service'],
  compactHides: ['grab_revenue', 'grab_ads', 'timeline'],
  variant: 'panel',
  showRequiredMarks: true,
  i18n: true,
  serviceOptions: [
    { value: 'social', label: 'Social Media Management' },
    { value: 'both', label: 'Social Media Management + Grab Growth' },
  ],
  labels: {
    name: 'Your Name',
    phone: 'Phone',
    email: 'Email',
    restaurant: 'Restaurant Name',
    grab_revenue: 'Grab Monthly Revenue (฿)',
    grab_ads: 'Running Grab Ads?',
    service: "I'm interested in",
    timeline: 'When to get started?',
  },
  placeholders: {
    name: 'Khun Somchai',
    phone: '08X-XXX-XXXX',
    email: 'you@restaurant.com',
    restaurant: 'e.g. Okasan Izakaya',
  },
  copy: {
    submit: 'Apply Today →',
    submitting: 'Sending...',
    successHeading: "We'll be in touch!",
    successBody: 'Our team will review your restaurant and reach out within 24 hours.',
    footer: 'No commitment. We’ll contact you within 24 hours.',
  },
}

const funnelLabels: LeadFormConfig['labels'] = {
  name: 'Your Name',
  email: 'Email',
  phone: 'Phone',
  restaurant: 'Restaurant Name',
  grab_revenue: 'How much do you make per month on Grab?',
  grab_ads: 'Are you running Grab Ads?',
  service: 'Which service are you interested in?',
  timeline: 'When do you plan to get started?',
}

const funnelPlaceholders = (restaurant: string): LeadFormConfig['placeholders'] => ({
  name: 'John Doe',
  email: 'you@restaurant.com',
  phone: '08X-XXX-XXXX',
  restaurant,
})

/** /funnel/restaurant-marketing */
export const restaurantMarketingFunnelForm: LeadFormConfig = {
  leadType: 'sales',
  formName: 'restaurant_marketing_funnel',
  pageType: 'funnel-restaurant-marketing',
  source: 'restaurant_marketing',
  fields: ['name', 'email', 'phone', 'restaurant', 'grab_revenue', 'grab_ads', 'service', 'timeline'],
  required: ['name', 'email', 'phone', 'restaurant', 'service'],
  variant: 'stacked',
  showRequiredMarks: true,
  serviceOptions: SERVICE_OPTIONS_GRAB_SALES,
  labels: funnelLabels,
  placeholders: funnelPlaceholders('e.g. Bacio'),
  copy: {
    submit: 'Apply Now',
    submitting: 'Sending…',
    successHeading: "We'll be in touch!",
    successBody: 'Our team will review your restaurant and reach out within 24 hours.',
    footer: 'price',
  },
}

/**
 * /lp/{slug} — Meta ad landing pages. Identical apart from page_type and the
 * restaurant placeholder. They post into the shared `lead` Netlify bucket while
 * sending their own page_type, which is how the funnels stay distinguishable
 * downstream.
 */
export function lpLeadForm(slug: string, restaurantPlaceholder: string): LeadFormConfig {
  return {
    leadType: 'sales',
    formName: 'lead',
    pageType: `funnel-${slug}`,
    source: 'meta-ad',
    fields: ['name', 'email', 'phone', 'restaurant', 'grab_revenue', 'grab_ads', 'service', 'timeline'],
    required: ['name', 'email', 'phone', 'restaurant', 'service'],
    variant: 'stacked',
    showRequiredMarks: true,
    serviceOptions: SERVICE_OPTIONS_GRAB_SALES,
    labels: funnelLabels,
    placeholders: funnelPlaceholders(restaurantPlaceholder),
    copy: {
      submit: 'Get Started Now!',
      submitting: 'Sending…',
      successHeading: "We'll be in touch!",
      successBody: 'Our team will review your restaurant and reach out within 24 hours.',
      footer: 'price',
    },
  }
}

/** /grab-offer — phone/LINE only, no email collected by design. */
export const grabOfferForm: LeadFormConfig = {
  leadType: 'sales',
  formName: 'grab_offer_funnel',
  pageType: 'funnel-grab-offer',
  source: 'grab_offer',
  fields: ['name', 'restaurant', 'grab_revenue', 'phone'],
  required: ['name', 'restaurant', 'phone'],
  variant: 'stacked',
  showRequiredMarks: true,
  serviceValue: 'grab_offer',
  labels: {
    name: 'Your Name',
    restaurant: 'Restaurant Name',
    grab_revenue: 'Current Grab monthly sales (rough)',
    phone: 'Phone / LINE',
  },
  placeholders: {
    name: 'John Doe',
    restaurant: 'e.g. Bacio',
    phone: '08X-XXX-XXXX or LINE ID',
  },
  copy: {
    submit: 'Apply for my free Grab audit',
    submitting: 'Sending…',
    successHeading: 'Application received',
    successBody: "We'll review your Grab store and reach out within 24 hours.",
    footer: "Free audit. No obligation. We'll tell you honestly if it's worth it.",
  },
}

/**
 * /restaurant-marketing — cold Google Ads traffic.
 *
 * The only relay-gated form. Its Netlify post goes to `/` and is deliberately
 * not awaited, so an unregistered form can never cost the lead; the relay is
 * the source of truth instead. Email is not collected: /api/lead-relay and the
 * n8n validation both accept name plus phone alone, and Meta CAPI matches on
 * the hashed phone. LINE / WhatsApp has no persisted column of its own, so the
 * component folds it into `message`.
 */
export const restaurantMarketingLpForm: LeadFormConfig = {
  leadType: 'sales',
  formName: 'restaurant_marketing_lp',
  pageType: 'lp-restaurant-marketing',
  source: 'google_ads',
  fields: ['name', 'phone', 'line_whatsapp', 'restaurant'],
  required: ['name', 'phone', 'line_whatsapp', 'restaurant'],
  gate: 'relay',
  netlifyAction: '/',
  serviceValue: 'Full-service restaurant marketing',
  variant: 'dark',
  showRequiredMarks: false,
  formStartEvent: 'restaurant_lp_form_start',
  extraSubmitEvents: ['restaurant_marketing_lead'],
  labels: {
    name: 'Name',
    phone: 'Phone Number',
    line_whatsapp: 'LINE ID / WhatsApp',
    restaurant: 'Restaurant Name',
  },
  placeholders: {
    name: 'Your name',
    phone: '08X-XXX-XXXX',
    line_whatsapp: 'LINE ID or WhatsApp number',
    restaurant: 'Restaurant or brand name',
  },
  copy: {
    submit: 'Enquire Now',
    submitting: 'Sending…',
    successHeading: 'Thank you — we’ve got it.',
    successBody:
      'We’ll review your restaurant and come back within one business day with where we think your marketing can improve.',
    footer: 'price-sentence',
  },
}
