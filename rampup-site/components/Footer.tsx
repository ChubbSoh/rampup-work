import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-24">
      <div className="max-w-site mx-auto px-5 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Logo */}
          <div>
            <div className="font-sora font-extrabold text-xl mb-2">
              <span className="text-white">RAMP</span>
              <span className="text-green">UP</span>
            </div>
            <p className="font-poppins text-sm text-white/50 max-w-[260px]">
              Thailand&apos;s restaurant growth agency. Grab Sales + Social Media.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <p className="font-poppins text-xs font-semibold uppercase tracking-widest text-white/30">
              Pages
            </p>
            <div className="flex flex-col gap-2">
              {[
                { href: '/work', label: 'Our Work' },
                { href: '/grab-sales', label: 'Grab Sales' },
                { href: '/social-media', label: 'Social Media' },
                { href: '/contact', label: 'Contact' },
              ].map((l) => (
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
            <p className="font-sora font-bold text-lg mb-4">
              Ready to grow your<br />restaurant?
            </p>
            <Link
              href="/contact"
              className="inline-block bg-green text-white font-poppins text-sm font-semibold px-6 py-3 rounded-pill hover:brightness-105 transition-all active:scale-[0.98]"
            >
              Get Started Free
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-poppins text-xs text-white/30">
            © {new Date().getFullYear()} Restaurant RampUp. All rights reserved.
          </p>
          <p className="font-poppins text-xs text-white/30">
            Bangkok, Thailand
          </p>
        </div>
      </div>
    </footer>
  )
}
