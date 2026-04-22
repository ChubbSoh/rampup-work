import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import WorkFeed from '@/components/WorkFeed'
import { getAllClients } from '@/lib/clients'
import { streamIframeSrc } from '@/lib/stream'

export const metadata = {
  title: 'Our Work | Restaurant Content Creation Bangkok | RampUp',
  description:
    'See our restaurant content shoots across Bangkok. Photos, videos, and social media for Japanese, Italian, Thai and more.',
  keywords:
    'restaurant content creation Bangkok, F&B marketing agency Bangkok, hospitality marketing agency Bangkok',
}

export default function WorkPage() {
  const clients = getAllClients().map(c => ({
    ...c,
    videoSrcs: (c.videos ?? [])
      .map(id => streamIframeSrc(id, { muted: true, autoplay: true, loop: true }))
      .filter((src): src is string => src !== null),
  }))

  return (
    <>
      <Nav />
      <main className="min-h-[100dvh] bg-[#EDEDED]">
        {/* Header */}
        <div className="px-4 md:px-12 pt-10 pb-6 max-w-site mx-auto">
          <h1 className="font-sora font-extrabold text-3xl md:text-5xl text-dark tracking-tight">
            Restaurant owners!<br />We run your social media for you.
          </h1>
          <p className="font-poppins text-[15px] text-[#555555] mt-3">
            Professional content and ads built to elevate your restaurant online.
          </p>
        </div>

        <WorkFeed clients={clients} />

        <Footer />
      </main>
    </>
  )
}
