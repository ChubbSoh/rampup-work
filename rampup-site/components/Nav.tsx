'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { th } from '@/lib/translations'

const enLinks = [
  { href: '/work',         label: 'Our Work' },
  { href: '/grab-sales',   label: 'Grab Sales' },
  { href: '/social-media', label: 'Social Media' },
]

const thLinks = [
  { href: '/th/work',         label: th.nav.work },
  { href: '/th/grab-sales',   label: th.nav.grabSales },
  { href: '/th/social-media', label: th.nav.socialMedia },
]

function getAltHref(pathname: string, isTh: boolean): string {
  if (isTh) {
    const stripped = pathname.replace(/^\/th/, '') || '/'
    return stripped
  }
  return '/th' + (pathname === '/' ? '' : pathname)
}

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isTh = pathname.startsWith('/th')
  const links = isTh ? thLinks : enLinks
  const applyHref = isTh ? '/th/contact' : '/contact'
  const applyLabel = isTh ? th.nav.apply : 'Apply now!'
  const altHref = getAltHref(pathname, isTh)

  return (
    <nav className="sticky top-0 z-50 bg-[#EDEDED] border-b border-black/[0.08] h-16">
      <div className="max-w-site mx-auto px-5 md:px-12 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href={isTh ? '/th' : '/'} className="flex items-center">
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
                pathname === l.href || pathname.startsWith(l.href + '/')
                  ? 'text-green'
                  : 'text-body hover:text-dark'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={applyHref}
            className="bg-green text-white font-poppins text-sm font-semibold px-5 py-2.5 rounded-pill hover:brightness-105 transition-all active:scale-[0.98]"
          >
            {applyLabel}
          </Link>
          {/* Language switcher */}
          <Link
            href={altHref}
            className="font-poppins text-xs font-semibold text-body hover:text-dark transition-colors border border-black/10 rounded-full px-3 py-1"
          >
            {isTh ? 'EN' : 'TH'}
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
          <Link href={isTh ? '/th' : '/'} onClick={() => setOpen(false)}>
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
              className={`font-sora font-extrabold text-2xl py-3 transition-colors ${
                pathname === l.href ? 'text-green' : 'text-dark'
              }`}
              style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={applyHref}
            onClick={() => setOpen(false)}
            className="mt-6 bg-green text-white font-poppins text-base font-semibold px-6 py-4 rounded-pill text-center"
          >
            {applyLabel} →
          </Link>
          <Link
            href={altHref}
            onClick={() => setOpen(false)}
            className="mt-3 font-poppins text-sm font-semibold text-body text-center py-2"
          >
            {isTh ? 'English version' : 'ภาษาไทย'}
          </Link>
        </div>
      </div>
    </nav>
  )
}
