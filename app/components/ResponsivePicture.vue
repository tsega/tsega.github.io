<script setup lang="ts">
const props = withDefaults(defineProps<{
  /**
   * Base name given to `bun run image`; files are read from
   * `/images/<name>-<width>.avif` and `.jpg`.
   */
  name: string;
  /** Widths that were generated for this image, in pixels. */
  widths: number[];
  /** The `sizes` attribute: the image's display width at each breakpoint. */
  sizes: string;
  /** Alternative text. Pass an empty string for decorative images. */
  alt: string;
  /** Intrinsic width; with `height` it reserves space to avoid layout shift. */
  width?: number;
  /** Intrinsic height, paired with `width`. */
  height?: number;
  /** `eager` for images visible as soon as the page opens. */
  loading?: 'lazy' | 'eager';
  /** Classes for the inner `<img>`; other attributes go on `<picture>`. */
  imgClass?: string;
}>(), {
  width: undefined,
  height: undefined,
  loading: 'lazy',
  imgClass: undefined
});

const srcset = (extension: string) => props.widths
  .map(width => `/images/${props.name}-${width}.${extension} ${width}w`)
  .join(', ');

const avifSrcset = computed(() => srcset('avif'));
const jpegSrcset = computed(() => srcset('jpg'));

// Browsers without srcset support get the largest JPEG.
const fallbackSrc = computed(() => `/images/${props.name}-${Math.max(...props.widths)}.jpg`);
</script>

<template>
  <picture>
    <source
      type="image/avif"
      :srcset="avifSrcset"
      :sizes="sizes"
    >
    <img
      :src="fallbackSrc"
      :srcset="jpegSrcset"
      :sizes="sizes"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      decoding="async"
      :class="imgClass"
    >
  </picture>
</template>
