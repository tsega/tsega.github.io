<script setup lang="ts">
const { data: profile } = await useDataFile('profile');
const hero = computed(() => profile.value?.hero);
</script>

<template>
  <section
    id="top"
    aria-labelledby="hero-name"
    class="relative overflow-hidden border-b-2 border-border"
  >
    <div
      aria-hidden="true"
      class="blueprint pointer-events-none absolute inset-0"
    />
    <div
      v-if="hero"
      class="page-width relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-14 pt-[clamp(3.5rem,9vw,7rem)] pb-[clamp(3rem,7vw,5rem)]"
    >
      <div>
        <p class="mb-7 flex items-center gap-3 text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
          <span>{{ hero.code }}</span>
          <span
            aria-hidden="true"
            class="h-px w-10 bg-accent"
          />
          <span>{{ hero.role }}</span>
        </p>
        <h1
          id="hero-name"
          class="font-script text-[clamp(3.25rem,7.4vw,6rem)] leading-[1.1] font-normal text-balance text-heading"
        >
          {{ hero.name }}
        </h1>
        <p class="mt-7 flex flex-wrap gap-x-[18px] text-[clamp(1.75rem,3.4vw,2.625rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-heading">
          <!-- The trailing space keeps the words apart for screen readers. -->
          <span
            v-for="word in hero.motto"
            :key="word"
          >{{ word }}<span class="text-accent">.</span> </span>
        </p>
        <p class="mt-4 max-w-[520px] text-lg leading-normal text-pretty text-text-muted">
          {{ hero.sub }}
        </p>
        <div class="mt-10 flex flex-wrap items-center gap-7">
          <ArrowButton :to="hero.primary.href">
            {{ hero.primary.label }}
          </ArrowButton>
          <NuxtLink
            :to="hero.secondary.href"
            class="border-b border-border-strong pb-0.5 text-sm font-semibold text-text-muted hover:border-accent hover:text-accent"
          >
            {{ hero.secondary.label }}
          </NuxtLink>
        </div>
      </div>
      <dl class="border-2 border-border-strong bg-bg text-[15px]">
        <LabelRow
          v-for="row in hero.card"
          :key="row.label"
          :label="row.label"
          variant="card"
        >
          <a
            v-if="row.href"
            :href="row.href"
            class="font-semibold wrap-anywhere text-accent hover:text-accent-bright"
          >{{ row.value }}</a>
          <span
            v-else
            class="font-semibold text-heading"
          >{{ row.value }}</span>
        </LabelRow>
      </dl>
    </div>
  </section>
</template>
