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
        <div className="max-w-site mx-auto px-5 md:px-12 pt-16 pb-12">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
            Get In Touch
          </p>
          <h1 className="font-sora font-extrabold text-3xl md:text-4xl text-dark tracking-tight mb-5">
            Let&apos;s grow your restaurant
          </h1>
          <p className="font-poppins text-base text-muted leading-relaxed max-w-xl mb-10">
            Fill in the form and we&apos;ll get back to you within 24 hours with a free audit of your Grab store and social media pages.
          </p>

          <div className="flex flex-col gap-5 max-w-xs">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2a6 6 0 0 0-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 0 0-6-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" stroke="#3DBE5A" strokeWidth="1.5"/>
                  </svg>
                ),
                label: 'Based in',
                value: 'Bangkok, Thailand',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5z" stroke="#3DBE5A" strokeWidth="1.5"/>
                    <path d="M2 5l8 7 8-7" stroke="#3DBE5A" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                ),
                label: 'Response time',
                value: 'Within 24 hours',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M18 13.5A1.5 1.5 0 0 1 16.5 15H14l-4 3-4-3H3.5A1.5 1.5 0 0 1 2 13.5v-9A1.5 1.5 0 0 1 3.5 3h13A1.5 1.5 0 0 1 18 4.5v9z" stroke="#3DBE5A" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                ),
                label: 'Languages',
                value: 'Thai & English',
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-light rounded-xl flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-poppins text-xs text-muted">{item.label}</p>
                  <p className="font-poppins text-sm font-semibold text-dark">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <PricingCard stacked hideCta formHeading="Get your growth plan" formSubtext="We'll review your restaurant and get back within 24 hours." />

        <Footer />
      </main>
    </>
  )
}
