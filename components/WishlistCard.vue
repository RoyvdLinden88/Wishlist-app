<script setup lang="ts">
import type { WishlistItem } from '~/types'
import { getLocationFlagUrl } from '~/composables/useMeta'

const props = defineProps<{
  item: WishlistItem
}>()

const { getCategoryMeta } = useMeta()

const cat = computed(() => getCategoryMeta(props.item.category))

const imageUrl = computed(() =>
  props.item.image_url
    ? props.item.image_url
    : `https://picsum.photos/seed/${encodeURIComponent(props.item.title)}/600/340`,
)

const descExpanded = ref(false)
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

    </div>

    <!-- Body -->
    <div class="flex-1 p-4">
      <h3 class="font-semibold text-white leading-snug mb-1 line-clamp-2 group-hover:text-brand-300 transition-colors">
        {{ item.title }}
      </h3>

      <div v-if="item.description">
        <p
          class="text-sm text-white/45 cursor-pointer"
          :class="descExpanded ? '' : 'line-clamp-2'"
          @click="descExpanded = !descExpanded"
        >
          {{ item.description }}
        </p>
        <button
          v-if="!descExpanded && item.description.length > 80"
          class="text-white/30 hover:text-white/60 transition-colors mt-0.5"
          @click="descExpanded = true"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- Location -->
      <div v-if="item.location" class="flex items-center gap-1.5 mt-2">
        <img
          v-if="getLocationFlagUrl(item.location)"
          :src="getLocationFlagUrl(item.location)!"
          :alt="item.location"
          class="w-5 rounded-sm flex-shrink-0"
        />
        <svg v-else class="h-3.5 w-3.5 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text-xs text-white/45">{{ item.location }}</span>
      </div>
    </div>

    <!-- Footer: category + link -->
    <div class="flex items-center justify-between border-t border-white/10 px-4 py-3">
      <span :class="[cat.bg, cat.color, 'flex items-center gap-1.5 badge']">
        <svg class="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" :d="cat.svgPath" />
        </svg>
        {{ cat.label }}
      </span>

      <a
        v-if="item.url"
        :href="item.url"
        target="_blank"
        rel="noopener"
        class="flex items-center justify-center h-6 w-6 text-white/35 hover:text-brand-400 transition-colors"
        title="Link openen"
        @click.stop
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>

  </div>
</template>
