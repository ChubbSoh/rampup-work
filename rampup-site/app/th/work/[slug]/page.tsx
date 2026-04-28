import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getAllClients, getClientBySlug, getAllSlugs } from '@/lib/clients'
import { streamIframeSrc } from '@/lib/stream'
import MonthlyPlanCarousel from '@/components/MonthlyPlanCarousel'
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
    alternates: {
      canonical: `https://rampupth.com/th/work/${params.slug}`,
      languages: {
        'en': `https://rampupth.com/work/${params.slug}`,
        'th': `https://rampupth.com/th/work/${params.slug}`,
      },
    },
  }
}

function VideoEmbed({ src, label }: { src: string; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full overflow-hidden rounded-img bg-dark" style={{ aspectRatio: '9/16' }}>
        <iframe
          src={src}
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

export default function ThClientPage({ params }: Props) {
  const client = getClientBySlug(params.slug)
  if (!client) notFound()

  const hasVideos      = client.videos && client.videos.length > 0
  const hasFeedDesign  = !!client.feed_design
  const hasMonthlyPlan = client.monthly_plan && client.monthly_plan.length > 0

  const specialUrls = new Set([
    ...(client.feed_design ? [client.feed_design] : []),
    ...(client.monthly_plan ?? []),
  ])
  const normalPhotos = (client.photos ?? []).filter(p => !specialUrls.has(p))
  const hasPhotos = normalPhotos.length > 0

  return (
    <>
      <Nav />
      <main className="min-h-[100dvh] bg-[#EDEDED]">
        {/* ── Header ── */}
        <div className="max-w-site mx-auto px-5 md:px-12 pt-10 pb-8">
          <Link href="/th/work" className="inline-flex items-center gap-2 font-poppins text-sm text-muted hover:text-dark transition-colors mb-8">
            ← กลับไปดูผลงาน
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-sora font-extrabold text-4xl md:text-5xl text-dark tracking-tight">
                {client.name}
              </h1>
              {client.description && (
                <p className="font-poppins text-base text-muted mt-2">{client.description}</p>
              )}
            </div>
            <div className="flex justify-start md:justify-end mt-2 md:mt-0">
              <Link href="/th/contact" className="bg-green text-white font-poppins font-semibold text-sm px-6 py-2 rounded-pill hover:brightness-105 transition-all active:scale-[0.98]">
                ร่วมงานกับเรา
              </Link>
            </div>
          </div>
        </div>

        {hasVideos && (
          <section className="max-w-5xl mx-auto px-5 md:px-12 mb-14">
            <h2 className="font-sora font-semibold text-2xl md:text-3xl text-dark mb-6">วิดีโอ</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {client.videos!.map((videoId, i) => {
                const src = streamIframeSrc(videoId)
                if (!src) return null
                return <VideoEmbed key={videoId} src={src} label={`รีลส์ ${i + 1}`} />
              })}
            </div>
          </section>
        )}

        {/* ── Social Platforms ── */}
        <section className="max-w-5xl mx-auto px-5 md:px-12 mb-14">
          <div className="bg-[#F5F5F5] rounded-2xl py-8 md:py-10 px-4 md:px-8 text-center">
            <h2 className="font-sora font-bold text-2xl md:text-3xl text-dark mb-8">
              เราโพสต์บนแพลตฟอร์มเหล่านี้
            </h2>
            <div className="flex flex-wrap justify-center gap-y-6 gap-x-10">
              {[
                { label: 'Facebook',  src: '/logo-fb.svg' },
                { label: 'Instagram', src: '/logo-ig.svg' },
                { label: 'TikTok',    src: '/logo-tiktok.svg' },
                { label: 'Google',    src: '/logo-google.svg' },
              ].map(({ label, src }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={label} className="w-full h-full object-contain" />
                  </div>
                  <span className="font-poppins text-sm text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feed Design ── */}
        {hasFeedDesign && (
          <section className="max-w-5xl mx-auto px-5 md:px-12 mb-14">
            <h2 className="font-sora font-semibold text-2xl md:text-3xl text-dark mb-6">ดีไซน์ฟีด</h2>
            <div className="rounded-2xl overflow-hidden bg-[#E0E0E0] md:max-w-[60%] mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={client.feed_design} alt={`${client.name} feed design`} className="w-full h-auto" loading="lazy" />
            </div>
          </section>
        )}

        {/* ── Monthly Plan ── */}
        {hasMonthlyPlan && (
          <section className="max-w-5xl mx-auto px-5 md:px-12 mb-14">
            <h2 className="font-sora font-semibold text-2xl md:text-3xl text-dark mb-6">แผนรายเดือน</h2>
            <MonthlyPlanCarousel photos={client.monthly_plan!} clientName={client.name} />
          </section>
        )}

        {/* ── Photos ── */}
        {hasPhotos && (
          <section className="max-w-5xl mx-auto px-5 md:px-12 mb-14">
            <h2 className="font-sora font-semibold text-2xl md:text-3xl text-dark mb-6">รูปภาพ</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {normalPhotos.map((photo, i) => (
                <div key={i} className="rounded-img overflow-hidden aspect-square bg-[#E0E0E0]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt={`${client.name} photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="max-w-5xl mx-auto px-5 md:px-12 mb-14">
          <div className="bg-[#F5F5F5] rounded-2xl py-8 md:py-10 px-4 md:px-8 mt-4 text-center">
            <h2 className="font-sora font-bold text-2xl md:text-3xl text-dark mb-8">เราช่วยเพิ่มยอดขายออนไลน์</h2>
            <div className="flex flex-wrap justify-center gap-y-8 gap-x-8">
              {[
                { label: 'Grab', icon: <img src="/logo-grab.png" alt="Grab" className="w-16 h-16 object-contain" /> },
                { label: 'Lineman', icon: <img src="/logo-lineman.png" alt="Lineman" className="w-16 h-16 object-contain" /> },
              ].map(({ label, icon }) => (
                <div key={label} className="flex flex-col items-center text-center gap-2 text-[#2D2D2D] hover:scale-105 transition-transform w-24">
                  <div className="flex items-center justify-center w-16 h-16">{icon}</div>
                  <span className="font-poppins text-sm text-[#666666]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {!hasVideos && !hasPhotos && !hasFeedDesign && !hasMonthlyPlan && (
          <section className="max-w-site mx-auto px-5 md:px-12 mb-16">
            <div className="bg-white rounded-card p-12 text-center">
              <h3 className="font-sora font-bold text-xl text-dark mb-2">กำลังเตรียมคอนเทนต์</h3>
              <p className="font-poppins text-sm text-muted max-w-sm mx-auto">
                เราอยู่ระหว่างเตรียมคอนเทนต์ของ {client.name} รอติดตามเร็วๆ นี้
              </p>
            </div>
          </section>
        )}

        <section className="max-w-site mx-auto px-5 md:px-12 mb-24">
          <div className="bg-dark rounded-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white tracking-tight">
                ยกระดับโซเชียลเหมือน {client.name}
              </h2>
              <p className="font-poppins text-sm md:text-base text-white/60 mt-2 max-w-md">
                เราเปลี่ยนคอนเทนต์ให้เป็นรายได้ที่สม่ำเสมอ ผ่านโฆษณา กลยุทธ์ และภาพที่ขายได้จริง
              </p>
            </div>
            <Link href="/th/contact" className="shrink-0 bg-green text-white font-poppins font-semibold px-8 py-4 rounded-pill hover:brightness-105 transition-all active:scale-[0.98] whitespace-nowrap">
              ดูราคา
            </Link>
          </div>
        </section>

        <Footer lang="th" />
      </main>
    </>
  )
}
