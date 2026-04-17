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
                { value: '0', label: 'Lock-in contracts' },
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

        {/* ── See the Proof ── */}
        {proofClients.length > 0 && (
          <section className="max-w-site mx-auto px-5 md:px-12 pb-20">
            <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
              See the Proof
            </p>
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-dark tracking-tight">
                Real restaurants.<br className="hidden md:block" /> Real results.
              </h2>
              <Link
                href="/work"
                className="shrink-0 font-poppins text-sm font-semibold text-green hover:underline"
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
