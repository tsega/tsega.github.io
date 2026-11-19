<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{
  /** The error Nuxt caught; a 404 for unknown paths and missing posts. */
  error: NuxtError;
}>();
</script>

<template>
  <NuxtLayout>
    <ErrorSheet :status-code="error.statusCode ?? 500" />
  </NuxtLayout>
</template>
