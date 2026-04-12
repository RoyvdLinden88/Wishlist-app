<script setup lang="ts">
defineProps<{
  open: boolean
  title?: string
  message?: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @mousedown.self="emit('cancel')"
      >
        <div class="animate-scale-in w-full max-w-sm rounded-2xl bg-surface-800 border border-white/10 p-6 shadow-2xl">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15 mb-4">
            <svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="font-display font-700 text-lg mb-1">{{ title ?? 'Are you sure?' }}</h3>
          <p class="text-sm text-white/50 mb-6">{{ message ?? 'This action cannot be undone.' }}</p>
          <div class="flex gap-3">
            <button class="btn-secondary flex-1" @click="emit('cancel')">Cancel</button>
            <button class="btn-danger flex-1 justify-center" @click="emit('confirm')">Delete</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
