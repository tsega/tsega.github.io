<script setup lang="ts">
const { data: profile } = await useDataFile('profile');
const stats = computed(() => profile.value?.stats ?? []);
</script>

<template>
  <section class="border-b-2 border-border bg-bg-elevated">
    <ul class="mx-auto grid max-w-[75rem] grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
      <li
        v-for="stat in stats"
        :key="stat.label"
        class="border-r border-border-subtle px-[clamp(1.25rem,3vw,2rem)] py-7 last:border-r-0"
      >
        <p class="text-4xl font-extrabold tracking-[-0.02em] text-accent">
          {{ stat.value }}
        </p>
        <p class="mt-1.5 text-xs font-semibold tracking-[0.08em] text-text-muted uppercase">
          {{ stat.label }}
        </p>
      </li>
    </ul>
  </section>
</template>
