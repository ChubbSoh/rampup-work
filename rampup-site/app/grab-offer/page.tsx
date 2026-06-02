import Footer from '@/components/Footer'
import GrabResultsSection from '@/components/GrabResultsSection'
import LeadForm from './LeadForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Done-for-you Grab store optimization | RampUp',
  description:
    'We rebuild your Grab store once — photos, menu, campaigns — and hand it back. No retainer.',
}

const whatYouGet = [
  {
    title: 'On-site photoshoot',
    line: 'We come to your restaurant and reshoot up to 20 dishes so your food looks premium in the app.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="7" width="22" height="16" rx="3" stroke="#3DBE5A" strokeWidth="2"/>
        <circle cx="14" cy="15" r="4.5" stroke="#3DBE5A" strokeWidth="2"/>
        <path d="M9.5 7l1.5-2.5h6L18.5 7" stroke="#3DBE5A" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Full menu rebuild',
    line: 'Restructured for delivery: clear best-sellers, smart pricing, upsells and combos to grow basket size. Built on our proven Grab template.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="3" width="18" height="22" rx="2.5" stroke="#3DBE5A" strokeWidth="2"/>
        <path d="M9 9h10M9 14h10M9 19h6" stroke="#3DBE5A" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Grab campaigns set up',
    line: 'We join every campaign worth joining and set your store up to win.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 18L9 13L13 17L24 6" stroke="#3DBE5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 6h7v7" stroke="#3DBE5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Your playbook',
    line: 'A simple guide so you keep running it yourself after. No monthly fees.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M5 5h14a2 2 0 012 2v16l-4-2-4 2-4-2-4 2V7a2 2 0 012-2z" stroke="#3DBE5A" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

const howItWorks = [
  { n: '01', title: 'Apply',         body: 'Fill the short form.' },
  { n: '02', title: 'Free audit',    body: 'We review your Grab store to see if we can help. We only take restaurants we can move the needle for.' },
  { n: '03', title: 'On-site shoot', body: 'We come to you, reshoot your food, rebuild your menu.' },
  { n: '04', title: 'You approve',   body: 'You review the new menu structure. That’s the only thing we need from you.' },
  { n: '05', title: 'Go live',       body: 'We upload and update everything (3–5 days). Results typically show within one month of going live.' },
]

function PrimaryCta({ label = 'Fix my Grab store', href = '#apply' }: { label?: string; href?: string }) {
  return (
    <a
      href={href}
      className="inline-block bg-[#3DBE5A] text-white font-poppins font-bold text-base px-10 py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] uppercase tracking-wide"
    >
      {label}
    </a>
  )
}

export default function GrabOfferPage() {
  return (
    <main className="min-h-[100dvh] bg-[#EDEDED] scroll-smooth">

      {/* ── NAV ── */}
      <div className="max-w-site mx-auto px-5 md:px-12 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-rampup-accent.svg" alt="RampUp" className="h-6 md:h-[31px] w-auto" />
      </div>

      {/* ── 1. HERO ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 pt-10 pb-12 md:pt-14 md:pb-16 text-center">
        <h1 className="font-sora font-extrabold text-[clamp(2.2rem,6vw,4rem)] leading-[1.05] tracking-tight text-dark mb-5 max-w-3xl mx-auto">
          Increase your Grab sales.
        </h1>
        <p className="font-poppins text-base md:text-xl text-muted leading-relaxed max-w-2xl mx-auto mb-8">
          Better photos, better menu, bigger basket size — all fixed in one go.
        </p>
        <PrimaryCta />
        <p className="font-sora font-bold text-base md:text-lg text-muted mt-4">
          ฿39,990 one-time
        </p>
        <p className="font-poppins text-sm italic text-muted mt-1 max-w-md mx-auto">
          Pay once. No lock-in, no monthly fees.
        </p>
      </section>

      {/* ── 2. PROOF (shared component) ── */}
      <GrabResultsSection
        heading="See Real Results"
        limit={3}
        footerLine="25+ restaurants across Thailand, Singapore, Vietnam & Malaysia."
      />

      {/* ── 2b. BEFORE / AFTER ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-12 md:py-16">
        <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-dark tracking-tight mb-3 text-center">
          Before &amp; After
        </h2>
        <p className="font-poppins text-base md:text-lg text-muted text-center mb-8 max-w-xl mx-auto">
          This is what &quot;fixed once&quot; actually looks like.
        </p>
        <div className="flex flex-col gap-3 md:gap-5 max-w-2xl mx-auto">
          {[
            { before: '/results/proof-1-before.jpg', after: '/results/proof-1-after.jpg' },
            { before: '/results/proof-2-before.jpg', after: '/results/proof-2-after.jpg' },
          ].map((pair, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-3 md:gap-5">
              {([
                { label: 'BEFORE' as const, src: pair.before },
                { label: 'AFTER'  as const, src: pair.after  },
              ]).map(({ label, src }) => (
                <div key={label} className="relative rounded-2xl overflow-hidden bg-[#E4E4E4] shadow-[0_2px_16px_rgba(0,0,0,0.06)]" style={{ aspectRatio: '9/16' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={label} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-top" />
                  <div className="absolute inset-x-0 top-0 h-[18%] z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, transparent 100%)' }} />
                  <div className="absolute inset-x-0 bottom-0 h-[18%] z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.85) 0%, transparent 100%)' }} />
                  <span className={`absolute top-3 left-3 font-poppins text-[11px] font-bold px-2.5 py-1 rounded-full text-white z-10 ${label === 'BEFORE' ? 'bg-[#9E9E9E]' : 'bg-[#3DBE5A]'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. WHAT YOU GET ── */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-site mx-auto px-5 md:px-12">
          <div className="text-center mb-10">
            <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
              Done For You — One Time
            </p>
            <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-dark tracking-tight max-w-2xl mx-auto">
              What you get
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {whatYouGet.map((w) => (
              <div key={w.title} className="bg-[#F5F5F5] rounded-2xl p-6 md:p-7 flex flex-col gap-3">
                <div className="w-12 h-12 bg-green-light rounded-xl flex items-center justify-center">
                  {w.icon}
                </div>
                <h3 className="font-sora font-bold text-lg md:text-xl text-dark leading-tight">
                  {w.title}
                </h3>
                <p className="font-poppins text-sm md:text-base text-body leading-relaxed">
                  {w.line}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <PrimaryCta />
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ── */}
      <section className="bg-black py-14 md:py-20">
        <div className="max-w-site mx-auto px-5 md:px-12">
          <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-white tracking-tight mb-10 text-center">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {howItWorks.map((s) => (
              <div key={s.n} className="bg-white/[0.06] border border-white/10 rounded-2xl p-5 md:p-6">
                <p className="font-sora font-extrabold text-2xl text-green mb-2">{s.n}</p>
                <h3 className="font-sora font-bold text-base md:text-lg text-white mb-1.5 leading-tight">
                  {s.title}
                </h3>
                <p className="font-poppins text-sm text-white/60 leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. PRICE ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-14 md:py-20">
        <div className="max-w-lg mx-auto bg-white rounded-[24px] shadow-[0_4px_32px_rgba(0,0,0,0.07)] overflow-hidden">
          <div className="bg-dark text-white text-center px-7 py-7 md:px-10 md:py-8">
            <p className="font-poppins text-[11px] font-bold uppercase tracking-[2px] text-green mb-2">
              One-time fee
            </p>
            <p className="font-sora font-extrabold text-4xl md:text-5xl tracking-tight">
              ฿39,990
            </p>
            <p className="font-poppins text-sm text-white/60 mt-2">
              No retainer. No lock-in. You own it.
            </p>
          </div>
          <div className="px-7 py-7 md:px-10 md:py-8 text-center">
            <p className="font-poppins text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-2">
              Effort from you
            </p>
            <p className="font-sora font-bold text-lg text-dark mb-6">
              Approve the new menu. That&apos;s it.
            </p>
            <PrimaryCta />
          </div>
        </div>
      </section>

      {/* ── 7. FINAL CTA / FORM ── */}
      <section id="apply" className="max-w-site mx-auto px-5 md:px-12 pb-20">
        <h2 className="font-sora font-extrabold text-2xl md:text-4xl text-dark tracking-tight mb-3 text-center">
          Apply for your free Grab audit
        </h2>
        <p className="font-poppins text-base md:text-lg text-muted text-center mb-10 max-w-xl mx-auto">
          We&apos;ll review your store within 24 hours and let you know if we can help.
        </p>
        <div className="max-w-xl mx-auto bg-white rounded-[24px] shadow-[0_4px_32px_rgba(0,0,0,0.07)] p-7 md:p-10">
          <LeadForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
