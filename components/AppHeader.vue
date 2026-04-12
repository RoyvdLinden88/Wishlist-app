<template>
  <header class="sticky top-0 z-40 border-b border-white/8 bg-surface-900/80 backdrop-blur-xl">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-lg shadow-lg shadow-brand-600/30 group-hover:bg-brand-500 transition-colors">
            ✦
          </div>
          <span class="font-display text-lg font-700 tracking-tight">Wishlist</span>
        </NuxtLink>

        <!-- Nav -->
        <nav class="flex items-center gap-1">
          <NuxtLink
            to="/"
            class="btn-ghost"
            :class="{ 'text-white bg-white/8': $route.path === '/' }"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Overview
          </NuxtLink>
          <NuxtLink
            to="/manage"
            class="btn-ghost"
            :class="{ 'text-white bg-white/8': $route.path === '/manage' }"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Manage
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>
