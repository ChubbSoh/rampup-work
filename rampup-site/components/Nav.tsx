'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/work', label: 'Our Work' },
  { href: '/grab-sales', label: 'Grab Sales' },
  { href: '/social-media', label: 'Social Media' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#EDEDED] border-b border-black/[0.08] h-16">
      <div className="max-w-site mx-auto px-5 md:px-12 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-rampup-accent.svg"
            alt="RampUp"
            className="h-8 md:h-10 w-auto object-contain"
          />
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
            Apply now!
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

      {/* Mobile fullscreen menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-[#EDEDED] flex flex-col transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Close button row */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-black/[0.08]">
          <Link href="/" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-rampup-accent.svg" alt="RampUp" className="h-8 w-auto object-contain" />
          </Link>
          <button
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <span className="block w-6 h-0.5 bg-dark rotate-45 translate-y-2 transition-transform duration-300" />
            <span className="block w-6 h-0.5 bg-dark opacity-0" />
            <span className="block w-6 h-0.5 bg-dark -rotate-45 -translate-y-2 transition-transform duration-300" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 flex flex-col justify-center px-8 gap-2">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`font-sora font-extrabold text-4xl py-3 transition-colors ${
                pathname === l.href ? 'text-green' : 'text-dark'
              }`}
              style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-6 bg-green text-white font-poppins text-base font-semibold px-6 py-4 rounded-pill text-center"
          >
            Apply now! →
          </Link>
        </div>
      </div>
    </nav>
  )
}
