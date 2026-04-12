export type Category =
  | 'movie'
  | 'series'
  | 'documentary'
  | 'book'
  | 'music'
  | 'restaurant'
  | 'podcast'
  | 'game'
  | 'other'

export type Status = 'want_to_check' | 'in_progress' | 'done'

export type Priority = 'low' | 'medium' | 'high'

export interface WishlistItem {
  id: string
  title: string
  description: string | null
  category: Category
  status: Status
  priority: Priority
  rating: number | null
  tags: string[]
  url: string | null
  image_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type WishlistItemInsert = Omit<WishlistItem, 'id' | 'created_at' | 'updated_at'>

export type WishlistItemUpdate = Partial<WishlistItemInsert>

export interface CategoryMeta {
  value: Category
  label: string
  icon: string
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
  priority: Priority | 'all'
  tags: string[]
  sortBy: 'created_at' | 'title' | 'priority' | 'rating'
  sortDir: 'asc' | 'desc'
}
