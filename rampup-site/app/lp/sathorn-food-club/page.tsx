import type { Metadata } from 'next'
import { getClientBySlug } from '@/lib/clients'
import LazyVideoCard from '@/components/LazyVideoCard'

/**
 * Proposal page for one named prospect: Sathorn Food Club at U Sathorn.
 *
 * Not a concept funnel. The /lp pages next to this one sell a category to
 * strangers and end in an apply form; this one is shown to a restaurant we are
 * already pitching, so it carries no lead form and no public pricing.
 *
 * Black throughout and deliberately no green. The RampUp green belongs to the
 * acquisition funnels; a residency programme built around Michelin-level chefs
 * reads better in the dark, editorial register their own deck uses.
 */
export const metadata: Metadata = {
  title: 'Sathorn Food Club × RampUp',
  description: 'Marketing proposal for Sathorn Food Club at U Sathorn Bangkok.',
  // Addressed to one prospect. Keep it out of search results.
  robots: { index: false, follow: false },
}

/**
 * What we do, from their agency brief. Three lines, no more.
 *
 * Written as things rather than claims: "Ads on Google, Meta and TikTok", not
 * "we run ads on…". A hero that opens with We, We, We is about us, and this
 * page is about their restaurant. Plain words — it is skimmed, and read by
 * people whose first language is not English.
 */
const heroPoints = [
  'Film and photos of chefs, farms and food',
  'Ads on Google, Meta and TikTok',
  'Every ad leads to a booking',
]

/** Their own line-up, straight from the deck. Dates are theirs, not ours. */
const residencies = [
  { chef: 'Kanji Kobayashi', house: 'Villa Aida · Wakayama', dates: '16 Dec — 31 Jan', note: 'Agrigastronomy' },
  { chef: 'Chef Black',      house: 'Blackitch · Chiang Mai', dates: '1 Feb — 30 Apr',  note: 'Fermentation' },
  { chef: 'Dan Bark',        house: 'Cadence & Caper · Bangkok', dates: '1 May — 31 Jul', note: 'Korean-American' },
  { chef: 'Chef Waii',       house: 'Rasik · Chiang Mai',    dates: '1 Aug — 31 Oct',  note: 'Northern Thai' },
]

const howWeWork = [
  { n: '01', title: 'Feed design', line: 'Your grid, planned as one look.' },
  { n: '02', title: 'Posting',     line: 'Four to five a week, every week.' },
  { n: '03', title: 'Ads',         line: 'Meta and Google, managed daily.' },
  { n: '04', title: 'Reporting',   line: 'One report a month. Plain numbers.' },
]

/** Screenshots of live campaigns. Every one is real work for a real client. */
const adShots = [
  { src: '/funnel/brewave-fb-promo.webp', caption: 'Facebook promotion' },
  { src: '/funnel/okasan-fb-food.webp',   caption: 'Carousel, food' },
  { src: '/funnel/okasan-fb-vibe.webp',   caption: 'Carousel, room' },
  { src: '/funnel/okasan-googlemaps.webp', caption: 'Google Maps' },
]

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C0A878] mb-3">
    {children}
  </p>
)

export default function SathornFoodClubPage() {
  const napha     = getClientBySlug('napha')
  const tohDaeng  = getClientBySlug('toh-d')
  const mansTable = getClientBySlug('mans-table')

  const customerCode = process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE ?? ''

  // One reel per restaurant, in the order the line above this section names
  // them. Three venues, three reels: the row proves its own caption rather
  // than leaning on whichever client happens to have the most footage.
  const videoIds = [
    ...(napha?.videos ?? []).slice(0, 1),
    ...(tohDaeng?.videos ?? []).slice(0, 1),
    ...(mansTable?.videos ?? []).slice(0, 1),
  ]

  // feed_design and monthly_plan live in `photos` as well; they are deck
  // artwork rather than photography, so they do not belong in these rows.
  const notArtwork = (c: ReturnType<typeof getClientBySlug>) => {
    if (!c) return []
    const special = new Set([...(c.feed_design ? [c.feed_design] : []), ...(c.monthly_plan ?? [])])
    return (c.photos ?? []).filter((p) => !special.has(p))
  }

  // One row per restaurant, four frames each. Read from the data rather than
  // hardcoded to three, so Napha's row appears by itself the day its shoot is
  // published. It has no photos at all today and would otherwise render as an
  // empty row under a heading.
  const photoRows = [
    { name: 'Napha',      photos: notArtwork(napha).slice(0, 4) },
    { name: 'Toh Daeng',  photos: notArtwork(tohDaeng).slice(0, 4) },
    { name: 'Man Tables', photos: notArtwork(mansTable).slice(0, 4) },
  ].filter((row) => row.photos.length > 0)

  return (
    <main className="min-h-[100dvh] bg-[#0A0A0A] text-white">

      {/* ── NAV ── */}
      <div className="max-w-site mx-auto px-5 md:px-12 pt-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-rampup-light.svg" alt="RampUp" className="h-6 md:h-8 w-auto" />
      </div>

      {/* ── 1. HERO ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 pt-16 pb-20 md:pt-28 md:pb-28">
        <SectionLabel>Proposal</SectionLabel>
        <h1 className="font-sora font-extrabold text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.95] tracking-[-0.03em]">
          Sathorn
          <br />
          Food Club
        </h1>
        <ul className="mt-9 md:mt-10 flex flex-col gap-3 max-w-lg">
          {heroPoints.map((point) => (
            <li key={point} className="flex items-start gap-3">
              {/* A rule rather than a dot: a bullet list under a 5rem headline
                  reads as a form, a rule reads as a statement. */}
              <span aria-hidden className="mt-[0.7em] h-px w-5 shrink-0 bg-[#C0A878]" />
              <span className="font-poppins text-base md:text-xl leading-snug">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="max-w-site mx-auto px-5 md:px-12"><div className="h-px bg-white/10" /></div>

      {/* ── 2. VIDEO ── chef-led rooms we already film */}
      {videoIds.length > 0 && (
        <section className="max-w-site mx-auto px-5 md:px-12 py-16 md:py-24">
          <SectionLabel>Our video</SectionLabel>
          <h2 className="font-sora font-extrabold text-[clamp(1.6rem,4.5vw,3rem)] leading-[1.05] tracking-tight mb-3">
            Chef-Led Concepts
          </h2>
          <p className="font-poppins text-base text-white/45 mb-10 max-w-md">
            Trusted by Napha, Toh&nbsp;Daeng and Man&nbsp;Tables.
          </p>
          {/* A plain grid rather than FunnelVideoSection. That component hides
              the later reels behind a "view more" button, which earns its place
              on a funnel page where scroll depth is the enemy. On a proposal
              the work should already be on the page. */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {videoIds.map((id, i) => (
              <LazyVideoCard
                key={id}
                videoId={id}
                customerCode={customerCode}
                label={`Reel ${i + 1}`}
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            ))}
          </div>
        </section>
      )}

      {/* ── 3. PHOTOS ── */}
      {photoRows.length > 0 && (
        <section className="max-w-site mx-auto px-5 md:px-12 py-16 md:py-24">
          <SectionLabel>Our photography</SectionLabel>
          <h2 className="font-sora font-extrabold text-[clamp(1.6rem,4.5vw,3rem)] leading-[1.05] tracking-tight mb-10">
            Food, atmosphere and detail, captured
          </h2>
          <div className="flex flex-col gap-10 md:gap-14">
            {photoRows.map(({ name, photos }) => (
              <div key={name}>
                <p className="font-poppins text-[11px] uppercase tracking-[0.18em] text-white/35 mb-4">
                  {name}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {photos.map((src, i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-xl bg-white/[0.04]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 4. ADS ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-16 md:py-24">
        <SectionLabel>Our ads</SectionLabel>
        <h2 className="font-sora font-extrabold text-[clamp(1.6rem,4.5vw,3rem)] leading-[1.05] tracking-tight mb-3">
          Facebook, Instagram, TikTok, Google
        </h2>
        <p className="font-poppins text-base text-white/45 mb-10 max-w-md">
          Ads to drive brand awareness and bookings.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {adShots.map(({ src, caption }) => (
            <figure key={src}>
              {/* Fixed 4:5. These screenshots range from square carousels to a
                  very tall Maps listing, which left the row ragged at h-auto.
                  object-top keeps each post's header in frame — that chrome is
                  what makes it read as a live ad rather than a photo. */}
              <div className="overflow-hidden rounded-xl bg-white/[0.04]" style={{ aspectRatio: '4 / 5' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={caption} className="w-full h-full object-cover object-top" loading="lazy" decoding="async" />
              </div>
              <figcaption className="font-poppins text-[11px] text-white/35 mt-2">{caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── 4.5 INFLUENCERS ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-16 md:py-24">
        <SectionLabel>Influencers</SectionLabel>
        <h2 className="font-sora font-extrabold text-[clamp(1.6rem,4.5vw,3rem)] leading-[1.05] tracking-tight mb-10">
          The right rooms, the right faces
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 rounded-xl overflow-hidden">
          {[
            { k: 'Food media', v: 'Bangkok dining press and guides' },
            { k: 'Creators',   v: 'Matched to each chef, not a fixed list' },
            { k: 'Each launch', v: 'Invited for the opening week' },
          ].map(({ k, v }) => (
            <div key={k} className="bg-[#0A0A0A] p-6 md:p-8">
              <p className="font-poppins text-[11px] uppercase tracking-[0.18em] text-white/35 mb-2">{k}</p>
              <p className="font-sora font-bold text-lg leading-snug">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. TIMELINE ── their line-up, our cycle against it */}
      <section className="bg-white/[0.03] border-y border-white/10">
        <div className="max-w-site mx-auto px-5 md:px-12 py-16 md:py-24">
          <SectionLabel>Timeline</SectionLabel>
          <h2 className="font-sora font-extrabold text-[clamp(1.6rem,4.5vw,3rem)] leading-[1.05] tracking-tight mb-3">
            Four residencies
          </h2>
          <p className="font-poppins text-base text-white/45 mb-10 max-w-md">
            Each one is its own campaign.
          </p>
          <ol className="flex flex-col">
            {residencies.map(({ chef, house, dates, note }, i) => (
              <li
                key={chef}
                className={`py-6 md:py-7 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 md:items-baseline ${i > 0 ? 'border-t border-white/10' : ''}`}
              >
                <span className="md:col-span-1 font-poppins text-[11px] text-[#C0A878] tracking-[0.18em]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="md:col-span-4 font-sora font-extrabold text-xl md:text-2xl tracking-tight">{chef}</span>
                <span className="md:col-span-4 font-poppins text-sm text-white/45">{house}</span>
                <span className="md:col-span-3 font-poppins text-sm text-white/70 md:text-right whitespace-nowrap">
                  {dates}
                </span>
                <span className="md:col-start-2 md:col-span-11 font-poppins text-[11px] uppercase tracking-[0.18em] text-white/30">
                  {note}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 6. HOW WE WORK ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-16 md:py-24">
        <SectionLabel>How we work</SectionLabel>
        <h2 className="font-sora font-extrabold text-[clamp(1.6rem,4.5vw,3rem)] leading-[1.05] tracking-tight mb-10">
          Every month, the same four things
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden">
          {howWeWork.map(({ n, title, line }) => (
            <div key={n} className="bg-[#0A0A0A] p-6 md:p-8">
              <p className="font-poppins text-[11px] text-[#C0A878] tracking-[0.18em] mb-5">{n}</p>
              <p className="font-sora font-extrabold text-xl tracking-tight mb-2">{title}</p>
              <p className="font-poppins text-sm text-white/45 leading-relaxed">{line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. AD BUDGET ── media spend only, stated separately on purpose */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-16 md:py-28">
        <SectionLabel>Recommended ad budget</SectionLabel>
        <h2 className="font-sora font-extrabold text-[clamp(1.6rem,4.5vw,3rem)] leading-[1.05] tracking-tight mb-10">
          ฿50,000 a month
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 rounded-xl overflow-hidden max-w-2xl">
          {[
            { k: 'Meta',   v: '฿30,000', s: 'Facebook and Instagram' },
            { k: 'Google', v: '฿20,000', s: 'Search and Maps' },
          ].map(({ k, v, s }) => (
            <div key={k} className="bg-[#0A0A0A] p-7 md:p-9">
              <p className="font-poppins text-[11px] uppercase tracking-[0.18em] text-white/35 mb-4">{k}</p>
              <p className="font-sora font-extrabold text-4xl md:text-5xl tracking-tight tabular-nums">{v}</p>
              <p className="font-poppins text-sm text-white/45 mt-2">{s}</p>
            </div>
          ))}
        </div>
        <p className="font-poppins text-sm text-white/35 mt-5 max-w-md">
          Media spend, paid to the platforms. Separate from our fee.
        </p>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10">
        <div className="max-w-site mx-auto px-5 md:px-12 py-10 flex items-center justify-between gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-rampup-light.svg" alt="RampUp" className="h-5 w-auto opacity-50" />
          <p className="font-poppins text-xs text-white/30">Prepared for U Sathorn Bangkok</p>
        </div>
      </footer>

    </main>
  )
}
