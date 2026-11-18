<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

const props = defineProps<{
  /** The post being read. */
  post: BlogCollectionItem;
  /** "All posts", for the link back to the index. */
  back: string;
  /** Follows the reading time, e.g. "min read". */
  minutes: string;
  /** Accessible name for the list of tags. */
  tagsLabel: string;
}>();

const date = computed(() => formatDate(props.post.date));
const datetime = computed(() => isoDate(props.post.date));
const readingTime = computed(() => `${readingMinutes(props.post.body)} ${props.minutes}`);
</script>

<template>
  <header class="border-b-2 border-border pb-8">
    <NuxtLink
      to="/blog"
      class="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase hover:text-accent-bright"
    >
      <span aria-hidden="true">← </span>{{ back }}
    </NuxtLink>
    <p class="mt-12 flex gap-4 text-[11px] font-semibold tracking-[0.14em] uppercase">
      <span class="text-accent">{{ post.category }}</span>
      <span
        v-if="post.format"
        class="text-text-muted"
      >{{ post.format }}</span>
    </p>
    <h1 class="mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-heading">
      {{ post.title }}
    </h1>
    <p class="mt-6 max-w-[640px] text-lg leading-[1.55] text-text-muted">
      {{ post.description }}
    </p>
    <div class="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-[13px] font-semibold text-text-muted">
      <p>
        <time :datetime="datetime">{{ date }}</time>
        <span aria-hidden="true"> · </span>
        <span>{{ readingTime }}</span>
      </p>
      <ul
        v-if="post.tags?.length"
        :aria-label="tagsLabel"
        class="flex flex-wrap gap-2"
      >
        <li
          v-for="tag in post.tags"
          :key="tag"
          class="border border-border-strong px-2.5 py-1 text-[11px] tracking-[0.14em] uppercase"
        >
          {{ tag }}
        </li>
      </ul>
    </div>
  </header>
  <img
    v-if="post.cover"
    :src="post.cover"
    :alt="post.coverAlt ?? ''"
    class="mt-10 block w-full border-2 border-border"
  >
</template>
