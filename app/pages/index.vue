<script setup lang="ts">
// Sections in design order.
const { site } = await useSite();
const { data: profile } = await useDataFile('profile');
const { data: links } = await useDataFile('links');

await usePageSeo(() => site.value && {
  title: site.value.seo.title,
  description: site.value.seo.description,
  fullTitle: true
});

const person = computed(() => {
  if (!site.value || !profile.value) {
    return undefined;
  }
  return personLd({
    name: site.value.fullName,
    alternateName: site.value.name,
    jobTitle: profile.value.hero.role,
    url: site.value.url,
    image: `${site.value.url}/images/${profile.value.about.headshot.image}-640.jpg`,
    sameAs: (links.value?.links ?? [])
      .map(link => link.href)
      .filter(href => href.startsWith('https://'))
  });
});

useHead({
  script: () => (person.value ? [jsonLdScript(person.value)] : [])
});
</script>

<template>
  <div>
    <HomeHero />
    <HomeStats />
    <HomePhotoBand band="addis" />
    <HomeAbout />
    <HomeWriting />
    <HomePhotoBand band="babogaya" />
    <HomeWork />
    <HomeCommunity />
    <HomePhotoBand band="almadies" />
    <HomeSkills />
    <HomeExperience />
    <HomePhotoBand band="after-hours" />
  </div>
</template>
