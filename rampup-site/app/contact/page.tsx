import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import LeadForm from '@/components/LeadForm'
import PricingCard from '@/components/PricingCard'

export const metadata = {
  title: 'Contact — Restaurant RampUp',
  description: 'Get in touch with Restaurant RampUp. Free Grab store audit and social media consultation.',
}

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="min-h-[100dvh] bg-[#EDEDED]">
        <div className="max-w-site mx-auto px-5 md:px-12 pt-16 pb-8">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
            Get In Touch
          </p>
          <h1 className="font-sora font-extrabold text-3xl md:text-4xl text-dark tracking-tight mb-5">
            Let&apos;s grow your restaurant
          </h1>
          <p className="font-poppins text-base text-muted leading-relaxed max-w-xl">
            Fill in the form and we&apos;ll get back to you within 24 hours with a free audit of your Grab store and social media pages.
          </p>
        </div>

        <PricingCard stacked hideCta formHeading="Get your growth plan" formSubtext="We'll review your restaurant and get back within 24 hours." />

        <Footer />
      </main>
    </>
  )
}
