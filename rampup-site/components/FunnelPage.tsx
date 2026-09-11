import { getClientBySlugUnfiltered } from '@/lib/clients'
import { notFound } from 'next/navigation'
import LeadForm from '@/components/LeadForm'
import { lpLeadForm } from '@/lib/lead-forms'
import MonthlyPlanCarousel from '@/components/MonthlyPlanCarousel'
import LazyVideoCard from '@/components/LazyVideoCard'
import { restaurantRampUp, formatTHB } from '@/lib/pricing'
import type { FunnelPageConfig } from '@/lib/funnel-pages'

/**
 * The concept funnel page, shared by every /lp route.
 *
 * Everything that differs between pages lives in lib/funnel-pages.ts. This file
 * held nothing but Okasan before; keeping seven copies of it was how the seven
 * LeadForm files got out of sync, so there is one copy and one config list.
 *
 * Sections hide themselves when their data is missing, so a client with no
 * videos, no feed design or no figures still renders a coherent page.
 */

const inclusions = [
  '7 Reels / 11 Photos',
  '4–5 posts per week',
  '2 Dine-in Ad Campaigns',
  'Content Management for Instagram, Facebook, TikTok',
  'Ad Management',
  'Google Map Ads',
  '10–15 Menu photos',
]

const resultCards = [
  { before: '฿665K', after: '฿1.25M', timeframe: '2 months', growth: '1.9x growth', monthly: '+฿295K / month', beforeImg: '/results/proof-1-after.jpg',  afterImg: '/results/proof-1-before.jpg' },
  { before: '฿300K', after: '฿628K',  timeframe: '2 months', growth: '2.1x growth', monthly: '+฿328K / month', beforeImg: '/results/proof-2-before.jpg', afterImg: '/results/proof-2-after.jpg' },
  { before: '฿127K', after: '฿249K',  timeframe: '4 months', growth: '2x growth',   monthly: '+฿122K / month', beforeImg: '/results/proof-3-before.jpg', afterImg: '/results/proof-3-after.jpg' },
  { before: '฿431K', after: '฿814K',  timeframe: '5 months', growth: '1.9x growth', monthly: '+฿383K / month', beforeImg: '/results/proof-4-before.jpg', afterImg: '/results/proof-4-after.jpg' },
]

export default function FunnelPage({ config }: { config: FunnelPageConfig }) {
  // Unfiltered: a funnel page is often built before the client is shot, and
  // renders placeholders until the media lands.
  const client = getClientBySlugUnfiltered(config.clientSlug)
  if (!client) notFound()

  const customerCode = process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE ?? ''

  const hasVideos      = client.videos      && client.videos.length > 0
  const hasFeedDesign  = !!client.feed_design
  const hasMonthlyPlan = client.monthly_plan && client.monthly_plan.length > 0

  const specialUrls = new Set([
    ...(client.feed_design ? [client.feed_design] : []),
    ...(client.monthly_plan ?? []),
  ])
  const normalPhotos = (client.photos ?? []).filter(p => !specialUrls.has(p))
  const hasPhotos = normalPhotos.length > 0

  // Every CTA is black. The exception is the one sitting inside the black
  // Grab-sales section, which inverts to white so it stays visible.
  // Grab is delivery. The dine-in-only concepts - high end, chef driven - do
  // not sell on it, so the logo, the revenue-proof section and the heading
  // that names it all come out rather than sitting there contradicting the page.
  const showGrab = config.showGrab !== false

  const ctaOnLight = 'bg-[#1A1A1A] text-white'
  const ctaOnDark  = 'bg-white text-[#1A1A1A]'

  const leadForm = lpLeadForm(config.clientSlug, config.restaurantPlaceholder)
  // Shorter than a full enquiry form on purpose: this sits above the fold on
  // paid traffic, where each extra field costs completions. Grab revenue, Grab
  // ads and service selection are qualification questions for the call.
  const heroForm = {
    ...leadForm,
    fields: ['name', 'email', 'phone', 'restaurant', 'timeline'] as typeof leadForm.fields,
    required: ['name', 'email', 'phone', 'restaurant'] as typeof leadForm.required,
    // 'dark' renders a black submit button, matching the CTAs.
    variant: 'dark' as typeof leadForm.variant,
    copy: { ...leadForm.copy, submit: 'Apply Now' },
  }

  return (
    <main className="min-h-[100dvh] bg-[#EDEDED]">

      {/* ── NAV ── */}
      <div className="hidden md:block max-w-site mx-auto px-5 md:px-12 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-rampup-accent.svg" alt="RampUp" width={73} height={60} className="h-6 md:h-[31px] w-auto" />
      </div>

      {/* ── 1. HERO ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 pt-7 pb-6 md:pt-16 md:pb-8">
        <h1 className="font-sora font-extrabold text-[clamp(1.3rem,7.28vw,3.4rem)] leading-[1.15] tracking-[-0.02em] text-dark mb-4 text-center">
          Get More Customers<br />For Your {config.concept}
        </h1>
        <p className="font-poppins text-base md:text-xl text-muted leading-relaxed max-w-xl mx-auto mb-7 text-center [text-wrap:balance]">
          We create content, run ads, and manage social media for{' '}
          {config.conceptPlural} in Thailand.
        </p>
        <div className="mb-8">
          <div className="flex items-center justify-center gap-5 sm:gap-7">
            {[
              { label: 'Instagram', src: '/logo-ig.svg' },
              { label: 'Facebook',  src: '/logo-fb.svg' },
              { label: 'TikTok',    src: '/logo-tiktok.svg' },
              ...(showGrab ? [{ label: 'Grab', src: '/logo-grab.svg' }] : []),
              { label: 'Google',    src: '/logo-google.svg' },
            ].map(({ label, src }) => (
              // alt carries the platform name now that the visible caption is
              // gone, so the row still reads to a screen reader.
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={label}
                src={src}
                alt={label}
                className="w-9 h-9 md:w-[47px] md:h-[47px] object-contain"
              />
            ))}
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <LeadForm config={heroForm} />
        </div>
      </section>

      {/* ── 1b. PROOF ── the client's own photos, padded if they have under four */}
      <section className="max-w-site mx-auto px-5 md:px-12 pb-10 pt-2">
        <div className="grid grid-cols-2 gap-4 md:gap-5 max-w-2xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => {
            const photo = normalPhotos[i]
            return photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo}
                src={photo}
                alt={`${client.name} ${i + 1}`}
                loading="lazy"
                className="aspect-square w-full rounded-[8px] object-cover"
              />
            ) : (
              <div key={`ph-${i}`} className="aspect-square w-full rounded-[8px] bg-black/[0.08]" />
            )
          })}
        </div>
      </section>

      {/* ── 2. HOW WE MARKET ── heading, two reels and the social posts, one section */}
      <section className="max-w-site mx-auto px-5 md:px-12 pt-2 pb-10">
        <h2 className="font-sora font-extrabold text-[clamp(1.5rem,6vw,2.6rem)] leading-[1.15] tracking-tight text-dark text-center">
          {/* Title case here, unlike the sentence-case plural used in body copy. */}
          See How We Market {config.concept}s
        </h2>
        <p className="font-poppins text-base md:text-lg text-muted mt-3 mb-8 text-center">
          Inside our work with {client.name}
        </p>

        {/* One reel per row. These are 9:16, so the column is capped narrower
            than the square post screenshots below - at full width a portrait
            reel would run past 900px tall on desktop. */}
        {hasVideos && (
          <div className="flex flex-col gap-6 max-w-sm mx-auto mb-6">
            {client.videos!.slice(0, 2).map((id, i) => (
              <LazyVideoCard
                key={id}
                videoId={id}
                customerCode={customerCode}
                label={`Reel ${i + 1}`}
                sizes="(max-width: 768px) 100vw, 384px"
              />
            ))}
          </div>
        )}

        {/* One per row and full width: at half-width the post chrome and food
            were too small to read, which defeated the point of showing them.
            Served from /public rather than Cloudflare Images because they are
            page furniture, not client gallery assets. */}
        <div className="flex flex-col gap-6 max-w-lg mx-auto">
          {(config.socialPosts ?? []).map(({ src, caption }) => (
            <div key={src} className="flex flex-col gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={caption}
                loading="lazy"
                className="aspect-square w-full rounded-[8px] object-cover"
              />
              <p className="font-poppins text-[0.9rem] text-faint text-center leading-snug">
                {caption}
              </p>
            </div>
          ))}
        </div>

        {/* Portrait screenshot at its natural 1080x1942, so no object-cover
            crop. Capped like the reels rather than the square posts. */}
        {config.mapsImage && (
        <div className="flex flex-col gap-2 max-w-sm mx-auto mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.mapsImage.src}
            alt={config.mapsImage.caption}
            width={config.mapsImage.width}
            height={config.mapsImage.height}
            loading="lazy"
            className="w-full h-auto rounded-[8px]"
          />
          <p className="font-poppins text-[0.9rem] text-faint text-center leading-snug">
            {config.mapsImage.caption}
          </p>
        </div>
        )}

        {/* Anchors to the footer form rather than repeating a third form. */}
        <div className="text-center mt-9">
          <a
            href="#apply"
            className={`inline-block ${ctaOnLight} font-poppins font-bold text-base px-10 py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] uppercase tracking-wide`}
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* ── 3c. THE NUMBERS ── omitted when a client has no figures yet */}
      {config.numbers && config.numbers.length > 0 && (
      <section className="bg-black py-12">
        <div className="max-w-site mx-auto px-5 md:px-12 text-center">
          <p className="font-poppins text-xs font-semibold tracking-[0.2em] text-white/40 uppercase mb-2">
            Results
          </p>
          <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-white tracking-tight mb-8">
            The Numbers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 max-w-3xl mx-auto">
            {config.numbers.map(({ value, label }) => (
              <div key={label}>
                <p className="font-sora font-extrabold text-[clamp(2.2rem,9vw,3.2rem)] leading-none text-white">
                  {value}
                </p>
                <p className="font-poppins text-sm text-white/60 mt-2 leading-snug">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── 4. FEED DESIGN ── mobile only */}
      {hasFeedDesign && (
        <section className="md:hidden max-w-site mx-auto px-5 py-10">
          <h2 className="font-sora font-extrabold text-2xl text-dark tracking-tight mb-2 text-center">
            Feed Design
          </h2>
          <p className="font-poppins text-base text-muted text-center mb-5">
            We design your entire social media feed
          </p>
          <div className="rounded-2xl overflow-hidden bg-[#E0E0E0]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={client.feed_design} alt="Feed Design" width={432} height={768} className="w-full h-auto" loading="lazy" />
          </div>
        </section>
      )}

      {/* ── 4b. PHOTOS ── mobile only */}
      {hasPhotos && (
        <section className="md:hidden max-w-site mx-auto px-5 py-10">
          <h2 className="font-sora font-extrabold text-2xl text-dark tracking-tight mb-2 text-center">
            Photos
          </h2>
          <p className="font-poppins text-base text-muted text-center mb-5">
            We create beautiful content that reflects your brand
          </p>
          <div className="grid grid-cols-2 gap-3">
            {normalPhotos.map((photo, i) => (
              <div key={i} className="rounded-2xl overflow-hidden aspect-square bg-[#E0E0E0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt={`${client.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 4c. FEED DESIGN + PHOTOS ── desktop only */}
      {(hasFeedDesign || hasPhotos) && (
        <section className="hidden md:block max-w-site mx-auto px-12 py-10">
          <style>{`
            @keyframes rampup-marquee {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .rampup-marquee { animation: rampup-marquee 18s linear infinite; }
            .rampup-marquee:hover { animation-play-state: paused; }
          `}</style>

          <h2 className="font-sora font-extrabold text-2xl text-dark tracking-tight mb-2 text-center">
            Feed Design &amp; Photos
          </h2>
          <p className="font-poppins text-base text-muted mb-8 text-center">
            We design your feed and create content that reflects your brand
          </p>

          {/* Feed design — centered */}
          {hasFeedDesign && (
            <div className="flex justify-center mb-8">
              <div className="rounded-2xl overflow-hidden bg-[#E0E0E0] w-72">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={client.feed_design} alt="Feed Design" width={432} height={768} className="w-full h-auto" loading="lazy" />
              </div>
            </div>
          )}

          {/* Photos — auto-scrolling marquee row */}
          {hasPhotos && (
            <div className="relative overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10" style={{ background: 'linear-gradient(to right, #EDEDED 0%, transparent 100%)' }} />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10" style={{ background: 'linear-gradient(to left, #EDEDED 0%, transparent 100%)' }} />
              <div className="rampup-marquee flex gap-4" style={{ width: 'max-content' }}>
                {[...normalPhotos, ...normalPhotos].map((photo, i) => (
                  <div key={i} className="shrink-0 w-52 h-52 rounded-2xl overflow-hidden bg-[#E0E0E0]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt={`${client.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── 5. MONTHLY PLAN ── */}
      {hasMonthlyPlan && (
        <section className="max-w-site mx-auto px-5 md:px-12 py-10">
          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-2 text-center">
            Monthly Plan
          </h2>
          <p className="font-poppins text-lg text-muted text-center mb-8">
            A full month of content, planned and executed
          </p>
          <MonthlyPlanCarousel photos={client.monthly_plan!} clientName={client.name} />
          <div className="text-center mt-8">
            <a
              href="#apply"
              className={`inline-block ${ctaOnLight} font-poppins font-bold text-base px-10 py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] uppercase tracking-wide`}
            >
              Apply Now
            </a>
            <p className="font-poppins text-sm text-muted italic mt-3">฿{formatTHB(restaurantRampUp.price)} / month</p>
          </div>
        </section>
      )}

      {/* ── 7. RESULTS ── Grab revenue proof, irrelevant to dine-in-only concepts */}
      {showGrab && (
      <section className="bg-black py-10">
        <div className="max-w-site mx-auto px-5 md:px-12">
          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-2 text-center">
            Grow Your Grab Sales
          </h2>
          <p className="font-poppins text-lg text-white/50 text-center mb-3">
            Actual revenue growth from restaurants we work with
          </p>
          <div
            className="flex gap-5 md:grid md:grid-cols-2 md:gap-5"
            style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {resultCards.map((card) => (
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
                        <img src={src} alt={label} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-top" />
                      )}
                      <div className="absolute inset-x-0 top-0 h-[20%] z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, transparent 100%)' }} />
                      <div className="absolute inset-x-0 bottom-0 h-[20%] z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.85) 0%, transparent 100%)' }} />
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

          {/* Inverted: a black button on a black section would disappear. */}
          <div className="text-center mt-9">
            <a
              href="#apply"
              className={`inline-block ${ctaOnDark} font-poppins font-bold text-base px-10 py-4 rounded-pill hover:brightness-95 transition-all active:scale-[0.98] uppercase tracking-wide`}
            >
              Apply Now
            </a>
          </div>
        </div>
      </section>
      )}

      {/* ── 8. INCLUSIONS ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-10">
        <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-2 text-center">
          {showGrab ? 'Grab and Dine-in' : 'Fill Your Dining Room'}
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
              ฿{formatTHB(restaurantRampUp.price)} <span className="font-poppins font-normal text-base text-muted">per month</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── APPLY FORM ── */}
      <section id="apply" className="max-w-site mx-auto px-5 md:px-12 py-10">
        <h2 className="font-sora font-bold text-2xl text-dark mb-6 text-center">
          Enter Your Info Below To Apply
        </h2>
        <div className="max-w-lg mx-auto bg-white rounded-[24px] shadow-[0_4px_32px_rgba(0,0,0,0.07)] p-7 md:p-10">
          <LeadForm config={heroForm} />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white py-6 text-center border-t border-black/[0.06]">
        <p className="font-poppins text-sm text-muted">© 2025 Restaurant Ramp Up. All Rights Reserved.</p>
      </footer>

    </main>
  )
}
