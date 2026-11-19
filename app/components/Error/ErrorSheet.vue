<script setup lang="ts">
const props = defineProps<{
  /** HTTP status: 404 gets the "sheet missing" copy, others the general one. */
  statusCode: number;
}>();

const { data: sections } = await useDataFile('sections');

const labels = computed(() => sections.value?.error);
const copy = computed(() => props.statusCode === 404
  ? labels.value?.notFound
  : labels.value?.other);

// Error pages stay out of search results and have no canonical URL.
useHead({
  title: () => copy.value?.title,
  meta: [{
    name: 'robots',
    content: 'noindex'
  }]
});
</script>

<template>
  <section
    aria-labelledby="error-heading"
    class="relative overflow-hidden border-b-2 border-border"
  >
    <div
      aria-hidden="true"
      class="blueprint pointer-events-none absolute inset-0"
    />
    <div
      v-if="labels && copy"
      class="page-width relative py-[clamp(4rem,10vw,8rem)]"
    >
      <SectionHead
        :eyebrow="copy.eyebrow"
        :heading="copy.heading"
        :sheet="copy.sheet"
        heading-id="error-heading"
        level="h1"
      />
      <p class="max-w-[560px] text-lg leading-normal text-pretty text-text-muted">
        {{ copy.text }}
      </p>
      <div class="mt-10 flex flex-wrap items-center gap-7">
        <ArrowButton to="/">
          {{ labels.home }}
        </ArrowButton>
        <NuxtLink
          to="/blog"
          class="border-b border-border-strong pb-0.5 text-sm font-semibold text-text-muted hover:border-accent hover:text-accent"
        >
          {{ labels.blog }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
