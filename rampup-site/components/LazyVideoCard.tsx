'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  videoId: string
  customerCode: string
  label: string
  /** Tailwind-style sizes hint; defaults match a 2-col mobile / 3-col desktop layout. */
  sizes?: string
  /** Cap the largest srcset width. Smaller = faster load, less sharp on big screens. Default 800. */
  maxThumbWidth?: 320 | 480 | 640 | 800
}

export default function LazyVideoCard({
  videoId, customerCode, label,
  sizes = '(max-width: 768px) 50vw, 33vw',
  maxThumbWidth = 800,
}: Props) {
  const [playing, setPlaying] = useState(false)
  const [warmed,  setWarmed]  = useState(false)
  const didWarm = useRef(false)

  const streamOrigin = `https://customer-${customerCode}.cloudflarestream.com`
  const thumbBase = `${streamOrigin}/${videoId}/thumbnails/thumbnail.jpg`
  const allWidths: number[] = [320, 480, 640, 800].filter(w => w <= maxThumbWidth)
  const thumbnailUrl    = `${thumbBase}?width=${allWidths[allWidths.length - 1]}`
  const thumbnailSrcSet = allWidths.map(w => `${thumbBase}?width=${w} ${w}w`).join(', ')
  const iframeSrc       = `${streamOrigin}/${videoId}/iframe?primaryColor=3DBE5A&muted=true&autoplay=true`

  // Preconnect to Stream origin once when the card mounts — saves DNS+TLS
  // handshake when the user finally clicks play.
  useEffect(() => {
    if (!customerCode) return
    const existing = document.head.querySelector(`link[data-stream-preconnect="${customerCode}"]`)
    if (existing) return
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = streamOrigin
    link.crossOrigin = 'anonymous'
    link.setAttribute('data-stream-preconnect', customerCode)
    document.head.appendChild(link)
  }, [customerCode, streamOrigin])

  // Warm up the iframe URL on hover/touch — starts loading the player JS
  // before the user actually clicks, so click-to-play feels instant.
  function warmUp() {
    if (didWarm.current) return
    didWarm.current = true
    setWarmed(true)
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-black cursor-pointer"
      style={{ aspectRatio: '9/16' }}
      onClick={() => setPlaying(true)}
      onMouseEnter={warmUp}
      onTouchStart={warmUp}
    >
      {playing ? (
        <iframe
          src={iframeSrc}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
          title={label}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            srcSet={thumbnailSrcSet}
            sizes={sizes}
            alt={label}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/35 transition-colors">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M7 4.5l12 7-12 7V4.5z" fill="#2D2D2D" />
              </svg>
            </div>
          </div>
          {warmed && (
            // Hidden warm-up iframe — preloads the Stream player JS
            // so the click-to-play swap feels instant.
            <iframe
              src={iframeSrc.replace('autoplay=true', 'autoplay=false')}
              aria-hidden
              tabIndex={-1}
              className="absolute -left-[9999px] top-0 w-px h-px opacity-0 pointer-events-none"
              title=""
            />
          )}
        </>
      )}
    </div>
  )
}
