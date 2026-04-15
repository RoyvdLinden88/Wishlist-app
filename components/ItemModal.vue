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

const supabase = useSupabaseClient()
const { categories, statuses } = useMeta()

const BUCKET = 'wishlist-images'

const defaultForm = (): WishlistItemInsert => ({
  title: '',
  description: null,
  category: 'movie',
  status: 'want_to_check',
  tags: null,
  url: null,
  image_url: null,
})

const form = ref<WishlistItemInsert>(defaultForm())
const tagInput = ref('')
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const uploading = ref(false)
const uploadError = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

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
            tags: props.item.tags ? [...props.item.tags] : null,
            url: props.item.url,
            image_url: props.item.image_url,
          }
        : defaultForm()
      selectedFile.value = null
      imagePreview.value = props.item?.image_url ?? null
      uploadError.value = null
      tagInput.value = ''
    }
  },
)

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Alleen afbeeldingen zijn toegestaan (jpg, png, webp…)'
    return
  }
  if (file.size > 8 * 1024 * 1024) {
    uploadError.value = 'Afbeelding mag maximaal 8 MB zijn'
    return
  }

  uploadError.value = null
  selectedFile.value = file

  // Free previous object URL to avoid memory leaks
  if (imagePreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imagePreview.value = URL.createObjectURL(file)
}

const clearImage = () => {
  if (imagePreview.value?.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value)
  selectedFile.value = null
  imagePreview.value = null
  form.value.image_url = null
  uploadError.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const addTag = () => {
  const raw = tagInput.value.trim().toLowerCase().replace(/,/g, '')
  if (!raw) return
  const existing = form.value.tags ?? []
  if (!existing.includes(raw)) {
    form.value.tags = [...existing, raw]
  }
  tagInput.value = ''
}

const removeTag = (tag: string) => {
  form.value.tags = (form.value.tags ?? []).filter(t => t !== tag) || null
}

const onTagKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag()
  }
  if (e.key === 'Backspace' && !tagInput.value && form.value.tags?.length) {
    form.value.tags = form.value.tags.slice(0, -1)
  }
}

const uploadImage = async (file: File): Promise<string | null> => {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false })

  if (error) {
    uploadError.value = error.message
    return null
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

const submit = async () => {
  if (!form.value.title.trim()) return

  uploading.value = true
  uploadError.value = null

  let imageUrl = form.value.image_url

  if (selectedFile.value) {
    imageUrl = await uploadImage(selectedFile.value)
    if (imageUrl === null) {
      uploading.value = false
      return
    }
  }

  uploading.value = false

  emit('save', {
    ...form.value,
    title: form.value.title.trim(),
    description: form.value.description?.trim() || null,
    url: form.value.url?.trim() || null,
    image_url: imageUrl,
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

              <!-- Tags -->
              <div>
                <label class="label">Tags</label>
                <div class="flex flex-wrap gap-1.5 p-2 rounded-xl bg-surface-700 border border-white/10 focus-within:border-brand-500/50 transition-colors min-h-[2.5rem]">
                  <span
                    v-for="tag in (form.tags ?? [])"
                    :key="tag"
                    class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-600/30 text-brand-300 text-xs font-medium"
                  >
                    {{ tag }}
                    <button type="button" class="hover:text-white transition-colors" @click="removeTag(tag)">
                      <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                  <input
                    v-model="tagInput"
                    class="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder-white/25 text-white"
                    placeholder="Tag toevoegen, druk Enter…"
                    @keydown="onTagKeydown"
                    @blur="addTag"
                  />
                </div>
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

              <!-- Image upload -->
              <div>
                <label class="label">Afbeelding</label>

                <!-- Preview -->
                <div v-if="imagePreview" class="relative mb-3 rounded-xl overflow-hidden aspect-video bg-surface-700">
                  <img :src="imagePreview" alt="Voorbeeld" class="w-full h-full object-cover" />
                  <button
                    type="button"
                    class="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/80 transition-colors"
                    title="Afbeelding verwijderen"
                    @click="clearImage"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Hidden file input -->
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onFileChange"
                />

                <!-- Trigger button -->
                <button
                  type="button"
                  class="btn-secondary w-full justify-center"
                  @click="fileInput?.click()"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ imagePreview ? 'Andere afbeelding kiezen' : 'Afbeelding kiezen' }}
                </button>

                <p v-if="uploadError" class="text-red-400 text-xs mt-1.5">{{ uploadError }}</p>
              </div>

            </form>

            <!-- Footer actions -->
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-surface-900/50">
              <button type="button" class="btn-secondary" :disabled="uploading" @click="emit('close')">
                Annuleren
              </button>
              <button type="submit" class="btn-primary" :disabled="uploading" @click="submit">
                <svg v-if="uploading" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ uploading ? 'Uploaden...' : isEdit ? 'Opslaan' : 'Toevoegen' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
