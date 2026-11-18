<script setup lang="ts">
import { techLogos, type TechLogoName } from '~/utils/tech-logos';

const props = defineProps<{
  /** Which mark to draw. It's decorative: put the name in text beside it. */
  name: TechLogoName;
}>();

const path = computed(() => techLogos[props.name]);
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="path" />
  </svg>
</template>
