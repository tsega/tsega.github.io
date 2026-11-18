<script setup lang="ts">
const { data: sections } = await useDataFile('sections');
const { data: experience } = await useDataFile('experience');
const { data: education } = await useDataFile('education');

const head = computed(() => sections.value?.experience);
</script>

<template>
  <section
    id="experience"
    aria-labelledby="experience-heading"
    class="border-b-2 border-border"
  >
    <div class="page-width py-[clamp(4rem,8vw,6.5rem)]">
      <SectionHead
        v-if="head"
        :eyebrow="head.eyebrow"
        :heading="head.heading"
        :sheet="head.sheet"
        heading-id="experience-heading"
        tight
      />
      <TimelineList
        v-if="experience"
        :items="experience.items"
      />
      <template v-if="education">
        <h3 class="mt-[72px] border-b-2 border-border pb-3 text-xl font-bold text-heading">
          {{ education.heading }}
        </h3>
        <TimelineList
          :items="education.items"
          variant="compact"
        />
      </template>
    </div>
  </section>
</template>
