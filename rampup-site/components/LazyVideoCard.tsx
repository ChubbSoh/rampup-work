'use client'

import { useState } from 'react'

interface Props {
  videoId: string
  customerCode: string
  label: string
}

export default function LazyVideoCard({ videoId, customerCode, label }: Props) {
  const [playing, setPlaying] = useState(false)

  const thumbnailUrl = `https://customer-${customerCode}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg?height=360`
  const iframeSrc    = `https://customer-${customerCode}.cloudflarestream.com/${videoId}/iframe?primaryColor=3DBE5A&muted=true&autoplay=true`

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-black cursor-pointer"
      style={{ aspectRatio: '9/16' }}
      onClick={() => setPlaying(true)}
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
        </>
      )}
    </div>
  )
}
