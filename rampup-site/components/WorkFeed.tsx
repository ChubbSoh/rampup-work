'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import type { Client } from '@/lib/types'

const CLOUDFLARE_CUSTOMER_ID = 'h038b69ef3omo1hq'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'italian', label: 'Italian' },
  { value: 'korean', label: 'Korean' },
  { value: 'western', label: 'Western' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'thai', label: 'Thai' },
  { value: 'chinese', label: 'Chinese' },
]

const cuisineColors: Record<string, string> = {
  japanese: 'bg-[#E8F8ED] text-[#3DBE5A]',
  italian: 'bg-orange-50 text-orange-600',
  korean: 'bg-purple-50 text-purple-600',
  western: 'bg-blue-50 text-blue-600',
  nightlife: 'bg-indigo-50 text-indigo-600',
  cafe: 'bg-amber-50 text-amber-700',
  thai: 'bg-yellow-50 text-yellow-700',
  chinese: 'bg-rose-50 text-rose-600',
}

function CuisineTag({ cuisine }: { cuisine: string }) {
  const color = cuisineColors[cuisine.toLowerCase()] ?? 'bg-[#E0E0E0] text-[#3D3D3D]'
  return (
    <span className={`inline-block font-poppins text-[10px] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded-full ${color}`}>
      {cuisine}
    </span>
  )
}

function VideoEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-[14px] bg-[#2D2D2D]" style={{ aspectRatio: '9/16' }}>
      <iframe
        src={`https://customer-${CLOUDFLARE_CUSTOMER_ID}.cloudflarestream.com/${videoId}/iframe?primaryColor=3DBE5A&muted=true&autoplay=false`}
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
        title="Restaurant content video"
      />
    </div>
  )
}

function PhotoPlaceholder({ initial, index }: { initial: string; index: number }) {
  const shades = ['bg-[#E4E4E4]', 'bg-[#DCDCDC]', 'bg-[#D8D8D8]']
  return (
    <div className={`relative w-full aspect-square rounded-[14px] ${shades[index % 3]} flex items-center justify-center overflow-hidden`}>
      <span className="font-sora font-extrabold text-2xl text-[#2D2D2D]/10 select-none">{initial}</span>
    </div>
  )
}

function getShootLabel(client: Client): string | null {
  if (client.shoots && client.shoots.length > 0) {
    const last = client.shoots[client.shoots.length - 1]
    const isoMatch = last.match(/^(\d{4})-(\d{2})$/)
    if (isoMatch) {
      const d = new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1)
      return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    }
    return last
  }
  return null
}

function ClientCard({ client }: { client: Client }) {
  const hasVideos = client.videos && client.videos.length > 0
  const hasPhotos = client.photos && client.photos.length > 0
  const initial = client.name.charAt(0)
  const shootLabel = getShootLabel(client)
  const videoSlots = hasVideos ? client.videos!.slice(0, 2) : []
  const photoSlots = hasPhotos ? client.photos!.slice(0, 3) : []

  return (
    <article className="bg-white rounded-[16px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center shrink-0">
            {client.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={client.cover}
                alt={`${client.name} — ${client.cuisine} restaurant in ${client.location}`}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="font-sora font-extrabold text-sm text-[#2D2D2D]/30">{initial}</span>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="font-sora font-bold text-[15px] text-[#2D2D2D] leading-tight truncate">
              {client.name}
            </h2>
            <span className="font-poppins text-[11px] text-[#888888]">{client.location}</span>
            {shootLabel && (
              <span className="font-poppins text-[10px] text-[#AAAAAA] block leading-tight mt-0.5">
                {shootLabel}
              </span>
            )}
          </div>
        </div>
        <CuisineTag cuisine={client.cuisine} />
      </div>

      {/* Videos */}
      <div className="px-4 pb-3">
        <div className="w-full">
          {hasVideos ? (
            <div className="grid grid-cols-2 gap-2">
              {videoSlots.map((id) => (
                <VideoEmbed key={id} videoId={id} />
              ))}
              {videoSlots.length === 1 && (
                <div className="relative w-full rounded-[14px] bg-[#EDEDED] flex items-center justify-center" style={{ aspectRatio: '9/16' }}>
                  <span className="font-poppins text-[11px] text-[#888888] text-center px-3">More coming soon</span>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="relative w-full rounded-[14px] bg-[#EDEDED] flex flex-col items-center justify-center gap-2"
                  style={{ aspectRatio: '9/16' }}
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="3" y="5" width="22" height="18" rx="4" stroke="#AAAAAA" strokeWidth="1.5"/>
                    <path d="M11 10l8 4-8 4V10z" fill="#AAAAAA"/>
                  </svg>
                  <span className="font-poppins text-[10px] text-[#AAAAAA]">Coming soon</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Photos */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {hasPhotos
            ? photoSlots.map((src, i) => (
                <div key={i} className="relative w-full aspect-square rounded-[14px] overflow-hidden bg-[#EDEDED]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${client.cuisine} restaurant content shoot in ${client.location} — ${client.name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))
            : [0, 1, 2].map((i) => (
                <PhotoPlaceholder key={i} initial={initial} index={i} />
              ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-5 flex items-center justify-between gap-3">
        <div>
          {typeof client.months === 'number' && client.months > 0 ? (
            <span className="font-poppins text-xs text-[#888888]">
              {client.months} month{client.months !== 1 ? 's' : ''} retained
            </span>
          ) : (
            <span className="font-poppins text-xs text-[#AAAAAA]">
              {client.description || client.cuisine}
            </span>
          )}
        </div>
        <Link
          href={`/work/${client.slug}`}
          className="shrink-0 inline-flex items-center gap-1.5 bg-[#3DBE5A] text-white font-poppins text-[13px] font-semibold rounded-[100px] px-5 py-[10px] hover:brightness-105 transition-all active:scale-[0.97]"
        >
          View Work →
        </Link>
      </div>
    </article>
  )
}

// ── Pill row used inside the filter bar ──
// Rendered twice for seamless marquee loop on mobile
function PillRow({
  active,
  onSelect,
  ariaHidden = false,
}: {
  active: string
  onSelect: (v: string) => void
  ariaHidden?: boolean
}) {
  return (
    <>
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onSelect(f.value)}
          aria-hidden={ariaHidden}
          tabIndex={ariaHidden ? -1 : 0}
          className={`shrink-0 font-poppins text-[13px] font-semibold px-4 py-2 rounded-full border transition-all active:scale-[0.97] ${
            active === f.value
              ? 'bg-[#3DBE5A] text-white border-[#3DBE5A]'
              : 'bg-white text-[#3D3D3D] border-black/10 hover:border-black/20'
          }`}
        >
          {f.label}
        </button>
      ))}
    </>
  )
}

export default function WorkFeed({ clients }: { clients: Client[] }) {
  const [active, setActive] = useState('all')
  const feedRef = useRef<HTMLDivElement>(null)

  function handleFilter(value: string) {
    setActive(value)
    // Scroll feed into view just below the sticky filter bar
    if (feedRef.current) {
      feedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const filtered =
    active === 'all'
      ? clients
      : clients.filter((c) => c.cuisine.toLowerCase() === active)

  return (
    <div className="max-w-site mx-auto">

      {/* ── Filter bar ── */}
      <div className="sticky top-16 z-30 bg-[#EDEDED] border-b border-black/[0.06]">
        <div className="relative">

          {/*
            MOBILE: marquee auto-scroll via CSS animation on the inner track.
            Pills are rendered twice for a seamless loop.
            Clicking still triggers handleFilter — animation doesn't block interaction.
            DESKTOP (md+): static flex row, no animation, no duplicate pills.
          */}

          {/* Mobile marquee track */}
          <div
            className="md:hidden overflow-hidden py-3 px-4"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 88%, transparent)' }}
          >
            <div
              className="flex gap-2 w-max"
              style={{ animation: 'marquee-pills 20s linear infinite' }}
            >
              <PillRow active={active} onSelect={handleFilter} />
              {/* Duplicate for seamless loop */}
              <PillRow active={active} onSelect={handleFilter} ariaHidden />
            </div>
          </div>

          {/* Desktop static row */}
          <div
            className="hidden md:flex gap-2 px-12 py-3"
          >
            <PillRow active={active} onSelect={handleFilter} />
          </div>

        </div>
      </div>

      {/* Keyframes injected as a style tag — Tailwind can't express arbitrary keyframes inline */}
      <style>{`
        @keyframes marquee-pills {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Count label — this is the scroll target */}
      <div ref={feedRef} className="px-4 md:px-12 pt-5 pb-2 scroll-mt-28">
        <p className="font-poppins text-[12px] text-[#888888]">
          {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''}
          {active !== 'all' && (
            <> &mdash; <span className="capitalize text-[#2D2D2D] font-medium">{active}</span></>
          )}
        </p>
      </div>

      {/* Feed — min-h-screen so short result sets never expose the footer unexpectedly */}
      <div
        className="px-4 md:px-12 pb-16 grid grid-cols-1 md:grid-cols-3 gap-5"
        style={{ minHeight: '100vh' }}
      >
        {filtered.map((client) => (
          <ClientCard key={client.slug} client={client} />
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="font-poppins text-[#888888] text-sm">No clients in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
