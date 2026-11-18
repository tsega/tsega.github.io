<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** A path, an in-page anchor such as `/#work`, or an external URL. */
  to: string;
  /** `sm` for tight spots such as the Writing subscribe bar. */
  size?: 'md' | 'sm';
}>(), {
  size: 'md'
});

const sizeClass = computed(() => props.size === 'sm'
  ? 'gap-7 px-3.5 py-2.5 text-[13px]'
  : 'min-w-[260px] gap-12 px-5 py-4 text-[15px]');
</script>

<template>
  <NuxtLink
    :to="to"
    class="flex items-center justify-between bg-accent font-bold text-on-accent hover:bg-accent-bright hover:text-on-accent active:bg-accent-pressed"
    :class="sizeClass"
  >
    <span><slot /></span>
    <span aria-hidden="true">→</span>
  </NuxtLink>
</template>
