import Footer from '@/components/Footer'
import LeadForm from './LeadForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Restaurant Marketing Built Only For Restaurants | RampUp',
  description:
    'Premium videos, photos, posts, and ads for restaurants that want more attention, bookings, and online sales.',
}

const cuisineCards = [
  {
    label: 'Italian',
    blurb: 'Food, wine, interiors, premium dining.',
    bg: 'linear-gradient(135deg, #6B2D2D 0%, #3D1818 100%)',
    accent: '#E8B65A',
  },
  {
    label: 'Japanese',
    blurb: 'Izakaya, sushi, drinks, group dining.',
    bg: 'linear-gradient(135deg, #1A2540 0%, #0E1626 100%)',
    accent: '#E55353',
  },
  {
    label: 'Party / Nightlife',
    blurb: 'Cocktails, people, lights, weekend energy.',
    bg: 'linear-gradient(135deg, #2A0E40 0%, #14062A 100%)',
    accent: '#C99CFF',
  },
]

const positioningCards = [
  { title: 'Food',  blurb: 'Menu and dish content.' },
  { title: 'Vibe',  blurb: 'People, space, atmosphere.' },
  { title: 'Sales', blurb: 'Ads, bookings, Grab, LINE MAN.' },
]

const restaurantBlocks = [
  {
    title: 'Italian Restaurants',
    focus: 'Pasta, wine, chef plating, warm interiors, date nights, desserts.',
    angle: 'Premium, relaxed, appetizing.',
    highlight: 'Make people crave the meal before they book the table.',
  },
  {
    title: 'Japanese / Izakaya Restaurants',
    focus: 'Sushi, skewers, highballs, beer, private rooms, chef hands, group dining.',
    angle: 'Social, detailed, energetic.',
    highlight: 'Food, drinks, and atmosphere made for nights out.',
  },
  {
    title: 'Party / Nightlife Restaurants',
    focus: 'Cocktails, lights, people, music, birthdays, groups, events.',
    angle: 'Energy, experience, FOMO.',
    highlight: 'Not just dinner. A night people want to be part of.',
  },
]

const deliverables = [
  { title: '7 Videos',           blurb: 'Short-form videos for Reels, TikTok, Facebook, and ads.' },
  { title: 'Photos Every Month', blurb: 'Food, drinks, interiors, people, events, and menu photos.' },
  { title: '18 Posts',           blurb: 'Consistent content to keep your restaurant active online.' },
  { title: 'Captions & Planning',blurb: 'Content planned around your menu, offers, and brand.' },
]

const adChannels = [
  { title: 'Facebook Ads',       blurb: 'Local awareness, promos, events, bookings, retargeting.' },
  { title: 'Instagram Ads',      blurb: 'Visuals, brand image, Reels, lifestyle, discovery.' },
  { title: 'TikTok Ads',         blurb: 'Short videos, food discovery, younger audiences, viral content.' },
  { title: 'Grab & LINE MAN Ads',blurb: 'For restaurants that want more delivery orders.' },
]

const systemSteps = [
  { n: '01', title: 'Plan',       blurb: 'We decide what content your restaurant needs.' },
  { n: '02', title: 'Shoot',      blurb: 'We film and photograph your food, space, people, and vibe.' },
  { n: '03', title: 'Post',       blurb: 'We turn it into monthly social media content.' },
  { n: '04', title: 'Advertise',  blurb: 'We run ads to bring more people to your restaurant.' },
]

const proofStats = [
  { value: '18+',    label: 'Restaurant Clients' },
  { value: '10M+',   label: 'Content Views' },
  { value: '3x',     label: 'Avg Grab Revenue Growth' },
  { value: 'Premium',label: 'Monthly Production' },
  { value: 'Social + Paid', label: 'Ads Strategy' },
]

const beforeAfter = {
  before: [
    'Random photos',
    'Inconsistent posting',
    'No clear brand',
    'No ad strategy',
    'Low-quality content',
  ],
  after: [
    'Premium monthly content',
    'Clear brand direction',
    'Fresh videos and photos',
    'Ads that support sales',
    'Content people want to save and share',
  ],
}

// Primary green CTA button
function PrimaryCta({ label = 'Apply Now', href = '#apply' }: { label?: string; href?: string }) {
  return (
    <a
      href={href}
      className="inline-block bg-[#3DBE5A] text-white font-poppins font-bold text-base px-10 py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] uppercase tracking-wide"
    >
      {label}
    </a>
  )
}

function SecondaryCta({ label = 'See Our Work', href = '/work' }: { label?: string; href?: string }) {
  return (
    <a
      href={href}
      className="inline-block font-poppins font-semibold text-sm text-dark border border-black/15 px-8 py-3.5 rounded-pill hover:border-black/30 transition-all"
    >
      {label}
    </a>
  )
}

export default function RestaurantMarketingFunnel() {
  return (
    <main className="min-h-[100dvh] bg-[#EDEDED] scroll-smooth">

      {/* ── NAV ── */}
      <div className="max-w-site mx-auto px-5 md:px-12 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-rampup-accent.svg" alt="RampUp" className="h-6 md:h-[31px] w-auto" />
      </div>

      {/* ── 1. HERO ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 pt-10 pb-10 md:pt-16 md:pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-green-light border border-green/20 rounded-tag px-3 py-1 mb-6">
          <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
          <span className="font-poppins text-[11px] font-bold text-green uppercase tracking-[1.5px]">
            Restaurants Only
          </span>
        </div>

        <h1 className="font-sora font-extrabold text-[clamp(2rem,5vw,3.6rem)] leading-[1.08] tracking-tight text-dark mb-5 max-w-3xl mx-auto">
          Restaurant Marketing Built Only For Restaurants
        </h1>
        <p className="font-poppins text-lg md:text-xl text-muted leading-relaxed max-w-2xl mx-auto mb-10">
          Premium videos, photos, posts, and ads for restaurants that want more attention, bookings, and online sales.
        </p>

        {/* Cuisine cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {cuisineCards.map((c) => (
            <div
              key={c.label}
              className="relative rounded-2xl overflow-hidden p-6 md:p-8 text-left aspect-[4/5] sm:aspect-[3/4] flex flex-col justify-end"
              style={{ background: c.bg }}
            >
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full" style={{ background: c.accent, opacity: 0.85 }} />
              <h3 className="font-sora font-extrabold text-2xl md:text-3xl text-white mb-2">
                {c.label}
              </h3>
              <p className="font-poppins text-sm text-white/70 leading-relaxed">
                {c.blurb}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <PrimaryCta />
          <SecondaryCta />
        </div>
      </section>

      {/* ── 2. POSITIONING ── */}
      <section className="bg-black py-14 md:py-20">
        <div className="max-w-site mx-auto px-5 md:px-12 text-center">
          <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-white tracking-tight mb-3 max-w-2xl mx-auto">
            We don&apos;t do every industry. We do restaurants.
          </h2>
          <p className="font-poppins text-base md:text-lg text-white/60 max-w-2xl mx-auto mb-10">
            We understand food, vibe, menus, promotions, bookings, delivery apps, and what makes people choose where to eat.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {positioningCards.map((p) => (
              <div key={p.title} className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 text-left">
                <h3 className="font-sora font-bold text-xl text-white mb-2">{p.title}</h3>
                <p className="font-poppins text-sm text-white/60">{p.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. RESTAURANT TYPES ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-14 md:py-20">
        <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-dark tracking-tight mb-3 text-center max-w-2xl mx-auto">
          Different restaurants need different content.
        </h2>
        <p className="font-poppins text-base text-muted text-center mb-10 max-w-xl mx-auto">
          We tailor the creative direction to your category.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {restaurantBlocks.map((b) => (
            <div key={b.title} className="bg-white rounded-card p-7 flex flex-col gap-4">
              <h3 className="font-sora font-bold text-xl text-dark">{b.title}</h3>
              <div>
                <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[1.5px] mb-1">Creative Focus</p>
                <p className="font-poppins text-sm text-body leading-relaxed">{b.focus}</p>
              </div>
              <div>
                <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[1.5px] mb-1">Content Angle</p>
                <p className="font-poppins text-sm text-body leading-relaxed">{b.angle}</p>
              </div>
              <p className="font-sora font-semibold text-base text-dark border-t border-black/[0.07] pt-4 mt-auto">
                {b.highlight}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <PrimaryCta />
        </div>
      </section>

      {/* ── 4. MONTHLY DELIVERABLES ── */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-site mx-auto px-5 md:px-12">
          <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-dark tracking-tight mb-3 text-center">
            Monthly content for restaurants
          </h2>
          <p className="font-poppins text-base text-muted text-center mb-10 max-w-xl mx-auto">
            Everything you need to stay active and grow online.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deliverables.map((d) => (
              <div key={d.title} className="bg-[#F5F5F5] rounded-2xl p-6">
                <h3 className="font-sora font-bold text-lg text-dark mb-2">{d.title}</h3>
                <p className="font-poppins text-sm text-muted leading-relaxed">{d.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. ADS SECTION ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-14 md:py-20">
        <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-dark tracking-tight mb-3 text-center max-w-2xl mx-auto">
          We create the content, then we use it for ads.
        </h2>
        <p className="font-poppins text-base text-muted text-center mb-10 max-w-xl mx-auto">
          One system. From shoot to sales.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {adChannels.map((a) => (
            <div key={a.title} className="bg-white rounded-2xl p-6 flex flex-col gap-2">
              <h3 className="font-sora font-bold text-lg text-dark">{a.title}</h3>
              <p className="font-poppins text-sm text-muted leading-relaxed">{a.blurb}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <PrimaryCta />
        </div>
      </section>

      {/* ── 6. RAMPUP SYSTEM ── */}
      <section className="bg-black py-14 md:py-20">
        <div className="max-w-site mx-auto px-5 md:px-12">
          <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-white tracking-tight mb-10 text-center">
            How we grow restaurants online
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {systemSteps.map((s) => (
              <div key={s.n} className="bg-white/[0.06] border border-white/10 rounded-2xl p-6">
                <p className="font-sora font-extrabold text-3xl text-green mb-3">{s.n}</p>
                <h3 className="font-sora font-bold text-lg text-white mb-1">{s.title}</h3>
                <p className="font-poppins text-sm text-white/60 leading-relaxed">{s.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. PROOF ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-14 md:py-20">
        <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-dark tracking-tight mb-10 text-center">
          Built for real restaurant marketing
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {proofStats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 md:p-6">
              <div className="font-sora font-extrabold text-2xl md:text-3xl text-dark mb-1">
                {s.value}
              </div>
              <div className="font-poppins text-xs md:text-sm text-muted leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. BEFORE / AFTER ── */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-site mx-auto px-5 md:px-12">
          <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-dark tracking-tight mb-10 text-center max-w-2xl mx-auto">
            From random posting to a real restaurant brand
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="bg-[#F5F5F5] rounded-2xl p-7">
              <p className="font-poppins text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-4">Before</p>
              <ul className="flex flex-col gap-3">
                {beforeAfter.before.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-muted shrink-0" />
                    <span className="font-poppins text-base text-body">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-light rounded-2xl p-7 border border-green/20">
              <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[1.5px] mb-4">After</p>
              <ul className="flex flex-col gap-3">
                {beforeAfter.after.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[3px] w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5 3.5-4" stroke="#3DBE5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="font-poppins text-base text-dark">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="text-center mt-10">
            <PrimaryCta />
          </div>
        </div>
      </section>

      {/* ── 9. FORM ── */}
      <section id="apply" className="max-w-site mx-auto px-5 md:px-12 py-14 md:py-20">
        <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-dark tracking-tight mb-3 text-center">
          Want us to market your restaurant?
        </h2>
        <p className="font-poppins text-base md:text-lg text-muted text-center mb-10 max-w-xl mx-auto">
          Tell us about your restaurant and we&apos;ll see how we can help.
        </p>
        <div className="max-w-xl mx-auto bg-white rounded-[24px] shadow-[0_4px_32px_rgba(0,0,0,0.07)] p-7 md:p-10">
          <LeadForm />
        </div>
      </section>

      {/* ── 10. FINAL CTA ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 pb-20">
        <div className="bg-dark rounded-card p-8 md:p-14 text-center">
          <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-white tracking-tight mb-4 max-w-2xl mx-auto">
            Make your restaurant look as good online as it feels in real life.
          </h2>
          <p className="font-poppins text-base md:text-lg text-white/60 mb-8 max-w-2xl mx-auto">
            Premium content, better ads, and a restaurant marketing system built to help you grow.
          </p>
          <PrimaryCta />
        </div>
      </section>

      <Footer />
    </main>
  )
}
