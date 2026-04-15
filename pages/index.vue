<script setup lang="ts">
import type { WishlistItem, FilterState, Category } from '~/types'

const { items, loading, error, fetchItems, updateItem, deleteItem } = useWishlist()
const { categories } = useMeta()

await fetchItems()

const filters = reactive<FilterState>({
  search: '',
  category: 'all',
  status: 'all',
  sortBy: 'created_at',
  sortDir: 'desc',
})

const filtered = computed(() => {
  let result = [...items.value]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(i =>
      i.title.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q),
    )
  }
  if (filters.category !== 'all') result = result.filter(i => i.category === filters.category)
  if (filters.status   !== 'all') result = result.filter(i => i.status   === filters.status)
  result.sort((a, b) => {
    const cmp = filters.sortBy === 'title'
      ? a.title.localeCompare(b.title)
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    return filters.sortDir === 'asc' ? cmp : -cmp
  })
  return result
})

const stats = computed(() => ({
  total:      items.value.length,
  wantTo:     items.value.filter(i => i.status === 'want_to_check').length,
  inProgress: items.value.filter(i => i.status === 'in_progress').length,
  done:       items.value.filter(i => i.status === 'done').length,
}))

const hasActiveFilters = computed(() => filters.search || filters.category !== 'all')
const resetFilters = () => { filters.search = ''; filters.category = 'all' }

const editItem  = ref<WishlistItem | null>(null)
const deleteId  = ref<string | null>(null)
const modalOpen = ref(false)

const onEdit = (item: WishlistItem) => { editItem.value = item; modalOpen.value = true }
const onSave = async (data: any) => {
  if (editItem.value) await updateItem(editItem.value.id, data)
  modalOpen.value = false; editItem.value = null
}
const onDelete = async () => {
  if (deleteId.value) { await deleteItem(deleteId.value); deleteId.value = null }
}
const onStatusChange = async (id: string, status: WishlistItem['status']) => {
  await updateItem(id, { status })
}
</script>

<template>
  <div class="min-h-screen bg-canvas">
    <AppHeader />

    <!-- ── HERO ──────────────────────────────────────────────── -->
    <section class="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-300">

      <!-- Decorative blobs -->
      <div class="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
      <div class="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-black/10 blur-2xl" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-10">

          <!-- Title -->
          <div class="animate-slide-left">
            <p class="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-3">Mijn collectie</p>
            <h1 class="font-display font-700 text-6xl sm:text-8xl text-white tracking-tight leading-none">
              Verlang<br><em class="not-italic text-white/50">lijst</em>
            </h1>
            <p class="text-white/50 mt-4 text-sm max-w-xs hidden sm:block">
              Alles wat je wilt ontdekken, op één plek.
            </p>
          </div>

          <!-- Stats + Search -->
          <div class="flex flex-col gap-6 animate-slide-right">
            <!-- Stat numbers -->
            <div class="flex items-end gap-6 sm:gap-10">
              <div class="text-center animate-pop-in" style="animation-delay:100ms">
                <div class="font-display font-700 text-5xl sm:text-6xl text-white leading-none tabular-nums">
                  {{ stats.total }}
                </div>
                <div class="text-white/50 text-xs uppercase tracking-wider mt-1.5">Totaal</div>
              </div>
              <div class="w-px h-10 bg-white/20 self-center" />
              <div class="text-center animate-pop-in" style="animation-delay:200ms">
                <div class="font-display font-700 text-3xl text-white/70 leading-none tabular-nums">
                  {{ stats.wantTo }}
                </div>
                <div class="text-white/40 text-xs uppercase tracking-wider mt-1.5">Wil ik</div>
              </div>
              <div class="text-center animate-pop-in" style="animation-delay:300ms">
                <div class="font-display font-700 text-3xl text-white/70 leading-none tabular-nums">
                  {{ stats.inProgress }}
                </div>
                <div class="text-white/40 text-xs uppercase tracking-wider mt-1.5">Bezig</div>
              </div>
              <div class="text-center animate-pop-in" style="animation-delay:400ms">
                <div class="font-display font-700 text-3xl text-white/70 leading-none tabular-nums">
                  {{ stats.done }}
                </div>
                <div class="text-white/40 text-xs uppercase tracking-wider mt-1.5">Klaar</div>
              </div>
            </div>

            <!-- Search bar -->
            <div class="relative animate-slide-up" style="animation-delay:200ms">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="filters.search"
                class="w-full sm:w-72 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20
                       pl-11 pr-4 py-3 text-white placeholder-white/40 text-sm
                       focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20
                       transition-all duration-200"
                placeholder="Zoeken..."
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CATEGORY TABS (sticky) ────────────────────────────── -->
    <div class="sticky top-16 z-30 bg-card/95 backdrop-blur-xl border-b border-ink/10 shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-center overflow-x-auto scrollbar-none gap-0">
          <!-- "Alles" tab -->
          <button
            class="flex-shrink-0 flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-200"
            :class="filters.category === 'all'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-ink/40 hover:text-ink/70 hover:border-ink/20'"
            @click="filters.category = 'all'"
          >
            Alles
            <span class="text-[11px] font-bold tabular-nums px-1.5 py-0.5 rounded-full"
              :class="filters.category === 'all' ? 'bg-brand-500/15 text-brand-600' : 'bg-ink/5 text-ink/30'">
              {{ items.length }}
            </span>
          </button>

          <!-- Category tabs -->
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="flex-shrink-0 flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-200"
            :class="filters.category === cat.value
              ? ['border-brand-500', cat.color]
              : 'border-transparent text-ink/40 hover:text-ink/70 hover:border-ink/20'"
            @click="filters.category = filters.category === cat.value ? 'all' : cat.value as Category"
          >
            <svg class="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="cat.svgPath" />
            </svg>
            {{ cat.label }}
          </button>

          <!-- Spacer + add button -->
          <div class="ml-auto flex items-center gap-3 flex-shrink-0 pl-4 py-2">
            <button
              v-if="hasActiveFilters"
              class="text-xs text-ink/40 hover:text-ink/70 font-medium transition-colors whitespace-nowrap"
              @click="resetFilters"
            >Wissen</button>
            <NuxtLink to="/manage" class="btn-primary py-2 text-xs whitespace-nowrap">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span class="hidden sm:inline">Toevoegen</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- ── CONTENT ────────────────────────────────────────────── -->
    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-32">
        <div class="flex flex-col items-center gap-4">
          <div class="h-10 w-10 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
          <p class="text-ink/40 text-sm">Laden...</p>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="rounded-3xl bg-red-50 border border-red-200 p-8 text-center">
        <p class="text-red-600 text-sm">{{ error }}</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="!filtered.length" class="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
        <div class="relative mb-6">
          <div class="h-24 w-24 rounded-3xl bg-brand-500/10 flex items-center justify-center">
            <svg class="h-12 w-12 text-brand-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                :d="hasActiveFilters
                  ? 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  : 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'" />
            </svg>
          </div>
        </div>
        <h3 class="font-display font-700 text-2xl text-ink mb-2">
          {{ hasActiveFilters ? 'Geen resultaten' : 'Je verlanglijst is leeg' }}
        </h3>
        <p class="text-ink/40 text-sm mb-8 max-w-xs">
          {{ hasActiveFilters ? 'Probeer andere filters.' : 'Voeg je eerste item toe!' }}
        </p>
        <button v-if="hasActiveFilters" class="btn-secondary" @click="resetFilters">Filters wissen</button>
        <NuxtLink v-else to="/manage" class="btn-primary px-8 py-3">Eerste item toevoegen</NuxtLink>
      </div>

      <!-- Poster grid -->
      <div v-else class="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        <WishlistCard
          v-for="(item, index) in filtered"
          :key="item.id"
          :item="item"
          :index="index"
          @edit="onEdit"
          @delete="(id) => (deleteId = id)"
          @status-change="onStatusChange"
        />
      </div>

    </main>

    <ItemModal
      :open="modalOpen"
      :item="editItem"
      @close="modalOpen = false; editItem = null"
      @save="onSave"
    />
    <ConfirmModal
      :open="!!deleteId"
      title="Item verwijderen?"
      message="Dit item wordt permanent van je verlanglijst verwijderd."
      @confirm="onDelete"
      @cancel="deleteId = null"
    />
  </div>
</template>
