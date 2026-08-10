import Footer from '@/components/Footer'
import LeadForm from './LeadForm'
import LazyVideoCard from '@/components/LazyVideoCard'
import type { Metadata } from 'next'
import { restaurantRampUp, formatTHB } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Restaurant Marketing Built Only For Restaurants | RampUp',
  description:
    'Premium videos, photos, posts, and ads for restaurants that want more attention, bookings, and online sales.',
}

const igFollowerStrips = [
  { img: '/funnel/ig-followers-1.jpg', label: 'Client 1' },
  { img: '/funnel/ig-followers-2.jpg', label: 'Client 2' },
  { img: '/funnel/ig-followers-3.jpg', label: 'Client 3' },
  { img: '/funnel/ig-followers-4.jpg', label: 'Client 4' },
]

const viewsCards = [
  { img: '/funnel/views-1.jpg', label: 'Reel views' },
  { img: '/funnel/views-2.jpg', label: 'Reel views' },
  { img: '/funnel/views-3.jpg', label: 'Reel views' },
  { img: '/funnel/views-4.jpg', label: 'Reel views' },
]

const proofCuisineCards = [
  { label: 'Italian',   videoId: '8bdba9b6311127b6cb436011a72437c1' }, // Bacio
  { label: 'Japanese',  videoId: 'e46ed58ab9797e6d75305b29c7daf78c' }, // Okasan
  { label: 'Nightlife', videoId: '9123991d33686a667c769cd643648cbe' }, // Lamaya BKK
  { label: 'Thai',      videoId: 'dc607b4317bc7a778e1212777ca49c89' }, // Raluek
]

const grabResultCards = [
  { before: '฿665K', after: '฿1.25M', timeframe: '2 months', growth: '1.9x growth', monthly: '+฿295K / month', beforeImg: '/results/proof-1-after.jpg',  afterImg: '/results/proof-1-before.jpg' },
  { before: '฿300K', after: '฿628K',  timeframe: '2 months', growth: '2.1x growth', monthly: '+฿328K / month', beforeImg: '/results/proof-2-before.jpg', afterImg: '/results/proof-2-after.jpg' },
  { before: '฿127K', after: '฿249K',  timeframe: '4 months', growth: '2x growth',   monthly: '+฿122K / month', beforeImg: '/results/proof-3-before.jpg', afterImg: '/results/proof-3-after.jpg' },
  { before: '฿431K', after: '฿814K',  timeframe: '5 months', growth: '1.9x growth', monthly: '+฿383K / month', beforeImg: '/results/proof-4-before.jpg', afterImg: '/results/proof-4-after.jpg' },
]

const proofStatsCompact = [
  { value: '18+',  label: 'Restaurant Clients' },
  { value: '10M+', label: 'Content Views Generated' },
  { value: '3x',   label: 'Average Grab Revenue Growth' },
]

const secretCards = [
  {
    n: '01',
    title: 'Make The Food Craveable',
    body: 'We film your food in a way that makes people stop scrolling and want to eat.',
    detail: 'Pasta pulls, sizzling dishes, sushi, cocktails, desserts, and chef moments.',
  },
  {
    n: '02',
    title: 'Sell The Restaurant Vibe',
    body: 'People don’t only choose food. They choose the feeling of the place.',
    detail: 'Date nights, group dinners, rooftop drinks, birthdays, private rooms, and nightlife.',
  },
  {
    n: '03',
    title: 'Retarget People Who Show Interest',
    body: 'We use your best videos and photos for Facebook, Instagram, TikTok, and Google.',
    detail: 'Then we retarget people who watched, clicked, or engaged — and push them to book through IG messages, Facebook messages, or Google Maps search ads.',
  },
  {
    n: '04',
    title: 'Bring In Customers',
    body: 'The goal is not just views. The goal is more people visiting, booking, ordering, and remembering your brand.',
    detail: 'More attention, more cravings, more bookings, and more Grab sales.',
  },
]

const restaurantBlocks = [
  {
    title: 'Italian Restaurants',
    images: [
      'https://imagedelivery.net/vLx1XbY5KfOkLsw5dmceXw/33414344-41d4-4f97-8799-30fb63221900/public',
      'https://imagedelivery.net/vLx1XbY5KfOkLsw5dmceXw/24e81406-7f9c-4dd5-a516-5ec39e8b4600/public',
    ],
    focus: 'Pasta, wine, chef plating, warm interiors, date nights, desserts.',
    angle: 'Premium, relaxed, appetizing.',
    highlight: 'Make people crave the meal before they book the table.',
  },
  {
    title: 'Japanese / Izakaya Restaurants',
    images: [
      'https://imagedelivery.net/vLx1XbY5KfOkLsw5dmceXw/b498f63b-7d1f-49cd-7e03-ff9cd27b7d00/public',
      'https://imagedelivery.net/vLx1XbY5KfOkLsw5dmceXw/6338cab8-78f9-4a5b-dd98-7628616a0000/public',
    ],
    focus: 'Sushi, skewers, highballs, beer, private rooms, chef hands, group dining.',
    angle: 'Social, detailed, energetic.',
    highlight: 'Food, drinks, and atmosphere made for nights out.',
  },
  {
    title: 'Party / Nightlife Restaurants',
    images: [
      'https://imagedelivery.net/vLx1XbY5KfOkLsw5dmceXw/a82abda7-cead-4c9e-bf43-112fc9fbfd00/public',
      'https://imagedelivery.net/vLx1XbY5KfOkLsw5dmceXw/1c00e65c-451d-4ea2-6335-eb403bd86f00/public',
    ],
    focus: 'Cocktails, lights, people, music, birthdays, groups, events.',
    angle: 'Energy, experience, FOMO.',
    highlight: 'Not just dinner. A night people want to be part of.',
  },
]

const deliverables = [
  { title: '7 Videos',           blurb: 'Short-form videos for Reels, TikTok, Facebook, and ads.' },
  { title: 'Photos Every Month', blurb: 'Food, drinks, interiors, people, events, and menu photos.' },
  { title: '18 Posts',           blurb: 'Consistent content to keep your restaurant active online.' },
  { title: 'Google Map Ads',     blurb: 'Included — get found by people searching for your cuisine nearby.' },
  { title: 'Captions & Planning',blurb: 'Content planned around your menu, offers, and brand.' },
]

const adChannels = [
  { title: 'Facebook Ads',       blurb: 'Local awareness, promos, events, bookings, retargeting.' },
  { title: 'Instagram Ads',      blurb: 'Visuals, brand image, Reels, lifestyle, discovery.' },
  { title: 'TikTok Ads',         blurb: 'Short videos, food discovery, younger audiences, viral content.' },
  { title: 'Google Ads',         blurb: 'Search, Maps, and intent-based traffic looking for your cuisine.' },
  { title: 'Grab & LINE MAN Ads',blurb: 'For restaurants that want more delivery orders.' },
]

const systemSteps = [
  { n: '01', title: 'Plan',       blurb: 'We decide what content your restaurant needs.' },
  { n: '02', title: 'Shoot',      blurb: 'We film and photograph your food, space, people, and vibe.' },
  { n: '03', title: 'Post',       blurb: 'We turn it into monthly social media content.' },
  { n: '04', title: 'Advertise',  blurb: 'We run ads to bring more people to your restaurant.' },
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

export default function RestaurantMarketingFunnel() {
  const customerCode = process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE ?? ''
  return (
    <main className="min-h-[100dvh] bg-[#EDEDED] scroll-smooth">

      {/* ── NAV ── */}
      <div className="max-w-site mx-auto px-5 md:px-12 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-rampup-accent.svg" alt="RampUp" className="h-6 md:h-[31px] w-auto" />
      </div>

      {/* ── 1. HERO ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 pt-8 pb-12 md:pt-14 md:pb-16 text-center">
        <h1 className="font-sora font-extrabold text-[clamp(1.9rem,5.5vw,3.6rem)] leading-[1.08] tracking-tight text-dark mb-4 max-w-3xl mx-auto">
          More Dine-In Customers.<br />More Grab Orders.
        </h1>
        <p className="font-poppins text-base md:text-xl text-muted leading-relaxed max-w-2xl mx-auto mb-8">
          From Instagram and TikTok to Google and Grab, we manage the channels that bring customers to your restaurant.
        </p>

        <PrimaryCta />
        <p className="font-poppins text-sm italic text-muted mt-4">
          Trusted by 20+ restaurants
        </p>
      </section>

      {/* ── 1a. SOCIAL PROOF (followers + views) ── */}
      <section className="bg-[#EDEDED] pb-10 md:pb-16">
        <div className="max-w-site mx-auto px-5 md:px-12">
          {/* 4 thin IG follower strips */}
          <p className="font-poppins text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-3 px-1">
            Real Client IG Growth
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {igFollowerStrips.map((s) => (
              <div
                key={s.label}
                className="relative rounded-xl overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] aspect-[5/1]"
                style={{
                  backgroundImage: `url('${s.img}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ))}
          </div>

          {/* 2 vertical 9:16 view screenshots */}
          <p className="font-poppins text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-3 px-1">
            Content That Performs
          </p>
          <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto">
            {viewsCards.map((v, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden bg-[#1a1a1a] shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
                style={{
                  aspectRatio: '9/16',
                  backgroundImage: `url('${v.img}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 1b. PROOF ── */}
      <section className="bg-[#EDEDED] pb-12 md:pb-20">
        <div className="max-w-site mx-auto px-5 md:px-12">
          {/* Cuisine carousel */}
          <p className="font-poppins text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-3 px-1">
            Restaurant Content We Create
          </p>
          <div
            className="-mx-5 px-5 md:mx-0 md:px-0 mb-10 flex gap-3 md:grid md:grid-cols-4 md:gap-4"
            style={{
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {proofCuisineCards.map((c) => (
              <div
                key={c.label}
                className="shrink-0 w-[70vw] md:w-auto relative"
                style={{ scrollSnapAlign: 'start' }}
              >
                <LazyVideoCard
                  videoId={c.videoId}
                  customerCode={customerCode}
                  label={c.label}
                  sizes="(max-width: 768px) 70vw, 25vw"
                />
                <span className="absolute top-3 left-3 z-10 font-poppins text-[11px] font-bold uppercase tracking-[1px] bg-black/55 text-white px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                  {c.label}
                </span>
              </div>
            ))}
          </div>


          {/* Compact stat row */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {proofStatsCompact.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-4 md:p-6 text-center">
                <div className="font-sora font-extrabold text-2xl md:text-4xl text-dark mb-1">
                  {s.value}
                </div>
                <div className="font-poppins text-[11px] md:text-sm text-muted leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 1c. GRAB SALES RESULTS ── */}
      <section className="bg-black py-10 md:py-14">
        <div className="max-w-site mx-auto px-5 md:px-12">
          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-2 text-center">
            Grow Your Grab Sales
          </h2>
          <p className="font-poppins text-base md:text-lg text-white/50 text-center mb-6">
            Actual revenue growth from restaurants we work with
          </p>
          <div
            className="flex gap-5 md:grid md:grid-cols-2 md:gap-5"
            style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {grabResultCards.map((card) => (
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

      {/* ── 2. THE SECRET ── */}
      <section className="bg-black py-14 md:py-20">
        <div className="max-w-site mx-auto px-5 md:px-12">
          <div className="text-center mb-10">
            <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-white tracking-tight mb-3 max-w-2xl mx-auto">
              The Secret Behind Our Restaurant Marketing System
            </h2>
            <p className="font-poppins text-base md:text-lg text-white/60 max-w-2xl mx-auto">
              We create content people actually want to watch, then turn it into cravings, visits, and orders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-10">
            {secretCards.map((c) => (
              <div key={c.n} className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 md:p-7 text-left">
                <p className="font-sora font-extrabold text-2xl text-green mb-3">{c.n}</p>
                <h3 className="font-sora font-bold text-lg md:text-xl text-white mb-2 leading-tight">
                  {c.title}
                </h3>
                <p className="font-poppins text-sm md:text-base text-white/75 leading-relaxed mb-3">
                  {c.body}
                </p>
                <p className="font-poppins text-xs md:text-sm text-white/45 leading-relaxed">
                  {c.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="#apply"
              className="inline-block bg-[#3DBE5A] text-white font-poppins font-bold text-base px-10 py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] uppercase tracking-wide"
            >
              Apply Today
            </a>
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
              <div className="grid grid-cols-2 gap-2">
                {b.images.map((src) => (
                  <div
                    key={src}
                    className="rounded-xl overflow-hidden aspect-square bg-[#E0E0E0]"
                    style={{
                      backgroundImage: `url('${src}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                ))}
              </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
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
        <div className="max-w-xl mx-auto bg-white rounded-[24px] shadow-[0_4px_32px_rgba(0,0,0,0.07)] overflow-hidden">
          {/* Price header */}
          <div className="bg-dark text-white text-center px-7 py-6 md:px-10 md:py-7">
            <p className="font-poppins text-[11px] font-bold uppercase tracking-[2px] text-green mb-1">
              Grab and Socials
            </p>
            <p className="font-sora font-extrabold text-3xl md:text-4xl tracking-tight">
              ฿{formatTHB(restaurantRampUp.price)} <span className="font-poppins font-normal text-base text-white/60">/ month</span>
            </p>
          </div>
          <div className="p-7 md:p-10">
            <LeadForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
