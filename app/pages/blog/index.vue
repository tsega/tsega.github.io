<script setup lang="ts">
const { data: sections } = await useDataFile('sections');
const { posts } = await useLatestPosts();

const page = computed(() => sections.value?.blog);
const subscribe = computed(() => sections.value?.writing.subscribe);

await usePageSeo(() => page.value && {
  title: page.value.title,
  description: page.value.description
});
</script>

<template>
  <section
    data-theme="forest"
    class="border-b-2 border-border bg-bg"
  >
    <div
      v-if="page"
      class="page-width py-[clamp(4rem,8vw,6.5rem)]"
    >
      <SectionHead
        :eyebrow="page.eyebrow"
        :heading="page.heading"
        :sheet="page.sheet"
        level="h1"
      />
      <div class="border-2 border-border">
        <ol v-if="posts?.length">
          <li
            v-for="post in posts"
            :key="post.path"
          >
            <BlogPostRow :post="post" />
          </li>
        </ol>
        <div
          v-else
          class="flex min-h-[200px] items-center border-b border-border-subtle bg-bg-sunken px-7 py-10"
        >
          <p class="text-[clamp(1.625rem,3vw,2.25rem)] leading-[1.12] font-extrabold tracking-[-0.015em] text-heading">
            {{ page.empty }}
          </p>
        </div>
        <HomeWritingSubscribe
          v-if="subscribe"
          :subscribe="subscribe"
        />
      </div>
    </div>
  </section>
</template>
