'use client'

import { useState, useEffect } from 'react'

interface Props {
  photos: string[]
  clientName: string
}

export default function MonthlyPlanCarousel({ photos, clientName }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    if (lightboxIndex === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex])

  return (
    <>
      {/* Carousel */}
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {photos.map((photo, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="shrink-0 rounded-2xl overflow-hidden bg-[#E0E0E0] cursor-zoom-in border-0 p-0"
            style={{ aspectRatio: '16/9', width: 'min(85vw, 480px)', scrollSnapAlign: 'start' }}
            aria-label={`View ${clientName} monthly plan image ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={`${clientName} monthly plan ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
      <p className="font-poppins text-[11px] text-muted/60 mt-2 text-center">swipe to see more</p>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-5 text-white/70 hover:text-white font-poppins text-3xl leading-none transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[lightboxIndex]}
            alt={`${clientName} monthly plan ${lightboxIndex + 1}`}
            className="max-w-full max-h-[90dvh] object-contain rounded-xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
