import Link from 'next/link'
import { th, type Lang } from '@/lib/translations'

export default function Footer({ lang = 'en' }: { lang?: Lang }) {
  const isTh = lang === 'th'
  const base = isTh ? '/th' : ''

  const tagline = isTh
    ? th.footer.tagline
    : "Thailand's restaurant growth agency. Grab Sales + Social Media."

  const pagesLabel = isTh ? th.footer.pagesLabel : 'Pages'

  const navLinks = isTh
    ? [
        { href: `${base}/work`,         label: th.footer.links.work },
        { href: `${base}/grab-sales`,   label: th.footer.links.grabSales },
        { href: `${base}/social-media`, label: th.footer.links.socialMedia },
        { href: `${base}/contact`,      label: th.footer.links.contact },
      ]
    : [
        { href: '/work',         label: 'Our Work' },
        { href: '/grab-sales',   label: 'Grab Sales' },
        { href: '/social-media', label: 'Social Media' },
        { href: '/contact',      label: 'Contact' },
      ]

  const ctaHeading = isTh ? th.footer.ctaHeading : 'Ready to grow your\nrestaurant?'
  const ctaButton  = isTh ? th.footer.ctaButton  : 'Get Started Free'
  const location   = isTh ? th.footer.location   : 'Bangkok, Thailand'

  return (
    <footer className="bg-dark text-white mt-24">
      <div className="max-w-site mx-auto px-5 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Logo */}
          <div>
            <img src="/logo-rampup-accent.svg" alt="RampUp" className="h-8 w-auto object-contain mb-3" />
            <p className="font-poppins text-sm text-white/50 max-w-[260px]">
              {tagline}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <p className="font-poppins text-xs font-semibold uppercase tracking-widest text-white/30">
              {pagesLabel}
            </p>
            <div className="flex flex-col gap-2">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="font-poppins text-sm text-white/60 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div>
            <p className="font-sora font-bold text-lg mb-4 whitespace-pre-line">
              {ctaHeading}
            </p>
            <Link
              href={`${base}/contact`}
              className="inline-block bg-green text-white font-poppins text-sm font-semibold px-6 py-3 rounded-pill hover:brightness-105 transition-all active:scale-[0.98]"
            >
              {ctaButton}
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-poppins text-xs text-white/30">
            © {new Date().getFullYear()} Restaurant RampUp. All rights reserved.
          </p>
          <p className="font-poppins text-xs text-white/30">
            {location}
          </p>
        </div>
      </div>
    </footer>
  )
}
