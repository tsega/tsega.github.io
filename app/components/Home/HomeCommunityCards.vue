<script setup lang="ts">
import type { CommunityCollectionItem } from '@nuxt/content';

defineProps<{
  /** The `cards` list from `content/data/community.yml`. */
  cards: CommunityCollectionItem['cards'];
}>();

// Each card draws its right and bottom rule and the list draws the top and
// left, so the 2px grid stays closed however the cards wrap.
</script>

<template>
  <ul class="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] border-t-2 border-l-2 border-border">
    <li
      v-for="card in cards"
      :key="card.kicker"
      class="flex flex-col gap-3.5 border-r-2 border-b-2 border-border p-7"
    >
      <p class="text-[11px] font-bold tracking-[0.14em] uppercase">
        {{ card.kicker }}
      </p>
      <h3 class="text-2xl leading-[1.1] font-extrabold tracking-[-0.01em]">
        {{ card.title }}
      </h3>
      <p class="text-[15px] leading-[1.55]">
        {{ card.text }}
      </p>
    </li>
  </ul>
</template>
