<script setup lang="ts">
const { data: sections } = await useDataFile('sections');
const { data: projects } = await useDataFile('projects');

const head = computed(() => sections.value?.work);
</script>

<template>
  <section
    id="work"
    aria-labelledby="work-heading"
    class="border-b-2 border-border"
  >
    <div class="page-width py-[clamp(4rem,8vw,6.5rem)]">
      <SectionHead
        v-if="head"
        :eyebrow="head.eyebrow"
        :heading="head.heading"
        :sheet="head.sheet"
        heading-id="work-heading"
        spacing="lg"
      />
      <template v-if="projects">
        <div class="flex flex-col gap-[72px]">
          <HomeFlagshipProject
            v-for="project in projects.flagship"
            :key="project.number"
            :project="project"
          />
        </div>
        <HomeFurtherWork :work="projects.furtherWork" />
      </template>
    </div>
  </section>
</template>
