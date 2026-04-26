import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import WorkFeed from '@/components/WorkFeed'
import { getAllClients } from '@/lib/clients'
import { streamIframeSrc } from '@/lib/stream'
import { th } from '@/lib/translations'

export const metadata = {
  title: 'ผลงานของเรา | คอนเทนต์ร้านอาหารกรุงเทพฯ | RampUp',
  description: 'ดูผลงานการถ่ายและสร้างคอนเทนต์ร้านอาหารในกรุงเทพฯ รูปภาพ วิดีโอ และโซเชียลมีเดีย',
  alternates: {
    canonical: 'https://rampupth.com/th/work',
    languages: { 'en': 'https://rampupth.com/work', 'th': 'https://rampupth.com/th/work' },
  },
}

export default function ThWorkPage() {
  const clients = getAllClients().map(c => ({
    ...c,
    videoSrcs: (c.videos ?? [])
      .map(id => streamIframeSrc(id, { muted: true, autoplay: true, loop: true }))
      .filter((src): src is string => src !== null),
  }))

  const t = th.work

  return (
    <>
      <Nav />
      <main className="min-h-[100dvh] bg-[#EDEDED]">
        <div className="px-4 md:px-12 pt-10 pb-6 max-w-site mx-auto">
          <h1 className="font-sora font-extrabold text-3xl md:text-5xl text-dark tracking-tight">
            {t.h1Line1}<br />{t.h1Line2}
          </h1>
          <p className="font-poppins text-[15px] text-[#555555] mt-3">
            {t.subheading}
          </p>
        </div>

        <WorkFeed clients={clients} />

        <Footer lang="th" />
      </main>
    </>
  )
}
