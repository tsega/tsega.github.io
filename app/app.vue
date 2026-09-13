<script setup>
const { data: posts } = await useAsyncData('blog-text', () => queryCollection('blog').all() )
</script>

<template>
  <ul>
    <li
      v-for="post in posts"
      :keys="posts.path"
      class="text-3xl font-bold"
    >
      {{ post.title }} - {{ post.date }}
    </li>
  </ul>
</template>
