import Link from 'next/link'
import LeadForm from '@/components/LeadForm'
import Footer from '@/components/Footer'

const tickerItems = [
  'Grab',
  'Lineman',
  'FoodPanda',
  'Instagram',
  'Facebook',
  'TikTok',
  'LINE OA',
]

const stats = [
  { value: '18+', label: 'Restaurant Clients' },
  { value: '3x', label: 'Average Grab Revenue Growth' },
  { value: '10M+', label: 'Content Views Generated' },
  { value: '8', label: 'Cuisine Categories' },
]

const services = [
  {
    tag: 'Delivery',
    title: 'Grab Sales Growth',
    description:
      'We optimise your Grab storefront, run targeted ads, and manage promotions to increase your monthly delivery revenue — guaranteed results or we work for free.',
    cta: 'Learn More',
    href: '/grab-sales',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L25 8.5V19.5L14 25L3 19.5V8.5L14 3Z" stroke="#3DBE5A" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M14 3V25M3 8.5L25 19.5M25 8.5L3 19.5" stroke="#3DBE5A" strokeWidth="1.5" strokeOpacity="0.4"/>
      </svg>
    ),
  },
  {
    tag: 'Social',
    title: 'Social Media Management',
    description:
      'Monthly photo/video shoots, content creation, and posting across Instagram, TikTok, Facebook, and LINE OA. Built for Bangkok restaurants.',
    cta: 'Learn More',
    href: '/social-media',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="22" height="22" rx="7" stroke="#3DBE5A" strokeWidth="2"/>
        <circle cx="14" cy="14" r="5" stroke="#3DBE5A" strokeWidth="2"/>
        <circle cx="20.5" cy="7.5" r="1.5" fill="#3DBE5A"/>
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-[#EDEDED]">
      {/* ── Minimal top bar (no full nav) ── */}
      <div className="px-5 md:px-12 py-5 flex items-center justify-between max-w-site mx-auto">
        <div className="font-sora font-extrabold text-xl tracking-tight">
          <span className="text-dark">RAMP</span>
          <span className="text-green">UP</span>
        </div>
        <Link
          href="/work"
          className="font-poppins text-sm font-medium text-body hover:text-dark transition-colors"
        >
          See Our Work →
        </Link>
      </div>

      {/* ── Hero ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-20">
          {/* Left: headline + form */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-green-light border border-green/20 rounded-tag px-3 py-1 mb-6">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
              <span className="font-poppins text-[11px] font-bold text-green uppercase tracking-[1.5px]">
                Bangkok&apos;s Restaurant Growth Agency
              </span>
            </div>

            <h1 className="font-sora font-extrabold text-[clamp(2.4rem,6vw,3.8rem)] leading-[1.08] tracking-tight text-dark mb-5">
              More orders.<br />
              More tables.<br />
              <span className="text-green">More revenue.</span>
            </h1>

            <p className="font-poppins text-base md:text-lg text-muted leading-relaxed mb-8 max-w-[480px]">
              We grow Bangkok restaurants on Grab, Instagram, TikTok, and Facebook.
              Real results — not just pretty photos.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/grab-sales"
                className="bg-green text-white font-poppins font-semibold text-sm px-6 py-3 rounded-pill hover:brightness-105 transition-all active:scale-[0.98]"
              >
                Boost Grab Sales
              </Link>
              <Link
                href="/work"
                className="bg-white text-dark font-poppins font-semibold text-sm px-6 py-3 rounded-pill border border-black/10 hover:border-black/20 transition-all active:scale-[0.98]"
              >
                View Client Work
              </Link>
            </div>

            {/* Social proof logos */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-poppins text-xs text-faint font-medium">Trusted by restaurants on</span>
              {['Grab', 'Lineman', 'FoodPanda'].map((p) => (
                <span key={p} className="font-poppins text-xs font-semibold text-muted bg-white/80 px-2.5 py-1 rounded-full border border-black/[0.06]">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Right: lead form card */}
          <div className="mt-12 lg:mt-0 w-full lg:w-[400px] shrink-0">
            <div className="bg-white rounded-card shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-6 md:p-8">
              <h2 className="font-sora font-bold text-xl text-dark mb-1">
                Get a free audit
              </h2>
              <p className="font-poppins text-sm text-muted mb-6">
                We&apos;ll review your Grab store and social pages — no commitment.
              </p>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="bg-dark py-4 overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-4 mx-6">
                <span className="font-poppins font-semibold text-sm text-white/80 uppercase tracking-widest">
                  {item}
                </span>
                <span className="text-green text-lg">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-card p-6 md:p-8">
              <div className="font-sora font-extrabold text-3xl md:text-4xl text-dark mb-2">
                {s.value}
              </div>
              <div className="font-poppins text-sm text-muted leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 pb-16 md:pb-24">
        <div className="mb-10">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
            What We Do
          </p>
          <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-dark tracking-tight">
            Two ways we grow<br className="hidden md:block" /> your restaurant
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-card p-8 flex flex-col gap-5 group hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="w-12 h-12 bg-green-light rounded-xl flex items-center justify-center">
                {s.icon}
              </div>
              <div>
                <span className="font-poppins text-[10px] font-bold text-green uppercase tracking-[1.5px] mb-2 block">
                  {s.tag}
                </span>
                <h3 className="font-sora font-bold text-xl text-dark mb-3">
                  {s.title}
                </h3>
                <p className="font-poppins text-sm text-muted leading-relaxed">
                  {s.description}
                </p>
              </div>
              <Link
                href={s.href}
                className="inline-flex items-center gap-2 font-poppins text-sm font-semibold text-dark mt-auto group-hover:text-green transition-colors"
              >
                {s.cta}
                <span className="w-6 h-6 rounded-full bg-green/10 flex items-center justify-center group-hover:bg-green group-hover:text-white transition-all text-xs">
                  →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Client logos / proof ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 pb-16 md:pb-24">
        <div className="bg-white rounded-card p-8 md:p-12">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-4 text-center">
            Our Clients
          </p>
          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight text-center mb-10">
            18 restaurants trust us to grow their business
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Okasan', 'Bacio', 'Semolina', 'Pitmaster', 'Sudo Social',
              'Kynd Kulture', 'Kaneumi', 'Jumama', 'YUN', 'RaLuek',
              'Toh D', 'Vstreet', 'Jagumsong', 'APG x Sinnic',
              'Ballistic Pizza', 'Lamaya BKK', 'Royal Pizza', 'Khao Yai - Lamaya',
            ].map((name) => (
              <span
                key={name}
                className="font-poppins text-sm font-medium text-body bg-[#EDEDED] px-4 py-2 rounded-pill"
              >
                {name}
              </span>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/work"
              className="inline-block bg-dark text-white font-poppins font-semibold text-sm px-8 py-3.5 rounded-pill hover:bg-dark/90 transition-all active:scale-[0.98]"
            >
              See All Client Work
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
