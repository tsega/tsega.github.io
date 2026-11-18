<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content';

defineProps<{
  /** The `furtherWork` block from `content/data/projects.yml`. */
  work: ProjectsCollectionItem['furtherWork'];
}>();
</script>

<template>
  <div class="mt-[88px]">
    <div class="flex items-baseline justify-between gap-4 border-b-2 border-border pb-3">
      <h3 class="text-xl font-bold text-heading">
        {{ work.heading }}
      </h3>
      <p class="text-[11px] font-semibold tracking-[0.14em] text-text-muted uppercase">
        {{ work.label }}
      </p>
    </div>
    <ul>
      <li
        v-for="item in work.items"
        :key="item.name"
        class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] items-baseline gap-x-6 gap-y-2 border-b border-border-subtle py-4"
      >
        <p class="font-bold text-heading">
          {{ item.name }}
        </p>
        <p class="col-span-2 text-sm leading-normal text-text-muted max-[30rem]:col-span-1">
          {{ item.desc }}
        </p>
        <p class="text-xs font-semibold tracking-[0.06em] text-accent uppercase">
          {{ item.metric }}
        </p>
      </li>
    </ul>
  </div>
</template>
