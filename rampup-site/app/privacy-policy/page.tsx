import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

/**
 * Privacy notice under Thailand's Personal Data Protection Act B.E. 2562.
 *
 * The Meta instant lead form links here, so this URL must never 404: four
 * people tapped that link and hit a missing page before this existed.
 *
 * Everything below describes what the site actually does, checked against the
 * code and a live page load on 16 September 2026. If a tracker, form field or
 * service provider is added or removed, update this page in the same change.
 */

// Where data-subject requests go. PDPA requires a working contact point.
const CONTACT_EMAIL = 'hello@restaurantrampup.com'

const UPDATED = '16 September 2026'

export const metadata = {
  title: 'Privacy Policy — Restaurant RampUp',
  description:
    'How Restaurant RampUp (YOUMEE ENTERPRISE CO., LTD.) collects, uses and protects personal data.',
}

const trackers: { tool: string; provider: string; purpose: string; cookies: string }[] = [
  {
    tool: 'Google Analytics and Google Tag Manager',
    provider: 'Google LLC',
    purpose: 'Counts visits and shows which pages and campaigns people use.',
    cookies: '_ga, _ga_*',
  },
  {
    tool: 'Meta Pixel and Conversions API',
    provider: 'Meta Platforms, Inc.',
    purpose: 'Measures and improves our Facebook and Instagram ads.',
    cookies: '_fbp, _fbc',
  },
  {
    tool: 'TikTok Pixel',
    provider: 'TikTok',
    purpose: 'Measures and improves our TikTok ads.',
    cookies: '_ttp, _tt_enable_cookie, ttcsid*',
  },
  {
    tool: 'Microsoft Clarity',
    provider: 'Microsoft Corporation',
    purpose:
      'Records how visitors move through pages, such as clicks and scrolling, so we can find and fix problems.',
    cookies: '_clck, _clsk',
  },
  {
    tool: 'Cloudflare Turnstile',
    provider: 'Cloudflare, Inc.',
    purpose: 'Checks that a form is being submitted by a person and not an automated program.',
    cookies: 'None set on this site',
  },
]

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-sora font-bold text-xl md:text-2xl text-dark tracking-tight mb-3">
        {n}. {title}
      </h2>
      <div className="font-poppins text-base text-body leading-relaxed flex flex-col gap-3">
        {children}
      </div>
    </section>
  )
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 flex flex-col gap-1.5">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Nav />
      <main className="min-h-[100dvh] bg-[#EDEDED]">
        <div className="max-w-3xl mx-auto px-5 md:px-12 pt-16 pb-12">
          <p className="font-poppins text-[11px] font-bold text-green uppercase tracking-[2px] mb-3">
            Legal
          </p>
          <h1 className="font-sora font-extrabold text-3xl md:text-4xl text-dark tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="font-poppins text-sm text-muted mb-10">Last updated {UPDATED}</p>

          <p className="font-poppins text-base text-body leading-relaxed mb-10">
            This policy explains what personal data we collect when you use this website or
            contact us through our ads, why we collect it, who we share it with, and the rights
            you have under Thailand&apos;s Personal Data Protection Act B.E. 2562 (PDPA).
          </p>

          <Section n={1} title="Who we are">
            <p>
              Restaurant RampUp is a trading name of <strong>YOUMEE ENTERPRISE CO., LTD.</strong>,
              the data controller responsible for your personal data.
            </p>
            <div className="bg-white rounded-2xl p-5 flex flex-col gap-1.5 text-sm">
              <p><span className="text-muted">Company:</span> YOUMEE ENTERPRISE CO., LTD.</p>
              <p>
                <span className="text-muted">Address:</span> 200/40 Mu Ban Prinsiri Nawamin Rd,
                Khwaeng Nawamin, Khet Bueng Kum, Krung Thep Maha Nakhon 10240, Thailand
              </p>
              <p><span className="text-muted">Tax ID:</span> 0105566134750</p>
              <p><span className="text-muted">Email:</span>{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">{CONTACT_EMAIL}</a>
              </p>
            </div>
          </Section>

          <Section n={2} title="What we collect">
            <p><strong>Information you give us.</strong> When you fill in a form on this website, or a
              lead form in one of our Facebook or Instagram ads, we collect:</p>
            <List items={[
              'your name, email address and phone number',
              'your restaurant’s name',
              'your answers to questions on the form, such as when you would like to start, which service interests you, and your Grab sales and advertising',
              'any message you choose to write',
            ]} />
            <p><strong>Information collected automatically.</strong> When you visit, we and the
              services listed in section 4 collect:</p>
            <List items={[
              'your IP address, browser and device type',
              'the pages you view and how you interact with them',
              'the ad or link that brought you here, including campaign tags and ad click identifiers',
            ]} />
          </Section>

          <Section n={3} title="Why we use it">
            <List items={[
              'To reply to your enquiry and prepare a proposal for your restaurant, at your request.',
              'To provide our marketing services if you become a client.',
              'To understand how our website and ads perform, and improve them.',
              'To protect our forms against spam and abuse.',
            ]} />
            <p>
              We do not sell your personal data.
            </p>
          </Section>

          <Section n={4} title="Cookies and tracking">
            <p>
              This website uses the following tools. They load when you open a page and may set
              cookies or collect the information described in section 2.
            </p>
            <div className="overflow-x-auto bg-white rounded-2xl">
              <table className="w-full text-sm text-left min-w-[560px]">
                <thead>
                  <tr className="border-b border-black/[0.07]">
                    <th className="font-semibold text-dark p-3">Tool</th>
                    <th className="font-semibold text-dark p-3">Provider</th>
                    <th className="font-semibold text-dark p-3">Purpose</th>
                    <th className="font-semibold text-dark p-3">Cookies</th>
                  </tr>
                </thead>
                <tbody>
                  {trackers.map((t) => (
                    <tr key={t.tool} className="border-b border-black/[0.05] last:border-0 align-top">
                      <td className="p-3 text-dark">{t.tool}</td>
                      <td className="p-3">{t.provider}</td>
                      <td className="p-3">{t.purpose}</td>
                      <td className="p-3 font-mono text-xs">{t.cookies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              You can block or delete cookies in your browser settings. You can also opt out of
              Google Analytics with Google&apos;s browser add-on, and manage ad preferences in your
              Facebook, Instagram and TikTok account settings. Blocking cookies does not stop you
              using this website or its forms.
            </p>
            <p>
              We also briefly store the campaign tags from the link you arrived on in your
              browser&apos;s session storage, so a form you submit later in the same visit is
              credited to the right ad. It is cleared when you close the tab.
            </p>
          </Section>

          <Section n={5} title="Who we share it with">
            <p>
              We share personal data only with service providers that help us run this website and
              our business, and only for the purposes above:
            </p>
            <List items={[
              <><strong>Netlify</strong> hosts this website and receives form submissions.</>,
              <><strong>Google</strong> stores enquiries in Google Sheets and provides Google Analytics.</>,
              <><strong>n8n</strong> and <strong>Make</strong> pass enquiries between our systems.</>,
              <><strong>LINE</strong> delivers new enquiries to our team.</>,
              <><strong>Meta</strong> receives your email and phone number in scrambled (hashed) form, so it can match an enquiry to an ad without receiving the details in readable form.</>,
              <><strong>TikTok</strong>, <strong>Microsoft</strong> and <strong>Cloudflare</strong> provide the tools in section 4, and Cloudflare also hosts our images and videos.</>,
            ]} />
            <p>
              We may also disclose personal data where the law requires it.
            </p>
          </Section>

          <Section n={6} title="Transfers outside Thailand">
            <p>
              Several of these providers store or process data outside Thailand, including in the
              United States. Where that happens, we rely on the provider&apos;s own data protection
              commitments and contractual safeguards.
            </p>
          </Section>

          <Section n={7} title="How long we keep it">
            <p>
              We keep enquiry details for as long as we need them to respond to you and manage any
              business relationship that follows, and for no longer than two years after our last
              contact with you, unless the law requires us to keep them longer. Analytics and
              advertising data is kept according to each provider&apos;s own retention settings.
            </p>
          </Section>

          <Section n={8} title="Your rights">
            <p>Under the PDPA you have the right to:</p>
            <List items={[
              'withdraw any consent you have given',
              'access your personal data and get a copy of it',
              'ask us to transfer it to another organisation',
              'object to us collecting, using or disclosing it',
              'ask us to delete, destroy or anonymise it',
              'ask us to restrict how we use it',
              'ask us to correct it if it is wrong or incomplete',
              'complain to the Office of the Personal Data Protection Committee',
            ]} />
            <p>
              To use any of these rights, email {CONTACT_EMAIL}. We will reply within 30 days.
            </p>
          </Section>

          <Section n={9} title="Security">
            <p>
              We use reasonable technical and organisational measures to protect your personal
              data. Everything you send through this website travels over an encrypted
              connection.
            </p>
          </Section>

          <Section n={10} title="Children">
            <p>
              Our services are for restaurant businesses and are not directed at anyone under 20.
            </p>
          </Section>

          <Section n={11} title="Changes to this policy">
            <p>
              We may update this policy. The date at the top shows when it last changed.
            </p>
          </Section>

          <Section n={12} title="Contact us">
            <p>
              Questions about this policy or your personal data can be sent to {CONTACT_EMAIL}, or
              by post to YOUMEE ENTERPRISE CO., LTD. at the address in section 1.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  )
}
