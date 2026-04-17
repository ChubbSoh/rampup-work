import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getAllClients } from '@/lib/clients'

export const metadata = {
  title: 'Social Media Management — Restaurant RampUp',
  description:
    'Monthly photo/video shoots, content creation, and posting across Instagram, TikTok, Facebook, and LINE OA for Bangkok restaurants.',
}

const platforms = [
  {
    name: 'Instagram',
    desc: 'Feed posts, Reels, Stories — a consistent grid that builds brand trust.',
    color: 'bg-pink-50',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="#E1306C" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4.5" stroke="#E1306C" strokeWidth="2"/>
        <circle cx="17.5" cy="6.5" r="1.5" fill="#E1306C"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    desc: 'Short-form video that reaches new customers — especially younger Bangkok diners.',
    color: 'bg-slate-50',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M19 3h-3v10a3 3 0 1 1-3-3v-3a6 6 0 1 0 6 6V8.5A8.5 8.5 0 0 0 19 9V3z" stroke="#010101" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    desc: 'Posts, events, and promotions. Still the #1 platform for Thai restaurant discovery.',
    color: 'bg-blue-50',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" stroke="#1877F2" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'LINE OA',
    desc: 'Direct messaging and broadcast to your most loyal customers in Thailand.',
    color: 'bg-slate-50',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="5" stroke="#00B900" strokeWidth="2"/>
        <path d="M7 10h2m2 0h2m2 0h2" stroke="#00B900" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const deliverables = [
  { label: 'Monthly Shoot', value: '1' },
  { label: 'Posts per Month', value: '18' },
  { label: 'Platforms', value: '4' },
  { label: 'Reels', value: '7' },
]

const process = [
  { num: '01', title: 'Brand Onboarding', body: "We study your restaurant's personality, cuisine, and target customers to build a content strategy that fits." },
  { num: '02', title: 'Monthly Shoot', body: 'Our photographer and videographer come to your restaurant every month. We capture food, atmosphere, and story content.' },
  { num: '03', title: 'Edit & Caption', body: 'We edit, colour-grade, write captions, and schedule everything across all platforms.' },
  { num: '04', title: 'Post & Monitor', body: 'We post at optimal times, respond to comments, and track performance. You focus on the kitchen.' },
]

export default async function SocialMediaPage() {
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
              Social Media Management
            </p>
            <h1 className="font-sora font-extrabold text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.1] tracking-tight text-dark mb-6">
              Seen more. Chosen more.<br />
              <span className="text-green">That&apos;s how restaurants grow.</span>
            </h1>
            <p className="font-poppins text-base md:text-lg text-muted leading-relaxed mb-8 max-w-xl">
              Monthly shoots, professional content creation, and full management across Instagram, TikTok, Facebook, and LINE OA. Built for busy Bangkok restaurant owners.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="bg-green text-white font-poppins font-semibold text-sm px-6 py-3.5 rounded-pill hover:brightness-105 transition-all active:scale-[0.98]"
              >
                Start Growing →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Platforms ── */}
        <section className="max-w-site mx-auto px-5 md:px-12 pb-20">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
            Platforms
          </p>
          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-8">
            We manage all your channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {platforms.map((p) => (
              <div key={p.name} className={`${p.color} rounded-card p-6 flex gap-4 items-start`}>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-sora font-bold text-base text-dark mb-1">{p.name}</h3>
                  <p className="font-poppins text-sm text-muted leading-snug">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Deliverables ── */}
        <div className="bg-dark py-10 mb-20">
          <div className="max-w-site mx-auto px-5 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {deliverables.map((d) => (
                <div key={d.label} className="text-center">
                  <div className="font-sora font-extrabold text-3xl md:text-4xl text-green mb-1">
                    {d.value}
                  </div>
                  <div className="font-poppins text-xs text-white/50 leading-snug">
                    {d.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Our Work ── */}
        {proofClients.length > 0 && (
          <section className="max-w-site mx-auto px-5 md:px-12 pb-20">
            <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
              Our work
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

        {/* ── Process ── */}
        <section className="max-w-site mx-auto px-5 md:px-12 pb-20">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
            Our Process
          </p>
          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-10">
            Done-for-you, every month
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
            {process.map((s) => (
              <div key={s.num} className="bg-white rounded-card p-7">
                <span className="font-sora font-extrabold text-4xl text-green/20 block mb-4">
                  {s.num}
                </span>
                <h3 className="font-sora font-bold text-base text-dark mb-2">{s.title}</h3>
                <p className="font-poppins text-sm text-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="max-w-site mx-auto px-5 md:px-12 pb-20">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
            Pricing
          </p>
          <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-dark tracking-tight mb-8">
            Simple pricing. Real results.
          </h2>

          {/* Main plan + add-ons in one card */}
          <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-7 md:p-10 max-w-2xl">
            <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-2">
              Social Media Growth
            </p>
            <p className="font-sora font-extrabold text-4xl md:text-5xl text-dark mb-1">
              ฿49,990
            </p>
            <p className="font-poppins text-sm text-muted mb-2">/ month</p>
            <p className="font-poppins text-[11px] text-muted/50 mb-7">Ad spend is not included.</p>

            <p className="font-poppins text-xs font-semibold text-dark/50 uppercase tracking-[1.5px] mb-4">Included</p>
            <ul className="flex flex-col gap-3 mb-7">
              {[
                '7 high-quality videos',
                '10 menu items shot & styled',
                '18 posts per month',
                'Instagram, Facebook & TikTok management',
                'Content strategy & planning',
                'Editing, posting & optimization',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-[3px] w-4 h-4 rounded-full bg-[#E8F8ED] flex items-center justify-center shrink-0">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l2 2 3-3" stroke="#3DBE5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="font-poppins text-sm text-body">{item}</span>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="border-t border-black/[0.07] pt-6 mb-5">
              <p className="font-sora font-bold text-sm text-dark mb-4">Add-ons to accelerate growth</p>
              <div className="flex flex-col divide-y divide-black/[0.06]">
                {[
                  { label: 'Grow your Grab sales', price: '฿9,990 / month' },
                  { label: 'Capture Lineman demand', price: '฿4,990 / month' },
                  { label: 'Get found on Google Maps', price: '฿5,990 / month' },
                  { label: 'Turn LINE into a sales channel', price: '฿3,990 / month' },
                ].map((a) => (
                  <div key={a.label} className="flex items-center justify-between py-3">
                    <span className="font-poppins text-sm text-muted">{a.label}</span>
                    <span className="font-poppins text-sm font-semibold text-dark shrink-0 ml-4">{a.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-black/[0.06] flex items-center justify-between">
                <span className="font-poppins text-sm text-muted">Website Design &amp; Build</span>
                <span className="font-poppins text-sm font-semibold text-dark">฿79,990 <span className="font-normal text-muted text-xs">(one-time)</span></span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/contact"
              className="block w-full text-center bg-green text-white font-poppins font-semibold text-sm px-6 py-3.5 rounded-pill hover:brightness-105 transition-all active:scale-[0.98]"
            >
              Apply Now →
            </Link>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-site mx-auto px-5 md:px-12 pb-24">
          <div className="bg-green rounded-card p-8 md:p-12 text-center">
            <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-3">
              Let&apos;s build your restaurant&apos;s brand
            </h2>
            <p className="font-poppins text-sm text-white/70 mb-8 max-w-sm mx-auto">
              Get in touch and we&apos;ll send you examples of content we&apos;ve made for restaurants like yours.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-dark font-poppins font-semibold text-sm px-8 py-4 rounded-pill hover:bg-white/90 transition-all active:scale-[0.98]"
            >
              Get Started Free →
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
