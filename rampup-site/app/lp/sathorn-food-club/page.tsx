import type { Metadata } from 'next'
import { getClientBySlug } from '@/lib/clients'
import LazyVideoCard from '@/components/LazyVideoCard'
import MonthlyPlanCarousel from '@/components/MonthlyPlanCarousel'
import { restaurantRampUp, formatTHB } from '@/lib/pricing'

/**
 * Proposal page for one named prospect: Sathorn Food Club at U Sathorn.
 *
 * Not a concept funnel. The /lp pages next to this one sell a category to
 * strangers and end in an apply form; this one is shown to a restaurant we are
 * already pitching, so it carries no lead form.
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
  'Videography + Photography (Full production)',
  'Ads on Google, Meta and TikTok',
  'Social media management',
]

/**
 * Their own line-up, straight from the deck. Dates are theirs, not ours.
 *
 * The chef's home restaurant used to sit in a second column and has been
 * dropped: they are pitching an independent destination, not a tour of other
 * people's dining rooms, and the names already carry the credibility.
 */
const residencies = [
  { chef: 'Kanji Kobayashi', dates: '16 Dec — 31 Jan', note: 'Agrigastronomy' },
  { chef: 'Chef Black',      dates: '1 Feb — 30 Apr',  note: 'Fermentation' },
  { chef: 'Dan Bark',        dates: '1 May — 31 Jul',  note: 'Korean-American' },
  { chef: 'Chef Waii',       dates: '1 Aug — 31 Oct',  note: 'Northern Thai' },
]

/** What one shoot turns into. Seven films a month, split by the job each does. */
const campaignMix = [
  { n: '4', label: 'Booking ads' },
  { n: '2', label: 'Location ads' },
  { n: '1', label: 'Brand awareness' },
]

// ─── What we expect the restaurant to turn over ──────────────────────────────
// Chubb's own read of a 150-seat room at these prices, not a model: a venue
// like this does ฿4-6M in high season and about 60% of that when it is quiet.
// Stated as total revenue rather than a lift we claim credit for, because they
// take no bookings and no cover can be traced back to an ad anyway.
// Both bands are Chubb's figures, stated rather than derived. Low season used
// to be a flat 60% of high; it is not, so deriving it would quietly overwrite
// the number he actually wants on the page.
const HIGH_SEASON = [3_900_000, 5_000_000]
const LOW_SEASON = [1_900_000, 3_000_000]

/** 4000000 -> "฿4M", 2400000 -> "฿2.4M". Whole millions lose the decimal. */
const millions = (n: number) =>
  `฿${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`

const seasons = [
  { label: 'High season', range: `${millions(HIGH_SEASON[0])} – ${millions(HIGH_SEASON[1])}` },
  { label: 'Low season',  range: `${millions(LOW_SEASON[0])} – ${millions(LOW_SEASON[1])}` },
]

// ─── Price breakdown ─────────────────────────────────────────────────────────
// Split three ways on purpose: what it costs every month, what comes off if
// they take work in-house, and what is paid once. A single blended figure
// hides the fact that two of these are their choice.
const priceMonthly = [
  {
    label: 'RampUp Management',
    value: `฿${formatTHB(restaurantRampUp.price)}`,
    unit: 'a month',
    // Mirrors the four steps in "How we work" above, with the production
    // numbers made explicit. Seven videos is the same count the contract and
    // the shoot plan use, so the three never disagree.
    items: [
      '7 videos a month',
      '20–30 photos',
      '4–5 posts a week',
      'Feed design',
      'Ad management on Meta and Google',
      'One report a month',
    ],
  },
  {
    label: 'Influencers, 4 a month',
    value: '฿10,000',
    unit: 'a month',
    note: 'Bartering fee is on top, usually ฿2,000 to ฿3,000.',
  },
]

const priceDiscounts = [
  { label: 'You post it yourself', value: '− ฿1,500', unit: 'a month' },
  { label: 'You run the ads yourself', value: '− ฿5,000', unit: 'a month' },
]

const priceSetup = [
  {
    label: 'Set up tracking, website and booking for 7 rooms',
    value: '฿15,990',
    unit: 'once',
    note: 'What it tracks goes into your monthly report.',
  },
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

type PriceLine = {
  label: string
  value: string
  unit?: string
  note?: string
  /** What the line buys. Rendered small under the label, left of the price. */
  items?: string[]
}

/** One line of the price breakdown: what it is on the left, what it costs right. */
const PriceRow = ({ label, value, unit, note, items }: PriceLine) => (
  <div className="py-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-6 sm:items-baseline">
    <span className="sm:col-span-7 font-poppins text-base md:text-lg">{label}</span>
    <span className="sm:col-span-5 sm:text-right font-sora font-extrabold text-xl md:text-2xl tracking-tight tabular-nums">
      {value}
      {unit && <span className="font-poppins font-normal text-sm text-white/45 ml-2">{unit}</span>}
    </span>
    {items && (
      <ul className="sm:col-start-1 sm:col-span-7 flex flex-col gap-1.5 mt-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 font-poppins text-sm text-white/45">
            <span aria-hidden className="mt-[0.62em] h-px w-2.5 shrink-0 bg-white/25" />
            {item}
          </li>
        ))}
      </ul>
    )}
    {note && (
      <span className="sm:col-span-12 font-poppins text-sm text-white/35 leading-relaxed">{note}</span>
    )}
  </div>
)

export default function SathornFoodClubPage() {
  const napha     = getClientBySlug('napha')
  const tohDaeng  = getClientBySlug('toh-d')
  const mansTable = getClientBySlug('mans-table')

  const customerCode = process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE ?? ''

  // One reel per restaurant, in the order the line above this section names
  // them. Three venues, three reels: the row proves its own caption rather
  // than leaning on whichever client happens to have the most footage.
  //
  // Chosen by Stream id, never by position. Napha's videos[0] is the pork
  // chop cut; the one picked here is the file named "Use this" in its WEBSITE
  // folder, NAPHA VDO 6 Strawberry. Array order is also rewritten every time
  // a shoot is republished, so a positional pick would drift on its own.
  // Add a slug below to pin that restaurant's reel; with no entry it falls
  // back to the client's first video.
  const CHOSEN_REEL: Record<string, string> = {
    // "Use this - NAPHA VDO 6 Strawberry"
    napha: '38f05898475ab5f82d496497d8a7f02a',
    // "USE THIS - VIDEO 6", the chef-to-camera piece. Confirmed against the
    // Drive file's own poster frame, not inferred from array order.
    'mans-table': '1e7cef531af56b5db382dbf1248605bb',
    // Toh Daeng's "USE THIS" cut is not on Stream: its republish died on a
    // missing feed-design subfolder, so clients.json still holds April's
    // upload. Add its id here once the publish has run clean.
  }
  const pickReel = (c: ReturnType<typeof getClientBySlug>, slug: string) => {
    const vids = c?.videos ?? []
    const chosen = CHOSEN_REEL[slug]
    const id = chosen && vids.includes(chosen) ? chosen : vids[0]
    return id ? [id] : []
  }

  const videoIds = [
    ...pickReel(napha, 'napha'),
    ...pickReel(mansTable, 'mans-table'),
    ...pickReel(tohDaeng, 'toh-d'),
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
  // Their Canva feed planner, shown under "how we work" as the worked example.
  const planPages = mansTable?.monthly_plan ?? []

  // desktopOnly drops a row on phones. Three restaurants is a long scroll on a
  // handset and Toh Daeng is the weakest of the three here: its media is still
  // April's, because its republish has not run clean yet.
  const photoRows = [
    { name: 'Napha',      desktopOnly: false, photos: notArtwork(napha).slice(0, 4) },
    { name: 'Man Tables', desktopOnly: false, photos: notArtwork(mansTable).slice(0, 4) },
    { name: 'Toh Daeng',  desktopOnly: true,  photos: notArtwork(tohDaeng).slice(0, 4) },
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

        {/* The figure is read from lib/pricing, never typed here, so this page
            cannot quote a stale price after the package changes. The exclusion
            sits directly under it on purpose: the ad budget section proposes a
            further ฿50,000, and the two must never add up in a reader's head. */}
        <div className="mt-10 md:mt-12">
          <p className="font-sora font-extrabold text-2xl md:text-3xl tracking-tight tabular-nums">
            {formatTHB(restaurantRampUp.price)} baht per month
          </p>
          <p className="font-poppins text-base text-white/45 mt-1">(excluding vat)</p>
        </div>
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
              // Third reel is Toh Daeng, dropped on phones. Three 9:16 cards in
              // a two-column grid leave one stranded on its own row, and this is
              // the clip still waiting on a clean publish.
              <div key={id} className={i === 2 ? 'hidden md:block' : undefined}>
                <LazyVideoCard
                  videoId={id}
                  customerCode={customerCode}
                  label={`Reel ${i + 1}`}
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
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
            {photoRows.map(({ name, photos, desktopOnly }) => (
              <div key={name} className={desktopOnly ? 'hidden md:block' : undefined}>
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
            {residencies.map(({ chef, dates, note }, i) => (
              <li
                key={chef}
                className={`py-6 md:py-7 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 md:items-baseline ${i > 0 ? 'border-t border-white/10' : ''}`}
              >
                <span className="md:col-span-1 font-poppins text-[11px] text-[#C0A878] tracking-[0.18em]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="md:col-span-7 font-sora font-extrabold text-xl md:text-2xl tracking-tight">{chef}</span>
                <span className="md:col-span-4 font-poppins text-sm text-white/70 md:text-right whitespace-nowrap">
                  {dates}
                </span>
                <span className="md:col-start-2 md:col-span-11 font-poppins text-[11px] uppercase tracking-[0.18em] text-white/30">
                  {note}
                </span>
              </li>
            ))}
          </ol>

          {/* What a residency actually costs them in access, and the lead time
              that follows from it. The November date is the whole point of this
              block: a 1 December launch is only possible if we are in the room
              a month before, and that is the easiest thing for a client to
              discover too late. */}
          <div className="mt-12 md:mt-16 pt-10 border-t border-white/10">
            <SectionLabel>Every month</SectionLabel>
            <div className="grid grid-cols-3 gap-px bg-white/10 rounded-xl overflow-hidden max-w-2xl">
              {campaignMix.map(({ n, label }) => (
                <div key={label} className="bg-[#0A0A0A] p-5 md:p-7">
                  <p className="font-sora font-extrabold text-4xl md:text-5xl tracking-tight tabular-nums">{n}</p>
                  <p className="font-poppins text-sm text-white/45 mt-2 leading-snug">{label}</p>
                </div>
              ))}
            </div>
            <p className="font-poppins text-base md:text-lg text-white mt-6 max-w-lg">
              One shoot a month. Ten business days from shoot to live.
            </p>
            <p className="font-poppins text-base text-white/45 mt-1 max-w-lg">
              To launch 1 December, we shoot at the start of November.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. HOW WE WORK ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-16 md:py-24">
        <SectionLabel>How we work</SectionLabel>
        <h2 className="font-sora font-extrabold text-[clamp(1.6rem,4.5vw,3rem)] leading-[1.05] tracking-tight mb-10">
          Get our marketing system done for you
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

        {/* The planner itself, so "feed design" and "posting" above stop being
            claims. Reuses the carousel the other /lp pages use rather than a
            second implementation; it is theme-neutral enough for the dark
            ground here. */}
        {planPages.length > 0 && (
          <div className="mt-12 md:mt-16">
            <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C0A878] mb-5">
              An example · Man Tables
            </p>
            <MonthlyPlanCarousel photos={planPages} clientName="Man Tables" />
          </div>
        )}
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

      {/* ── 7b. WHAT IT CAN RETURN ── a guide, with the limits stated in the
          same breath. Their brief asks what one baht returned, but they take
          no bookings and charge no booking fee, so most covers can never be
          attributed to an ad. Showing a range and saying plainly that it is
          not a promise is the only honest way to answer that question. */}
      <section className="bg-white/[0.03] border-y border-white/10">
        <div className="max-w-site mx-auto px-5 md:px-12 py-16 md:py-24">
          <SectionLabel>What we expect you to make</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 rounded-xl overflow-hidden max-w-3xl">
            {seasons.map(({ label, range }) => (
              <div key={label} className="bg-[#0A0A0A] p-7 md:p-9">
                <p className="font-poppins text-[11px] uppercase tracking-[0.18em] text-white/35 mb-4">
                  {label}
                </p>
                <p className="font-sora font-extrabold text-3xl md:text-5xl tracking-tight tabular-nums">
                  {range}
                </p>
                <p className="font-poppins text-sm text-white/45 mt-2">a month</p>
              </div>
            ))}
          </div>
          <p className="font-poppins text-sm text-white/35 mt-8 max-w-xl leading-relaxed">
            A guide, not a promise. Many guests walk in instead of booking, so
            ads never get the credit for them. We do not guarantee performance.
          </p>
        </div>
      </section>

      {/* ── 8. PRICE BREAKDOWN ── */}
      <section className="max-w-site mx-auto px-5 md:px-12 py-16 md:py-24">
        <SectionLabel>Price</SectionLabel>
        <h2 className="font-sora font-extrabold text-[clamp(1.6rem,4.5vw,3rem)] leading-[1.05] tracking-tight mb-10">
          Marketing Budget
        </h2>

        <div className="max-w-3xl">
          {priceMonthly.map((line) => <PriceRow key={line.label} {...line} />)}

          <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C0A878] mt-10 mb-1">
            Take off
          </p>
          {priceDiscounts.map((line) => <PriceRow key={line.label} {...line} />)}

          <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C0A878] mt-10 mb-1">
            One time
          </p>
          {priceSetup.map((line) => <PriceRow key={line.label} {...line} />)}
        </div>
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
