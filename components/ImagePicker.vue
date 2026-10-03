<script setup lang="ts">
import type { Category } from '~/types'

const props = defineProps<{
  query: string
  category: Category
}>()

const emit = defineEmits<{
  select: [url: string]
}>()

const SUPPORTED: Category[] = ['movie', 'series', 'documentary', 'book', 'music', 'restaurant', 'winkel', 'podcast', 'other']

interface ImageResult {
  url: string
  label: string
}

const images = ref<ImageResult[]>([])
const loading = ref(false)
const lastKey = ref('')
const webEnabled = ref(false)
const webLoading = ref(false)

const fetchImages = async (web = false) => {
  const key = `${props.query.trim()}:${props.category}:${web}`
  if (!props.query.trim() || !SUPPORTED.includes(props.category) || key === lastKey.value) return

  lastKey.value = key
  if (web) {
    webLoading.value = true
  }
  else {
    loading.value = true
    images.value = []
  }

  try {
    const results = await $fetch<ImageResult[]>('/api/images', {
      query: { query: props.query.trim(), category: props.category, includeWeb: web ? 'true' : 'false' },
    })
    images.value = results
  }
  catch {
    images.value = []
  }
  finally {
    loading.value = false
    webLoading.value = false
  }
}

const enableWeb = () => {
  webEnabled.value = true
  fetchImages(true)
}

watch([() => props.query, () => props.category], () => {
  webEnabled.value = false
  fetchImages(false)
}, { immediate: true })
</script>

<template>
  <div v-if="SUPPORTED.includes(category)" class="space-y-2">
    <div class="flex items-center justify-between min-h-[1rem]">
      <p class="text-xs text-white/30">
        {{ loading ? 'Zoeken…' : images.length ? 'Klik op een afbeelding om te selecteren' : '' }}
      </p>
      <button
        v-if="!webEnabled && !loading && lastKey"
        type="button"
        class="flex items-center gap-1 text-xs text-white/40 hover:text-brand-400 transition-colors"
        @click="enableWeb"
      >
        <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
        </svg>
        Zoek op Google
      </button>
      <span v-else-if="webLoading" class="text-xs text-white/30">Google zoeken…</span>
    </div>

    <!-- Loading skeletons -->
    <div v-if="loading" class="flex gap-2">
      <div v-for="i in 5" :key="i" class="h-[6.5rem] w-[4.5rem] flex-shrink-0 rounded-lg bg-white/5 animate-pulse" />
    </div>

    <!-- Results -->
    <div v-else-if="images.length" class="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      <button
        v-for="img in images"
        :key="img.url"
        type="button"
        :title="img.label"
        class="flex-shrink-0 h-[6.5rem] w-[4.5rem] rounded-lg overflow-hidden ring-1 ring-white/10 hover:ring-2 hover:ring-brand-500 transition-all"
        @click="emit('select', img.url)"
      >
        <img :src="img.url" :alt="img.label" class="h-full w-full object-cover" loading="lazy" />
      </button>
    </div>

    <!-- No results -->
    <p v-else-if="lastKey && !loading" class="text-xs text-white/25">
      Geen resultaten gevonden voor "{{ query }}".
    </p>
  </div>
</template>
