import { getClientBySlug } from '@/lib/clients'
import { notFound } from 'next/navigation'
import LeadForm from './LeadForm'
import MonthlyPlanCarousel from '@/components/MonthlyPlanCarousel'
import FunnelVideoSection from '@/components/FunnelVideoSection'

const inclusions = [
  '7 Reels / 11 Photos',
  '4–5 posts per week',
  '2 Dine-in Ad Campaigns',
  'Content Management for Instagram, Facebook, TikTok',
  'Ad Management',
  '10–15 Menu photos',
]

const resultCards = [
  { before: '฿665K', after: '฿1.25M', timeframe: '2 months', growth: '1.9x growth', monthly: '+฿295K / month', beforeImg: '/results/proof-1-after.jpg',  afterImg: '/results/proof-1-before.jpg' },
  { before: '฿300K', after: '฿628K',  timeframe: '2 months', growth: '2.1x growth', monthly: '+฿328K / month', beforeImg: '/results/proof-2-before.jpg', afterImg: '/results/proof-2-after.jpg' },
  { before: '฿127K', after: '฿249K',  timeframe: '4 months', growth: '2x growth',   monthly: '+฿122K / month', beforeImg: '/results/proof-3-before.jpg', afterImg: '/results/proof-3-after.jpg' },
  { before: '฿431K', after: '฿814K',  timeframe: '5 months', growth: '1.9x growth', monthly: '+฿383K / month', beforeImg: '/results/proof-4-before.jpg', afterImg: '/results/proof-4-after.jpg' },
]

export default function BacioFunnelPage() {
  const client = getClientBySlug('bacio')
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

  return (
    <main className="min-h-[100dvh] bg-[#EDEDED]">

      {/* ── NAV ── */}
      <div className="max-w-site mx-auto px-5 md:px-12 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-rampup-accent.svg" alt="RampUp" className="h-6 md:h-[31px] w-auto" />
      </div>

      {/* ── 1. HERO ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 pt-10 pb-6 md:pt-16 md:pb-8 text-center">
        <h1 className="font-sora font-extrabold text-[clamp(2rem,5vw,3.4rem)] leading-[1.08] tracking-tight text-dark mb-5">
          Increase Your<br />Dine-In and<br />Grab Sales
        </h1>
        <p className="font-poppins text-lg md:text-xl text-muted leading-relaxed max-w-xl mx-auto mb-8">
          We create content inside your restaurant and use it to increase Grab orders and walk-ins.
        </p>
        <a
          href="#apply"
          className="inline-block bg-[#3DBE5A] text-white font-poppins font-bold text-base px-10 py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] uppercase tracking-wide"
        >
          Apply Now
        </a>
        <p className="font-poppins text-sm text-muted italic mt-3">฿59,990 / month</p>
      </section>

      {/* ── 2. PLATFORMS ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 pt-4 pb-8">
        <p className="font-poppins text-sm italic text-muted text-center mb-4">
          We manage these platforms
        </p>
        <div className="grid grid-cols-3 gap-x-8 gap-y-5 justify-items-center max-w-xs mx-auto">
          {[
            { label: 'Instagram', src: '/logo-ig.svg' },
            { label: 'Facebook',  src: '/logo-fb.svg' },
            { label: 'TikTok',    src: '/logo-tiktok.svg' },
            { label: 'Grab',      src: '/logo-grab.svg' },
            { label: 'Lineman',   src: '/logo-lineman.svg' },
            { label: 'Google',    src: '/logo-google.svg' },
          ].map(({ label, src }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 md:w-[47px] md:h-[47px] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={label} className="w-full h-full object-contain" />
              </div>
              <span className="font-poppins text-[10px] font-medium text-muted">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. VIDEOS ── */}
      {hasVideos && (
        <section className="bg-black py-10">
          <div className="max-w-site mx-auto px-5 md:px-12">
            <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-2 text-center">
              We Film Videos That Elevate Your Brand
            </h2>
            <p className="font-poppins text-lg text-white/50 text-center mb-8">
              And Run Effective Ads To Increase Dine-In Sales
            </p>
            <FunnelVideoSection
              videoIds={client.videos!}
              customerCode={customerCode}
            />
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
            <img src={client.feed_design} alt="Feed Design" className="w-full h-auto" loading="lazy" />
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
                <img src={photo} alt={`Bacio ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
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

          {hasFeedDesign && (
            <div className="flex justify-center mb-8">
              <div className="rounded-2xl overflow-hidden bg-[#E0E0E0] w-72">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={client.feed_design} alt="Feed Design" className="w-full h-auto" loading="lazy" />
              </div>
            </div>
          )}

          {hasPhotos && (
            <div className="relative overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10" style={{ background: 'linear-gradient(to right, #EDEDED 0%, transparent 100%)' }} />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10" style={{ background: 'linear-gradient(to left, #EDEDED 0%, transparent 100%)' }} />
              <div className="rampup-marquee flex gap-4" style={{ width: 'max-content' }}>
                {[...normalPhotos, ...normalPhotos].map((photo, i) => (
                  <div key={i} className="shrink-0 w-52 h-52 rounded-2xl overflow-hidden bg-[#E0E0E0]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt={`Bacio ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
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
              className="inline-block bg-[#3DBE5A] text-white font-poppins font-bold text-base px-10 py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] uppercase tracking-wide"
            >
              Apply Now
            </a>
            <p className="font-poppins text-sm text-muted italic mt-3">฿59,990 / month</p>
          </div>
        </section>
      )}

      {/* ── 7. RESULTS ── */}
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
        </div>
      </section>

      {/* ── 8. INCLUSIONS ── */}
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
              ฿59,990 <span className="font-poppins font-normal text-base text-muted">per month</span>
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
          <LeadForm />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white py-6 text-center border-t border-black/[0.06]">
        <p className="font-poppins text-sm text-muted">© 2025 Restaurant Ramp Up. All Rights Reserved.</p>
      </footer>

    </main>
  )
}
