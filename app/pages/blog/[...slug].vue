<script setup lang="ts">
const route = useRoute();
const { data: sections } = await useDataFile('sections');
const { site } = await useSite();

// Drafts are only published in dev; in the generated site they 404.
const { data: post } = await useAsyncData(`post-${route.path}`, () => {
  const query = queryCollection('blog').path(route.path);
  return import.meta.dev ? query.first() : query.where('draft', '=', false).first();
});

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found',
    fatal: true
  });
}

// Ordered newest first, so the item before this one is the newer post.
const { data: surroundings } = await useAsyncData(`post-surround-${route.path}`, () => {
  const query = queryCollectionItemSurroundings('blog', route.path, { fields: ['description'] })
    .order('date', 'DESC');
  return import.meta.dev ? query : query.where('draft', '=', false);
});

const labels = computed(() => sections.value?.blog.post);
const newer = computed(() => surroundings.value?.[0]);
const older = computed(() => surroundings.value?.[1]);

await usePageSeo(() => post.value && {
  title: post.value.title,
  description: post.value.description,
  image: post.value.cover,
  imageAlt: post.value.cover ? post.value.coverAlt : undefined,
  type: 'article'
});

useSeoMeta({
  articlePublishedTime: () => post.value && isoDate(post.value.date),
  articleSection: () => post.value?.category,
  articleTag: () => post.value?.tags
});

const posting = computed(() => {
  if (!post.value || !site.value) {
    return undefined;
  }
  const url = `${site.value.url}${post.value.path}`;
  const image = `${site.value.url}${post.value.cover ?? site.value.seo.image}`;
  return blogPostingLd(post.value, url, image, {
    '@type': 'Person',
    'name': site.value.fullName,
    'url': site.value.url
  });
});

useHead({
  script: () => (posting.value ? [jsonLdScript(posting.value)] : [])
});
</script>

<template>
  <div
    v-if="post && labels"
    class="page-width py-[clamp(3rem,7vw,5.5rem)]"
  >
    <article class="max-w-[48rem]">
      <BlogPostHeader
        :post="post"
        :back="labels.back"
        :minutes="labels.minutes"
        :tags-label="labels.tags"
      />
      <ContentRenderer
        :value="post"
        class="prose prose-site mt-12 max-w-none"
      />
      <BlogPostNav
        :newer="newer"
        :older="older"
        :newer-label="labels.newer"
        :older-label="labels.older"
      />
    </article>
  </div>
</template>
