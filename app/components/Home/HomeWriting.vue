<script setup lang="ts">
const { data: sections } = await useDataFile('sections');
const { posts } = await useLatestPosts(3);

const head = computed(() => sections.value?.writing);
const featured = computed(() => posts.value?.[0]);
const others = computed(() => posts.value?.slice(1) ?? []);
</script>

<template>
  <section
    id="writing"
    data-theme="forest"
    aria-labelledby="writing-heading"
    class="border-b-2 border-border bg-bg"
  >
    <div
      v-if="head"
      class="page-width py-[clamp(4rem,8vw,6.5rem)]"
    >
      <SectionHead
        :eyebrow="head.eyebrow"
        :heading="head.heading"
        :sheet="head.sheet"
        heading-id="writing-heading"
      />
      <div
        class="grid border-2 border-border"
        :class="{ 'md:grid-cols-2': featured }"
      >
        <HomePostCard
          v-if="featured"
          :post="featured"
          :read-more="head.readMore"
          featured
          class="border-b-2 border-border md:border-r-2 md:border-b-0"
        />
        <div
          v-else
          class="flex min-h-[200px] items-center border-b border-border-subtle bg-bg-sunken px-7 py-10"
        >
          <p class="text-[clamp(1.625rem,3vw,2.25rem)] leading-[1.12] font-extrabold tracking-[-0.015em] text-heading">
            {{ head.empty }}
          </p>
        </div>
        <div class="flex flex-col justify-end">
          <HomePostCard
            v-for="post in others"
            :key="post.path"
            :post="post"
            class="flex-1"
          />
          <HomeWritingSubscribe :subscribe="head.subscribe" />
        </div>
      </div>
    </div>
  </section>
</template>
