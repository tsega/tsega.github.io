<script setup lang="ts">
const { data: sections } = await useDataFile('sections');
const { data: profile } = await useDataFile('profile');

const head = computed(() => sections.value?.about);
const about = computed(() => profile.value?.about);

// The columns are at least 300px and share 1104px with two 48px gaps:
// three columns (336px) from about 1092px, two from about 704px.
const HEADSHOT_SIZES = '(min-width: 1092px) 336px, (min-width: 704px) 46vw, 92vw';
</script>

<template>
  <section
    id="about"
    aria-labelledby="about-heading"
    class="border-b-2 border-border"
  >
    <div class="page-width py-[clamp(4rem,8vw,6.5rem)]">
      <SectionHead
        v-if="head"
        :eyebrow="head.eyebrow"
        :heading="head.heading"
        :sheet="head.sheet"
        heading-id="about-heading"
      />
      <div
        v-if="about"
        class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-12"
      >
        <figure>
          <ResponsivePicture
            :name="about.headshot.image"
            :widths="about.headshot.widths ?? []"
            :sizes="HEADSHOT_SIZES"
            :alt="about.headshot.alt"
            :width="640"
            :height="800"
            class="block aspect-[4/5] border-2 border-border"
            img-class="size-full object-cover"
          />
          <figcaption class="mt-2.5 flex justify-between gap-4 text-[11px] font-semibold tracking-[0.12em] text-text-muted uppercase">
            <span
              v-for="line in about.headshot.caption"
              :key="line"
            >{{ line }}</span>
          </figcaption>
        </figure>

        <div class="flex flex-col gap-7">
          <p class="text-[19px] leading-normal text-pretty">
            {{ about.intro }}
          </p>
          <dl class="border-t border-border-subtle">
            <LabelRow
              v-for="fact in about.facts"
              :key="fact.label"
              :label="fact.label"
            >
              <span class="block text-[15px] leading-normal">{{ fact.value }}</span>
            </LabelRow>
          </dl>
        </div>

        <ul class="border-2 border-border-strong">
          <li
            v-for="highlight in about.highlights"
            :key="highlight.title"
            class="border-b border-border-subtle px-6 py-[22px] last:border-b-0"
          >
            <p class="text-[40px] leading-none font-extrabold tracking-[-0.02em] text-accent">
              {{ highlight.value }}
            </p>
            <p class="mt-2 text-[15px] font-semibold text-heading">
              {{ highlight.title }}
            </p>
            <p class="mt-0.5 text-[13px] text-text-muted">
              {{ highlight.detail }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
