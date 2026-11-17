<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only bg-accent px-4 py-3 font-bold text-bg focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-30"
    >Skip to content</a>
    <AppHeader />
    <main
      id="main"
      class="flex-1"
    >
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
