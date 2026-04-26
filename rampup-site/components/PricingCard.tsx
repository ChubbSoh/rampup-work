import Link from 'next/link'
import LeadForm from '@/components/LeadForm'
import { th, type Lang } from '@/lib/translations'

export default function PricingCard({
  contextNote,
  hideCta,
  stacked,
  formHeading,
  formSubtext,
  lang = 'en',
}: {
  contextNote?: string
  hideCta?: boolean
  stacked?: boolean
  formHeading?: string
  formSubtext?: string
  lang?: Lang
}) {
  const isTh = lang === 'th'
  const t = th.pricing
  const base = isTh ? '/th' : ''

  const sectionTag     = isTh ? t.tag          : 'Pricing'
  const sectionHeading = isTh ? t.heading       : 'Simple pricing. Real results.'
  const planTag        = isTh ? t.planTag       : 'Social Media Growth'
  const perMonth       = isTh ? t.perMonth      : '/ month'
  const adNote         = isTh ? t.adNote        : 'Ad spend is not included.'
  const includedLabel  = isTh ? t.includedLabel : 'Included'
  const addonsHeading  = isTh ? t.addonsHeading : 'Add-ons to accelerate growth'
  const applyButton    = isTh ? t.applyButton   : 'Apply Now →'
  const resolvedFormHeading = formHeading ?? (isTh ? t.formHeading : 'Apply Today')
  const resolvedFormSubtext = formSubtext ?? (isTh ? t.formSubtext : "No commitment. We'll be in touch within 24 hours.")

  const items = isTh ? t.items : [
    '7 high-quality videos',
    '10 menu items shot & styled',
    '18 posts per month',
    'Instagram, Facebook & TikTok management',
    'Content strategy & planning',
    'Editing, posting & optimization',
  ]

  const addons = isTh ? t.addons : [
    { label: 'Grow your Grab sales',          price: '฿9,990 / month' },
    { label: 'Capture Lineman demand',         price: '฿4,990 / month' },
    { label: 'Get found on Google Maps',       price: '฿5,990 / month' },
    { label: 'Turn LINE into a sales channel', price: '฿3,990 / month' },
  ]

  const websiteLabel = isTh ? t.website.label : 'Website Design & Build'
  const websiteNote  = isTh ? t.website.note  : '(one-time)'

  return (
    <section className="max-w-site mx-auto px-5 md:px-12 pb-20">
      <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
        {sectionTag}
      </p>
      <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-8">
        {sectionHeading}
      </h2>

      {contextNote && (
        <p className="font-poppins text-xs text-muted/60 mb-5">{contextNote}</p>
      )}

      <div className={stacked ? 'flex flex-col gap-6 max-w-2xl mx-auto' : 'grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-5xl mx-auto'}>
        {/* Pricing card */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-7 md:p-10">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-2">
            {planTag}
          </p>
          <p className="font-sora font-extrabold text-4xl md:text-5xl text-dark mb-2">
            ฿49,990 <span className="font-poppins font-normal text-lg text-muted">{perMonth}</span>
          </p>
          <p className="font-poppins text-[11px] text-muted/50 mb-7">{adNote}</p>

          <p className="font-poppins text-xs font-semibold text-dark/50 uppercase tracking-[1.5px] mb-4">{includedLabel}</p>
          <ul className="flex flex-col gap-3 mb-7">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-[3px] w-4 h-4 rounded-full bg-[#E8F8ED] flex items-center justify-center shrink-0">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l2 2 3-3" stroke="#3DBE5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="font-poppins text-sm text-body">{item}</span>
              </li>
            ))}
          </ul>

          {/* Add-ons */}
          <div className="border-t border-black/[0.07] pt-6 mb-5">
            <p className="font-sora font-bold text-sm text-dark mb-4">{addonsHeading}</p>
            <div className="flex flex-col divide-y divide-black/[0.06]">
              {addons.map((a) => (
                <div key={a.label} className="flex items-center justify-between py-3">
                  <span className="font-poppins text-sm text-muted">{a.label}</span>
                  <span className="font-poppins text-sm font-semibold text-dark shrink-0 ml-4">{a.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-black/[0.06] flex items-center justify-between">
              <span className="font-poppins text-sm text-muted">{websiteLabel}</span>
              <span className="font-poppins text-sm font-semibold text-dark">฿79,990 <span className="font-normal text-muted text-xs">{websiteNote}</span></span>
            </div>
          </div>

          {!hideCta && (
            <Link
              href={`${base}/contact`}
              className="block w-full text-center bg-green text-white font-poppins font-semibold text-sm px-6 py-3.5 rounded-pill hover:brightness-105 transition-all active:scale-[0.98]"
            >
              {applyButton}
            </Link>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-7 md:p-10">
          <h3 className="font-sora font-bold text-lg text-dark mb-1">{resolvedFormHeading}</h3>
          <p className="font-poppins text-sm text-muted mb-6">{resolvedFormSubtext}</p>
          <LeadForm compact lang={lang} />
        </div>
      </div>
    </section>
  )
}
