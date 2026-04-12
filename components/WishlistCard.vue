<script setup lang="ts">
import type { WishlistItem } from '~/types'

const props = defineProps<{
  item: WishlistItem
}>()

const emit = defineEmits<{
  edit: [item: WishlistItem]
  delete: [id: string]
  statusChange: [id: string, status: WishlistItem['status']]
}>()

const { getCategoryMeta, getStatusMeta, getPriorityMeta } = useMeta()

const cat = computed(() => getCategoryMeta(props.item.category))
const status = computed(() => getStatusMeta(props.item.status))
const priority = computed(() => getPriorityMeta(props.item.priority))

const starRating = computed(() => {
  if (!props.item.rating) return []
  return Array.from({ length: 5 }, (_, i) => i < props.item.rating!)
})

const nextStatus = computed(() => {
  const map: Record<WishlistItem['status'], WishlistItem['status']> = {
    want_to_check: 'in_progress',
    in_progress: 'done',
    done: 'want_to_check',
  }
  return map[props.item.status]
})

// Use item's image_url or fall back to a deterministic placeholder
const imageUrl = computed(() =>
  props.item.image_url
    ? props.item.image_url
    : `https://picsum.photos/seed/${encodeURIComponent(props.item.title)}/600/340`,
)
</script>

<template>
  <div class="card card-hover group flex flex-col animate-fade-in">

    <!-- Image -->
    <div class="relative overflow-hidden">
      <div class="aspect-[16/9] bg-surface-700">
        <img
          :src="imageUrl"
          :alt="item.title"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-transparent to-transparent" />

      <!-- Category badge — top left -->
      <div class="absolute top-3 left-3">
        <span :class="[cat.bg, 'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10', cat.color]">
          {{ cat.icon }} {{ cat.label }}
        </span>
      </div>

      <!-- Priority badge — top right -->
      <div class="absolute top-3 right-3">
        <span :class="[priority.bg, priority.color, 'badge backdrop-blur-sm border border-white/10 capitalize']">
          {{ priority.label }}
        </span>
      </div>

      <!-- Quick actions — visible on hover -->
      <div class="absolute bottom-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          v-if="item.url"
          :href="item.url"
          target="_blank"
          rel="noopener"
          class="flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/70 transition-colors"
          title="Link openen"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <button
          class="flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/70 transition-colors"
          title="Bewerken"
          @click="emit('edit', item)"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          class="flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm text-white/70 hover:text-red-400 hover:bg-black/70 transition-colors"
          title="Verwijderen"
          @click="emit('delete', item.id)"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Body -->
    <div class="flex-1 p-4">
      <h3 class="font-semibold text-white leading-snug mb-1 line-clamp-2 group-hover:text-brand-300 transition-colors">
        {{ item.title }}
      </h3>

      <p v-if="item.description" class="text-sm text-white/45 line-clamp-2 mb-3">
        {{ item.description }}
      </p>

      <!-- Stars -->
      <div v-if="item.rating" class="flex items-center gap-0.5 mb-3">
        <svg
          v-for="(filled, i) in starRating"
          :key="i"
          class="h-3.5 w-3.5"
          :class="filled ? 'text-yellow-400' : 'text-white/15'"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>

      <!-- Tags -->
      <div v-if="item.tags?.length" class="flex flex-wrap gap-1">
        <span
          v-for="tag in item.tags.slice(0, 4)"
          :key="tag"
          class="badge bg-white/8 text-white/50"
        >#{{ tag }}</span>
        <span v-if="item.tags.length > 4" class="badge bg-white/8 text-white/40">
          +{{ item.tags.length - 4 }}
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between border-t border-white/10 px-4 py-3">
      <button
        :class="[status.bg, status.color, 'badge cursor-pointer hover:opacity-80 transition-opacity']"
        :title="`Markeer als ${getStatusMeta(nextStatus).label}`"
        @click="emit('statusChange', item.id, nextStatus)"
      >
        <span :class="[status.dot, 'h-1.5 w-1.5 rounded-full']" />
        {{ status.label }}
      </button>
    </div>

  </div>
</template>
