<script setup lang="ts">
// Prerendered and written out as 404.html (see the prerender hook in
// nuxt.config.ts), so GitHub Pages serves a complete page for unknown paths
// instead of Nuxt's empty client-only shell.
</script>

<template>
  <ErrorSheet :status-code="404" />
</template>
