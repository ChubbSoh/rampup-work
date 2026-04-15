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

function getLatestShootDate(client: Client): string {
  if (!client.shoots || client.shoots.length === 0) return '0000-00'
  return client.shoots.reduce((latest, s) => (s.date > latest ? s.date : latest), '')
}

function ClientCard({ client }: { client: Client }) {
  const hasVideos = client.videos && client.videos.length > 0
  const hasPhotos = client.photos && client.photos.length > 0
  const initial = client.name.charAt(0)
  const videoSlots = hasVideos ? client.videos!.slice(0, 2) : []
  const photoSlots = hasPhotos ? client.photos!.slice(0, 3) : []

  return (
    <article className="bg-white rounded-[16px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      {/* Header — no circle logo */}
      <div className="px-4 pt-5 pb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-sora font-bold text-[15px] text-[#2D2D2D] leading-tight truncate">
            {client.name}
          </h2>
          <span className="font-poppins text-[11px] text-[#888888]">{client.location}</span>
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

      {/* Footer — just the View Work button */}
      <div className="px-4 pb-5 flex justify-end">
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


export default function WorkFeed({ clients }: { clients: Client[] }) {
  const [active, setActive] = useState('all')
  const feedRef = useRef<HTMLDivElement>(null)

  function handleFilter(value: string) {
    setActive(value)
    if (feedRef.current) {
      feedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Sort by latest shoot date DESC
  const sorted = [...clients].sort(
    (a, b) => getLatestShootDate(b).localeCompare(getLatestShootDate(a))
  )

  const filtered =
    active === 'all'
      ? sorted
      : sorted.filter((c) => c.cuisine.toLowerCase() === active)

  return (
    <div>
      {/* ── Filter bar — full-width bg, pills aligned to content grid ── */}
      <div className="sticky top-16 z-30 bg-[#EDEDED] border-b border-black/[0.06]">
        <div className="relative max-w-site mx-auto">
          <div
            className="flex gap-2 px-4 md:px-12 py-3"
            style={{
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => handleFilter(f.value)}
                className={`shrink-0 font-poppins text-[13px] font-semibold px-4 py-2 rounded-full border transition-all active:scale-[0.97] ${
                  f.value === active
                    ? 'bg-[#3DBE5A] text-white border-[#3DBE5A]'
                    : 'bg-white text-[#3D3D3D] border-black/10 hover:border-black/20'
                }`}
                style={{ scrollSnapAlign: 'start' }}
              >
                {f.label}
              </button>
            ))}
            {/* Spacer so last pill clears the fade overlay */}
            <div className="shrink-0 w-8 md:hidden" aria-hidden />
          </div>

          {/* Right-edge fade — mobile only */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-12 md:hidden"
            style={{ background: 'linear-gradient(to right, transparent, #EDEDED)' }}
          />
        </div>
      </div>

      {/* Count label */}
      <div ref={feedRef} className="max-w-site mx-auto px-4 md:px-12 pt-5 pb-2 scroll-mt-28">
        <p className="font-poppins text-[12px] text-[#888888]">
          {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''}
          {active !== 'all' && (
            <> &mdash; <span className="capitalize text-[#2D2D2D] font-medium">{active}</span></>
          )}
        </p>
      </div>

      {/* Feed */}
      <div
        className="max-w-site mx-auto px-4 md:px-12 pb-16 grid grid-cols-1 md:grid-cols-3 gap-5"
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
