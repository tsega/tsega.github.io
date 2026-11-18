<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content';

const props = defineProps<{
  /** One `flagship` entry from `content/data/projects.yml`. */
  project: ProjectsCollectionItem['flagship'][number];
}>();

const rows = computed(() => [
  {
    label: 'Brief',
    value: props.project.brief
  },
  {
    label: 'Structure',
    value: props.project.structure
  },
  {
    label: 'Result',
    value: props.project.result
  }
]);

const kicker = computed(() => `${props.project.number} · ${props.project.context}`);
const stack = computed(() => props.project.stack.join(' · '));
</script>

<template>
  <article class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-10">
    <div>
      <div class="tech-panel flex aspect-[16/10] flex-col items-center justify-center gap-5 border-2 border-border bg-bg-sunken p-6 text-center">
        <TechLogo
          :name="project.tech.logo"
          class="size-[clamp(4rem,9vw,6.5rem)] text-accent"
        />
        <p class="flex flex-col gap-1.5">
          <span class="text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold tracking-[-0.015em] text-heading">
            {{ project.tech.name }}
          </span>
          <span class="text-[11px] font-semibold tracking-[0.14em] text-text-muted uppercase">
            Built with
          </span>
        </p>
      </div>
      <p class="mt-2.5 flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">
        <span
          aria-hidden="true"
          class="h-2.5 w-px bg-accent"
        />
        <span
          aria-hidden="true"
          class="h-px flex-1 bg-accent"
        />
        <span>{{ project.metric }}</span>
        <span
          aria-hidden="true"
          class="h-px flex-1 bg-accent"
        />
        <span
          aria-hidden="true"
          class="h-2.5 w-px bg-accent"
        />
      </p>
    </div>
    <div>
      <p class="text-[11px] font-semibold tracking-[0.14em] text-text-muted uppercase">
        {{ kicker }}
      </p>
      <h3 class="mt-2.5 text-[clamp(1.75rem,3vw,2.375rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-heading">
        {{ project.title }}
      </h3>
      <dl class="mt-6 border-t-2 border-border">
        <LabelRow
          v-for="row in rows"
          :key="row.label"
          :label="row.label"
          label-width="lg"
          accent
        >
          <span class="block text-[15px] leading-[1.55]">{{ row.value }}</span>
        </LabelRow>
      </dl>
      <p class="mt-4 text-[13px] text-text-muted">
        {{ stack }}
      </p>
    </div>
  </article>
</template>

<style scoped>
/* The design's 24px drawing grid, in the accent at 8%. */
.tech-panel {
  --grid-line: color-mix(in srgb, var(--color-accent) 8%, transparent);

  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 24px 24px;
}
</style>
