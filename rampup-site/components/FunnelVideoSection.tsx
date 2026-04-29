'use client'

import { useState } from 'react'
import LazyVideoCard from './LazyVideoCard'

// Mobile shows 4 (2-col × 2-row), desktop shows 3 (3-col × 1-row)
const INITIAL_MOBILE  = 4
const INITIAL_DESKTOP = 3

interface Props {
  videoIds: string[]
  customerCode: string
}

export default function FunnelVideoSection({ videoIds, customerCode }: Props) {
  const [showAll, setShowAll] = useState(false)

  const total            = videoIds.length
  const initialSlice     = showAll ? videoIds : videoIds.slice(0, INITIAL_MOBILE)
  const remainingMobile  = total - INITIAL_MOBILE
  const remainingDesktop = total - INITIAL_DESKTOP

  // Show button when remaining videos exist on either breakpoint
  const showButton = !showAll && total > INITIAL_DESKTOP

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {initialSlice.map((id, i) => (
          // 4th card (index 3) is hidden on desktop — desktop initial count is 3
          <div key={id} className={i === INITIAL_DESKTOP ? 'md:hidden' : undefined}>
            <LazyVideoCard
              videoId={id}
              customerCode={customerCode}
              label={`Reel ${i + 1}`}
            />
          </div>
        ))}
      </div>

      {showButton && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="font-poppins text-sm font-semibold text-white/70 border border-white/30 px-6 py-2.5 rounded-pill hover:bg-white/10 transition-all"
          >
            {/* Different remaining count per breakpoint */}
            <span className="hidden md:inline">
              View more videos ({remainingDesktop} more)
            </span>
            {total > INITIAL_MOBILE && (
              <span className="md:hidden">
                View more videos ({remainingMobile} more)
              </span>
            )}
          </button>
        </div>
      )}
    </>
  )
}
