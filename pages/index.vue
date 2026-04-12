<script setup lang="ts">
import type { WishlistItem, FilterState, Category, Status, Priority } from '~/types'

const { items, loading, error, fetchItems, updateItem, deleteItem } = useWishlist()
const { categories, statuses, priorities } = useMeta()

await fetchItems()

const filters = reactive<FilterState>({
  search: '',
  category: 'all',
  status: 'all',
  priority: 'all',
  tags: [],
  sortBy: 'created_at',
  sortDir: 'desc',
})

const allTags = computed(() => {
  const set = new Set<string>()
  items.value.forEach(i => i.tags?.forEach(t => set.add(t)))
  return Array.from(set).sort()
})

const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

const filtered = computed(() => {
  let result = [...items.value]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(i =>
      i.title.toLowerCase().includes(q)
      || i.description?.toLowerCase().includes(q)
      || i.tags?.some(t => t.includes(q)),
    )
  }

  if (filters.category !== 'all') {
    result = result.filter(i => i.category === filters.category)
  }

  if (filters.status !== 'all') {
    result = result.filter(i => i.status === filters.status)
  }

  if (filters.priority !== 'all') {
    result = result.filter(i => i.priority === filters.priority)
  }

  if (filters.tags.length) {
    result = result.filter(i => filters.tags.every(t => i.tags?.includes(t)))
  }

  result.sort((a, b) => {
    let cmp = 0
    if (filters.sortBy === 'title') {
      cmp = a.title.localeCompare(b.title)
    } else if (filters.sortBy === 'priority') {
      cmp = priorityOrder[a.priority] - priorityOrder[b.priority]
    } else if (filters.sortBy === 'rating') {
      cmp = (b.rating ?? 0) - (a.rating ?? 0)
    } else {
      cmp = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    return filters.sortDir === 'asc' ? cmp : -cmp
  })

  return result
})

const toggleTag = (tag: string) => {
  const idx = filters.tags.indexOf(tag)
  if (idx === -1) filters.tags.push(tag)
  else filters.tags.splice(idx, 1)
}

const resetFilters = () => {
  filters.search = ''
  filters.category = 'all'
  filters.status = 'all'
  filters.priority = 'all'
  filters.tags = []
  filters.sortBy = 'created_at'
  filters.sortDir = 'desc'
}

const hasActiveFilters = computed(() =>
  filters.search
  || filters.category !== 'all'
  || filters.status !== 'all'
  || filters.priority !== 'all'
  || filters.tags.length > 0,
)

// Edit / delete
const editItem = ref<WishlistItem | null>(null)
const deleteId = ref<string | null>(null)
const modalOpen = ref(false)

const onEdit = (item: WishlistItem) => {
  editItem.value = item
  modalOpen.value = true
}

const onSave = async (data: any) => {
  if (editItem.value) {
    await updateItem(editItem.value.id, data)
  }
  modalOpen.value = false
  editItem.value = null
}

const onDelete = async () => {
  if (deleteId.value) {
    await deleteItem(deleteId.value)
    deleteId.value = null
  }
}

const onStatusChange = async (id: string, status: WishlistItem['status']) => {
  await updateItem(id, { status })
}
</script>

<template>
  <div class="min-h-screen">
    <AppHeader />

    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Hero -->
      <div class="space-y-1">
        <h1 class="font-display text-4xl font-800 tracking-tight">
          Your Wishlist
        </h1>
        <p class="text-white/40 text-sm">Everything you want to explore, all in one place.</p>
      </div>

      <!-- Stats -->
      <StatsBar :items="items" />

      <!-- Filters -->
      <div class="glass rounded-2xl p-4 space-y-4">
        <!-- Search + Sort row -->
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="filters.search"
              class="input pl-9"
              placeholder="Search titles, tags..."
            />
          </div>

          <div class="flex gap-2">
            <select v-model="filters.sortBy" class="input w-auto">
              <option value="created_at">Newest</option>
              <option value="title">Title</option>
              <option value="priority">Priority</option>
              <option value="rating">Rating</option>
            </select>
            <button
              class="btn-ghost px-3"
              :title="filters.sortDir === 'desc' ? 'Sort ascending' : 'Sort descending'"
              @click="filters.sortDir = filters.sortDir === 'desc' ? 'asc' : 'desc'"
            >
              <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': filters.sortDir === 'asc' }"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Category pills -->
        <div class="flex flex-wrap gap-2">
          <button
            class="badge cursor-pointer transition-all"
            :class="filters.category === 'all'
              ? 'bg-brand-600 text-white'
              : 'bg-white/8 text-white/50 hover:bg-white/12 hover:text-white'"
            @click="filters.category = 'all'"
          >
            All
          </button>
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="badge cursor-pointer transition-all"
            :class="filters.category === cat.value
              ? [cat.bg, cat.color, 'ring-1 ring-current/30']
              : 'bg-white/8 text-white/50 hover:bg-white/12 hover:text-white'"
            @click="filters.category = filters.category === cat.value ? 'all' : cat.value as Category"
          >
            {{ cat.icon }} {{ cat.label }}
          </button>
        </div>

        <!-- Status + Priority filters -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="st in statuses"
              :key="st.value"
              class="badge cursor-pointer transition-all"
              :class="filters.status === st.value
                ? [st.bg, st.color, 'ring-1 ring-current/30']
                : 'bg-white/8 text-white/50 hover:bg-white/12'"
              @click="filters.status = filters.status === st.value ? 'all' : st.value as Status"
            >
              <span :class="[st.dot, 'h-1.5 w-1.5 rounded-full']" />
              {{ st.label }}
            </button>
          </div>

          <div class="w-px h-4 bg-white/10 hidden sm:block" />

          <div class="flex gap-2 flex-wrap">
            <button
              v-for="p in priorities"
              :key="p.value"
              class="badge cursor-pointer transition-all capitalize"
              :class="filters.priority === p.value
                ? [p.bg, p.color, 'ring-1 ring-current/30']
                : 'bg-white/8 text-white/50 hover:bg-white/12'"
              @click="filters.priority = filters.priority === p.value ? 'all' : p.value as Priority"
            >
              {{ p.label }}
            </button>
          </div>

          <button
            v-if="hasActiveFilters"
            class="ml-auto btn-ghost text-white/40 text-xs"
            @click="resetFilters"
          >
            Clear filters
          </button>
        </div>

        <!-- Tag pills (only when there are tags) -->
        <div v-if="allTags.length" class="flex flex-wrap gap-1.5 pt-1 border-t border-white/8">
          <span class="text-xs text-white/30 self-center mr-1">Tags:</span>
          <button
            v-for="tag in allTags"
            :key="tag"
            class="badge cursor-pointer transition-all"
            :class="filters.tags.includes(tag)
              ? 'bg-brand-600/30 text-brand-300 ring-1 ring-brand-500/30'
              : 'bg-white/6 text-white/40 hover:bg-white/10 hover:text-white/60'"
            @click="toggleTag(tag)"
          >
            #{{ tag }}
          </button>
        </div>
      </div>

      <!-- Results count -->
      <div class="flex items-center justify-between">
        <p class="text-sm text-white/40">
          <span class="text-white font-medium">{{ filtered.length }}</span>
          {{ filtered.length === 1 ? 'item' : 'items' }}
          <span v-if="hasActiveFilters"> matching filters</span>
        </p>
        <NuxtLink to="/manage" class="btn-primary">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Item
        </NuxtLink>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="flex items-center gap-3 text-white/40">
          <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading your wishlist...
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="glass rounded-xl p-6 text-center">
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="!filtered.length" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="text-6xl mb-4">{{ hasActiveFilters ? '🔍' : '✨' }}</div>
        <h3 class="font-display font-700 text-xl mb-2">
          {{ hasActiveFilters ? 'No matches found' : 'Your wishlist is empty' }}
        </h3>
        <p class="text-white/40 text-sm mb-6 max-w-xs">
          {{ hasActiveFilters ? 'Try adjusting your filters.' : 'Start adding things you want to check out!' }}
        </p>
        <button v-if="hasActiveFilters" class="btn-secondary" @click="resetFilters">
          Clear filters
        </button>
        <NuxtLink v-else to="/manage" class="btn-primary">
          Add your first item
        </NuxtLink>
      </div>

      <!-- Grid -->
      <div
        v-else
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <WishlistCard
          v-for="item in filtered"
          :key="item.id"
          :item="item"
          @edit="onEdit"
          @delete="(id) => (deleteId = id)"
          @status-change="onStatusChange"
        />
      </div>
    </main>

    <!-- Edit modal -->
    <ItemModal
      :open="modalOpen"
      :item="editItem"
      @close="modalOpen = false; editItem = null"
      @save="onSave"
    />

    <!-- Delete confirm -->
    <ConfirmModal
      :open="!!deleteId"
      title="Delete item?"
      message="This will permanently remove the item from your wishlist."
      @confirm="onDelete"
      @cancel="deleteId = null"
    />
  </div>
</template>
