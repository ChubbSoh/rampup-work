import Link from 'next/link'
import LeadForm from '@/components/LeadForm'
import Footer from '@/components/Footer'
import { getAllClients } from '@/lib/clients'
import PricingCard from '@/components/PricingCard'
import { th } from '@/lib/translations'

export const metadata = {
  title: 'Restaurant RampUp — เอเจนซี่การตลาดร้านอาหารกรุงเทพฯ',
  description: 'เราช่วยร้านอาหารกรุงเทพฯ เติบโตบน Grab, Instagram, TikTok และ Facebook',
  alternates: {
    canonical: 'https://rampupth.com/th',
    languages: { 'en': 'https://rampupth.com', 'th': 'https://rampupth.com/th' },
  },
}

const tickerItems = ['Grab', 'Lineman', 'FoodPanda', 'Instagram', 'Facebook', 'TikTok', 'LINE OA']

export default function ThHomePage() {
  const allClients = getAllClients()
  const carouselClients = allClients.filter((c) => c.cover)
  const t = th.home

  return (
    <main className="min-h-[100dvh] bg-[#EDEDED]">
      {/* ── Top bar ── */}
      <div className="px-5 md:px-12 py-5 flex items-center justify-between max-w-site mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-rampup-accent.svg" alt="RampUp" className="h-8 md:h-9 w-auto object-contain" />
        <Link
          href="/th/work"
          className="font-poppins text-sm font-medium text-body hover:text-dark transition-colors"
        >
          {th.nav.seeWork}
        </Link>
      </div>

      {/* ── 1. HERO ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-20">
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-green-light border border-green/20 rounded-tag px-3 py-1 mb-6">
              <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
              <span className="font-poppins text-[11px] font-bold text-green uppercase tracking-[1.5px]">
                {t.badge}
              </span>
            </div>

            <h1 className="font-sora font-extrabold text-[clamp(2.4rem,6vw,3.8rem)] leading-[1.08] tracking-tight text-dark mb-5">
              {t.h1Line1}<br />
              {t.h1Line2}<br />
              <span className="text-green">{t.h1Line3}</span>
            </h1>

            <p className="font-poppins text-base md:text-lg text-muted leading-relaxed mb-8 max-w-[480px]">
              {t.subheading}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/th/work"
                className="bg-green text-white font-poppins font-semibold text-sm px-6 py-3 rounded-pill hover:brightness-105 transition-all active:scale-[0.98]"
              >
                {t.ctaWork}
              </Link>
            </div>

            <p className="font-poppins text-sm text-faint italic mb-3">{t.socialProof}</p>
            <div className="flex items-center gap-5">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[26px] h-[26px] text-muted">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[26px] h-[26px] text-muted">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[26px] h-[26px] text-muted">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z"/>
              </svg>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[26px] h-[26px] text-muted">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>

          {/* Form */}
          <div className="mt-12 lg:mt-0 w-full lg:w-[400px] shrink-0">
            <div className="bg-white rounded-card shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-6 md:p-8">
              <h2 className="font-sora font-bold text-xl text-dark mb-1">{t.formHeading}</h2>
              <p className="font-poppins text-sm text-muted mb-6">{t.formSubtext}</p>
              <LeadForm lang="th" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CLIENTS CAROUSEL ── */}
      <section className="pt-8 pb-8 md:pb-12 overflow-hidden">
        <div className="max-w-site mx-auto px-5 md:px-12 mb-8">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3 text-center">
            {t.clientsTag}
          </p>
          <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-dark tracking-tight text-center">
            {t.clientsH2}
          </h2>
        </div>
        <div className="carousel-wrap py-2">
          <div className="carousel-track">
            {[...carouselClients, ...carouselClients].map((client, i) => (
              <Link
                key={i}
                href={`/th/work/${client.slug}`}
                className="shrink-0 w-[260px] bg-white rounded-[18px] overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 block"
              >
                <div className="relative w-full aspect-[3/4] bg-[#EDEDED] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={client.cover} alt={client.name} className="w-full h-full object-cover" loading="lazy" />
                  <span className="absolute bottom-2.5 left-2.5 font-poppins text-[10px] font-semibold uppercase tracking-[1px] bg-black/50 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {client.cuisine}
                  </span>
                </div>
                <div className="px-4 py-3.5">
                  <p className="font-sora font-bold text-[14px] text-dark truncate">{client.name}</p>
                  <p className="font-poppins text-[11px] text-muted mt-0.5">{client.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="text-center mt-8">
          <Link
            href="/th/work"
            className="inline-block font-poppins text-sm font-semibold text-dark border border-black/10 px-6 py-2.5 rounded-pill hover:border-black/20 transition-all"
          >
            {t.seeAllWork}
          </Link>
        </div>
      </section>

      {/* ── 3. TWO WAYS ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-16 md:py-24">
        <div className="mb-10">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
            {t.whatWeDoTag}
          </p>
          <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-dark tracking-tight">
            {t.whatWeDoH2}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.services.map((s) => (
            <div key={s.title} className="bg-white rounded-card p-8 flex flex-col gap-5 group hover:-translate-y-1 transition-transform duration-200">
              <div className="w-12 h-12 bg-green-light rounded-xl flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 3L25 8.5V19.5L14 25L3 19.5V8.5L14 3Z" stroke="#3DBE5A" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <span className="font-poppins text-[10px] font-bold text-green uppercase tracking-[1.5px] mb-2 block">{s.tag}</span>
                <h3 className="font-sora font-bold text-xl text-dark mb-3">{s.title}</h3>
                <p className="font-poppins text-sm text-muted leading-relaxed">{s.description}</p>
              </div>
              <Link
                href={s.href}
                className="inline-flex items-center gap-2 font-poppins text-sm font-semibold text-dark mt-auto group-hover:text-green transition-colors"
              >
                {s.cta}
                <span className="w-6 h-6 rounded-full bg-green/10 flex items-center justify-center group-hover:bg-green group-hover:text-white transition-all text-xs">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. TICKER ── */}
      <div className="bg-dark py-4 overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-4 mx-6">
                <span className="font-poppins font-semibold text-sm text-white/80 uppercase tracking-widest whitespace-nowrap">{item}</span>
                <span className="text-green text-lg">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. STATS ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {t.stats.map((s) => (
            <div key={s.label} className="bg-white rounded-card p-6 md:p-8">
              <div className="font-sora font-extrabold text-3xl md:text-4xl text-dark mb-2">{s.value}</div>
              <div className="font-poppins text-sm text-muted leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <PricingCard hideCta stacked lang="th" />

      <Footer lang="th" />
    </main>
  )
}
