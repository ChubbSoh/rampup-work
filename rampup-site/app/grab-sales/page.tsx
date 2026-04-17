import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getAllClients } from '@/lib/clients'

export const metadata = {
  title: 'Grab Sales Growth — Restaurant RampUp',
  description:
    'We grow your Grab Food revenue through store optimisation, targeted ads, and smart promotions. Bangkok-based restaurant marketing.',
}

const steps = [
  {
    num: '1',
    title: 'Grab Store Audit',
    body: 'We review your menu, photos, pricing, packaging, and store SEO. Most restaurants are losing 30–50% of potential orders from poor presentation alone.',
  },
  {
    num: '2',
    title: 'Menu Optimisation',
    body: "We restructure your menu architecture, rewrite item names and descriptions, and identify hero items to push. Higher average order value, higher conversion.",
  },
  {
    num: '3',
    title: 'Photo & Video shoot',
    body: 'Professional food photography every month. Grab stores with high-quality images convert 2–3x better than stores with stock or phone photos.',
  },
  {
    num: '4',
    title: 'Promotion Strategy',
    body: 'We plan and run your Grab promotions, discount structure, and voucher strategy to maximise revenue — not just order volume.',
  },
  {
    num: '5',
    title: 'Grab Ads Management',
    body: 'We manage your Grab Ad spend, targeting, bidding, and creatives. Every baht tracked to actual orders.',
  },
  {
    num: '6',
    title: 'Monthly Reporting',
    body: 'Clear revenue reports, order tracking, and growth insights every month. No agency jargon — just numbers.',
  },
]

const faqs = [
  {
    q: 'How long before I see results?',
    a: 'Most clients see measurable Grab revenue improvement within 30–60 days of launch. Store optimisation and photography have the fastest impact.',
  },
  {
    q: 'Do I need to already be on Grab?',
    a: "No — we can help you get set up on Grab from scratch. If you're already on Grab, we'll take what you have and grow it.",
  },
  {
    q: 'What restaurants do you work with?',
    a: 'We work with all cuisine types and restaurant sizes — from single-location Thai restaurants to multi-branch groups. Bangkok-based team, Thai-speaking.',
  },
  {
    q: 'Is there a contract?',
    a: 'Month-to-month. No lock-in contracts. We keep clients by delivering results.',
  },
]

export default async function GrabSalesPage() {
  const allClients = getAllClients()
  const proofClients = allClients.filter((c) => c.cover).slice(0, 6)

  return (
    <>
      <Nav />
      <main className="min-h-[100dvh] bg-[#EDEDED]">
        {/* ── Hero ── */}
        <section className="max-w-site mx-auto px-5 md:px-12 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-2xl">
            <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-4">
              Grab Sales Growth
            </p>
            <h1 className="font-sora font-extrabold text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.1] tracking-tight text-dark mb-6">
              3x your Grab revenue.<br />
              <span className="text-green">Guaranteed growth.</span>
            </h1>
            <p className="font-poppins text-base md:text-lg text-muted leading-relaxed mb-8 max-w-xl">
              We optimise your Grab storefront, run your ads, and manage promotions so you can focus on cooking. Most clients 2–4x their delivery revenue within 90 days.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="bg-green text-white font-poppins font-semibold text-sm px-6 py-3.5 rounded-pill hover:brightness-105 transition-all active:scale-[0.98]"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <div className="bg-dark py-10">
          <div className="max-w-site mx-auto px-5 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '3x', label: 'Average revenue growth' },
                { value: '0', label: 'Risk' },
                { value: '18+', label: 'Restaurant clients' },
                { value: '50M+', label: 'THB Generated' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-sora font-extrabold text-3xl md:text-4xl text-green mb-1">
                    {s.value}
                  </div>
                  <div className="font-poppins text-xs text-white/50 leading-snug">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <section className="py-20 md:py-24">
          <div className="max-w-site mx-auto px-5 md:px-12">
            <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
              Results
            </p>
            <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-dark tracking-tight mb-3">
              Real Restaurants<br />Real Results
            </h2>
            <p className="font-poppins text-sm text-muted mb-12">
              Actual revenue growth from restaurants we work with
            </p>

            {/* Desktop grid / Mobile horizontal scroll */}
            <div
              className="flex gap-5 md:grid md:grid-cols-2 md:gap-5"
              style={{
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {[
                { before: '฿665K', after: '฿1.25M', timeframe: '2 months', growth: '1.9x growth', monthly: '+฿295K / month', beforeImg: '/results/proof-1-after.jpg', afterImg: '/results/proof-1-before.jpg' },
                { before: '฿300K', after: '฿628K',  timeframe: '2 months', growth: '2.1x growth', monthly: '+฿328K / month', beforeImg: '/results/proof-2-before.jpg', afterImg: '/results/proof-2-after.jpg' },
                { before: '฿127K', after: '฿249K',  timeframe: '4 months', growth: '2x growth',   monthly: '+฿122K / month', beforeImg: '/results/proof-3-before.jpg', afterImg: '/results/proof-3-after.jpg' },
                { before: '฿431K', after: '฿814K',  timeframe: '5 months', growth: '1.9x growth', monthly: '+฿383K / month', beforeImg: '/results/proof-4-before.jpg', afterImg: '/results/proof-4-after.jpg' },
              ].map((card) => (
                <div
                  key={card.before}
                  className="shrink-0 w-[80vw] md:w-auto bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {/* Header */}
                  <p className="font-sora font-bold text-[17px] text-dark leading-tight mb-0.5">
                    {card.before} → {card.after}
                  </p>
                  <p className="font-poppins text-[11px] text-muted/70 mb-4">
                    Results achieved in {card.timeframe}
                  </p>

                  {/* Before / After images */}
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {([
                      { label: 'BEFORE' as const, src: card.beforeImg },
                      { label: 'AFTER'  as const, src: card.afterImg  },
                    ]).map(({ label, src }) => (
                      <div
                        key={label}
                        className="relative rounded-[12px] overflow-hidden bg-[#E4E4E4]"
                        style={{ aspectRatio: '9/16' }}
                      >
                        {src && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={src} alt={label} className="absolute inset-0 w-full h-full object-cover object-top" />
                        )}
                        {/* Top fade */}
                        <div className="absolute inset-x-0 top-0 h-[20%] z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, transparent 100%)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }} />
                        {/* Bottom fade */}
                        <div className="absolute inset-x-0 bottom-0 h-[20%] z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.85) 0%, transparent 100%)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', maskImage: 'linear-gradient(to top, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)' }} />
                        <span
                          className={`absolute top-2 left-2 font-poppins text-[10px] font-bold px-2 py-1 rounded-full text-white z-10 ${
                            label === 'BEFORE' ? 'bg-[#9E9E9E]' : 'bg-[#3DBE5A]'
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Results */}
                  <p className="font-sora font-extrabold text-2xl text-green mb-0.5">{card.growth}</p>
                  <p className="font-poppins text-sm font-semibold text-dark mb-0.5">{card.monthly}</p>
                  <p className="font-poppins text-[11px] text-muted/70">Average monthly increase in revenue</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="max-w-site mx-auto px-5 md:px-12 py-20 md:py-28">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
            How It Works
          </p>
          <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-dark tracking-tight mb-12">
            Everything we do to grow<br className="hidden md:block" /> your Grab revenue
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map((s) => (
              <div key={s.num} className="bg-white rounded-card p-7">
                <span className="font-sora font-extrabold text-4xl text-green/50 block mb-4">
                  {s.num}
                </span>
                <h3 className="font-sora font-bold text-lg text-dark mb-3">{s.title}</h3>
                <p className="font-poppins text-sm text-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Our Work ── */}
        {proofClients.length > 0 && (
          <section className="max-w-site mx-auto px-5 md:px-12 pb-20">
            <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
              Our work
            </p>
            <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-dark tracking-tight mb-2">
              Grow your socials<br />Get more brand awareness
            </h2>
            <div className="mt-4 mb-8">
              <Link
                href="/work"
                className="font-poppins text-sm font-semibold text-green hover:underline transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {proofClients.map((c) => (
                <Link key={c.slug} href={`/work/${c.slug}`} className="group relative rounded-[16px] overflow-hidden bg-[#2D2D2D] aspect-[3/4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.cover!}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-sora font-bold text-white text-sm leading-tight">{c.name}</p>
                    <p className="font-poppins text-[11px] text-white/60 capitalize">{c.cuisine}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href="/work"
                className="inline-block bg-white text-dark font-poppins font-semibold text-sm px-6 py-3.5 rounded-pill border border-black/10 hover:border-black/20 transition-all active:scale-[0.98]"
              >
                See more →
              </Link>
            </div>
          </section>
        )}

        {/* ── FAQ ── */}
        <section className="max-w-site mx-auto px-5 md:px-12 pb-20">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
            FAQ
          </p>
          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-10">
            Common questions
          </h2>
          <div className="flex flex-col gap-4 max-w-2xl">
            {faqs.map((f) => (
              <div key={f.q} className="bg-white rounded-card p-6">
                <h3 className="font-sora font-bold text-base text-dark mb-2">{f.q}</h3>
                <p className="font-poppins text-sm text-muted leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-site mx-auto px-5 md:px-12 pb-24">
          <div className="bg-green rounded-card p-8 md:p-12 text-center">
            <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-3">
              Ready to grow your Grab revenue?
            </h2>
            <p className="font-poppins text-sm text-white/70 mb-8 max-w-sm mx-auto">
              Get a free audit of your Grab store. We&apos;ll show you exactly what&apos;s costing you orders.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-dark font-poppins font-semibold text-sm px-8 py-4 rounded-pill hover:bg-white/90 transition-all active:scale-[0.98]"
            >
              Get My Free Audit →
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
