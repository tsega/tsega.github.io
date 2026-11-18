<script setup lang="ts">
const { site } = await useSite();

// Close once the desktop nav takes over (the md breakpoint, 760px).
const { open, toggle, close } = useDisclosure('(min-width: 47.5rem)');

const barClass = 'block h-0.5 w-[22px] bg-accent motion-safe:transition motion-safe:duration-200';
</script>

<template>
  <div class="md:hidden">
    <button
      ref="toggle"
      type="button"
      aria-label="Menu"
      aria-controls="mobile-menu"
      :aria-expanded="open"
      class="-mr-2.5 flex size-11 cursor-pointer flex-col items-center justify-center gap-[5px]"
      @click="open = !open"
    >
      <span
        :class="[barClass, open && 'translate-y-[7px] rotate-45']"
        aria-hidden="true"
      />
      <span
        :class="[barClass, open && 'opacity-0']"
        aria-hidden="true"
      />
      <span
        :class="[barClass, open && '-translate-y-[7px] -rotate-45']"
        aria-hidden="true"
      />
    </button>
    <div
      v-if="site"
      v-show="open"
      id="mobile-menu"
      class="absolute inset-x-0 top-full flex flex-col border-b-2 border-border bg-bg px-[clamp(1.25rem,4vw,3rem)] pt-2 pb-5"
    >
      <ul>
        <li
          v-for="link in site.nav"
          :key="link.href"
        >
          <NuxtLink
            :to="link.href"
            class="flex justify-between border-b border-border-subtle py-4 text-[17px] font-semibold text-heading hover:text-accent"
            @click="close()"
          >
            <span>{{ link.label }}</span>
            <span
              aria-hidden="true"
              class="text-accent"
            >→</span>
          </NuxtLink>
        </li>
      </ul>
      <NuxtLink
        :to="site.contact.href"
        class="mt-5 flex justify-between bg-accent px-5 py-4 text-base font-bold text-on-accent hover:bg-accent-bright hover:text-on-accent active:bg-accent-pressed"
        @click="close()"
      >
        <span>{{ site.contact.label }}</span>
        <span aria-hidden="true">→</span>
      </NuxtLink>
    </div>
  </div>
</template>
