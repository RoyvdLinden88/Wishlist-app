<script setup lang="ts">
import type { WishlistItem } from '~/types'

const props = defineProps<{
  item: WishlistItem
  index?: number
}>()

const emit = defineEmits<{
  edit: [item: WishlistItem]
  delete: [id: string]
  statusChange: [id: string, status: WishlistItem['status']]
}>()

const { getCategoryMeta, getStatusMeta } = useMeta()

const cat    = computed(() => getCategoryMeta(props.item.category))
const status = computed(() => getStatusMeta(props.item.status))

const nextStatus = computed(() => {
  const map: Record<WishlistItem['status'], WishlistItem['status']> = {
    want_to_check: 'in_progress',
    in_progress:   'done',
    done:          'want_to_check',
  }
  return map[props.item.status]
})

const imageUrl = computed(() =>
  props.item.image_url
    ? props.item.image_url
    : `https://picsum.photos/seed/${encodeURIComponent(props.item.title)}/400/600`,
)

const delay = computed(() => `${(props.index ?? 0) * 60}ms`)
</script>

<template>
  <article
    class="group relative rounded-3xl overflow-hidden cursor-pointer animate-slide-up"
    :style="{ animationDelay: delay }"
  >
    <!-- Poster image -->
    <div class="aspect-[2/3] bg-inset">
      <img
        :src="imageUrl"
        :alt="item.title"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
      />
    </div>

    <!-- Always-on gradient overlay (bottom heavy) -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

    <!-- Hover tint overlay -->
    <div class="absolute inset-0 bg-brand-600/0 group-hover:bg-brand-600/15 transition-colors duration-500" />

    <!-- Category chip — top left -->
    <div class="absolute top-3 left-3 translate-y-0 group-hover:-translate-y-0.5 transition-transform duration-300">
      <span :class="[cat.bg, cat.color, 'flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-lg']">
        <svg class="h-2.5 w-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" :d="cat.svgPath" />
        </svg>
        {{ cat.label }}
      </span>
    </div>

    <!-- Action buttons — top right, appear on hover -->
    <div class="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
      <button
        class="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/35 transition-colors shadow-lg"
        title="Bewerken"
        @click.stop="emit('edit', item)"
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <a
        v-if="item.url"
        :href="item.url"
        target="_blank"
        rel="noopener"
        class="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/35 transition-colors shadow-lg"
        title="Link openen"
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
      <button
        class="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-red-500/70 transition-colors shadow-lg"
        title="Verwijderen"
        @click.stop="emit('delete', item.id)"
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Text overlay — bottom -->
    <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
      <h3 class="text-white font-bold text-sm leading-snug line-clamp-2 drop-shadow">
        {{ item.title }}
      </h3>
      <p v-if="item.description" class="text-white/55 text-xs mt-0.5 line-clamp-1">
        {{ item.description }}
      </p>
      <div class="mt-3 flex items-center justify-between">
        <button
          :class="[status.bg, status.color, 'badge text-[10px] font-bold backdrop-blur-sm cursor-pointer hover:opacity-80 transition-opacity']"
          :title="`Markeer als ${getStatusMeta(nextStatus).label}`"
          @click.stop="emit('statusChange', item.id, nextStatus)"
        >
          <span :class="[status.dot, 'h-1.5 w-1.5 rounded-full']" />
          {{ status.label }}
        </button>
      </div>
    </div>
  </article>
</template>
