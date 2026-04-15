<script setup lang="ts">
import type { WishlistItem, WishlistItemInsert } from '~/types'

const { items, loading, error, fetchItems, createItem, updateItem, deleteItem } = useWishlist()
const { getCategoryMeta, getStatusMeta } = useMeta()

await fetchItems()

const modalOpen   = ref(false)
const editItem    = ref<WishlistItem | null>(null)
const deleteId    = ref<string | null>(null)
const deleteTitle = ref('')
const flash       = ref('')

const openCreate = () => { editItem.value = null; modalOpen.value = true }
const openEdit   = (item: WishlistItem) => { editItem.value = item; modalOpen.value = true }
const closeModal = () => { modalOpen.value = false; editItem.value = null }

const onSave = async (data: WishlistItemInsert) => {
  if (editItem.value) { await updateItem(editItem.value.id, data); showFlash('Item bijgewerkt!') }
  else                { await createItem(data);                     showFlash('Item toegevoegd!') }
  closeModal()
}

const confirmDelete = (item: WishlistItem) => { deleteId.value = item.id; deleteTitle.value = item.title }

const onDelete = async () => {
  if (deleteId.value) {
    await deleteItem(deleteId.value)
    showFlash('Item verwijderd.')
    deleteId.value = null; deleteTitle.value = ''
  }
}

const showFlash = (msg: string) => {
  flash.value = msg
  setTimeout(() => { flash.value = '' }, 2500)
}

const search = ref('')
const filteredItems = computed(() => {
  if (!search.value) return items.value
  const q = search.value.toLowerCase()
  return items.value.filter(i => i.title.toLowerCase().includes(q) || i.category.includes(q))
})

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' })
</script>

<template>
  <div class="min-h-screen bg-canvas">
    <AppHeader />

    <main class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <!-- Page header -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="font-display text-3xl font-700 tracking-tight text-ink">Beheren</h1>
          <p class="text-ink/40 text-sm mt-1">Items toevoegen, bewerken en verwijderen.</p>
        </div>
        <button class="btn-primary mt-1 flex-shrink-0" @click="openCreate">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span class="hidden sm:inline">Nieuw item</span>
          <span class="sm:hidden">Nieuw</span>
        </button>
      </div>

      <!-- Flash -->
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="flash"
          class="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-700 text-sm font-medium">
          <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ flash }}
        </div>
      </Transition>

      <!-- Search -->
      <div class="relative max-w-sm">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/30 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="search" class="input pl-9" placeholder="Zoeken..." />
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center gap-3 text-ink/40 py-8">
        <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Laden...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="rounded-2xl bg-red-50 border border-red-200 p-6 text-center">
        <p class="text-red-600 text-sm">{{ error }}</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="!items.length" class="flex flex-col items-center py-20 text-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-inset mb-4">
          <svg class="h-8 w-8 text-ink/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="font-display font-700 text-xl text-ink mb-2">Nog niets hier</h3>
        <p class="text-ink/40 text-sm mb-6">Klik op "Nieuw item" om je eerste item toe te voegen.</p>
        <button class="btn-primary" @click="openCreate">Eerste item toevoegen</button>
      </div>

      <!-- Table -->
      <div v-else class="rounded-2xl bg-card border border-ink/10 shadow-sm overflow-hidden">

        <!-- Header (desktop) -->
        <div class="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-ink/10 bg-inset text-xs font-semibold text-ink/40 uppercase tracking-wider">
          <span>Item</span>
          <span>Categorie</span>
          <span>Status</span>
          <span>Toegevoegd</span>
          <span>Acties</span>
        </div>

        <!-- Rows -->
        <div class="divide-y divide-ink/5">
          <div v-for="item in filteredItems" :key="item.id"
            class="group px-5 py-3.5 hover:bg-inset/60 transition-colors">

            <!-- Mobile -->
            <div class="md:hidden flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <img :src="item.image_url || `https://picsum.photos/seed/${encodeURIComponent(item.title)}/120/80`"
                  :alt="item.title" class="h-12 w-16 rounded-lg object-cover flex-shrink-0 border border-ink/10" />
                <div class="min-w-0">
                  <p class="font-semibold text-sm text-ink truncate">{{ item.title }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span :class="[getCategoryMeta(item.category).color, 'text-xs font-medium']">
                      {{ getCategoryMeta(item.category).label }}
                    </span>
                    <span :class="[getStatusMeta(item.status).bg, getStatusMeta(item.status).color, 'badge text-[10px]']">
                      {{ getStatusMeta(item.status).label }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex gap-1 flex-shrink-0">
                <button class="btn-ghost p-2" @click="openEdit(item)">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button class="btn-ghost p-2 hover:text-red-500" @click="confirmDelete(item)">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Desktop -->
            <div class="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center">
              <p class="font-medium text-sm text-ink truncate group-hover:text-brand-600 transition-colors">
                {{ item.title }}
              </p>
              <div class="flex items-center gap-2">
                <svg class="h-3.5 w-3.5 flex-shrink-0" :class="getCategoryMeta(item.category).color"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="getCategoryMeta(item.category).svgPath" />
                </svg>
                <span :class="[getCategoryMeta(item.category).color, 'text-xs font-medium']">
                  {{ getCategoryMeta(item.category).label }}
                </span>
              </div>
              <div>
                <span :class="[getStatusMeta(item.status).bg, getStatusMeta(item.status).color, 'badge']">
                  <span :class="[getStatusMeta(item.status).dot, 'h-1.5 w-1.5 rounded-full']" />
                  {{ getStatusMeta(item.status).label }}
                </span>
              </div>
              <div class="text-xs text-ink/40">{{ formatDate(item.created_at) }}</div>
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a v-if="item.url" :href="item.url" target="_blank" rel="noopener"
                  class="btn-ghost p-1.5 hover:text-brand-600" title="Link openen">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <button class="btn-ghost p-1.5 hover:text-brand-600" title="Bewerken" @click="openEdit(item)">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button class="btn-ghost p-1.5 hover:text-red-500" title="Verwijderen" @click="confirmDelete(item)">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-3 border-t border-ink/10 bg-inset text-xs text-ink/40">
          {{ filteredItems.length }} {{ filteredItems.length === 1 ? 'item' : 'items' }}
        </div>
      </div>

    </main>

    <ItemModal :open="modalOpen" :item="editItem" @close="closeModal" @save="onSave" />
    <ConfirmModal :open="!!deleteId" title="Item verwijderen?"
      :message="`'${deleteTitle}' wordt permanent verwijderd.`"
      @confirm="onDelete" @cancel="deleteId = null" />
  </div>
</template>
