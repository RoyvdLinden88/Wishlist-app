export type Category =
  | 'movie'
  | 'series'
  | 'documentary'
  | 'book'
  | 'music'
  | 'restaurant'
  | 'podcast'
  | 'other'
  | 'winkel'

export type Status = 'want_to_check' | 'in_progress' | 'done'

export interface WishlistItem {
  id: string
  title: string
  description: string | null
  category: Category
  status: Status
  tags: string[] | null
  url: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export type WishlistItemInsert = Omit<WishlistItem, 'id' | 'created_at' | 'updated_at'>

export type WishlistItemUpdate = Partial<WishlistItemInsert>

export interface CategoryMeta {
  value: Category
  label: string
  svgPath: string
  color: string
  bg: string
}

export interface StatusMeta {
  value: Status
  label: string
  color: string
  bg: string
  dot: string
}

export interface FilterState {
  search: string
  category: Category | 'all'
  status: Status | 'all'
  tag: string | null
  sortBy: 'created_at' | 'title'
  sortDir: 'asc' | 'desc'
}
