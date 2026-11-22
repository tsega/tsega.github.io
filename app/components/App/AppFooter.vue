<script setup lang="ts">
const { site } = await useSite();
const { data: contact } = await useAsyncData('links', () => queryCollection('links').first());

// Set at build time; the site is rebuilt on every deploy.
const year = new Date().getFullYear();
</script>

<template>
  <footer
    id="contact"
    class="bg-bg-elevated"
  >
    <div
      v-if="site"
      class="page-width pt-[clamp(4rem,8vw,6.5rem)]"
    >
      <p class="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
        {{ site.contact.eyebrow }}
      </p>
      <h2 class="mt-3.5 max-w-[760px] text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.04] font-extrabold tracking-[-0.025em] text-balance text-heading">
        {{ site.contact.heading }}
        <span class="text-accent">{{ site.contact.highlight }}</span>
      </h2>
      <ul class="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] border-t-2 border-l border-t-border border-l-border-subtle">
        <li
          v-for="link in contact?.links"
          :key="link.href"
          class="border-r border-b border-border-subtle"
        >
          <NuxtLink
            :to="link.href"
            class="group grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-6 py-[22px] text-heading hover:bg-accent hover:text-on-accent focus-visible:bg-accent focus-visible:text-on-accent active:bg-accent-pressed"
          >
            <TechLogo
              :name="link.icon"
              class="size-6 text-accent group-hover:text-on-accent group-focus-visible:text-on-accent"
            />
            <span class="flex min-w-0 flex-col gap-[3px]">
              <span class="text-base font-bold">{{ link.title }}</span>
              <span class="text-[13px] wrap-anywhere text-text-muted group-hover:text-on-accent group-focus-visible:text-on-accent">{{ link.sub }}</span>
            </span>
            <span
              aria-hidden="true"
              class="text-lg text-accent group-hover:text-on-accent group-focus-visible:text-on-accent motion-safe:transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1"
            >→</span>
          </NuxtLink>
        </li>
      </ul>
      <div class="mt-14 flex flex-wrap items-center justify-between gap-4 border-t-2 border-border py-7 text-xs text-text-muted">
        <span class="flex items-center gap-2.5">
          <img
            src="/tsega-logo.svg"
            alt=""
            width="22"
            height="28"
            class="block h-7 w-auto"
          >
          © {{ year }} {{ site.fullName }}
        </span>
        <span class="font-semibold tracking-[0.12em] uppercase">
          {{ site.contact.place }} · {{ site.contact.sheet }}
        </span>
      </div>
    </div>
  </footer>
</template>
