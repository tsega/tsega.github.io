<script setup lang="ts">
const props = defineProps<{
  /** The band's `id` in `content/data/photos.yml`. */
  band: string;
}>();

const { data: photos } = await useDataFile('photos');
const photo = computed(() => photos.value?.bands.find(item => item.id === props.band));

// The band's height, matching the h-[...] class below.
const BAND_HEIGHT = 'clamp(240px, 34vw, 460px)';

// object-fit: cover fills the band's fixed height, so a photo wider than
// the band is drawn wider than the screen. Tell the browser the real drawn
// width (the larger of the screen width and the height times the photo's
// aspect ratio) so it doesn't pick a file that's too small.
const sizes = computed(() => {
  const ratio = photo.value ? (photo.value.width / photo.value.height).toFixed(2) : '1';
  return `max(100vw, calc(${BAND_HEIGHT} * ${ratio}))`;
});

// Placeholders are single SVG files, not `bun run image` output.
const placeholderSrc = computed(() => photo.value?.image.endsWith('.svg')
  ? `/images/${photo.value.image}`
  : undefined);
</script>

<template>
  <figure
    v-if="photo"
    :data-theme="photo.theme"
    class="border-b-2 border-border"
  >
    <div class="h-[clamp(15rem,34vw,28.75rem)]">
      <img
        v-if="placeholderSrc"
        :src="placeholderSrc"
        :alt="photo.alt"
        :width="photo.width"
        :height="photo.height"
        loading="lazy"
        decoding="async"
        class="size-full object-cover"
      >
      <ResponsivePicture
        v-else
        :name="photo.image"
        :widths="photo.widths ?? []"
        :sizes="sizes"
        :alt="photo.alt"
        :width="photo.width"
        :height="photo.height"
        img-class="size-full object-cover"
        class="block size-full"
      />
    </div>
    <figcaption class="page-width flex flex-wrap justify-between gap-4 py-3 text-[11px] font-semibold tracking-[0.14em] text-text-muted uppercase">
      <span
        v-for="line in photo.caption"
        :key="line"
      >{{ line }}</span>
    </figcaption>
  </figure>
</template>
