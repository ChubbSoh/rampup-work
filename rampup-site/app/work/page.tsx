import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ClientGrid from '@/components/ClientGrid'
import { getAllClients } from '@/lib/clients'

export const metadata = {
  title: 'Our Work — Restaurant RampUp',
  description: 'See the restaurants we work with across Bangkok and Thailand.',
}

export default function WorkPage() {
  const clients = getAllClients()

  return (
    <>
      <Nav />
      <main className="min-h-[100dvh] bg-[#EDEDED]">
        <div className="max-w-site mx-auto px-5 md:px-12 pt-12 pb-8">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
            Our Work
          </p>
          <h1 className="font-sora font-extrabold text-3xl md:text-5xl text-dark tracking-tight mb-4">
            18 restaurants.<br className="hidden md:block" /> Real results.
          </h1>
          <p className="font-poppins text-base text-muted max-w-[480px]">
            From Japanese izakayas to Italian trattorias — we grow restaurants across Bangkok and beyond.
          </p>
        </div>

        <ClientGrid clients={clients} />

        <Footer />
      </main>
    </>
  )
}
