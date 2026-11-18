<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

const props = defineProps<{
  /** A post from the blog collection. */
  post: BlogCollectionItem;
}>();

const date = computed(() => formatDate(props.post.date));
const datetime = computed(() => isoDate(props.post.date));
</script>

<template>
  <NuxtLink
    :to="post.path"
    class="flex flex-col gap-3 border-b border-border-subtle p-7 text-heading hover:bg-bg-hover hover:text-heading"
  >
    <p class="flex flex-wrap justify-between gap-x-6 gap-y-2 text-[11px] font-semibold tracking-[0.14em] uppercase">
      <span class="flex gap-4">
        <span class="text-accent">{{ post.category }}</span>
        <span
          v-if="post.format"
          class="text-text-muted"
        >{{ post.format }}</span>
      </span>
      <time
        :datetime="datetime"
        class="text-text-muted"
      >{{ date }}</time>
    </p>
    <h2 class="text-[21px] leading-tight font-bold text-balance">
      {{ post.title }}
    </h2>
    <p class="max-w-[640px] text-sm leading-[1.55] text-text-muted">
      {{ post.description }}
    </p>
  </NuxtLink>
</template>
