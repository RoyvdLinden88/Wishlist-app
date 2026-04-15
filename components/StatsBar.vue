<script setup lang="ts">
import type { WishlistItem } from '~/types'

const props = defineProps<{ items: WishlistItem[] }>()

const stats = computed(() => {
  const total      = props.items.length
  const wantTo     = props.items.filter(i => i.status === 'want_to_check').length
  const inProgress = props.items.filter(i => i.status === 'in_progress').length
  const done       = props.items.filter(i => i.status === 'done').length
  return [
    { label: 'Totaal',   value: total,      color: 'text-ink' },
    { label: 'Wil ik',   value: wantTo,     color: 'text-blue-500' },
    { label: 'Bezig',    value: inProgress, color: 'text-amber-500' },
    { label: 'Klaar',    value: done,       color: 'text-emerald-500' },
  ]
})
</script>

<template>
  <div class="grid grid-cols-2 gap-2">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="rounded-xl bg-inset px-3 py-3 text-center"
    >
      <div :class="[stat.color, 'font-display text-2xl font-700 tabular-nums leading-none']">
        {{ stat.value }}
      </div>
      <div class="mt-1 text-xs text-ink/40 font-medium">{{ stat.label }}</div>
    </div>
  </div>
</template>
