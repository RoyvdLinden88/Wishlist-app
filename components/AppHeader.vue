<template>
  <header class="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-ink/10 shadow-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between gap-4">

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5 group flex-shrink-0">
          <div class="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-600 text-white font-bold shadow-lg shadow-brand-600/30 group-hover:scale-105 group-hover:shadow-brand-600/50 transition-all duration-200">
            ✦
          </div>
          <span class="font-display text-lg font-700 tracking-tight text-ink hidden sm:block">Verlanglijst</span>
        </NuxtLink>

        <!-- Theme picker -->
        <ThemePicker />

        <!-- Nav -->
        <nav class="flex items-center gap-1 flex-shrink-0">
          <NuxtLink
            to="/"
            class="btn-ghost rounded-2xl"
            :class="$route.path === '/' ? 'bg-brand-500/10 !text-brand-600' : ''"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span class="hidden sm:inline">Overzicht</span>
          </NuxtLink>
          <NuxtLink
            to="/manage"
            class="btn-ghost rounded-2xl"
            :class="$route.path === '/manage' ? 'bg-brand-500/10 !text-brand-600' : ''"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"
                d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span class="hidden sm:inline">Beheren</span>
          </NuxtLink>
        </nav>

      </div>
    </div>
  </header>
</template>
