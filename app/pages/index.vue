<script setup lang="ts">
// Placeholder until the homepage sections land (#5 to #9, #13).
const { site } = await useSite();
</script>

<template>
  <section class="page-width py-24">
    <h1 class="font-script text-[clamp(3.25rem,7.4vw,6rem)] leading-[1.1] text-heading">
      {{ site?.fullName }}
    </h1>
  </section>
</template>
