'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Client } from '@/lib/types'

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
  pizza: 'bg-orange-50 text-orange-600',
}

function CuisineTag({ cuisine }: { cuisine: string }) {
  const color = cuisineColors[cuisine.toLowerCase()] ?? 'bg-[#EDEDED] text-body'
  return (
    <span className={`font-poppins text-[10px] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded-full ${color}`}>
      {cuisine}
    </span>
  )
}

function ClientCard({ client }: { client: Client }) {
  const hasMonths = typeof client.months === 'number' && client.months > 0

  return (
    <Link
      href={`/work/${client.slug}`}
      className="group block bg-white rounded-card overflow-hidden hover:-translate-y-1.5 transition-transform duration-200 shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
    >
      {/* Cover image / placeholder */}
      <div className="relative aspect-[4/3] bg-[#EDEDED] overflow-hidden">
        {client.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={client.cover}
            alt={client.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EDEDED] to-[#E0E0E0]">
            <span className="font-sora font-extrabold text-3xl text-dark/20 select-none">
              {client.name.charAt(0)}
            </span>
          </div>
        )}
        {hasMonths && (
          <div className="absolute top-3 right-3 bg-dark/80 backdrop-blur-sm text-white font-poppins text-[10px] font-semibold px-2.5 py-1 rounded-full">
            {client.months}mo
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-sora font-bold text-base text-dark truncate">
            {client.name}
          </h3>
          <span className="shrink-0 w-6 h-6 rounded-full bg-green/10 flex items-center justify-center text-green text-xs group-hover:bg-green group-hover:text-white transition-all">
            →
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <CuisineTag cuisine={client.cuisine} />
          <span className="font-poppins text-xs text-faint">{client.location}</span>
        </div>
        {client.description && (
          <p className="font-poppins text-xs text-muted mt-2 leading-snug">
            {client.description}
          </p>
        )}
      </div>
    </Link>
  )
}

export default function ClientGrid({ clients }: { clients: Client[] }) {
  const [active, setActive] = useState('all')

  const filtered =
    active === 'all'
      ? clients
      : clients.filter((c) => c.cuisine.toLowerCase() === active)

  return (
    <div className="max-w-site mx-auto px-5 md:px-12 pb-16">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8 mt-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={`font-poppins text-sm font-semibold px-4 py-2 rounded-pill border transition-all active:scale-[0.97] ${
              active === f.value
                ? 'bg-green text-white border-green'
                : 'bg-white text-body border-black/10 hover:border-black/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="font-poppins text-sm text-muted mb-6">
        {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''}
        {active !== 'all' && (
          <> &mdash; <span className="capitalize">{active}</span></>
        )}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {filtered.map((client) => (
          <ClientCard key={client.slug} client={client} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="font-poppins text-muted">No clients in this category yet.</p>
        </div>
      )}
    </div>
  )
}
