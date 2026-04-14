'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/work', label: 'Our Work' },
  { href: '/grab-sales', label: 'Grab Sales' },
  { href: '/social-media', label: 'Social Media' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#EDEDED] border-b border-black/[0.08] h-16">
      <div className="max-w-site mx-auto px-5 md:px-12 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-sora font-extrabold text-xl tracking-tight">
          <span className="text-dark">RAMP</span>
          <span className="text-green">UP</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-poppins text-sm font-medium transition-colors ${
                pathname === l.href ? 'text-green' : 'text-body hover:text-dark'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-green text-white font-poppins text-sm font-semibold px-5 py-2.5 rounded-pill hover:brightness-105 transition-all active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-dark transition-transform duration-300 ${
              open ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-dark transition-opacity duration-300 ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-dark transition-transform duration-300 ${
              open ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-16 left-0 right-0 bg-[#EDEDED] border-b border-black/[0.08] overflow-hidden transition-all duration-300 ${
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 py-4 flex flex-col gap-1">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`font-poppins text-base font-medium py-3 border-b border-black/[0.06] transition-colors ${
                pathname === l.href ? 'text-green' : 'text-body'
              }`}
              style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 bg-green text-white font-poppins text-sm font-semibold px-5 py-3 rounded-pill text-center"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}
