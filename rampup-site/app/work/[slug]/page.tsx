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
  const updatedLabel = formatLastUpdated(client.last_updated)

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
              <div className="flex items-center gap-3 mb-3">
                <span className="font-poppins text-[10px] font-bold text-green uppercase tracking-[1.5px] bg-green-light px-3 py-1 rounded-full">
                  {client.cuisine}
                </span>
                <span className="font-poppins text-xs text-muted">{client.location}</span>
                {updatedLabel && (
                  <span className="font-poppins text-xs text-muted">{updatedLabel}</span>
                )}
              </div>
              <h1 className="font-sora font-extrabold text-4xl md:text-5xl text-dark tracking-tight">
                {client.name}
              </h1>
              {client.description && (
                <p className="font-poppins text-base text-muted mt-2">
                  {client.description}
                </p>
              )}
            </div>

            {/* Work With Us — fit-content, centered on mobile */}
            <div className="flex justify-center md:justify-end mt-2 md:mt-0">
              <Link
                href="/contact"
                className="bg-green text-white font-poppins font-semibold text-sm px-6 py-2 rounded-pill hover:brightness-105 transition-all active:scale-[0.98]"
              >
                Work With Us
              </Link>
            </div>
          </div>
        </div>

        {/* ── Cover — constrained width ── */}
        {client.cover && (
          <div className="max-w-5xl mx-auto px-5 md:px-12 mb-10">
            <div className="rounded-card overflow-hidden aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={client.cover}
                alt={client.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* ── Videos — constrained width ── */}
        {hasVideos && (
          <section className="max-w-5xl mx-auto px-5 md:px-12 mb-14">
            <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-6">
              Content
            </p>
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
            <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-6">
              Photography
            </p>
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
              <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-2">
                Want results like {client.name}?
              </h2>
              <p className="font-poppins text-sm text-white/50">
                Get a free audit of your restaurant&apos;s Grab store and social media.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 bg-green text-white font-poppins font-semibold px-8 py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] whitespace-nowrap"
            >
              Get Started Free
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
