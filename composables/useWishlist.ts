import type { WishlistItem, WishlistItemInsert, WishlistItemUpdate } from '~/types'

const BUCKET = 'wishlist-images'

/** Extract the storage path from a Supabase public URL, or null if not a storage URL. */
function storagePathFromUrl(url: string | null): string | null {
  if (!url) return null
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  return idx !== -1 ? url.slice(idx + marker.length) : null
}

export const useWishlist = () => {
  const supabase = useSupabaseClient()
  const items = useState<WishlistItem[]>('wishlist-items', () => [])
  const loading = useState<boolean>('wishlist-loading', () => false)
  const error = useState<string | null>('wishlist-error', () => null)

  const fetchItems = async () => {
    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('wishlist_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (err) {
      error.value = err.message
    } else {
      items.value = (data as WishlistItem[]) ?? []
    }

    loading.value = false
  }

  const createItem = async (item: WishlistItemInsert): Promise<WishlistItem | null> => {
    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('wishlist_items')
      .insert(item)
      .select()
      .single()

    loading.value = false

    if (err) {
      error.value = err.message
      return null
    }

    const newItem = data as WishlistItem
    items.value = [newItem, ...items.value]
    return newItem
  }

  const updateItem = async (id: string, updates: WishlistItemUpdate): Promise<WishlistItem | null> => {
    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('wishlist_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    loading.value = false

    if (err) {
      error.value = err.message
      return null
    }

    const updated = data as WishlistItem
    items.value = items.value.map(i => (i.id === id ? updated : i))
    return updated
  }

  const deleteItem = async (id: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    // Delete stored image if it came from our bucket
    const item = items.value.find(i => i.id === id)
    const path = storagePathFromUrl(item?.image_url ?? null)
    if (path) {
      await supabase.storage.from(BUCKET).remove([path])
    }

    const { error: err } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', id)

    loading.value = false

    if (err) {
      error.value = err.message
      return false
    }

    items.value = items.value.filter(i => i.id !== id)
    return true
  }

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  }
}
