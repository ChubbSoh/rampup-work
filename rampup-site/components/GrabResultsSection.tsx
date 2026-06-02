// Shared "Grow Your Grab Sales" before/after results section used by the
// /lp/<client> funnels and /grab-offer offer page. Single source of truth
// for the case-study data and layout.

interface ResultCard {
  before: string
  after: string
  timeframe: string
  growth: string
  monthly: string
  beforeImg: string
  afterImg: string
}

const DEFAULT_CARDS: ResultCard[] = [
  { before: '฿665K', after: '฿1.25M', timeframe: '2 months', growth: '1.9x growth', monthly: '+฿295K / month', beforeImg: '/results/proof-1-after.jpg',  afterImg: '/results/proof-1-before.jpg' },
  { before: '฿300K', after: '฿628K',  timeframe: '2 months', growth: '2.1x growth', monthly: '+฿328K / month', beforeImg: '/results/proof-2-before.jpg', afterImg: '/results/proof-2-after.jpg' },
  { before: '฿127K', after: '฿249K',  timeframe: '4 months', growth: '2x growth',   monthly: '+฿122K / month', beforeImg: '/results/proof-3-before.jpg', afterImg: '/results/proof-3-after.jpg' },
  { before: '฿431K', after: '฿814K',  timeframe: '5 months', growth: '1.9x growth', monthly: '+฿383K / month', beforeImg: '/results/proof-4-before.jpg', afterImg: '/results/proof-4-after.jpg' },
]

interface Props {
  heading?: string
  subheading?: string
  footerLine?: string
  cards?: ResultCard[]
  /** Show only the first N cards (default: all). Use 3 for the grab-offer page. */
  limit?: number
}

export default function GrabResultsSection({
  heading = 'Grow Your Grab Sales',
  subheading = 'Actual revenue growth from restaurants we work with',
  footerLine,
  cards = DEFAULT_CARDS,
  limit,
}: Props) {
  const shown = typeof limit === 'number' ? cards.slice(0, limit) : cards
  return (
    <section className="bg-black py-10 md:py-14">
      <div className="max-w-site mx-auto px-5 md:px-12">
        <h2 className="font-sora font-extrabold text-2xl md:text-3xl text-white tracking-tight mb-2 text-center">
          {heading}
        </h2>
        <p className="font-poppins text-base md:text-lg text-white/50 text-center mb-6">
          {subheading}
        </p>
        <div
          className={`flex gap-5 md:grid md:gap-5 ${shown.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}
          style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {shown.map((card) => (
            <div
              key={card.before + card.after}
              className="shrink-0 w-[80vw] md:w-auto bg-[#F5F5F5] rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5"
              style={{ scrollSnapAlign: 'start' }}
            >
              <p className="font-sora font-bold text-[17px] text-dark leading-tight mb-0.5">
                {card.before} → {card.after}
              </p>
              <p className="font-poppins text-[11px] text-muted/70 mb-4">Results achieved in {card.timeframe}</p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {([
                  { label: 'BEFORE' as const, src: card.beforeImg },
                  { label: 'AFTER'  as const, src: card.afterImg  },
                ]).map(({ label, src }) => (
                  <div key={label} className="relative rounded-[12px] overflow-hidden bg-[#E4E4E4]" style={{ aspectRatio: '9/16' }}>
                    {src && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt={label} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-top" />
                    )}
                    <div className="absolute inset-x-0 top-0 h-[20%] z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, transparent 100%)' }} />
                    <div className="absolute inset-x-0 bottom-0 h-[20%] z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.85) 0%, transparent 100%)' }} />
                    <span className={`absolute top-2 left-2 font-poppins text-[10px] font-bold px-2 py-1 rounded-full text-white z-10 ${label === 'BEFORE' ? 'bg-[#9E9E9E]' : 'bg-[#3DBE5A]'}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="font-sora font-extrabold text-2xl text-green mb-0.5">{card.growth}</p>
              <p className="font-poppins text-sm font-semibold text-dark mb-0.5">{card.monthly}</p>
              <p className="font-poppins text-[11px] text-muted/70">Average monthly increase in revenue</p>
            </div>
          ))}
        </div>
        {footerLine && (
          <p className="font-poppins text-center text-white/60 text-sm md:text-base mt-6">
            {footerLine}
          </p>
        )}
      </div>
    </section>
  )
}
