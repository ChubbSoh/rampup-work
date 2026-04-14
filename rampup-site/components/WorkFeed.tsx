'use client'

import { useState } from 'react'
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
  japanese: 'bg-red-50 text-red-600',
  italian: 'bg-orange-50 text-orange-600',
  korean: 'bg-purple-50 text-purple-600',
  western: 'bg-blue-50 text-blue-600',
  nightlife: 'bg-indigo-50 text-indigo-600',
  cafe: 'bg-amber-50 text-amber-700',
  thai: 'bg-yellow-50 text-yellow-700',
  chinese: 'bg-rose-50 text-rose-600',
}

function CuisineTag({ cuisine }: { cuisine: string }) {
  const color = cuisineColors[cuisine.toLowerCase()] ?? 'bg-[#E0E0E0] text-body'
  return (
    <span
      className={`inline-block font-poppins text-[10px] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded-full ${color}`}
    >
      {cuisine}
    </span>
  )
}

function VideoEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-[14px] bg-dark" style={{ aspectRatio: '9/16' }}>
      <iframe
        src={`https://customer-${CLOUDFLARE_CUSTOMER_ID}.cloudflarestream.com/${videoId}/iframe?primaryColor=3DBE5A&muted=true&autoplay=false`}
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
        title="Client video"
      />
    </div>
  )
}

function PhotoPlaceholder({ initial, index }: { initial: string; index: number }) {
  const shades = ['bg-[#E4E4E4]', 'bg-[#DCDCDC]', 'bg-[#D8D8D8]']
  return (
    <div
      className={`relative w-full aspect-square rounded-[14px] ${shades[index % 3]} flex items-center justify-center overflow-hidden`}
    >
      <span className="font-sora font-extrabold text-2xl text-dark/10 select-none">{initial}</span>
    </div>
  )
}

function ClientCard({ client }: { client: Client }) {
  const hasVideos = client.videos && client.videos.length > 0
  const hasPhotos = client.photos && client.photos.length > 0
  const initial = client.name.charAt(0)

  // Placeholder video IDs shown as empty embeds when none set
  const videoSlots = hasVideos ? client.videos!.slice(0, 2) : []
  const photoSlots = hasPhotos ? client.photos!.slice(0, 3) : []

  return (
    <article className="bg-white rounded-[16px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      {/* ── Client header ── */}
      <div className="px-4 pt-5 pb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center shrink-0">
            {client.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={client.cover}
                alt={client.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="font-sora font-extrabold text-sm text-dark/30">{initial}</span>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="font-sora font-bold text-[15px] text-dark leading-tight truncate">
              {client.name}
            </h2>
            <span className="font-poppins text-[11px] text-muted">{client.location}</span>
          </div>
        </div>
        <CuisineTag cuisine={client.cuisine} />
      </div>

      {/* ── Videos (2 side by side, 9:16) ── */}
      <div className="px-4 pb-3">
        {hasVideos ? (
          <div className="grid grid-cols-2 gap-2">
            {videoSlots.map((id) => (
              <VideoEmbed key={id} videoId={id} />
            ))}
            {/* If only 1 video, fill second slot with placeholder */}
            {videoSlots.length === 1 && (
              <div className="relative w-full rounded-[14px] bg-[#EDEDED] flex items-center justify-center" style={{ aspectRatio: '9/16' }}>
                <span className="font-poppins text-[11px] text-muted text-center px-3">More coming soon</span>
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
                <span className="font-poppins text-[10px] text-faint">Coming soon</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Photos (3 in a row) ── */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {hasPhotos
            ? photoSlots.map((src, i) => (
                <div key={i} className="relative w-full aspect-square rounded-[14px] overflow-hidden bg-[#EDEDED]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${client.name} photo ${i + 1}`}
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

      {/* ── Footer ── */}
      <div className="px-4 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {typeof client.months === 'number' && client.months > 0 ? (
            <span className="font-poppins text-xs text-muted">
              {client.months} month{client.months !== 1 ? 's' : ''} retained
            </span>
          ) : (
            <span className="font-poppins text-xs text-faint">
              {client.description || client.cuisine}
            </span>
          )}
        </div>
        <Link
          href={`/work/${client.slug}`}
          className="inline-flex items-center gap-1.5 font-poppins text-xs font-semibold text-dark hover:text-green transition-colors group"
        >
          View full page
          <span className="w-6 h-6 rounded-full bg-[#EDEDED] flex items-center justify-center group-hover:bg-green group-hover:text-white transition-all text-[11px]">
            →
          </span>
        </Link>
      </div>
    </article>
  )
}

export default function WorkFeed({ clients }: { clients: Client[] }) {
  const [active, setActive] = useState('all')

  const filtered =
    active === 'all'
      ? clients
      : clients.filter((c) => c.cuisine.toLowerCase() === active)

  return (
    <div className="max-w-site mx-auto">
      {/* ── Filter pills — horizontally scrollable ── */}
      <div className="sticky top-16 z-30 bg-[#EDEDED] border-b border-black/[0.06]">
        <div
          className="flex gap-2 px-4 md:px-12 py-3 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`shrink-0 font-poppins text-[13px] font-semibold px-4 py-2 rounded-full border transition-all active:scale-[0.97] ${
                active === f.value
                  ? 'bg-green text-white border-green'
                  : 'bg-white text-body border-black/10 hover:border-black/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Count label ── */}
      <div className="px-4 md:px-12 pt-5 pb-2">
        <p className="font-poppins text-[12px] text-muted">
          {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''}
          {active !== 'all' && <> &mdash; <span className="capitalize text-dark font-medium">{active}</span></>}
        </p>
      </div>

      {/* ── Feed ── */}
      <div className="px-4 md:px-12 pb-16 flex flex-col gap-5 max-w-2xl mx-auto md:max-w-site">
        {filtered.map((client) => (
          <ClientCard key={client.slug} client={client} />
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-poppins text-muted text-sm">No clients in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
