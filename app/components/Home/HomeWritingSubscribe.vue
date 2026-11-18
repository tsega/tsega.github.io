<script setup lang="ts">
defineProps<{
  /** The `writing.subscribe` block from `content/data/sections.yml`. */
  subscribe: {
    /** Prompt on the left, e.g. "New posts by email". */
    text: string;
    /** Button label. */
    label: string;
    /** Where the button goes: the RSS feed for now, a newsletter later. */
    href: string;
  };
}>();
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4 bg-bg-sunken px-7 py-5">
    <p class="text-sm text-text">
      {{ subscribe.text }}
    </p>
    <a
      :href="subscribe.href"
      class="flex justify-between gap-7 bg-accent px-3.5 py-2.5 text-[13px] font-bold text-on-accent hover:bg-accent-bright hover:text-on-accent"
    >
      <span>{{ subscribe.label }}</span>
      <span aria-hidden="true">→</span>
    </a>
  </div>
</template>
