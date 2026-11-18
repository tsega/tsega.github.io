<script setup lang="ts">
// Replaces Nuxt Content's code block so that wide code, which scrolls
// sideways, can be reached and scrolled with the keyboard.
defineProps<{
  /** Highlighter classes, e.g. "language-ts shiki". */
  class?: string;
  /** Language of the code, used to name the block for screen readers. */
  language?: string | null;
}>();
</script>

<template>
  <pre
    :class="$props.class"
    tabindex="0"
    :aria-label="language ? `Code: ${language}` : 'Code'"
  ><slot /></pre>
</template>

<style>
pre code .line {
  display: block;
}
</style>
