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
      {/* Logo only, not sticky — no CTA and no site nav, so the hero carries the
          single action and the header scrolls away with the page. */}
      <header className="bg-bg border-b border-black/[0.06]">
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
              <h1 className="font-sora font-extrabold text-[30px] leading-[1.1] sm:text-[41px] lg:text-[53px] text-dark tracking-[-0.02em]">
                Premium restaurant marketing built to turn attention into reservations.
              </h1>
              <p className="font-poppins text-[15px] md:text-[18px] text-body mt-6 leading-relaxed max-w-xl">
                One F&amp;B-specialist team for high-end content, social media, Meta Ads and
                Google Ads.
              </p>

              <div className="mt-8">
                <CtaLink location="hero">Enquire Now</CtaLink>
              </div>

              {/* Price sits under the CTA as a qualifier on the action. */}
              <p className="font-poppins text-[14px] text-muted mt-5">
                Packages from <span className="font-bold text-dark">{PRICE}/month</span>
              </p>
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
          <h2 className="font-sora font-extrabold text-[25px] md:text-[35px] text-dark tracking-tight max-w-3xl leading-[1.15]">
            Trusted by premium restaurants, chef-led concepts and hotel F&amp;B teams.
          </h2>

          {/* Three image cards. AELA and MAN TABLES have no shot assets yet, so
              their card uses an editorial title plate in the same 4:3 box rather
              than a stock photo or another client's imagery. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 mt-14">
            {[
              { name: 'AELA', sub: 'Fairmont Bangkok', type: 'Luxury Hotel Bar', media: null },
              { name: 'MAN TABLES', sub: 'Chef Man', type: 'Premium Chinese Fine Dining', media: null },
              { name: 'Toh Daeng', sub: 'Bangkok', type: 'Michelin Guide Restaurant', media: tohDaeng?.photos?.[0] ?? null },
            ].map((c) => (
              <article key={c.name}>
                {c.media ? (
                  <Shot
                    src={c.media}
                    alt={`Campaign photography produced for ${c.name} in Bangkok`}
                    ratio="aspect-[4/3]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="rounded-[16px]"
                  />
                ) : (
                  <div className="relative aspect-[4/3] rounded-[16px] bg-[#F0F0F0] border border-black/[0.07] overflow-hidden">
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <span className="font-sora font-extrabold text-[29px] leading-[0.95] text-[#D8D8D8] tracking-tight">
                        {c.name}
                      </span>
                      <span className="font-poppins text-[11px] font-bold uppercase tracking-[2px] text-[#B4B4B4] mt-2.5">
                        {c.sub}
                      </span>
                    </div>
                  </div>
                )}
                <p className="font-poppins text-[11px] font-bold uppercase tracking-[2px] text-[#8A8A8A] mt-5">{c.type}</p>
                <h3 className="font-sora font-extrabold text-[24px] text-dark tracking-tight mt-2 leading-[1.1]">
                  {c.name}
                </h3>
                <p className="font-poppins text-[15px] text-body mt-1">{c.sub}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* ══ 03 THE PROBLEM ════════════════════════════════════════════════ */}
        <Section>
          <h2 className="font-sora font-extrabold text-[29px] md:text-[43px] text-dark tracking-tight max-w-2xl leading-[1.1]">
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
                  className="font-sora font-bold text-[19px] md:text-[20px] text-dark leading-snug"
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
          <h2 className="font-sora font-extrabold text-[29px] md:text-[43px] text-dark tracking-tight max-w-2xl leading-[1.1]">
            The work behind the reservations.
          </h2>

          {/* Challenge and approach copy removed — each entry is now the client
              header, the services we actually provide, and the work itself.
              Only Toh Daeng has video in clients.json; AELA and MAN TABLES are
              onboarded but not yet shot, so their entries carry no video rather
              than borrowing another client's footage. */}
          {[
            {
              name: 'AELA',
              sub: 'Fairmont Bangkok',
              type: 'Luxury Hotel Bar',
              services: ['Creative Direction', 'Photography', 'Video Production', 'Social Strategy', 'Advertising'],
              videos: [] as string[],
            },
            {
              name: 'MAN TABLES',
              sub: 'Chef Man',
              type: 'Premium Chinese Fine Dining',
              services: ['Creative Direction', 'Photography', 'Video Production', 'Social Management'],
              videos: [] as string[],
            },
            {
              name: 'Toh Daeng',
              sub: 'Bangkok · Thai',
              type: 'Michelin Guide Restaurant',
              services: ['Photography', 'Video Production', 'Social Strategy', 'Social Management', 'Advertising'],
              videos: (tohDaeng?.videos ?? []).slice(0, 2),
            },
          ].map((c) => (
            <article key={c.name} className="mt-16 pt-12 border-t border-black/10">
              <p className="font-poppins text-[11px] font-bold uppercase tracking-[1.8px] text-[#8A8A8A]">{c.type}</p>
              <h3 className="font-sora font-extrabold text-[29px] md:text-[37px] text-dark tracking-tight mt-2 leading-[1.1]">
                {c.name}
              </h3>
              <p className="font-poppins text-[15px] text-body mt-1">{c.sub}</p>

              <div className="flex flex-wrap gap-2 mt-5">
                {c.services.map((v) => (
                  <span key={v} className="font-poppins text-[12px] font-medium text-body bg-[#F2F2F2] px-3 py-1.5 rounded-full">{v}</span>
                ))}
              </div>

              {/* Click-to-play, poster-framed. LazyVideoCard is only rendered when
                  a Stream customer code exists, matching the rest of the site. */}
              {CUSTOMER_CODE && c.videos.length > 0 && (
                <div className="grid grid-cols-2 gap-3 md:gap-4 mt-8 max-w-2xl">
                  {c.videos.map((v, i) => (
                    <LazyVideoCard
                      key={v}
                      videoId={v}
                      customerCode={CUSTOMER_CODE}
                      label={`${c.name} social video ${i + 1}`}
                      sizes="(max-width: 768px) 50vw, 320px"
                      maxThumbWidth={480}
                    />
                  ))}
                </div>
              )}
            </article>
          ))}

          <div className="mt-14">
            <CtaLink location="case_studies">Enquire Now</CtaLink>
          </div>
        </Section>

        {/* ══ 06 F&B SPECIALISATION ═════════════════════════════════════════ */}
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20">
            <div>
              <h2 className="font-sora font-extrabold text-[29px] md:text-[43px] text-dark tracking-tight leading-[1.1]">
                We don&apos;t market everything. We market F&amp;B.
              </h2>
              <p className="font-poppins text-[15px] text-body mt-6 leading-relaxed">
                Specialising changes how we work, not just what we say. We plan around service
                periods and seasonal covers, shoot in working kitchens without stopping service,
                and build campaigns around dining occasions rather than generic engagement.
              </p>
              <p className="font-sora font-extrabold text-[22px] md:text-[27px] text-dark mt-10 leading-snug tracking-tight">
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
            {/* Heading only — the form does the rest of the talking. */}
            <div>
              <h2 className="font-sora font-extrabold text-[29px] md:text-[41px] text-dark tracking-tight leading-[1.1]">
                Ready to improve your restaurant&rsquo;s marketing?
              </h2>
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
