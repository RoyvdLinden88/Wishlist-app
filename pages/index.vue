<script setup lang="ts">
import type { FilterState, Category } from '~/types'
import { getLocationFlagUrl } from '~/composables/useMeta'

const { items, loading, error, fetchItems } = useWishlist()
const { categories } = useMeta()

await fetchItems()

const view = ref<'todo' | 'archive'>('todo')

const filters = reactive<FilterState>({
  search: '',
  category: 'all',
  status: 'all',
  location: null,
  sortBy: 'created_at',
  sortDir: 'desc',
})

const filtered = computed(() => {
  const targetStatus = view.value === 'todo' ? 'want_to_check' : 'done'
  let result = items.value.filter(i => i.status === targetStatus)

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(i =>
      i.title.toLowerCase().includes(q)
      || i.description?.toLowerCase().includes(q),
    )
  }

  if (filters.category !== 'all') {
    result = result.filter(i => i.category === filters.category)
  }

  if (filters.location) {
    result = result.filter(i => i.location === filters.location)
  }

  result.sort((a, b) => {
    const cmp = filters.sortBy === 'title'
      ? a.title.localeCompare(b.title)
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    return filters.sortDir === 'asc' ? cmp : -cmp
  })

  return result
})

const hasActiveFilters = computed(() =>
  filters.search || filters.category !== 'all' || filters.location !== null,
)

const allLocations = computed(() => {
  const targetStatus = view.value === 'todo' ? 'want_to_check' : 'done'
  const set = new Set<string>()
  items.value
    .filter(i => i.status === targetStatus && i.location)
    .forEach(i => set.add(i.location!))
  return [...set].sort()
})

const resetFilters = () => {
  filters.search = ''
  filters.category = 'all'
  filters.location = null
}


</script>

<template>
  <div class="min-h-screen">
    <AppHeader />

    <!-- Hero + Stats (not sticky) -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-6 space-y-6">
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-1">
          <h1 class="font-display text-4xl font-800 tracking-tight">Jouw Verlanglijst</h1>
          <p class="text-white/40 text-sm">Alles wat je wilt ontdekken, op één plek.</p>
        </div>
        <div class="flex gap-1 rounded-xl bg-white/5 p-1 mt-1 flex-shrink-0">
          <button
            class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            :class="view === 'todo' ? 'bg-brand-600 text-white shadow' : 'text-white/40 hover:text-white'"
            @click="view = 'todo'; resetFilters()"
          >
            Todo
          </button>
          <button
            class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            :class="view === 'archive' ? 'bg-white/10 text-white shadow' : 'text-white/40 hover:text-white'"
            @click="view = 'archive'; resetFilters()"
          >
            Archief
          </button>
        </div>
      </div>
      <StatsBar :items="items" />
    </div>

    <!-- Sticky filter bar -->
    <div class="sticky top-16 z-30 border-b border-white/10 bg-surface-900/95 backdrop-blur-xl">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 space-y-3">

        <!-- Search -->
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="filters.search"
            class="input pl-9"
            placeholder="Zoeken op titel..."
          />
        </div>

        <!-- Category pills -->
        <div class="flex flex-wrap gap-1.5">
          <button
            class="badge cursor-pointer transition-all"
            :class="filters.category === 'all'
              ? 'bg-brand-600 text-white'
              : 'bg-white/10 text-white/50 hover:bg-white/15 hover:text-white'"
            @click="filters.category = 'all'"
          >
            Alles
          </button>
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="badge cursor-pointer transition-all gap-1.5"
            :class="filters.category === cat.value
              ? [cat.bg, cat.color, 'ring-1 ring-current/30']
              : 'bg-white/10 text-white/50 hover:bg-white/15 hover:text-white'"
            @click="filters.category = filters.category === cat.value ? 'all' : cat.value as Category"
          >
            <svg class="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" :d="cat.svgPath" />
            </svg>
            {{ cat.label }}
          </button>

          <button
            class="ml-auto btn-ghost text-xs transition-colors"
            :class="hasActiveFilters ? 'text-white/60 hover:text-white' : 'text-white/20 cursor-default'"
            :disabled="!hasActiveFilters"
            @click="resetFilters"
          >
            Filters wissen
          </button>
        </div>

        <!-- Location pills -->
        <div v-if="allLocations.length" class="flex flex-wrap gap-1.5">
          <button
            v-for="loc in allLocations"
            :key="loc"
            class="badge cursor-pointer transition-all text-xs gap-1.5"
            :class="filters.location === loc
              ? 'bg-brand-600/40 text-brand-300 ring-1 ring-brand-500/40'
              : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'"
            @click="filters.location = filters.location === loc ? null : loc"
          >
            <img v-if="getLocationFlagUrl(loc)" :src="getLocationFlagUrl(loc)!" :alt="loc" class="w-4 rounded-sm flex-shrink-0" />
            {{ loc }}
          </button>
        </div>

      </div>
    </div>

    <!-- Main content -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      <!-- Results count + add button -->
      <div class="flex items-center justify-between">
        <p class="text-sm text-white/40">
          <span class="text-white font-medium">{{ filtered.length }}</span>
          {{ filtered.length === 1 ? 'item' : 'items' }}
          <span v-if="hasActiveFilters"> gevonden</span>
        </p>
        <NuxtLink to="/manage" class="btn-primary">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span class="hidden sm:inline">Item toevoegen</span>
          <span class="sm:hidden">Toevoegen</span>
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="flex items-center gap-3 text-white/40">
          <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Verlanglijst laden...
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="glass rounded-xl p-6 text-center">
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="!filtered.length" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 mb-4">
          <svg class="h-8 w-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              :d="hasActiveFilters
                ? 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                : 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'" />
          </svg>
        </div>
        <h3 class="font-display font-700 text-xl mb-2">
          {{ hasActiveFilters ? 'Geen resultaten' : view === 'archive' ? 'Archief is leeg' : 'Je verlanglijst is leeg' }}
        </h3>
        <p class="text-white/40 text-sm mb-6 max-w-xs">
          {{ hasActiveFilters ? 'Probeer je filters aan te passen.' : view === 'archive' ? 'Items die je afvinkt verschijnen hier.' : 'Begin met het toevoegen van dingen die je wilt ontdekken!' }}
        </p>
        <button v-if="hasActiveFilters" class="btn-secondary" @click="resetFilters">
          Filters wissen
        </button>
        <NuxtLink v-else-if="view === 'todo'" to="/manage" class="btn-primary">
          Eerste item toevoegen
        </NuxtLink>
      </div>

      <!-- Grid -->
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <WishlistCard
          v-for="item in filtered"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>

  </div>
</template>
