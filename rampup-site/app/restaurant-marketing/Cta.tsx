'use client'

import { useEffect, useRef, useState } from 'react'

/** Smooth-scrolls to the form and records which CTA was used. */
export function CtaLink({
  children, location, variant = 'solid', className = '',
}: {
  children: React.ReactNode
  /** Where on the page this CTA sits — sent with the analytics event. */
  location: string
  variant?: 'solid' | 'outline' | 'light'
  className?: string
}) {
  // Monochrome funnel palette: primary actions are black, hover lifts to the
  // existing `dark` charcoal token. No green anywhere on this route.
  const base =
    'inline-flex items-center justify-center font-poppins font-bold text-[15px] px-8 py-4 rounded-pill transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2'
  const styles = {
    solid: 'bg-[#1A1A1A] text-white hover:bg-dark',
    outline: 'bg-transparent text-dark border border-black/15 hover:border-black/40',
    // Used on the dark pricing band — inverted, so its focus ring needs a light offset.
    light: 'bg-white text-[#1A1A1A] hover:bg-[#ECECEC] focus-visible:ring-white focus-visible:ring-offset-dark',
  }[variant]

  return (
    <a
      href="#plan"
      className={`${base} ${styles} ${className}`}
      onClick={() => (window as any).dataLayer?.push({ event: 'restaurant_lp_cta_click', cta_location: location })}
    >
      {children}
    </a>
  )
}

/**
 * Mobile-only sticky CTA. Hidden until the hero has scrolled away and hidden
 * again once the form is on screen, so it never covers the thing it points at.
 */
export function StickyCta() {
  const [show, setShow] = useState(false)
  const seen = useRef(false)

  useEffect(() => {
    // One-time landing-page view event.
    if (!seen.current) {
      seen.current = true
      ;(window as any).dataLayer?.push({ event: 'restaurant_lp_view' })
    }

    const form = document.getElementById('plan')
    const hero = document.getElementById('hero')
    if (!form || !hero) return

    let heroGone = false
    let formVisible = false
    const sync = () => setShow(heroGone && !formVisible)

    const heroObs = new IntersectionObserver(([e]) => { heroGone = !e.isIntersecting; sync() }, { threshold: 0 })
    const formObs = new IntersectionObserver(([e]) => { formVisible = e.isIntersecting; sync() }, { threshold: 0 })
    heroObs.observe(hero)
    formObs.observe(form)
    return () => { heroObs.disconnect(); formObs.disconnect() }
  }, [])

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 bg-bg/95 backdrop-blur border-t border-black/[0.08] transition-transform duration-300 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!show}
    >
      <a
        href="#plan"
        tabIndex={show ? 0 : -1}
        onClick={() => (window as any).dataLayer?.push({ event: 'restaurant_lp_cta_click', cta_location: 'sticky_mobile' })}
        className="flex items-center justify-center w-full bg-[#1A1A1A] text-white font-poppins font-bold text-[15px] py-3.5 rounded-pill active:scale-[0.99] transition hover:bg-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
      >
        Get Your Marketing Plan
      </a>
    </div>
  )
}
