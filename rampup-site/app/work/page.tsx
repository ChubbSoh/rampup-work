import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import WorkFeed from '@/components/WorkFeed'
import { getAllClients } from '@/lib/clients'

export const metadata = {
  title: 'Our Work | Restaurant Content Creation Bangkok | RampUp',
  description:
    'See our restaurant content shoots across Bangkok. Photos, videos, and social media for Japanese, Italian, Thai and more.',
  keywords:
    'restaurant content creation Bangkok, F&B marketing agency Bangkok, hospitality marketing agency Bangkok',
}

export default function WorkPage() {
  const clients = getAllClients()

  return (
    <>
      <Nav />
      <main className="min-h-[100dvh] bg-[#EDEDED]">
        {/* Header */}
        <div className="px-4 md:px-12 pt-10 pb-6 max-w-site mx-auto">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-2">
            Our Work
          </p>
          <h1 className="font-sora font-extrabold text-3xl md:text-5xl text-dark tracking-tight">
            Restaurant content creation<br className="hidden md:block" /> across Bangkok.
          </h1>
        </div>

        <WorkFeed clients={clients} />

        <Footer />
      </main>
    </>
  )
}
