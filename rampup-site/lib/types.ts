export interface Client {
  name: string
  slug: string
  cuisine: string
  location: string
  description: string
  months: number | string
  cover: string
  page: string
  last_updated?: string
  videos?: string[]
  photos?: string[]
  feed_design?: string
  monthly_plan?: string[]
}

export type CuisineFilter =
  | 'all'
  | 'japanese'
  | 'italian'
  | 'korean'
  | 'western'
  | 'nightlife'
  | 'cafe'
  | 'thai'
  | 'chinese'
  | 'mexican'
