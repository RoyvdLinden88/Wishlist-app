<script setup lang="ts">
import type { WishlistItem, WishlistItemInsert, Category, Status } from '~/types'

const props = defineProps<{
  open: boolean
  item?: WishlistItem | null
}>()

const emit = defineEmits<{
  close: []
  save: [data: WishlistItemInsert]
}>()

const { categories, statuses } = useMeta()

const defaultForm = (): WishlistItemInsert => ({
  title: '',
  description: null,
  category: 'movie',
  status: 'want_to_check',
  url: null,
  image_url: null,
})

const form = ref<WishlistItemInsert>(defaultForm())

watch(
  () => props.open,
  (open) => {
    if (open) {
      form.value = props.item
        ? {
            title: props.item.title,
            description: props.item.description,
            category: props.item.category,
            status: props.item.status,
            url: props.item.url,
            image_url: props.item.image_url,
          }
        : defaultForm()
    }
  },
)

const submit = () => {
  if (!form.value.title.trim()) return
  emit('save', {
    ...form.value,
    title: form.value.title.trim(),
    description: form.value.description?.trim() || null,
    url: form.value.url?.trim() || null,
    image_url: form.value.image_url?.trim() || null,
  })
}

const isEdit = computed(() => !!props.item)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @mousedown.self="emit('close')"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="open"
            class="w-full max-w-lg rounded-2xl bg-surface-800 border border-white/10 shadow-2xl shadow-black/60 overflow-hidden"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 class="font-display font-700 text-lg">
                {{ isEdit ? 'Item bewerken' : 'Item toevoegen' }}
              </h2>
              <button class="btn-ghost p-1.5" @click="emit('close')">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form class="overflow-y-auto max-h-[70vh] p-6 space-y-4" @submit.prevent="submit">
              <!-- Title -->
              <div>
                <label class="label">Titel *</label>
                <input
                  v-model="form.title"
                  class="input"
                  placeholder="Wat wil je ontdekken?"
                  required
                  autofocus
                />
              </div>

              <!-- Category + Status -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Categorie</label>
                  <select v-model="form.category as Category" class="input">
                    <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                      {{ cat.label }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="label">Status</label>
                  <select v-model="form.status as Status" class="input">
                    <option v-for="st in statuses" :key="st.value" :value="st.value">
                      {{ st.label }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="label">Omschrijving</label>
                <textarea
                  v-model="form.description"
                  class="input resize-none"
                  rows="2"
                  placeholder="Korte omschrijving..."
                />
              </div>

              <!-- URL -->
              <div>
                <label class="label">Link / URL</label>
                <input
                  v-model="form.url"
                  class="input"
                  type="url"
                  placeholder="https://..."
                />
              </div>

              <!-- Image URL -->
              <div>
                <label class="label">Afbeelding URL</label>
                <input
                  v-model="form.image_url"
                  class="input"
                  type="url"
                  placeholder="https://..."
                />
              </div>
            </form>

            <!-- Footer actions -->
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-surface-900/50">
              <button type="button" class="btn-secondary" @click="emit('close')">Annuleren</button>
              <button type="submit" class="btn-primary" @click="submit">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ isEdit ? 'Opslaan' : 'Toevoegen' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
