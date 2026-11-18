<script setup lang="ts">
const { data: sections } = await useDataFile('sections');
const { data: skills } = await useDataFile('skills');

const head = computed(() => sections.value?.skills);
</script>

<template>
  <section
    id="skills"
    aria-labelledby="skills-heading"
    class="border-b-2 border-border"
  >
    <div class="page-width py-[clamp(4rem,8vw,6.5rem)]">
      <SectionHead
        v-if="head"
        :eyebrow="head.eyebrow"
        :heading="head.heading"
        :sheet="head.sheet"
        heading-id="skills-heading"
      />
      <div
        v-if="skills"
        class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-x-8 gap-y-10"
      >
        <div
          v-for="group in skills.groups"
          :key="group.title"
        >
          <h3 class="border-b-2 border-accent pb-2.5 text-[13px] font-bold tracking-[0.08em] text-accent uppercase">
            {{ group.title }}
          </h3>
          <ul>
            <li
              v-for="skill in group.items"
              :key="skill.name"
              class="flex flex-col gap-[3px] border-b border-border-subtle py-3"
            >
              <span class="text-[15px] font-semibold text-heading">{{ skill.name }}</span>
              <span class="text-xs leading-[1.45] text-text-muted">{{ skill.used }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
