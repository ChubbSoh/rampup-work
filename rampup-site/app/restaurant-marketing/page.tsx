// Google Ads landing page — premium F&B lead generation.
//
// Server Component. Only the lead form and the CTA/sticky-bar helpers are
// client components, so almost nothing ships as JS.
//
// MEDIA POLICY: every image and video on this page is real RampUp client work
// pulled from data/clients.json. No stock photography, no placeholders.
// NUMBERS POLICY: the repo holds no verified campaign metrics — clients.json has
// no results fields and nothing else documents them — so this page carries no
// numerical performance claims. The proof sections are built to read well
// without them, and to accept real figures later without a redesign.

import LazyVideoCard from '@/components/LazyVideoCard'
import LeadForm from './LeadForm'
import { CtaLink, StickyCta } from './Cta'
import { getClientBySlug } from '@/lib/clients'
import { restaurantRampUp, formatTHB } from '@/lib/pricing'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Restaurant Marketing Agency Bangkok | Content, Meta & Google Ads | RampUp',
  description:
    'Full-service marketing for premium restaurants, chef-led concepts and hotel F&B. Content production, social media, Meta Ads and Google Ads from one team. Packages from ฿59,990/month.',
  // Paid-traffic landing page: keep it out of the organic index so it cannot
  // compete with /social-media or /grab-sales. Matches how a funnel page should
  // behave; the site sets no global robots directive, so this is page-scoped.
  robots: { index: false, follow: true },
}

const PRICE = `฿${formatTHB(restaurantRampUp.price)}`
const CUSTOMER_CODE = process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE ?? ''

// ── shared bits ──────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-poppins text-[11px] font-bold uppercase tracking-[2.5px] text-[#8A8A8A] mb-4">
      {children}
    </p>
  )
}

function Section({
  children, className = '', id,
}: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`px-5 md:px-12 py-20 md:py-28 ${className}`}>
      <div className="max-w-site mx-auto">{children}</div>
    </section>
  )
}

/** Fixed-ratio image box. Explicit ratio + dimensions prevent layout shift. */
function Shot({
  src, alt, ratio = 'aspect-[4/5]', priority = false, sizes, className = '',
}: {
  src: string; alt: string; ratio?: string; priority?: boolean; sizes?: string; className?: string
}) {
  return (
    <div className={`relative overflow-hidden bg-[#E4E4E4] ${ratio} ${className}`}>
      {/* next/image is bypassed project-wide (images.unoptimized), and Cloudflare
          Images already serves optimised bytes — so a plain img with explicit
          loading/decoding hints is both lighter and honest about what happens. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        // @ts-expect-error fetchPriority is valid HTML, React types lag
        fetchpriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  )
}

export default function RestaurantMarketingPage() {
  // Real client work. Toh Daeng is the fully-shot case study and carries the
  // proof rows; Okasan supplies the hero's second frame. getClientBySlug()
  // returns the sanitised public record, so no internal Drive IDs reach the browser.
  const tohDaeng = getClientBySlug('toh-d')
  const okasan = getClientBySlug('okasan')

  const heroImage = tohDaeng?.photos?.[0] ?? tohDaeng?.cover ?? ''
  const heroSide = okasan?.photos?.[1] ?? okasan?.cover ?? ''

  return (
    <>
      {/* Logo only — the top-right CTA is deliberately gone so the hero carries a
          single action. Height stays h-16 so the #plan scroll-mt-16 offset below
          is still correct. */}
      <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur border-b border-black/[0.06]">
        <div className="max-w-site mx-auto px-5 md:px-12 h-16 flex items-center">
          {/* /logo-rampup.svg is byte-identical to RampUp/RampUp_Dark.svg — the
              monochrome (#191919) mark. Served from public/ as an <img>, matching
              how Nav.tsx serves logos; RampUp/ is not a served directory. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-rampup.svg"
            alt="RampUp"
            width={73}
            height={60}
            className="h-8 md:h-9 w-auto object-contain"
          />
        </div>
      </header>

      <main className="bg-bg">
        {/* ══ 01 HERO ═══════════════════════════════════════════════════════ */}
        {/* Top padding is tightened (56/80 -> 40/56px) and the eyebrow removed so
            the headline, price and CTA all sit higher in the fold. */}
        <section id="hero" className="px-5 md:px-12 pt-10 md:pt-14 pb-16 md:pb-24">
          <div className="max-w-site mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
            <div>
              {/* Two sentences only. The longer H1 is stepped down slightly at each
                  breakpoint so it does not dominate the fold on small screens. */}
              <h1 className="font-sora font-extrabold text-[31px] leading-[1.1] sm:text-[42px] lg:text-[54px] text-dark tracking-[-0.02em]">
                Premium restaurant marketing built to turn attention into reservations.
              </h1>
              <p className="font-poppins text-[16px] md:text-[18px] text-body mt-6 leading-relaxed max-w-xl">
                One F&amp;B-specialist team for high-end content, social media, Meta Ads and
                Google Ads.
              </p>

              {/* Price sits above the single CTA so the qualification is read first. */}
              <p className="font-poppins text-[14px] text-muted mt-8">
                Packages from <span className="font-bold text-dark">{PRICE}/month</span>
              </p>

              <div className="mt-5">
                <CtaLink location="hero">Enquire Now</CtaLink>
              </div>
            </div>

            {/* Two-image editorial pair. The left image is the LCP element. */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {heroImage && (
                <Shot
                  src={heroImage}
                  alt="Thai fine dining plating photographed for Toh Daeng, a Michelin Guide restaurant in Bangkok"
                  ratio="aspect-[3/4]"
                  priority
                  sizes="(max-width: 1024px) 50vw, 320px"
                  className="rounded-[18px] translate-y-4 sm:translate-y-6"
                />
              )}
              {heroSide && (
                <Shot
                  src={heroSide}
                  alt="Restaurant atmosphere and service photographed on location in Bangkok"
                  ratio="aspect-[3/4]"
                  sizes="(max-width: 1024px) 50vw, 320px"
                  className="rounded-[18px] -translate-y-2 sm:-translate-y-4"
                />
              )}
            </div>
          </div>
        </section>

        {/* ══ 02 IMMEDIATE PROOF ════════════════════════════════════════════ */}
        <Section className="bg-white border-y border-black/[0.06]">
          <h2 className="font-sora font-extrabold text-[26px] md:text-[36px] text-dark tracking-tight max-w-3xl leading-[1.15]">
            Trusted by premium restaurants, chef-led concepts and hotel F&amp;B teams.
          </h2>

          {/* One full-width row per client, alternating text/media on desktop for
              rhythm. On mobile every row reads text-then-media, so the order never
              flips unpredictably. */}
          <div className="mt-14">
            {[
              {
                name: 'AELA',
                sub: 'Fairmont Bangkok',
                type: 'Luxury Hotel Bar',
                note: 'A destination bar inside a luxury hotel, positioned to be sought out on its own name.',
                media: null,
                flip: false,
              },
              {
                name: 'MAN TABLES',
                sub: 'Chef Man',
                type: 'Premium Chinese Fine Dining',
                note: 'Chef-led Chinese fine dining where private rooms and business dining carry the occasion.',
                media: null,
                flip: true,
              },
              {
                name: 'Toh Daeng',
                sub: 'Bangkok',
                type: 'Michelin Guide Restaurant',
                note: 'Michelin Guide recognition turned into everyday discovery through consistent production.',
                media: tohDaeng?.photos?.[0] ?? null,
                flip: false,
              },
            ].map((c) => (
              <article
                key={c.name}
                className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16 items-center py-12 lg:py-16 border-t border-black/10 first:border-t-0 first:pt-0"
              >
                <div className={c.flip ? 'lg:order-2' : ''}>
                  <p className="font-poppins text-[11px] font-bold uppercase tracking-[2px] text-[#8A8A8A]">{c.type}</p>
                  <h3 className="font-sora font-extrabold text-[28px] md:text-[38px] text-dark tracking-tight mt-2.5 leading-[1.08]">
                    {c.name}
                  </h3>
                  <p className="font-poppins text-[15px] text-body mt-1">{c.sub}</p>
                  <p className="font-poppins text-[15px] text-body mt-5 leading-relaxed max-w-md">{c.note}</p>
                </div>

                <div className={c.flip ? 'lg:order-1' : ''}>
                  {c.media ? (
                    <Shot
                      src={c.media}
                      alt={`Campaign photography produced for ${c.name} in Bangkok`}
                      ratio="aspect-[3/2]"
                      sizes="(max-width: 1024px) 100vw, 620px"
                      className="rounded-[16px]"
                    />
                  ) : (
                    /* No shot assets exist for this client yet. Rather than a stock
                       photo or a grey void, the panel becomes an editorial title
                       plate — deliberate on its own terms, and a real image drops
                       straight into the same 3:2 box when one is produced. */
                    <div className="relative aspect-[3/2] rounded-[16px] bg-[#F0F0F0] border border-black/[0.07] overflow-hidden">
                      <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-9">
                        <span className="font-sora font-extrabold text-[34px] md:text-[46px] leading-[0.95] text-[#D8D8D8] tracking-tight">
                          {c.name}
                        </span>
                        <span className="font-poppins text-[11px] font-bold uppercase tracking-[2px] text-[#B4B4B4] mt-3">
                          {c.sub}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* ══ 03 THE PROBLEM ════════════════════════════════════════════════ */}
        <Section>
          <h2 className="font-sora font-extrabold text-[30px] md:text-[44px] text-dark tracking-tight max-w-2xl leading-[1.1]">
            Great restaurants still need great marketing.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10 mt-14">
            {[
              ['Your content doesn&apos;t reflect the experience.', 'The restaurant looks premium in person, but generic online.'],
              ['There&apos;s no dedicated marketing team.', 'Operations come first, so marketing becomes inconsistent.'],
              ['Meta Ads are running without a clear strategy.', 'Boosting posts isn&apos;t the same as building campaigns designed to drive reservations.'],
              ['You&apos;re missing high-intent demand.', 'Guests searching Google and Maps for where to eat aren&apos;t being captured effectively.'],
            ].map(([h, p], i) => (
              <div key={i} className="border-t border-black/10 pt-6">
                <h3
                  className="font-sora font-bold text-[19px] md:text-[21px] text-dark leading-snug"
                  dangerouslySetInnerHTML={{ __html: h }}
                />
                <p
                  className="font-poppins text-[15px] text-body mt-2.5 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* ══ 05 CASE STUDIES ═══════════════════════════════════════════════ */}
        <Section id="work" className="bg-white border-b border-black/[0.06]">
          <Eyebrow>Selected work</Eyebrow>
          <h2 className="font-sora font-extrabold text-[30px] md:text-[44px] text-dark tracking-tight max-w-2xl leading-[1.1]">
            The work behind the reservations.
          </h2>

          {/* CASE 1 — AELA. No shot assets exist for this client yet, so it is
              presented as a typographic case rather than with borrowed imagery. */}
          <article className="mt-16 pt-12 border-t border-black/10">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16">
              <div>
                <p className="font-poppins text-[11px] font-bold uppercase tracking-[1.8px] text-[#8A8A8A]">Luxury Hotel Bar</p>
                <h3 className="font-sora font-extrabold text-[30px] md:text-[38px] text-dark tracking-tight mt-2 leading-[1.1]">
                  AELA
                </h3>
                <p className="font-poppins text-[15px] text-body mt-1">Fairmont Bangkok</p>
              </div>
              <div className="space-y-7">
                <div>
                  <p className="font-poppins text-[11px] font-bold uppercase tracking-[1.8px] text-muted mb-2">Challenge</p>
                  <p className="font-poppins text-[16px] text-dark leading-relaxed">
                    Launch and position a new premium destination bar inside a luxury hotel — one
                    that local guests would seek out on its own merit, not only because they were
                    already staying at the property.
                  </p>
                </div>
                <div>
                  <p className="font-poppins text-[11px] font-bold uppercase tracking-[1.8px] text-muted mb-2">What we do</p>
                  <div className="flex flex-wrap gap-2">
                    {['Creative Direction', 'Photography', 'Video Production', 'Social Strategy', 'Advertising'].map((s) => (
                      <span key={s} className="font-poppins text-[12px] font-medium text-body bg-[#F2F2F2] px-3 py-1.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                {/* "Our approach", not "Outcome" — this engagement has no verified
                    completed result yet, and the label must not imply one. */}
                <div>
                  <p className="font-poppins text-[11px] font-bold uppercase tracking-[1.8px] text-muted mb-2">Our approach</p>
                  <p className="font-poppins text-[16px] text-dark leading-relaxed">
                    Build a bar identity that reads as a destination in its own right — then a
                    content library deliberately front-loaded to sustain launch momentum across
                    social and paid, rather than one shoot that runs dry after a month.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* CASE 2 — MAN TABLES. Same: onboarded, not yet shot. */}
          <article className="mt-14 pt-12 border-t border-black/10">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16">
              <div>
                <p className="font-poppins text-[11px] font-bold uppercase tracking-[1.8px] text-[#8A8A8A]">Premium Chinese Fine Dining</p>
                <h3 className="font-sora font-extrabold text-[30px] md:text-[38px] text-dark tracking-tight mt-2 leading-[1.1]">
                  MAN TABLES
                </h3>
                <p className="font-poppins text-[15px] text-body mt-1">Chef Man</p>
              </div>
              <div className="space-y-7">
                <div>
                  <p className="font-poppins text-[11px] font-bold uppercase tracking-[1.8px] text-muted mb-2">Challenge</p>
                  <p className="font-poppins text-[16px] text-dark leading-relaxed">
                    Communicate craftsmanship and hospitality for a chef-led Chinese fine dining
                    room where private dining and business dining carry much of the revenue —
                    occasions that are decided long before a guest walks in.
                  </p>
                </div>
                <div>
                  <p className="font-poppins text-[11px] font-bold uppercase tracking-[1.8px] text-muted mb-2">What we do</p>
                  <div className="flex flex-wrap gap-2">
                    {['Creative Direction', 'Photography', 'Video Production', 'Social Management'].map((s) => (
                      <span key={s} className="font-poppins text-[12px] font-medium text-body bg-[#F2F2F2] px-3 py-1.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                {/* "The direction", not "Outcome" — no verified completed result yet. */}
                <div>
                  <p className="font-poppins text-[11px] font-bold uppercase tracking-[1.8px] text-muted mb-2">The direction</p>
                  <p className="font-poppins text-[16px] text-dark leading-relaxed">
                    Present the restaurant as an occasion venue rather than a menu — content
                    shaped around the private rooms, the service and the chef, aimed at the
                    person choosing where to host, not just where to eat.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* CASE 3 — Toh Daeng. Fully shot: real stills and Stream video. */}
          <article className="mt-14 pt-12 border-t border-black/10">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16">
              <div>
                <p className="font-poppins text-[11px] font-bold uppercase tracking-[1.8px] text-[#8A8A8A]">Michelin Guide Restaurant</p>
                <h3 className="font-sora font-extrabold text-[30px] md:text-[38px] text-dark tracking-tight mt-2 leading-[1.1]">
                  Toh Daeng
                </h3>
                <p className="font-poppins text-[15px] text-body mt-1">Bangkok · Thai</p>
              </div>
              <div className="space-y-7">
                <div>
                  <p className="font-poppins text-[11px] font-bold uppercase tracking-[1.8px] text-muted mb-2">Challenge</p>
                  <p className="font-poppins text-[16px] text-dark leading-relaxed">
                    Turn Michelin Guide recognition into everyday discovery — reaching diners
                    choosing where to eat this week, not only those who already follow the guide.
                  </p>
                </div>
                <div>
                  <p className="font-poppins text-[11px] font-bold uppercase tracking-[1.8px] text-muted mb-2">What we do</p>
                  <div className="flex flex-wrap gap-2">
                    {['Photography', 'Video Production', 'Social Strategy', 'Social Management', 'Advertising'].map((s) => (
                      <span key={s} className="font-poppins text-[12px] font-medium text-body bg-[#F2F2F2] px-3 py-1.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-poppins text-[11px] font-bold uppercase tracking-[1.8px] text-muted mb-2">Outcome</p>
                  <p className="font-poppins text-[16px] text-dark leading-relaxed">
                    A steady library of destination-led food and atmosphere content, produced on
                    location and published consistently rather than in bursts.
                  </p>
                </div>
              </div>
            </div>

            {tohDaeng?.photos && tohDaeng.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-10">
                {tohDaeng.photos.slice(0, 6).map((p, i) => (
                  <Shot
                    key={p}
                    src={p}
                    alt={`Toh Daeng campaign photography — frame ${i + 1}`}
                    ratio="aspect-[4/5]"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="rounded-[14px]"
                  />
                ))}
              </div>
            )}

            {/* Stream videos are click-to-play; nothing autoplays below the fold.
                streamIframeSrc returns null without the env var, and LazyVideoCard
                is only rendered when a customer code exists. */}
            {CUSTOMER_CODE && tohDaeng?.videos && tohDaeng.videos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                {tohDaeng.videos.slice(0, 4).map((v, i) => (
                  <LazyVideoCard
                    key={v}
                    videoId={v}
                    customerCode={CUSTOMER_CODE}
                    label={`Toh Daeng social video ${i + 1}`}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    maxThumbWidth={480}
                  />
                ))}
              </div>
            )}
          </article>

          <div className="mt-14">
            <CtaLink location="case_studies">Enquire Now</CtaLink>
          </div>
        </Section>

        {/* ══ 06 F&B SPECIALISATION ═════════════════════════════════════════ */}
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20">
            <div>
              <h2 className="font-sora font-extrabold text-[30px] md:text-[44px] text-dark tracking-tight leading-[1.1]">
                We don&apos;t market everything. We market F&amp;B.
              </h2>
              <p className="font-poppins text-[16px] text-body mt-6 leading-relaxed">
                Specialising changes how we work, not just what we say. We plan around service
                periods and seasonal covers, shoot in working kitchens without stopping service,
                and build campaigns around dining occasions rather than generic engagement.
              </p>
              <p className="font-sora font-extrabold text-[22px] md:text-[28px] text-dark mt-10 leading-snug tracking-tight">
                Your restaurant shouldn&apos;t have to teach its agency how restaurants work.
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 content-start lg:pt-3">
              {[
                'Restaurant launches', 'Seasonal campaigns', 'Menu storytelling',
                'Food photography', 'Chef-led brands', 'Hotel F&B approval structures',
                'Reservations', 'Dining occasions', 'Restaurant peak periods',
                'Guest acquisition', 'Social-first food content',
              ].map((s) => (
                <li key={s} className="font-poppins text-[15px] text-body flex items-start gap-2.5 border-b border-black/[0.07] py-2.5">
                  <span className="text-[#B4B4B4] mt-[3px] shrink-0" aria-hidden="true">—</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* ══ 12 FINAL CONVERSION ═══════════════════════════════════════════ */}
        <Section id="plan" className="bg-white border-t border-black/[0.06] scroll-mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16">
            <div>
              <Eyebrow>Consultation</Eyebrow>
              <h2 className="font-sora font-extrabold text-[30px] md:text-[42px] text-dark tracking-tight leading-[1.1]">
                Tell us about your restaurant.
              </h2>
              <p className="font-poppins text-[16px] text-body mt-5 leading-relaxed max-w-md">
                We&apos;ll show you where your marketing can improve — what&apos;s working, what
                isn&apos;t, and what we&apos;d do first.
              </p>
              <p className="font-poppins text-[14px] text-muted mt-8 leading-relaxed max-w-md">
                We take on a limited number of restaurants at a time so each one gets a
                proper production and campaign cycle. The questions below help us come to the
                conversation already understanding your business.
              </p>
            </div>
            <div className="bg-bg rounded-card p-6 md:p-8 border border-black/[0.06]">
              <LeadForm />
            </div>
          </div>
        </Section>
      </main>

      {/* Minimal funnel footer instead of the shared <Footer />. The shared one
          carries a green CTA and a full nav pointing at /contact, /work etc. —
          a green accent this route must not have, plus four exits out of a paid
          funnel. Defined locally so no shared component changes and no other
          route is affected. */}
      <footer className="bg-dark px-5 md:px-12 py-12">
        <div className="max-w-site mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-rampup-light.svg"
              alt="RampUp"
              width={73}
              height={60}
              className="h-8 w-auto object-contain opacity-90"
            />
            <p className="font-poppins text-[13px] text-white/45 mt-4 max-w-xs leading-relaxed">
              Restaurant marketing, production and paid media. Bangkok, Thailand.
            </p>
          </div>
          <p className="font-poppins text-[12px] text-white/30">
            © {new Date().getFullYear()} Restaurant RampUp. All rights reserved.
          </p>
        </div>
      </footer>
      <StickyCta />
      {/* Sticky bar clearance so it never covers the footer's last line. */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  )
}
