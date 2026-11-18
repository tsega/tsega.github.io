<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

defineProps<{
  /** The next post by date, if there is one. */
  newer?: ContentNavigationItem | null;
  /** The previous post by date, if there is one. */
  older?: ContentNavigationItem | null;
  /** Kicker on the newer post's card, e.g. "Newer post". */
  newerLabel: string;
  /** Kicker on the older post's card, e.g. "Older post". */
  olderLabel: string;
}>();

const cardClass = 'flex flex-col gap-2 p-7 text-heading hover:bg-bg-hover hover:text-heading';
const kickerClass = 'text-[11px] font-semibold tracking-[0.14em] text-accent uppercase';
</script>

<template>
  <nav
    v-if="newer || older"
    aria-label="More posts"
    class="mt-16 grid border-2 border-border"
    :class="{ 'md:grid-cols-2': newer && older }"
  >
    <NuxtLink
      v-if="older"
      :to="older.path"
      rel="prev"
      class="border-border"
      :class="[cardClass, { 'max-md:border-b-2 md:border-r-2': newer }]"
    >
      <span :class="kickerClass"><span aria-hidden="true">← </span>{{ olderLabel }}</span>
      <span class="text-lg leading-tight font-bold text-balance">{{ older.title }}</span>
    </NuxtLink>
    <NuxtLink
      v-if="newer"
      :to="newer.path"
      rel="next"
      :class="[cardClass, { 'md:text-right': older }]"
    >
      <span :class="kickerClass">{{ newerLabel }}<span aria-hidden="true"> →</span></span>
      <span class="text-lg leading-tight font-bold text-balance">{{ newer.title }}</span>
    </NuxtLink>
  </nav>
</template>
