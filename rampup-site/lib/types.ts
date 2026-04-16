export interface Client {
  name: string
  slug: string
  cuisine: string
  location: string
  description: string
  months: number | string
  cover: string
  page: string
  drive_folder: string
  last_updated?: string
  videos?: string[]
  photos?: string[]
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
