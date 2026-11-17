<script setup lang="ts">
const { site } = await useSite();
</script>

<template>
  <header class="sticky top-0 z-20 border-b-2 border-border bg-bg">
    <nav
      aria-label="Main"
      class="page-width flex h-16 items-center justify-between gap-6"
    >
      <NuxtLink
        to="/"
        class="flex items-center gap-3 text-heading hover:text-heading"
      >
        <img
          src="/tsega-logo.svg"
          :alt="site?.logoAlt"
          width="34"
          height="44"
          class="block h-11 w-auto"
        >
        <span class="text-[15px] font-bold tracking-[0.01em]">{{ site?.name }}</span>
      </NuxtLink>
      <div class="flex items-center gap-7 text-[13px] font-medium">
        <!-- Phones get the menu from #3; until then only Contact shows. -->
        <ul class="hidden items-center gap-7 md:flex">
          <li
            v-for="link in site?.nav"
            :key="link.href"
          >
            <NuxtLink
              :to="link.href"
              class="text-text-muted hover:text-accent"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
        <NuxtLink
          v-if="site"
          :to="site.contact.href"
          class="bg-accent px-3.5 py-2 font-bold text-bg hover:bg-accent-bright hover:text-bg active:bg-accent-pressed"
        >
          {{ site.contact.label }}
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>
