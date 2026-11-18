<script setup lang="ts">
const { data: sections } = await useDataFile('sections');
const { data: community } = await useDataFile('community');

const head = computed(() => sections.value?.community);

// Two columns (photo, timeline) of at least 340px from about 765px wide.
const PHOTO_SIZES = '(min-width: 1200px) 540px, (min-width: 765px) calc(46vw - 12px), 92vw';
</script>

<template>
  <section
    id="community"
    data-theme="gold"
    aria-labelledby="community-heading"
    class="border-b-2 border-border bg-bg text-text"
  >
    <div class="page-width py-[clamp(4rem,8vw,6.5rem)]">
      <SectionHead
        v-if="head"
        :eyebrow="head.eyebrow"
        :sheet="head.sheet"
      />
      <template v-if="community">
        <h2
          id="community-heading"
          class="max-w-[960px] text-[clamp(2.125rem,5vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.025em] text-balance"
        >
          {{ community.statement }}
        </h2>

        <HomeCommunityCards :cards="community.cards" />

        <div class="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-6">
          <div class="relative min-h-[260px] md:aspect-[3/2] border-2 border-border">
            <ResponsivePicture
              :name="community.photo.image"
              :widths="community.photo.widths ?? []"
              :sizes="PHOTO_SIZES"
              :alt="community.photo.alt"
              :width="1080"
              :height="810"
              class="absolute inset-0"
              img-class="size-full object-cover"
            />
          </div>
          <ol class="flex flex-col justify-end border-t-2 border-border">
            <li
              v-for="entry in community.timeline"
              :key="entry.year + entry.text"
              class="grid grid-cols-[72px_minmax(0,1fr)] gap-4 border-b border-border py-3.5"
            >
              <span class="font-extrabold">{{ entry.year }}</span>
              <span class="text-[15px]">{{ entry.text }}</span>
            </li>
          </ol>
        </div>
      </template>
    </div>
  </section>
</template>
