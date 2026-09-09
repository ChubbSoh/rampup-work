/**
 * Configuration for the concept funnel pages under /lp.
 *
 * These pages sell a CONCEPT, not a client: someone who runs a rooftop bar
 * should land on a page about rooftop bars, with one of our rooftop clients as
 * the proof. So the headline comes from `concept` here, not from the client's
 * `cuisine` field — cuisine cannot express "rooftop bar", "omakase" or
 * "chef-driven", and several clients belong to more than one concept.
 *
 * `clients.json` is written by the n8n onboarding automation, so concept
 * mapping lives here instead: anything added there risks being overwritten by
 * the next `onboard: add <slug>` commit.
 *
 * A page renders whatever media its client has. Clients with no videos or
 * photos yet fall back to placeholders rather than breaking the layout.
 */

export type FunnelAccent = 'green' | 'black'

export type FunnelImage = { src: string; caption: string }

export type FunnelPageConfig = {
  /** Client whose photos, reels, feed design and monthly plan fill the page. */
  clientSlug: string

  /**
   * Singular, title case: "Rooftop Bar", "High-End Chinese Restaurant".
   * Used as "…For Your {concept}" and "See How We Market {concept}s".
   */
  concept: string

  /**
   * Plural, sentence case, for mid-sentence use: "rooftop bars",
   * "Thai restaurants". Kept separate because "See How We Market Rooftop Bars"
   * needs title case while "…for rooftop bars in Thailand" does not.
   */
  conceptPlural: string

  /** Form placeholder for the restaurant name field. */
  restaurantPlaceholder: string

  /** 'black' for the high-end concepts, where green reads too loud. */
  accent?: FunnelAccent

  /** Headline figures. The section is hidden when this is absent. */
  numbers?: { value: string; label: string }[]

  /** Social post screenshots. Section hidden when empty. */
  socialPosts?: FunnelImage[]

  /** Google Business Profile screenshot. Hidden when absent. */
  mapsImage?: FunnelImage
}

export const funnelPages = {
  okasan: {
    clientSlug: 'okasan',
    concept: 'Japanese Restaurant',
    conceptPlural: 'Japanese restaurants',
    restaurantPlaceholder: 'e.g. Okasan Izakaya',
    numbers: [
      { value: '1.2M+', label: 'Views' },
      { value: '40%', label: 'Increase in Grab sales' },
      { value: '30', label: 'Private room bookings per month' },
    ],
    socialPosts: [
      { src: '/funnel/okasan-fb-vibe.webp', caption: 'Carousel post to showcase vibe' },
      { src: '/funnel/okasan-fb-food.webp', caption: 'Carousel post to showcase food' },
    ],
    mapsImage: {
      src: '/funnel/okasan-googlemaps.webp',
      caption: 'Get customers through Google Maps',
    },
  },

  // Rooftop bar, twice: Lamaya has the media today, Brewave's is still to come.
  'lamaya-bkk': {
    clientSlug: 'lamaya-bkk',
    concept: 'Rooftop Bar',
    conceptPlural: 'rooftop bars',
    restaurantPlaceholder: 'e.g. Lamaya BKK',
  },
  brewave: {
    clientSlug: 'brewave-ari',
    concept: 'Rooftop Bar',
    conceptPlural: 'rooftop bars',
    restaurantPlaceholder: 'e.g. Brewave Ari',
  },

  // High end. Black rather than green: the accent is the whole point here.
  aela: {
    clientSlug: 'aela',
    concept: 'High-End Restaurant',
    conceptPlural: 'high-end restaurants',
    restaurantPlaceholder: 'e.g. Aela',
    accent: 'black',
  },

  'mans-table': {
    clientSlug: 'mans-table',
    concept: 'High-End Chinese Restaurant',
    conceptPlural: 'high-end Chinese restaurants',
    restaurantPlaceholder: "e.g. Man's Table",
    accent: 'black',
  },

  napha: {
    clientSlug: 'napha',
    concept: 'Chef-Driven Restaurant',
    conceptPlural: 'chef-driven restaurants',
    restaurantPlaceholder: 'e.g. Napha',
  },

  // Thai, twice: one general page carried by a client with media, one for
  // Savoey itself once its media lands.
  'thai-restaurant': {
    clientSlug: 'raluek',
    concept: 'Thai Restaurant',
    conceptPlural: 'Thai restaurants',
    restaurantPlaceholder: 'e.g. RaLuek',
  },
  savoey: {
    clientSlug: 'savoey',
    concept: 'Thai Restaurant',
    conceptPlural: 'Thai restaurants',
    restaurantPlaceholder: 'e.g. Savoey',
  },
} satisfies Record<string, FunnelPageConfig>
