<script setup lang="ts">
import { THEMES } from '~/composables/useTheme'

const { currentTheme, setTheme } = useTheme()
</script>

<template>
  <div class="flex items-center gap-1.5" title="Thema wisselen">
    <button
      v-for="theme in THEMES"
      :key="theme.name"
      :title="theme.label"
      class="relative h-5 w-5 rounded-full transition-transform duration-150 hover:scale-110 focus:outline-none"
      :class="currentTheme === theme.name
        ? 'ring-2 ring-offset-2 ring-offset-card scale-110'
        : 'opacity-60 hover:opacity-100'"
      :style="{ backgroundColor: theme.accent, '--tw-ring-color': theme.accent }"
      @click="setTheme(theme.name)"
    />
  </div>
</template>
