<script setup lang="ts">
import type { WishlistItem } from '~/types'

const props = defineProps<{
  items: WishlistItem[]
}>()

const { statuses } = useMeta()

const stats = computed(() => {
  const total = props.items.length
  const done = props.items.filter(i => i.status === 'done').length
  const inProgress = props.items.filter(i => i.status === 'in_progress').length
  const wantToCheck = props.items.filter(i => i.status === 'want_to_check').length

  return [
    { label: 'Total', value: total, color: 'text-white' },
    { label: 'Want to Check', value: wantToCheck, color: 'text-blue-400' },
    { label: 'In Progress', value: inProgress, color: 'text-yellow-400' },
    { label: 'Done', value: done, color: 'text-green-400' },
  ]
})
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="glass rounded-xl p-4 text-center"
    >
      <div :class="[stat.color, 'font-display text-3xl font-700 tabular-nums']">
        {{ stat.value }}
      </div>
      <div class="mt-0.5 text-xs text-white/40 font-medium">{{ stat.label }}</div>
    </div>
  </div>
</template>
