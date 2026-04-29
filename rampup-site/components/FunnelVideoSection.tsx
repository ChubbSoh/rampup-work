'use client'

import { useState } from 'react'
import LazyVideoCard from './LazyVideoCard'

const INITIAL_COUNT = 3

interface Props {
  videoIds: string[]
  customerCode: string
}

export default function FunnelVideoSection({ videoIds, customerCode }: Props) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? videoIds : videoIds.slice(0, INITIAL_COUNT)
  const remaining = videoIds.length - INITIAL_COUNT

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {visible.map((id, i) => (
          <LazyVideoCard
            key={id}
            videoId={id}
            customerCode={customerCode}
            label={`Reel ${i + 1}`}
          />
        ))}
      </div>
      {!showAll && remaining > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="font-poppins text-sm font-semibold text-white/70 border border-white/30 px-6 py-2.5 rounded-pill hover:bg-white/10 transition-all"
          >
            View more videos ({remaining} more)
          </button>
        </div>
      )}
    </>
  )
}
