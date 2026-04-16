import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getAllClients, getClientBySlug, getAllSlugs } from '@/lib/clients'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = getClientBySlug(params.slug)
  if (!client) return {}
  return {
    title: `${client.name} — Restaurant RampUp`,
    description: `${client.description} | ${client.cuisine} restaurant in ${client.location}`,
  }
}

const CLOUDFLARE_CUSTOMER_ID = 'customer-h038b69ef3omo1hq'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function formatLastUpdated(dateStr?: string): string | null {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-')
  if (!year) return null
  if (month) {
    const monthIndex = parseInt(month, 10) - 1
    return `Updated ${MONTH_NAMES[monthIndex] ?? month} ${year}`
  }
  return `Updated ${year}`
}

function VideoEmbed({ videoId, label }: { videoId: string; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative w-full overflow-hidden rounded-img bg-dark"
        style={{ aspectRatio: '9/16' }}
      >
        <iframe
          src={`https://customer-h038b69ef3omo1hq.cloudflarestream.com/${videoId}/iframe?primaryColor=3DBE5A`}
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          title={label}
        />
      </div>
      <p className="font-poppins text-xs text-muted text-center">{label}</p>
    </div>
  )
}

export default function ClientPage({ params }: Props) {
  const client = getClientBySlug(params.slug)
  if (!client) notFound()

  const hasVideos = client.videos && client.videos.length > 0
  const hasPhotos = client.photos && client.photos.length > 0

  return (
    <>
      <Nav />
      <main className="min-h-[100dvh] bg-[#EDEDED]">
        {/* ── Header ── */}
        <div className="max-w-site mx-auto px-5 md:px-12 pt-10 pb-8">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-poppins text-sm text-muted hover:text-dark transition-colors mb-8"
          >
            ← Back to Our Work
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-sora font-extrabold text-4xl md:text-5xl text-dark tracking-tight">
                {client.name}
              </h1>
              {client.description && (
                <p className="font-poppins text-base text-muted mt-2">
                  {client.description}
                </p>
              )}
            </div>

            {/* Work With Us — left on mobile, right on desktop */}
            <div className="flex justify-start md:justify-end mt-2 md:mt-0">
              <Link
                href="/contact"
                className="bg-green text-white font-poppins font-semibold text-sm px-6 py-2 rounded-pill hover:brightness-105 transition-all active:scale-[0.98]"
              >
                Work With Us
              </Link>
            </div>
          </div>
        </div>

        {/* ── Videos — constrained width ── */}
        {hasVideos && (
          <section className="max-w-5xl mx-auto px-5 md:px-12 mb-14">
            <h2 className="font-sora font-semibold text-2xl md:text-3xl text-dark mb-6">
              Videos
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {client.videos!.map((videoId, i) => (
                <VideoEmbed key={videoId} videoId={videoId} label={`Reel ${i + 1}`} />
              ))}
            </div>
          </section>
        )}

        {/* ── Photos ── */}
        {hasPhotos && (
          <section className="max-w-5xl mx-auto px-5 md:px-12 mb-14">
            <h2 className="font-sora font-semibold text-2xl md:text-3xl text-dark mb-6">
              Photos
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {client.photos!.map((photo, i) => (
                <div key={i} className="rounded-img overflow-hidden aspect-square bg-[#E0E0E0]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt={`${client.name} photo ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Platforms ── */}
        <section className="max-w-5xl mx-auto px-5 md:px-12 mb-14">
          <div className="bg-[#F5F5F5] rounded-2xl py-8 md:py-10 px-4 md:px-8 mt-12 text-center">
            <h2 className="font-sora font-bold text-2xl md:text-3xl text-dark mb-8">
              We post on these platforms
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-y-6 gap-x-4 justify-items-center">
              {[
                {
                  label: 'Facebook',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Instagram',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  ),
                },
                {
                  label: 'TikTok',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z"/>
                    </svg>
                  ),
                },
                {
                  label: 'LINE',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                    </svg>
                  ),
                },
                {
                  label: 'Google Maps',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Grab',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7">
                      <path d="M7 4a1 1 0 011-1h8a1 1 0 011 1v2h2a1 1 0 011 1v2a4 4 0 01-4 4H8a4 4 0 01-4-4V7a1 1 0 011-1h2V4zm2 0v2h6V4H9zm-2 4v1a2 2 0 002 2h6a2 2 0 002-2V8H7zM5 17a2 2 0 012-2h10a2 2 0 012 2v1H5v-1zm-1 3h16v1H4v-1z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Lineman',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7">
                      <path d="M18.5 5.5A1.5 1.5 0 0117 4H7a1.5 1.5 0 010-3h10a4.5 4.5 0 014.5 4.5v1A4.5 4.5 0 0117 11H9.414l2.293 2.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L9.414 9H17a2.5 2.5 0 002.5-2.5v-1zM5 18a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4zm-9.5-1h5a1 1 0 000-2h-5a1 1 0 000 2z"/>
                    </svg>
                  ),
                },
              ].map(({ label, icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-1.5 text-[#2D2D2D] hover:scale-105 transition-transform"
                >
                  {icon}
                  <span className="font-poppins text-sm text-[#666666]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Empty state ── */}
        {!hasVideos && !hasPhotos && (
          <section className="max-w-site mx-auto px-5 md:px-12 mb-16">
            <div className="bg-white rounded-card p-12 text-center">
              <div className="w-16 h-16 bg-green-light rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="8" width="24" height="18" rx="3" stroke="#3DBE5A" strokeWidth="2"/>
                  <path d="M13 13l7 5-7 5V13z" fill="#3DBE5A"/>
                </svg>
              </div>
              <h3 className="font-sora font-bold text-xl text-dark mb-2">
                Content coming soon
              </h3>
              <p className="font-poppins text-sm text-muted max-w-sm mx-auto">
                We&apos;re building out {client.name}&apos;s content library. Check back soon.
              </p>
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <section className="max-w-site mx-auto px-5 md:px-12 mb-24">
          <div className="bg-dark rounded-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white tracking-tight">
                Transform your socials like {client.name}
              </h2>
            </div>
            <Link
              href="/contact"
              className="shrink-0 bg-green text-white font-poppins font-semibold px-8 py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] whitespace-nowrap"
            >
              See pricing
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
