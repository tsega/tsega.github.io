<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

const props = withDefaults(defineProps<{
  /** A post from the blog collection. */
  post: BlogCollectionItem;
  /** The large card on the left of the Writing section. */
  featured?: boolean;
  /** Label of the featured card's footer link, e.g. "Read the post". */
  readMore?: string;
}>(), {
  featured: false,
  readMore: undefined
});

const linkClass = computed(() => props.featured
  ? 'justify-between gap-12 bg-bg-sunken p-[clamp(1.75rem,3vw,2.5rem)] hover:bg-bg-elevated md:min-h-[340px]'
  : 'gap-3 border-b border-border-subtle p-7 hover:bg-bg-hover');

const titleClass = computed(() => props.featured
  ? 'mt-[18px] text-[clamp(1.625rem,3vw,2.25rem)] leading-[1.12] font-extrabold tracking-[-0.015em]'
  : 'text-[21px] leading-tight font-bold');
</script>

<template>
  <NuxtLink
    :to="post.path"
    class="flex flex-col text-heading hover:text-heading"
    :class="linkClass"
  >
    <div :class="featured ? '' : 'flex flex-col gap-3'">
      <p class="flex gap-4 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">
        <span>{{ post.category }}</span>
        <span
          v-if="featured && post.format"
          class="text-text-muted"
        >{{ post.format }}</span>
      </p>
      <h3
        class="text-balance"
        :class="titleClass"
      >
        {{ post.title }}
      </h3>
      <p
        class="leading-[1.55] text-text-muted"
        :class="featured ? 'mt-4 max-w-[480px]' : 'text-sm'"
      >
        {{ post.description }}
      </p>
    </div>
    <p
      v-if="featured && readMore"
      class="flex items-center justify-between border-t border-border-subtle pt-4 text-[13px] font-semibold text-accent"
    >
      <span>{{ readMore }}</span>
      <span aria-hidden="true">→</span>
    </p>
  </NuxtLink>
</template>
